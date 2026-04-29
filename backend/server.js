import dotenv from 'dotenv';
import app from './src/app.js';
import connectDatabase from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const isVercel = Boolean(process.env.VERCEL);

const start = async () => {
  try {
    await connectDatabase();

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

await start();

export default app;
