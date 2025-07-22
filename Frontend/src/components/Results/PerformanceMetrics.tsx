import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, Clock } from 'lucide-react';
import { GlassCard } from '../UI/GlassCard';

interface ExamResult {
  examId: string;
  examTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  percentage: number;
  timeTaken: number;
  answers: { questionId: string; answer: number; correct: boolean; }[];
}

interface PerformanceMetricsProps {
  result: ExamResult;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ result }) => {
  const avgTimePerQuestion = result.timeTaken / result.totalQuestions;
  const accuracyRate = (result.correctAnswers / result.totalQuestions) * 100;
  
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toFixed(0).padStart(2, '0')}`;
  };

  const metrics = [
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Accuracy Rate',
      value: `${accuracyRate.toFixed(1)}%`,
      color: accuracyRate >= 80 ? 'from-green-500 to-emerald-500' : accuracyRate >= 60 ? 'from-yellow-500 to-orange-500' : 'from-red-500 to-pink-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Speed Rating',
      value: avgTimePerQuestion < 60 ? 'Fast' : avgTimePerQuestion < 120 ? 'Moderate' : 'Careful',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Avg Time/Question',
      value: formatTime(avgTimePerQuestion),
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Performance Grade',
      value: result.percentage >= 90 ? 'A+' : result.percentage >= 80 ? 'A' : result.percentage >= 70 ? 'B' : result.percentage >= 60 ? 'C' : 'D',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 * index, duration: 0.5 }}
            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                {metric.icon}
              </div>
              <span className="text-white font-medium">{metric.label}</span>
            </div>
            <div className="text-white font-bold">{metric.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
        <h4 className="text-white font-semibold mb-2">Overall Assessment</h4>
        <p className="text-gray-300 text-sm">
          {result.percentage >= 80 
            ? "Excellent performance! You demonstrate strong understanding of the subject matter." 
            : result.percentage >= 60 
            ? "Good job! Focus on areas where you missed questions to improve further."
            : "Keep practicing! Review the topics covered and try again to improve your score."
          }
        </p>
      </div>
    </GlassCard>
  );
};