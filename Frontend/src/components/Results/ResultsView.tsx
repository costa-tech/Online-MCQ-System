import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle, XCircle, Star, Award } from 'lucide-react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { ResultSummary } from '../../services/resultService';

interface ResultsViewProps {
  result: ResultSummary;
  onBackToDashboard: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onBackToDashboard }) => {
  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 90) return 'from-green-500 to-emerald-500';
    if (percentage >= 75) return 'from-yellow-500 to-orange-500';
    if (percentage >= 60) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getPerformanceLabel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Needs Improvement';
  };

  const getGradeIcon = (percentage: number) => {
    if (percentage >= 90) return <Trophy className="w-12 h-12 text-white" />;
    if (percentage >= 75) return <Star className="w-12 h-12 text-white" />;
    if (percentage >= 60) return <Award className="w-12 h-12 text-white" />;
    return <Clock className="w-12 h-12 text-white" />;
  };

  return (
    <div className="min-h-screen px-4 pt-24 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${getPerformanceColor(result.score.percentage)} flex items-center justify-center`}
          >
            {getGradeIcon(result.score.percentage)}
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Exam Completed!</h1>
          <p className="text-xl text-gray-400 mb-4">{result.exam.title}</p>
          
          <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${getPerformanceColor(result.score.percentage)} text-white font-bold text-lg`}>
            {getPerformanceLabel(result.score.percentage)} - {result.score.percentage.toFixed(1)}%
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{result.answers.correct}</div>
            <div className="text-gray-400 text-sm">Correct Answers</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{result.answers.incorrect}</div>
            <div className="text-gray-400 text-sm">Incorrect Answers</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{result.score.obtained}/{result.score.total}</div>
            <div className="text-gray-400 text-sm">Total Score</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{result.time.formatted}</div>
            <div className="text-gray-400 text-sm">Time Taken</div>
          </GlassCard>
        </motion.div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Performance Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Grade:</span>
                  <span className="text-white font-semibold">{result.grade}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status:</span>
                  <span className={`font-semibold ${result.isPassed ? 'text-green-400' : 'text-red-400'}`}>
                    {result.isPassed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Category:</span>
                  <span className="text-white font-semibold">{result.exam.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Difficulty:</span>
                  <span className="text-white font-semibold">{result.exam.difficulty}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Questions:</span>
                  <span className="text-white font-semibold">{result.answers.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Accuracy:</span>
                  <span className="text-white font-semibold">{result.score.percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Submitted:</span>
                  <span className="text-white font-semibold">{new Date(result.submittedAt).toLocaleString()}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Button 
            onClick={onBackToDashboard}
            className="px-8 py-3"
            variant="primary"
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
