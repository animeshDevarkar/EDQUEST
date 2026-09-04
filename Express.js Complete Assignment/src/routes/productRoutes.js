const express = require('express');
const productController = require('../controllers/productController');
const { requireApiKey, requireRole } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validate');
const { strictLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * Route parameter validation middleware
 * Demonstrates router.param() feature of Express.js
 */
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      status: 'fail',
      message: `Invalid product ID format '${id}'. ID must be numeric.`
    });
  }
  next();
});

/**
 * Route Chaining for '/': GET (Public) & POST (Protected)
 */
router.route('/')
  .get(productController.getProducts)
  .post(
    strictLimiter,
    requireApiKey,
    requireRole('admin'),
    validateProduct,
    productController.createProduct
  );

/**
 * Route Chaining for '/:id': GET (Public), PUT (Protected), DELETE (Protected Admin)
 */
router.route('/:id')
  .get(productController.getProductById)
  .put(
    strictLimiter,
    requireApiKey,
    requireRole('admin'),
    validateProduct,
    productController.updateProduct
  )
  .delete(
    strictLimiter,
    requireApiKey,
    requireRole('admin'),
    productController.deleteProduct
  );

module.exports = router;
