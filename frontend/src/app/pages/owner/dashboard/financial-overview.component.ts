import { Component, OnInit, signal, inject } from '@angular/core';

import { AnalyticsService } from '../../../core/services/analytics.service';
import { FinancialAnalytics } from '../../../core/models';

@Component({
  selector: 'app-financial-overview',
  imports: [],
  template: `
    <div class="financial-overview animate-fade-in-up">
      <div class="overview-header">
        <h3>Financial Overview</h3>
        <span class="period">Last 6 months</span>
      </div>
    
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon revenue">
            <span class="material-icons-outlined">trending_up</span>
          </div>
          <div class="metric-content">
            <span class="metric-value">\${{ financialData()?.totalRevenue?.toLocaleString() || 0 }}</span>
            <span class="metric-label">Total Revenue</span>
          </div>
        </div>
    
        <div class="metric-card">
          <div class="metric-icon monthly">
            <span class="material-icons-outlined">calendar_month</span>
          </div>
          <div class="metric-content">
            <span class="metric-value">\${{ financialData()?.monthlyRevenue?.toLocaleString() || 0 }}</span>
            <span class="metric-label">This Month</span>
          </div>
        </div>
    
        <div class="metric-card">
          <div class="metric-icon pending">
            <span class="material-icons-outlined">schedule</span>
          </div>
          <div class="metric-content">
            <span class="metric-value">\${{ financialData()?.pendingPayments?.toLocaleString() || 0 }}</span>
            <span class="metric-label">Pending Payments</span>
          </div>
        </div>
      </div>
    
      <div class="chart-placeholder">
        <div class="chart-header">
          <h4>Revenue Trend</h4>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-color revenue"></span>
              Revenue
            </span>
            <span class="legend-item">
              <span class="legend-color expenses"></span>
              Expenses
            </span>
          </div>
        </div>
        <div class="chart-area">
          <div class="bar-chart">
            @for (month of financialData()?.monthlyBreakdown || []; track month; let i = $index) {
              <div
                class="chart-bar"
                [style.height.%]="getBarHeight(month.revenue)"
                [title]="'Revenue: $' + month.revenue + ', Expenses: $' + month.expenses"
                >
                <div class="revenue-bar" [style.height.%]="getRevenuePercentage(month)"></div>
                <div class="expenses-bar" [style.height.%]="getExpensesPercentage(month)"></div>
              </div>
            }
          </div>
          <div class="chart-labels">
            @for (month of financialData()?.monthlyBreakdown || []; track month) {
              <span class="month-label">
                {{ month.month }}
              </span>
            }
          </div>
        </div>
      </div>
    
      <div class="top-properties">
        <h4>Top Performing Properties</h4>
        <div class="properties-list">
          @for (property of financialData()?.topPerformingProperties || []; track property) {
            <div
              class="property-item"
              >
              <div class="property-info">
                <span class="property-title">{{ property.title }}</span>
                <span class="property-revenue">\${{ property.revenue.toLocaleString() }}</span>
              </div>
              <div class="property-metrics">
                <span class="occupancy">{{ property.occupancyRate }}% occupied</span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
    `,
  styles: [`
    .financial-overview {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .overview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .overview-header h3 {
      margin: 0;
      color: #1a1a1a;
      font-size: 20px;
      font-weight: 600;
    }

    .period {
      color: #666;
      font-size: 14px;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .metric-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #007bff;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .metric-icon.revenue { background: #28a745; }
    .metric-icon.monthly { background: #007bff; }
    .metric-icon.pending { background: #ffc107; }

    .metric-content {
      display: flex;
      flex-direction: column;
    }

    .metric-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    .metric-label {
      font-size: 14px;
      color: #666;
    }

    .chart-placeholder {
      margin-bottom: 32px;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .chart-header h4 {
      margin: 0;
      color: #1a1a1a;
      font-size: 16px;
      font-weight: 600;
    }

    .chart-legend {
      display: flex;
      gap: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .legend-color.revenue { background: #007bff; }
    .legend-color.expenses { background: #dc3545; }

    .chart-area {
      height: 200px;
      position: relative;
    }

    .bar-chart {
      display: flex;
      align-items: end;
      justify-content: space-between;
      height: 160px;
      padding: 0 20px;
    }

    .chart-bar {
      width: 30px;
      background: #e9ecef;
      border-radius: 4px 4px 0 0;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: end;
    }

    .revenue-bar {
      background: #007bff;
      border-radius: 4px 4px 0 0;
    }

    .expenses-bar {
      background: #dc3545;
      border-radius: 0;
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      margin-top: 8px;
    }

    .month-label {
      font-size: 12px;
      color: #666;
      width: 30px;
      text-align: center;
    }

    .top-properties h4 {
      margin: 0 0 16px 0;
      color: #1a1a1a;
      font-size: 16px;
      font-weight: 600;
    }

    .properties-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .property-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .property-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .property-title {
      font-weight: 500;
      color: #1a1a1a;
    }

    .property-revenue {
      font-size: 14px;
      color: #28a745;
      font-weight: 600;
    }

    .property-metrics {
      text-align: right;
    }

    .occupancy {
      font-size: 12px;
      color: #666;
    }
  `]
})
export class FinancialOverviewComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);
  financialData = signal<FinancialAnalytics | null>(null);

  ngOnInit() {
    this.loadFinancialData();
  }

  loadFinancialData() {
    this.analyticsService.getFinancialAnalytics().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.financialData.set(response.data);
        }
      },
      error: (error) => {
        console.error('Failed to load financial data:', error);
      }
    });
  }

  getBarHeight(revenue: number): number {
    const maxRevenue = Math.max(...(this.financialData()?.monthlyBreakdown?.map(m => m.revenue) || [0]));
    return maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
  }

  getRevenuePercentage(month: any): number {
    const total = month.revenue + month.expenses;
    return total > 0 ? (month.revenue / total) * 100 : 0;
  }

  getExpensesPercentage(month: any): number {
    const total = month.revenue + month.expenses;
    return total > 0 ? (month.expenses / total) * 100 : 0;
  }
}
