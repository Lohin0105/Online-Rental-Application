import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RatingService } from '../../../core/services/rating.service';
import { Booking } from '../../../core/models';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StarRatingComponent],
  template: `
    <div class="bookings-page">
      <div class="container">
        <header class="page-header animate-fade-in-down">
          <h1>My Bookings</h1>
          <p>Track and manage your rental requests</p>
        </header>

        @if (loading()) {
          <div class="bookings-grid">
            @for (i of [1,2,3]; track i) {
              <div class="skeleton-card">
                <div class="skeleton skeleton-header"></div>
                <div class="skeleton-body">
                  <div class="skeleton skeleton-text"></div>
                  <div class="skeleton skeleton-text-sm"></div>
                </div>
              </div>
            }
          </div>
        } @else if (bookings().length > 0) {
          <div class="bookings-grid">
            @for (booking of bookings(); track booking.id; let i = $index) {
              <div class="booking-card animate-fade-in-up" [style.animation-delay]="(i * 0.1) + 's'">
                <!-- Status Banner -->
                <div class="status-banner" [class]="booking.status.toLowerCase()">
                  <span class="status-icon material-icons-outlined">
                    @switch (booking.status) {
                      @case ('Pending') { schedule }
                      @case ('Approved') { check_circle }
                      @case ('Rejected') { cancel }
                    }
                  </span>
                  <span class="status-text">{{ booking.status }}</span>
                </div>

                <!-- Property Info -->
                <div class="card-content">
                  <div class="property-section">
                    @if (booking.property_photos && booking.property_photos.length > 0) {
                      <img [src]="booking.property_photos[0]" [alt]="booking.property_title" class="property-thumb">
                    } @else {
                      <div class="property-thumb placeholder">
                        <span class="material-icons-outlined">home</span>
                      </div>
                    }
                    <div class="property-info">
                      <h3>{{ booking.property_title }}</h3>
                      <p class="location">
                        <span class="material-icons-outlined">location_on</span>
                        {{ booking.property_location }}
                      </p>
                      <p class="rent">₹{{ booking.property_rent | number }}/month</p>
                    </div>
                  </div>

                  <div class="divider"></div>

                  <!-- Booking Details -->
                  <div class="booking-details">
                    <div class="detail-item">
                      <span class="detail-label">Requested</span>
                      <span class="detail-value">{{ booking.request_time | date:'mediumDate' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Duration</span>
                      <span class="detail-value">{{ booking.duration_months }} months</span>
                    </div>
                    @if (booking.move_in_date) {
                      <div class="detail-item">
                        <span class="detail-label">Move-in</span>
                        <span class="detail-value">{{ booking.move_in_date | date:'mediumDate' }}</span>
                      </div>
                    }
                  </div>

                  @if (booking.message) {
                    <div class="message-section">
                      <span class="message-label">Your message:</span>
                      <p class="message-text">"{{ booking.message }}"</p>
                    </div>
                  }

                  @if (booking.owner_notes) {
                    <div class="owner-response">
                      <span class="response-label">Owner's response:</span>
                      <p class="response-text">"{{ booking.owner_notes }}"</p>
                    </div>
                  }

                  <!-- Owner Contact (for approved bookings) -->
                  @if (booking.status === 'Approved') {
                    <div class="owner-contact">
                      <h4>Contact Owner</h4>
                      <div class="contact-header">
                        <p>{{ booking.owner_name }}</p>
                        <!-- Average User Rating would go here if available -->
                      </div>
                      @if (booking.owner_email) {
                        <a [href]="'mailto:' + booking.owner_email" class="contact-link">
                          <span class="material-icons-outlined">email</span>
                          {{ booking.owner_email }}
                        </a>
                      }
                      @if (booking.owner_phone) {
                        <a [href]="'tel:' + booking.owner_phone" class="contact-link">
                          <span class="material-icons-outlined">phone</span>
                          {{ booking.owner_phone }}
                        </a>
                      }
                    </div>

                    <!-- Rating Section -->
                    <div class="rating-section animate-fade-in">
                      <div class="rating-group">
                        <label>Rate this Property</label>
                        <app-star-rating 
                          [value]="getPropertyRating(booking.property_id)"
                          (ratingChange)="onRateProperty(booking.property_id, $event)"
                          [size]="20"
                        ></app-star-rating>
                      </div>
                      
                      <div class="rating-group">
                        <label>Rate Owner ({{ booking.owner_name }})</label>
                        <app-star-rating 
                          [value]="getUserRating(booking.owner_id)"
                          (ratingChange)="onRateOwner(booking.owner_id, $event)"
                          [size]="20"
                        ></app-star-rating>
                      </div>
                    </div>
                  }

                  <!-- Actions -->
                  <div class="card-actions">
                    <a [routerLink]="['/properties', booking.property_id]" class="btn btn-secondary btn-sm">
                      View Property
                    </a>
                    @if (booking.status === 'Pending') {
                      <button 
                        class="btn btn-ghost btn-sm cancel-btn"
                        (click)="cancelBooking(booking.id)"
                        [disabled]="cancelling() === booking.id"
                      >
                        Cancel Request
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state animate-scale-in">
            <span class="material-icons-outlined">inbox</span>
            <h2>No Bookings Yet</h2>
            <p>Start exploring properties and submit your first booking request</p>
            <a routerLink="/properties" class="btn btn-primary">Browse Properties</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .bookings-page {
      min-height: 100vh;
      padding: var(--space-2xl) 0;
      background: var(--color-off-white);
    }

    .page-header {
      margin-bottom: var(--space-2xl);

      h1 { margin-bottom: var(--space-sm); }
      p { color: var(--color-medium-gray); }
    }

    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-xl);

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .booking-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--color-off-white);
      transition: all var(--transition-base);

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }
    }

    .status-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      padding: var(--space-sm);
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;

      &.pending {
        background: var(--color-warning);
        color: var(--color-charcoal);
      }

      &.approved {
        background: var(--color-success);
        color: white;
      }

      &.rejected {
        background: var(--color-error);
        color: white;
      }

      .status-icon { font-size: 1.25rem; }
    }

    .card-content {
      padding: var(--space-lg);
    }

    .property-section {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .property-thumb {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      object-fit: cover;
      flex-shrink: 0;

      &.placeholder {
        background: var(--color-off-white);
        display: flex;
        align-items: center;
        justify-content: center;

        .material-icons-outlined {
          font-size: 2rem;
          color: var(--color-silver);
        }
      }
    }

    .property-info {
      h3 {
        font-size: 1rem;
        margin-bottom: var(--space-xs);
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
      }

      .location {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8rem;
        color: var(--color-medium-gray);
        margin-bottom: var(--space-xs);

        .material-icons-outlined {
          font-size: 0.9rem;
          color: var(--color-accent);
        }
      }

      .rent {
        font-weight: 600;
        color: var(--color-charcoal);
      }
    }

    .divider {
      height: 1px;
      background: var(--color-off-white);
      margin: var(--space-md) 0;
    }

    .booking-details {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-lg);
      margin-bottom: var(--space-md);
    }

    .detail-item {
      .detail-label {
        display: block;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-medium-gray);
        margin-bottom: 2px;
      }

      .detail-value {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-charcoal);
      }
    }

    .message-section, .owner-response {
      padding: var(--space-md);
      background: var(--color-off-white);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-md);

      .message-label, .response-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-medium-gray);
        display: block;
        margin-bottom: var(--space-xs);
      }

      .message-text, .response-text {
        font-size: 0.875rem;
        font-style: italic;
        color: var(--color-gray);
      }
    }

    .owner-response {
      background: rgba(74, 124, 89, 0.1);
      border-left: 3px solid var(--color-success);
    }

    .owner-contact {
      padding: var(--space-md);
      background: rgba(212, 165, 116, 0.1);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-md);

      h4 {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-medium-gray);
        margin-bottom: var(--space-sm);
        font-family: 'DM Sans', sans-serif;
      }

      p {
        font-weight: 500;
        color: var(--color-charcoal);
        margin-bottom: var(--space-sm);
      }

      .contact-link {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        font-size: 0.8rem;
        color: var(--color-accent-dark);
        margin-bottom: var(--space-xs);

        .material-icons-outlined { font-size: 1rem; }

        &:hover { text-decoration: underline; }
      }
    }

    .rating-section {
      padding: var(--space-md);
      background: white;
      border: 1px solid var(--color-silver-light, #eee);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .rating-group {
      display: flex;
      justify-content: space-between;
      align-items: center;

      label {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--color-gray);
      }
    }

    .card-actions {
      display: flex;
      gap: var(--space-sm);
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-off-white);

      .cancel-btn:hover {
        color: var(--color-error);
      }
    }

    .skeleton-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;

      .skeleton-header { height: 40px; }
      .skeleton-body { padding: var(--space-lg); }
      .skeleton-text { height: 24px; width: 70%; margin-bottom: var(--space-sm); }
      .skeleton-text-sm { height: 16px; width: 50%; }
    }

    .empty-state {
      text-align: center;
      padding: var(--space-3xl);
      background: white;
      border-radius: var(--radius-xl);

      .material-icons-outlined {
        font-size: 5rem;
        color: var(--color-silver);
        margin-bottom: var(--space-lg);
      }

      h2 { margin-bottom: var(--space-sm); }
      p { color: var(--color-medium-gray); margin-bottom: var(--space-xl); }
    }
  `]
})
export class MyBookingsComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  cancelling = signal<number | null>(null);

  // Track ratings locally for immediate feedback
  propertyRatings = signal<Record<number, number>>({});
  userRatings = signal<Record<number, number>>({});

  constructor(
    private bookingService: BookingService,
    private notification: NotificationService,
    private ratingService: RatingService
  ) { }

  ngOnInit() {
    this.loadBookings();
  }

  getPropertyRating(propertyId: number): number {
    return this.propertyRatings()[propertyId] || 0;
  }

  getUserRating(userId: number): number {
    return this.userRatings()[userId] || 0;
  }

  onRateProperty(propertyId: number, rating: number) {
    this.ratingService.submitPropertyRating(propertyId, rating).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Property rated successfully!');
          this.propertyRatings.update(prev => ({ ...prev, [propertyId]: rating }));
        }
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to submit rating');
      }
    });
  }

  onRateOwner(ownerId: number, rating: number) {
    this.ratingService.submitUserRating(ownerId, rating).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Owner rated successfully!');
          this.userRatings.update(prev => ({ ...prev, [ownerId]: rating }));
        }
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to submit rating');
      }
    });
  }

  loadBookings() {
    this.bookingService.getTenantBookings().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.bookings.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  cancelBooking(bookingId: number) {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;

    this.cancelling.set(bookingId);
    this.bookingService.cancelBooking(bookingId).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Booking cancelled successfully');
          this.bookings.update(b => b.filter(booking => booking.id !== bookingId));
        }
        this.cancelling.set(null);
      },
      error: () => {
        this.notification.error('Failed to cancel booking');
        this.cancelling.set(null);
      }
    });
  }
}

