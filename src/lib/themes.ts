/**
 * The palettes the demo can wear. Each is a complete world, not an accent
 * swap: ground, record stock, and the colour authority is struck in.
 *
 * State colours stay constant in meaning across every theme — allowed, denied,
 * awaiting — so an operator never has to relearn what a colour means.
 */

export type ThemeId = 'seal' | 'stamp' | 'verdigris' | 'signal' | 'document';

export type ThemeMode = 'dark' | 'light';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  mode: ThemeMode;
  /** One line on what this palette is drawn from. */
  lineage: string;
  /** Why it might be the right choice — plain language, for the picker. */
  blurb: string;
  /** Display swatches for the picker. Order: ground, panel, signal, record. */
  swatch: [string, string, string, string];
}

export const THEMES: readonly ThemeDefinition[] = [
  {
    id: 'seal',
    name: 'Amber Seal',
    mode: 'dark',
    lineage: 'Brass seals and stamped dispositions on ink-dark stock.',
    blurb:
      'Warm and serious. Amber reads as authority and caution without shouting, and almost nobody in payments uses it — so it looks like us rather than like everyone else.',
    swatch: [
      'oklch(0.155 0.008 265)',
      'oklch(0.195 0.009 265)',
      'oklch(0.79 0.135 79)',
      'oklch(0.965 0.008 85)',
    ],
  },
  {
    id: 'stamp',
    name: 'Violet Stamp',
    mode: 'dark',
    lineage: 'Rubber-stamp ink pressed into a countersigned form.',
    blurb:
      'The most official-looking of the set. Reads as records and authority. The risk is that violet is close to the purple half the fintech world already uses.',
    swatch: [
      'oklch(0.152 0.014 300)',
      'oklch(0.196 0.017 300)',
      'oklch(0.66 0.175 305)',
      'oklch(0.965 0.006 300)',
    ],
  },
  {
    id: 'verdigris',
    name: 'Verdigris',
    mode: 'dark',
    lineage: 'Aged copper and oxidised brass on cold steel.',
    blurb:
      'Cool, institutional and calm. Distinct from the bright green Stripe Link uses, but close enough that some people will still make the comparison.',
    swatch: [
      'oklch(0.148 0.012 200)',
      'oklch(0.19 0.014 200)',
      'oklch(0.75 0.105 183)',
      'oklch(0.963 0.006 190)',
    ],
  },
  {
    id: 'signal',
    name: 'Signal Blue',
    mode: 'dark',
    lineage: 'Instrument panels and signalling lamps.',
    blurb:
      'The safe choice. Confident and neutral, nobody will dislike it. Also the single most used colour in financial software, so it wins no memory.',
    swatch: [
      'oklch(0.15 0.014 262)',
      'oklch(0.193 0.016 262)',
      'oklch(0.68 0.155 250)',
      'oklch(0.966 0.005 262)',
    ],
  },
  {
    id: 'document',
    name: 'Document',
    mode: 'light',
    lineage: 'Carbonless copy stock under office light.',
    blurb:
      'The light version, for a bright room or a printed handout. The whole surface becomes the record rather than the desk it sits on.',
    swatch: [
      'oklch(0.955 0.006 85)',
      'oklch(0.995 0.003 85)',
      'oklch(0.46 0.14 288)',
      'oklch(0.995 0.003 85)',
    ],
  },
] as const;

export const DEFAULT_THEME: ThemeId = 'seal';

export const THEME_STORAGE_KEY = 'agent-wallet-theme';

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && THEMES.some((theme) => theme.id === value);
}

export function getTheme(id: ThemeId): ThemeDefinition {
  const found = THEMES.find((theme) => theme.id === id);
  if (!found) throw new Error(`Unknown theme: ${id}`);
  return found;
}
