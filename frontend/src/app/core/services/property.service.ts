import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property, ApiResponse, PaginatedResponse, PropertyFilters } from '../models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly API_URL = `${environment.apiUrl}/properties`;

  constructor(private http: HttpClient) { }

  getAllProperties(filters?: PropertyFilters): Observable<PaginatedResponse<Property>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.title) params = params.set('title', filters.title);
      if (filters.location) params = params.set('location', filters.location);
      if (filters.minRent) params = params.set('minRent', filters.minRent.toString());
      if (filters.maxRent) params = params.set('maxRent', filters.maxRent.toString());
      if (filters.bedrooms) params = params.set('bedrooms', filters.bedrooms.toString());
      if (filters.property_type) params = params.set('property_type', filters.property_type);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<PaginatedResponse<Property>>(this.API_URL, { params });
  }

  getPropertyById(id: number): Observable<ApiResponse<Property>> {
    return this.http.get<ApiResponse<Property>>(`${this.API_URL}/${id}`);
  }

  getOwnerProperties(): Observable<ApiResponse<Property[]>> {
    return this.http.get<ApiResponse<Property[]>>(`${this.API_URL}/owner/my-properties`);
  }

  createProperty(data: Partial<Property>): Observable<ApiResponse<Property>> {
    return this.http.post<ApiResponse<Property>>(this.API_URL, data);
  }

  updateProperty(id: number, data: Partial<Property>): Observable<ApiResponse<Property>> {
    return this.http.put<ApiResponse<Property>>(`${this.API_URL}/${id}`, data);
  }

  deleteProperty(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}

