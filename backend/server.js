import dotenv from 'dotenv';
import app from './src/app.js';
import connectDatabase from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const isVercel = Boolean(process.env.VERCEL);

let dbConnected = false;

const ensureDBConnected = async () => {
  if (dbConnected || !process.env.MONGODB_URI) {
    return;
  }
  try {
    await connectDatabase();
    dbConnected = true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

app.use(async (req, res, next) => {
  if (!dbConnected && process.env.MONGODB_URI) {
    await ensureDBConnected();
  }
  next();
});

const start = async () => {
  try {
    if (!isVercel) {
      await connectDatabase();
      dbConnected = true;
    }

    if (!isVercel) {
      app.listen(PORT, () => {
        console.log(`Backend running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (!isVercel) {
  await start();
}

export default app;
