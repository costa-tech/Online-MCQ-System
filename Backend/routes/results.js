import express from 'express';
import { 
  submitResult, 
  getResultById, 
  getUserResults, 
  getUserStats,
  deleteResult
} from '../controllers/resultController.js';
import { authenticate } from '../middleware/auth.js';
import { validateResultSubmission, validateResultQuery } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validateResultSubmission, submitResult);
router.get('/user/:userId', validateResultQuery, getUserResults);
router.get('/stats', getUserStats);
router.get('/:resultId', validateResultQuery, getResultById);
router.delete('/:resultId', validateResultQuery, deleteResult);

export default router;
