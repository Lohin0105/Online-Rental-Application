import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cookie-policy',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="legal-page animate-fade-in">
      <div class="container">
        <header class="legal-header">
          <h1>Cookie Policy</h1>
          <p class="last-updated">Last Updated: December 30, 2025</p>
        </header>

        <section class="legal-content">
          <div class="legal-section">
            <h2>1. What are Cookies</h2>
            <p>Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>
          </div>

          <div class="legal-section">
            <h2>2. How Haven Uses Cookies</h2>
            <p>When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> To authenticate users and prevent fraudulent use of user accounts.</li>
              <li><strong>Preferences Cookies:</strong> To remember information that changes the way the Service behaves or looks, such as a user's language preference.</li>
              <li><strong>Analytics Cookies:</strong> To track information how the Service is used so we can make improvements.</li>
            </ul>
          </div>

          <div class="legal-section">
            <h2>3. Third-Party Cookies</h2>
            <p>In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.</p>
          </div>

          <div class="legal-section">
            <h2>4. Your Choices Regarding Cookies</h2>
            <p>If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.</p>
            <p>Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.</p>
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
    }
  `]
})
export class CookiePolicyComponent { }
