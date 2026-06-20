import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

dotenv.config();

const app = express();

// Middlewares
// CORS: Use FRONTEND_URL if set; otherwise reflect request origin (required when credentials: true)
const frontendUrl = process.env.FRONTEND_URL;
app.use(cors({
  origin: frontendUrl
    ? frontendUrl.split(',').map((u) => u.trim()) // support comma-separated list of allowed origins
    : (origin, callback) => callback(null, origin || '*'), // reflect origin dynamically for dev/self-hosted
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
