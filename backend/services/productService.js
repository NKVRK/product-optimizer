const Product = require('../models/product');
const ProductVersion = require('../models/productVersion');
const geminiService = require('./geminiService');
const axios = require('axios');
require('dotenv').config();

class ProductService {
  // Fetches original product information from Amazon using the Apify scraper.
  async fetchOriginalProductInfo(asin) {
    const apifyToken = process.env.APIFY_API_TOKEN;
    const actorId = 'canadesk~amazon-products-reviews';

    if (!apifyToken) {
      throw new Error('Missing Apify API token. Please set APIFY_API_TOKEN in .env');
    }

    try {
      // Input configuration for the Apify actor.
      const input = {
        asin: [asin],
        country: 'IN',
        maximum: 1,
        proxy: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] },
      };

      const url = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${apifyToken}`;
      const response = await axios.post(url, input, { timeout: 180000 });

      const data = response.data?.[0];
      
      // If the scraper runs successfully but returns no data, it means the product was not found. 
      if (!data || !data.title) {
        throw new Error('Product not found for this ASIN');
      }

      // Formats the scraped data into a clean object.
      return {
        title: data.title || '',
        description: data.description || '',
        features: data.feature_bullets || [],
      };
    } catch (error) {
      console.error('Error fetching original product info:', error.message);
      throw error;
    }
  }

  // Validates the format of an Amazon Standard Identification Number (ASIN).
  validateASIN(asin) {
    if (!asin || typeof asin !== 'string') return false;
    const asinRegex = /^[A-Z0-9]{10}$/;
    return asinRegex.test(asin.toUpperCase());
  }

  // Main service method to process an ASIN.
  async processASIN(asin) {
    if (!this.validateASIN(asin)) {
      throw new Error('Invalid ASIN format');
    }

    // 1. Fetch original product information.
    const originalInfo = await this.fetchOriginalProductInfo(asin);
    
    // 2. Generate AI-optimized information.
    const optimizedInfo = await geminiService.generateOptimizedInfo(originalInfo);

    // 3. Store the new version in the database.
    let product = await Product.findByASIN(asin);
    let productId;

    if (product) {
      // If the product exists, update its timestamp.
      productId = product.id;
      await Product.updateTimestamp(asin);
    } else {
      // Otherwise, create a new product entry.
      productId = await Product.create(asin, originalInfo.title);
    }

    await ProductVersion.create(productId, originalInfo, optimizedInfo);

    return { asin, title: originalInfo.title, original_info: originalInfo, optimized_info: optimizedInfo };
  }

  // Retrieves the optimization history for a given ASIN.
  async getProductHistory(asin) {
    if (!this.validateASIN(asin)) {
      throw new Error('Invalid ASIN format');
    }
    return await Product.getWithVersions(asin);
  }

  // Retrieves all products from the database.
  async getAllProducts() {
    return await Product.getAll();
  }
}

module.exports = new ProductService();