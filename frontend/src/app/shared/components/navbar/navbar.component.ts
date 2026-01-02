import { Component, signal } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar">
      <div class="container navbar-container">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-icon">⌂</span>
          <span class="logo-text">Haven</span>
        </a>

        <!-- Desktop Navigation -->
        <div class="nav-links">
          <!-- Public Links -->
          <a routerLink="/properties" routerLinkActive="active" class="nav-link">Properties</a>
          
          @if (authService.isAuthenticated()) {
            <!-- Role Based Links -->
            @if (authService.isOwner()) {
              <a routerLink="/owner/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
            }
            @if (authService.isTenant()) {
              <a routerLink="/tenant/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
            }
            @if (authService.isAdmin()) {
              <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">Admin</a>
            }
          }
        </div>

        <!-- Auth Buttons -->
        <div class="nav-auth">
          @if (authService.isAuthenticated()) {
            <div class="user-menu">
              <span class="user-name">
                {{ authService.currentUser()?.name }}
                <span class="user-role badge">{{ authService.currentUser()?.role }}</span>
              </span>
              <button (click)="logout()" class="btn btn-outline btn-sm">
                Sign Out
              </button>
            </div>
          } @else {
            <a routerLink="/login" class="nav-link">Sign In</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Get Started</a>
          }
        </div>

        <!-- Mobile Menu Button (placeholder) -->
        <button class="mobile-menu-btn">
          <span class="material-icons-outlined">menu</span>
        </button>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--color-off-white);
      z-index: 1000;
    }

    .navbar-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--color-charcoal);
      font-family: 'Playfair Display', serif;
      font-weight: 600;
      font-size: 1.5rem;

      .logo-icon {
        color: var(--color-accent);
        font-size: 1.75rem;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--space-xl);

      @media (max-width: 768px) {
        display: none;
      }
    }

    .nav-link {
      color: var(--color-gray);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color var(--transition-fast);

      &:hover, &.active {
        color: var(--color-charcoal);
      }

      &.active {
        color: var(--color-accent);
      }
    }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: var(--space-lg);

      @media (max-width: 768px) {
        display: none;
      }
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .user-name {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--color-charcoal);
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.7;
    }

    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      background-color: var(--color-off-white);
      color: var(--color-gray);
      
      &.owner { background-color: rgba(var(--color-primary-rgb), 0.1); color: var(--color-primary); }
      &.tenant { background-color: rgba(var(--color-secondary-rgb), 0.1); color: var(--color-secondary); }
      &.admin { background-color: rgba(var(--color-accent-rgb), 0.1); color: var(--color-accent); }
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-charcoal);

      @media (max-width: 768px) {
        display: block;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
