import express from 'express';
import { getProfile, updateProfile, getUserDashboard } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validateProfileUpdate } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);
router.get('/dashboard', getUserDashboard);

export default router;
