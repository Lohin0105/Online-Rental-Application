import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import {
  createBooking,
  getTenantBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingStats
} from '../controllers/bookingController';

const router = Router();

// Create a new booking request (Tenant only)
router.post('/', authenticateToken, authorizeRoles('tenant'), createBooking);

// Get tenant's own bookings
router.get('/my-bookings', authenticateToken, authorizeRoles('tenant'), getTenantBookings);

// Cancel a booking (Tenant only - can only cancel own pending bookings)
router.delete('/:id', authenticateToken, authorizeRoles('tenant'), cancelBooking);

// Get booking requests for owner's properties (Owner/Admin)
router.get('/requests', authenticateToken, authorizeRoles('owner', 'admin'), getOwnerBookings);

// Get booking stats (Owner/Admin)
router.get('/stats', authenticateToken, authorizeRoles('owner', 'admin'), getBookingStats);

// Update booking status - approve/reject (Owner/Admin)
router.patch('/:id/status', authenticateToken, authorizeRoles('owner', 'admin'), updateBookingStatus);

export default router;
