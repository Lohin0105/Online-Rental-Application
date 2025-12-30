import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// DEMO MODE - Mock responses
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Demo mode - No properties available. Database required for full functionality.'
  });
});

router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'Demo mode - Property details unavailable'
  });
});

router.get('/owner/my-properties', authenticateToken, authorizeRoles('owner', 'admin'), (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Demo mode - No properties'
  });
});

router.post('/', authenticateToken, authorizeRoles('owner', 'admin'), (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Demo mode - Cannot create properties. Database required.'
  });
});

router.put('/:id', authenticateToken, authorizeRoles('owner', 'admin'), (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Demo mode - Cannot update properties'
  });
});

router.delete('/:id', authenticateToken, authorizeRoles('owner', 'admin'), (req, res) => {
  res.status(400).json({
    success: false,
    message: 'Demo mode - Cannot delete properties'
  });
});

export default router;

