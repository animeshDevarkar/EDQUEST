/**
 * Discount Service for applying coupons, seasonal sales, and loyalty discounts.
 */
class DiscountService {
  constructor() {
    this.coupons = new Map([
      ['SAVE10', { type: 'PERCENTAGE', value: 10, minSpend: 20 }],
      ['SAVE25', { type: 'PERCENTAGE', value: 25, minSpend: 100 }],
      ['FLAT15', { type: 'FIXED', value: 15, minSpend: 50 }],
      ['FREESHIP', { type: 'SHIPPING', value: 100, minSpend: 0 }],
      ['VIP50', { type: 'FIXED', value: 50, minSpend: 200 }],
    ]);
  }

  addCoupon(code, couponData) {
    if (!code || !couponData || typeof couponData.value !== 'number') {
      throw new Error('Invalid coupon definition.');
    }
    this.coupons.set(code.toUpperCase().trim(), couponData);
  }

  calculateDiscount(subtotal, couponCode) {
    if (typeof subtotal !== 'number' || subtotal < 0) {
      throw new Error('Invalid subtotal for discount calculation.');
    }

    if (!couponCode) {
      return 0;
    }

    const coupon = this.coupons.get(couponCode.toUpperCase().trim());
    if (!coupon) {
      throw new Error(`Invalid or expired coupon code: ${couponCode}`);
    }

    if (subtotal < coupon.minSpend) {
      throw new Error(
        `Coupon ${couponCode} requires a minimum purchase of $${coupon.minSpend.toFixed(2)}.`
      );
    }

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'FIXED') {
      discount = Math.min(coupon.value, subtotal);
    }

    return Number(discount.toFixed(2));
  }

  applyVolumeDiscount(subtotal, totalItemCount) {
    if (totalItemCount >= 10) {
      return Number((subtotal * 0.05).toFixed(2)); // 5% bulk discount
    }
    return 0;
  }

  getLoyaltyDiscount(subtotal, tier) {
    if (!tier || typeof tier !== 'string') return 0;
    const tierRates = {
      SILVER: 0.03, // 3%
      GOLD: 0.07,   // 7%
      PLATINUM: 0.12 // 12%
    };
    const rate = tierRates[tier.toUpperCase().trim()] || 0;
    return Number((subtotal * rate).toFixed(2));
  }
}

module.exports = DiscountService;
