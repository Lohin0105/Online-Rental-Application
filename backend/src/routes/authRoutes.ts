import { Router } from 'express';
import { demoLogin, demoRegister, demoProfile } from '../controllers/authController.demo';
import { loginValidation } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// DEMO MODE - Using hardcoded accounts
router.post('/register', demoRegister);
router.post('/login', loginValidation, demoLogin);
router.get('/profile', authenticateToken, demoProfile);
router.put('/profile', authenticateToken, (req, res) => {
  res.status(400).json({ success: false, message: 'Profile updates disabled in demo mode' });
});

export default router;

