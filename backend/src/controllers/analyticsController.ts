import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../types';
import { RowDataPacket } from 'mysql2';

export const getFinancialAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    // Get total revenue from approved bookings
    const [revenueData] = await pool.query<RowDataPacket[]>(
      `SELECT 
        COALESCE(SUM(p.rent * b.duration_months), 0) as totalRevenue,
        COALESCE(SUM(CASE WHEN MONTH(b.request_time) = MONTH(NOW()) THEN p.rent ELSE 0 END), 0) as monthlyRevenue
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE p.owner_id = ? AND b.status = 'Approved'`,
      [ownerId]
    );

    // Get top performing properties
    const [topProperties] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.title, 
        COALESCE(SUM(p.rent * b.duration_months), 0) as revenue,
        ROUND(COUNT(CASE WHEN b.status = 'Approved' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 0) as occupancyRate
       FROM properties p
       LEFT JOIN bookings b ON p.id = b.property_id
       WHERE p.owner_id = ?
       GROUP BY p.id, p.title
       ORDER BY revenue DESC
       LIMIT 5`,
      [ownerId]
    );

    res.json({
      success: true,
      message: 'Financial analytics retrieved successfully',
      data: {
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        monthlyRevenue: revenueData[0]?.monthlyRevenue || 0,
        pendingPayments: 0,
        monthlyBreakdown: [],
        topPerformingProperties: topProperties || []
      }
    });
  } catch (error) {
    console.error('Financial analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching financial analytics'
    });
  }
};

export const getPropertyAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    // Get property stats
    const [propertyStats] = await pool.query<RowDataPacket[]>(
      `SELECT 
        COUNT(*) as totalProperties,
        SUM(CASE WHEN is_available = 1 THEN 1 ELSE 0 END) as activeProperties,
        ROUND(AVG(rent), 0) as averageRent
       FROM properties
       WHERE owner_id = ?`,
      [ownerId]
    );

    // Get property performance
    const [propertyPerformance] = await pool.query<RowDataPacket[]>(
      `SELECT p.id, p.title,
        COALESCE(COUNT(b.id), 0) as bookings,
        COALESCE(AVG(r.rating), 0) as averageRating
       FROM properties p
       LEFT JOIN bookings b ON p.id = b.property_id
       LEFT JOIN ratings r ON p.id = r.property_id
       WHERE p.owner_id = ?
       GROUP BY p.id, p.title`,
      [ownerId]
    );

    res.json({
      success: true,
      message: 'Property analytics retrieved successfully',
      data: {
        totalProperties: propertyStats[0]?.totalProperties || 0,
        activeProperties: propertyStats[0]?.activeProperties || 0,
        occupancyRate: 0,
        averageRent: propertyStats[0]?.averageRent || 0,
        propertyPerformance: propertyPerformance || [],
        marketInsights: {
          averageMarketRent: 0,
          demandTrend: 'stable',
          competitorCount: 0
        }
      }
    });
  } catch (error) {
    console.error('Property analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching property analytics'
    });
  }
};

export const getRecentActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    // Get recent bookings as activities
    const [activities] = await pool.query<RowDataPacket[]>(
      `SELECT 
        b.id,
        CASE b.status 
          WHEN 'Pending' THEN 'booking_request'
          WHEN 'Approved' THEN 'booking_approved'
          WHEN 'Rejected' THEN 'booking_rejected'
        END as type,
        CASE b.status
          WHEN 'Pending' THEN 'New Booking Request'
          WHEN 'Approved' THEN 'Booking Approved'
          WHEN 'Rejected' THEN 'Booking Rejected'
        END as title,
        CONCAT(u.name, ' - ', p.title) as description,
        b.request_time as timestamp,
        CASE b.status
          WHEN 'Pending' THEN 'schedule'
          WHEN 'Approved' THEN 'check_circle'
          WHEN 'Rejected' THEN 'cancel'
        END as icon,
        CASE b.status
          WHEN 'Pending' THEN 'primary'
          WHEN 'Approved' THEN 'success'
          WHEN 'Rejected' THEN 'warning'
        END as color
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON b.tenant_id = u.id
       WHERE p.owner_id = ?
       ORDER BY b.request_time DESC
       LIMIT 10`,
      [ownerId]
    );

    res.json({
      success: true,
      message: 'Recent activities retrieved successfully',
      data: activities || []
    });
  } catch (error) {
    console.error('Recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching recent activities'
    });
  }
};

export const getTenantOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    // Get tenants from approved bookings
    const [tenants] = await pool.query<RowDataPacket[]>(
      `SELECT 
        u.id, u.name, u.email, u.phone,
        p.title as property,
        b.move_in_date as leaseStart,
        p.rent as monthlyRent,
        'active' as status,
        'current' as paymentStatus
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON b.tenant_id = u.id
       WHERE p.owner_id = ? AND b.status = 'Approved'
       ORDER BY b.request_time DESC`,
      [ownerId]
    );

    res.json({
      success: true,
      message: 'Tenant overview retrieved successfully',
      data: {
        activeTenants: tenants.length,
        totalTenants: tenants.length,
        tenants: tenants || [],
        upcomingRenewals: []
      }
    });
  } catch (error) {
    console.error('Tenant overview error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching tenant overview'
    });
  }
};

export const getMaintenanceOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Maintenance feature not yet implemented, return empty data
    res.json({
      success: true,
      message: 'Maintenance overview retrieved successfully',
      data: {
        pendingRequests: 0,
        inProgress: 0,
        completedThisMonth: 0,
        maintenanceRequests: []
      }
    });
  } catch (error) {
    console.error('Maintenance overview error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching maintenance overview'
    });
  }
};

export const getCalendarEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    // Get upcoming bookings as calendar events
    const [events] = await pool.query<RowDataPacket[]>(
      `SELECT 
        b.id,
        CONCAT('Booking: ', p.title) as title,
        'booking' as type,
        b.move_in_date as date,
        p.title as property,
        u.name as tenant,
        p.rent as amount,
        'upcoming' as status
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON b.tenant_id = u.id
       WHERE p.owner_id = ? AND b.status = 'Approved' AND b.move_in_date >= NOW()
       ORDER BY b.move_in_date ASC`,
      [ownerId]
    );

    res.json({
      success: true,
      message: 'Calendar events retrieved successfully',
      data: events || []
    });
  } catch (error) {
    console.error('Calendar events error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching calendar events'
    });
  }
};
