import mongoose from 'mongoose';

const connectDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI not set. Database connection skipped.');
    return;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
};

export default connectDatabase;
