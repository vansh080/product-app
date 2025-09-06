import mongoose from 'mongoose';

export default async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/product-app';
  try {
    await mongoose.connect(uri, {
      // these options are no longer needed in mongoose v7+, kept for clarity
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
