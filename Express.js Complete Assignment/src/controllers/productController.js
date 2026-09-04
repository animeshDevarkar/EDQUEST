const ProductService = require('../services/productService');
const { AppError, catchAsync } = require('../middleware/errorHandler');

/**
 * GET /api/v1/products - Fetch products with optional search & filtering
 */
const getProducts = catchAsync(async (req, res) => {
  const result = ProductService.getAll(req.query);

  res.status(200).json({
    status: 'success',
    results: result.data.length,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    },
    data: {
      products: result.data
    }
  });
});

/**
 * GET /api/v1/products/:id - Fetch single product by ID
 */
const getProductById = catchAsync(async (req, res, next) => {
  const product = ProductService.getById(req.params.id);

  if (!product) {
    return next(new AppError(`Product with ID '${req.params.id}' not found`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

/**
 * POST /api/v1/products - Create a new product (Protected)
 */
const createProduct = catchAsync(async (req, res) => {
  const newProduct = ProductService.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Product created successfully',
    data: {
      product: newProduct
    }
  });
});

/**
 * PUT /api/v1/products/:id - Replace / Update a product (Protected)
 */
const updateProduct = catchAsync(async (req, res, next) => {
  const updatedProduct = ProductService.update(req.params.id, req.body);

  if (!updatedProduct) {
    return next(new AppError(`Product with ID '${req.params.id}' not found`, 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Product updated successfully',
    data: {
      product: updatedProduct
    }
  });
});

/**
 * DELETE /api/v1/products/:id - Delete a product (Protected, Admin only)
 */
const deleteProduct = catchAsync(async (req, res, next) => {
  const deleted = ProductService.delete(req.params.id);

  if (!deleted) {
    return next(new AppError(`Product with ID '${req.params.id}' not found`, 404));
  }

  // HTTP 204 No Content for successful deletion
  res.status(204).send();
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
