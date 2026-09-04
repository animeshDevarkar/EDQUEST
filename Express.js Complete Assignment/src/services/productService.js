/**
 * In-Memory Product Database Service
 */
let productsDB = [
  { id: '101', name: 'MacBook Pro 16 M3', category: 'Electronics', price: 2499.99, stock: 15, createdAt: new Date('2026-01-10').toISOString() },
  { id: '102', name: 'Logitech MX Master 3S', category: 'Accessories', price: 99.99, stock: 45, createdAt: new Date('2026-01-15').toISOString() },
  { id: '103', name: 'Dell UltraSharp 27 4K', category: 'Electronics', price: 549.99, stock: 20, createdAt: new Date('2026-02-01').toISOString() },
  { id: '104', name: 'Keychron Q1 Pro Wireless', category: 'Accessories', price: 199.99, stock: 30, createdAt: new Date('2026-02-20').toISOString() },
  { id: '105', name: 'Sony WH-1000XM5 Headphones', category: 'Audio', price: 399.99, stock: 25, createdAt: new Date('2026-03-01').toISOString() }
];

let nextId = 106;

class ProductService {
  static getAll({ category, minPrice, maxPrice, search, page = 1, limit = 10 }) {
    let result = [...productsDB];

    // Filter by Category
    if (category) {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Price Range
    if (minPrice) {
      result = result.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Search by Name
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q));
    }

    // Pagination
    const total = result.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = result.slice(startIndex, startIndex + limitNum);

    return {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: paginatedItems
    };
  }

  static getById(id) {
    return productsDB.find(p => p.id === id);
  }

  static create(productData) {
    const newProduct = {
      id: `${nextId++}`,
      name: productData.name,
      category: productData.category,
      price: productData.price,
      stock: productData.stock || 0,
      createdAt: new Date().toISOString()
    };
    productsDB.push(newProduct);
    return newProduct;
  }

  static update(id, productData) {
    const index = productsDB.findIndex(p => p.id === id);
    if (index === -1) return null;

    productsDB[index] = {
      ...productsDB[index],
      ...productData,
      id // preserve original id
    };

    return productsDB[index];
  }

  static delete(id) {
    const index = productsDB.findIndex(p => p.id === id);
    if (index === -1) return false;

    productsDB.splice(index, 1);
    return true;
  }

  static reset() {
    productsDB = [
      { id: '101', name: 'MacBook Pro 16 M3', category: 'Electronics', price: 2499.99, stock: 15, createdAt: new Date('2026-01-10').toISOString() },
      { id: '102', name: 'Logitech MX Master 3S', category: 'Accessories', price: 99.99, stock: 45, createdAt: new Date('2026-01-15').toISOString() },
      { id: '103', name: 'Dell UltraSharp 27 4K', category: 'Electronics', price: 549.99, stock: 20, createdAt: new Date('2026-02-01').toISOString() },
      { id: '104', name: 'Keychron Q1 Pro Wireless', category: 'Accessories', price: 199.99, stock: 30, createdAt: new Date('2026-02-20').toISOString() },
      { id: '105', name: 'Sony WH-1000XM5 Headphones', category: 'Audio', price: 399.99, stock: 25, createdAt: new Date('2026-03-01').toISOString() }
    ];
    nextId = 106;
  }
}

module.exports = ProductService;
