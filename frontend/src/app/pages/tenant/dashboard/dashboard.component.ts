import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { RatingService } from '../../../core/services/rating.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Booking } from '../../../core/models';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { ChatbotComponent } from '../../../shared/components/chatbot/chatbot.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent, ChatbotComponent, FormsModule],
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
                  <div class="booking-item" (click)="openBookingDetails(booking)">
                    <div class="booking-image">
                       @if (booking.property_photos && booking.property_photos.length > 0) {
                        <img [src]="booking.property_photos[0]" [alt]="booking.property_title">
                      } @else {
                        <span class="material-icons-outlined">home</span>
                      }
                    </div>
                    
                    <div class="booking-content">
                      <div class="booking-header-row">
                        <div class="title-section">
                          <h3>{{ booking.property_title }}</h3>
                          <p class="location-text">
                            <span class="material-icons-outlined">location_on</span>
                            {{ booking.property_location }}
                          </p>
                        </div>
                        <div class="date-section">
                          <span class="material-icons-outlined">calendar_today</span>
                          {{ booking.request_time | date:'mediumDate' }}
                        </div>
                      </div>

                      <div class="booking-footer-row">
                        <div class="status-section">
                          <span class="price-tag">\${{ booking.property_rent }}/mo</span>
                          <span class="badge" [class]="booking.status.toLowerCase()">
                            {{ booking.status }}
                          </span>
                        </div>

                        <!-- Rating Section on Card -->
                        @if (booking.status === 'Approved') {
                          <div class="card-rating-section" (click)="$event.stopPropagation()">
                            <div class="rating-group">
                              <span class="rating-label">Rate property</span>
                              <app-star-rating 
                                [value]="getPropertyRating(booking.property_id)"
                                (ratingChange)="onRateProperty(booking.property_id, $event)"
                                [size]="16"
                              ></app-star-rating>
                            </div>
                            <div class="rating-group">
                              <span class="rating-label">Rate owner</span>
                              <app-star-rating 
                                [value]="getUserRating(booking.owner_id)"
                                (ratingChange)="onRateOwner(booking.owner_id, $event)"
                                [size]="16"
                              ></app-star-rating>
                            </div>
                          </div>
                        }
                      </div>
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

      @if (selectedBooking()) {
        <div class="modal-overlay" (click)="closeBookingDetails()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <button class="close-btn" (click)="closeBookingDetails()">
              <span class="material-icons-outlined">close</span>
            </button>
            
            <div class="modal-header">
              <h2>{{ selectedBooking()?.property_title }}</h2>
              <span class="badge" [class]="selectedBooking()?.status?.toLowerCase()">
                {{ selectedBooking()?.status }}
              </span>
            </div>

            <div class="modal-body">
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Location</span>
                  <span class="value">{{ selectedBooking()?.property_location }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Rent</span>
                  <span class="value">\${{ selectedBooking()?.property_rent }}/mo</span>
                </div>
                <div class="info-item">
                  <span class="label">Request Date</span>
                  <span class="value">{{ selectedBooking()?.request_time | date:'mediumDate' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Duration</span>
                  <span class="value">{{ selectedBooking()?.duration_months }} months</span>
                </div>
              </div>

              @if (selectedBooking()?.message) {
                <div class="message-section">
                  <h3>Your Message</h3>
                  <p>"{{ selectedBooking()?.message }}"</p>
                </div>
              }

              @if (selectedBooking()?.status === 'Approved') {
                <div class="owner-details animate-fade-in">
                  <h3>Owner Contact Details</h3>
                  <div class="contact-grid">
                    <div class="contact-item">
                      <span class="material-icons-outlined">person</span>
                      <div>
                        <span class="label">Name</span>
                        <span class="value">{{ selectedBooking()?.owner_name }}</span>
                      </div>
                    </div>
                    <div class="contact-item">
                      <span class="material-icons-outlined">email</span>
                      <div>
                        <span class="label">Email</span>
                        <span class="value">{{ selectedBooking()?.owner_email }}</span>
                      </div>
                    </div>
                    <div class="contact-item">
                      <span class="material-icons-outlined">phone</span>
                      <div>
                        <span class="label">Phone</span>
                        <span class="value">{{ selectedBooking()?.owner_phone }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Rating Section in Modal -->
                <div class="modal-rating-section animate-fade-in">
                  <div class="rating-box">
                    <label>Rate Property</label>
                    <app-star-rating 
                      [value]="getPropertyRating(selectedBooking()!.property_id)"
                      (ratingChange)="onRateProperty(selectedBooking()!.property_id, $event)"
                      [size]="24"
                    ></app-star-rating>
                  </div>
                  <div class="rating-box">
                    <label>Rate Owner ({{ selectedBooking()?.owner_name }})</label>
                    <app-star-rating 
                      [value]="getUserRating(selectedBooking()!.owner_id)"
                      (ratingChange)="onRateOwner(selectedBooking()!.owner_id, $event)"
                      [size]="24"
                    ></app-star-rating>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

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
      align-items: stretch;
      gap: var(--space-xl);
      padding: var(--space-lg);
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-off-white);
      transition: all var(--transition-fast);
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);

      &:hover {
        background: white;
        transform: translateY(-3px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.06);
        cursor: pointer;
      }
    }

    .booking-image {
      width: 100px;
      height: 100px;
      border-radius: var(--radius-md);
      background: var(--color-off-white);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1px solid rgba(0,0,0,0.03);

      img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
      .material-icons-outlined { font-size: 2.5rem; color: var(--color-silver); }
    }

    .booking-item:hover .booking-image img {
      transform: scale(1.05);
    }

    .booking-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0; /* Important for text truncation/wrapping */
      gap: var(--space-md);
    }

    .booking-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-lg);
    }

    .title-section {
      flex: 1;
      min-width: 0;

      h3 {
        font-size: 1.1rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        margin-bottom: 4px;
        color: var(--color-charcoal);
        line-height: 1.3;
      }

      .location-text {
        font-size: 0.85rem;
        color: var(--color-medium-gray);
        display: flex;
        align-items: flex-start;
        gap: 4px;
        line-height: 1.4;

        .material-icons-outlined {
          font-size: 1rem;
          color: var(--color-charcoal);
          margin-top: 2px;
        }
      }
    }

    .date-section {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: white;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      color: var(--color-gray);
      white-space: nowrap;
      border: 1px solid rgba(0,0,0,0.03);

      .material-icons-outlined {
        font-size: 0.9rem;
      }
    }

    .booking-footer-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-md);
      padding-top: var(--space-md);
      border-top: 1px dashed rgba(0,0,0,0.05);
    }

    .status-section {
      display: flex;
      align-items: center;
      gap: var(--space-md);

      .price-tag {
        font-size: 1rem;
        font-weight: 700;
        color: var(--color-charcoal);
        font-family: 'Playfair Display', serif;
      }

      .badge {
        padding: 4px 12px;
        font-size: 0.7rem;
        border-radius: 50px;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.05em;

        &.pending { background: var(--color-warning); color: var(--color-charcoal); }
        &.approved { background: var(--color-success); color: white; }
        &.rejected { background: var(--color-error); color: white; }
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

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease-out;
    }

    .modal-content {
      background: white;
      border-radius: var(--radius-lg);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: var(--shadow-xl);
      animation: slideUp 0.3s ease-out;
    }

    .close-btn {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--color-off-white);
      }
    }

    .modal-header {
      padding: var(--space-xl);
      border-bottom: 1px solid var(--color-off-white);
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-size: 1.5rem;
        font-family: 'DM Sans', sans-serif;
        color: var(--color-charcoal);
      }
    }

    .modal-body {
      padding: var(--space-xl);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-medium-gray);
        font-weight: 600;
      }

      .value {
        font-size: 1rem;
        color: var(--color-charcoal);
        font-weight: 500;
      }
    }

    .message-section {
      background: var(--color-off-white);
      padding: var(--space-lg);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-xl);

      h3 {
        font-size: 0.9rem;
        font-weight: 600;
        margin-bottom: var(--space-xs);
        color: var(--color-gray);
      }

      p {
        font-style: italic;
        color: var(--color-charcoal);
        line-height: 1.5;
      }
    }

    .owner-details {
      background: #f0f7f4; /* Light mint/green bg */
      padding: var(--space-lg);
      border-radius: var(--radius-md);
      border: 1px solid #dbaeb31a; /* Slight border */

      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: var(--space-md);
        color: var(--color-success);
        display: flex;
        align-items: center;
        gap: var(--space-xs);
      }

      .contact-grid {
        display: grid;
        gap: var(--space-md);
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: var(--space-md);

        .material-icons-outlined {
          color: var(--color-success);
          background: white;
          padding: 8px;
          border-radius: 50%;
          font-size: 1.25rem;
        }

        .label {
            display: block;
            font-size: 0.7rem;
            color: var(--color-gray);
            margin-bottom: 2px;
        }

        .value {
            font-weight: 500;
            color: var(--color-charcoal);
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* Rating specific styles */
    .card-rating-section {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;

      .rating-group {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
      }
    }

    .rating-label {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--color-medium-gray);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .modal-rating-section {
      margin-top: var(--space-xl);
      padding-top: var(--space-xl);
      border-top: 1px dashed var(--color-off-white);
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .rating-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xs);
      
      label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-gray);
        text-transform: uppercase;
      }
    }
  `]
})
export class TenantDashboardComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  selectedBooking = signal<Booking | null>(null);

  // Track ratings locally
  propertyRatings = signal<Record<number, number>>({});
  userRatings = signal<Record<number, number>>({});

  constructor(
    private bookingService: BookingService,
    private ratingService: RatingService,
    private notification: NotificationService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.loadBookings();
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

  getPendingCount() {
    return this.bookings().filter(b => b.status === 'Pending').length;
  }

  getApprovedCount() {
    return this.bookings().filter(b => b.status === 'Approved').length;
  }

  openBookingDetails(booking: Booking) {
    this.selectedBooking.set(booking);
  }

  closeBookingDetails() {
    this.selectedBooking.set(null);
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
}
