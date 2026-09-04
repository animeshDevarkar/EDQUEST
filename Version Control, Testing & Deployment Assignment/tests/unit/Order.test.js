const Order = require('../../src/models/Order');

describe('Order Model (Unit Tests)', () => {
  describe('Constructor & Validation', () => {
    test('should create an Order instance with valid ID and email', () => {
      const order = new Order('ORD-001', 'alice@test.com');
      expect(order.id).toBe('ORD-001');
      expect(order.customerEmail).toBe('alice@test.com');
      expect(order.items).toEqual([]);
      expect(order.status).toBe('PENDING');
      expect(order.createdAt).toBeInstanceOf(Date);
    });

    test('should throw error when order ID is missing or empty', () => {
      expect(() => new Order('', 'alice@test.com')).toThrow('Invalid order ID');
      expect(() => new Order(null, 'alice@test.com')).toThrow('Invalid order ID');
    });

    test('should throw error when email is invalid', () => {
      expect(() => new Order('ORD-002', 'invalid-email')).toThrow('Invalid customer email');
      expect(() => new Order('ORD-002', '')).toThrow('Invalid customer email');
    });
  });

  describe('Item Management', () => {
    let order;

    beforeEach(() => {
      order = new Order('ORD-100', 'bob@test.com');
    });

    test('should add an item with valid attributes', () => {
      order.addItem({ sku: 'SKU-A', name: 'Keyboard', price: 49.99, quantity: 1 });
      expect(order.items.length).toBe(1);
      expect(order.items[0]).toEqual({
        sku: 'SKU-A',
        name: 'Keyboard',
        price: 49.99,
        quantity: 1,
      });
    });

    test('should increment quantity when duplicate SKU is added', () => {
      order.addItem({ sku: 'SKU-A', price: 50, quantity: 2 });
      order.addItem({ sku: 'SKU-A', price: 50, quantity: 3 });

      expect(order.items.length).toBe(1);
      expect(order.items[0].quantity).toBe(5);
    });

    test('should reject invalid item parameters', () => {
      expect(() => order.addItem({ sku: '', price: 10 })).toThrow('Invalid item');
      expect(() => order.addItem({ sku: 'SKU-B', price: -5 })).toThrow('Invalid item');
      expect(() => order.addItem({ sku: 'SKU-B', price: 0 })).toThrow('Invalid item');
    });

    test('should remove item by SKU', () => {
      order.addItem({ sku: 'SKU-1', price: 10 });
      order.addItem({ sku: 'SKU-2', price: 20 });

      const removed = order.removeItem('SKU-1');
      expect(removed).toBe(true);
      expect(order.items.length).toBe(1);
      expect(order.items[0].sku).toBe('SKU-2');
    });

    test('should return false when removing non-existent SKU', () => {
      order.addItem({ sku: 'SKU-1', price: 10 });
      const removed = order.removeItem('NON-EXISTENT');
      expect(removed).toBe(false);
      expect(order.items.length).toBe(1);
    });
  });

  describe('Calculations', () => {
    test('should calculate subtotal correctly with decimal precision', () => {
      const order = new Order('ORD-300', 'charlie@test.com');
      order.addItem({ sku: 'ITEM-1', price: 19.99, quantity: 2 }); // 39.98
      order.addItem({ sku: 'ITEM-2', price: 10.5, quantity: 1 });  // 10.50

      expect(order.getSubtotal()).toBe(50.48);
      expect(order.getItemCount()).toBe(3);
    });

    test('should return 0 subtotal for empty order', () => {
      const order = new Order('ORD-301', 'empty@test.com');
      expect(order.getSubtotal()).toBe(0);
      expect(order.getItemCount()).toBe(0);
    });
  });
});
