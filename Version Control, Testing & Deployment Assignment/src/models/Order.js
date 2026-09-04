/**
 * Order Model representing an e-commerce shopping cart and order details.
 */
class Order {
  constructor(id, customerEmail) {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid order ID: must be a non-empty string.');
    }
    if (!customerEmail || !customerEmail.includes('@')) {
      throw new Error('Invalid customer email address.');
    }

    this.id = id;
    this.customerEmail = customerEmail;
    this.items = [];
    this.status = 'PENDING';
    this.createdAt = new Date();
  }

  addItem(item) {
    if (!item || !item.sku || typeof item.price !== 'number' || item.price <= 0) {
      throw new Error('Invalid item: SKU required and price must be greater than 0.');
    }
    const quantity = item.quantity && item.quantity > 0 ? item.quantity : 1;

    const existingItem = this.items.find(i => i.sku === item.sku);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        sku: item.sku,
        name: item.name || 'Unnamed Product',
        price: Number(item.price.toFixed(2)),
        quantity: Math.floor(quantity),
      });
    }
    return this;
  }

  removeItem(sku) {
    const initialLength = this.items.length;
    this.items = this.items.filter(i => i.sku !== sku);
    return this.items.length < initialLength;
  }

  getSubtotal() {
    const sum = this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    return Number(sum.toFixed(2));
  }

  getItemCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }
}

module.exports = Order;
