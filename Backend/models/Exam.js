import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exam title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Exam description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Exam duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
    max: [300, 'Duration cannot exceed 300 minutes']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [1, 'Total marks must be at least 1']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['JavaScript', 'React', 'Web Development', 'Node.js', 'Database', 'General', 'Other'],
    default: 'General'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  instructions: {
    type: String,
    default: 'Read all questions carefully before answering. You cannot change your answers once submitted.'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
examSchema.index({ isActive: 1, category: 1 });
examSchema.index({ title: 'text', description: 'text' });

// Virtual for question count
examSchema.virtual('questionCount', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'examId',
  count: true
});

// Virtual for questions
examSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'examId'
});

// Static method to get active exams
examSchema.statics.getActiveExams = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

// Instance method to get exam with questions
examSchema.methods.getWithQuestions = function() {
  return this.populate('questions');
};

const Exam = mongoose.model('Exam', examSchema);

export default Exam;
