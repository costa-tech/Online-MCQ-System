import React from 'react';
import { motion } from 'framer-motion';
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

interface ResultChartProps {
  result: ExamResult;
}

export const ResultChart: React.FC<ResultChartProps> = ({ result }) => {
  const correctPercentage = (result.correctAnswers / result.totalQuestions) * 100;
  const incorrectPercentage = 100 - correctPercentage;

  const circumference = 2 * Math.PI * 45;
  const correctOffset = circumference - (correctPercentage / 100) * circumference;
  const incorrectOffset = circumference - (incorrectPercentage / 100) * circumference;

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-6">Performance Breakdown</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="45"
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="10"
            />
            
            {/* Correct answers arc */}
            <motion.circle
              cx="100"
              cy="100"
              r="45"
              fill="transparent"
              stroke="url(#correctGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: correctOffset }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="correctGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="text-3xl font-bold text-white">{correctPercentage.toFixed(0)}%</div>
            <div className="text-sm text-gray-400">Correct</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <span className="text-white">Correct Answers</span>
          </div>
          <div className="text-white font-medium">
            {result.correctAnswers} ({correctPercentage.toFixed(1)}%)
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500"></div>
            <span className="text-white">Incorrect Answers</span>
          </div>
          <div className="text-white font-medium">
            {result.totalQuestions - result.correctAnswers} ({incorrectPercentage.toFixed(1)}%)
          </div>
        </div>
      </div>
    </GlassCard>
  );
};