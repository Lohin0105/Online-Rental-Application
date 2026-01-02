import { Router } from 'express';
import {
  createBooking,
  getTenantBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from '../controllers/bookingController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { bookingValidation, bookingStatusValidation } from '../middleware/validation';

const router = Router();

// Tenant routes
router.post('/', authenticateToken, authorizeRoles('tenant'), bookingValidation, createBooking);
router.get('/my-bookings', authenticateToken, authorizeRoles('tenant'), getTenantBookings);
router.delete('/:id', authenticateToken, authorizeRoles('tenant'), cancelBooking);

// Owner routes
router.get('/requests', authenticateToken, authorizeRoles('owner', 'admin'), getOwnerBookings);
router.get('/stats', authenticateToken, authorizeRoles('owner', 'admin'), getBookingStats);
router.patch('/:id/status', authenticateToken, authorizeRoles('owner', 'admin'), bookingStatusValidation, updateBookingStatus);

export default router;

