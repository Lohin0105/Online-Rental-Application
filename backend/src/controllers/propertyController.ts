import { Request, Response } from 'express';
import pool from '../config/database';
import { notifyTenantsNewProperty } from '../services/emailService';
import { AuthRequest, PropertyFilters } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// In-memory storage for demo created properties
let demoCreatedProperties: any[] = [];

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
      message: 'An error occurred while fetching properties',
      errors: [{ message: error instanceof Error ? error.message : String(error) }]
    });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const propertyId = parseInt(id);

    // Demo properties for when database is not available
    const demoProperties = [
      {
        id: 1,
        owner_id: 999,
        title: 'Modern Downtown Apartment',
        description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views. This spacious apartment features modern amenities including a fully equipped kitchen, in-unit laundry, and floor-to-ceiling windows overlooking the city skyline. Perfect for young professionals or couples looking for urban living.',
        rent: 2500,
        location: 'Downtown, City Center',
        amenities: ['WiFi', 'Parking', 'Gym', 'Pool', 'In-unit Laundry', 'Dishwasher', 'Balcony'],
        photos: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ],
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1200,
        property_type: 'apartment',
        is_available: true,
        created_at: '2024-01-15T10:00:00.000Z',
        updated_at: '2024-01-15T10:00:00.000Z',
        owner_name: 'Demo Owner',
        owner_email: 'owner@demo.com',
        owner_phone: '+1-555-0100'
      },
      {
        id: 2,
        owner_id: 999,
        title: 'Cozy Studio Near University',
        description: 'Perfect for students - close to university with all amenities nearby. This charming studio apartment is just a 5-minute walk from campus and includes utilities in the rent. Features include high-speed internet, community laundry facilities, and a dedicated study area.',
        rent: 1200,
        location: 'University District',
        amenities: ['WiFi', 'Laundry', 'Study Area', 'Utilities Included', 'Bike Storage'],
        photos: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800'
        ],
        bedrooms: 1,
        bathrooms: 1,
        area_sqft: 600,
        property_type: 'studio',
        is_available: true,
        created_at: '2024-01-10T10:00:00.000Z',
        updated_at: '2024-01-10T10:00:00.000Z',
        owner_name: 'Demo Owner',
        owner_email: 'owner@demo.com',
        owner_phone: '+1-555-0100'
      },
      {
        id: 3,
        owner_id: 999,
        title: 'Luxury Villa with Garden',
        description: 'Spacious 4-bedroom villa with private garden and modern amenities. This executive home features a gourmet kitchen, home office, private pool, and lush garden. Perfect for families or executives seeking luxury living in a quiet suburban setting.',
        rent: 4500,
        location: 'Suburban Area',
        amenities: ['WiFi', 'Parking', 'Garden', 'Security', 'Pool', 'Home Office', 'Gourmet Kitchen', 'Fireplace'],
        photos: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
        ],
        bedrooms: 4,
        bathrooms: 3,
        area_sqft: 2500,
        property_type: 'villa',
        is_available: false,
        created_at: '2024-01-05T10:00:00.000Z',
        updated_at: '2024-01-05T10:00:00.000Z',
        owner_name: 'Demo Owner',
        owner_email: 'owner@demo.com',
        owner_phone: '+1-555-0100'
      },
      {
        id: 4,
        owner_id: 1000,
        title: 'Charming Cottage',
        description: 'Cozy 3-bedroom cottage in a quiet neighborhood, perfect for families. This charming home features hardwood floors, a cozy fireplace, and a beautiful garden. Located in a family-friendly neighborhood with excellent schools nearby.',
        rent: 2200,
        location: 'Residential Area',
        amenities: ['WiFi', 'Parking', 'Garden', 'Fireplace', 'Hardwood Floors', 'Pet Friendly'],
        photos: [
          'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
        ],
        bedrooms: 3,
        bathrooms: 2,
        area_sqft: 1800,
        property_type: 'house',
        is_available: true,
        created_at: '2024-01-08T10:00:00.000Z',
        updated_at: '2024-01-08T10:00:00.000Z',
        owner_name: 'Sarah Johnson',
        owner_email: 'sarah.johnson@email.com',
        owner_phone: '+1-555-1234'
      }
    ];

    // Find demo property by ID (check both static and created properties)
    const demoProperty = demoProperties.find(prop => prop.id === propertyId);
    const createdProperty = demoCreatedProperties.find(prop => prop.id === propertyId);

    if (demoProperty) {
      res.json({
        success: true,
        message: 'Property retrieved successfully',
        data: demoProperty
      });
      return;
    }

    if (createdProperty) {
      res.json({
        success: true,
        message: 'Property retrieved successfully',
        data: createdProperty
      });
      return;
    }

    // Fallback to database if not a demo property
    const [properties] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone,
        (SELECT AVG(rating) FROM property_ratings WHERE property_id = p.id) as average_rating,
        (SELECT COUNT(*) FROM property_ratings WHERE property_id = p.id) as rating_count
       FROM properties p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = ?`,
      [id]
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

    // Demo user bypass - return success without database operation
    if (ownerId === 999) {
      const demoProperty = {
        id: Date.now(), // Generate a demo ID
        owner_id: ownerId,
        title: title || 'Demo Property',
        description: description || 'Demo property description',
        rent: rent || 2000,
        location: location || 'Demo Location',
        amenities: amenities || ['WiFi', 'Parking'],
        photos: photos || ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
        bedrooms: bedrooms || 2,
        bathrooms: bathrooms || 1,
        area_sqft: area_sqft || 1000,
        property_type: property_type || 'apartment',
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        pending_requests: 0,
        approved_bookings: 0
      };

      // Add to demo created properties
      demoCreatedProperties.push(demoProperty);

      // Notify tenants even in demo mode (using real tenants from DB if any)
      try {
        const [tenants] = await pool.query<RowDataPacket[]>(
          'SELECT email FROM users WHERE role = "tenant"'
        );
        const tenantEmails = tenants.map(t => t.email);

        // Use demo owner name
        notifyTenantsNewProperty(tenantEmails, demoProperty, 'Demo Owner');
      } catch (err) {
        console.error('Demo mode email notification error:', err);
      }

      res.status(201).json({
        success: true,
        message: 'Property created successfully (Demo Mode)',
        data: demoProperty
      });
      return;
    }

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

    // If database error, provide demo response for demo users
    const ownerId = req.user?.id;
    if (ownerId === 999) {
      const demoProperty = {
        id: Date.now(),
        owner_id: ownerId,
        title: req.body.title || 'Demo Property',
        description: req.body.description || 'Demo property description',
        rent: req.body.rent || 2000,
        location: req.body.location || 'Demo Location',
        amenities: req.body.amenities || ['WiFi', 'Parking'],
        photos: req.body.photos || ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
        bedrooms: req.body.bedrooms || 2,
        bathrooms: req.body.bathrooms || 1,
        area_sqft: req.body.area_sqft || 1000,
        property_type: req.body.property_type || 'apartment',
        is_available: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        message: 'Property created successfully (Demo Mode - Database unavailable)',
        data: demoProperty
      });
      return;
    }

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

    // Demo user bypass - handle both static and created demo properties
    if (ownerId === 999) {
      // Check if it's a created property first
      const createdPropertyIndex = demoCreatedProperties.findIndex(prop => prop.id === propertyId);

      if (createdPropertyIndex !== -1) {
        // Remove from created properties
        demoCreatedProperties.splice(createdPropertyIndex, 1);
        res.json({
          success: true,
          message: 'Property deleted successfully (Demo Mode)'
        });
        return;
      }

      // Check if it's a static demo property
      const staticDemoProperties = [
        { id: 1, owner_id: 999, title: 'Modern Downtown Apartment' },
        { id: 2, owner_id: 999, title: 'Cozy Studio Near University' },
        { id: 3, owner_id: 999, title: 'Luxury Villa with Garden' }
      ];

      const staticProperty = staticDemoProperties.find(prop => prop.id === propertyId);

      if (staticProperty) {
        res.json({
          success: true,
          message: 'Property deleted successfully (Demo Mode - Static Property)'
        });
        return;
      }

      // Property not found
      res.status(404).json({
        success: false,
        message: 'Property not found'
      });
      return;
    }

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

    // If database error, try demo fallback for demo users
    const ownerId = req.user?.id;
    if (ownerId === 999) {
      const propertyId = parseInt(req.params.id);

      // Check created properties
      const createdPropertyIndex = demoCreatedProperties.findIndex(prop => prop.id === propertyId);
      if (createdPropertyIndex !== -1) {
        demoCreatedProperties.splice(createdPropertyIndex, 1);
        res.json({
          success: true,
          message: 'Property deleted successfully (Demo Mode - Database unavailable)'
        });
        return;
      }

      // Check static properties
      const staticDemoProperties = [1, 2, 3];
      if (staticDemoProperties.includes(propertyId)) {
        res.json({
          success: true,
          message: 'Property deleted successfully (Demo Mode - Database unavailable)'
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting property'
    });
  }
};

export const getOwnerProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    // Demo user bypass
    if (ownerId === 999) {
      const demoProperties = [
        {
          id: 1,
          owner_id: 999,
          title: 'Modern Downtown Apartment',
          description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.',
          rent: 2500,
          location: 'Downtown, City Center',
          amenities: ['WiFi', 'Parking', 'Gym', 'Pool'],
          photos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
          bedrooms: 2,
          bathrooms: 2,
          area_sqft: 1200,
          property_type: 'apartment',
          is_available: true,
          created_at: '2024-01-15T10:00:00.000Z',
          updated_at: '2024-01-15T10:00:00.000Z',
          pending_requests: 2,
          approved_bookings: 1
        },
        {
          id: 2,
          owner_id: 999,
          title: 'Cozy Studio Near University',
          description: 'Perfect for students - close to university with all amenities nearby.',
          rent: 1200,
          location: 'University District',
          amenities: ['WiFi', 'Laundry', 'Study Area'],
          photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
          bedrooms: 1,
          bathrooms: 1,
          area_sqft: 600,
          property_type: 'studio',
          is_available: true,
          created_at: '2024-01-10T10:00:00.000Z',
          updated_at: '2024-01-10T10:00:00.000Z',
          pending_requests: 0,
          approved_bookings: 0
        },
        {
          id: 3,
          owner_id: 999,
          title: 'Luxury Villa with Garden',
          description: 'Spacious 4-bedroom villa with private garden and modern amenities.',
          rent: 4500,
          location: 'Suburban Area',
          amenities: ['WiFi', 'Parking', 'Garden', 'Security', 'Pool'],
          photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
          bedrooms: 4,
          bathrooms: 3,
          area_sqft: 2500,
          property_type: 'villa',
          is_available: false,
          created_at: '2024-01-05T10:00:00.000Z',
          updated_at: '2024-01-05T10:00:00.000Z',
          pending_requests: 1,
          approved_bookings: 2
        }
      ];

      // Combine static demo properties with dynamically created ones
      const allDemoProperties = [...demoProperties, ...demoCreatedProperties];

      res.json({
        success: true,
        message: 'Owner properties retrieved successfully',
        data: allDemoProperties
      });
      return;
    }

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

