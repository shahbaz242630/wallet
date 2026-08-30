import { cn } from '@/lib/utils';
import type { Disposition } from '@/modules/demo/types';

/**
 * How a disposition is spoken and coloured.
 *
 * The word carries the meaning; colour only reinforces it. Nothing here is
 * distinguishable by colour alone.
 */
const DISPOSITIONS: Record<
  Disposition,
  { label: string; tone: string; border: string; dot: string; wash: string }
> = {
  awaiting: {
    label: 'Awaiting signature',
    tone: 'text-pending',
    border: 'border-pending/60',
    dot: 'bg-pending',
    wash: 'bg-pending/10',
  },
  allowed: {
    label: 'Allowed',
    tone: 'text-allowed',
    border: 'border-allowed/60',
    dot: 'bg-allowed',
    wash: 'bg-allowed/10',
  },
  settled: {
    label: 'Settled',
    tone: 'text-allowed',
    border: 'border-allowed/60',
    dot: 'bg-allowed',
    wash: 'bg-allowed/10',
  },
  denied: {
    label: 'Refused',
    tone: 'text-denied',
    border: 'border-denied/60',
    dot: 'bg-denied',
    wash: 'bg-denied/10',
  },
  expired: {
    label: 'Lapsed',
    tone: 'text-void',
    border: 'border-void/50',
    dot: 'bg-void',
    wash: 'bg-void/10',
  },
  refunded: {
    label: 'Reversed',
    tone: 'text-void',
    border: 'border-void/50',
    dot: 'bg-void',
    wash: 'bg-void/10',
  },
};

export function dispositionLabel(disposition: Disposition): string {
  return DISPOSITIONS[disposition].label;
}

/**
 * The inline mark used in dense lists. Quiet enough to scan a hundred rows,
 * loud enough that a refusal is never missed.
 */
export function DispositionMark({
  disposition,
  className,
}: {
  disposition: Disposition;
  className?: string;
}) {
  const style = DISPOSITIONS[disposition];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] whitespace-nowrap uppercase',
        style.tone,
        className,
      )}
    >
      <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', style.dot)} />
      {style.label}
    </span>
  );
}

/**
 * The stamp. Pressed onto a record once its disposition is settled, sitting
 * slightly off-square the way a real one lands.
 */
export function DispositionStamp({
  disposition,
  className,
}: {
  disposition: Disposition;
  className?: string;
}) {
  const style = DISPOSITIONS[disposition];
  return (
    <span
      className={cn(
        'inline-flex -rotate-[4deg] items-center rounded-[3px] border-2 px-3 py-1.5',
        'font-mono text-[11px] font-bold tracking-[0.2em] uppercase',
        'shadow-[inset_0_0_0_1px_currentColor]',
        style.tone,
        style.border,
        style.wash,
        className,
      )}
    >
      {style.label}
    </span>
  );
}
