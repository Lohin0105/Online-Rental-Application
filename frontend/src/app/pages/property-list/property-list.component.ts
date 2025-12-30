import { Component, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../core/services/property.service';
import { Property, PropertyFilters } from '../../core/models';

@Component({
  selector: 'app-property-list',
  imports: [FormsModule, PropertyCardComponent],
  template: `
    <div class="property-list-page">
      <!-- Header -->
      <section class="page-header">
        <div class="container">
          <h1 class="animate-fade-in-up">Browse Properties</h1>
          <p class="animate-fade-in-up delay-1">Find your perfect rental home from our curated collection</p>
        </div>
      </section>

      <div class="container">
        <div class="content-layout">
          <!-- Filters Sidebar -->
          <aside class="filters-sidebar animate-slide-left">
            <div class="filters-header">
              <h3>Filters</h3>
              <button class="btn btn-ghost btn-sm" (click)="clearFilters()">Clear All</button>
            </div>

            <!-- Property Name Search -->
            <div class="filter-group">
              <label class="filter-label">Property Name</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="Search by title..."
                [(ngModel)]="filters.title"
                (input)="onFilterChange()"
              >
            </div>

            <!-- Location -->
            <div class="filter-group">
              <label class="filter-label">Location</label>
              <input 
                type="text" 
                class="form-input"
                placeholder="City or neighborhood"
                [(ngModel)]="filters.location"
                (input)="onFilterChange()"
              >
            </div>

            <!-- Price Range -->
            <div class="filter-group">
              <label class="filter-label">Price Range</label>
              <div class="price-inputs">
                <input 
                  type="number" 
                  class="form-input"
                  placeholder="Min"
                  [(ngModel)]="filters.minRent"
                  (input)="onFilterChange()"
                >
                <span class="price-separator">—</span>
                <input 
                  type="number" 
                  class="form-input"
                  placeholder="Max"
                  [(ngModel)]="filters.maxRent"
                  (input)="onFilterChange()"
                >
              </div>
            </div>

            <!-- Bedrooms -->
            <div class="filter-group">
              <label class="filter-label">Bedrooms</label>
              <div class="bedroom-options">
                @for (num of [1, 2, 3, 4]; track num) {
                  <button 
                    class="bedroom-btn" 
                    [class.active]="filters.bedrooms === num"
                    (click)="setBedrooms(num)"
                  >
                    {{ num }}{{ num === 4 ? '+' : '' }}
                  </button>
                }
              </div>
            </div>

            <!-- Property Type -->
            <div class="filter-group">
              <label class="filter-label">Property Type</label>
              <div class="type-options">
                @for (type of propertyTypes; track type.value) {
                  <label class="type-option">
                    <input 
                      type="radio" 
                      name="property_type" 
                      [value]="type.value"
                      [(ngModel)]="filters.property_type"
                      (change)="onFilterChange()"
                    >
                    <span class="type-label">{{ type.label }}</span>
                  </label>
                }
              </div>
            </div>
          </aside>

          <!-- Properties Grid -->
          <main class="properties-main">
            <div class="results-header">
              <p class="results-count">
                @if (!loading()) {
                  <strong>{{ totalProperties() }}</strong> properties found
                }
              </p>
            </div>

            @if (loading()) {
              <div class="properties-grid">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="skeleton-card">
                    <div class="skeleton skeleton-image"></div>
                    <div class="skeleton-content">
                      <div class="skeleton skeleton-text-sm"></div>
                      <div class="skeleton skeleton-text-lg"></div>
                      <div class="skeleton skeleton-text-md"></div>
                    </div>
                  </div>
                }
              </div>
            } @else if (properties().length > 0) {
              <div class="properties-grid">
                @for (property of properties(); track property.id; let i = $index) {
                  <div class="animate-fade-in-up" [style.animation-delay]="(i * 0.05) + 's'">
                    <app-property-card [property]="property" />
                  </div>
                }
              </div>

              <!-- Pagination -->
              @if (totalPages() > 1) {
                <div class="pagination">
                  <button 
                    class="btn btn-icon"
                    [disabled]="currentPage() === 1"
                    (click)="goToPage(currentPage() - 1)"
                  >
                    <span class="material-icons-outlined">chevron_left</span>
                  </button>
                  
                  @for (page of getPageNumbers(); track page) {
                    <button 
                      class="page-btn"
                      [class.active]="page === currentPage()"
                      (click)="goToPage(page)"
                    >
                      {{ page }}
                    </button>
                  }
                  
                  <button 
                    class="btn btn-icon"
                    [disabled]="currentPage() === totalPages()"
                    (click)="goToPage(currentPage() + 1)"
                  >
                    <span class="material-icons-outlined">chevron_right</span>
                  </button>
                </div>
              }
            } @else {
              <div class="empty-state">
                <span class="material-icons-outlined">search_off</span>
                <h3>No properties found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <button class="btn btn-primary" (click)="clearFilters()">Clear Filters</button>
              </div>
            }
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .property-list-page {
      min-height: 100vh;
      padding-bottom: var(--space-3xl);
    }

    .page-header {
      background: var(--color-off-white);
      padding: var(--space-3xl) 0;
      margin-bottom: var(--space-2xl);

      h1 { margin-bottom: var(--space-sm); }
      p { color: var(--color-medium-gray); }
    }

    .content-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--space-2xl);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .filters-sidebar {
      @media (max-width: 1024px) {
        display: none;
      }
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);

      h3 {
        font-size: 1rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 600;
      }
    }

    .filter-group {
      margin-bottom: var(--space-xl);
    }

    .filter-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-medium-gray);
      margin-bottom: var(--space-sm);
    }

    .price-inputs {
      display: flex;
      align-items: center;
      gap: var(--space-sm);

      .form-input { flex: 1; }
      .price-separator { color: var(--color-silver); }
    }

    .bedroom-options {
      display: flex;
      gap: var(--space-sm);
    }

    .bedroom-btn {
      flex: 1;
      padding: var(--space-sm) var(--space-md);
      background: var(--color-off-white);
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--color-silver);
      }

      &.active {
        background: var(--color-charcoal);
        color: white;
      }
    }

    .type-options {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .type-option {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      cursor: pointer;

      input { display: none; }

      .type-label {
        padding: var(--space-sm) var(--space-md);
        font-size: 0.875rem;
        background: var(--color-off-white);
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        width: 100%;
      }

      input:checked + .type-label {
        background: var(--color-charcoal);
        color: white;
      }
    }

    .results-header {
      margin-bottom: var(--space-lg);
      
      .results-count {
        font-size: 0.875rem;
        color: var(--color-medium-gray);
      }
    }

    .properties-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);

      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .skeleton-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--color-off-white);

      .skeleton-image { aspect-ratio: 4/3; }

      .skeleton-content {
        padding: var(--space-lg);
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);

        .skeleton-text-sm { height: 12px; width: 40%; }
        .skeleton-text-lg { height: 24px; width: 80%; }
        .skeleton-text-md { height: 16px; width: 60%; }
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--space-sm);
      margin-top: var(--space-2xl);
    }

    .page-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--color-off-white);
      border: none;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover { background: var(--color-silver); }

      &.active {
        background: var(--color-charcoal);
        color: white;
      }
    }

    .empty-state {
      text-align: center;
      padding: var(--space-3xl);

      .material-icons-outlined {
        font-size: 4rem;
        color: var(--color-silver);
        margin-bottom: var(--space-md);
      }

      h3 { margin-bottom: var(--space-sm); }
      p { color: var(--color-medium-gray); margin-bottom: var(--space-lg); }
    }
  `]
})
export class PropertyListComponent implements OnInit {
  properties = signal<Property[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  totalProperties = signal(0);

  filters: PropertyFilters = {};
  private filterTimeout: any;

  propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'studio', label: 'Studio' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condo' }
  ];

  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
    this.loadProperties();
  }

  loadProperties() {
    this.loading.set(true);
    this.propertyService.getAllProperties({
      ...this.filters,
      page: this.currentPage(),
      limit: 9
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.properties.set(response.data);
          this.totalPages.set(response.pagination?.totalPages || 1);
          this.totalProperties.set(response.pagination?.total || 0);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onFilterChange() {
    clearTimeout(this.filterTimeout);
    this.filterTimeout = setTimeout(() => {
      this.currentPage.set(1);
      this.loadProperties();
    }, 500);
  }

  setBedrooms(num: number) {
    this.filters.bedrooms = this.filters.bedrooms === num ? undefined : num;
    this.onFilterChange();
  }

  clearFilters() {
    this.filters = {};
    this.currentPage.set(1);
    this.loadProperties();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProperties();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    return pages;
  }
}

