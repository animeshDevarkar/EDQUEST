const { AppError } = require('./errorHandler');

/**
 * Validates Product Payload for POST/PUT endpoints
 */
const validateProduct = (req, res, next) => {
  const { name, price, category, stock } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Product name is required and must be a non-empty string.');
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    errors.push('Price is required and must be a positive number.');
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    errors.push('Category is required and must be a string.');
  }

  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
    errors.push('Stock must be a non-negative integer.');
  }

  if (errors.length > 0) {
    return next(new AppError(`Validation Error: ${errors.join(' ')}`, 400));
  }

  next();
};

module.exports = {
  validateProduct
};
