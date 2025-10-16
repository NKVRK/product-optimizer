const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Route to get and process product information for a given ASIN.
router.get('/asin/:asin', productController.getASIN);

// Route to get a list of all products that have been processed.
router.get('/history', productController.getHistory);

// Route to get the optimization history for a specific ASIN.
router.get('/asin/:asin/history', productController.getASINHistory);

module.exports = router;