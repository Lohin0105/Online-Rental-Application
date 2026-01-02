import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RatingService } from '../../../core/services/rating.service';
import { Booking } from '../../../core/models';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { interval, Subscription, startWith, switchMap } from 'rxjs';

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

        <!-- Stats Grid -->
        <div class="stats-grid animate-fade-in-up delay-1">
          <div class="stat-card">
            <div class="stat-icon total">
              <span class="material-icons-outlined">inbox</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ totalBookings() }}</span>
              <span class="stat-label">Total Requests</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon pending">
              <span class="material-icons-outlined">schedule</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ pendingBookings() }}</span>
              <span class="stat-label">Pending</span>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon approved">
              <span class="material-icons-outlined">check_circle</span>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ approvedBookings() }}</span>
              <span class="stat-label">Approved</span>
            </div>
          </div>
        </div>

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
          <div class="bookings-grid delay-2">
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
                      <p class="rent">\${{ booking.property_rent | number }}/month</p>
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

                  <!-- Owner Contact moved to Modal -->

                  <!-- Rating Section -->
                  @if (booking.status === 'Approved') {
                    <div class="rating-section animate-fade-in" (click)="$event.stopPropagation()">
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
                    <a [routerLink]="['/properties', booking.property_id]" class="btn btn-secondary btn-sm" (click)="$event.stopPropagation()">
                      View Property
                    </a>
                    @if (booking.status === 'Pending') {
                      <button 
                        class="btn btn-ghost btn-sm cancel-btn"
                        (click)="cancelBooking(booking.id); $event.stopPropagation()"
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
    
      <!-- Booking Details Modal -->
      @if (selectedBooking()) {
        <div class="modal-overlay animate-fade-in" (click)="closeBookingDetails()">
          <div class="modal-content animate-scale-in" (click)="$event.stopPropagation()">
            <button class="close-btn" (click)="closeBookingDetails()">
              <span class="material-icons-outlined">close</span>
            </button>

            <div class="modal-header">
              <div class="status-badge" [class]="selectedBooking()?.status?.toLowerCase()">
                 {{ selectedBooking()?.status }}
              </div>
              <h2>{{ selectedBooking()?.property_title }}</h2>
              <p class="modal-location">
                <span class="material-icons-outlined">place</span>
                {{ selectedBooking()?.property_location }}
              </p>
            </div>

            <div class="modal-body">
              <div class="info-grid">
                <div class="info-item">
                  <label>Move-in Date</label>
                  <p>{{ selectedBooking()?.move_in_date | date:'mediumDate' }}</p>
                </div>
                <div class="info-item">
                  <label>Duration</label>
                  <p>{{ selectedBooking()?.duration_months }} Months</p>
                </div>
                 <div class="info-item">
                  <label>Rent</label>
                  <p>\${{ selectedBooking()?.property_rent }}/mo</p>
                </div>
              </div>
              
              <div class="notes-section">
                @if (selectedBooking()?.message) {
                  <div class="note-box">
                    <label>Your Note</label>
                    <p>"{{ selectedBooking()?.message }}"</p>
                  </div>
                }
                @if (selectedBooking()?.owner_notes) {
                  <div class="note-box owner">
                    <label>Owner's Note</label>
                    <p>"{{ selectedBooking()?.owner_notes }}"</p>
                  </div>
                }
              </div>

              <!-- Owner Contact Details (Floating in Modal) -->
              @if (selectedBooking()?.status === 'Approved') {
                <div class="owner-details-box">
                  <h3>Owner Contact Details</h3>
                  <div class="contact-row">
                     <span class="material-icons-outlined">person</span>
                     <span>{{ selectedBooking()?.owner_name || 'Owner' }}</span>
                  </div>
                  <div class="contact-row">
                     <span class="material-icons-outlined">email</span>
                     <a [href]="'mailto:' + selectedBooking()?.owner_email">{{ selectedBooking()?.owner_email }}</a>
                  </div>
                  @if (selectedBooking()?.owner_phone) {
                    <div class="contact-row">
                       <span class="material-icons-outlined">phone</span>
                       <a [href]="'tel:' + selectedBooking()?.owner_phone">{{ selectedBooking()?.owner_phone }}</a>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
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

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);
      margin-bottom: var(--space-2xl);

      @media (max-width: 768px) {
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

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-family: 'Playfair Display', serif;
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--color-charcoal);
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--color-medium-gray);
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
      cursor: pointer; /* Clickable */

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
        border-color: var(--color-accent);
      }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--space-md);
      backdrop-filter: blur(4px);
    }

    .modal-content {
      background: white;
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 500px;
      position: relative;
      box-shadow: var(--shadow-2xl);
      overflow: hidden;
      border: 1px solid var(--color-off-white);
    }

    .close-btn {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      background: rgba(0,0,0,0.05);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      z-index: 2;

      &:hover {
        background: var(--color-error);
        color: white;
      }
    }

    .modal-header {
      padding: var(--space-xl);
      background: var(--color-off-white);
      text-align: center;
      
      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 50px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--space-md);
        
        &.pending { background: var(--color-warning); color: var(--color-charcoal); }
        &.approved { background: var(--color-success); color: white; }
        &.rejected { background: var(--color-error); color: white; }
      }

      h2 {
        font-size: 1.5rem;
        margin-bottom: var(--space-xs);
        font-family: 'DM Sans', sans-serif;
      }

      .modal-location {
        color: var(--color-medium-gray);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-size: 0.9rem;
      }
    }

    .modal-body {
      padding: var(--space-xl);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
      text-align: center;

      .info-item {
        label {
          display: block;
          font-size: 0.7rem;
          color: var(--color-medium-gray);
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        p {
          font-weight: 600;
          color: var(--color-charcoal);
        }
      }
    }

    .notes-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .note-box {
      background: var(--color-off-white);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      
      &.owner { background: rgba(74, 124, 89, 0.1); }

      label {
        font-size: 0.7rem;
        color: var(--color-medium-gray);
        text-transform: uppercase;
        display: block;
        margin-bottom: 4px;
      }
      p {
        font-style: italic;
        font-size: 0.9rem;
        color: var(--color-charcoal);
      }
    }

    .owner-details-box {
      background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
      color: white;
      padding: var(--space-xl);
      border-radius: var(--radius-lg);
      text-align: center;
      box-shadow: var(--shadow-lg);

      h3 {
        font-size: 1rem;
        margin-bottom: var(--space-md);
        font-family: 'DM Sans', sans-serif;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        padding-bottom: var(--space-sm);
        display: inline-block;
      }

      .contact-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-sm);
        margin-bottom: var(--space-sm);
        font-size: 1rem;

        a { color: white; text-decoration: none; font-weight: 500; border-bottom: 1px dashed rgba(255,255,255,0.5); }
        a:hover { border-bottom-style: solid; }
      }
    }

    .rating-section {
      margin: var(--space-lg) 0;
      padding: var(--space-md);
      background: var(--color-off-white);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .rating-group {
      display: flex;
      flex-direction: column;
      gap: 4px;

      label {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-medium-gray);
        text-transform: uppercase;
      }
    }
  `]
})
export class MyBookingsComponent implements OnInit, OnDestroy {
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  cancelling = signal<number | null>(null);

  // Computed stats
  totalBookings = computed(() => this.bookings().length);
  pendingBookings = computed(() => this.bookings().filter(b => b.status === 'Pending').length);
  approvedBookings = computed(() => this.bookings().filter(b => b.status === 'Approved').length);

  // Track ratings locally for immediate feedback
  propertyRatings = signal<Record<number, number>>({});
  userRatings = signal<Record<number, number>>({});

  // Track selected booking for details modal
  selectedBooking = signal<Booking | null>(null);

  private pollSubscription?: Subscription;

  constructor(
    private bookingService: BookingService,
    private notification: NotificationService,
    private ratingService: RatingService
  ) { }

  ngOnInit() {
    this.startPolling();
  }

  ngOnDestroy() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  openBookingDetails(booking: Booking) {
    this.selectedBooking.set(booking);
  }

  closeBookingDetails() {
    this.selectedBooking.set(null);
  }

  startPolling() {
    // Poll every 2 seconds
    this.pollSubscription = interval(2000)
      .pipe(
        startWith(0),
        switchMap(() => this.bookingService.getTenantBookings())
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            console.log('Tenant Bookings Data:', response.data); // DEBUG
            this.bookings.set(response.data);
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Polling error', err);
          this.loading.set(false);
        }
      });
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

