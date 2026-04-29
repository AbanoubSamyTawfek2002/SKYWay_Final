import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Sanitize: remove any surrounding quotes and whitespace that might cause "Invalid scheme" errors
    uri = uri.trim().replace(/^["'](.+)["']$/, '$1');

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    if (error.message.includes('IP isn\'t whitelisted') || error.message.includes('Could not connect to any servers')) {
      console.error('CRITICAL: MongoDB Atlas IP Whitelist Error.');
      console.error('Please go to MongoDB Atlas -> Network Access and add "0.0.0.0/0".');
    }
    console.error(`Error: ${error.message}`);
    // Do not exit process, let the application handle the missing DB connection gracefully
  }
};

export default connectDB;
