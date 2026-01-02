import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-cookie-policy',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="legal-container">
      <header class="legal-header">
        <h1>Cookie Policy</h1>
        <p class="last-updated">Last Updated: December 30, 2025</p>
      </header>

      <section class="legal-section">
        <h2>1. What Are Cookies</h2>
        <p>As is common practice with almost all professional websites this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience.</p>
      </section>

      <section class="legal-section">
        <h2>2. How We Use Cookies</h2>
        <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>
      </section>

      <section class="legal-section">
        <h2>3. The Cookies We Set</h2>
        <ul>
          <li><strong>Account related cookies:</strong> If you create an account with us then we will use cookies for the management of the signup process and general administration.</li>
          <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.</li>
          <li><strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site we provide the functionality to set your preferences for how this site runs when you use it.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>4. Third Party Cookies</h2>
        <p>In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.</p>
        <ul>
          <li>This site uses Google Analytics which is one of the most widespread and trusted analytics solution on the web for helping us to understand how you use the site and ways that we can improve your experience.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>5. Disabling Cookies</h2>
        <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>
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
export class CookiePolicyComponent { }
