const Order = require('../../src/models/Order');
const OrderService = require('../../src/services/OrderService');
const PaymentGateway = require('../../src/services/PaymentGateway');

describe('OrderService Integration & Mock Tests', () => {
  let orderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  test('should compute full order summary with discounts, tax, and shipping correctly', () => {
    const order = new Order('ORD-INT-1', 'david@test.com');
    order.addItem({ sku: 'ITEM-A', price: 100, quantity: 1 });
    order.addItem({ sku: 'ITEM-B', price: 50, quantity: 1 });

    // Subtotal = $150
    // Coupon SAVE10 = 10% of 150 = $15
    // Discounted subtotal = $135
    // Tax US_CA (8.25%) on 135 = $11.14
    // Shipping: $9.99 (since discounted subtotal <= 150)
    // Total = 135 + 11.14 + 9.99 = 156.13
    const summary = orderService.calculateOrderSummary(order, {
      couponCode: 'SAVE10',
      regionCode: 'US_CA',
    });

    expect(summary.subtotal).toBe(150.00);
    expect(summary.discounts.couponDiscount).toBe(15.00);
    expect(summary.discountedSubtotal).toBe(135.00);
    expect(summary.tax).toBe(11.14);
    expect(summary.shipping).toBe(9.99);
    expect(summary.total).toBe(156.13);
  });

  test('should qualify for free shipping when discounted subtotal exceeds $150', () => {
    const order = new Order('ORD-INT-2', 'sarah@test.com');
    order.addItem({ sku: 'EXPENSIVE-ITEM', price: 200, quantity: 1 });

    const summary = orderService.calculateOrderSummary(order);
    expect(summary.shipping).toBe(0);
    expect(summary.total).toBe(summary.discountedSubtotal + summary.tax);
  });

  test('should perform end-to-end checkout with valid payment method', async () => {
    const order = new Order('ORD-INT-3', 'checkout@test.com');
    order.addItem({ sku: 'PHONE', price: 500, quantity: 1 });

    const receipt = await orderService.checkout(order, {
      regionCode: 'US_TX',
      paymentMethod: {
        type: 'CREDIT_CARD',
        cardNumber: '4242424242424242',
      },
    });

    expect(order.status).toBe('COMPLETED');
    expect(receipt.status).toBe('COMPLETED');
    expect(receipt.orderId).toBe('ORD-INT-3');
    expect(receipt.transactionId).toBeDefined();
    expect(receipt.paidAmount).toBe(receipt.summary.total);
  });

  test('should reject checkout and update order status when card is declined', async () => {
    const order = new Order('ORD-INT-4', 'declined@test.com');
    order.addItem({ sku: 'BOOK', price: 30, quantity: 1 });

    await expect(
      orderService.checkout(order, {
        paymentMethod: {
          type: 'CREDIT_CARD',
          cardNumber: '4000000000000000',
        },
      })
    ).rejects.toThrow('Checkout failed: Card declined or invalid card number.');

    expect(order.status).toBe('PAYMENT_FAILED');
  });

  test('should handle mocked gateway downtime via jest.spyOn', async () => {
    const order = new Order('ORD-INT-5', 'mock@test.com');
    order.addItem({ sku: 'HEADPHONES', price: 80, quantity: 1 });

    // Mock payment gateway rejection/failure
    const paymentSpy = jest
      .spyOn(orderService.paymentGateway, 'processPayment')
      .mockResolvedValueOnce({
        success: false,
        error: 'Downstream payment network timeout (HTTP 504)',
      });

    await expect(
      orderService.checkout(order, {
        paymentMethod: { type: 'CREDIT_CARD', cardNumber: '4242424242424242' },
      })
    ).rejects.toThrow('Downstream payment network timeout');

    expect(paymentSpy).toHaveBeenCalledTimes(1);
    expect(order.status).toBe('PAYMENT_FAILED');

    paymentSpy.mockRestore();
  });

  test('should throw error when calculateOrderSummary receives non-Order or empty order', () => {
    expect(() => orderService.calculateOrderSummary(null)).toThrow('Invalid order instance.');
    const emptyOrder = new Order('ORD-EMPTY', 'empty@test.com');
    expect(() => orderService.calculateOrderSummary(emptyOrder)).toThrow('Cannot calculate summary for an empty order.');
  });
});
