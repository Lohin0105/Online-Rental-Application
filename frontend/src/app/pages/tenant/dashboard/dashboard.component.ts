import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { interval, Subscription, switchMap, startWith } from 'rxjs';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { Booking } from '../../../core/models';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatSnackBarModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <!-- Header -->
        <header class="dashboard-header animate-fade-in-down">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {{ auth.currentUser()?.name }}</p>
          </div>
          <a routerLink="/properties" class="btn btn-primary">
            <span class="material-icons-outlined">search</span>
            Browse Properties
          </a>
        </header>

        <!-- Stats Cards -->
        <div class="stats-grid animate-fade-in-up delay-1">
          <div class="stat-card">
            <div class="stat-icon">
              <span class="material-icons-outlined">bookmark</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ bookings().length }}</span>
              <span class="stat-label">Total Bookings</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon pending">
              <span class="material-icons-outlined">schedule</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ getPendingCount() }}</span>
              <span class="stat-label">Pending Requests</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon approved">
              <span class="material-icons-outlined">check_circle</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ getApprovedCount() }}</span>
              <span class="stat-label">Active Bookings</span>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <!-- My Bookings Section -->
          <section class="dashboard-section animate-fade-in-up delay-2">
            <div class="section-header">
              <h2>My Bookings</h2>
              <a routerLink="/properties" class="btn btn-ghost btn-sm">Find More</a>
            </div>

            @if (loading()) {
              <div class="loading-skeleton">
                @for (i of [1,2,3]; track i) {
                  <div class="skeleton-item">
                    <div class="skeleton skeleton-image"></div>
                    <div class="skeleton-content">
                      <div class="skeleton skeleton-text"></div>
                      <div class="skeleton skeleton-text-sm"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (bookings().length > 0) {
              <div class="booking-list">
                @for (booking of bookings(); track booking.id) {
                  <div class="booking-item">
                    <div class="booking-image">
                       @if (booking.property_photos && booking.property_photos.length > 0) {
                        <img [src]="booking.property_photos[0]" [alt]="booking.property_title">
                      } @else {
                        <span class="material-icons-outlined">home</span>
                      }
                    </div>
                    <div class="booking-info">
                      <h3>{{ booking.property_title }}</h3>
                      <p class="location">{{ booking.property_location }}</p>
                      <div class="booking-meta">
                        <span class="price">\${{ booking.property_rent }}/mo</span>
                        <span class="badge" [class]="booking.status.toLowerCase()">
                          {{ booking.status }}
                        </span>
                      </div>
                    </div>
                    <div class="booking-actions-meta">
                       <div class="booking-details">
                          <span title="Booking Date">
                            <span class="material-icons-outlined">calendar_today</span>
                            {{ booking.request_time | date:'mediumDate' }}
                          </span>
                        </div>
                        @if (booking.status === 'Pending') {
                          <button 
                            class="btn btn-ghost btn-sm btn-error" 
                            (click)="cancelBooking(booking.id)"
                            [disabled]="cancellingId() === booking.id"
                          >
                            <span class="material-icons-outlined">cancel</span>
                            {{ cancellingId() === booking.id ? 'Cancelling...' : 'Cancel Request' }}
                          </button>
                        }
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <span class="material-icons-outlined">bookmark_border</span>
                <p>No bookings yet</p>
                <a routerLink="/properties" class="btn btn-primary btn-sm">Find Your New Home</a>
              </div>
            }
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      padding: var(--space-2xl) 0;
      background: var(--color-off-white);
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2xl);

      h1 { margin-bottom: var(--space-xs); }
      p { color: var(--color-medium-gray); }

      @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-lg);
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);
      margin-bottom: var(--space-2xl);

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      padding: var(--space-lg);
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-off-white);
      transition: all var(--transition-fast);

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      background: var(--color-off-white);
      display: flex;
      align-items: center;
      justify-content: center;

      .material-icons-outlined {
        font-size: 1.5rem;
        color: var(--color-charcoal);
      }

      &.pending { background: rgba(201, 162, 39, 0.1); .material-icons-outlined { color: var(--color-warning); } }
      &.approved { background: rgba(74, 124, 89, 0.1); .material-icons-outlined { color: var(--color-success); } }
    }

    .stat-value {
      display: block;
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--color-charcoal);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--color-medium-gray);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr; /* Full width for tenant since just bookings for now */
      gap: var(--space-xl);
    }

    .dashboard-section {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      border: 1px solid var(--color-off-white);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);

      h2 {
        font-size: 1.125rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
      }
    }

    .booking-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .booking-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-off-white);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);

      &:hover {
        background: var(--color-silver);
      }
    }

    .booking-image {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      background: var(--color-silver);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      img { width: 100%; height: 100%; object-fit: cover; }
      .material-icons-outlined { font-size: 2rem; color: var(--color-medium-gray); }
    }

    .booking-info {
      flex: 1;
      min-width: 0;

      h3 {
        font-size: 1rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .location {
        font-size: 0.85rem;
        color: var(--color-medium-gray);
        margin-bottom: var(--space-sm);
      }

      .booking-meta {
        display: flex;
        align-items: center;
        gap: var(--space-sm);

        .price {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--color-charcoal);
        }

        .badge {
          padding: 2px 8px;
          font-size: 0.7rem;
          border-radius: 50px;
          text-transform: uppercase;
          font-weight: 600;

          &.pending { background: var(--color-warning); color: var(--color-charcoal); }
          &.approved { background: var(--color-success); color: white; }
          &.rejected { background: var(--color-error); color: white; }
        }
      }
    }

    .booking-actions-meta {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-sm);
    }

    .booking-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-xs);
      
       span {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        color: var(--color-gray);
      }
    }

    .btn-error {
      color: var(--color-error);
      border-color: transparent;
      
      &:hover:not(:disabled) {
        background: rgba(160, 64, 64, 0.1);
        color: var(--color-error);
      }

      .material-icons-outlined {
        font-size: 1rem;
      }
    }

    .empty-state {
      text-align: center;
      padding: var(--space-2xl);

      .material-icons-outlined {
        font-size: 3rem;
        color: var(--color-silver);
        margin-bottom: var(--space-md);
      }

      p {
        color: var(--color-medium-gray);
        margin-bottom: var(--space-md);
      }
    }

    .loading-skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .skeleton-item {
      display: flex;
      gap: var(--space-md);
      padding: var(--space-md);

      .skeleton-image { width: 80px; height: 80px; border-radius: var(--radius-md); }
      .skeleton-content { flex: 1; }
      .skeleton-text { height: 20px; width: 60%; margin-bottom: 12px; }
      .skeleton-text-sm { height: 16px; width: 40%; }
    }
  `]
})
export class TenantDashboardComponent implements OnInit, OnDestroy {
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  cancellingId = signal<number | null>(null);

  private pollingSubscription?: Subscription;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  private startPolling() {
    // Poll every 5 seconds
    this.pollingSubscription = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.bookingService.getTenantBookings())
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.updateBookingsAndNotify(response.data);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  private stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private updateBookingsAndNotify(newBookings: Booking[]) {
    const currentBookings = this.bookings();

    // Detect status changes for notifications
    newBookings.forEach(newBooking => {
      const oldBooking = currentBookings.find(b => b.id === newBooking.id);

      if (oldBooking && oldBooking.status === 'Pending' && newBooking.status !== 'Pending') {
        this.showStatusChangeNotification(newBooking);
      }
    });

    this.bookings.set(newBookings);
  }

  private showStatusChangeNotification(booking: Booking) {
    const message = `Your booking request for ${booking.property_title} has been ${booking.status.toLowerCase()}!`;
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: booking.status === 'Approved' ? ['success-snackbar'] : ['error-snackbar']
    });
  }

  getPendingCount() {
    return this.bookings().filter(b => b.status === 'Pending').length;
  }

  getApprovedCount() {
    return this.bookings().filter(b => b.status === 'Approved').length;
  }

  cancelBooking(id: number) {
    if (!confirm('Are you sure you want to cancel this booking request?')) {
      return;
    }

    this.cancellingId.set(id);
    this.bookingService.cancelBooking(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.bookings.update(current => current.filter(b => b.id !== id));
        }
        this.cancellingId.set(null);
      },
      error: () => {
        this.cancellingId.set(null);
      }
    });
  }
}
