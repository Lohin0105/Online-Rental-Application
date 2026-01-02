import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand -->
          <div class="footer-brand">
            <a routerLink="/" class="logo">
              <span class="logo-icon">⌂</span>
              <span class="logo-text">Haven</span>
            </a>
            <p class="tagline">
              Finding your perfect home, simplified.
            </p>
          </div>
          
          <!-- Quick Links -->
          <div class="footer-links">
            <h4>Explore</h4>
            <ul>
              <li><a routerLink="/properties">Browse Properties</a></li>
              <li><a [routerLink]="authService.isOwner() ? '/owner/properties/new' : '/register'">List Your Property</a></li>
              <li><a routerLink="/login">Sign In</a></li>
            </ul>
          </div>
          
          <div class="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><a routerLink="/privacy-policy">Privacy Policy</a></li>
              <li><a routerLink="/terms-of-service">Terms of Service</a></li>
              <li><a routerLink="/cookie-policy">Cookie Policy</a></li>
            </ul>
          </div>
          
          <!-- Contact -->
          <div class="footer-links">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@haven.com">hello&#64;haven.com</a></li>
              <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>© {{ currentYear }} Haven. All rights reserved.</p>
          <p class="built-with">Built with care for better living.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-charcoal);
      color: var(--color-silver);
      padding: var(--space-3xl) 0 var(--space-xl);
      margin-top: auto;
    }
    
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: var(--space-2xl);
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-xl);
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }
    
    .footer-brand {
      .logo {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        font-weight: 600;
        color: white;
        text-decoration: none;
        margin-bottom: var(--space-md);
        
        .logo-icon {
          font-size: 1.75rem;
        }
      }
      
      .tagline {
        color: var(--color-medium-gray);
        font-size: 0.9rem;
        max-width: 250px;
      }
    }
    
    .footer-links {
      h4 {
        font-family: 'DM Sans', sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: white;
        margin-bottom: var(--space-lg);
      }
      
      ul {
        list-style: none;
        
        li {
          margin-bottom: var(--space-sm);
        }
        
        a {
          color: var(--color-medium-gray);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color var(--transition-fast);
          
          &:hover {
            color: var(--color-accent);
          }
        }
      }
    }
    
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: var(--space-2xl);
      padding-top: var(--space-xl);
      border-top: 1px solid var(--color-dark-gray);
      
      p {
        font-size: 0.8rem;
        color: var(--color-medium-gray);
      }
      
      .built-with {
        font-style: italic;
        color: var(--color-gray);
      }
      
      @media (max-width: 640px) {
        flex-direction: column;
        gap: var(--space-sm);
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  constructor(public authService: AuthService) { }
}

