import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { interval, Subscription, switchMap, startWith } from 'rxjs';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { RatingService } from '../../../core/services/rating.service';
import { Booking } from '../../../core/models';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatSnackBarModule, StarRatingComponent],
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
                  <div class="booking-card" [class.approved]="booking.status === 'Approved'">
                    <div class="booking-main">
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
                          <span class="price">₹{{ booking.property_rent | number }}/mo</span>
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
                    
                    <!-- Rating Section for Approved Bookings -->
                    @if (booking.status === 'Approved') {
                      <div class="rating-section">
                        <div class="rating-header">
                          <span class="material-icons-outlined">star</span>
                          <h4>Rate Your Experience</h4>
                        </div>
                        <div class="rating-groups">
                          <div class="rating-group">
                            <label>Rate Property</label>
                            <div class="rating-input">
                              <app-star-rating 
                                [value]="getPropertyRating(booking.property_id)"
                                (ratingChange)="onRateProperty(booking.property_id, $event)"
                                [size]="24"
                              ></app-star-rating>
                              @if (getPropertyRating(booking.property_id) > 0) {
                                <span class="rating-saved">✓ Saved</span>
                              }
                            </div>
                          </div>
                          
                          @if (booking.owner_id) {
                            <div class="rating-group">
                              <label>Rate Owner</label>
                              <div class="rating-input">
                                <app-star-rating 
                                  [value]="getUserRating(booking.owner_id)"
                                  (ratingChange)="onRateOwner(booking.owner_id, $event)"
                                  [size]="24"
                                ></app-star-rating>
                                @if (getUserRating(booking.owner_id) > 0) {
                                  <span class="rating-saved">✓ Saved</span>
                                }
                              </div>
                            </div>
                          }
                        </div>
                        
                        <!-- Comment Section -->
                        <div class="comment-section">
                          <textarea 
                            class="comment-input"
                            [placeholder]="'Share your experience about ' + booking.property_title + '...'"
                            [(ngModel)]="propertyComments[booking.property_id]"
                            rows="2"
                          ></textarea>
                          <button 
                            class="btn btn-primary btn-sm submit-review-btn"
                            (click)="submitReview(booking.property_id)"
                            [disabled]="!getPropertyRating(booking.property_id)"
                          >
                            <span class="material-icons-outlined">send</span>
                            Submit Review
                          </button>
                        </div>
                      </div>
                    }
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
      grid-template-columns: 1fr;
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
      gap: var(--space-lg);
    }

    .booking-card {
      background: var(--color-off-white);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: all var(--transition-fast);
      border: 2px solid transparent;

      &:hover {
        box-shadow: var(--shadow-md);
      }
      
      &.approved {
        border-color: rgba(74, 124, 89, 0.3);
        background: linear-gradient(to bottom, rgba(74, 124, 89, 0.05), var(--color-off-white));
      }
    }

    .booking-main {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
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

    /* Rating Section Styles */
    .rating-section {
      padding: var(--space-lg);
      background: white;
      border-top: 1px solid rgba(74, 124, 89, 0.2);
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .rating-header {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);

      .material-icons-outlined {
        color: #FFD700;
        font-size: 1.25rem;
      }

      h4 {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-charcoal);
        margin: 0;
      }
    }

    .rating-groups {
      display: flex;
      gap: var(--space-2xl);
      flex-wrap: wrap;
      margin-bottom: var(--space-lg);
    }

    .rating-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);

      label {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--color-medium-gray);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .rating-input {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .rating-saved {
      font-size: 0.75rem;
      color: var(--color-success);
      font-weight: 500;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .comment-section {
      display: flex;
      gap: var(--space-md);
      align-items: flex-start;

      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    .comment-input {
      flex: 1;
      padding: var(--space-md);
      border: 1px solid var(--color-silver);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;
      min-height: 60px;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--color-accent);
      }

      &::placeholder {
        color: var(--color-medium-gray);
      }
    }

    .submit-review-btn {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      white-space: nowrap;

      .material-icons-outlined {
        font-size: 1rem;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
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

  // Rating states
  propertyRatings = signal<Record<number, number>>({});
  userRatings = signal<Record<number, number>>({});
  propertyComments: Record<number, string> = {};

  private pollingSubscription?: Subscription;

  constructor(
    private bookingService: BookingService,
    private ratingService: RatingService,
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

  // Rating Methods
  getPropertyRating(propertyId: number): number {
    return this.propertyRatings()[propertyId] || 0;
  }

  getUserRating(userId: number): number {
    return this.userRatings()[userId] || 0;
  }

  onRateProperty(propertyId: number, rating: number) {
    // Update UI immediately
    this.propertyRatings.update(prev => ({ ...prev, [propertyId]: rating }));
    
    // Save to backend
    this.ratingService.submitPropertyRating(propertyId, rating, this.propertyComments[propertyId]).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Property rating saved!', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to save rating', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        // Revert on error
        this.propertyRatings.update(prev => ({ ...prev, [propertyId]: 0 }));
      }
    });
  }

  onRateOwner(ownerId: number, rating: number) {
    // Update UI immediately
    this.userRatings.update(prev => ({ ...prev, [ownerId]: rating }));
    
    // Save to backend
    this.ratingService.submitUserRating(ownerId, rating).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Owner rating saved!', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to save rating', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        // Revert on error
        this.userRatings.update(prev => ({ ...prev, [ownerId]: 0 }));
      }
    });
  }

  submitReview(propertyId: number) {
    const rating = this.getPropertyRating(propertyId);
    const comment = this.propertyComments[propertyId] || '';

    if (!rating) {
      this.snackBar.open('Please select a rating first', 'Close', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.ratingService.submitPropertyRating(propertyId, rating, comment).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Review submitted successfully! 🎉', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar']
          });
          // Clear the comment after successful submission
          this.propertyComments[propertyId] = '';
        }
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to submit review', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }
}
