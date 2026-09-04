/**
 * External Payment Gateway Mock Interface.
 * In a real-world system, this connects to Stripe, PayPal, or Square.
 */
class PaymentGateway {
  constructor(apiKey = 'test_secret_key') {
    this.apiKey = apiKey;
  }

  async processPayment({ orderId, amount, paymentMethod }) {
    if (!orderId || !amount || amount <= 0) {
      throw new Error('Payment processing failed: Invalid amount or order ID.');
    }

    if (!paymentMethod || !paymentMethod.type) {
      throw new Error('Payment processing failed: Valid payment method required.');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 20));

    // Simulated card validation
    if (paymentMethod.type === 'CREDIT_CARD') {
      if (!paymentMethod.cardNumber || paymentMethod.cardNumber.endsWith('0000')) {
        return {
          success: false,
          transactionId: null,
          error: 'Card declined or invalid card number.',
        };
      }
    }

    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      amount,
      currency: 'USD',
      timestamp: new Date().toISOString(),
    };
  }

  async refundPayment(transactionId, amount) {
    if (!transactionId) {
      throw new Error('Refund failed: Missing transaction ID.');
    }
    return {
      success: true,
      refundId: `ref_${Date.now()}`,
      originalTransactionId: transactionId,
      amount,
    };
  }
}

module.exports = PaymentGateway;
