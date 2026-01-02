import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Property, Booking, BookingStats } from '../../../core/models';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { ChatbotComponent } from '../../../shared/components/chatbot/chatbot.component';
import { RatingService } from '../../../core/services/rating.service';
import { interval, Subscription, startWith, switchMap, forkJoin } from 'rxjs';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent, ChatbotComponent],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <!-- Header -->
        <header class="dashboard-header animate-fade-in-down">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {{ auth.currentUser()?.name }}</p>
          </div>
          <a routerLink="/owner/properties/new" class="btn btn-primary">
            <span class="material-icons-outlined">add</span>
            Add Property
          </a>
        </header>

        <!-- Stats Cards -->
        <div class="stats-grid animate-fade-in-up delay-1">
          <div class="stat-card">
            <div class="stat-icon">
              <span class="material-icons-outlined">home_work</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats()?.total_properties || 0 }}</span>
              <span class="stat-label">Properties</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon pending">
              <span class="material-icons-outlined">schedule</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats()?.pending_requests || 0 }}</span>
              <span class="stat-label">Pending Requests</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon approved">
              <span class="material-icons-outlined">check_circle</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats()?.approved_bookings || 0 }}</span>
              <span class="stat-label">Approved Bookings</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon total">
              <span class="material-icons-outlined">inbox</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stats()?.total_requests || 0 }}</span>
              <span class="stat-label">Total Requests</span>
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          <!-- Properties Section -->
          <section class="dashboard-section animate-fade-in-up delay-2">
            <div class="section-header">
              <h2>Your Properties</h2>
              <a routerLink="/owner/properties/new" class="btn btn-ghost btn-sm">View All</a>
            </div>

            @if (propertiesLoading()) {
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
            } @else if (properties().length > 0) {
              <div class="property-list">
                @for (property of properties(); track property.id) {
                  <div class="property-item">
                    <div class="property-image">
                      @if (property.photos && property.photos.length > 0) {
                        <img [src]="property.photos[0]" [alt]="property.title">
                      } @else {
                        <span class="material-icons-outlined">home</span>
                      }
                    </div>
                    <div class="property-info">
                      <h3>{{ property.title }}</h3>
                      <p class="location">{{ property.location }}</p>
                      <div class="property-meta">
                        <span class="price">\${{ property.rent }}/mo</span>
                        @if (property.pending_requests) {
                          <span class="badge pending">{{ property.pending_requests }} pending</span>
                        }
                      </div>
                    </div>
                    <div class="property-actions">
                      <a [routerLink]="['/owner/properties', property.id, 'edit']" class="action-btn">
                        <span class="material-icons-outlined">edit</span>
                      </a>
                      <button class="action-btn delete" (click)="deleteProperty(property.id)">
                        <span class="material-icons-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <span class="material-icons-outlined">add_home</span>
                <p>No properties yet</p>
                <a routerLink="/owner/properties/new" class="btn btn-primary btn-sm">Add Your First Property</a>
              </div>
            }
          </section>

          <!-- Booking Requests Section -->
          <section class="dashboard-section animate-fade-in-up delay-3">
            <div class="section-header">
              <h2>Booking Requests</h2>
            </div>

            @if (bookingsLoading()) {
              <div class="loading-skeleton">
                @for (i of [1,2,3]; track i) {
                  <div class="skeleton-item">
                    <div class="skeleton skeleton-avatar"></div>
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
                  <div class="booking-item" [class.pending]="booking.status === 'Pending'">
                    <div class="booking-header">
                      <div class="tenant-info">
                        <div class="tenant-avatar">{{ booking.tenant_name?.charAt(0) || 'T' }}</div>
                        <div>
                          <h4>{{ booking.tenant_name }}</h4>
                          <p>{{ booking.tenant_email }}</p>
                        </div>
                      </div>
                      <span class="status-badge" [class]="booking.status.toLowerCase()">
                        {{ booking.status }}
                      </span>
                    </div>
                    
                    <div class="booking-property">
                      <span class="material-icons-outlined">home</span>
                      {{ booking.property_title }}
                    </div>

                    @if (booking.message) {
                      <p class="booking-message">"{{ booking.message }}"</p>
                    }

                    <div class="booking-details">
                      <span>
                        <span class="material-icons-outlined">calendar_today</span>
                        {{ booking.request_time | date:'mediumDate' }}
                      </span>
                      <span>
                        <span class="material-icons-outlined">schedule</span>
                        {{ booking.duration_months }} months
                      </span>
                    </div>

                    @if (booking.status === 'Approved') {
                      <div class="rating-section animate-fade-in">
                        <div class="rating-group">
                          <label>Rate Tenant ({{ booking.tenant_name }})</label>
                          <app-star-rating 
                            [value]="getTenantRating(booking.tenant_id)"
                            (ratingChange)="onRateTenant(booking.tenant_id, $event)"
                            [size]="18"
                          ></app-star-rating>
                        </div>
                      </div>
                    }

                    @if (booking.status === 'Pending') {
                      <div class="booking-actions">
                        <button 
                          class="btn btn-primary btn-sm" 
                          (click)="updateBookingStatus(booking.id, 'Approved')"
                          [disabled]="updatingBooking() === booking.id"
                        >
                          Approve
                        </button>
                        <button 
                          class="btn btn-secondary btn-sm" 
                          (click)="updateBookingStatus(booking.id, 'Rejected')"
                          [disabled]="updatingBooking() === booking.id"
                        >
                          Reject
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            } @else {
              <div class="empty-state">
                <span class="material-icons-outlined">inbox</span>
                <p>No booking requests yet</p>
              </div>
            }
          </section>
        </div>
      </div>

      <!-- Chatbot Widget -->
      <app-chatbot></app-chatbot>
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
      grid-template-columns: repeat(4, 1fr);
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
      &.total { background: rgba(212, 165, 116, 0.1); .material-icons-outlined { color: var(--color-accent); } }
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
      grid-template-columns: 1fr 1fr;
      gap: var(--space-xl);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
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

    .property-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .property-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-off-white);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);

      &:hover {
        background: var(--color-silver);
        .property-actions { opacity: 1; }
      }
    }

    .property-image {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-md);
      background: var(--color-silver);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      img { width: 100%; height: 100%; object-fit: cover; }
      .material-icons-outlined { font-size: 1.5rem; color: var(--color-medium-gray); }
    }

    .property-info {
      flex: 1;
      min-width: 0;

      h3 {
        font-size: 0.9rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .location {
        font-size: 0.75rem;
        color: var(--color-medium-gray);
        margin-bottom: var(--space-xs);
      }

      .property-meta {
        display: flex;
        align-items: center;
        gap: var(--space-sm);

        .price {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-charcoal);
        }

        .badge {
          padding: 2px 8px;
          font-size: 0.65rem;
          border-radius: 50px;

          &.pending {
            background: var(--color-warning);
            color: var(--color-charcoal);
          }
        }
      }
    }

    .property-actions {
      display: flex;
      gap: var(--space-xs);
      opacity: 0;
      transition: opacity var(--transition-fast);

      .action-btn {
        width: 32px;
        height: 32px;
        border-radius: var(--radius-sm);
        background: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast);

        .material-icons-outlined { font-size: 1rem; }

        &:hover {
          background: var(--color-charcoal);
          color: white;
        }

        &.delete:hover {
          background: var(--color-error);
        }
      }
    }

    .booking-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      max-height: 600px;
      overflow-y: auto;
    }

    .booking-item {
      padding: var(--space-lg);
      background: var(--color-off-white);
      border-radius: var(--radius-md);
      border-left: 3px solid var(--color-silver);

      &.pending { border-left-color: var(--color-warning); }
    }

    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-md);
    }

    .tenant-info {
      display: flex;
      align-items: center;
      gap: var(--space-sm);

      .tenant-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--color-charcoal);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }

      h4 {
        font-size: 0.9rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
      }

      p {
        font-size: 0.75rem;
        color: var(--color-medium-gray);
      }
    }

    .status-badge {
      padding: 4px 12px;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 50px;

      &.pending { background: var(--color-warning); color: var(--color-charcoal); }
      &.approved { background: var(--color-success); color: white; }
      &.rejected { background: var(--color-error); color: white; }
    }

    .booking-property {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: 0.8rem;
      color: var(--color-gray);
      margin-bottom: var(--space-sm);

      .material-icons-outlined { font-size: 1rem; }
    }

    .booking-message {
      font-size: 0.8rem;
      font-style: italic;
      color: var(--color-medium-gray);
      margin-bottom: var(--space-sm);
      padding: var(--space-sm);
      background: white;
      border-radius: var(--radius-sm);
    }

    .booking-details {
      display: flex;
      gap: var(--space-lg);
      font-size: 0.75rem;
      color: var(--color-medium-gray);
      margin-bottom: var(--space-md);

      span {
        display: flex;
        align-items: center;
        gap: var(--space-xs);

        .material-icons-outlined { font-size: 0.9rem; }
      }
    }

    .rating-section {
      padding: var(--space-sm) var(--space-md);
      background: white;
      border: 1px solid var(--color-silver-light, #eee);
      border-radius: var(--radius-sm);
      margin-top: var(--space-sm);
    }

    .rating-group {
      display: flex;
      justify-content: space-between;
      align-items: center;

      label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--color-gray);
      }
    }

    .booking-actions {
      display: flex;
      gap: var(--space-sm);
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

      .skeleton-image { width: 64px; height: 64px; border-radius: var(--radius-md); }
      .skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }
      .skeleton-content { flex: 1; }
      .skeleton-text { height: 16px; width: 80%; margin-bottom: 8px; }
      .skeleton-text-sm { height: 12px; width: 50%; }
    }
  `]
})
export class OwnerDashboardComponent implements OnInit, OnDestroy {
  properties = signal<Property[]>([]);
  bookings = signal<Booking[]>([]);
  stats = signal<BookingStats | null>(null);
  propertiesLoading = signal(true);
  bookingsLoading = signal(true);
  updatingBooking = signal<number | null>(null);

  // Track ratings locally
  tenantRatings = signal<Record<number, number>>({});

  private pollSubscription?: Subscription;

  constructor(
    private propertyService: PropertyService,
    private bookingService: BookingService,
    private notification: NotificationService,
    private ratingService: RatingService,
    public auth: AuthService
  ) { }

  getTenantRating(tenantId: any): number {
    return this.tenantRatings()[tenantId] || 0;
  }

  onRateTenant(tenantId: any, rating: number) {
    this.ratingService.submitUserRating(tenantId, rating).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Tenant rated successfully!');
          this.tenantRatings.update(prev => ({ ...prev, [tenantId]: rating }));
        }
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to submit rating');
      }
    });
  }

  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  startPolling() {
    // Poll every 2 seconds
    this.pollSubscription = interval(2000)
      .pipe(
        startWith(0),
        switchMap(() => {
          return forkJoin({
            properties: this.propertyService.getOwnerProperties(),
            bookings: this.bookingService.getOwnerBookings(),
            stats: this.bookingService.getBookingStats()
          });
        })
      )
      .subscribe({
        next: (results) => {
          // Update Properties
          if (results.properties.success && results.properties.data) {
            this.properties.set(results.properties.data);
          }
          this.propertiesLoading.set(false);

          // Update Bookings
          if (results.bookings.success && results.bookings.data) {
            this.bookings.set(results.bookings.data);
          }
          this.bookingsLoading.set(false);

          // Update Stats
          if (results.stats.success && results.stats.data) {
            this.stats.set(results.stats.data);
          }
        },
        error: (err) => {
          console.error('Polling error', err);
          this.propertiesLoading.set(false);
          this.bookingsLoading.set(false);
        }
      });
  }

  updateBookingStatus(bookingId: number, status: string) {
    this.updatingBooking.set(bookingId);
    this.bookingService.updateBookingStatus(bookingId, status).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success(`Booking ${status.toLowerCase()} successfully`);
        }
        this.updatingBooking.set(null);
      },
      error: () => {
        this.notification.error('Failed to update booking status');
        this.updatingBooking.set(null);
      }
    });
  }

  deleteProperty(propertyId: number) {
    if (confirm('Are you sure you want to delete this property?')) {
      this.propertyService.deleteProperty(propertyId).subscribe({
        next: (response) => {
          if (response.success) {
            this.notification.success('Property deleted successfully');
            this.properties.update(props => props.filter(p => p.id !== propertyId));
          }
        },
        error: () => this.notification.error('Failed to delete property')
      });
    }
  }
}

