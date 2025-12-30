import { Router } from 'express';
import {
    submitPropertyRating,
    submitUserRating,
    getPropertyRatings,
    getUserRatings
} from '../controllers/ratingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Submit ratings (Protected)
router.post('/property', authenticateToken, submitPropertyRating);
router.post('/user', authenticateToken, submitUserRating);

// Get ratings (Public or Protected, depending on preference, but here we make it public for display)
router.get('/property/:propertyId', getPropertyRatings);
router.get('/user/:userId', getUserRatings);

export default router;
