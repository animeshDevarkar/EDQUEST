/**
 * Tax Service for computing jurisdictional sales tax.
 */
class TaxService {
  constructor(customRates = {}) {
    this.defaultRates = {
      US_CA: 0.0825,
      US_NY: 0.08875,
      US_TX: 0.0625,
      EU_DE: 0.19,
      EU_FR: 0.20,
      UK: 0.20,
      DEFAULT: 0.05,
      ...customRates,
    };
  }

  getTaxRate(regionCode) {
    if (!regionCode || typeof regionCode !== 'string') {
      return this.defaultRates.DEFAULT;
    }
    const normalized = regionCode.toUpperCase().trim();
    return this.defaultRates[normalized] !== undefined
      ? this.defaultRates[normalized]
      : this.defaultRates.DEFAULT;
  }

  calculateTax(amount, regionCode) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new Error('Invalid taxable amount: must be non-negative number.');
    }
    const rate = this.getTaxRate(regionCode);
    const tax = Math.round((amount * rate + Number.EPSILON) * 100) / 100;
    return tax;
  }
}

module.exports = TaxService;
