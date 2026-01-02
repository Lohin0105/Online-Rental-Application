import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating" [class.interactive]="!readOnly" [style.font-size.px]="size">
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <span 
          class="material-icons-outlined"
          [class.filled]="isFilled(star)"
          [class.half]="isHalf(star)"
          (click)="onStarClick(star)"
          (mouseenter)="onMouseEnter(star)"
          (mouseleave)="onMouseLeave()"
        >
          {{ getStarIcon(star) }}
        </span>
      }
      @if (showValue && value > 0) {
        <span class="rating-value">{{ value | number:'1.1-1' }}</span>
      }
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      color: var(--color-silver, #ccc);
      user-select: none;
      
      .material-icons-outlined {
        cursor: default;
        transition: transform 0.1s ease;
        
        &.filled {
          color: var(--color-warning, #ffc107);
        }
        
        &.half {
          color: var(--color-warning, #ffc107);
        }
      }
      
      &.interactive {
        .material-icons-outlined {
          cursor: pointer;
          &:hover {
            transform: scale(1.2);
          }
        }
      }
    }
    
    .rating-value {
      margin-left: 8px;
      font-size: 0.9em;
      color: var(--color-gray, #666);
      font-weight: 500;
    }
  `]
})
export class StarRatingComponent {
  @Input() value: number = 0;
  @Input() readOnly: boolean = false;
  @Input() size: number = 24;
  @Input() showValue: boolean = false;

  @Output() ratingChange = new EventEmitter<number>();

  hoverValue: number = 0;

  onStarClick(star: number) {
    if (!this.readOnly) {
      this.value = star;
      this.ratingChange.emit(this.value);
    }
  }

  onMouseEnter(star: number) {
    if (!this.readOnly) {
      this.hoverValue = star;
    }
  }

  onMouseLeave() {
    if (!this.readOnly) {
      this.hoverValue = 0;
    }
  }

  isFilled(star: number): boolean {
    const compareValue = this.hoverValue || this.value;
    return star <= compareValue;
  }

  isHalf(star: number): boolean {
    if (this.hoverValue > 0) return false;
    return star > this.value && star - 0.5 <= this.value;
  }

  getStarIcon(star: number): string {
    if (this.isFilled(star)) return 'star';
    if (this.isHalf(star)) return 'star_half';
    return 'star_outline';
  }
}
