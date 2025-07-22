# Online MCQ System Backend

## Overview
This is the backend API for the Online MCQ System built with Node.js, Express, and MongoDB.

## Features
- User authentication (login/registration)
- Exam management
- Question and answer handling
- Result tracking and analytics
- RESTful API design
- Input validation and security

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the Backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/online-mcq-system
   # For MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/online-mcq-system
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

4. **Database Setup**
   
   **Option A: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   
   **Option B: MongoDB Atlas (Recommended)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Get connection string and update MONGODB_URI in .env

5. **Seed Sample Data**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users
- `GET /api/users/profile` - Get user profile (protected)

### Exams
- `GET /api/exams` - Get all available exams
- `GET /api/exams/:id` - Get specific exam details
- `POST /api/exams/:id/start` - Start an exam attempt

### Results
- `POST /api/results` - Submit exam results
- `GET /api/results/user/:userId` - Get user's exam history
- `GET /api/results/:resultId` - Get specific result details

## Sample Credentials

For testing purposes, the following users are seeded:

```json
{
  "email": "student@example.com",
  "password": "password123"
}
{
  "email": "john.doe@example.com", 
  "password": "password123"
}
```

## Project Structure

```
Backend/
├── models/           # MongoDB schemas
├── routes/           # API route handlers
├── middleware/       # Custom middleware
├── controllers/      # Business logic
├── scripts/          # Database scripts
├── utils/           # Utility functions
├── server.js        # Entry point
└── package.json     # Dependencies
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Exams Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  duration: Number (minutes),
  totalMarks: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Questions Collection
```javascript
{
  _id: ObjectId,
  examId: ObjectId,
  question: String,
  options: [String],
  correctAnswer: Number,
  marks: Number,
  createdAt: Date
}
```

### Results Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  examId: ObjectId,
  score: Number,
  totalMarks: Number,
  percentage: Number,
  timeTaken: Number (seconds),
  answers: [{
    questionId: ObjectId,
    selectedAnswer: Number,
    isCorrect: Boolean
  }],
  submittedAt: Date
}
```

## Security Features
- Password hashing with bcrypt
- JWT authentication
- Request rate limiting
- CORS protection
- Input validation and sanitization
- Helmet security headers

## Error Handling
- Centralized error handling middleware
- Consistent error response format
- Input validation with detailed messages
- Database error handling

## Testing
You can test the API using:
- Postman (collection can be imported)
- curl commands
- Frontend integration

## Deployment
For production deployment:
1. Set NODE_ENV=production
2. Update MONGODB_URI to production database
3. Use strong JWT_SECRET
4. Configure CORS for production frontend URL
5. Set up proper logging and monitoring

## Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
MIT License
