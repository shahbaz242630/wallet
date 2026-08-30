import { describe, it, expect } from 'vitest';
import {
  money,
  add,
  subtract,
  compare,
  isGreaterThan,
  parseMajorUnits,
  formatMoney,
  exponentFor,
  CurrencyMismatchError,
} from './money';

describe('money', () => {
  it('stores whole minor units', () => {
    expect(money(1050, 'GBP').minorUnits).toBe(1050n);
  });

  it('uppercases the currency code', () => {
    expect(money(100, 'gbp').currency).toBe('GBP');
  });

  it('rejects fractional minor units', () => {
    expect(() => money(10.5, 'GBP')).toThrow(TypeError);
  });

  it('rejects a malformed currency code', () => {
    expect(() => money(100, 'POUNDS')).toThrow(TypeError);
  });
});

describe('arithmetic', () => {
  it('does not suffer floating point drift', () => {
    // 0.1 + 0.2 !== 0.3 as floats. As minor units it is exact.
    const total = add(parseMajorUnits('0.10', 'GBP'), parseMajorUnits('0.20', 'GBP'));
    expect(total.minorUnits).toBe(30n);
    expect(total).toEqual(parseMajorUnits('0.30', 'GBP'));
  });

  it('adds and subtracts', () => {
    expect(add(money(1000, 'GBP'), money(250, 'GBP')).minorUnits).toBe(1250n);
    expect(subtract(money(1000, 'GBP'), money(250, 'GBP')).minorUnits).toBe(750n);
  });

  it('refuses to mix currencies', () => {
    expect(() => add(money(100, 'GBP'), money(100, 'AED'))).toThrow(CurrencyMismatchError);
    expect(() => compare(money(100, 'GBP'), money(100, 'USD'))).toThrow(CurrencyMismatchError);
  });

  it('compares amounts', () => {
    expect(isGreaterThan(money(500, 'AED'), money(499, 'AED'))).toBe(true);
    expect(compare(money(100, 'AED'), money(100, 'AED'))).toBe(0);
  });

  it('handles very large amounts without precision loss', () => {
    const huge = money(9_007_199_254_740_993n, 'GBP'); // beyond Number.MAX_SAFE_INTEGER
    expect(add(huge, money(1, 'GBP')).minorUnits).toBe(9_007_199_254_740_994n);
  });
});

describe('currency exponents', () => {
  it('defaults to 2 decimal places', () => {
    expect(exponentFor('GBP')).toBe(2);
    expect(exponentFor('AED')).toBe(2);
  });

  it('knows zero-decimal currencies', () => {
    expect(exponentFor('JPY')).toBe(0);
    expect(parseMajorUnits('1000', 'JPY').minorUnits).toBe(1000n);
  });

  it('knows three-decimal currencies', () => {
    expect(exponentFor('KWD')).toBe(3);
    expect(parseMajorUnits('1.500', 'KWD').minorUnits).toBe(1500n);
  });
});

describe('parseMajorUnits', () => {
  it('parses whole and fractional input', () => {
    expect(parseMajorUnits('10', 'GBP').minorUnits).toBe(1000n);
    expect(parseMajorUnits('10.5', 'GBP').minorUnits).toBe(1050n);
    expect(parseMajorUnits('10.50', 'GBP').minorUnits).toBe(1050n);
  });

  it('strips thousands separators', () => {
    expect(parseMajorUnits('1,234.56', 'GBP').minorUnits).toBe(123456n);
  });

  it('handles negatives', () => {
    expect(parseMajorUnits('-5.00', 'GBP').minorUnits).toBe(-500n);
  });

  it('rejects too many decimal places for the currency', () => {
    expect(() => parseMajorUnits('1.005', 'GBP')).toThrow(TypeError);
    expect(() => parseMajorUnits('1.5', 'JPY')).toThrow(TypeError);
  });

  it('rejects nonsense', () => {
    expect(() => parseMajorUnits('ten pounds', 'GBP')).toThrow(TypeError);
    expect(() => parseMajorUnits('', 'GBP')).toThrow(TypeError);
  });
});

describe('formatMoney', () => {
  it('formats for display', () => {
    expect(formatMoney(money(1050, 'GBP'))).toContain('10.50');
    expect(formatMoney(money(500000, 'AED'))).toContain('5,000.00');
  });

  it('formats zero-decimal currencies without decimals', () => {
    expect(formatMoney(money(1000, 'JPY'))).not.toContain('.');
  });
});
