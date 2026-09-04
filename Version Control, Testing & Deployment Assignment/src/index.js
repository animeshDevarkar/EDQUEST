const Order = require('./models/Order');
const OrderService = require('./services/OrderService');

async function main() {
  console.log('--- E-Commerce Order System Demonstration ---');
  
  const orderService = new OrderService();
  const order = new Order('ORD-90210', 'student@example.com');

  order.addItem({ sku: 'LAPTOP-PRO', name: 'MacBook Pro M3', price: 1999.99, quantity: 1 });
  order.addItem({ sku: 'USB-C-DOCK', name: 'Thunderbolt 4 Dock', price: 149.50, quantity: 2 });

  console.log(`Order ID: ${order.id}`);
  console.log(`Subtotal: $${order.getSubtotal()}`);
  console.log(`Total Items: ${order.getItemCount()}`);

  const summary = orderService.calculateOrderSummary(order, {
    couponCode: 'SAVE25',
    regionCode: 'US_CA',
  });

  console.log('Order Summary:', summary);

  const receipt = await orderService.checkout(order, {
    couponCode: 'SAVE25',
    regionCode: 'US_CA',
    paymentMethod: {
      type: 'CREDIT_CARD',
      cardNumber: '4111222233334444',
      cvv: '123',
    },
  });

  console.log('Checkout Succeeded! Receipt:', receipt);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  Order,
  OrderService,
};
