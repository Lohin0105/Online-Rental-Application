import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, AuthResponse, ApiResponse } from '../models';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private currentUserSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  currentUser = this.currentUserSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  isAuthenticated = computed(() => !!this.currentUserSignal());
  isOwner = computed(() => this.currentUserSignal()?.role === 'owner');
  isTenant = computed(() => this.currentUserSignal()?.role === 'tenant');
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      this.tokenSignal.set(storedToken);
      this.currentUserSignal.set(JSON.parse(storedUser));
    }
  }

  register(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role: 'owner' | 'tenant';
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, data).pipe(
      tap((response: AuthResponse) => {
        if (response.success && response.data) {
          this.setAuth(response.data.user, response.data.token);
        }
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, { email, password }).pipe(
      tap((response: AuthResponse) => {
        if (response.success && response.data) {
          this.setAuth(response.data.user, response.data.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null);
    this.tokenSignal.set(null);
    this.router.navigate(['/']);
  }

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.API_URL}/profile`).pipe(
      tap((response: ApiResponse<User>) => {
        if (response.success && response.data) {
          this.currentUserSignal.set(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      }),
      catchError(() => of({ success: false, message: 'Failed to fetch profile' }))
    );
  }

  updateProfile(data: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/profile`, data).pipe(
      tap((response: ApiResponse<User>) => {
        if (response.success && response.data) {
          this.currentUserSignal.set(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      })
    );
  }

  private setAuth(user: User, token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSignal.set(user);
    this.tokenSignal.set(token);
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentUserSignal();
    return user ? roles.includes(user.role) : false;
  }
}

