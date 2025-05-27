import { createPool } from 'mysql2/promise';

// Create a database connection pool
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  acquireTimeout: 10000, // 10 seconds
  timeout: 60000, // 60 seconds
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 seconds
});

// Execute SQL queries using the pool
export const query = async ({ query, values }) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, values);
    return rows;
  } catch (error) {
    console.error('Database query error:', {
      query,
      values,
      error: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
