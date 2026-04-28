import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import chatRoutes from './routes/chatRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

const defaultLocalOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : defaultLocalOrigins;

app.use(helmet());
app.use(
  cors({
    origin: configuredOrigins,
    credentials: false
  })
);
// doing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Shopping Chat Bot API is running.',
    health: '/api/health',
    api: '/api'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Voice assistant API is healthy' });
});

app.use('/api/chat', chatRoutes);
app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
