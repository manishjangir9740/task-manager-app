import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const databaseUrl = process.env.DATABASE_URL;
const dbSSL = process.env.DB_SSL === 'true';

const pool = databaseUrl
  ? mysql.createPool(databaseUrl)
  : mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'task_manager_db',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
      queueLimit: 0,
      ssl: dbSSL ? { rejectUnauthorized: false } : undefined,
    });

// Test connection and log state
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    connection.release();
    return true;
  } catch (error: any) {
    console.error('Database connection failed!');
    console.error('Error details:', error.message);
    console.error('Please make sure MySQL is running and configuration in backend/.env is correct.');
    return false;
  }
}

export default pool;
