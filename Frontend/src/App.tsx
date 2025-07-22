import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Layout/Header';
import { HeroSection } from './components/Hero/HeroSection';
import { LoginForm } from './components/Auth/LoginForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ExamInterface } from './components/Exam/ExamInterface';
import { ResultsView } from './components/Results/ResultsView';
import { Background3D } from './components/3D/Background3D';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useExam } from './hooks/useExam';
import { Exam } from './services/examService';
import { ResultSummary } from './services/resultService';
import './index.css';

type AppState = 'hero' | 'login' | 'dashboard' | 'exam' | 'results';

// Main App Component
const AppContent: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>('hero');
  const [examResult, setExamResult] = useState<ResultSummary | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const examHook = useExam();

  // Auto-navigate based on authentication state
  useEffect(() => {
    if (isAuthenticated && currentState === 'login') {
      setCurrentState('dashboard');
    } else if (!isAuthenticated && (currentState === 'dashboard' || currentState === 'exam' || currentState === 'results')) {
      setCurrentState('hero');
    }
  }, [isAuthenticated, currentState]);

  // Load exams when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      examHook.loadExams();
    }
  }, [isAuthenticated, examHook]);

  const handleLogin = () => {
    setCurrentState('dashboard');
  };

  const handleStartExam = async (exam: Exam) => {
    const success = await examHook.startExam(exam._id);
    if (success) {
      setCurrentState('exam');
    }
  };

  const handleExamSubmit = async (
    examId: string, 
    answers: Array<{ questionId: string; selectedAnswer: number; timeTaken?: number }>, 
    timeTaken: number
  ): Promise<ResultSummary | null> => {
    // Convert the answers format to what the hook expects
    const formattedAnswers = answers.map(answer => ({
      questionId: answer.questionId,
      selectedAnswer: answer.selectedAnswer,
      timeTaken: answer.timeTaken
    }));
    
    return await examHook.submitExam(formattedAnswers);
  };

  const handleExamComplete = (result: ResultSummary) => {
    setExamResult(result);
    setCurrentState('results');
  };

  const handleBackToDashboard = () => {
    setExamResult(null);
    examHook.endExam();
    setCurrentState('dashboard');
    // Reload exams to get fresh data
    examHook.loadExams();
  };

  const handleLogout = () => {
    logout();
    setExamResult(null);
    examHook.endExam();
    setCurrentState('hero');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background3D />
      
      <Header 
        user={user} 
        onLogout={handleLogout}
        currentState={currentState}
        onNavigateHome={() => setCurrentState('hero')}
      />

      <AnimatePresence mode="wait">
        {currentState === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeroSection onGetStarted={() => setCurrentState('login')} />
          </motion.div>
        )}

        {currentState === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
            <LoginForm 
              onLogin={handleLogin}
              onBack={() => setCurrentState('hero')}
            />
          </motion.div>
        )}

        {currentState === 'dashboard' && user && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
          >
            <Dashboard 
              user={user}
              exams={examHook.exams}
              onStartExam={handleStartExam}
              isLoading={examHook.isLoading}
              error={examHook.error}
              onRetryLoad={() => examHook.loadExams()}
            />
          </motion.div>
        )}

        {currentState === 'exam' && examHook.currentExam && user && (
          <motion.div
            key="exam"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
          >
            <ExamInterface 
              exam={examHook.currentExam}
              onComplete={handleExamComplete}
              onBack={handleBackToDashboard}
              onSubmit={handleExamSubmit}
              getRemainingTime={examHook.getRemainingTime}
            />
          </motion.div>
        )}

        {currentState === 'results' && examResult && user && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8 }}
          >
            <ResultsView 
              result={examResult}
              onBackToDashboard={handleBackToDashboard}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// App wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;