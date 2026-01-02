import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { AuthService } from '../../core/services/auth.service';
import { RatingService } from '../../core/services/rating.service';
import { Property } from '../../core/models';
import { PropertyRatingResponse } from '../../core/models/rating.model';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-property-details',
  imports: [CommonModule, RouterLink, StarRatingComponent],
  template: `
    @if (loading()) {
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading property details...</p>
      </div>
    } @else if (property()) {
      <div class="property-details-page">
        <!-- Gallery Section -->
        <section class="gallery-section animate-fade-in">
          <div class="gallery-grid">
            @if (property()!.photos && property()!.photos.length > 0) {
              <div class="main-image">
                <img [src]="selectedImage()" [alt]="property()!.title">
              </div>
              @if (property()!.photos.length > 1) {
                <div class="thumbnail-strip">
                  @for (photo of property()!.photos; track photo; let i = $index) {
                    <button 
                      class="thumbnail" 
                      [class.active]="selectedImage() === photo"
                      (click)="selectImage(photo)"
                    >
                      <img [src]="photo" [alt]="'Image ' + (i + 1)">
                    </button>
                  }
                </div>
              }
            } @else {
              <div class="main-image placeholder">
                <span class="material-icons-outlined">home</span>
              </div>
            }
          </div>
        </section>

        <div class="container">
          <div class="details-layout">
            <!-- Main Content -->
            <main class="details-main">
              <!-- Header -->
              <header class="property-header animate-fade-in-up">
                <div class="badges">
                  <span class="badge badge-type">{{ property()!.property_type | titlecase }}</span>
                  @if (property()!.is_available) {
                    <span class="badge badge-available">Available</span>
                  } @else {
                    <span class="badge badge-unavailable">Rented</span>
                  }
                </div>
                
                <h1>{{ property()!.title }}</h1>
                
                <div class="header-meta">
                  <div class="location">
                    <span class="material-icons-outlined">location_on</span>
                    {{ property()!.location }}
                  </div>
                  
                  @if (ratingData()?.summary?.rating_count! > 0) {
                    <div class="rating-summary">
                      <app-star-rating 
                        [value]="+ratingData()?.summary?.average_rating!" 
                        [readOnly]="true" 
                        [size]="18"
                      ></app-star-rating>
                      <span class="rating-count">
                        ({{ ratingData()?.summary?.rating_count }} {{ ratingData()?.summary?.rating_count === 1 ? 'review' : 'reviews' }})
                      </span>
                    </div>
                  }
                </div>
              </header>

              <!-- Features -->
              <div class="features-grid animate-fade-in-up delay-1">
                <div class="feature-item">
                  <span class="material-icons-outlined">bed</span>
                  <div>
                    <span class="feature-value">{{ property()!.bedrooms }}</span>
                    <span class="feature-label">Bedrooms</span>
                  </div>
                </div>
                <div class="feature-item">
                  <span class="material-icons-outlined">bathtub</span>
                  <div>
                    <span class="feature-value">{{ property()!.bathrooms }}</span>
                    <span class="feature-label">Bathrooms</span>
                  </div>
                </div>
                @if (property()!.area_sqft) {
                  <div class="feature-item">
                    <span class="material-icons-outlined">square_foot</span>
                    <div>
                      <span class="feature-value">{{ property()!.area_sqft }}</span>
                      <span class="feature-label">Sq. Ft.</span>
                    </div>
                  </div>
                }
              </div>

              <!-- Description -->
              <section class="content-section animate-fade-in-up delay-2">
                <h2>About This Property</h2>
                <p class="description">
                  {{ property()!.description || 'No description available for this property.' }}
                </p>
              </section>

              <!-- Amenities -->
              @if (property()!.amenities && property()!.amenities.length > 0) {
                <section class="content-section animate-fade-in-up delay-3">
                  <h2>Amenities</h2>
                  <div class="amenities-grid">
                    @for (amenity of property()!.amenities; track amenity) {
                      <div class="amenity-item">
                        <span class="material-icons-outlined">check_circle</span>
                        {{ amenity }}
                      </div>
                    }
                  </div>
                </section>
              }
              <!-- Reviews -->
              <section class="reviews-section animate-fade-in-up delay-4">
                <div class="section-header">
                  <h2>Reviews</h2>
                </div>

                @if (ratingData()?.reviews && ratingData()!.reviews!.length > 0) {
                  <div class="reviews-list">
                    @for (review of ratingData()!.reviews; track review.id) {
                      <div class="review-item">
                        <div class="review-header">
                          <div class="reviewer-avatar">
                            @if (review.reviewer_avatar) {
                              <img [src]="review.reviewer_avatar" [alt]="review.reviewer_name">
                            } @else {
                              {{ review.reviewer_name?.charAt(0) || 'U' }}
                            }
                          </div>
                          <div class="reviewer-info">
                            <div class="reviewer-meta">
                              <span class="reviewer-name">{{ review.reviewer_name }}</span>
                              <span class="review-date">{{ review.created_at | date }}</span>
                            </div>
                            <app-star-rating 
                              [value]="review.rating" 
                              [readOnly]="true" 
                              [size]="14"
                            ></app-star-rating>
                          </div>
                        </div>
                        @if (review.comment) {
                          <p class="review-comment">"{{ review.comment }}"</p>
                        }
                      </div>
                    }
                  </div>
                } @else if (!loadingRatings()) {
                  <div class="empty-reviews">
                    <p>No reviews yet for this property.</p>
                  </div>
                }
              </section>
            </main>

            <!-- Sidebar -->
            <aside class="details-sidebar animate-slide-right">
              <div class="booking-card">
                <div class="price">
                  <span class="amount">\${{ property()!.rent | number }}</span>
                  <span class="period">/month</span>
                </div>

                @if (property()!.is_available) {
                  @if (auth.isAuthenticated()) {
                    @if (auth.isTenant()) {
                      <a [routerLink]="['/properties', property()!.id, 'book']" class="btn btn-primary btn-lg">
                        Request Booking
                        <span class="material-icons-outlined">send</span>
                      </a>
                    } @else {
                      <p class="owner-notice">You are viewing this as an owner</p>
                    }
                  } @else {
                    <a routerLink="/login" class="btn btn-primary btn-lg">
                      Sign in to Book
                    </a>
                    <p class="login-hint">or <a routerLink="/register">create an account</a></p>
                  }
                } @else {
                  <button class="btn btn-secondary btn-lg" disabled>
                    Currently Rented
                  </button>
                }

                <div class="divider"></div>

                <!-- Owner Info -->
                <div class="owner-info">
                  <h4>Property Owner</h4>
                  <div class="owner-details">
                    <div class="owner-avatar">
                      {{ property()!.owner_name?.charAt(0) || 'O' }}
                    </div>
                    <div>
                      <p class="owner-name">{{ property()!.owner_name || 'Property Owner' }}</p>
                      @if (auth.isAuthenticated() && property()!.owner_email) {
                        <p class="owner-contact">{{ property()!.owner_email }}</p>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="quick-actions">
                <button class="action-btn">
                  <span class="material-icons-outlined">favorite_border</span>
                  Save
                </button>
                <button class="action-btn">
                  <span class="material-icons-outlined">share</span>
                  Share
                </button>
                <button class="action-btn">
                  <span class="material-icons-outlined">flag</span>
                  Report
                </button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    } @else {
      <div class="error-state">
        <span class="material-icons-outlined">error_outline</span>
        <h2>Property Not Found</h2>
        <p>The property you're looking for doesn't exist or has been removed.</p>
        <a routerLink="/properties" class="btn btn-primary">Browse Properties</a>
      </div>
    }
  `,
  styles: [`
    .loading-state, .error-state {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--space-2xl);

      .material-icons-outlined {
        font-size: 4rem;
        color: var(--color-silver);
        margin-bottom: var(--space-lg);
      }

      h2 { margin-bottom: var(--space-sm); }
      p { color: var(--color-medium-gray); margin-bottom: var(--space-lg); }
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 3px solid var(--color-off-white);
      border-top-color: var(--color-charcoal);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: var(--space-lg);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .gallery-section {
      background: var(--color-off-white);
      padding: var(--space-lg);
    }

    .gallery-grid {
      max-width: 1200px;
      margin: 0 auto;
    }

    .main-image {
      aspect-ratio: 16/9;
      border-radius: var(--radius-lg);
      overflow: hidden;
      background: var(--color-silver);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.placeholder {
        display: flex;
        align-items: center;
        justify-content: center;

        .material-icons-outlined {
          font-size: 6rem;
          color: var(--color-light-gray);
        }
      }
    }

    .thumbnail-strip {
      display: flex;
      gap: var(--space-sm);
      margin-top: var(--space-md);
      overflow-x: auto;
      padding-bottom: var(--space-sm);
    }

    .thumbnail {
      flex-shrink: 0;
      width: 100px;
      height: 75px;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all var(--transition-fast);
      padding: 0;
      background: none;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &:hover { border-color: var(--color-silver); }
      &.active { border-color: var(--color-charcoal); }
    }

    .details-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: var(--space-2xl);
      padding: var(--space-2xl) 0;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .property-header {
      margin-bottom: var(--space-xl);

      .badges {
        display: flex;
        gap: var(--space-sm);
        margin-bottom: var(--space-md);
      }

      .badge {
        padding: var(--space-xs) var(--space-md);
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: var(--radius-sm);

        &.badge-type {
          background: var(--color-off-white);
          color: var(--color-charcoal);
        }

        &.badge-available {
          background: var(--color-success);
          color: white;
        }

        &.badge-unavailable {
          background: var(--color-error);
          color: white;
        }
      }

      h1 {
        font-size: clamp(1.5rem, 3vw, 2.25rem);
        margin-bottom: var(--space-sm);
      }

      .location {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        color: var(--color-medium-gray);

        .material-icons-outlined {
          font-size: 1.25rem;
          color: var(--color-accent);
        }
      }
    }

    .features-grid {
      display: flex;
      gap: var(--space-xl);
      padding: var(--space-lg);
      background: var(--color-off-white);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-xl);
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);

      .material-icons-outlined {
        font-size: 1.5rem;
        color: var(--color-accent);
      }

      .feature-value {
        display: block;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-charcoal);
      }

      .feature-label {
        font-size: 0.8rem;
        color: var(--color-medium-gray);
      }
    }

    .content-section {
      margin-bottom: var(--space-xl);

      h2 {
        font-size: 1.25rem;
        margin-bottom: var(--space-md);
      }

      .description {
        line-height: 1.8;
        color: var(--color-gray);
      }
    }

    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--space-md);
    }

    .amenity-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md);
      background: var(--color-off-white);
      border-radius: var(--radius-md);
      font-size: 0.9rem;

      .material-icons-outlined {
        font-size: 1.25rem;
        color: var(--color-success);
      }
    }

    .booking-card {
      background: white;
      border: 1px solid var(--color-off-white);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      position: sticky;
      top: 100px;

      .price {
        margin-bottom: var(--space-lg);

        .amount {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-charcoal);
        }

        .period {
          color: var(--color-medium-gray);
        }
      }

      .btn {
        width: 100%;
        justify-content: center;
      }

      .owner-notice {
        text-align: center;
        padding: var(--space-md);
        background: var(--color-off-white);
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        color: var(--color-medium-gray);
      }

      .login-hint {
        text-align: center;
        margin-top: var(--space-sm);
        font-size: 0.875rem;
        color: var(--color-medium-gray);

        a { color: var(--color-accent); }
      }

      .divider {
        height: 1px;
        background: var(--color-off-white);
        margin: var(--space-lg) 0;
      }
    }

    .owner-info {
      h4 {
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-medium-gray);
        margin-bottom: var(--space-md);
        font-family: 'DM Sans', sans-serif;
      }
    }

    .owner-details {
      display: flex;
      align-items: center;
      gap: var(--space-md);

      .owner-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--color-charcoal);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 1.25rem;
      }

      .owner-name {
        font-weight: 500;
        color: var(--color-charcoal);
      }

      .owner-contact {
        font-size: 0.8rem;
        color: var(--color-medium-gray);
      }
    }

    .quick-actions {
      display: flex;
      gap: var(--space-sm);
      margin-top: var(--space-lg);
    }

    .action-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-md);
      background: var(--color-off-white);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 0.75rem;
      color: var(--color-gray);
      transition: all var(--transition-fast);

      .material-icons-outlined { font-size: 1.25rem; }

      &:hover {
        background: var(--color-charcoal);
        color: white;
      }
    }

    .header-meta {
      display: flex;
      align-items: center;
      gap: var(--space-xl);
      flex-wrap: wrap;
    }

    .rating-summary {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      
      .rating-count {
        font-size: 0.875rem;
        color: var(--color-medium-gray);
      }
    }

    .reviews-section {
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-xl);
        
        h2 { margin-bottom: 0; }
      }

      .overall-rating {
        display: flex;
        align-items: center;
        gap: var(--space-md);

        .big-rating {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-charcoal);
        }
      }
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .review-item {
      padding-bottom: var(--space-xl);
      border-bottom: 1px solid var(--color-off-white);
      
      &:last-child {
        border-bottom: none;
      }
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
    }

    .reviewer-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--color-silver-light, #eee);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--color-medium-gray);
      overflow: hidden;

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .reviewer-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .reviewer-meta {
         display: flex;
         align-items: center;
         gap: var(--space-md);
      }

      .reviewer-name {
        font-weight: 600;
        color: var(--color-charcoal);
      }

      .review-date {
        font-size: 0.75rem;
        color: var(--color-medium-gray);
      }
    }

    .review-comment {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--color-gray);
      font-style: italic;
    }

    .empty-reviews {
      padding: var(--space-xl);
      text-align: center;
      background: var(--color-off-white);
      border-radius: var(--radius-md);
      color: var(--color-medium-gray);
    }
  `]
})
export class PropertyDetailsComponent implements OnInit {
  property = signal<Property | null>(null);
  loading = signal(true);
  selectedImage = signal<string>('');

  ratingData = signal<PropertyRatingResponse | null>(null);
  loadingRatings = signal(false);

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private ratingService: RatingService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const propertyId = parseInt(id);
      this.loadProperty(propertyId);
      this.loadRatings(propertyId);
    }
  }

  loadRatings(id: number) {
    this.loadingRatings.set(true);
    this.ratingService.getPropertyRatings(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.ratingData.set(response.data);
        }
        this.loadingRatings.set(false);
      },
      error: () => this.loadingRatings.set(false)
    });
  }

  loadProperty(id: number) {
    this.propertyService.getPropertyById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.property.set(response.data);
          if (response.data.photos && response.data.photos.length > 0) {
            this.selectedImage.set(response.data.photos[0]);
          }
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectImage(photo: string) {
    this.selectedImage.set(photo);
  }
}

