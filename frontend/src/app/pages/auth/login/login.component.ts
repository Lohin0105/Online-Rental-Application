import { Component, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-login',
    imports: [FormsModule, RouterLink],
    template: `
    <div class="auth-page">
      <div class="auth-container animate-scale-in">
        <div class="auth-header">
          <a routerLink="/" class="logo">
            <span class="logo-icon">⌂</span>
            <span class="logo-text">Haven</span>
          </a>
          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account</p>
        </div>

        <form (ngSubmit)="login()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              class="form-input"
              placeholder="you@example.com"
              [(ngModel)]="credentials.email"
              name="email"
              required
              email
              #emailInput="ngModel"
            >
            @if (emailInput.invalid && emailInput.touched) {
              <span class="error-text">Please enter a valid email</span>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="password-input">
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                class="form-input"
                placeholder="Enter your password"
                [(ngModel)]="credentials.password"
                name="password"
                required
                minlength="6"
                #passwordInput="ngModel"
              >
              <button type="button" class="toggle-password" (click)="togglePassword()">
                <span class="material-icons-outlined">
                  {{ showPassword() ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            @if (passwordInput.invalid && passwordInput.touched) {
              <span class="error-text">Password must be at least 6 characters</span>
            }
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
            [disabled]="loginForm.invalid || loading()"
          >
            @if (loading()) {
              <span class="spinner-small"></span>
              Signing in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Create one</a></p>
        </div>

        <!-- Demo Credentials -->
        <div class="demo-credentials">
          <p class="demo-title">Demo Accounts</p>
          <div class="demo-accounts">
            <button class="demo-btn" (click)="fillDemo('owner')">
              <span class="demo-role">Owner</span>
              <span class="demo-email">owner&#64;demo.com</span>
            </button>
            <button class="demo-btn" (click)="fillDemo('tenant')">
              <span class="demo-role">Tenant</span>
              <span class="demo-email">tenant&#64;demo.com</span>
            </button>
          </div>
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
      max-width: 420px;
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      box-shadow: var(--shadow-xl);
    }

    .auth-header {
      text-align: center;
      margin-bottom: var(--space-2xl);

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

      p {
        color: var(--color-medium-gray);
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

    .error-text {
      display: block;
      color: var(--color-error);
      font-size: 0.75rem;
      margin-top: var(--space-xs);
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

    .demo-credentials {
      margin-top: var(--space-xl);
      padding: var(--space-lg);
      background: var(--color-off-white);
      border-radius: var(--radius-md);

      .demo-title {
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-medium-gray);
        text-align: center;
        margin-bottom: var(--space-md);
      }

      .demo-accounts {
        display: flex;
        gap: var(--space-sm);
      }

      .demo-btn {
        flex: 1;
        padding: var(--space-sm);
        background: white;
        border: 1px solid var(--color-silver);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
        text-align: center;

        &:hover {
          border-color: var(--color-charcoal);
          transform: translateY(-2px);
        }

        .demo-role {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-charcoal);
        }

        .demo-email {
          display: block;
          font-size: 0.7rem;
          color: var(--color-medium-gray);
        }
      }
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notification: NotificationService
  ) {}

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  fillDemo(role: 'owner' | 'tenant') {
    this.credentials.email = `${role}@demo.com`;
    this.credentials.password = 'demo123';
  }

  login() {
    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.credentials.email, this.credentials.password).subscribe({
      next: (response) => {
        if (response.success) {
          this.notification.success('Welcome back!');
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
          this.router.navigateByUrl(returnUrl);
        } else {
          this.error.set(response.message);
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Login failed. Please try again.');
        this.loading.set(false);
      }
    });
  }
}

