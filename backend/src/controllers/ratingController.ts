import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

/**
 * Submit or update a property rating.
 * Verified: Only if an 'Approved' booking exists.
 */
export const submitPropertyRating = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tenantId = req.user?.id;
        const { propertyId, rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            res.status(400).json({ success: false, message: 'Invalid rating. Must be between 1 and 5.' });
            return;
        }

        // 1. Verify 'Approved' booking exists
        const [bookings] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM bookings WHERE property_id = ? AND tenant_id = ? AND status = "Approved"',
            [propertyId, tenantId]
        );

        if (bookings.length === 0) {
            res.status(403).json({
                success: false,
                message: 'You can only rate properties where you have an approved booking.'
            });
            return;
        }

        // 2. Upsert rating (using ON DUPLICATE KEY UPDATE from the unique index)
        await pool.query(
            `INSERT INTO property_ratings (property_id, tenant_id, rating, comment)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), updated_at = CURRENT_TIMESTAMP`,
            [propertyId, tenantId, rating, comment || null]
        );

        res.json({ success: true, message: 'Property rating submitted successfully.' });
    } catch (error) {
        console.error('Submit property rating error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while submitting rating.' });
    }
};

/**
 * Submit or update a user rating (Tenant rating Owner or Owner rating Tenant).
 * Verified: Only if an 'Approved' booking exists between them.
 */
export const submitUserRating = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const reviewerId = req.user?.id;
        const { targetUserId, rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            res.status(400).json({ success: false, message: 'Invalid rating. Must be between 1 and 5.' });
            return;
        }

        if (reviewerId === targetUserId) {
            res.status(400).json({ success: false, message: 'You cannot rate yourself.' });
            return;
        }

        // 1. Verify 'Approved' booking exists between users
        // We check both directions: reviewer as tenant/target as owner, OR reviewer as owner/target as tenant
        const [bookings] = await pool.query<RowDataPacket[]>(
            `SELECT b.id FROM bookings b
       JOIN properties p ON b.property_id = p.id
       WHERE b.status = "Approved" AND (
         (b.tenant_id = ? AND p.owner_id = ?) OR
         (b.tenant_id = ? AND p.owner_id = ?)
       )`,
            [reviewerId, targetUserId, targetUserId, reviewerId]
        );

        if (bookings.length === 0 && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'You can only rate users with whom you have a shared approved booking.'
            });
            return;
        }

        // 2. Upsert rating
        await pool.query(
            `INSERT INTO user_ratings (reviewer_id, target_user_id, rating, comment)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), updated_at = CURRENT_TIMESTAMP`,
            [reviewerId, targetUserId, rating, comment || null]
        );

        res.json({ success: true, message: 'User rating submitted successfully.' });
    } catch (error) {
        console.error('Submit user rating error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while submitting rating.' });
    }
};

/**
 * Get real-time property rating summary and individual reviews.
 */
export const getPropertyRatings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { propertyId } = req.params;

        // Aggregation query
        const [summary] = await pool.query<RowDataPacket[]>(
            `SELECT AVG(rating) as average_rating, COUNT(*) as rating_count
       FROM property_ratings
       WHERE property_id = ?`,
            [propertyId]
        );

        // Individual reviews with reviewer metadata
        const [reviews] = await pool.query<RowDataPacket[]>(
            `SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
       FROM property_ratings r
       JOIN users u ON r.tenant_id = u.id
       WHERE r.property_id = ?
       ORDER BY r.created_at DESC`,
            [propertyId]
        );

        res.json({
            success: true,
            data: {
                summary: {
                    average_rating: parseFloat(summary[0]?.average_rating || 0).toFixed(1),
                    rating_count: summary[0]?.rating_count || 0
                },
                reviews
            }
        });
    } catch (error) {
        console.error('Get property ratings error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching ratings.' });
    }
};

/**
 * Get real-time user rating summary and reviews.
 */
export const getUserRatings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const [summary] = await pool.query<RowDataPacket[]>(
            `SELECT AVG(rating) as average_rating, COUNT(*) as rating_count
       FROM user_ratings
       WHERE target_user_id = ?`,
            [userId]
        );

        const [reviews] = await pool.query<RowDataPacket[]>(
            `SELECT r.*, u.name as reviewer_name, u.avatar as reviewer_avatar
       FROM user_ratings r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.target_user_id = ?
       ORDER BY r.created_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            data: {
                summary: {
                    average_rating: parseFloat(summary[0]?.average_rating || 0).toFixed(1),
                    rating_count: summary[0]?.rating_count || 0
                },
                reviews
            }
        });
    } catch (error) {
        console.error('Get user ratings error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching ratings.' });
    }
};
