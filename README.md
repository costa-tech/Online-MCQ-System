# Online MCQ System - Internship Assignment

## 🎯 Project Overview

A comprehensive Online MCQ Exam System built as part of the internship assignment. This system allows students to view available mock exam papers, attempt MCQs, submit answers, and view their results.

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Framer Motion** for smooth animations
- **Tailwind CSS** for responsive styling
- **Three.js** for 3D background effects
- **Lucide React** for modern icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** and **CORS** for security

### Database
- **MongoDB** (NoSQL) - Can be used locally or with MongoDB Atlas

## ✅ Assignment Requirements Met

### 1. Login System ✅
- **Implementation**: Real authentication with JWT tokens
- **Features**: Login, Registration, Session management
- **Demo Credentials**: Provided for testing

### 2. Exam Paper List ✅
- **Implementation**: Dashboard displaying available exams
- **Content**: 3 sample MCQ papers with different difficulties
- **Details**: Each exam shows title, description, duration, and difficulty

### 3. MCQ Exam Attempt ✅
- **Implementation**: Interactive exam interface
- **Features**: 
  - 5 MCQs per exam paper
  - One-by-one question navigation
  - Answer selection with visual feedback
  - Timer functionality
  - Progress tracking
  - Submit functionality

### 4. Result View ✅
- **Implementation**: Comprehensive results dashboard
- **Features**:
  - Total score display
  - Correct/incorrect answer breakdown
  - Performance metrics
  - Grade and pass/fail status
  - Time taken analytics
  - Detailed result storage

## 📦 Database Design

### 🎯 **Assignment Requirements vs Implementation**

The assignment suggested basic models, and our implementation **meets and exceeds** all requirements:

#### **✅ Required vs ✅ Implemented:**

| **Required Models** | **Our Implementation** | **Status** |
|-------------------|----------------------|-----------|
| Users: ID, name, email | Users: ID, name, email, password, role, timestamps | ✅ **Enhanced** |
| Exams: ID, title, description | Exams: ID, title, description, duration, marks, category, difficulty | ✅ **Enhanced** |
| Questions: ID, exam_id, question_text, options, correct_option | Questions: ID, exam_id, question, options[], correctAnswer, marks, explanation | ✅ **Enhanced** |
| Results: ID, user_id, exam_id, score, timestamp | Results: ID, user_id, exam_id, answers[], score, percentage, timeTaken | ✅ **Enhanced** |
| Answers: ID, result_id, question_id, selected_option, is_correct | Embedded in Results with questionId, selectedAnswer, isCorrect, marksObtained | ✅ **Optimized** |

### **📊 Database Choice: NoSQL (MongoDB)**

**Rationale**: MongoDB chosen for:
- **Flexibility**: Easy to modify schemas during development
- **Scalability**: Better performance for read-heavy exam applications  
- **JSON-like**: Natural fit for web APIs and JavaScript applications
- **Embedded Documents**: Answers stored within Results for better performance

### **🏗️ Detailed Schema Implementation:**

#### **Users Collection**
```javascript
{
  _id: ObjectId,                    // Required: ID ✅
  name: String,                     // Required: name ✅
  email: String (unique),           // Required: email ✅
  password: String (hashed),        // Enhanced: Security
  role: String (student/admin),     // Enhanced: User roles
  createdAt: Date,                  // Enhanced: Timestamps
  updatedAt: Date                   // Enhanced: Timestamps
}
```

#### **Exams Collection**
```javascript
{
  _id: ObjectId,                    // Required: ID ✅
  title: String,                    // Required: title ✅
  description: String,              // Required: description ✅
  duration: Number (minutes),       // Enhanced: Time limits
  totalMarks: Number,               // Enhanced: Scoring
  category: String,                 // Enhanced: Organization
  difficulty: String,               // Enhanced: User experience
  instructions: String,             // Enhanced: Clarity
  createdAt: Date                   // Enhanced: Timestamps
}
```

#### **Questions Collection**
```javascript
{
  _id: ObjectId,                    // Required: ID ✅
  examId: ObjectId (ref: Exam),     // Required: exam_id ✅
  question: String,                 // Required: question_text ✅
  options: Array[String],           // Required: options ✅
  correctAnswer: Number,            // Required: correct_option ✅
  marks: Number,                    // Enhanced: Individual scoring
  explanation: String,              // Enhanced: Learning aid
  orderIndex: Number                // Enhanced: Question order
}
```

