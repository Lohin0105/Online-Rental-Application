import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';
import { Property } from '../../core/models';

@Component({
    selector: 'app-booking-request',
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="booking-page">
      <div class="container">
        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading...</p>
          </div>
        } @else if (property()) {
          <div class="booking-layout animate-fade-in-up">
            <!-- Property Summary -->
            <div class="property-summary">
              <a [routerLink]="['/properties', property()!.id]" class="back-link">
                <span class="material-icons-outlined">arrow_back</span>
                Back to property
              </a>
              
              <div class="summary-card">
                @if (property()!.photos && property()!.photos.length > 0) {
                  <img [src]="property()!.photos[0]" [alt]="property()!.title" class="summary-image">
                } @else {
                  <div class="summary-image placeholder">
                    <span class="material-icons-outlined">home</span>
                  </div>
                }
                
                <div class="summary-details">
                  <h2>{{ property()!.title }}</h2>
                  <p class="location">
                    <span class="material-icons-outlined">location_on</span>
                    {{ property()!.location }}
                  </p>
                  <div class="price">
                    <span class="amount">\${{ property()!.rent | number }}</span>
                    <span class="period">/month</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking Form -->
            <div class="booking-form-section">
              <h1>Request Booking</h1>
              <p class="form-subtitle">Submit your booking request to the property owner</p>

              <form (ngSubmit)="submitBooking()" #bookingForm="ngForm">
                <!-- Move-in Date -->
                <div class="form-group">
                  <label class="form-label">Preferred Move-in Date</label>
                  <input 
                    type="date" 
                    class="form-input"
                    [(ngModel)]="bookingData.move_in_date"
                    name="move_in_date"
                    [min]="minDate"
                  >
                </div>

                <!-- Duration -->
                <div class="form-group">
                  <label class="form-label">Rental Duration (Months)</label>
                  <div class="duration-options">
                    @for (duration of durationOptions; track duration) {
                      <button 
                        type="button"
                        class="duration-btn"
                        [class.active]="bookingData.duration_months === duration"
                        (click)="selectDuration(duration)"
                      >
                        {{ duration }} {{ duration === 1 ? 'month' : 'months' }}
                      </button>
                    }
                  </div>
                </div>

                <!-- Message -->
                <div class="form-group">
                  <label class="form-label">Message to Owner (Optional)</label>
                  <textarea 
                    class="form-input"
                    rows="4"
                    placeholder="Introduce yourself and explain why you're interested in this property..."
                    [(ngModel)]="bookingData.message"
                    name="message"
                  ></textarea>
                </div>

                <!-- Summary -->
                <div class="booking-summary">
                  <h4>Booking Summary</h4>
                  <div class="summary-row">
                    <span>Monthly Rent</span>
                    <span>\${{ property()!.rent | number }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Duration</span>
                    <span>{{ bookingData.duration_months }} months</span>
                  </div>
                  <div class="summary-row total">
                    <span>Estimated Total</span>
                    <span>\${{ (property()!.rent * bookingData.duration_months) | number }}</span>
                  </div>
                </div>

                <!-- Submit -->
                <button 
                  type="submit" 
                  class="btn btn-primary btn-lg"
                  [disabled]="submitting()"
                >
                  @if (submitting()) {
                    <span class="spinner-small"></span>
                    Submitting...
                  } @else {
                    Submit Request
                    <span class="material-icons-outlined">send</span>
                  }
                </button>

                <p class="form-note">
                  <span class="material-icons-outlined">info</span>
                  Your request will be sent to the property owner for approval
                </p>
              </form>
            </div>
          </div>
        } @else {
          <div class="error-state">
            <span class="material-icons-outlined">error_outline</span>
            <h2>Property Not Found</h2>
            <a routerLink="/properties" class="btn btn-primary">Browse Properties</a>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    .booking-page {
      min-height: 100vh;
      padding: var(--space-2xl) 0;
      background: var(--color-off-white);
    }

    .loading-state, .error-state {
      min-height: 50vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;

      .spinner {
        width: 48px;
        height: 48px;
        border: 3px solid var(--color-silver);
        border-top-color: var(--color-charcoal);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: var(--space-lg);
      }

      .material-icons-outlined {
        font-size: 4rem;
        color: var(--color-silver);
        margin-bottom: var(--space-lg);
      }
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .booking-layout {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: var(--space-2xl);
      max-width: 1000px;
      margin: 0 auto;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-gray);
      font-size: 0.875rem;
      margin-bottom: var(--space-lg);
      transition: color var(--transition-fast);

      &:hover { color: var(--color-charcoal); }
    }

    .summary-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--color-silver);

      .summary-image {
        width: 100%;
        aspect-ratio: 16/10;
        object-fit: cover;

        &.placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-off-white);

          .material-icons-outlined {
            font-size: 4rem;
            color: var(--color-silver);
          }
        }
      }

      .summary-details {
        padding: var(--space-lg);

        h2 {
          font-size: 1.25rem;
          margin-bottom: var(--space-sm);
        }

        .location {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          color: var(--color-medium-gray);
          font-size: 0.875rem;
          margin-bottom: var(--space-md);

          .material-icons-outlined {
            font-size: 1rem;
            color: var(--color-accent);
          }
        }

        .price {
          .amount {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .period {
            color: var(--color-medium-gray);
          }
        }
      }
    }

    .booking-form-section {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-2xl);
      border: 1px solid var(--color-silver);

      h1 {
        font-size: 1.5rem;
        margin-bottom: var(--space-sm);
      }

      .form-subtitle {
        color: var(--color-medium-gray);
        margin-bottom: var(--space-xl);
      }
    }

    .duration-options {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .duration-btn {
      padding: var(--space-sm) var(--space-lg);
      background: var(--color-off-white);
      border: 1px solid transparent;
      border-radius: 50px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover { border-color: var(--color-silver); }

      &.active {
        background: var(--color-charcoal);
        color: white;
      }
    }

    .booking-summary {
      background: var(--color-off-white);
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      margin-bottom: var(--space-xl);

      h4 {
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: var(--space-md);
        font-family: 'DM Sans', sans-serif;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: var(--space-sm) 0;
        font-size: 0.875rem;
        color: var(--color-gray);

        &.total {
          border-top: 1px solid var(--color-silver);
          margin-top: var(--space-sm);
          padding-top: var(--space-md);
          font-weight: 600;
          color: var(--color-charcoal);
          font-size: 1rem;
        }
      }
    }

    .btn {
      width: 100%;
      justify-content: center;

      .spinner-small {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: var(--space-sm);
      }
    }

    .form-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      margin-top: var(--space-lg);
      font-size: 0.8rem;
      color: var(--color-medium-gray);

      .material-icons-outlined { font-size: 1rem; }
    }
  `]
})
export class BookingRequestComponent implements OnInit {
  property = signal<Property | null>(null);
  loading = signal(true);
  submitting = signal(false);

  bookingData = {
    move_in_date: '',
    duration_months: 12,
    message: ''
  };

  minDate = new Date().toISOString().split('T')[0];
  durationOptions = [3, 6, 12, 24];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private bookingService: BookingService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(parseInt(id));
    }
  }

  loadProperty(id: number) {
    this.propertyService.getPropertyById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.property.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectDuration(duration: number) {
    this.bookingData.duration_months = duration;
  }

  submitBooking() {
    if (!this.property()) return;

    this.submitting.set(true);
    this.bookingService.createBooking({
      property_id: this.property()!.id,
      message: this.bookingData.message || undefined,
      move_in_date: this.bookingData.move_in_date || undefined,
      duration_months: this.bookingData.duration_months
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Booking request submitted successfully!');
          this.router.navigate(['/tenant/bookings']);
        } else {
          this.notification.error(response.message || 'Failed to submit booking');
        }
        this.submitting.set(false);
      },
      error: (error) => {
        this.notification.error(error.error?.message || 'Failed to submit booking');
        this.submitting.set(false);
      }
    });
  }
}

