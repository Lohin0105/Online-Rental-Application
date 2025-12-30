import { Request } from 'express';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'owner' | 'tenant' | 'admin';
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Property {
  id: number;
  owner_id: number;
  title: string;
  description?: string;
  rent: number;
  location: string;
  amenities: string[];
  photos: string[];
  bedrooms: number;
  bathrooms: number;
  area_sqft?: number;
  property_type: 'apartment' | 'house' | 'studio' | 'villa' | 'condo';
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
}

export interface Booking {
  id: number;
  property_id: number;
  tenant_id: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  message?: string;
  move_in_date?: Date;
  duration_months: number;
  request_time: Date;
  response_time?: Date;
  owner_notes?: string;
  property_title?: string;
  property_location?: string;
  property_rent?: number;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'owner' | 'tenant' | 'admin';
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PropertyFilters {
  title?: string;
  location?: string;
  minRent?: number;
  maxRent?: number;
  amenities?: string[];
  bedrooms?: number;
  property_type?: string;
  page?: number;
  limit?: number;
}

