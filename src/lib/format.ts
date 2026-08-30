import { formatMoney, money } from '@/modules/shared/money';

/**
 * Display helpers. All deliberately deterministic: the same input renders the
 * same string on the server and in the browser, so nothing flickers on
 * hydration and the demo looks identical every time it is shown.
 */

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export function usd(amountMinor: number, currency = 'USD'): string {
  return formatMoney(money(amountMinor, currency), 'en-US');
}

/** "30 Aug 2026" */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** "14:22" — 24 hour, so an audit trail is never ambiguous. */
export function formatTime(iso: string): string {
  const date = new Date(iso);
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/** "30 Aug 2026 · 14:22" */
export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

/**
 * Time elapsed against a fixed "now".
 *
 * The demo is frozen at a moment so the copy stays stable however long the
 * meeting runs. A live product would use the real clock.
 */
export const DEMO_NOW = new Date('2026-08-30T15:40:00Z');

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const minutes = Math.round((DEMO_NOW.getTime() - then) / 60_000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;

  return formatDate(iso);
}

/** How much of a budget is used, clamped for display. */
export function percentUsed(spentMinor: number, limitMinor: number): number {
  if (limitMinor <= 0) return 0;
  return Math.min(100, Math.round((spentMinor / limitMinor) * 100));
}
