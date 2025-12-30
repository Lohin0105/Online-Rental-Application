import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, ApiResponse, BookingStats } from '../models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) { }

  createBooking(data: {
    property_id: number;
    message?: string;
    move_in_date?: string;
    duration_months?: number;
  }): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(this.API_URL, data);
  }

  getTenantBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.API_URL}/my-bookings`);
  }

  getOwnerBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.API_URL}/requests`);
  }

  getBookingStats(): Observable<ApiResponse<BookingStats>> {
    return this.http.get<ApiResponse<BookingStats>>(`${this.API_URL}/stats`);
  }

  updateBookingStatus(id: number, status: string, owner_notes?: string): Observable<ApiResponse<Booking>> {
    return this.http.patch<ApiResponse<Booking>>(`${this.API_URL}/${id}/status`, {
      status,
      owner_notes
    });
  }

  cancelBooking(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}

