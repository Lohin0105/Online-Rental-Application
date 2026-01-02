import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * GET /api/admin/stats
 * Returns admin dashboard statistics
 */
export const getAdminStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }

        // Get total users count
        const [userCount] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM users');
        
        // Get total properties count
        const [propertyCount] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM properties');
        
        // Get total bookings count
        const [bookingCount] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM bookings');
        
        // Get active listings (available properties)
        const [activeListings] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM properties WHERE is_available = TRUE');
        
        // Get new users this month
        const [newUsersThisMonth] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM users WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())'
        );
        
        // Get new properties this month
        const [newPropertiesThisMonth] = await pool.query<RowDataPacket[]>(
            'SELECT COUNT(*) as count FROM properties WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())'
        );
        
        // Get total rent from approved bookings this month (as revenue estimate)
        const [revenueResult] = await pool.query<RowDataPacket[]>(`
            SELECT COALESCE(SUM(p.rent), 0) as revenue
            FROM bookings b
            JOIN properties p ON b.property_id = p.id
            WHERE b.status = 'Approved'
            AND MONTH(b.response_time) = MONTH(CURRENT_DATE())
            AND YEAR(b.response_time) = YEAR(CURRENT_DATE())
        `);

        const stats = {
            totalUsers: userCount[0].count,
            totalProperties: propertyCount[0].count,
            totalBookings: bookingCount[0].count,
            activeListings: activeListings[0].count,
            newUsersThisMonth: newUsersThisMonth[0].count,
            newPropertiesThisMonth: newPropertiesThisMonth[0].count,
            revenueThisMonth: revenueResult[0].revenue || 0
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Admin get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching stats'
        });
    }
};

/**
 * GET /api/admin/users
 * Returns a list of all users
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }

        const [users] = await pool.query<RowDataPacket[]>(`
            SELECT 
                u.id, 
                u.email, 
                u.name, 
                u.phone, 
                u.role, 
                u.created_at,
                (SELECT COUNT(*) FROM bookings WHERE tenant_id = u.id) as total_bookings,
                (SELECT COUNT(*) FROM properties WHERE owner_id = u.id) as total_properties
            FROM users u
            ORDER BY u.created_at DESC
        `);

        res.json({
            success: true,
            data: users,
            message: 'Users retrieved successfully'
        });
    } catch (error) {
        console.error('Admin get users error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching users'
        });
    }
};

/**
 * GET /api/admin/properties
 * Returns a list of all properties with owner info
 */
export const getAllPropertiesAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }

        const [properties] = await pool.query<RowDataPacket[]>(`
            SELECT 
                p.id, 
                p.title, 
                p.location, 
                p.rent, 
                p.bedrooms,
                p.bathrooms,
                p.property_type,
                p.is_available as status,
                p.owner_id,
                u.name as owner_name,
                p.created_at,
                (SELECT COUNT(*) FROM bookings WHERE property_id = p.id) as total_bookings
            FROM properties p
            LEFT JOIN users u ON p.owner_id = u.id
            ORDER BY p.created_at DESC
        `);

        // Transform is_available to status string
        const formattedProperties = properties.map(p => ({
            ...p,
            status: p.status ? 'available' : 'unavailable'
        }));

        res.json({
            success: true,
            data: formattedProperties,
            message: 'Properties retrieved successfully'
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
 * DELETE /api/admin/users/:id
 * Delete a user
 */
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }

        // Prevent deleting yourself
        if (req.user?.id === parseInt(id)) {
            res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
            return;
        }

        // Check if user exists
        const [existingUser] = await pool.query<RowDataPacket[]>(
            'SELECT id, role FROM users WHERE id = ?',
            [id]
        );

        if (existingUser.length === 0) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Delete the user (cascade will handle properties, bookings, etc.)
        await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Admin delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting user'
        });
    }
};

/**
 * DELETE /api/admin/properties/:id
 * Delete a property
 */
export const deletePropertyAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }

        // Check if property exists
        const [existingProperty] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM properties WHERE id = ?',
            [id]
        );

        if (existingProperty.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Property not found'
            });
            return;
        }

        // Delete the property (cascade will handle bookings, ratings, etc.)
        await pool.query<ResultSetHeader>('DELETE FROM properties WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        console.error('Admin delete property error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting property'
        });
    }
};

/**
 * PATCH /api/admin/users/:id/role
 * Update a user's role
 */
export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }

        // Validate role
        const validRoles = ['owner', 'tenant', 'admin'];
        if (!validRoles.includes(role)) {
            res.status(400).json({
                success: false,
                message: 'Invalid role. Must be one of: owner, tenant, admin'
            });
            return;
        }

        // Prevent changing your own role
        if (req.user?.id === parseInt(id)) {
            res.status(400).json({
                success: false,
                message: 'You cannot change your own role'
            });
            return;
        }

        // Check if user exists
        const [existingUser] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM users WHERE id = ?',
            [id]
        );

        if (existingUser.length === 0) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        // Update the user's role
        await pool.query<ResultSetHeader>(
            'UPDATE users SET role = ? WHERE id = ?',
            [role, id]
        );

        // Get updated user info
        const [updatedUser] = await pool.query<RowDataPacket[]>(
            'SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            message: `User role updated to ${role} successfully`,
            data: updatedUser[0]
        });
    } catch (error) {
        console.error('Admin update user role error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating user role'
        });
    }
};

/**
 * GET /api/admin/bookings
 * Returns a list of all bookings with specific columns as requested
 */
export const getAllBookingsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }

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
