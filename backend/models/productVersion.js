const { pool } = require('../db');

class ProductVersion {
  // Creates a new product version with original and optimized info.
  static async create(productId, originalInfo, optimizedInfo) {
    const [result] = await pool.execute(
      'INSERT INTO product_versions (product_id, original_info, optimized_info) VALUES (?, ?, ?)',
      // The info is stringified for storage in the JSON column.
      [productId, JSON.stringify(originalInfo), JSON.stringify(optimizedInfo)]
    );
    return result.insertId;
  }
}

module.exports = ProductVersion;