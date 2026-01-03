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
          class="star-icon"
          [class.filled]="isFilled(star)"
          [class.half]="isHalf(star)"
          [class.animate-pop]="animateStar === star"
          [style.animation-delay]="(star * 0.05) + 's'"
          (click)="onStarClick(star)"
          (mouseenter)="onMouseEnter(star)"
          (mouseleave)="onMouseLeave()"
        >
          <svg 
            [attr.width]="size" 
            [attr.height]="size" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            class="star-svg"
          >
            <defs>
              <linearGradient [attr.id]="'starGradient' + star" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
              </linearGradient>
              <filter [attr.id]="'glow' + star">
                <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            @if (isFilled(star)) {
              <path 
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                [attr.fill]="'url(#starGradient' + star + ')'"
                [attr.filter]="'url(#glow' + star + ')'"
                class="star-path filled-star"
              />
            } @else if (isHalf(star)) {
              <path 
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                fill="#e0e0e0"
                class="star-path"
              />
              <clipPath [attr.id]="'halfClip' + star">
                <rect x="0" y="0" width="12" height="24"/>
              </clipPath>
              <path 
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                [attr.fill]="'url(#starGradient' + star + ')'"
                [attr.clip-path]="'url(#halfClip' + star + ')'"
                class="star-path filled-star"
              />
            } @else {
              <path 
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                fill="#e0e0e0"
                stroke="#ccc"
                stroke-width="0.5"
                class="star-path empty-star"
              />
            }
          </svg>
        </span>
      }
      @if (showValue && value > 0) {
        <span class="rating-value">{{ value | number:'1.1-1' }}</span>
      }
      @if (showCount && ratingCount > 0) {
        <span class="rating-count">({{ ratingCount }})</span>
      }
    </div>
  `,
    styles: [`
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      user-select: none;
      
      .star-icon {
        cursor: default;
        display: inline-flex;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        
        .star-svg {
          transition: all 0.3s ease;
        }
        
        .star-path {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .filled-star {
          animation: starFillIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        &.animate-pop {
          animation: starPop 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      }
      
      &.interactive {
        .star-icon {
          cursor: pointer;
          
          &:hover {
            transform: scale(1.2) rotate(5deg);
            
            .star-svg {
              filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.6));
            }
          }
          
          &:active {
            transform: scale(0.95);
          }
        }
      }
    }
    
    .rating-value {
      margin-left: 8px;
      font-size: 0.9em;
      color: var(--color-charcoal, #333);
      font-weight: 600;
    }
    
    .rating-count {
      margin-left: 4px;
      font-size: 0.85em;
      color: var(--color-medium-gray, #666);
    }
    
    @keyframes starFillIn {
      0% {
        opacity: 0;
        transform: scale(0);
      }
      50% {
        opacity: 1;
        transform: scale(1.3);
      }
      100% {
        transform: scale(1);
      }
    }
    
    @keyframes starPop {
      0% {
        transform: scale(1);
      }
      25% {
        transform: scale(0.8);
      }
      50% {
        transform: scale(1.3) rotate(10deg);
      }
      75% {
        transform: scale(1.1) rotate(-5deg);
      }
      100% {
        transform: scale(1) rotate(0);
      }
    }
    
    @keyframes shimmer {
      0% {
        filter: brightness(1);
      }
      50% {
        filter: brightness(1.2);
      }
      100% {
        filter: brightness(1);
      }
    }
  `]
})
export class StarRatingComponent {
    @Input() value: number = 0;
    @Input() readOnly: boolean = false;
    @Input() size: number = 24;
    @Input() showValue: boolean = false;
    @Input() showCount: boolean = false;
    @Input() ratingCount: number = 0;

    @Output() ratingChange = new EventEmitter<number>();

    hoverValue: number = 0;
    animateStar: number = 0;

    onStarClick(star: number) {
        if (!this.readOnly) {
            this.animateStar = star;
            this.value = star;
            this.ratingChange.emit(this.value);
            
            // Reset animation trigger
            setTimeout(() => {
                this.animateStar = 0;
            }, 400);
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
}
