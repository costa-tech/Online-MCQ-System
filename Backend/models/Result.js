import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Question ID is required']
  },
  selectedAnswer: {
    type: Number,
    required: [true, 'Selected answer is required'],
    min: [0, 'Selected answer must be at least 0']
  },
  isCorrect: {
    type: Boolean,
    required: [true, 'Answer correctness is required']
  },
  marksObtained: {
    type: Number,
    required: [true, 'Marks obtained is required'],
    min: [0, 'Marks obtained cannot be negative']
  },
  timeTaken: {
    type: Number,
    default: 0,
    min: [0, 'Time taken cannot be negative']
  }
}, { _id: false });

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  answers: [answerSchema],
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions count is required'],
    min: [1, 'Total questions must be at least 1']
  },
  correctAnswers: {
    type: Number,
    required: [true, 'Correct answers count is required'],
    min: [0, 'Correct answers cannot be negative']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [1, 'Total marks must be at least 1']
  },
  percentage: {
    type: Number,
    required: [true, 'Percentage is required'],
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  timeTaken: {
    type: Number,
    required: [true, 'Time taken is required'],
    min: [0, 'Time taken cannot be negative']
  },
  startedAt: {
    type: Date,
    required: [true, 'Start time is required']
  },
  submittedAt: {
    type: Date,
    required: [true, 'Submission time is required']
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    default: function() {
      if (this.percentage >= 90) return 'A+';
      if (this.percentage >= 80) return 'A';
      if (this.percentage >= 70) return 'B+';
      if (this.percentage >= 60) return 'B';
      if (this.percentage >= 50) return 'C+';
      if (this.percentage >= 40) return 'C';
      if (this.percentage >= 30) return 'D';
      return 'F';
    }
  },
  isPassed: {
    type: Boolean,
    default: function() {
      return this.percentage >= 40; // 40% passing criteria
    }
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [1000, 'Feedback cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
resultSchema.index({ userId: 1, submittedAt: -1 });
resultSchema.index({ examId: 1, submittedAt: -1 });
resultSchema.index({ userId: 1, examId: 1 });

// Virtual for user details
resultSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for exam details
resultSchema.virtual('exam', {
  ref: 'Exam',
  localField: 'examId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to calculate derived fields
resultSchema.pre('save', function(next) {
  // Calculate percentage
  this.percentage = Math.round((this.score / this.totalMarks) * 100);
  
  // Set grade based on percentage
  if (this.percentage >= 90) this.grade = 'A+';
  else if (this.percentage >= 80) this.grade = 'A';
  else if (this.percentage >= 70) this.grade = 'B+';
  else if (this.percentage >= 60) this.grade = 'B';
  else if (this.percentage >= 50) this.grade = 'C+';
  else if (this.percentage >= 40) this.grade = 'C';
  else if (this.percentage >= 30) this.grade = 'D';
  else this.grade = 'F';
  
  // Set pass/fail status
  this.isPassed = this.percentage >= 40;
  
  next();
});

// Static method to get user results
resultSchema.statics.getUserResults = function(userId, limit = 10) {
  return this.find({ userId })
    .populate('exam', 'title category difficulty')
    .sort({ submittedAt: -1 })
    .limit(limit);
};

// Static method to get exam statistics
resultSchema.statics.getExamStats = async function(examId) {
  const stats = await this.aggregate([
    { $match: { examId: new mongoose.Types.ObjectId(examId) } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averagePercentage: { $avg: '$percentage' },
        highestScore: { $max: '$score' },
        lowestScore: { $min: '$score' },
        passCount: {
          $sum: { $cond: [{ $gte: ['$percentage', 40] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalAttempts: 0,
    averageScore: 0,
    averagePercentage: 0,
    highestScore: 0,
    lowestScore: 0,
    passCount: 0
  };
};

// Instance method to generate feedback
resultSchema.methods.generateFeedback = function() {
  const percentage = this.percentage;
  
  if (percentage >= 90) {
    return 'Excellent performance! You have mastered this topic.';
  } else if (percentage >= 80) {
    return 'Great job! You have a strong understanding of the material.';
  } else if (percentage >= 70) {
    return 'Good work! You have a solid grasp of most concepts.';
  } else if (percentage >= 60) {
    return 'Fair performance. Consider reviewing the topics you missed.';
  } else if (percentage >= 40) {
    return 'You passed, but there\'s room for improvement. Review the material and try again.';
  } else {
    return 'You didn\'t pass this time. Please review the material thoroughly and attempt again.';
  }
};

const Result = mongoose.model('Result', resultSchema);

export default Result;
