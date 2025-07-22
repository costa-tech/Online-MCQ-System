import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    console.log('URI:', process.env.MONGODB_URI ? 'Loaded' : 'Not found');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    
  } catch (error) {
    console.log('❌ Database Connection Failed:');
    console.log('Error:', error.message);
  }
}

testConnection();
