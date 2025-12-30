import { Component, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Property } from '../../../core/models';

@Component({
    selector: 'app-property-form',
    imports: [FormsModule, RouterLink],
    template: `
    <div class="property-form-page">
      <div class="container">
        <a routerLink="/owner/dashboard" class="back-link animate-fade-in">
          <span class="material-icons-outlined">arrow_back</span>
          Back to Dashboard
        </a>

        <div class="form-container animate-fade-in-up">
          <h1>{{ isEditMode() ? 'Edit Property' : 'Add New Property' }}</h1>
          <p class="form-subtitle">{{ isEditMode() ? 'Update your property details' : 'Fill in the details to list your property' }}</p>

          <form (ngSubmit)="submitForm()" #propertyForm="ngForm">
            <!-- Basic Info -->
            <section class="form-section">
              <h3>Basic Information</h3>
              
              <div class="form-group">
                <label class="form-label">Property Title *</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="e.g., Cozy 2BR Apartment in Downtown"
                  [(ngModel)]="formData.title"
                  name="title"
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea 
                  class="form-input"
                  rows="4"
                  placeholder="Describe your property..."
                  [(ngModel)]="formData.description"
                  name="description"
                ></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Property Type</label>
                  <select class="form-input" [(ngModel)]="formData.property_type" name="property_type">
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="studio">Studio</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Monthly Rent ($) *</label>
                  <input 
                    type="number" 
                    class="form-input"
                    placeholder="1500"
                    [(ngModel)]="formData.rent"
                    name="rent"
                    required
                    min="1"
                  >
                </div>
              </div>
            </section>

            <!-- Location -->
            <section class="form-section">
              <h3>Location</h3>
              
              <div class="form-group">
                <label class="form-label">Full Address *</label>
                <input 
                  type="text" 
                  class="form-input"
                  placeholder="123 Main Street, City, State 12345"
                  [(ngModel)]="formData.location"
                  name="location"
                  required
                >
              </div>
            </section>

            <!-- Property Details -->
            <section class="form-section">
              <h3>Property Details</h3>
              
              <div class="form-row form-row-3">
                <div class="form-group">
                  <label class="form-label">Bedrooms</label>
                  <input 
                    type="number" 
                    class="form-input"
                    [(ngModel)]="formData.bedrooms"
                    name="bedrooms"
                    min="1"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Bathrooms</label>
                  <input 
                    type="number" 
                    class="form-input"
                    [(ngModel)]="formData.bathrooms"
                    name="bathrooms"
                    min="1"
                  >
                </div>

                <div class="form-group">
                  <label class="form-label">Area (sq ft)</label>
                  <input 
                    type="number" 
                    class="form-input"
                    [(ngModel)]="formData.area_sqft"
                    name="area_sqft"
                    min="1"
                  >
                </div>
              </div>
            </section>

            <!-- Amenities -->
            <section class="form-section">
              <h3>Amenities</h3>
              <p class="section-hint">Select all that apply</p>
              
              <div class="amenities-grid">
                @for (amenity of availableAmenities; track amenity) {
                  <label class="amenity-checkbox">
                    <input 
                      type="checkbox" 
                      [checked]="formData.amenities.includes(amenity)"
                      (change)="toggleAmenity(amenity)"
                    >
                    <span class="checkbox-custom"></span>
                    <span class="amenity-name">{{ amenity }}</span>
                  </label>
                }
              </div>
            </section>

            <!-- Photos -->
            <section class="form-section">
              <h3>Photos</h3>
              <p class="section-hint">Add photo URLs (one per line)</p>
              
              <div class="form-group">
                <textarea 
                  class="form-input"
                  rows="4"
                  placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                  [(ngModel)]="photosText"
                  name="photos"
                ></textarea>
              </div>

              @if (formData.photos.length > 0) {
                <div class="photo-preview">
                  @for (photo of formData.photos; track photo; let i = $index) {
                    <div class="preview-item">
                      <img [src]="photo" [alt]="'Photo ' + (i + 1)">
                      <button type="button" class="remove-photo" (click)="removePhoto(i)">
                        <span class="material-icons-outlined">close</span>
                      </button>
                    </div>
                  }
                </div>
              }
            </section>

            <!-- Availability -->
            <section class="form-section">
              <h3>Availability</h3>
              
              <label class="toggle-option">
                <input 
                  type="checkbox" 
                  [(ngModel)]="formData.is_available"
                  name="is_available"
                >
                <span class="toggle-custom"></span>
                <span>Property is available for rent</span>
              </label>
            </section>

            <!-- Submit -->
            <div class="form-actions">
              <a routerLink="/owner/dashboard" class="btn btn-secondary">Cancel</a>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="propertyForm.invalid || submitting()"
              >
                @if (submitting()) {
                  <span class="spinner-small"></span>
                  Saving...
                } @else {
                  {{ isEditMode() ? 'Update Property' : 'List Property' }}
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .property-form-page {
      min-height: 100vh;
      padding: var(--space-2xl) 0;
      background: var(--color-off-white);
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-gray);
      font-size: 0.875rem;
      margin-bottom: var(--space-xl);
      transition: color var(--transition-fast);

      &:hover { color: var(--color-charcoal); }
    }

    .form-container {
      max-width: 720px;
      margin: 0 auto;
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      border: 1px solid var(--color-off-white);

      h1 {
        font-size: 1.75rem;
        margin-bottom: var(--space-sm);
      }

      .form-subtitle {
        color: var(--color-medium-gray);
        margin-bottom: var(--space-2xl);
      }
    }

    .form-section {
      margin-bottom: var(--space-2xl);
      padding-bottom: var(--space-xl);
      border-bottom: 1px solid var(--color-off-white);

      &:last-of-type {
        border-bottom: none;
        margin-bottom: var(--space-lg);
      }

      h3 {
        font-size: 1rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
        margin-bottom: var(--space-md);
      }

      .section-hint {
        font-size: 0.8rem;
        color: var(--color-medium-gray);
        margin-bottom: var(--space-md);
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .form-row-3 {
      grid-template-columns: repeat(3, 1fr);

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    select.form-input {
      cursor: pointer;
    }

    .amenities-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-sm);

      @media (max-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .amenity-checkbox {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      background: var(--color-off-white);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);

      input { display: none; }

      .checkbox-custom {
        width: 18px;
        height: 18px;
        border: 2px solid var(--color-silver);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast);

        &::after {
          content: '✓';
          color: white;
          font-size: 0.7rem;
          opacity: 0;
          transform: scale(0);
          transition: all var(--transition-fast);
        }
      }

      input:checked + .checkbox-custom {
        background: var(--color-charcoal);
        border-color: var(--color-charcoal);

        &::after {
          opacity: 1;
          transform: scale(1);
        }
      }

      .amenity-name {
        font-size: 0.8rem;
      }

      &:hover {
        background: var(--color-silver);
      }
    }

    .photo-preview {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      margin-top: var(--space-md);
    }

    .preview-item {
      position: relative;
      width: 100px;
      height: 75px;
      border-radius: var(--radius-md);
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .remove-photo {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: rgba(0,0,0,0.6);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        .material-icons-outlined {
          font-size: 1rem;
          color: white;
        }
      }
    }

    .toggle-option {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      cursor: pointer;

      input { display: none; }

      .toggle-custom {
        width: 48px;
        height: 26px;
        background: var(--color-silver);
        border-radius: 13px;
        position: relative;
        transition: all var(--transition-fast);

        &::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: all var(--transition-fast);
        }
      }

      input:checked + .toggle-custom {
        background: var(--color-success);

        &::after {
          left: 25px;
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      padding-top: var(--space-xl);
      border-top: 1px solid var(--color-off-white);

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

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class PropertyFormComponent implements OnInit {
  isEditMode = signal(false);
  submitting = signal(false);
  propertyId: number | null = null;
  photosText = '';

  formData = {
    title: '',
    description: '',
    property_type: 'apartment' as Property['property_type'],
    rent: 0,
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    area_sqft: 0,
    amenities: [] as string[],
    photos: [] as string[],
    is_available: true
  };

  availableAmenities = [
    'AC', 'Wi-Fi', 'Parking', 'Laundry', 'Gym', 'Pool',
    'Pet Friendly', 'Balcony', 'Furnished', 'Security',
    'Elevator', 'Storage'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.propertyId = parseInt(id);
      this.isEditMode.set(true);
      this.loadProperty();
    }
  }

  loadProperty() {
    if (!this.propertyId) return;
    
    this.propertyService.getPropertyById(this.propertyId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const p = response.data;
          this.formData = {
            title: p.title,
            description: p.description || '',
            property_type: p.property_type,
            rent: p.rent,
            location: p.location,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            area_sqft: p.area_sqft || 0,
            amenities: p.amenities || [],
            photos: p.photos || [],
            is_available: p.is_available
          };
          this.photosText = this.formData.photos.join('\n');
        }
      }
    });
  }

  toggleAmenity(amenity: string) {
    const index = this.formData.amenities.indexOf(amenity);
    if (index > -1) {
      this.formData.amenities.splice(index, 1);
    } else {
      this.formData.amenities.push(amenity);
    }
  }

  removePhoto(index: number) {
    this.formData.photos.splice(index, 1);
    this.photosText = this.formData.photos.join('\n');
  }

  submitForm() {
    // Parse photos from textarea
    this.formData.photos = this.photosText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    this.submitting.set(true);

    const request = this.isEditMode()
      ? this.propertyService.updateProperty(this.propertyId!, this.formData)
      : this.propertyService.createProperty(this.formData);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success(
            this.isEditMode() ? 'Property updated successfully!' : 'Property listed successfully!'
          );
          this.router.navigate(['/owner/dashboard']);
        } else {
          this.notification.error(response.message || 'Failed to save property');
        }
        this.submitting.set(false);
      },
      error: (err) => {
        this.notification.error(err.error?.message || 'Failed to save property');
        this.submitting.set(false);
      }
    });
  }
}

