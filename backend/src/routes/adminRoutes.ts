import { Router } from 'express';
import { getAllPropertiesAdmin, getAllBookingsAdmin } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
// Admin role check is done in the controller functions
router.get('/properties', authenticateToken, getAllPropertiesAdmin);
router.get('/bookings', authenticateToken, getAllBookingsAdmin);

export default router;
