import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log('URI loaded:', process.env.MONGODB_URI ? 'Yes' : 'No');
    
    if (process.env.MONGODB_URI) {
      console.log('URI starts with:', process.env.MONGODB_URI.substring(0, 20));
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Connected Successfully!');
      console.log('Host:', conn.connection.host);
      console.log('Database:', conn.connection.name);
      await mongoose.disconnect();
    } else {
      console.log('❌ MONGODB_URI not found in environment variables');
    }
    
  } catch (error) {
    console.log('❌ Database Connection Failed:');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
  }
  process.exit(0);
}

testConnection();
