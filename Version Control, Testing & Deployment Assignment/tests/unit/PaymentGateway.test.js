const PaymentGateway = require('../../src/services/PaymentGateway');

describe('PaymentGateway (Unit Tests)', () => {
  let gateway;

  beforeEach(() => {
    gateway = new PaymentGateway();
  });

  test('should successfully process payment for valid credit card', async () => {
    const result = await gateway.processPayment({
      orderId: 'ORD-SUCCESS',
      amount: 120.50,
      paymentMethod: {
        type: 'CREDIT_CARD',
        cardNumber: '4242424242424242',
      },
    });

    expect(result.success).toBe(true);
    expect(result.amount).toBe(120.50);
    expect(result.transactionId).toMatch(/^txn_/);
    expect(result.currency).toBe('USD');
  });

  test('should decline card ending in 0000', async () => {
    const result = await gateway.processPayment({
      orderId: 'ORD-FAIL',
      amount: 80.00,
      paymentMethod: {
        type: 'CREDIT_CARD',
        cardNumber: '4000000000000000',
      },
    });

    expect(result.success).toBe(false);
    expect(result.transactionId).toBeNull();
    expect(result.error).toBe('Card declined or invalid card number.');
  });

  test('should throw error when amount or orderId is invalid', async () => {
    await expect(gateway.processPayment({ orderId: '', amount: 50 })).rejects.toThrow(
      'Payment processing failed: Invalid amount or order ID.'
    );
    await expect(gateway.processPayment({ orderId: 'ORD-1', amount: -10 })).rejects.toThrow(
      'Payment processing failed: Invalid amount or order ID.'
    );
    await expect(gateway.processPayment({ orderId: 'ORD-1', amount: 50, paymentMethod: null })).rejects.toThrow(
      'Payment processing failed: Valid payment method required.'
    );
  });

  test('should successfully refund a payment', async () => {
    const refund = await gateway.refundPayment('txn_12345', 50.00);
    expect(refund.success).toBe(true);
    expect(refund.refundId).toMatch(/^ref_/);
    expect(refund.originalTransactionId).toBe('txn_12345');
    expect(refund.amount).toBe(50.00);
  });

  test('should throw error when refunding without transaction ID', async () => {
    await expect(gateway.refundPayment('', 50.00)).rejects.toThrow(
      'Refund failed: Missing transaction ID.'
    );
  });
});
