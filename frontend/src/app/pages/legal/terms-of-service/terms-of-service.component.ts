import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-terms-of-service',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="legal-page animate-fade-in">
      <div class="container">
        <header class="legal-header">
          <h1>Terms of Service</h1>
          <p class="last-updated">Last Updated: December 30, 2025</p>
        </header>

        <section class="legal-content">
          <div class="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using Haven, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the service.</p>
          </div>

          <div class="legal-section">
            <h2>2. User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>
          </div>

          <div class="legal-section">
            <h2>3. Property Listings</h2>
            <p>Owners are responsible for the accuracy of their property listings. Haven does not guarantee the accuracy or quality of any listing. Tenants are encouraged to verify property details before making any commitments.</p>
          </div>

          <div class="legal-section">
            <h2>4. Limitation of Liability</h2>
            <p>In no event shall Haven, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
          </div>

          <div class="legal-section">
            <h2>5. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Haven operates, without regard to its conflict of law provisions.</p>
          </div>

          <div class="legal-section">
            <h2>6. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect.</p>
          </div>
        </section>
      </div>
    </div>
  `,
    styles: [`
    .legal-page {
      padding: var(--space-3xl) 0;
      background-color: var(--color-white);
      min-height: 80vh;
    }

    .legal-header {
      margin-bottom: var(--space-2xl);
      text-align: center;

      h1 {
        margin-bottom: var(--space-sm);
        color: var(--color-charcoal);
      }

      .last-updated {
        color: var(--color-medium-gray);
        font-size: 0.875rem;
      }
    }

    .legal-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .legal-section {
      margin-bottom: var(--space-2xl);

      h2 {
        font-size: 1.5rem;
        margin-bottom: var(--space-md);
        color: var(--color-charcoal);
      }

      p {
        margin-bottom: var(--space-md);
        line-height: 1.8;
      }
    }
  `]
})
export class TermsOfServiceComponent { }
