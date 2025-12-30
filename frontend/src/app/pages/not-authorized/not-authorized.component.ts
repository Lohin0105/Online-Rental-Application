import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-authorized',
    imports: [RouterLink],
    template: `
    <div class="not-authorized-page">
      <div class="content animate-scale-in">
        <div class="icon-container">
          <span class="material-icons-outlined">lock</span>
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to view this page.</p>
        <div class="actions">
          <a routerLink="/" class="btn btn-primary">Go Home</a>
          <a routerLink="/login" class="btn btn-secondary">Sign In</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .not-authorized-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-2xl);
      background: linear-gradient(135deg, var(--color-off-white) 0%, var(--color-white) 100%);
    }

    .content {
      text-align: center;
      max-width: 400px;
    }

    .icon-container {
      width: 100px;
      height: 100px;
      margin: 0 auto var(--space-xl);
      border-radius: 50%;
      background: var(--color-off-white);
      display: flex;
      align-items: center;
      justify-content: center;

      .material-icons-outlined {
        font-size: 3rem;
        color: var(--color-error);
      }
    }

    h1 {
      font-size: 2rem;
      margin-bottom: var(--space-md);
    }

    p {
      color: var(--color-medium-gray);
      margin-bottom: var(--space-xl);
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: var(--space-md);
    }
  `]
})
export class NotAuthorizedComponent {}

