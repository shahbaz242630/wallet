/**
 * Money is stored as integer minor units (pence, cents, fils) and never as a
 * float. `0.1 + 0.2 !== 0.3` in JavaScript, and a payment platform cannot
 * afford that. All arithmetic here uses bigint.
 */

/** Currencies whose minor unit is not 1/100. Everything else defaults to 2. */
const CURRENCY_EXPONENTS: Record<string, number> = {
  JPY: 0,
  KRW: 0,
  VND: 0,
  BHD: 3,
  KWD: 3,
  OMR: 3,
  TND: 3,
};

const DEFAULT_EXPONENT = 2;

export type CurrencyCode = string;

export interface Money {
  /** Amount in minor units. 1050n GBP = £10.50 */
  readonly minorUnits: bigint;
  /** ISO 4217 code, uppercase. */
  readonly currency: CurrencyCode;
}

export class CurrencyMismatchError extends Error {
  constructor(a: CurrencyCode, b: CurrencyCode) {
    super(`Cannot combine ${a} with ${b}. Convert explicitly with a recorded FX quote.`);
    this.name = 'CurrencyMismatchError';
  }
}

export function exponentFor(currency: CurrencyCode): number {
  return CURRENCY_EXPONENTS[currency.toUpperCase()] ?? DEFAULT_EXPONENT;
}

export function money(minorUnits: bigint | number, currency: CurrencyCode): Money {
  if (typeof minorUnits === 'number' && !Number.isInteger(minorUnits)) {
    throw new TypeError(
      `Money must be whole minor units, got ${minorUnits}. Use minor units (1050 = £10.50).`,
    );
  }
  const code = currency.toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) {
    throw new TypeError(`Currency must be a 3-letter ISO code, got "${currency}".`);
  }
  return Object.freeze({ minorUnits: BigInt(minorUnits), currency: code });
}

function assertSameCurrency(a: Money, b: Money): void {
  if (a.currency !== b.currency) throw new CurrencyMismatchError(a.currency, b.currency);
}

export function add(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.minorUnits + b.minorUnits, a.currency);
}

export function subtract(a: Money, b: Money): Money {
  assertSameCurrency(a, b);
  return money(a.minorUnits - b.minorUnits, a.currency);
}

export function compare(a: Money, b: Money): -1 | 0 | 1 {
  assertSameCurrency(a, b);
  if (a.minorUnits < b.minorUnits) return -1;
  if (a.minorUnits > b.minorUnits) return 1;
  return 0;
}

export const isGreaterThan = (a: Money, b: Money): boolean => compare(a, b) === 1;
export const isLessThan = (a: Money, b: Money): boolean => compare(a, b) === -1;
export const isEqual = (a: Money, b: Money): boolean => compare(a, b) === 0;
export const isZero = (a: Money): boolean => a.minorUnits === 0n;
export const isNegative = (a: Money): boolean => a.minorUnits < 0n;

/** Parse a human-entered major-unit string ("10.50") without touching floats. */
export function parseMajorUnits(input: string, currency: CurrencyCode): Money {
  const exponent = exponentFor(currency);
  const trimmed = input.trim().replace(/,/g, '');
  const match = /^(-)?(\d+)(?:\.(\d+))?$/.exec(trimmed);
  if (!match) throw new TypeError(`"${input}" is not a valid amount.`);

  const [, sign, whole, fraction = ''] = match;
  if (fraction.length > exponent) {
    throw new TypeError(
      `${currency} supports ${exponent} decimal place(s); "${input}" has ${fraction.length}.`,
    );
  }
  const padded = fraction.padEnd(exponent, '0');
  const combined = BigInt(whole) * 10n ** BigInt(exponent) + BigInt(padded || '0');
  return money(sign ? -combined : combined, currency);
}

/** Display only. Never feed the result back into arithmetic. */
export function formatMoney(value: Money, locale = 'en-GB'): string {
  const exponent = exponentFor(value.currency);
  const divisor = 10n ** BigInt(exponent);
  const negative = value.minorUnits < 0n;
  const absolute = negative ? -value.minorUnits : value.minorUnits;
  const whole = absolute / divisor;
  const fraction = (absolute % divisor).toString().padStart(exponent, '0');
  const major = exponent === 0 ? whole.toString() : `${whole}.${fraction}`;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: value.currency,
      minimumFractionDigits: exponent,
      maximumFractionDigits: exponent,
    }).format(Number(major) * (negative ? -1 : 1));
  } catch {
    return `${negative ? '-' : ''}${major} ${value.currency}`;
  }
}
