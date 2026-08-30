'use client';

import { Check, Palette } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { THEMES } from '@/lib/themes';

/** The four swatches that identify a palette at a glance. */
export function ThemeSwatch({ colors }: { colors: readonly string[] }) {
  return (
    <span aria-hidden className="border-border/60 flex overflow-hidden rounded-[3px] border">
      {colors.map((color, index) => (
        // Swatches are a fixed-length ordered tuple, and a palette may legitimately
        // repeat a colour, so position is the only stable identity here.
        <span key={index} className="size-3.5" style={{ background: color }} />
      ))}
    </span>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="border-border hover:bg-accent focus-visible:ring-ring inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Change palette"
      >
        <Palette className="size-3.5" />
        <ThemeSwatch colors={THEMES.find((t) => t.id === theme)?.swatch ?? []} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="font-mono text-[10px] tracking-[0.16em] uppercase">
          Palette
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((definition) => (
          <DropdownMenuItem
            key={definition.id}
            onSelect={() => setTheme(definition.id)}
            className="flex items-start gap-3 py-2"
          >
            <ThemeSwatch colors={definition.swatch} />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-medium">{definition.name}</span>
              <span className="text-muted-foreground block text-[11px] leading-snug">
                {definition.lineage}
              </span>
            </span>
            {definition.id === theme && <Check className="mt-0.5 size-4 shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
