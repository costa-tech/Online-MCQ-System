import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { calculatePagination, getPaginationMeta, formatExamDuration } from '../utils/helpers.js';

export const getAllExams = async (req, res, next) => {
  try {
    const { page, limit, category, difficulty, search } = req.query;
    const { page: currentPage, limit: itemsPerPage, skip } = calculatePagination(page, limit);

    // Build query
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await Exam.countDocuments(query);

    // Get exams with question count
    const exams = await Exam.find(query)
      .populate('questionCount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    // Format response
    const formattedExams = exams.map(exam => ({
      ...exam,
      formattedDuration: formatExamDuration(exam.duration),
      questionCount: exam.questionCount || 0
    }));

    const pagination = getPaginationMeta(total, currentPage, itemsPerPage);

    return paginatedResponse(res, formattedExams, pagination, 'Exams retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id)
      .populate('questionCount')
      .lean();

    if (!exam || !exam.isActive) {
      return errorResponse(res, 'Exam not found', 404);
    }

    // Add formatted duration and question count
    const formattedExam = {
      ...exam,
      formattedDuration: formatExamDuration(exam.duration),
      questionCount: exam.questionCount || 0
    };

    return successResponse(res, formattedExam, 'Exam retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const getExamQuestions = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify exam exists and is active
    const exam = await Exam.findById(id);
    if (!exam || !exam.isActive) {
      return errorResponse(res, 'Exam not found', 404);
    }

    // Get questions without correct answers for security
    const questions = await Question.find({ examId: id, isActive: true })
      .select('-correctAnswer -explanation')
      .sort({ orderIndex: 1 })
      .lean();

    return successResponse(res, {
      exam: {
        id: exam._id,
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        instructions: exam.instructions
      },
      questions
    }, 'Exam questions retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const startExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify exam exists and is active
    const exam = await Exam.findById(id);
    if (!exam || !exam.isActive) {
      return errorResponse(res, 'Exam not found', 404);
    }

    // Check if user has already taken this exam (commented out for testing)
    // const existingResult = await Result.findOne({ userId, examId: id });
    // if (existingResult) {
    //   return errorResponse(res, 'You have already taken this exam', 400);
    // }

    // Get questions for the exam
    const questions = await Question.find({ examId: id, isActive: true })
      .select('-correctAnswer -explanation')
      .sort({ orderIndex: 1 })
      .lean();

    if (questions.length === 0) {
      return errorResponse(res, 'No questions available for this exam', 400);
    }

    return successResponse(res, {
      exam: {
        id: exam._id,
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        instructions: exam.instructions
      },
      questions,
      startTime: new Date().toISOString(),
      expiryTime: new Date(Date.now() + exam.duration * 60 * 1000).toISOString()
    }, 'Exam started successfully');

  } catch (error) {
    next(error);
  }
};

export const getExamStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify exam exists
    const exam = await Exam.findById(id);
    if (!exam) {
      return errorResponse(res, 'Exam not found', 404);
    }

    // Get exam statistics
    const stats = await Result.getExamStats(id);
    
    // Get question count
    const questionCount = await Question.countDocuments({ examId: id, isActive: true });

    const response = {
      exam: {
        id: exam._id,
        title: exam.title,
        category: exam.category,
        difficulty: exam.difficulty
      },
      stats: {
        ...stats,
        questionCount,
        passRate: stats.totalAttempts > 0 ? Math.round((stats.passCount / stats.totalAttempts) * 100) : 0
      }
    };

    return successResponse(res, response, 'Exam statistics retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const getExamCategories = async (req, res, next) => {
  try {
    const categories = await Exam.distinct('category', { isActive: true });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Exam.countDocuments({ category, isActive: true });
        return { name: category, count };
      })
    );

    return successResponse(res, categoriesWithCount, 'Exam categories retrieved successfully');

  } catch (error) {
    next(error);
  }
};
