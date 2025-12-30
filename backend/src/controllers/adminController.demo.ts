import { Request, Response } from 'express';

// Demo users for admin dashboard
const DEMO_USERS_FOR_ADMIN = [
  {
    id: 1,
    email: 'tenant@demo.com',
    name: 'Sarah Tenant',
    phone: '123-456-7890',
    role: 'tenant',
    created_at: '2024-01-15T10:00:00Z',
    total_bookings: 3
  },
  {
    id: 2,
    email: 'owner@demo.com',
    name: 'John Owner',
    phone: '234-567-8901',
    role: 'owner',
    created_at: '2024-01-10T09:00:00Z',
    total_properties: 5
  },
  {
    id: 3,
    email: 'admin@demo.com',
    name: 'Admin Manager',
    phone: '098-765-4321',
    role: 'admin',
    created_at: '2024-01-01T08:00:00Z',
    total_properties: 0
  }
];

// Demo properties for admin dashboard
const DEMO_PROPERTIES_FOR_ADMIN = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    location: 'Downtown, New York',
    rent: 2500,
    bedrooms: 2,
    bathrooms: 2,
    property_type: 'apartment',
    status: 'available',
    owner_id: 2,
    owner_name: 'John Owner',
    created_at: '2024-02-01T10:00:00Z',
    total_bookings: 12
  },
  {
    id: 2,
    title: 'Cozy Studio Near Central Park',
    location: 'Upper West Side, New York',
    rent: 1800,
    bedrooms: 1,
    bathrooms: 1,
    property_type: 'studio',
    status: 'available',
    owner_id: 2,
    owner_name: 'John Owner',
    created_at: '2024-02-05T11:00:00Z',
    total_bookings: 8
  },
  {
    id: 3,
    title: 'Luxury Penthouse with City Views',
    location: 'Midtown, New York',
    rent: 5000,
    bedrooms: 3,
    bathrooms: 3,
    property_type: 'condo',
    status: 'available',
    owner_id: 2,
    owner_name: 'John Owner',
    created_at: '2024-02-10T12:00:00Z',
    total_bookings: 5
  }
];

// Demo stats
const DEMO_STATS = {
  totalUsers: 3,
  totalProperties: 3,
  totalBookings: 25,
  activeListings: 3,
  newUsersThisMonth: 1,
  newPropertiesThisMonth: 2,
  revenueThisMonth: 25000
};

// Get all users (admin only)
export const demoGetAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: DEMO_USERS_FOR_ADMIN,
      message: 'Demo mode - showing sample users'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// Get all properties (admin only)
export const demoGetAllProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: DEMO_PROPERTIES_FOR_ADMIN,
      message: 'Demo mode - showing sample properties'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties'
    });
  }
};

// Get admin stats
export const demoGetAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      data: DEMO_STATS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats'
    });
  }
};

// Delete user (demo mode - just return success)
export const demoDeleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: `Demo mode - User ${id} would be deleted in production`
  });
};

// Delete property (demo mode - just return success)
export const demoDeleteProperty = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  res.json({
    success: true,
    message: `Demo mode - Property ${id} would be deleted in production`
  });
};

// Update user role (demo mode - just return success)
export const demoUpdateUserRole = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { role } = req.body;
  
  res.json({
    success: true,
    message: `Demo mode - User ${id} role would be updated to ${role} in production`
  });
};

