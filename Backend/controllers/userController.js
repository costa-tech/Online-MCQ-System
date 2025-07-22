import mongoose from 'mongoose';
import User from '../models/User.js';
import Result from '../models/Result.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { sanitizeUser } from '../utils/helpers.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Get user's exam statistics
    const examStats = await Result.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: null,
          totalExams: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          passedExams: {
            $sum: { $cond: [{ $gte: ['$percentage', 40] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = examStats[0] || {
      totalExams: 0,
      averageScore: 0,
      passedExams: 0
    };

    const userProfile = {
      ...sanitizeUser(user),
      stats: {
        totalExams: stats.totalExams,
        averageScore: Math.round(stats.averageScore || 0),
        passedExams: stats.passedExams,
        passRate: stats.totalExams > 0 ? Math.round((stats.passedExams / stats.totalExams) * 100) : 0
      }
    };

    return successResponse(res, userProfile, 'Profile retrieved successfully');

  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== userId) {
        return errorResponse(res, 'Email is already taken', 400);
      }
    }

    // Update user
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, sanitizeUser(user), 'Profile updated successfully');

  } catch (error) {
    next(error);
  }
};

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get recent results
    const recentResults = await Result.find({ userId })
      .populate('exam', 'title category difficulty')
      .sort({ submittedAt: -1 })
      .limit(5)
      .lean();

    // Get overall statistics
    const overallStats = await Result.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalExams: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          passedExams: {
            $sum: { $cond: [{ $gte: ['$percentage', 40] }, 1, 0] }
          },
          totalScore: { $sum: '$score' },
          totalPossibleScore: { $sum: '$totalMarks' }
        }
      }
    ]);

    // Get category performance
    const categoryPerformance = await Result.aggregate([
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
      { $sort: { averageScore: -1 } },
      { $limit: 5 }
    ]);

    const stats = overallStats[0] || {
      totalExams: 0,
      averageScore: 0,
      passedExams: 0,
      totalScore: 0,
      totalPossibleScore: 0
    };

    const dashboard = {
      user: sanitizeUser(req.user),
      overview: {
        totalExams: stats.totalExams,
        passedExams: stats.passedExams,
        failedExams: stats.totalExams - stats.passedExams,
        passRate: stats.totalExams > 0 ? Math.round((stats.passedExams / stats.totalExams) * 100) : 0,
        averageScore: Math.round(stats.averageScore || 0),
        overallPercentage: stats.totalPossibleScore > 0 ? Math.round((stats.totalScore / stats.totalPossibleScore) * 100) : 0
      },
      recentResults: recentResults.map(result => ({
        resultId: result._id,
        exam: result.exam,
        percentage: result.percentage,
        grade: result.grade,
        isPassed: result.isPassed,
        submittedAt: result.submittedAt
      })),
      categoryPerformance: categoryPerformance.map(cat => ({
        category: cat._id,
        examCount: cat.examCount,
        averageScore: Math.round(cat.averageScore),
        bestScore: Math.round(cat.bestScore)
      }))
    };

    return successResponse(res, dashboard, 'Dashboard data retrieved successfully');

  } catch (error) {
    next(error);
  }
};
