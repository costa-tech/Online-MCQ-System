import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, Award, Play } from 'lucide-react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';

interface Exam {
  _id: string;
  title: string;
  description: string;
  duration: number;
  totalMarks: number;
  questionsCount?: number;
  subject?: string;
  difficultyLevel?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ExamCardProps {
  exam: Exam;
  onStart: () => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ exam, onStart }) => {
  const getDifficultyColor = (exam: Exam) => {
    const difficulty = exam.difficultyLevel || getDifficultyLabel(exam.totalMarks);
    switch (difficulty) {
      case 'Easy': return 'from-green-500 to-emerald-500';
      case 'Medium': return 'from-yellow-500 to-orange-500';
      case 'Hard': return 'from-red-500 to-pink-500';
      default: return 'from-blue-500 to-purple-500';
    }
  };

  const getDifficultyLabel = (marks: number) => {
    if (marks <= 100) return 'Easy';
    if (marks <= 150) return 'Medium';
    return 'Hard';
  };

  const displayDifficulty = exam.difficultyLevel || getDifficultyLabel(exam.totalMarks);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-6 hover:bg-white/15 transition-all duration-300 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getDifficultyColor(exam)} text-white`}>
            {displayDifficulty}
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3">{exam.title}</h3>
        <p className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed">{exam.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <Clock className="w-4 h-4" />
              <span>Duration</span>
            </div>
            <span className="text-white font-medium">{exam.duration} min</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <FileText className="w-4 h-4" />
              <span>Questions</span>
            </div>
            <span className="text-white font-medium">{exam.questionsCount || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-300">
              <Award className="w-4 h-4" />
              <span>Total Marks</span>
            </div>
            <span className="text-white font-medium">{exam.totalMarks}</span>
          </div>
        </div>

        <Button 
          onClick={onStart}
          className="w-full group"
          variant="primary"
        >
          <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Start Exam
        </Button>
      </GlassCard>
    </motion.div>
  );
};