#### **Results Collection**
```javascript
{
  _id: ObjectId,                    // Required: ID ✅
  userId: ObjectId (ref: User),     // Required: user_id ✅
  examId: ObjectId (ref: Exam),     // Required: exam_id ✅
  answers: [{                       // Enhanced: Embedded answers
    questionId: ObjectId,           // Maps to: Answers.question_id ✅
    selectedAnswer: Number,         // Maps to: Answers.selected_option ✅
    isCorrect: Boolean,             // Maps to: Answers.is_correct ✅
    marksObtained: Number,          // Enhanced: Individual question marks
    timeTaken: Number               // Enhanced: Performance tracking
  }],
  totalQuestions: Number,           // Enhanced: Metadata
  correctAnswers: Number,           // Enhanced: Quick stats
  score: Number,                    // Required: score ✅
  percentage: Number,               // Enhanced: Normalized scoring
  timeTaken: Number,                // Enhanced: Performance metrics
  submittedAt: Date                 // Required: timestamp ✅
}
```

### **🎯 Design Optimizations:**

1. **✅ All Required Fields**: Every suggested field is implemented
2. **🚀 Performance**: Embedded answers eliminate joins/lookups
3. **📊 Enhanced Analytics**: Additional fields for better reporting
4. **🔒 Security**: Password hashing and validation
5. **📱 User Experience**: Categories, difficulties, explanations
6. **⚡ Efficiency**: Optimized for exam-taking workflow

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   git clone <repository-url>
   cd Online-MCQ-System/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create `.env` file in Backend directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/online-mcq-system
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=7d
   ```

4. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   ```

5. **Seed Sample Data**
   ```bash
   npm run seed
   ```

6. **Start Backend Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: `http://localhost:5174`
   - Backend API: `http://localhost:5000`

## 🔑 Sample Credentials

Use these credentials to test the application:

```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

## 📋 Available Exam Papers

1. **JavaScript Fundamentals**
   - Duration: 30 minutes
   - Questions: 5 MCQs
   - Difficulty: Medium
   - Topics: ES6+, Data types, Async/Await

2. **React Development**
   - Duration: 45 minutes
   - Questions: 5 MCQs
   - Difficulty: Hard
   - Topics: Hooks, Components, State Management

3. **Web Development Fundamentals**
   - Duration: 60 minutes
   - Questions: 5 MCQs
   - Difficulty: Easy
   - Topics: HTML, CSS, JavaScript Basics

## 🔄 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Exams
- `GET /api/exams` - Get available exams
- `GET /api/exams/:id` - Get specific exam
- `POST /api/exams/:id/start` - Start an exam
- `GET /api/exams/:id/questions` - Get exam questions

### Results
- `POST /api/results` - Submit exam results
- `GET /api/results/user/:userId` - Get user's exam history
- `GET /api/results/:resultId` - Get specific result details

## 📱 Features Implemented

### Core Features
- ✅ User Authentication (Login/Register)
- ✅ Exam Dashboard with 3 sample papers
- ✅ Interactive MCQ Interface (5 questions each)
- ✅ Real-time Timer
- ✅ Answer Selection & Navigation
- ✅ Result Calculation & Display
- ✅ Score Tracking & History

### Additional Features
- ✅ Beautiful UI with animations
- ✅ Responsive design
- ✅ Progress tracking
- ✅ Grade calculation
- ✅ Performance analytics
- ✅ 3D background effects
- ✅ Modern glassmorphism design

## 🏗️ Project Structure

```
Online-MCQ-System/
├── Frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── Backend/
│   ├── models/            # MongoDB schemas
│   ├── controllers/       # Business logic
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── scripts/          # Database scripts
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   └── package.json
└── README.md
```

## 🧪 Testing

### Manual Testing
1. Register a new user or use sample credentials
2. Navigate to dashboard and view available exams
3. Start an exam and attempt all 5 questions
4. Submit the exam and view results
5. Check result history and analytics

### API Testing
- Postman collection included in `Backend/postman-collection.json`
- Swagger documentation available at `/api/docs` (when running)

## 🚀 Deployment Notes

### Local Development
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5174`
- MongoDB can be local or Atlas

### Production Deployment
- Backend can be deployed to services like Heroku, Railway, or Vercel
- Frontend can be deployed to Netlify, Vercel, or any static hosting
- Use MongoDB Atlas for production database

## 💡 Key Implementation Highlights

1. **Type Safety**: Full TypeScript implementation on frontend
2. **Security**: JWT authentication, password hashing, input validation
3. **User Experience**: Smooth animations, intuitive navigation, real-time feedback
4. **Code Quality**: Clean architecture, modular design, error handling
5. **Performance**: Optimized bundle size, lazy loading, efficient rendering

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- Full-stack web development
- Modern React with hooks and context
- RESTful API design
- MongoDB database modeling
- Authentication and authorization
- UI/UX design principles
- Git version control
- Project documentation

## 📞 Contact

For any questions or clarifications about this assignment, please reach out.

---

**Assignment Completion Time**: ~20 hours over 3 days
**Assignment Status**: ✅ All requirements met and exceeded
