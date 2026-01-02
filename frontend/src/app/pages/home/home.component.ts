import { Component, OnInit, signal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../core/services/property.service';
import { AuthService } from '../../core/services/auth.service';
import { Property } from '../../core/models';

@Component({
  selector: 'app-home',
  imports: [RouterLink, PropertyCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-pattern"></div>
      </div>
      
      <div class="container">
        <div class="hero-content">
          <span class="hero-tag animate-fade-in-down">Welcome to Haven</span>
          <h1 class="hero-title animate-fade-in-up delay-1">
            Find Your
            <span class="accent">Perfect</span>
            Home
          </h1>
          <p class="hero-subtitle animate-fade-in-up delay-2">
            Discover exceptional rental properties with our curated selection. 
            Whether you're searching for a cozy apartment or a spacious house, 
            your next home awaits.
          </p>
          
          <div class="hero-actions animate-fade-in-up delay-3">
            <a routerLink="/properties" class="btn btn-primary btn-lg">
              Browse Properties
              <span class="material-icons-outlined">arrow_forward</span>
            </a>
            <a [routerLink]="authService.isOwner() ? '/owner/properties/new' : '/register'" class="btn btn-secondary btn-lg">
              List Your Property
            </a>
          </div>
          
          <!-- Stats -->
          <div class="hero-stats animate-fade-in-up delay-4">
            <div class="stat">
              <span class="stat-value">500+</span>
              <span class="stat-label">Properties</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value">1,200+</span>
              <span class="stat-label">Happy Tenants</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-value">300+</span>
              <span class="stat-label">Trusted Owners</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Properties -->
    <section class="section featured">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="animate-fade-in-up">Featured Properties</h2>
            <p class="section-subtitle animate-fade-in-up delay-1">
              Handpicked selections for exceptional living
            </p>
          </div>
          <a routerLink="/properties" class="btn btn-secondary animate-fade-in-up delay-2">
            View All
            <span class="material-icons-outlined">arrow_forward</span>
          </a>
        </div>
        
        @if (loading()) {
          <div class="properties-grid">
            @for (i of [1,2,3,4]; track i) {
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
        } @else if (featuredProperties().length > 0) {
          <div class="properties-grid">
            @for (property of featuredProperties(); track property.id; let i = $index) {
              <div class="animate-fade-in-up delay-{{ i + 1 }}">
                <app-property-card [property]="property" />
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <span class="material-icons-outlined">home_work</span>
            <p>No properties available yet</p>
          </div>
        }
      </div>
    </section>

    <!-- How It Works -->
    <section class="section how-it-works bg-light">
      <div class="container">
        <div class="section-header text-center">
          <h2 class="animate-fade-in-up">How It Works</h2>
          <p class="section-subtitle animate-fade-in-up delay-1">
            Simple steps to find your next home
          </p>
        </div>
        
        <div class="steps-grid">
          <div class="step animate-fade-in-up delay-1">
            <div class="step-number">01</div>
            <div class="step-icon">
              <span class="material-icons-outlined">search</span>
            </div>
            <h3>Browse</h3>
            <p>Explore our curated collection of rental properties with detailed filters</p>
          </div>
          
          <div class="step animate-fade-in-up delay-2">
            <div class="step-number">02</div>
            <div class="step-icon">
              <span class="material-icons-outlined">visibility</span>
            </div>
            <h3>Discover</h3>
            <p>View property details, photos, amenities, and connect with owners</p>
          </div>
          
          <div class="step animate-fade-in-up delay-3">
            <div class="step-number">03</div>
            <div class="step-icon">
              <span class="material-icons-outlined">send</span>
            </div>
            <h3>Request</h3>
            <p>Submit a booking request and wait for owner approval</p>
          </div>
          
          <div class="step animate-fade-in-up delay-4">
            <div class="step-number">04</div>
            <div class="step-icon">
              <span class="material-icons-outlined">home</span>
            </div>
            <h3>Move In</h3>
            <p>Once approved, coordinate with the owner and move into your new home</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="section cta">
      <div class="container">
        <div class="cta-card animate-scale-in">
          <div class="cta-content">
            <h2>Ready to Find Your Haven?</h2>
            <p>Join thousands of happy tenants who found their perfect home with us</p>
            <div class="cta-actions">
              <a [routerLink]="authService.isAuthenticated() ? (authService.isOwner() ? '/owner/dashboard' : '/tenant/dashboard') : '/register'" class="btn btn-accent btn-lg">
                Get Started Free
              </a>
              <a routerLink="/properties" class="btn btn-ghost">
                Explore Properties
              </a>
            </div>
          </div>
          <div class="cta-decoration">
            <div class="decoration-circle"></div>
            <div class="decoration-circle"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero {
      position: relative;
      min-height: 90vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: var(--color-white);
    }
    
    .hero-bg {
      position: absolute;
      inset: 0;
      
      .hero-pattern {
        position: absolute;
        top: -50%;
        right: -20%;
        width: 80%;
        height: 200%;
        background: radial-gradient(ellipse at center, var(--color-off-white) 0%, transparent 70%);
        transform: rotate(-12deg);
      }
    }
    
    .hero-content {
      position: relative;
      max-width: 700px;
      padding: var(--space-3xl) 0;
    }
    
    .hero-tag {
      display: inline-block;
      padding: var(--space-sm) var(--space-lg);
      background: var(--color-charcoal);
      color: white;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border-radius: 50px;
      margin-bottom: var(--space-xl);
    }
    
    .hero-title {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      line-height: 1.1;
      margin-bottom: var(--space-xl);
      
      .accent {
        color: var(--color-accent);
        font-style: italic;
      }
    }
    
    .hero-subtitle {
      font-size: 1.125rem;
      color: var(--color-gray);
      line-height: 1.7;
      margin-bottom: var(--space-2xl);
      max-width: 540px;
    }
    
    .hero-actions {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
      margin-bottom: var(--space-3xl);
      
      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-sm);
      }
    }
    
    .hero-stats {
      display: flex;
      align-items: center;
      gap: var(--space-xl);
      
      .stat {
        .stat-value {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-charcoal);
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: var(--color-medium-gray);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
      
      .stat-divider {
        width: 1px;
        height: 40px;
        background: var(--color-silver);
      }
      
      @media (max-width: 640px) {
        flex-wrap: wrap;
        gap: var(--space-lg);
        
        .stat-divider {
          display: none;
        }
      }
    }
    
    /* Section Styles */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: var(--space-2xl);
      
      h2 {
        margin-bottom: var(--space-sm);
      }
      
      &.text-center {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      
      @media (max-width: 640px) {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-lg);
      }
    }
    
    .section-subtitle {
      font-size: 1rem;
      color: var(--color-medium-gray);
    }
    
    /* Properties Grid */
    .properties-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-lg);
      
      @media (max-width: 1200px) {
        grid-template-columns: repeat(3, 1fr);
      }
      
      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }
    
    /* Skeleton Loading */
    .skeleton-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--color-off-white);
      
      .skeleton-image {
        aspect-ratio: 4/3;
      }
      
      .skeleton-content {
        padding: var(--space-lg);
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        
        .skeleton-text-sm {
          height: 12px;
          width: 40%;
        }
        
        .skeleton-text-lg {
          height: 24px;
          width: 80%;
        }
        
        .skeleton-text-md {
          height: 16px;
          width: 60%;
        }
      }
    }
    
    /* Empty State */
    .empty-state {
      text-align: center;
      padding: var(--space-3xl);
      color: var(--color-medium-gray);
      
      .material-icons-outlined {
        font-size: 4rem;
        margin-bottom: var(--space-md);
      }
    }
    
    /* How It Works */
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-xl);
      
      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }
    
    .step {
      text-align: center;
      padding: var(--space-xl);
      background: white;
      border-radius: var(--radius-lg);
      position: relative;
      transition: all var(--transition-base);
      
      &:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
        
        .step-icon {
          background: var(--color-charcoal);
          color: white;
        }
      }
      
      .step-number {
        position: absolute;
        top: var(--space-md);
        left: var(--space-md);
        font-family: 'Playfair Display', serif;
        font-size: 0.875rem;
        color: var(--color-silver);
        font-weight: 600;
      }
      
      .step-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto var(--space-lg);
        border-radius: var(--radius-lg);
        background: var(--color-off-white);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-base);
        
        .material-icons-outlined {
          font-size: 1.75rem;
        }
      }
      
      h3 {
        font-size: 1.125rem;
        margin-bottom: var(--space-sm);
      }
      
      p {
        font-size: 0.875rem;
        color: var(--color-medium-gray);
        line-height: 1.6;
      }
    }
    
    /* CTA Section */
    .cta-card {
      position: relative;
      background: var(--color-charcoal);
      color: white;
      border-radius: var(--radius-xl);
      padding: var(--space-3xl);
      text-align: center;
      overflow: hidden;
      
      .cta-content {
        position: relative;
        z-index: 1;
        
        h2 {
          color: white;
          margin-bottom: var(--space-md);
        }
        
        p {
          color: var(--color-silver);
          margin-bottom: var(--space-xl);
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
      }
      
      .cta-actions {
        display: flex;
        justify-content: center;
        gap: var(--space-md);
        flex-wrap: wrap;
        
        .btn-ghost {
          color: white;
          
          &:hover {
            background: rgba(255,255,255,0.1);
          }
        }
      }
      
      .cta-decoration {
        position: absolute;
        inset: 0;
        
        .decoration-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.1);
          
          &:first-child {
            width: 300px;
            height: 300px;
            top: -100px;
            right: -100px;
          }
          
          &:last-child {
            width: 200px;
            height: 200px;
            bottom: -50px;
            left: -50px;
          }
        }
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProperties = signal<Property[]>([]);
  loading = signal(true);

  constructor(
    private propertyService: PropertyService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadFeaturedProperties();
  }

  loadFeaturedProperties() {
    this.propertyService.getAllProperties({ limit: 4 }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.featuredProperties.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}

