import app from './app';
import { testConnection } from './config/db';

const PORT = process.env.PORT || 5000;

async function startServer() {
  console.log('Initializing TaskManager Backend Server...');
  
  // Verify JWT configuration
  if (!process.env.JWT_SECRET) {
    console.error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not defined in .env!');
    process.exit(1);
  }
  if (process.env.JWT_SECRET === 'super_secret_key_task_manager_app_123!') {
    console.warn('==================================================');
    console.warn('SECURITY WARNING: JWT_SECRET is using the insecure default fallback value!');
    console.warn('Please define a custom, secure secret key in your .env file.');
    console.warn('==================================================');
  }

  // Test connection to MySQL Database
  const isDbConnected = await testConnection();
  if (!isDbConnected) {
    console.warn('==================================================');
    console.warn('WARNING: Running server without successful database link.');
    console.warn('Confirm database configuration in .env to execute queries.');
    console.warn('==================================================');
  }

  app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
    console.log(`Health check ready at http://localhost:${PORT}/api/health`);
  });
}

startServer();
