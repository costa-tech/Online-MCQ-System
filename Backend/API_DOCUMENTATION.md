# Online MCQ System - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors if any */ ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ /* array of items */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "jwt_token_here"
  }
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "currentpass",
  "newPassword": "NewPassword123"
}
```

### Exams

#### Get All Exams
```http
GET /api/exams?page=1&limit=10&category=JavaScript&difficulty=Medium&search=react
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `category` (optional): Filter by category
- `difficulty` (optional): Filter by difficulty (Easy, Medium, Hard)
- `search` (optional): Search in title and description

**Response:**
```json
{
  "success": true,
  "message": "Exams retrieved successfully",
  "data": [
    {
      "_id": "exam_id",
      "title": "JavaScript Fundamentals",
      "description": "Test your JavaScript knowledge",
      "duration": 30,
      "totalMarks": 50,
      "category": "JavaScript",
      "difficulty": "Medium",
      "questionCount": 5,
      "formattedDuration": "30 minutes",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": { /* pagination info */ }
}
```

#### Get Exam by ID
```http
GET /api/exams/:examId
```

#### Start Exam
```http
POST /api/exams/:examId/start
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Exam started successfully",
  "data": {
    "exam": {
      "id": "exam_id",
      "title": "JavaScript Fundamentals",
      "description": "Test description",
      "duration": 30,
      "totalMarks": 50,
      "instructions": "Read carefully..."
    },
    "questions": [
      {
        "_id": "question_id",
        "question": "What is JavaScript?",
        "options": ["Language", "Framework", "Library", "Tool"],
        "marks": 10
      }
    ],
    "startTime": "2024-01-15T10:30:00.000Z",
    "expiryTime": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Get Exam Categories
```http
GET /api/exams/categories
```

### Results

#### Submit Result
```http
POST /api/results
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "examId": "exam_id",
  "answers": [
    {
      "questionId": "question_id_1",
      "selectedAnswer": 0,
      "timeTaken": 30
    },
    {
      "questionId": "question_id_2",
      "selectedAnswer": 2,
      "timeTaken": 45
    }
  ],
  "timeTaken": 1200,
  "startedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Exam submitted successfully",
  "data": {
    "resultId": "result_id",
    "exam": {
      "id": "exam_id",
      "title": "JavaScript Fundamentals",
      "category": "JavaScript",
      "difficulty": "Medium"
    },
    "score": {
      "obtained": 40,
      "total": 50,
      "percentage": 80
    },
    "answers": {
      "total": 5,
      "correct": 4,
      "incorrect": 1
    },
    "time": {
      "taken": 1200,
      "formatted": "20m 0s",
      "allowed": 1800
    },
    "grade": "A",
    "isPassed": true,
    "feedback": "Great job! You have a strong understanding of the material.",
    "submittedAt": "2024-01-15T10:50:00.000Z"
  }
}
```

#### Get Result by ID
```http
GET /api/results/:resultId
Authorization: Bearer <token>
```

#### Get User Results
```http
GET /api/results/user/:userId?page=1&limit=10
Authorization: Bearer <token>
```

#### Get User Statistics
```http
GET /api/results/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "overall": {
      "totalExams": 10,
      "averagePercentage": 75.5,
      "passedExams": 8,
      "passRate": 80,
      "totalScore": 755,
      "totalPossibleScore": 1000,
      "totalTimeTaken": 12000,
      "totalTimeFormatted": "3h 20m 0s"
    },
    "categoryPerformance": [
      {
        "_id": "JavaScript",
        "examCount": 3,
        "averageScore": 85.7,
        "bestScore": 95
      }
    ],
    "recentActivity": [
      {
        "exam": {
          "title": "React Fundamentals",
          "category": "React"
        },
        "percentage": 90,
        "grade": "A+",
        "submittedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### Users

#### Get User Dashboard
```http
GET /api/users/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "overview": {
      "totalExams": 5,
      "passedExams": 4,
      "failedExams": 1,
      "passRate": 80,
      "averageScore": 75,
      "overallPercentage": 75
    },
    "recentResults": [
      {
        "resultId": "result_id",
        "exam": {
          "title": "JavaScript Fundamentals",
          "category": "JavaScript"
        },
        "percentage": 80,
        "grade": "A",
        "isPassed": true,
        "submittedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "categoryPerformance": [
      {
        "category": "JavaScript",
        "examCount": 2,
        "averageScore": 85,
        "bestScore": 90
      }
    ]
  }
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Rate Limiting
- 100 requests per 15 minutes per IP address
- Authentication required endpoints have additional validation

## Validation Rules

### User Registration
- Name: 2-50 characters, letters and spaces only
- Email: Valid email format
- Password: Minimum 6 characters, must contain uppercase, lowercase, and number

### Exam Submission
- All questions must be answered
- Selected answers must be valid option indices
- Time taken must be positive number
- Start time must be valid ISO date

## Sample Test Data

### Test Users
```
Email: student@example.com | Password: password123
Email: john.doe@example.com | Password: password123
Email: jane.smith@example.com | Password: password123
```

### Sample Exams
1. **JavaScript Fundamentals** - 5 questions, 30 minutes
2. **React Development** - 5 questions, 45 minutes  
3. **Web Development Fundamentals** - 5 questions, 60 minutes

## MongoDB Atlas Setup (Alternative to Local MongoDB)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get connection string and update `.env`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/online-mcq-system
   ```

## Development Workflow

1. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Database** (if using local MongoDB)
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

4. **Seed Database**
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Test API**
   - Import `postman-collection.json` into Postman
   - Use health check endpoint: `GET http://localhost:5000/health`

## Production Deployment

### Using Docker
```bash
# Build and start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Manual Deployment
1. Set environment variables
2. Install dependencies: `npm install --production`
3. Start application: `npm start`
4. Use process manager like PM2 for production

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Check network connectivity for Atlas

2. **JWT Token Errors**
   - Ensure JWT_SECRET is set in environment
   - Check token format in Authorization header

3. **Validation Errors**
   - Check request body format
   - Ensure required fields are provided
   - Verify data types match schema

4. **CORS Issues**
   - Update FRONTEND_URL in `.env`
   - Check allowed origins in CORS configuration

### Debug Mode
Set `NODE_ENV=development` to enable:
- Detailed error messages
- Request logging
- Stack traces in responses
