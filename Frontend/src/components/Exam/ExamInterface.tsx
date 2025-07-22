import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle } from 'lucide-react';
import { GlassCard } from '../UI/GlassCard';
import { Button } from '../UI/Button';
import { ProgressRing } from './ProgressRing';
import { StartExamResponse } from '../../services/examService';
import { ResultSummary } from '../../services/resultService';

interface ExamInterfaceProps {
  exam: StartExamResponse;
  onComplete: (result: ResultSummary) => void;
  onBack: () => void;
  onSubmit: (examId: string, answers: Array<{ questionId: string; selectedAnswer: number; timeTaken?: number }>, timeTaken: number) => Promise<ResultSummary | null>;
  getRemainingTime: () => number;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({ exam, onComplete, onBack, onSubmit, getRemainingTime }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(getRemainingTime());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getRemainingTime();
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [getRemainingTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [exam.questions[currentQuestion]._id]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleFlag = () => {
    const questionId = exam.questions[currentQuestion]._id;
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAutoSubmit = () => {
    submitExam();
  };

  const handleManualSubmit = () => {
    setShowSubmitDialog(true);
  };

  const submitExam = async () => {
    const totalTime = exam.exam.duration * 60;
    const timeTaken = totalTime - timeRemaining;
    
    const formattedAnswers = exam.questions.map(question => ({
      questionId: question._id,
      selectedAnswer: answers[question._id] ?? -1,
      timeTaken: timeTaken / exam.questions.length
    }));

    const result = await onSubmit(exam.exam.id, formattedAnswers, timeTaken);
    if (result) {
      onComplete(result);
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getProgressPercentage = () => {
    return (getAnsweredCount() / exam.questions.length) * 100;
  };

  const currentQ = exam.questions[currentQuestion];
  const isCurrentQuestionFlagged = flaggedQuestions.has(currentQ._id);

  return (
    <div className="min-h-screen px-4 pt-24 pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={onBack} size="sm">
                  ← Back
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white">{exam.exam.title}</h1>
                  <p className="text-gray-400 text-sm">
                    Question {currentQuestion + 1} of {exam.questions.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-sm text-gray-400">Progress</div>
                  <ProgressRing 
                    percentage={getProgressPercentage()} 
                    size={40}
                  />
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-400">Time Left</div>
                  <div className={`text-lg font-mono font-bold ${timeRemaining < 300 ? 'text-red-400' : 'text-white'}`}>
                    <Clock className="inline w-4 h-4 mr-1" />
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className="p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                    {currentQ.marks} marks
                  </span>
                  <button
                    onClick={handleFlag}
                    className={`p-2 rounded-full transition-colors ${
                      isCurrentQuestionFlagged 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold text-white leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    answers[currentQ._id] === index
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400'
                      : 'bg-white/5 hover:bg-white/10 border-2 border-transparent hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      answers[currentQ._id] === index
                        ? 'border-purple-400 bg-purple-500'
                        : 'border-gray-400'
                    }`}>
                      {answers[currentQ._id] === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-white flex-1">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">
                  {getAnsweredCount()} of {exam.questions.length} answered
                </span>
                {flaggedQuestions.size > 0 && (
                  <span className="text-yellow-400 text-sm">
                    • {flaggedQuestions.size} flagged
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                {currentQuestion === exam.questions.length - 1 ? (
                  <Button
                    variant="primary"
                    onClick={handleManualSubmit}
                    className="flex items-center space-x-2"
                  >
                    <span>Submit Exam</span>
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={handleNext}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Submit Dialog */}
      <AnimatePresence>
        {showSubmitDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSubmitDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard className="p-6 max-w-md">
                <h3 className="text-xl font-bold text-white mb-4">Submit Exam?</h3>
                <p className="text-gray-400 mb-6">
                  You have answered {getAnsweredCount()} out of {exam.questions.length} questions.
                  Are you sure you want to submit your exam?
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmitDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={submitExam}
                    className="flex-1"
                  >
                    Submit
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};