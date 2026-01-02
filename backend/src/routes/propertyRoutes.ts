import { Router } from 'express';
import { 
  getAllProperties, 
  getPropertyById, 
  getOwnerProperties, 
  createProperty, 
  updateProperty, 
  deleteProperty 
} from '../controllers/propertyController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// PRODUCTION MODE - Using database with real controllers
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.get('/owner/my-properties', authenticateToken, authorizeRoles('owner', 'admin'), getOwnerProperties);
router.post('/', authenticateToken, authorizeRoles('owner', 'admin'), createProperty);
router.put('/:id', authenticateToken, authorizeRoles('owner', 'admin'), updateProperty);
router.delete('/:id', authenticateToken, authorizeRoles('owner', 'admin'), deleteProperty);

export default router;

