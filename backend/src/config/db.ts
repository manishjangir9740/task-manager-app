import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const dbSSL = process.env.DB_SSL === 'true';
const dbName = process.env.DB_NAME || 'task_manager_db';

// Ensure the database and tables exist (auto-migration on startup)
async function ensureDatabaseExists() {
  if (databaseUrl) {
    // If using a cloud database URL, we get a connection from the pool to verify/create the tables
    let connection;
    try {
      connection = await pool.getConnection();
      
      // Create users table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);

      // Create tasks table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
          stage ENUM('To Do', 'In Progress', 'Under Review', 'Completed') DEFAULT 'To Do',
          due_date DATE DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log("[Database Setup] Cloud database tables verified/created successfully.");
    } catch (err: any) {
      console.error("[Database Setup] Failed to verify cloud database tables:", err.message);
      throw err;
    } finally {
      if (connection) connection.release();
    }
    return;
  }

  // Connect to MySQL server without selecting a database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306'),
    ssl: dbSSL ? { rejectUnauthorized: false } : undefined,
  });

  try {
    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`[Database Setup] Database '${dbName}' verified/created successfully.`);

    // Use the database
    await connection.query(`USE \`${dbName}\``);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create tasks table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
        stage ENUM('To Do', 'In Progress', 'Under Review', 'Completed') DEFAULT 'To Do',
        due_date DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log("[Database Setup] Database tables verified/created successfully.");
  } finally {
    await connection.end();
  }
}

const pool = databaseUrl
  ? mysql.createPool(databaseUrl)
  : mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: dbName,
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
      queueLimit: 0,
      ssl: dbSSL ? { rejectUnauthorized: false } : undefined,
    });

// Test connection and log state
export async function testConnection() {
  try {
    // First, ensure the database and tables exist
    await ensureDatabaseExists();

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
