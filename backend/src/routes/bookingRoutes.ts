import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// DEMO MODE - Mock responses
router.post('/', authenticateToken, authorizeRoles('tenant'), (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Demo mode - Cannot create bookings. Database required.'
  });
});

router.get('/my-bookings', authenticateToken, authorizeRoles('tenant'), (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Demo mode - No bookings'
  });
});

router.delete('/:id', authenticateToken, authorizeRoles('tenant'), (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Demo mode - Cannot delete bookings'
  });
});

router.get('/requests', authenticateToken, authorizeRoles('owner', 'admin'), (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Demo mode - No booking requests'
  });
});

router.get('/stats', authenticateToken, authorizeRoles('owner', 'admin'), (req, res) => {
  res.json({
    success: true,
    data: { total: 0, pending: 0, approved: 0, rejected: 0 }
  });
});

router.patch('/:id/status', authenticateToken, authorizeRoles('owner', 'admin'), (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Demo mode - Cannot update bookings'
  });
});

export default router;

