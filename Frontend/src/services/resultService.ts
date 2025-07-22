import { apiRequest, ApiResponse, PaginatedResponse } from '../utils/api';

export interface Answer {
  questionId: string;
  selectedAnswer: number;
  timeTaken?: number;
}

export interface SubmitResultRequest {
  examId: string;
  answers: Answer[];
  timeTaken: number;
  startedAt: string;
}

export interface ResultAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  marksObtained: number;
  timeTaken?: number;
}

export interface Result {
  _id: string;
  userId: string;
  examId: string;
  answers: ResultAnswer[];
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number;
  grade: string;
  isPassed: boolean;
  feedback: string;
  startedAt: string;
  submittedAt: string;
}

export interface ResultSummary {
  resultId: string;
  exam: {
    _id: string;
    title: string;
    category: string;
    difficulty: string;
  };
  score: {
    obtained: number;
    total: number;
    percentage: number;
  };
  answers: {
    total: number;
    correct: number;
    incorrect: number;
  };
  time: {
    taken: number;
    formatted: string;
    allowed?: number;
  };
  grade: string;
  isPassed: boolean;
  submittedAt: string;
}

export interface DetailedResult extends ResultSummary {
  feedback: string;
  questionDetails: Array<{
    question: string;
    options: string[];
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    marksObtained: number;
    totalMarks: number;
    explanation?: string;
  }>;
}

export interface UserStats {
  overall: {
    totalExams: number;
    averagePercentage: number;
    passedExams: number;
    passRate: number;
    totalScore: number;
    totalPossibleScore: number;
    totalTimeTaken: number;
    totalTimeFormatted: string;
    highestScore: number;
    lowestScore: number;
  };
  categoryPerformance: Array<{
    _id: string;
    examCount: number;
    averageScore: number;
    bestScore: number;
  }>;
  recentActivity: Array<{
    exam: {
      title: string;
      category: string;
    };
    percentage: number;
    grade: string;
    submittedAt: string;
  }>;
}

export interface UserDashboard {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  overview: {
    totalExams: number;
    passedExams: number;
    failedExams: number;
    passRate: number;
    averageScore: number;
    overallPercentage: number;
  };
  recentResults: Array<{
    resultId: string;
    exam: {
      title: string;
      category: string;
    };
    percentage: number;
    grade: string;
    isPassed: boolean;
    submittedAt: string;
  }>;
  categoryPerformance: Array<{
    category: string;
    examCount: number;
    averageScore: number;
    bestScore: number;
  }>;
}

export const resultService = {
  // Submit exam result
  submitResult: async (resultData: SubmitResultRequest): Promise<ApiResponse<ResultSummary>> => {
    return apiRequest<ApiResponse<ResultSummary>>('/results', {
      method: 'POST',
      body: resultData,
      requireAuth: true,
    });
  },

  // Get result by ID with detailed information
  getResultById: async (resultId: string): Promise<ApiResponse<DetailedResult>> => {
    return apiRequest<ApiResponse<DetailedResult>>(`/results/${resultId}`, {
      requireAuth: true,
    });
  },

  // Get user's results
  getUserResults: async (userId: string, page = 1, limit = 10): Promise<PaginatedResponse<ResultSummary>> => {
    return apiRequest<PaginatedResponse<ResultSummary>>(`/results/user/${userId}`, {
      query: { page, limit },
      requireAuth: true,
    });
  },

  // Get user statistics
  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    return apiRequest<ApiResponse<UserStats>>('/results/stats', {
      requireAuth: true,
    });
  },

  // Get user dashboard data
  getUserDashboard: async (): Promise<ApiResponse<UserDashboard>> => {
    return apiRequest<ApiResponse<UserDashboard>>('/users/dashboard', {
      requireAuth: true,
    });
  },

  // Delete a result
  deleteResult: async (resultId: string): Promise<ApiResponse<null>> => {
    return apiRequest<ApiResponse<null>>(`/results/${resultId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  },
};
