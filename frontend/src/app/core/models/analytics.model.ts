export interface FinancialAnalytics {
    totalRevenue: number;
    monthlyRevenue: number;
    pendingPayments: number;
    monthlyBreakdown: {
        month: string;
        revenue: number;
        expenses: number;
    }[];
    topPerformingProperties: {
        id: number;
        title: string;
        revenue: number;
        occupancyRate: number;
    }[];
}

export interface PropertyAnalytics {
    totalProperties: number;
    activeProperties: number;
    occupancyRate: number;
    averageRent: number;
    propertyPerformance: {
        id: number;
        title: string;
        views: number;
        inquiries: number;
        bookings: number;
        occupancyRate: number;
        averageRating: number;
    }[];
    marketInsights: {
        averageMarketRent: number;
        demandTrend: string;
        competitorCount: number;
    };
}

export interface Activity {
    id: number;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    icon: string;
    color: string;
}

export interface TenantOverview {
    activeTenants: number;
    totalTenants: number;
    tenants: {
        id: number;
        name: string;
        email: string;
        phone: string;
        property: string;
        leaseStart: string;
        leaseEnd: string;
        monthlyRent: number;
        status: string;
        paymentStatus: string;
    }[];
    upcomingRenewals: {
        tenant: string;
        property: string;
        renewalDate: string;
        daysUntilRenewal: number;
    }[];
}

export interface MaintenanceRequest {
    id: number;
    property: string;
    issue: string;
    priority: string;
    status: string;
    reportedDate: string;
    tenant: string | null;
    estimatedCost: number;
}

export interface CalendarEvent {
    id: number;
    title: string;
    type: string;
    date: string;
    property: string;
    tenant: string | null;
    amount: number | null;
    status: string;
}
