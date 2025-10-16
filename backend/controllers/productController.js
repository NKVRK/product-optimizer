const productService = require('../services/productService');

class ProductController {
  // Handles the request to process a new ASIN.
  async getASIN(req, res) {
    try {
      const { asin } = req.params;
      
      // Basic validation for the presence of the ASIN parameter.
      if (!asin) {
        return res.status(400).json({ error: 'ASIN parameter is required' });
      }

      const result = await productService.processASIN(asin);
      res.json(result);
    } catch (error) {
      console.error('Error in getASIN:', error);

      // Check for the new "Product not found" error.
      if (error.message.includes('Product not found for this ASIN')) {
        return res.status(404).json({ error: `We couldn't find a product with the ASIN: ${req.params.asin}. Please check the number and try again.` });
      }
      
      // Handle specific error for invalid ASIN format.
      if (error.message.includes('Invalid ASIN')) {
        return res.status(400).json({ error: error.message });
      }

      // Generic server error for all other issues.
      res.status(500).json({ error: 'Failed to process ASIN', details: error.message });
    }
  }

  // Handles the request to get the history of all processed products.
  async getHistory(req, res) {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error('Error in getHistory:', error);
      res.status(500).json({ error: 'Failed to fetch product history' });
    }
  }

  // Handles the request to get the optimization history for a single ASIN.
  async getASINHistory(req, res) {
    try {
      const { asin } = req.params;
      
      if (!asin) {
        return res.status(400).json({ error: 'ASIN parameter is required' });
      }

      const history = await productService.getProductHistory(asin);
      
      if (!history) {
        return res.status(404).json({ error: 'No product found with this ASIN' });
      }

      res.json(history);
    } catch (error) {
      console.error('Error in getASINHistory:', error);
      
      if (error.message.includes('Invalid ASIN')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Failed to fetch product history' });
    }
  }
}

module.exports = new ProductController();