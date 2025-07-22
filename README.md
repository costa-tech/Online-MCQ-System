# Online MCQ System - Internship Assignment

## 🚀 Quick Start Guide

**Want to test immediately?** 

1. **Start Backend**: `cd Backend && npm install && npm run seed && npm start`
2. **Start Frontend**: `cd Frontend && npm install && npm run dev` 
3. **Login**: Use `student@example.com` / `password123`
4. **Take Exam**: Choose any of the 3 available exam papers!

**⚠️ Prerequisites**: Node.js installed + MongoDB Atlas account ([free setup guide below](#-setup-instructions))

---

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
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** (free) - [Sign up here](https://cloud.mongodb.com/)
- **Git** - [Download here](https://git-scm.com/)

### 📁 Project Structure Overview
```
Online-MCQ-System/
├── Backend/           # Node.js + Express API
├── Frontend/          # React + TypeScript app
└── README.md         # This file
```

### 🔧 Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd Online-MCQ-System/Backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **MongoDB Atlas Setup (Required)**
   
   **Step 1: Create MongoDB Atlas Account**
   - Go to https://cloud.mongodb.com
   - Sign up for free account
   - Verify email

   **Step 2: Create Database Cluster**
   - Click "Build Database"
   - Choose "Free (M0 Sandbox)"
   - Select region closest to you
   - Create cluster (takes 1-3 minutes)

   **Step 3: Create Database User**
   - Go to "Database Access" → "Add New Database User"
   - Username: `mcquser`
   - Password: Generate secure password
   - User Privileges: "Read and write to any database"

   **Step 4: Whitelist IP Address**
   - Go to "Network Access" → "Add IP Address"
   - Add "Current IP Address" or "0.0.0.0/0" (for development)

   **Step 5: Get Connection String**
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string

4. **Environment Configuration**
   
   Create `.env` file in Backend directory with your MongoDB Atlas connection:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Atlas Connection (Replace with your details)
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/online-mcq-system?retryWrites=true&w=majority

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```
   
   **⚠️ Important**: Replace `username`, `password`, and `cluster` with your actual MongoDB Atlas credentials.

5. **Seed Sample Data**
   ```bash
   npm run seed
   ```
   
   **Expected Output:**
   ```
   ✅ Connected to MongoDB
   🧹 Cleared existing data
   👥 Created sample users
   📝 Created sample exams
   ❓ Created sample questions
   📊 Created sample results
   🎉 Database seeded successfully!
   ```

6. **Start Backend Server**
   ```bash
   npm start
   ```
   
   **Expected Output:**
   ```
   ✅ MongoDB Connected: cluster.mongodb.net
   🚀 Server running on port 5000
   📊 Environment: development
   🌐 CORS enabled for: http://localhost:5173
   ```

   **If you see connection errors**: Check MongoDB Atlas IP whitelist and connection string.

### 🎨 Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd ../Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   **Expected Output:**
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

4. **Access Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:5000
   - **Health Check**: http://localhost:5000/health

### 🚨 Troubleshooting

#### Backend Issues:
- **MongoDB Connection Error**: Check IP whitelist in MongoDB Atlas
- **Environment Variables Not Loading**: Verify `.env` file is in Backend directory
- **Port Already in Use**: Change PORT in `.env` or kill existing process

#### Frontend Issues:
- **API Connection Failed**: Ensure backend is running on port 5000
- **Build Errors**: Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 🔑 Sample Credentials for Testing

**🚀 Ready-to-Use Test Accounts:**

### **Student Account 1**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

### **Student Account 2**
```json
{
  "email": "john.doe@example.com", 
  "password": "password123"
}
```

### **Student Account 3**
```json
{
  "email": "jane.smith@example.com",
  "password": "password123"
}
```

**💡 Quick Start**: Use any of these credentials to login immediately after setup - no registration required!

**🔒 Note**: These are seeded test accounts created during `npm run seed`. All passwords are pre-hashed for security.

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

### 📍 Local Development (Current Setup)
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Database**: MongoDB Atlas (cloud)

### 🌐 Production Deployment Options

#### **Backend Deployment**
- **Recommended**: Railway, Render, or Vercel
- **Environment Variables**: Set same `.env` variables in hosting platform
- **MongoDB**: Already using Atlas (production-ready)

#### **Frontend Deployment** 
- **Recommended**: Netlify, Vercel, or GitHub Pages
- **Build Command**: `npm run build`
- **API URL**: Update to your deployed backend URL

#### **Example Production URLs**
```
Frontend: https://your-mcq-app.netlify.app
Backend:  https://your-mcq-api.railway.app
```

### 🔧 Environment Variables for Production
```env
# Backend (.env)
NODE_ENV=production
MONGODB_URI=your-atlas-connection-string
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-frontend-domain.com

# Frontend (build configuration)
VITE_API_URL=https://your-backend-domain.com
```

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
