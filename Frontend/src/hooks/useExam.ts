import { useState, useCallback } from 'react';
import { examService, Exam, StartExamResponse } from '../services/examService';
import { resultService, SubmitResultRequest, ResultSummary, Answer } from '../services/resultService';

export interface ExamState {
  currentExam: StartExamResponse | null;
  exams: Exam[];
  isLoading: boolean;
  error: string | null;
  examStartTime: Date | null;
}

export const useExam = () => {
  const [state, setState] = useState<ExamState>({
    currentExam: null,
    exams: [],
    isLoading: false,
    error: null,
    examStartTime: null,
  });

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const setError = (error: string | null) => {
    setState(prev => ({ ...prev, error }));
  };

  const clearError = () => setError(null);

  // Load available exams
  const loadExams = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      clearError();
      
      const response = await examService.getExams(filters);
      
      if (response.success) {
        setState(prev => ({ ...prev, exams: response.data }));
      } else {
        throw new Error(response.message || 'Failed to load exams');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load exams';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Start an exam
  const startExam = useCallback(async (examId: string): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await examService.startExam(examId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          currentExam: response.data,
          examStartTime: new Date(),
        }));
        return true;
      } else {
        throw new Error(response.message || 'Failed to start exam');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start exam';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit exam results
  const submitExam = useCallback(async (answers: Answer[]): Promise<ResultSummary | null> => {
    if (!state.currentExam || !state.examStartTime) {
      setError('No active exam to submit');
      return null;
    }

    try {
      setLoading(true);
      clearError();

      const timeTaken = Math.floor((Date.now() - state.examStartTime.getTime()) / 1000);
      
      const submitData: SubmitResultRequest = {
        examId: state.currentExam.exam.id,
        answers,
        timeTaken,
        startedAt: state.examStartTime.toISOString(),
      };

      const response = await resultService.submitResult(submitData);
      
      if (response.success) {
        // Clear current exam after successful submission
        setState(prev => ({
          ...prev,
          currentExam: null,
          examStartTime: null,
        }));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to submit exam');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit exam';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [state.currentExam, state.examStartTime]);

  // End exam (without submitting)
  const endExam = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentExam: null,
      examStartTime: null,
    }));
  }, []);

  // Get exam by ID
  const getExamById = useCallback(async (examId: string): Promise<Exam | null> => {
    try {
      setLoading(true);
      clearError();
      
      const response = await examService.getExamById(examId);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load exam');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load exam';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate remaining time for current exam
  const getRemainingTime = useCallback((): number => {
    if (!state.currentExam || !state.examStartTime) return 0;
    
    const examDurationMs = state.currentExam.exam.duration * 60 * 1000;
    const elapsedMs = Date.now() - state.examStartTime.getTime();
    const remainingMs = examDurationMs - elapsedMs;
    
    return Math.max(0, Math.floor(remainingMs / 1000));
  }, [state.currentExam, state.examStartTime]);

  return {
    ...state,
    loadExams,
    startExam,
    submitExam,
    endExam,
    getExamById,
    getRemainingTime,
    clearError,
  };
};
