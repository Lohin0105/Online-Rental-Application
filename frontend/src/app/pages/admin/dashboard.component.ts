import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../core/services/admin.service';
import { forkJoin, Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
    standalone: true,
  selector: 'app-admin-dashboard',
    imports: [
        CommonModule,
        MatCardModule,
        MatTableModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    stats = signal<any>(null);
    users = signal<any[]>([]);
    properties = signal<any[]>([]);
    bookings = signal<any[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);
    lastUpdated = signal<Date | null>(null);
    private refreshSubscription: Subscription | null = null;

    // Table columns
    usersColumns: string[] = ['id', 'name', 'email', 'role', 'created_at', 'actions'];
    propertiesColumns: string[] = ['id', 'title', 'location', 'rent', 'owner_name', 'status', 'actions'];
    bookingsColumns: string[] = ['id', 'property_id', 'tenant_id', 'status', 'request_time'];

    constructor(private adminService: AdminService) { }

    ngOnInit(): void {
        this.startLiveUpdates();
    }

    ngOnDestroy(): void {
        this.stopLiveUpdates();
    }

    startLiveUpdates(): void {
        this.loading.set(true);
        // Poll every 30 seconds
        this.refreshSubscription = interval(30000).pipe(
            startWith(0),
            switchMap(() => forkJoin({
                stats: this.adminService.getAdminStats(),
                users: this.adminService.getAllUsers(),
                properties: this.adminService.getAllProperties(),
                bookings: this.adminService.getAllBookings()
            }))
        ).subscribe({
            next: (data) => {
                this.stats.set(data.stats.data || {});
                this.users.set(data.users.data || []);
                this.properties.set(data.properties.data || []);
                this.bookings.set(data.bookings.data || []);
                this.lastUpdated.set(new Date());
                this.loading.set(false);
                this.error.set(null);
            },
            error: (error) => {
                console.error('Error fetching admin data:', error);
                // Don't show error UI on subsequent polls if we already have data
                if (this.loading()) {
                    this.error.set('Failed to load admin data. Retrying...');
                }
                this.loading.set(false);
            }
        });
    }

    deleteUser(userId: number): void {
        if (confirm('Are you sure you want to delete this user?')) {
            this.adminService.deleteUser(userId).subscribe({
                next: () => {
                    alert('User deleted successfully');
                    this.manualRefresh();
                },
                error: (err) => {
                    alert('Failed to delete user');
                }
            });
        }
    }

    deleteProperty(propertyId: number): void {
        if (confirm('Are you sure you want to delete this property?')) {
            this.adminService.deleteProperty(propertyId).subscribe({
                next: () => {
                    alert('Property deleted successfully');
                    this.manualRefresh();
                },
                error: (err) => {
                    alert('Failed to delete property');
                }
            });
        }
    }

    stopLiveUpdates(): void {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
            this.refreshSubscription = null;
        }
    }

    manualRefresh(): void {
        this.stopLiveUpdates();
        this.startLiveUpdates();
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'Pending': return 'accent';
            case 'Approved': return 'primary';
            case 'Rejected': return 'warn';
            default: return '';
        }
    }

    formatDate(date: string): string {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString();
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }
}
