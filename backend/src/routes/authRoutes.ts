import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { loginValidation } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// PRODUCTION MODE - Using database with real authentication
router.post('/register', register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;

