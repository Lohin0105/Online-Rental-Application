import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Property } from '../../../core/models';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-property-card',
  imports: [CommonModule, RouterLink, StarRatingComponent],
  template: `
    <article class="property-card" [routerLink]="['/properties', property.id]">
      <!-- Image -->
      <div class="card-image">
        @if (property.photos && property.photos.length > 0) {
          <img [src]="property.photos[0]" [alt]="property.title" loading="lazy">
        } @else {
          <div class="placeholder-image">
            <span class="material-icons-outlined">home</span>
          </div>
        }
        
        <!-- Badges -->
        <div class="badges">
          @if (!property.is_available) {
            <span class="badge badge-unavailable">Rented</span>
          }
          <span class="badge badge-type">{{ property.property_type | titlecase }}</span>
        </div>
        
        <!-- Favorite Button -->
        <button class="favorite-btn" (click)="toggleFavorite($event)">
          <span class="material-icons-outlined">
            {{ isFavorite ? 'favorite' : 'favorite_border' }}
          </span>
        </button>
      </div>
      
      <!-- Content -->
      <div class="card-content">
        <div class="location">
          <span class="material-icons-outlined">location_on</span>
          {{ property.location }}
        </div>
        
        <h3 class="title">{{ property.title }}</h3>
        
        @if (property.rating_count! > 0) {
          <div class="rating-preview">
            <app-star-rating 
              [value]="+property.average_rating!" 
              [readOnly]="true" 
              [size]="16"
            ></app-star-rating>
            <span class="rating-count">({{ property.rating_count }})</span>
          </div>
        }
        
        <div class="features">
          <span class="feature">
            <span class="material-icons-outlined">bed</span>
            {{ property.bedrooms }} {{ property.bedrooms === 1 ? 'Bed' : 'Beds' }}
          </span>
          <span class="feature">
            <span class="material-icons-outlined">bathtub</span>
            {{ property.bathrooms }} {{ property.bathrooms === 1 ? 'Bath' : 'Baths' }}
          </span>
          @if (property.area_sqft) {
            <span class="feature">
              <span class="material-icons-outlined">square_foot</span>
              {{ property.area_sqft }} sqft
            </span>
          }
        </div>
        
        <!-- Amenities Preview -->
        @if (property.amenities && property.amenities.length > 0) {
          <div class="amenities-preview">
            @for (amenity of property.amenities.slice(0, 3); track amenity) {
              <span class="amenity-tag">{{ amenity }}</span>
            }
            @if (property.amenities.length > 3) {
              <span class="amenity-more">+{{ property.amenities.length - 3 }}</span>
            }
          </div>
        }
        
        <div class="card-footer">
          <div class="price">
            <span class="amount">\${{ property.rent | number }}</span>
            <span class="period">/month</span>
          </div>
          
          <span class="view-link">
            View Details
            <span class="material-icons-outlined">arrow_forward</span>
          </span>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .property-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      cursor: pointer;
      transition: all var(--transition-base);
      border: 1px solid var(--color-off-white);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-xl);
        border-color: transparent;
        
        .card-image img {
          transform: scale(1.05);
        }
        
        .view-link {
          color: var(--color-accent);
          gap: var(--space-sm);
        }
      }
    }
    
    .card-image {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
      background: var(--color-off-white);
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-slow);
      }
      
      .placeholder-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--color-off-white), var(--color-silver));
        
        .material-icons-outlined {
          font-size: 4rem;
          color: var(--color-light-gray);
        }
      }
    }
    
    .badges {
      position: absolute;
      top: var(--space-md);
      left: var(--space-md);
      display: flex;
      gap: var(--space-sm);
      
      .badge {
        padding: var(--space-xs) var(--space-sm);
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: var(--radius-sm);
        
        &.badge-type {
          background: white;
          color: var(--color-charcoal);
        }
        
        &.badge-unavailable {
          background: var(--color-error);
          color: white;
        }
      }
    }
    
    .favorite-btn {
      position: absolute;
      top: var(--space-md);
      right: var(--space-md);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-md);
      
      .material-icons-outlined {
        font-size: 1.25rem;
        color: var(--color-gray);
        transition: all var(--transition-fast);
      }
      
      &:hover {
        transform: scale(1.1);
        
        .material-icons-outlined {
          color: var(--color-error);
        }
      }
    }
    
    .card-content {
      padding: var(--space-lg);
    }
    
    .location {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: 0.8rem;
      color: var(--color-medium-gray);
      margin-bottom: var(--space-sm);
      
      .material-icons-outlined {
        font-size: 1rem;
        color: var(--color-accent);
      }
    }
    
    .title {
      font-size: 1.125rem;
      font-weight: 500;
      color: var(--color-charcoal);
      margin-bottom: var(--space-md);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .rating-preview {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      margin-bottom: var(--space-md);
      
      .rating-count {
        font-size: 0.75rem;
        color: var(--color-medium-gray);
      }
    }
    
    .features {
      display: flex;
      gap: var(--space-lg);
      margin-bottom: var(--space-md);
      
      .feature {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
        font-size: 0.8rem;
        color: var(--color-gray);
        
        .material-icons-outlined {
          font-size: 1rem;
        }
      }
    }
    
    .amenities-preview {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
      margin-bottom: var(--space-md);
      
      .amenity-tag {
        padding: var(--space-xs) var(--space-sm);
        font-size: 0.7rem;
        background: var(--color-off-white);
        color: var(--color-gray);
        border-radius: var(--radius-sm);
      }
      
      .amenity-more {
        padding: var(--space-xs) var(--space-sm);
        font-size: 0.7rem;
        background: var(--color-charcoal);
        color: white;
        border-radius: var(--radius-sm);
      }
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-off-white);
    }
    
    .price {
      .amount {
        font-family: 'Playfair Display', serif;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-charcoal);
      }
      
      .period {
        font-size: 0.8rem;
        color: var(--color-medium-gray);
      }
    }
    
    .view-link {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-gray);
      transition: all var(--transition-fast);
      
      .material-icons-outlined {
        font-size: 1rem;
        transition: transform var(--transition-fast);
      }
    }
  `]
})
export class PropertyCardComponent {
  @Input({ required: true }) property!: Property;

  isFavorite = false;

  toggleFavorite(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.isFavorite = !this.isFavorite;
  }
}

