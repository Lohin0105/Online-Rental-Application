import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-terms-of-service',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="legal-container">
      <header class="legal-header">
        <h1>Terms of Service</h1>
        <p class="last-updated">Last Updated: December 30, 2025</p>
      </header>

      <section class="legal-section">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using Haven, you accept and agree to be bound by the terms and provision of this agreement.</p>
      </section>

      <section class="legal-section">
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Haven's website for personal, non-commercial transitory viewing only.</p>
        <p>This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained on Haven's website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
      </section>

      <section class="legal-section">
        <h2>3. Disclaimer</h2>
        <p>The materials on Haven's website are provided on an 'as is' basis. Haven makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      </section>

      <section class="legal-section">
        <h2>4. Limitations</h2>
        <p>In no event shall Haven or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Haven's website.</p>
      </section>

      <section class="legal-section">
        <h2>5. Governing Law</h2>
        <p>These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
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
export class TermsOfServiceComponent { }
