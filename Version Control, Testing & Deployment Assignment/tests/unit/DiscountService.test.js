const DiscountService = require('../../src/services/DiscountService');

describe('DiscountService (Unit Tests)', () => {
  let discountService;

  beforeEach(() => {
    discountService = new DiscountService();
  });

  test('should return 0 discount when no coupon is provided', () => {
    expect(discountService.calculateDiscount(100, null)).toBe(0);
    expect(discountService.calculateDiscount(100, '')).toBe(0);
  });

  test('should apply percentage coupon correctly (SAVE10)', () => {
    const discount = discountService.calculateDiscount(50, 'SAVE10');
    expect(discount).toBe(5.00);
  });

  test('should apply percentage coupon correctly (SAVE25)', () => {
    const discount = discountService.calculateDiscount(200, 'SAVE25');
    expect(discount).toBe(50.00);
  });

  test('should apply fixed coupon correctly (FLAT15)', () => {
    const discount = discountService.calculateDiscount(60, 'FLAT15');
    expect(discount).toBe(15.00);
  });

  test('should throw error if coupon does not meet minimum spend', () => {
    expect(() => discountService.calculateDiscount(15, 'SAVE10')).toThrow(
      'Coupon SAVE10 requires a minimum purchase of $20.00'
    );
  });

  test('should throw error for non-existent coupon', () => {
    expect(() => discountService.calculateDiscount(100, 'INVALIDCODE')).toThrow(
      'Invalid or expired coupon code: INVALIDCODE'
    );
  });

  test('should allow dynamic registration of custom coupon', () => {
    discountService.addCoupon('FLASH50', { type: 'PERCENTAGE', value: 50, minSpend: 10 });
    const discount = discountService.calculateDiscount(100, 'FLASH50');
    expect(discount).toBe(50.00);
  });

  test('should calculate bulk volume discount when item count >= 10', () => {
    expect(discountService.applyVolumeDiscount(100, 10)).toBe(5.00);
    expect(discountService.applyVolumeDiscount(100, 9)).toBe(0);
  });

  test('should throw error when adding invalid coupon definition', () => {
    expect(() => discountService.addCoupon('', null)).toThrow('Invalid coupon definition.');
    expect(() => discountService.addCoupon('TEST', { value: 'not-number' })).toThrow('Invalid coupon definition.');
  });

  test('should throw error when subtotal is negative or invalid', () => {
    expect(() => discountService.calculateDiscount(-10, 'SAVE10')).toThrow('Invalid subtotal');
    expect(() => discountService.calculateDiscount('abc', 'SAVE10')).toThrow('Invalid subtotal');
  });

  test('should calculate loyalty discounts for recognized tiers', () => {
    expect(discountService.getLoyaltyDiscount(100, 'SILVER')).toBe(3.00);
    expect(discountService.getLoyaltyDiscount(100, 'GOLD')).toBe(7.00);
    expect(discountService.getLoyaltyDiscount(100, 'PLATINUM')).toBe(12.00);
  });

  test('should return 0 loyalty discount for unknown tier or null', () => {
    expect(discountService.getLoyaltyDiscount(100, 'BRONZE')).toBe(0);
    expect(discountService.getLoyaltyDiscount(100, null)).toBe(0);
  });
});
