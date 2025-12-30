import { Router } from 'express';
import { 
  demoGetAllUsers, 
  demoGetAllProperties, 
  demoGetAdminStats,
  demoDeleteUser,
  demoDeleteProperty,
  demoUpdateUserRole
} from '../controllers/adminController.demo';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Demo mode - All routes require authentication and admin role
router.get('/stats', authenticateToken, authorizeRoles('admin'), demoGetAdminStats);
router.get('/users', authenticateToken, authorizeRoles('admin'), demoGetAllUsers);
router.get('/properties', authenticateToken, authorizeRoles('admin'), demoGetAllProperties);
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), demoDeleteUser);
router.delete('/properties/:id', authenticateToken, authorizeRoles('admin'), demoDeleteProperty);
router.patch('/users/:id/role', authenticateToken, authorizeRoles('admin'), demoUpdateUserRole);

export default router;
