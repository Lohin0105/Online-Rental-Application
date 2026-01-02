import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../types';
import { RowDataPacket } from 'mysql2';

/**
 * GET /api/admin/properties
 * Returns a list of all properties with specific columns as requested
 */
export const getAllPropertiesAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Double check admin role (redundant with middleware but for safety)
        if (req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }

        // SELECT only requested columns: id, title, rent, location, owner_id
        const [properties] = await pool.query<RowDataPacket[]>(`
            SELECT id, title, rent, location, owner_id
            FROM properties
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            message: 'Properties retrieved successfully',
            data: properties
        });
    } catch (error) {
        console.error('Admin get properties error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching properties'
        });
    }
};

/**
 * GET /api/admin/bookings
 * Returns a list of all bookings with specific columns as requested
 */
export const getAllBookingsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Double check admin role
        if (req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }

        // SELECT only requested columns: id, property_id, tenant_id, status, request_time
        const [bookings] = await pool.query<RowDataPacket[]>(`
            SELECT id, property_id, tenant_id, status, request_time
            FROM bookings
            ORDER BY request_time DESC
        `);

        res.json({
            success: true,
            message: 'Bookings retrieved successfully',
            data: bookings
        });
    } catch (error) {
        console.error('Admin get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching bookings'
        });
    }
};

