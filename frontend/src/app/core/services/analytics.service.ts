import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  FinancialAnalytics,
  PropertyAnalytics,
  Activity,
  TenantOverview,
  MaintenanceRequest,
  CalendarEvent
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly API_URL = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) { }

  getFinancialAnalytics(): Observable<{ success: boolean; message: string; data: FinancialAnalytics }> {
    return this.http.get<{ success: boolean; message: string; data: FinancialAnalytics }>(`${this.API_URL}/financial`);
  }

  getPropertyAnalytics(): Observable<{ success: boolean; message: string; data: PropertyAnalytics }> {
    return this.http.get<{ success: boolean; message: string; data: PropertyAnalytics }>(`${this.API_URL}/properties`);
  }

  getRecentActivities(): Observable<{ success: boolean; message: string; data: Activity[] }> {
    return this.http.get<{ success: boolean; message: string; data: Activity[] }>(`${this.API_URL}/activities`);
  }

  getTenantOverview(): Observable<{ success: boolean; message: string; data: TenantOverview }> {
    return this.http.get<{ success: boolean; message: string; data: TenantOverview }>(`${this.API_URL}/tenants`);
  }

  getMaintenanceOverview(): Observable<{ success: boolean; message: string; data: { pendingRequests: number; inProgress: number; completedThisMonth: number; maintenanceRequests: MaintenanceRequest[] } }> {
    return this.http.get<{ success: boolean; message: string; data: { pendingRequests: number; inProgress: number; completedThisMonth: number; maintenanceRequests: MaintenanceRequest[] } }>(`${this.API_URL}/maintenance`);
  }

  getCalendarEvents(startDate?: string, endDate?: string): Observable<{ success: boolean; message: string; data: CalendarEvent[] }> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get<{ success: boolean; message: string; data: CalendarEvent[] }>(`${this.API_URL}/calendar`, { params });
  }
}
