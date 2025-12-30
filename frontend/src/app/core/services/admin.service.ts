import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Stats
    getAdminStats(): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(`${this.apiUrl}/admin/stats`);
    }

    // Users Management
    getAllUsers(): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/users`);
    }

    deleteUser(userId: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/admin/users/${userId}`);
    }

    updateUserRole(userId: number, role: string): Observable<ApiResponse<any>> {
        return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/admin/users/${userId}/role`, { role });
    }

    // Properties Management
    getAllProperties(): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/admin/properties`);
    }

    deleteProperty(propertyId: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/admin/properties/${propertyId}`);
    }

    // Bookings
    getAllBookings(): Observable<ApiResponse<any[]>> {
        return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/bookings/requests`);
    }
}
