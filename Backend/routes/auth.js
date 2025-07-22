import express from 'express';
import { register, login, getProfile, updateProfile, changePassword, deleteAccount } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateLogin, validateRegister, validateProfileUpdate } from '../middleware/validation.js';
import { body } from 'express-validator';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/profile', validateProfileUpdate, updateProfile);

router.put('/change-password', [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
], changePassword);

router.delete('/account', deleteAccount);

export default router;
