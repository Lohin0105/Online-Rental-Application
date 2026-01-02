import { Response } from 'express';
import pool from '../config/database';
import { notifyOwnerPropertyRequest, notifyTenantBookingStatus } from '../services/emailService';
import { AuthRequest } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// In-memory storage for demo bookings - REMOVED

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.id;
    const { property_id, message, move_in_date, duration_months } = req.body;

    // Check if property exists and is available
    const [properties] = await pool.query<RowDataPacket[]>(
      'SELECT id, is_available, owner_id FROM properties WHERE id = ?',
      [property_id]
    );

    if (properties.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Property not found'
      });
      return;
    }

    if (!properties[0].is_available) {
      res.status(400).json({
        success: false,
        message: 'Property is not available for booking'
      });
      return;
    }

    if (properties[0].owner_id === tenantId) {
      res.status(400).json({
        success: false,
        message: 'You cannot book your own property'
      });
      return;
    }

    // Check for existing pending booking
    const [existingBookings] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM bookings WHERE property_id = ? AND tenant_id = ? AND status = "Pending"',
      [property_id, tenantId]
    );

    if (existingBookings.length > 0) {
      res.status(400).json({
        success: false,
        message: 'You already have a pending booking request for this property'
      });
      return;
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO bookings (property_id, tenant_id, message, move_in_date, duration_months)
       VALUES (?, ?, ?, ?, ?)`,
      [property_id, tenantId, message || null, move_in_date || null, duration_months || 12]
    );

    const [newBooking] = await pool.query<RowDataPacket[]>(
      `SELECT b.*, p.title as property_title, p.location as property_location, p.rent as property_rent
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE b.id = ?`,
      [result.insertId]
    );

    // Get Owner details
    const [ownerRows] = await pool.query<RowDataPacket[]>(
      'SELECT name, email FROM users WHERE id = ?',
      [properties[0].owner_id]
    );
    const ownerName = ownerRows[0]?.name || 'Unknown Owner';
    const ownerEmail = ownerRows[0]?.email;

    // Get Tenant details
    const [tenantRows] = await pool.query<RowDataPacket[]>(
      'SELECT name FROM users WHERE id = ?',
      [tenantId]
    );
    const tenantName = tenantRows[0]?.name || 'Unknown Tenant';

    // Send email to Owner (include property metadata) and log the result
    if (ownerEmail) {
      try {
        const emailResult = await notifyOwnerPropertyRequest(
          ownerEmail,
          ownerName,
          tenantName,
          {
            title: newBooking[0].property_title,
            location: newBooking[0].property_location,
            rent: newBooking[0].property_rent,
            bookingId: result.insertId
          }
        );
        if (emailResult) {
          console.log(`Owner notification sent for booking ${result.insertId} to ${ownerEmail}`);
        } else {
          console.warn(`Owner notification failed for booking ${result.insertId} to ${ownerEmail}`);
        }
      } catch (err) {
        console.error('Error sending owner notification:', err);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      data: newBooking[0]
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating booking'
    });
  }
};

export const getTenantBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tenantId = req.user?.id;

    const [bookings] = await pool.query<RowDataPacket[]>(
      `SELECT b.*, p.title as property_title, p.location as property_location, 
       p.rent as property_rent, p.photos as property_photos,
       u.name as owner_name, u.email as owner_email, u.phone as owner_phone
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON p.owner_id = u.id
       WHERE b.tenant_id = ?
       ORDER BY b.request_time DESC`,
      [tenantId]
    );

    const parsedBookings = bookings.map(booking => ({
      ...booking,
      property_photos: typeof booking.property_photos === 'string' ? JSON.parse(booking.property_photos) : booking.property_photos
    }));

    res.json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: parsedBookings
    });
  } catch (error) {
    console.error('Get tenant bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching bookings'
    });
  }
};

export const getOwnerBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    const [bookings] = await pool.query<RowDataPacket[]>(
      `SELECT b.*, p.title as property_title, p.location as property_location, p.rent as property_rent,
       u.name as tenant_name, u.email as tenant_email, u.phone as tenant_phone
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON b.tenant_id = u.id
       WHERE p.owner_id = ?
       ORDER BY b.request_time DESC`,
      [ownerId]
    );

    res.json({
      success: true,
      message: 'Booking requests retrieved successfully',
      data: bookings
    });
  } catch (error) {
    console.error('Get owner bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching booking requests'
    });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;
    const { status, owner_notes } = req.body;

    // Verify ownership
    const [bookings] = await pool.query<RowDataPacket[]>(
      `SELECT b.id, p.owner_id
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE b.id = ?`,
      [id]
    );

    if (bookings.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    if (bookings[0].owner_id !== ownerId && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You can only update bookings for your own properties'
      });
      return;
    }

    await pool.query(
      `UPDATE bookings SET status = ?, owner_notes = ?, response_time = NOW() WHERE id = ?`,
      [status, owner_notes || null, id]
    );

    const [updatedBooking] = await pool.query<RowDataPacket[]>(
      `SELECT b.*, p.title as property_title, p.location as property_location, p.rent as property_rent, u.name as tenant_name, u.email as tenant_email
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON b.tenant_id = u.id
       WHERE b.id = ?`,
      [id]
    );

    // Get owner name for email
    const [ownerRows] = await pool.query<RowDataPacket[]>(
      'SELECT name FROM users WHERE id = ?',
      [ownerId]
    );
    const ownerName = ownerRows[0]?.name || 'Owner';

    // Send email to Tenant (include property metadata)
    if (updatedBooking[0].tenant_email) {
      await notifyTenantBookingStatus(
        updatedBooking[0].tenant_email,
        updatedBooking[0].tenant_name,
        {
          title: updatedBooking[0].property_title,
          location: updatedBooking[0].property_location,
          rent: updatedBooking[0].property_rent,
          bookingId: id
        },
        status,
        ownerName
      );
    }

    res.json({
      success: true,
      message: `Booking ${status.toLowerCase()} successfully`,
      data: updatedBooking[0]
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating booking status'
    });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tenantId = req.user?.id;

    const [bookings] = await pool.query<RowDataPacket[]>(
      'SELECT id, tenant_id, status FROM bookings WHERE id = ?',
      [id]
    );

    if (bookings.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
      return;
    }

    if (bookings[0].tenant_id !== tenantId) {
      res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
      return;
    }

    if (bookings[0].status !== 'Pending') {
      res.status(400).json({
        success: false,
        message: 'Only pending bookings can be cancelled'
      });
      return;
    }

    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while cancelling booking'
    });
  }
};

export const getBookingStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    const [stats] = await pool.query<RowDataPacket[]>(
      `SELECT
        COUNT(DISTINCT p.id) as total_properties,
        COUNT(b.id) as total_requests,
        SUM(CASE WHEN b.status = 'Pending' THEN 1 ELSE 0 END) as pending_requests,
        SUM(CASE WHEN b.status = 'Approved' THEN 1 ELSE 0 END) as approved_bookings,
        SUM(CASE WHEN b.status = 'Rejected' THEN 1 ELSE 0 END) as rejected_requests
       FROM properties p
       LEFT JOIN bookings b ON p.id = b.property_id
       WHERE p.owner_id = ?`,
      [ownerId]
    );

    res.json({
      success: true,
      message: 'Stats retrieved successfully',
      data: stats[0]
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching stats'
    });
  }
};

