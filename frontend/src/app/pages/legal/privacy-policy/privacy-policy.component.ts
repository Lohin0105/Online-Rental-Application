import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="legal-container">
      <header class="legal-header">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last Updated: December 30, 2025</p>
      </header>

      <section class="legal-section">
        <h2>1. Introduction</h2>
        <p>Welcome to Haven. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
      </section>

      <section class="legal-section">
        <h2>2. Data We Collect</h2>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul>
          <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
          <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
          <li><strong>Usage Data:</strong> includes information about how you use our website and services.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>3. How We Use Your Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul>
          <li>To register you as a new customer.</li>
          <li>To process and deliver your booking requests.</li>
          <li>To manage our relationship with you.</li>
          <li>To improve our website, services, and customer experience.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>4. Data Security</h2>
        <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
      </section>

      <section class="legal-section">
        <h2>5. Your Legal Rights</h2>
        <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, or transfer of your personal data.</p>
      </section>
    </div>
  `,
    styles: [`
    .legal-container {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--space-3xl) var(--space-xl);
      color: var(--color-charcoal);
      line-height: 1.6;
    }

    .legal-header {
      border-bottom: 2px solid var(--color-light-gray);
      margin-bottom: var(--space-2xl);
      padding-bottom: var(--space-lg);

      h1 {
        font-family: 'Playfair Display', serif;
        font-size: 2.5rem;
        margin-bottom: var(--space-xs);
      }

      .last-updated {
        color: var(--color-medium-gray);
        font-size: 0.9rem;
      }
    }

    .legal-section {
      margin-bottom: var(--space-2xl);

      h2 {
        font-family: 'DM Sans', sans-serif;
        font-size: 1.5rem;
        margin-bottom: var(--space-md);
        color: var(--color-dark-gray);
      }

      p {
        margin-bottom: var(--space-md);
      }

      ul {
        padding-left: var(--space-xl);
        li {
          margin-bottom: var(--space-sm);
        }
      }
    }
  `]
})
export class PrivacyPolicyComponent { }
