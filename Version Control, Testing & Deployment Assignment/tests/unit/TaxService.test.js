const TaxService = require('../../src/services/TaxService');

describe('TaxService (Unit Tests)', () => {
  let taxService;

  beforeEach(() => {
    taxService = new TaxService();
  });

  test('should return correct tax rates for recognized regions', () => {
    expect(taxService.getTaxRate('US_CA')).toBe(0.0825);
    expect(taxService.getTaxRate('US_TX')).toBe(0.0625);
    expect(taxService.getTaxRate('EU_DE')).toBe(0.19);
    expect(taxService.getTaxRate('UK')).toBe(0.20);
  });

  test('should fallback to default tax rate for unknown or null region', () => {
    expect(taxService.getTaxRate('UNKNOWN_REGION')).toBe(0.05);
    expect(taxService.getTaxRate(null)).toBe(0.05);
    expect(taxService.getTaxRate('')).toBe(0.05);
  });

  test('should calculate tax rounded to two decimal places', () => {
    const taxCA = taxService.calculateTax(100, 'US_CA');
    expect(taxCA).toBe(8.25);

    const taxDE = taxService.calculateTax(250.50, 'EU_DE');
    expect(taxDE).toBe(47.60);
  });

  test('should support custom tax rates passed in constructor', () => {
    const customTaxService = new TaxService({ APAC_JP: 0.10 });
    expect(customTaxService.getTaxRate('APAC_JP')).toBe(0.10);
    expect(customTaxService.calculateTax(100, 'APAC_JP')).toBe(10.00);
  });

  test('should throw error for invalid taxable amount', () => {
    expect(() => taxService.calculateTax(-10, 'US_CA')).toThrow('Invalid taxable amount');
    expect(() => taxService.calculateTax('hundred', 'US_CA')).toThrow('Invalid taxable amount');
  });
});
