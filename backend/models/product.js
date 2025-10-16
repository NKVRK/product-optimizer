const { pool } = require('../db');

class Product {
  // Finds a product by its ASIN.
  static async findByASIN(asin) {
    const [rows] = await pool.execute('SELECT * FROM products WHERE asin = ?', [asin]);
    return rows[0];
  }

  // Creates a new product entry.
  static async create(asin, title) {
    const [result] = await pool.execute(
      'INSERT INTO products (asin, title) VALUES (?, ?)',
      [asin, title]
    );
    return result.insertId;
  }

  // Updates the `updated_at` timestamp for a product.
  static async updateTimestamp(asin) {
    await pool.execute(
      'UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE asin = ?',
      [asin]
    );
  }

  // Retrieves all products, ordered by the most recently updated.
  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT asin, title, updated_at as last_updated 
      FROM products 
      ORDER BY updated_at DESC
    `);
    return rows;
  }

  // Retrieves a product along with all of its optimization versions.
  static async getWithVersions(asin) {
    const [products] = await pool.execute('SELECT * FROM products WHERE asin = ?', [asin]);
    
    if (products.length === 0) return null;

    const [versions] = await pool.execute(
      `SELECT original_info, optimized_info, timestamp 
       FROM product_versions 
       WHERE product_id = ? 
       ORDER BY timestamp DESC`,
      [products[0].id]
    );

    return {
      asin: products[0].asin,
      title: products[0].title,
      history: versions,
    };
  }
}

module.exports = Product;