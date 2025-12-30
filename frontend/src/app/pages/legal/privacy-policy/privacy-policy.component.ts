import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="legal-page animate-fade-in">
      <div class="container">
        <header class="legal-header">
          <h1>Privacy Policy</h1>
          <p class="last-updated">Last Updated: December 30, 2025</p>
        </header>

        <section class="legal-content">
          <div class="legal-section">
            <h2>1. Introduction</h2>
            <p>Welcome to Haven. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
          </div>

          <div class="legal-section">
            <h2>2. Data We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul>
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Profile Data</strong> includes your username and password, bookings made by you, your interests, preferences, feedback and survey responses.</li>
            </ul>
          </div>

          <div class="legal-section">
            <h2>3. How We Use Your Data</h2>
            <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
            <ul>
              <li>To register you as a new user.</li>
              <li>To manage your relationship with us.</li>
              <li>To enable you to list or book properties.</li>
              <li>To improve our website, products/services, marketing or customer relationships.</li>
            </ul>
          </div>

          <div class="legal-section">
            <h2>4. Data Security</h2>
            <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
          </div>

          <div class="legal-section">
            <h2>5. Contact Us</h2>
            <p>If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:privacy@haven.com">privacy&#64;haven.com</a></p>
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

      ul {
        margin-bottom: var(--space-md);
        padding-left: var(--space-xl);

        li {
          margin-bottom: var(--space-sm);
          color: var(--color-gray);
        }
      }

      a {
        color: var(--color-accent);
        text-decoration: underline;
      }
    }
  `]
})
export class PrivacyPolicyComponent { }
