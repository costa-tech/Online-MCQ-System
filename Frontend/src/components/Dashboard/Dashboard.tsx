import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Award, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from '../UI/GlassCard';
import { ExamCard } from './ExamCard';
import { Button } from '../UI/Button';
import { User } from '../../services/authService';
import { Exam } from '../../services/examService';

interface DashboardProps {
  user: User;
  exams: Exam[];
  onStartExam: (exam: Exam) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetryLoad?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  exams, 
  onStartExam, 
  isLoading = false, 
  error = null, 
  onRetryLoad 
}) => {
  const stats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: 'Available Exams',
      value: exams.length,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Total Duration',
      value: `${exams.reduce((acc, exam) => acc + exam.duration, 0)} min`,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Total Marks',
      value: exams.reduce((acc, exam) => acc + exam.totalMarks, 0),
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Success Rate',
      value: user.stats ? `${user.stats.passRate}%` : 'N/A',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen px-4 pt-24 pb-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{user.name}</span>
          </h1>
          <p className="text-gray-400 text-lg">Ready to test your knowledge? Choose an exam to get started.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <GlassCard className="p-6 hover:bg-white/15 transition-all duration-300">
                <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard className="p-6 bg-red-500/20 border border-red-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-red-400">
                  <AlertCircle className="w-5 h-5 mr-3" />
                  <div>
                    <h3 className="font-semibold">Error loading exams</h3>
                    <p className="text-sm opacity-80">{error}</p>
                  </div>
                </div>
                {onRetryLoad && (
                  <Button
                    onClick={onRetryLoad}
                    variant="secondary"
                    size="sm"
                    className="flex items-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <GlassCard className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading exams...</p>
            </GlassCard>
          </motion.div>
        )}

        {/* Exams Grid */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Available Exams</h2>
            {exams.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No exams available</h3>
                <p className="text-gray-400">Check back later for new exams.</p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam, index) => (
                  <motion.div
                    key={exam._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <ExamCard 
                      exam={exam}
                      onStart={() => onStartExam(exam)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};