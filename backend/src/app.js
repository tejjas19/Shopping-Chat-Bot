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

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (configuredOrigins.includes(origin)) {
    return true;
  }

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }

  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
};

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: false
  })
);
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

// Serve static frontend files in production
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const frontendDist = join(__dirname, '../../frontend/dist');

// Serve static files from frontend build
app.use(express.static(frontendDist, { 
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

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

// SPA fallback - serve index.html for all non-API GET requests without using a wildcard route
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  if (req.path.startsWith('/api')) {
    return next();
  }

  res.sendFile(join(frontendDist, 'index.html'), (error) => {
    if (error) {
      return next(error);
    }
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
