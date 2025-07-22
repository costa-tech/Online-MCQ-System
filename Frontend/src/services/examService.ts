import { apiRequest, ApiResponse, PaginatedResponse } from '../utils/api';

export interface Exam {
  _id: string;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  instructions: string;
  questionCount: number;
  formattedDuration: string;
  isActive: boolean;
  createdAt: string;
}

export interface Question {
  _id: string;
  examId: string;
  question: string;
  options: string[];
  marks: number;
  difficulty?: string;
  orderIndex: number;
}

export interface ExamWithQuestions extends Exam {
  questions: Question[];
}

export interface StartExamResponse {
  exam: {
    id: string;
    title: string;
    description: string;
    duration: number;
    totalMarks: number;
    instructions: string;
  };
  questions: Question[];
  startTime: string;
  expiryTime: string;
}

export interface ExamFilters {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  search?: string;
}

export interface ExamStats {
  exam: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
  };
  stats: {
    totalAttempts: number;
    averageScore: number;
    averagePercentage: number;
    highestScore: number;
    lowestScore: number;
    passCount: number;
    questionCount: number;
    passRate: number;
  };
}

export interface ExamCategory {
  name: string;
  count: number;
}

export const examService = {
  // Get all exams with optional filters
  getExams: async (filters: ExamFilters = {}): Promise<PaginatedResponse<Exam>> => {
    return apiRequest<PaginatedResponse<Exam>>('/exams', {
      query: filters as Record<string, string | number>,
    });
  },

  // Get exam by ID
  getExamById: async (examId: string): Promise<ApiResponse<Exam>> => {
    return apiRequest<ApiResponse<Exam>>(`/exams/${examId}`);
  },

  // Start an exam (get questions)
  startExam: async (examId: string): Promise<ApiResponse<StartExamResponse>> => {
    return apiRequest<ApiResponse<StartExamResponse>>(`/exams/${examId}/start`, {
      method: 'POST',
      requireAuth: true,
    });
  },

  // Get exam statistics
  getExamStats: async (examId: string): Promise<ApiResponse<ExamStats>> => {
    return apiRequest<ApiResponse<ExamStats>>(`/exams/${examId}/stats`);
  },

  // Get exam categories
  getCategories: async (): Promise<ApiResponse<ExamCategory[]>> => {
    return apiRequest<ApiResponse<ExamCategory[]>>('/exams/categories');
  },

  // Get questions for an exam (alternative endpoint)
  getExamQuestions: async (examId: string): Promise<ApiResponse<{ exam: Exam; questions: Question[] }>> => {
    return apiRequest<ApiResponse<{ exam: Exam; questions: Question[] }>>(`/exams/${examId}/questions`);
  },
};
