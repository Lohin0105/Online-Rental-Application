import { Router } from 'express';
import {
  getFinancialAnalytics,
  getPropertyAnalytics,
  getRecentActivities,
  getTenantOverview,
  getMaintenanceOverview,
  getCalendarEvents
} from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All analytics routes require authentication
router.use(authenticateToken);

// Financial analytics
router.get('/financial', getFinancialAnalytics);

// Property analytics
router.get('/properties', getPropertyAnalytics);

// Recent activities
router.get('/activities', getRecentActivities);

// Tenant overview
router.get('/tenants', getTenantOverview);

// Maintenance overview
router.get('/maintenance', getMaintenanceOverview);

// Calendar events
router.get('/calendar', getCalendarEvents);

export default router;
