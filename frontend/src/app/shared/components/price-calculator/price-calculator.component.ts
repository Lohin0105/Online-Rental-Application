import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatbotService } from '../../../core/services/ai-chatbot.service';

@Component({
  selector: 'app-price-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calculator-card">
      <div class="card-header">
        <span class="material-icons-outlined">calculate</span>
        <h3>Rental Price Calculator</h3>
      </div>
      <p class="card-subtitle">Get estimated rental value based on property details</p>
      
      <div class="form-grid">
        <div class="form-field">
          <label>Property Type</label>
          <select [(ngModel)]="form.type" class="input">
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="studio">Studio</option>
            <option value="villa">Villa</option>
            <option value="condo">Condo</option>
          </select>
        </div>
        
        <div class="form-field">
          <label>Location / City</label>
          <input [(ngModel)]="form.location" class="input" placeholder="e.g., New York">
        </div>
        
        <div class="form-field">
          <label>Bedrooms</label>
          <input type="number" [(ngModel)]="form.bedrooms" class="input" min="0">
        </div>
        
        <div class="form-field">
          <label>Bathrooms</label>
          <input type="number" [(ngModel)]="form.bathrooms" class="input" min="0">
        </div>
        
        <div class="form-field">
          <label>Square Feet</label>
          <input type="number" [(ngModel)]="form.sqft" class="input" min="0">
        </div>
      </div>
      
      <button class="calc-btn" (click)="calculate()" [disabled]="loading() || !form.location">
        <span class="material-icons-outlined">{{loading() ? 'hourglass_empty' : 'insights'}}</span>
        {{loading() ? 'Analyzing...' : 'Calculate Estimate'}}
      </button>
      
      @if (result()) {
        <div class="result-panel">
          <div class="result-header">
            <span class="material-icons-outlined">trending_up</span>
            <strong>Market Analysis</strong>
          </div>
          <div class="result-content">{{ result() }}</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .calculator-card {
      background: var(--color-off-white);
      border: 1px solid var(--color-silver);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .material-icons-outlined {
        font-size: 28px;
        color: var(--color-charcoal);
      }

      h3 {
        margin: 0;
        font-size: 18px;
        color: var(--color-charcoal);
      }
    }

    .card-subtitle {
      color: var(--color-medium-gray);
      font-size: 14px;
      margin: 0 0 20px 0;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }

    .form-field {
      label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: var(--color-charcoal);
        margin-bottom: 6px;
      }

      .input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--color-silver);
        border-radius: 8px;
        font-size: 14px;
        background: white;
        transition: border 0.2s;

        &:focus {
          outline: none;
          border-color: var(--color-charcoal);
        }
      }
    }

    .calc-btn {
      width: 100%;
      padding: 12px;
      background: var(--color-charcoal);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;

      .material-icons-outlined {
        font-size: 20px;
      }

      &:hover:not(:disabled) {
        background: #2a2a2a;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .result-panel {
      margin-top: 20px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      border-left: 3px solid var(--color-charcoal);
    }

    .result-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      color: var(--color-charcoal);

      .material-icons-outlined {
        font-size: 20px;
      }

      strong {
        font-size: 14px;
      }
    }

    .result-content {
      font-size: 14px;
      line-height: 1.6;
      color: var(--color-charcoal);
      white-space: pre-wrap;
    }
  `]
})
export class PriceCalculatorComponent {
  loading = signal(false);
  result = signal('');

  form = {
    type: 'apartment',
    location: '',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 800
  };

  constructor(private aiService: AiChatbotService) {}

  async calculate() {
    if (!this.form.location.trim()) return;
    
    this.loading.set(true);
    this.result.set('');
    
    const prompt = `Give a brief price estimate for this rental property:
${this.form.type}, ${this.form.location}, ${this.form.bedrooms}BR, ${this.form.bathrooms}BA, ${this.form.sqft} sqft

Provide ONLY:
1. Estimated monthly rent range (one line)
2. One key factor affecting price
3. One tip for pricing

Keep response under 50 words total. No asterisks or special characters.`;

    try {
      const response = await this.aiService.sendMessage(prompt);
      this.result.set(response);
    } catch (error) {
      this.result.set('Unable to calculate estimate at this time. Please check your inputs and try again.');
    } finally {
      this.loading.set(false);
    }
  }
}

