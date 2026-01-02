import { Router } from 'express';
import analyticsRoutes from './analyticsRoutes';
import authRoutes from './authRoutes';
import propertyRoutes from './propertyRoutes';
import bookingRoutes from './bookingRoutes';
import adminRoutes from './adminRoutes';
import ratingRoutes from './ratingRoutes';
import chatbotRoutes from './chatbotRoutes';

const router = Router();

router.use('/analytics', analyticsRoutes);
router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/bookings', bookingRoutes);
router.use('/admin', adminRoutes);
router.use('/ratings', ratingRoutes);
router.use('/chatbot', chatbotRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;

