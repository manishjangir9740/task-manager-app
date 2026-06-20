import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { testConnection } from './config/db';

dotenv.config();

const app = express();

// Serverless DB Init Middleware (runs once on cold start to verify/create DB and tables)
let isDbInitialized = false;
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!isDbInitialized) {
    try {
      await testConnection();
      isDbInitialized = true;
    } catch (err) {
      console.error('Failed to initialize database on request:', err);
    }
  }
  next();
});

// Middlewares
// In production set FRONTEND_URL to the deployed frontend origin to restrict CORS.
// When FRONTEND_URL is not set (local dev) all origins are allowed.
const frontendUrl = process.env.FRONTEND_URL;
app.use(cors({
  origin: frontendUrl
    ? (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, Postman) and the configured frontend
        if (!origin || origin === frontendUrl) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin '${origin}' is not allowed`));
        }
      }
    : true, // dev: allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  credentials: true
}));
app.disable('x-powered-by');
app.use(express.json());

// Request logger for diagnostic tracing
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

export default app;
