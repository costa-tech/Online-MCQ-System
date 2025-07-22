import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Exam from '../models/Exam.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Exam.deleteMany({});
    await Question.deleteMany({});
    await Result.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create sample users
    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'student'
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'student'
      },
      {
        name: 'Test Student',
        email: 'student@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'student'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('👥 Created sample users');

    // Create sample exams
    const exams = [
      {
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics, ES6+ features, and modern development practices.',
        duration: 30,
        totalMarks: 50,
        category: 'JavaScript',
        difficulty: 'Medium',
        instructions: 'Read all questions carefully. Each question carries 10 marks. No negative marking.'
      },
      {
        title: 'React Development',
        description: 'Comprehensive test covering React hooks, components, state management, and best practices.',
        duration: 45,
        totalMarks: 75,
        category: 'React',
        difficulty: 'Hard',
        instructions: 'This is an advanced React assessment. Take your time to understand each question.'
      },
      {
        title: 'Web Development Fundamentals',
        description: 'Essential concepts in HTML, CSS, JavaScript, and modern web development practices.',
        duration: 60,
        totalMarks: 100,
        category: 'Web Development',
        difficulty: 'Easy',
        instructions: 'This covers basic web development concepts. Perfect for beginners.'
      }
    ];

    const createdExams = await Exam.insertMany(exams);
    console.log('📝 Created sample exams');

    // Create sample questions for JavaScript Fundamentals
    const jsQuestions = [
      {
        examId: createdExams[0]._id,
        question: 'Which of the following is NOT a JavaScript data type?',
        options: ['undefined', 'boolean', 'float', 'symbol'],
        correctAnswer: 2,
        marks: 10,
        explanation: 'JavaScript has number type instead of float. Float is not a distinct data type in JavaScript.',
        orderIndex: 1
      },
      {
        examId: createdExams[0]._id,
        question: 'What does the "async" keyword do in JavaScript?',
        options: ['Makes a function synchronous', 'Makes a function return a Promise', 'Stops function execution', 'Creates a new thread'],
        correctAnswer: 1,
        marks: 10,
        explanation: 'The async keyword makes a function return a Promise and allows the use of await inside it.',
        orderIndex: 2
      },
      {
        examId: createdExams[0]._id,
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0,
        marks: 10,
        explanation: 'push() adds one or more elements to the end of an array and returns the new length.',
        orderIndex: 3
      },
      {
        examId: createdExams[0]._id,
        question: 'What is the result of "typeof null" in JavaScript?',
        options: ['null', 'undefined', 'object', 'boolean'],
        correctAnswer: 2,
        marks: 10,
        explanation: 'This is a well-known quirk in JavaScript. typeof null returns "object" due to a bug in the original implementation.',
        orderIndex: 4
      },
      {
        examId: createdExams[0]._id,
        question: 'Which of the following creates a proper arrow function?',
        options: ['=> function() {}', '() => {}', 'function => {}', '=> () {}'],
        correctAnswer: 1,
        marks: 10,
        explanation: 'Arrow functions use the syntax () => {} where parentheses contain parameters and => precedes the function body.',
        orderIndex: 5
      }
    ];

    // Create sample questions for React Development
    const reactQuestions = [
      {
        examId: createdExams[1]._id,
        question: 'What is the purpose of useEffect hook?',
        options: ['To manage state', 'To handle side effects', 'To create components', 'To style elements'],
        correctAnswer: 1,
        marks: 15,
        explanation: 'useEffect is used to handle side effects like API calls, subscriptions, or manually changing the DOM.',
        orderIndex: 1
      },
      {
        examId: createdExams[1]._id,
        question: 'Which method is used to update state in functional components?',
        options: ['this.setState()', 'useState()', 'updateState()', 'setState()'],
        correctAnswer: 1,
        marks: 15,
        explanation: 'useState() is the hook used to manage state in functional components.',
        orderIndex: 2
      },
      {
        examId: createdExams[1]._id,
        question: 'What does JSX stand for?',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JavaScript Extension', 'Java XML'],
        correctAnswer: 0,
        marks: 15,
        explanation: 'JSX stands for JavaScript XML and allows you to write HTML-like syntax in JavaScript.',
        orderIndex: 3
      },
      {
        examId: createdExams[1]._id,
        question: 'How do you pass data from parent to child component?',
        options: ['Using state', 'Using props', 'Using context', 'Using refs'],
        correctAnswer: 1,
        marks: 15,
        explanation: 'Props (properties) are used to pass data from parent components to child components.',
        orderIndex: 4
      },
      {
        examId: createdExams[1]._id,
        question: 'What is the Virtual DOM?',
        options: ['A real DOM copy', 'A JavaScript representation of the DOM', 'A browser API', 'A CSS framework'],
        correctAnswer: 1,
        marks: 15,
        explanation: 'The Virtual DOM is a JavaScript representation of the actual DOM that React uses for efficient updates.',
        orderIndex: 5
      }
    ];

    // Create sample questions for Web Development Fundamentals
    const webDevQuestions = [
      {
        examId: createdExams[2]._id,
        question: 'Which HTML tag is used to define an internal style sheet?',
        options: ['<css>', '<script>', '<style>', '<link>'],
        correctAnswer: 2,
        marks: 20,
        explanation: 'The <style> tag is used to define internal CSS styles within an HTML document.',
        orderIndex: 1
      },
      {
        examId: createdExams[2]._id,
        question: 'Which CSS property is used to change the text color?',
        options: ['text-color', 'font-color', 'color', 'text-style'],
        correctAnswer: 2,
        marks: 20,
        explanation: 'The color property in CSS is used to set the color of text.',
        orderIndex: 2
      },
      {
        examId: createdExams[2]._id,
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
        correctAnswer: 0,
        marks: 20,
        explanation: 'HTML stands for Hyper Text Markup Language.',
        orderIndex: 3
      },
      {
        examId: createdExams[2]._id,
        question: 'Which JavaScript method is used to select an element by its ID?',
        options: ['getElementById()', 'querySelector()', 'selectById()', 'getElement()'],
        correctAnswer: 0,
        marks: 20,
        explanation: 'getElementById() is the method used to select an element by its ID attribute.',
        orderIndex: 4
      },
      {
        examId: createdExams[2]._id,
        question: 'Which HTTP method is used to send data to a server?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        correctAnswer: 1,
        marks: 20,
        explanation: 'POST is the HTTP method commonly used to send data to a server to create a resource.',
        orderIndex: 5
      }
    ];

    // Insert all questions and get the created documents with IDs
    const createdJsQuestions = await Question.insertMany(jsQuestions);
    const createdReactQuestions = await Question.insertMany(reactQuestions);
    const createdWebDevQuestions = await Question.insertMany(webDevQuestions);
    console.log('❓ Created sample questions');

    // Create some sample results
    const sampleResults = [
      {
        userId: createdUsers[0]._id,
        examId: createdExams[0]._id,
        answers: [
          { questionId: createdJsQuestions[0]._id, selectedAnswer: 2, isCorrect: true, marksObtained: 10 },
          { questionId: createdJsQuestions[1]._id, selectedAnswer: 1, isCorrect: true, marksObtained: 10 },
          { questionId: createdJsQuestions[2]._id, selectedAnswer: 0, isCorrect: true, marksObtained: 10 },
          { questionId: createdJsQuestions[3]._id, selectedAnswer: 1, isCorrect: false, marksObtained: 0 },
          { questionId: createdJsQuestions[4]._id, selectedAnswer: 1, isCorrect: true, marksObtained: 10 }
        ],
        totalQuestions: 5,
        correctAnswers: 4,
        score: 40,
        totalMarks: 50,
        percentage: 80,
        timeTaken: 1200, // 20 minutes
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1200 * 1000)
      },
      {
        userId: createdUsers[1]._id,
        examId: createdExams[1]._id,
        answers: [
          { questionId: createdReactQuestions[0]._id, selectedAnswer: 1, isCorrect: true, marksObtained: 15 },
          { questionId: createdReactQuestions[1]._id, selectedAnswer: 1, isCorrect: true, marksObtained: 15 },
          { questionId: createdReactQuestions[2]._id, selectedAnswer: 0, isCorrect: true, marksObtained: 15 },
          { questionId: createdReactQuestions[3]._id, selectedAnswer: 1, isCorrect: true, marksObtained: 15 },
          { questionId: createdReactQuestions[4]._id, selectedAnswer: 1, isCorrect: true, marksObtained: 15 }
        ],
        totalQuestions: 5,
        correctAnswers: 5,
        score: 75,
        totalMarks: 75,
        percentage: 100,
        timeTaken: 2100, // 35 minutes
        startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2100 * 1000)
      }
    ];

    await Result.insertMany(sampleResults);
    console.log('📊 Created sample results');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Sample credentials:');
    console.log('Email: student@example.com | Password: password123');
    console.log('Email: john.doe@example.com | Password: password123');
    console.log('Email: jane.smith@example.com | Password: password123');
    
    console.log('\n📚 Created exams:');
    createdExams.forEach(exam => {
      console.log(`- ${exam.title} (${exam.category})`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seed function
seedData();
