const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool for efficient database connections.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'product_optimization',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Initializes the database by creating tables if they don't exist.
const initDB = async () => {
  try {
    const connection = await pool.getConnection();
    
    // SQL to create the `products` table.
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        asin VARCHAR(20) UNIQUE NOT NULL,
        title VARCHAR(500) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_asin (asin)
      )
    `);

    // SQL to create the `product_versions` table.
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS product_versions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id INT NOT NULL,
        original_info JSON NOT NULL,
        optimized_info JSON NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        INDEX idx_product_id (product_id)
      )
    `);

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

module.exports = { pool, initDB };