import { Request, Response } from 'express';
import pool from '../config/database';
import { notifyTenantsNewProperty } from '../services/emailService';
import { AuthRequest, PropertyFilters } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAllProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      location,
      minRent,
      maxRent,
      amenities,
      bedrooms,
      property_type,
      page = 1,
      limit = 12
    } = req.query as unknown as PropertyFilters;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build query conditions
    const conditions: string[] = ['is_available = 1']; // Only show available properties
    const values: any[] = [];

    if (title) {
      conditions.push('title LIKE ?');
      values.push(`%${title}%`);
    }

    if (location) {
      conditions.push('location LIKE ?');
      values.push(`%${location}%`);
    }

    if (minRent) {
      conditions.push('rent >= ?');
      values.push(Number(minRent));
    }

    if (maxRent) {
      conditions.push('rent <= ?');
      values.push(Number(maxRent));
    }

    if (bedrooms) {
      conditions.push('bedrooms >= ?');
      values.push(Number(bedrooms));
    }

    if (property_type) {
      conditions.push('property_type = ?');
      values.push(property_type);
    }

    // Basic amenities filter (partial match on JSON string)
    if (amenities) {
      // If amenities is an array, we might process it. keeping it simple for now.
      // Assuming it might be a comma separated string or single value in query
      // For now, if provided, strict check might be hard on JSON. 
      // Skipping complex JSON filtering for this immediate fix unless critical.
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total properties for pagination
    const [countResult] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM properties ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // Fetch properties
    const [properties] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, u.name as owner_name, u.email as owner_email,
        (SELECT AVG(rating) FROM property_ratings WHERE property_id = p.id) as average_rating,
        (SELECT COUNT(*) FROM property_ratings WHERE property_id = p.id) as rating_count
       FROM properties p 
       LEFT JOIN users u ON p.owner_id = u.id 
       ${whereClause} 
       ORDER BY p.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...values, limitNum, offset]
    );

    // Parse JSON fields
    const parsedProperties = properties.map(prop => ({
      ...prop,
      amenities: typeof prop.amenities === 'string' ? JSON.parse(prop.amenities) : prop.amenities,
      photos: typeof prop.photos === 'string' ? JSON.parse(prop.photos) : prop.photos
    }));

    res.json({
      success: true,
      message: 'Properties retrieved successfully',
      data: parsedProperties,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching properties'
    });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const propertyId = parseInt(id);

    // Fetch from database
    const [properties] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone,
        (SELECT AVG(rating) FROM property_ratings WHERE property_id = p.id) as average_rating,
        (SELECT COUNT(*) FROM property_ratings WHERE property_id = p.id) as rating_count
       FROM properties p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = ?`,
      [propertyId]
    );

    if (properties.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Property not found'
      });
      return;
    }

    const property = {
      ...properties[0],
      amenities: typeof properties[0].amenities === 'string' ? JSON.parse(properties[0].amenities) : properties[0].amenities,
      photos: typeof properties[0].photos === 'string' ? JSON.parse(properties[0].photos) : properties[0].photos
    };

    res.json({
      success: true,
      message: 'Property retrieved successfully',
      data: property
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching property'
    });
  }
};

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const {
      title,
      description,
      rent,
      location,
      amenities,
      photos,
      bedrooms,
      bathrooms,
      area_sqft,
      property_type
    } = req.body;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO properties
       (owner_id, title, description, rent, location, amenities, photos, bedrooms, bathrooms, area_sqft, property_type)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ownerId,
        title,
        description || null,
        rent,
        location,
        JSON.stringify(amenities || []),
        JSON.stringify(photos || []),
        bedrooms || 1,
        bathrooms || 1,
        area_sqft || null,
        property_type || 'apartment'
      ]
    );

    const [newProperty] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM properties WHERE id = ?',
      [result.insertId]
    );

    // Get owner name for email
    const [ownerRows] = await pool.query<RowDataPacket[]>(
      'SELECT name FROM users WHERE id = ?',
      [ownerId]
    );
    const ownerName = ownerRows[0]?.name || 'Unknown Owner';

    // Fetch all tenants to notify
    const [tenants] = await pool.query<RowDataPacket[]>(
      'SELECT email FROM users WHERE role = "tenant"'
    );
    const tenantEmails = tenants.map(t => t.email);

    // Send email notification (async/non-blocking)
    notifyTenantsNewProperty(tenantEmails, newProperty[0], ownerName);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: {
        ...newProperty[0],
        amenities: amenities || [],
        photos: photos || []
      }
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating property'
    });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;
    const {
      title,
      description,
      rent,
      location,
      amenities,
      photos,
      bedrooms,
      bathrooms,
      area_sqft,
      property_type,
      is_available
    } = req.body;

    // Check ownership
    const [properties] = await pool.query<RowDataPacket[]>(
      'SELECT owner_id FROM properties WHERE id = ?',
      [id]
    );

    if (properties.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Property not found'
      });
      return;
    }

    if (properties[0].owner_id !== ownerId && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You can only update your own properties'
      });
      return;
    }

    await pool.query(
      `UPDATE properties SET
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       rent = COALESCE(?, rent),
       location = COALESCE(?, location),
       amenities = COALESCE(?, amenities),
       photos = COALESCE(?, photos),
       bedrooms = COALESCE(?, bedrooms),
       bathrooms = COALESCE(?, bathrooms),
       area_sqft = COALESCE(?, area_sqft),
       property_type = COALESCE(?, property_type),
       is_available = COALESCE(?, is_available)
       WHERE id = ?`,
      [
        title,
        description,
        rent,
        location,
        amenities ? JSON.stringify(amenities) : null,
        photos ? JSON.stringify(photos) : null,
        bedrooms,
        bathrooms,
        area_sqft,
        property_type,
        is_available,
        id
      ]
    );

    const [updatedProperty] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM properties WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: {
        ...updatedProperty[0],
        amenities: typeof updatedProperty[0].amenities === 'string' ? JSON.parse(updatedProperty[0].amenities) : updatedProperty[0].amenities,
        photos: typeof updatedProperty[0].photos === 'string' ? JSON.parse(updatedProperty[0].photos) : updatedProperty[0].photos
      }
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating property'
    });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const ownerId = req.user?.id;
    const propertyId = parseInt(id);

    // Check ownership
    const [properties] = await pool.query<RowDataPacket[]>(
      'SELECT owner_id FROM properties WHERE id = ?',
      [id]
    );

    if (properties.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Property not found'
      });
      return;
    }

    if (properties[0].owner_id !== ownerId && req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own properties'
      });
      return;
    }

    await pool.query('DELETE FROM properties WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting property'
    });
  }
};

export const getOwnerProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    const [properties] = await pool.query<RowDataPacket[]>(
      `SELECT p.*,
       (SELECT COUNT(*) FROM bookings WHERE property_id = p.id AND status = 'Pending') as pending_requests,
       (SELECT COUNT(*) FROM bookings WHERE property_id = p.id AND status = 'Approved') as approved_bookings
       FROM properties p
       WHERE p.owner_id = ?
       ORDER BY p.created_at DESC`,
      [ownerId]
    );

    const parsedProperties = properties.map(prop => ({
      ...prop,
      amenities: typeof prop.amenities === 'string' ? JSON.parse(prop.amenities) : prop.amenities,
      photos: typeof prop.photos === 'string' ? JSON.parse(prop.photos) : prop.photos
    }));

    res.json({
      success: true,
      message: 'Owner properties retrieved successfully',
      data: parsedProperties
    });
  } catch (error) {
    console.error('Get owner properties error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching properties'
    });
  }
};

