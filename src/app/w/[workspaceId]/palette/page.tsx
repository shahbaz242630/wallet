'use client';

import { Check } from 'lucide-react';
import { DispositionMark, DispositionStamp } from '@/components/disposition';
import { RecordField, RecordRule, RecordSheet } from '@/components/record-sheet';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { THEMES } from '@/lib/themes';
import { cn } from '@/lib/utils';

export default function PalettePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <header>
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
          Palette
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold tracking-tight sm:text-[30px]">
          Try the colours
        </h1>
        <p className="text-muted-foreground mt-2 max-w-prose text-[14px] leading-relaxed">
          Pick one and the whole app changes immediately. Your choice is remembered on this browser,
          so the demo opens the way you left it. Everything below updates live, so you can judge a
          palette on the real screens rather than on swatches.
        </p>
      </header>

      {/* The choices */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {THEMES.map((definition) => {
          const active = definition.id === theme;
          return (
            <button
              key={definition.id}
              type="button"
              onClick={() => setTheme(definition.id)}
              aria-pressed={active}
              className={cn(
                'group border-border bg-card focus-visible:ring-ring rounded-md border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
                active ? 'border-primary ring-primary/30 ring-1' : 'hover:border-foreground/25',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="flex items-center gap-2 text-[16px] leading-tight font-semibold">
                    {definition.name}
                    {active && <Check className="text-primary size-4 shrink-0" />}
                  </h2>
                  <p className="text-muted-foreground mt-0.5 font-mono text-[10px] tracking-[0.12em] uppercase">
                    {definition.mode}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="border-border/60 flex shrink-0 overflow-hidden rounded-[4px] border"
                >
                  {definition.swatch.map((color, index) => (
                    <span key={index} className="size-7" style={{ background: color }} />
                  ))}
                </span>
              </div>
              <p className="text-muted-foreground mt-3 text-[12px] leading-relaxed italic">
                {definition.lineage}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed">{definition.blurb}</p>
            </button>
          );
        })}
      </div>

      {/* Live preview of the pieces that matter */}
      <section className="mt-10">
        <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase">
          How it looks on the real thing
        </h2>

        <div className="mt-4 grid gap-5 lg:grid-cols-2">
          <RecordSheet sealed>
            <div className="px-5 pt-4 pb-3">
              <span className="font-mono text-[12px] font-semibold tracking-[0.1em] tabular-nums">
                SR-2026-0148
              </span>
            </div>
            <RecordRule />
            <div className="flex items-start justify-between gap-4 px-5 py-5">
              <div className="min-w-0">
                <p className="text-record-foreground/55 font-mono text-[10px] tracking-[0.16em] uppercase">
                  Claude Code · Anthropic wants to pay
                </p>
                <p className="mt-1.5 text-[20px] leading-tight font-semibold">GitHub</p>
              </div>
              <p className="shrink-0 font-mono text-[30px] leading-none font-bold tracking-tight tabular-nums">
                $120.00
              </p>
            </div>
            <RecordRule />
            <dl className="grid grid-cols-2 gap-4 px-5 py-4">
              <RecordField label="Wallet">Build &amp; Infrastructure</RecordField>
              <RecordField label="Policy version">v4</RecordField>
            </dl>
            <RecordRule />
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <DispositionStamp disposition="awaiting" />
              <Button
                size="sm"
                className="bg-record-foreground text-record hover:bg-record-foreground/90 font-semibold"
              >
                Countersign
              </Button>
            </div>
          </RecordSheet>

          <div className="space-y-5">
            <div className="border-border bg-card rounded-md border p-4">
              <p className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
                Every state
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2.5">
                <DispositionMark disposition="awaiting" />
                <DispositionMark disposition="settled" />
                <DispositionMark disposition="denied" />
                <DispositionMark disposition="expired" />
                <DispositionMark disposition="refunded" />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <DispositionStamp disposition="allowed" />
                <DispositionStamp disposition="denied" />
              </div>
            </div>

            <div className="border-border bg-card rounded-md border p-4">
              <p className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
                Controls
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button size="sm">Countersign</Button>
                <Button size="sm" variant="outline">
                  Refuse
                </Button>
                <Button size="sm" variant="ghost">
                  Cancel
                </Button>
                <Button size="sm" className="bg-denied hover:bg-denied/90 text-white">
                  Freeze everything
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
                  Budget used
                </p>
                <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
                  <div className="bg-primary h-full w-[43%] rounded-full" />
                </div>
              </div>
            </div>

            <div className="border-border bg-card rounded-md border p-4">
              <p className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
                Type
              </p>
              <p className="mt-2 text-[22px] leading-tight font-semibold tracking-tight">
                Give an agent a budget, not your card
              </p>
              <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">
                Archivo for everything a person reads.
              </p>
              <p className="mt-3 font-mono text-[13px] tabular-nums">
                SR-2026-0148 · $120.00 · v4 · 14:22
              </p>
              <p className="text-muted-foreground mt-1 text-[12px] leading-relaxed">
                JetBrains Mono for anything a machine produced — record numbers, amounts,
                timestamps. Figures are tabular so columns never jump.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
