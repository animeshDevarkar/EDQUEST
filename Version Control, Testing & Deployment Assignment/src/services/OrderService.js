const Order = require('../models/Order');
const TaxService = require('./TaxService');
const DiscountService = require('./DiscountService');
const PaymentGateway = require('./PaymentGateway');

/**
 * OrderService orchestrates order finalization, taxation, discount validation,
 * payment fulfillment, and receipt production.
 */
class OrderService {
  constructor({
    taxService = new TaxService(),
    discountService = new DiscountService(),
    paymentGateway = new PaymentGateway(),
  } = {}) {
    this.taxService = taxService;
    this.discountService = discountService;
    this.paymentGateway = paymentGateway;
  }

  calculateOrderSummary(order, { couponCode = null, regionCode = 'DEFAULT' } = {}) {
    if (!(order instanceof Order)) {
      throw new Error('Invalid order instance.');
    }

    if (order.items.length === 0) {
      throw new Error('Cannot calculate summary for an empty order.');
    }

    const subtotal = order.getSubtotal();
    const couponDiscount = this.discountService.calculateDiscount(subtotal, couponCode);
    const volumeDiscount = this.discountService.applyVolumeDiscount(subtotal, order.getItemCount());
    const totalDiscount = Number((couponDiscount + volumeDiscount).toFixed(2));

    const discountedSubtotal = Math.max(0, subtotal - totalDiscount);
    const tax = this.taxService.calculateTax(discountedSubtotal, regionCode);
    const shipping = discountedSubtotal > 150 ? 0 : 9.99;
    const total = Number((discountedSubtotal + tax + shipping).toFixed(2));

    return {
      orderId: order.id,
      customerEmail: order.customerEmail,
      itemCount: order.getItemCount(),
      subtotal,
      discounts: {
        couponDiscount,
        volumeDiscount,
        totalDiscount,
      },
      discountedSubtotal,
      tax,
      shipping,
      total,
      regionCode,
    };
  }

  async checkout(order, { couponCode = null, regionCode = 'DEFAULT', paymentMethod } = {}) {
    const summary = this.calculateOrderSummary(order, { couponCode, regionCode });

    const paymentResult = await this.paymentGateway.processPayment({
      orderId: order.id,
      amount: summary.total,
      paymentMethod,
    });

    if (!paymentResult.success) {
      order.status = 'PAYMENT_FAILED';
      throw new Error(`Checkout failed: ${paymentResult.error}`);
    }

    order.status = 'COMPLETED';

    return {
      orderId: order.id,
      status: order.status,
      transactionId: paymentResult.transactionId,
      paidAmount: paymentResult.amount,
      summary,
      timestamp: paymentResult.timestamp,
    };
  }
}

module.exports = OrderService;
