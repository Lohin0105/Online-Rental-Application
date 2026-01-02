export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  role: 'owner' | 'tenant' | 'admin';
  avatar?: string;
  created_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
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
  created_at: string;
  updated_at: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  pending_requests?: number;
  approved_bookings?: number;
  average_rating?: number;
  rating_count?: number;
}

export interface Booking {
  id: number;
  property_id: number;
  tenant_id: number;
  owner_id: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  message?: string;
  move_in_date?: string;
  duration_months: number;
  request_time: string;
  response_time?: string;
  owner_notes?: string;
  property_title?: string;
  property_location?: string;
  property_rent?: number;
  property_photos?: string[];
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
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

export interface BookingStats {
  total_properties: number;
  total_requests: number;
  pending_requests: number;
  approved_bookings: number;
  rejected_requests: number;
}

export * from './analytics.model';

