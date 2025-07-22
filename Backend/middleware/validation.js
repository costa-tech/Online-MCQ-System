import { body, param, query, validationResult } from 'express-validator';

// Middleware to handle validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Auth validation rules
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
];

// Exam validation rules
export const validateExamId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid exam ID format'),
  handleValidationErrors
];

export const validateExamCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('duration')
    .isInt({ min: 1, max: 300 })
    .withMessage('Duration must be between 1 and 300 minutes'),
  body('totalMarks')
    .isInt({ min: 1 })
    .withMessage('Total marks must be at least 1'),
  body('category')
    .optional()
    .isIn(['JavaScript', 'React', 'Web Development', 'Node.js', 'Database', 'General', 'Other'])
    .withMessage('Invalid category'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Invalid difficulty level'),
  handleValidationErrors
];

// Question validation rules
export const validateQuestionCreation = [
  body('question')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Question must be between 10 and 1000 characters'),
  body('options')
    .isArray({ min: 2, max: 6 })
    .withMessage('Question must have between 2 and 6 options'),
  body('options.*')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Each option must be between 1 and 200 characters'),
  body('correctAnswer')
    .isInt({ min: 0 })
    .withMessage('Correct answer must be a valid option index'),
  body('marks')
    .isInt({ min: 1, max: 100 })
    .withMessage('Marks must be between 1 and 100'),
  body('explanation')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Explanation cannot exceed 500 characters'),
  handleValidationErrors
];

// Result validation rules
export const validateResultSubmission = [
  body('examId')
    .isMongoId()
    .withMessage('Invalid exam ID format'),
  body('answers')
    .isArray({ min: 1 })
    .withMessage('At least one answer is required'),
  body('answers.*.questionId')
    .isMongoId()
    .withMessage('Invalid question ID format'),
  body('answers.*.selectedAnswer')
    .isInt({ min: 0 })
    .withMessage('Selected answer must be a valid option index'),
  body('timeTaken')
    .isInt({ min: 0 })
    .withMessage('Time taken must be a positive number'),
  body('startedAt')
    .isISO8601()
    .withMessage('Invalid start time format'),
  handleValidationErrors
];

export const validateResultQuery = [
  param('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID format'),
  param('resultId')
    .optional()
    .isMongoId()
    .withMessage('Invalid result ID format'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be at least 1'),
  handleValidationErrors
];

// User validation rules
export const validateUserId = [
  param('userId')
    .isMongoId()
    .withMessage('Invalid user ID format'),
  handleValidationErrors
];

export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  handleValidationErrors
];

// Pagination validation
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be at least 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'title', '-title', 'difficulty', '-difficulty'])
    .withMessage('Invalid sort parameter'),
  handleValidationErrors
];
