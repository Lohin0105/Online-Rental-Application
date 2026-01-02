import { Router } from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getOwnerProperties
} from '../controllers/propertyController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { propertyValidation, propertyFilterValidation } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', propertyFilterValidation, getAllProperties);
router.get('/:id', getPropertyById);

// Owner routes
router.get('/owner/my-properties', authenticateToken, authorizeRoles('owner', 'admin'), getOwnerProperties);
router.post('/', authenticateToken, authorizeRoles('owner', 'admin'), propertyValidation, createProperty);
router.put('/:id', authenticateToken, authorizeRoles('owner', 'admin'), updateProperty);
router.delete('/:id', authenticateToken, authorizeRoles('owner', 'admin'), deleteProperty);

export default router;

