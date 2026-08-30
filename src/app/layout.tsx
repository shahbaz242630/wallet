import type { Metadata } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  variable: '--font-mono-record',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Agent Wallet',
  description:
    'Give an AI agent a budget, not your card. Set the rules once, approve what matters, and see why every payment was allowed.',
};

/**
 * The direction contract for this build, emitted into the markup so the shipped
 * page can be audited against what it committed to. Grep the build output for
 * the seed key to confirm it survived.
 */
const DIRECTION_CONTRACT = [
  'THESIS: Authority over money is a custody chain, not a dashboard. Refuses this category’s balance-card-and-donut arrangement.',
  'OWN-WORLD: Ink-dark desk, warm off-white record sheets, one signal colour struck like a seal. Hairline rules, sequence numbers, stamped dispositions, struck-through voids. Archivo with JetBrains Mono; tabular figures everywhere money appears.',
  'STORY: The operator sees what needs their authority, signs it, and can afterwards reconstruct exactly why any payment was allowed or refused.',
  'FIRST VIEWPORT: Dark rail left. Centred record sheet headed by workspace and date. Pinned unsealed request at the top, amount in large tabular figures, empty countersignature block bottom-right. Numbered docket beneath it.',
  'FORM: Custody Record — candidate 4 of the grounded list; seed key 92aacc89.',
  'FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md',
].join('\n');

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${archivo.variable} ${mono.variable} font-sans antialiased`}>
        {/* Applies the stored palette before React hydrates, so no flash. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <div hidden data-direction-contract="92aacc89">
          {DIRECTION_CONTRACT}
        </div>
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
