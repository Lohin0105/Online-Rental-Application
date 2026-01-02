import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { sendMessage } from '../controllers/chatbotController';

const router = Router();

// All chatbot routes require authentication
router.post('/message', authenticateToken, sendMessage);

export default router;
