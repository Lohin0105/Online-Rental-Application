import { Component, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-register',
    imports: [FormsModule, RouterLink],
    template: `
    <div class="auth-page">
      <div class="auth-container animate-scale-in">
        <div class="auth-header">
          <a routerLink="/" class="logo">
            <span class="logo-icon">⌂</span>
            <span class="logo-text">Haven</span>
          </a>
          <h1>Create Account</h1>
          <p>Join Haven and find your perfect home</p>
        </div>

        <!-- Role Selection -->
        <div class="role-selection">
          <button 
            class="role-btn" 
            [class.active]="userData.role === 'tenant'"
            (click)="userData.role = 'tenant'"
          >
            <span class="material-icons-outlined">person_search</span>
            <span class="role-title">I'm looking to rent</span>
            <span class="role-desc">Find your perfect rental home</span>
          </button>
          <button 
            class="role-btn" 
            [class.active]="userData.role === 'owner'"
            (click)="userData.role = 'owner'"
          >
            <span class="material-icons-outlined">home_work</span>
            <span class="role-title">I'm a property owner</span>
            <span class="role-desc">List and manage properties</span>
          </button>
        </div>

        <form (ngSubmit)="register()" #registerForm="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input 
              type="text" 
              class="form-input"
              placeholder="John Doe"
              [(ngModel)]="userData.name"
              name="name"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              class="form-input"
              placeholder="you@example.com"
              [(ngModel)]="userData.email"
              name="email"
              required
              email
            >
          </div>

          <div class="form-group">
            <label class="form-label">Phone (Optional)</label>
            <input 
              type="tel" 
              class="form-input"
              placeholder="+1 234 567 890"
              [(ngModel)]="userData.phone"
              name="phone"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="password-input">
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                class="form-input"
                placeholder="Create a strong password"
                [(ngModel)]="userData.password"
                name="password"
                required
                minlength="6"
              >
              <button type="button" class="toggle-password" (click)="togglePassword()">
                <span class="material-icons-outlined">
                  {{ showPassword() ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </div>

          @if (error()) {
            <div class="error-alert animate-fade-in">
              <span class="material-icons-outlined">error</span>
              {{ error() }}
            </div>
          }

          <button 
            type="submit" 
            class="btn btn-primary btn-lg"
            [disabled]="registerForm.invalid || loading()"
          >
            @if (loading()) {
              <span class="spinner-small"></span>
              Creating account...
            } @else {
              Create Account
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      background: linear-gradient(135deg, var(--color-off-white) 0%, var(--color-white) 100%);
    }

    .auth-container {
      width: 100%;
      max-width: 480px;
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      box-shadow: var(--shadow-xl);
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--space-xl);

      .logo {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-charcoal);
        text-decoration: none;
        margin-bottom: var(--space-xl);
      }

      h1 {
        font-size: 1.75rem;
        margin-bottom: var(--space-sm);
      }

      p { color: var(--color-medium-gray); }
    }

    .role-selection {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .role-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-lg);
      background: var(--color-off-white);
      border: 2px solid transparent;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: center;

      .material-icons-outlined {
        font-size: 2rem;
        color: var(--color-gray);
        margin-bottom: var(--space-sm);
        transition: color var(--transition-fast);
      }

      .role-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-charcoal);
        margin-bottom: var(--space-xs);
      }

      .role-desc {
        font-size: 0.7rem;
        color: var(--color-medium-gray);
      }

      &:hover {
        border-color: var(--color-silver);
      }

      &.active {
        border-color: var(--color-charcoal);
        background: white;

        .material-icons-outlined {
          color: var(--color-accent);
        }
      }
    }

    .password-input {
      position: relative;

      .form-input { padding-right: 48px; }

      .toggle-password {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-medium-gray);
        padding: 4px;

        &:hover { color: var(--color-charcoal); }
      }
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md);
      background: rgba(160, 64, 64, 0.1);
      border-radius: var(--radius-md);
      color: var(--color-error);
      font-size: 0.875rem;
      margin-bottom: var(--space-lg);

      .material-icons-outlined { font-size: 1.25rem; }
    }

    .btn {
      width: 100%;
      margin-top: var(--space-md);

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

    .auth-footer {
      text-align: center;
      margin-top: var(--space-xl);
      padding-top: var(--space-xl);
      border-top: 1px solid var(--color-off-white);

      p {
        font-size: 0.875rem;
        color: var(--color-medium-gray);

        a {
          color: var(--color-accent);
          font-weight: 500;
        }
      }
    }
  `]
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'tenant' as 'owner' | 'tenant'
  };

  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  register() {
    this.loading.set(true);
    this.error.set('');

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Account created successfully!');
          const redirect = this.userData.role === 'owner' ? '/owner/dashboard' : '/properties';
          this.router.navigate([redirect]);
        } else {
          this.error.set(response.message);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}

