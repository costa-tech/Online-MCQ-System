import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    minlength: [10, 'Question must be at least 10 characters long'],
    maxlength: [1000, 'Question cannot exceed 1000 characters']
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.length <= 6;
      },
      message: 'Question must have between 2 and 6 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: [0, 'Correct answer index must be at least 0'],
    validate: {
      validator: function(value) {
        return value < this.options.length;
      },
      message: 'Correct answer index must be less than number of options'
    }
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: [1, 'Marks must be at least 1'],
    max: [100, 'Marks cannot exceed 100']
  },
  explanation: {
    type: String,
    trim: true,
    maxlength: [500, 'Explanation cannot exceed 500 characters']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  orderIndex: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret, options) {
      // Don't include correct answer in response unless explicitly requested
      if (!options.includeCorrectAnswer) {
        delete ret.correctAnswer;
        delete ret.explanation;
      }
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
questionSchema.index({ examId: 1, orderIndex: 1 });
questionSchema.index({ examId: 1, isActive: 1 });

// Static method to get questions for an exam
questionSchema.statics.getByExamId = function(examId, includeAnswers = false) {
  const query = this.find({ examId, isActive: true }).sort({ orderIndex: 1 });
  
  if (!includeAnswers) {
    return query.select('-correctAnswer -explanation');
  }
  
  return query;
};

// Static method to validate answer
questionSchema.statics.validateAnswer = async function(questionId, selectedAnswer) {
  const question = await this.findById(questionId);
  if (!question) {
    throw new Error('Question not found');
  }
  
  return {
    isCorrect: question.correctAnswer === selectedAnswer,
    correctAnswer: question.correctAnswer,
    marks: question.marks,
    explanation: question.explanation
  };
};

// Instance method to check if answer is correct
questionSchema.methods.checkAnswer = function(selectedAnswer) {
  return this.correctAnswer === selectedAnswer;
};

const Question = mongoose.model('Question', questionSchema);

export default Question;
