import { Router } from 'express';
import { 
  getAllUsers, 
  getAllPropertiesAdmin, 
  getAdminStats,
  deleteUser,
  deletePropertyAdmin,
  updateUserRole
} from '../controllers/adminController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication and admin role
router.get('/stats', authenticateToken, authorizeRoles('admin'), getAdminStats);
router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.get('/properties', authenticateToken, authorizeRoles('admin'), getAllPropertiesAdmin);
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), deleteUser);
router.delete('/properties/:id', authenticateToken, authorizeRoles('admin'), deletePropertyAdmin);
router.patch('/users/:id/role', authenticateToken, authorizeRoles('admin'), updateUserRole);

export default router;
