import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Award, TrendingUp } from 'lucide-react';
import { GlassCard } from '../UI/GlassCard';
import { ExamCard } from './ExamCard';
import { useUserStats } from './useUserStats';
import { User } from '../../services/authService';
import { Exam } from '../../services/examService';

interface DashboardProps {
  user?: User;
  exams?: Exam[];
  onStartExam?: (exam: Exam) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetryLoad?: () => void;
  onStatsUpdate?: () => void;
}

// Helper function to format time in minutes to readable format
const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const Dashboard: React.FC<DashboardProps> = ({
  exams: propsExams,
  onStartExam,
  isLoading: propsIsLoading,
  error: propsError,
  onRetryLoad,
  onStatsUpdate
}) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useUserStats();

  useEffect(() => {
    if (propsExams) {
      // Use exams from props if available
      setExams(propsExams.filter((exam: Exam) => exam.isActive));
      setLoading(false);
      setError(null);
    } else {
      // Fallback to fetching exams ourselves
      fetchExams();
    }
  }, [propsExams]);

  // Trigger stats update when onStatsUpdate changes
  useEffect(() => {
    if (onStatsUpdate) {
      refetchStats();
    }
  }, [onStatsUpdate, refetchStats]);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('http://localhost:5000/api/exams', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }

      const data = await response.json();
      setExams(data.data.filter((exam: Exam) => exam.isActive));
    } catch (err) {
      console.error('Error fetching exams:', err);
      
      // If server is unavailable, show demo exams
      if (err instanceof Error && (err.name === 'AbortError' || err.message.includes('fetch'))) {
        console.log('Server unavailable, showing demo exams');
        setExams([
          {
            _id: 'demo-1',
            title: 'Mathematics Fundamentals',
            description: 'Basic mathematical concepts and problem solving',
            duration: 30,
            totalMarks: 50,
            category: 'Mathematics',
            difficulty: 'Easy' as const,
            instructions: 'Answer all questions within the time limit',
            questionCount: 10,
            formattedDuration: '30 minutes',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            _id: 'demo-2',
            title: 'Science Quiz',
            description: 'General science knowledge test',
            duration: 45,
            totalMarks: 75,
            category: 'Science',
            difficulty: 'Medium' as const,
            instructions: 'Choose the best answer for each question',
            questionCount: 15,
            formattedDuration: '45 minutes',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]);
        setError('Server unavailable - showing demo exams');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const displayLoading = propsIsLoading !== undefined ? propsIsLoading : loading;
  const displayError = propsError !== undefined ? propsError : error;

  // Only show loading if exams are loading AND stats are loading
  // If stats fail but exams load, we can still show the dashboard
  if (displayLoading && statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  // Only show error if both exams and stats fail to load
  if (displayError && !statsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">Error loading exams</p>
          <p>{displayError}</p>
          {onRetryLoad && (
            <button
              onClick={onRetryLoad}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  const statsData = [
    {
      title: 'Available Exams',
      value: stats.availableExams,
      subtext: 'Ready to take',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Duration',
      value: formatTime(stats.totalTimeSpent),
      subtext: 'Time spent',
      icon: Clock,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Marks',
      value: stats.totalMarks,
      subtext: 'Points earned',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Success Rate',
      value: `${stats.passRate}%`,
      subtext: `${stats.totalExams} attempts`,
      icon: Award,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Track your progress and take new exams</p>
        </motion.div>

        {/* Stats Error Notification */}
        {statsError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                ⚠️ Unable to load user statistics: {statsError}
              </p>
              <p className="text-yellow-300/70 text-xs mt-1">
                Showing default values. Statistics will update once the server is available.
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <GlassCard className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${stat.color} p-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-300 font-medium">{stat.title}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.subtext}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Available Exams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Available Exams</h2>
          
          {/* Show notification if displaying demo exams */}
          {error && error.includes('demo') && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  ℹ️ Server unavailable - showing demo exams for testing
                </p>
                <p className="text-blue-300/70 text-xs mt-1">
                  Demo exams are not functional but you can explore the interface.
                </p>
              </div>
            </motion.div>
          )}
          
          {exams.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <p className="text-gray-300 text-lg">No exams available at the moment.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam, index) => (
                <motion.div
                  key={exam._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <ExamCard exam={exam} onStart={() => onStartExam?.(exam)} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
