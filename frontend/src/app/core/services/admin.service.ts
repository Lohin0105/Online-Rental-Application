import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:3001/api/admin';

    constructor(private http: HttpClient) { }

    getAllProperties(): Observable<any> {
        return this.http.get(`${this.apiUrl}/properties`);
    }

    getAllBookings(): Observable<any> {
        return this.http.get(`${this.apiUrl}/bookings`);
    }
}
