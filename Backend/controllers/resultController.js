import mongoose from 'mongoose';
import Result from '../models/Result.js';
import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import { successResponse, errorResponse, createdResponse, paginatedResponse } from '../utils/response.js';
import { calculatePagination, getPaginationMeta, formatTime } from '../utils/helpers.js';

export const submitResult = async (req, res, next) => {
  try {
    const { examId, answers, timeTaken, startedAt } = req.body;
    const userId = req.user.id;

    // Verify exam exists
    const exam = await Exam.findById(examId);
    if (!exam || !exam.isActive) {
      return errorResponse(res, 'Exam not found', 404);
    }

    // Get all questions for this exam
    const questions = await Question.find({ examId, isActive: true });
    if (questions.length === 0) {
      return errorResponse(res, 'No questions found for this exam', 400);
    }

    // Validate that all questions are answered
    if (answers.length !== questions.length) {
      return errorResponse(res, 'Please answer all questions', 400);
    }

    // Create a map for quick question lookup
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    // Process answers and calculate score
    let score = 0;
    let correctAnswers = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        return errorResponse(res, `Question ${answer.questionId} not found`, 400);
      }

      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      const marksObtained = isCorrect ? question.marks : 0;

      if (isCorrect) {
        correctAnswers++;
        score += marksObtained;
      }

      processedAnswers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        marksObtained,
        timeTaken: answer.timeTaken || 0
      });
    }

    // Calculate percentage
    const percentage = Math.round((score / exam.totalMarks) * 100);

    // Create result record
    const result = new Result({
      userId,
      examId,
      answers: processedAnswers,
      totalQuestions: questions.length,
      correctAnswers,
      score,
      totalMarks: exam.totalMarks,
      percentage,
      timeTaken,
      startedAt: new Date(startedAt),
      submittedAt: new Date()
    });

    // Generate feedback
    result.feedback = result.generateFeedback();

    await result.save();

    // Populate exam details for response
    await result.populate('exam', 'title category difficulty');

    // Format response with detailed results
    const responseData = {
      resultId: result._id,
      exam: {
        id: exam._id,
        title: exam.title,
        category: exam.category,
        difficulty: exam.difficulty
      },
      score: {
        obtained: score,
        total: exam.totalMarks,
        percentage
      },
      answers: {
        total: questions.length,
        correct: correctAnswers,
        incorrect: questions.length - correctAnswers
      },
      time: {
        taken: timeTaken,
        formatted: formatTime(timeTaken),
        allowed: exam.duration * 60
      },
      grade: result.grade,
      isPassed: result.isPassed,
      feedback: result.feedback,
      submittedAt: result.submittedAt
    };

    return createdResponse(res, responseData, 'Exam submitted successfully');

  } catch (error) {
    next(error);
  }
};

export const getResultById = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    const userId = req.user.id;

    const result = await Result.findOne({ _id: resultId, userId })
      .populate('exam', 'title category difficulty totalMarks')
      .populate({
        path: 'answers.questionId',
        select: 'question options correctAnswer explanation marks',
        model: 'Question'
      });

    if (!result) {
      return errorResponse(res, 'Result not found', 404);
    }

    // Format detailed result with question details
    const detailedResult = {
      resultId: result._id,
      exam: result.exam,
      score: {
        obtained: result.score,
        total: result.totalMarks,
        percentage: result.percentage
      },
      answers: {
        total: result.totalQuestions,
        correct: result.correctAnswers,
        incorrect: result.totalQuestions - result.correctAnswers
      },
      time: {
        taken: result.timeTaken,
        formatted: formatTime(result.timeTaken)
      },
      grade: result.grade,
      isPassed: result.isPassed,
      feedback: result.feedback,
      submittedAt: result.submittedAt,
      questionDetails: result.answers.map(answer => ({
        question: answer.questionId.question,
        options: answer.questionId.options,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: answer.questionId.correctAnswer,
        isCorrect: answer.isCorrect,
        marksObtained: answer.marksObtained,
        totalMarks: answer.questionId.marks,
        explanation: answer.questionId.explanation
      }))
    };

    return successResponse(res, detailedResult, 'Result retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const getUserResults = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;
    const requestingUserId = req.user.id;

    // Check if user is requesting their own results
    if (userId !== requestingUserId) {
      return errorResponse(res, 'Access denied', 403);
    }

    const { page: currentPage, limit: itemsPerPage, skip } = calculatePagination(page, limit);

    // Get total count
    const total = await Result.countDocuments({ userId });

    // Get results with exam details
    const results = await Result.find({ userId })
      .populate('exam', 'title category difficulty')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .lean();

    // Format results
    const formattedResults = results.map(result => ({
      resultId: result._id,
      exam: result.exam,
      score: {
        obtained: result.score,
        total: result.totalMarks,
        percentage: result.percentage
      },
      answers: {
        total: result.totalQuestions,
        correct: result.correctAnswers,
        incorrect: result.totalQuestions - result.correctAnswers
      },
      time: {
        taken: result.timeTaken,
        formatted: formatTime(result.timeTaken)
      },
      grade: result.grade,
      isPassed: result.isPassed,
      submittedAt: result.submittedAt
    }));

    const pagination = getPaginationMeta(total, currentPage, itemsPerPage);

    return paginatedResponse(res, formattedResults, pagination, 'User results retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's overall statistics
    const stats = await Result.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalExams: { $sum: 1 },
          totalScore: { $sum: '$score' },
          totalPossibleScore: { $sum: '$totalMarks' },
          averagePercentage: { $avg: '$percentage' },
          highestScore: { $max: '$percentage' },
          lowestScore: { $min: '$percentage' },
          passedExams: {
            $sum: { $cond: [{ $gte: ['$percentage', 40] }, 1, 0] }
          },
          totalTimeTaken: { $sum: '$timeTaken' }
        }
      }
    ]);

    // Get category-wise performance
    const categoryStats = await Result.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'exams',
          localField: 'examId',
          foreignField: '_id',
          as: 'exam'
        }
      },
      { $unwind: '$exam' },
      {
        $group: {
          _id: '$exam.category',
          examCount: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          bestScore: { $max: '$percentage' }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    // Get recent activity
    const recentResults = await Result.find({ userId })
      .populate('exam', 'title category')
      .sort({ submittedAt: -1 })
      .limit(5)
      .select('exam percentage grade submittedAt')
      .lean();

    const userStats = stats[0] || {
      totalExams: 0,
      totalScore: 0,
      totalPossibleScore: 0,
      averagePercentage: 0,
      highestScore: 0,
      lowestScore: 0,
      passedExams: 0,
      totalTimeTaken: 0
    };

    const response = {
      overall: {
        ...userStats,
        passRate: userStats.totalExams > 0 ? Math.round((userStats.passedExams / userStats.totalExams) * 100) : 0,
        totalTimeFormatted: formatTime(userStats.totalTimeTaken)
      },
      categoryPerformance: categoryStats,
      recentActivity: recentResults.map(result => ({
        exam: result.exam,
        percentage: result.percentage,
        grade: result.grade,
        submittedAt: result.submittedAt
      }))
    };

    return successResponse(res, response, 'User statistics retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const deleteResult = async (req, res, next) => {
  try {
    const { resultId } = req.params;
    const userId = req.user.id;

    const result = await Result.findOneAndDelete({ _id: resultId, userId });

    if (!result) {
      return errorResponse(res, 'Result not found', 404);
    }

    return successResponse(res, null, 'Result deleted successfully');

  } catch (error) {
    next(error);
  }
};
