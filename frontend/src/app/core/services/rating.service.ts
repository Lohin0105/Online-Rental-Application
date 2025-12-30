import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models';
import { PropertyRatingResponse, UserRatingResponse } from '../models/rating.model';

@Injectable({
    providedIn: 'root'
})
export class RatingService {
    private apiUrl = `${environment.apiUrl}/ratings`;

    constructor(private http: HttpClient) { }

    submitPropertyRating(propertyId: number, rating: number, comment?: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/property`, {
            propertyId,
            rating,
            comment
        });
    }

    submitUserRating(targetUserId: number, rating: number, comment?: string): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(`${this.apiUrl}/user`, {
            targetUserId,
            rating,
            comment
        });
    }

    getPropertyRatings(propertyId: number): Observable<ApiResponse<PropertyRatingResponse>> {
        return this.http.get<ApiResponse<PropertyRatingResponse>>(`${this.apiUrl}/property/${propertyId}`);
    }

    getUserRatings(userId: number): Observable<ApiResponse<UserRatingResponse>> {
        return this.http.get<ApiResponse<UserRatingResponse>>(`${this.apiUrl}/user/${userId}`);
    }
}
