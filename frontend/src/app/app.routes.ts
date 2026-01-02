import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'properties',
    loadComponent: () => import('./pages/property-list/property-list.component').then(m => m.PropertyListComponent)
  },
  {
    path: 'properties/:id',
    loadComponent: () => import('./pages/property-details/property-details.component').then(m => m.PropertyDetailsComponent)
  },
  {
    path: 'properties/:id/book',
    loadComponent: () => import('./pages/booking-request/booking-request.component').then(m => m.BookingRequestComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['tenant'] }
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'owner',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['owner', 'admin'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/owner/dashboard/dashboard.component').then(m => m.OwnerDashboardComponent)
      },
      {
        path: 'properties/new',
        loadComponent: () => import('./pages/owner/property-form/property-form.component').then(m => m.PropertyFormComponent)
      },
      {
        path: 'properties/:id/edit',
        loadComponent: () => import('./pages/owner/property-form/property-form.component').then(m => m.PropertyFormComponent)
      }
    ]
  },
  {
    path: 'tenant',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['tenant'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/tenant/dashboard/dashboard.component').then(m => m.TenantDashboardComponent)
      }
    ]
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'not-authorized',
    loadComponent: () => import('./pages/not-authorized/not-authorized.component').then(m => m.NotAuthorizedComponent)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/legal/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms-of-service',
    loadComponent: () => import('./pages/legal/terms-of-service/terms-of-service.component').then(m => m.TermsOfServiceComponent)
  },
  {
    path: 'cookie-policy',
    loadComponent: () => import('./pages/legal/cookie-policy/cookie-policy.component').then(m => m.CookiePolicyComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

