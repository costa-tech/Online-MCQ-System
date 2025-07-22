import express from 'express';
import { 
  getAllExams, 
  getExamById, 
  getExamQuestions, 
  startExam, 
  getExamStats,
  getExamCategories
} from '../controllers/examController.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validateExamId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Public routes (with optional authentication)
router.get('/', optionalAuth, validatePagination, getAllExams);
router.get('/categories', getExamCategories);
router.get('/:id', validateExamId, getExamById);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/:id/questions', validateExamId, getExamQuestions);
router.post('/:id/start', validateExamId, startExam);
router.get('/:id/stats', validateExamId, getExamStats);

export default router;
