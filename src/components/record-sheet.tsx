import { cn } from '@/lib/utils';

/**
 * A sheet of the record.
 *
 * Light stock on the dark desk. Everything that constitutes evidence — a
 * request, a decision, a custody chain — is rendered on one of these, so the
 * difference between the application chrome and the record itself is never
 * ambiguous.
 */
export function RecordSheet({
  className,
  children,
  sealed = false,
}: {
  className?: string;
  children: React.ReactNode;
  /** Draws the seal strip along the top edge. */
  sealed?: boolean;
}) {
  return (
    <div
      className={cn(
        'bg-record text-record-foreground relative overflow-hidden rounded-md',
        'shadow-[0_1px_2px_rgba(0,0,0,0.28),0_12px_28px_-12px_rgba(0,0,0,0.5)]',
        className,
      )}
    >
      {sealed && <div aria-hidden className="bg-pending absolute inset-x-0 top-0 h-[3px]" />}
      {children}
    </div>
  );
}

/** A hairline rule in the record's own ink, not the app's border colour. */
export function RecordRule({ className }: { className?: string }) {
  return <div aria-hidden className={cn('bg-record-rule h-px w-full', className)} />;
}

/**
 * A labelled field on a form. The label is small and set in mono, the way a
 * printed field caption sits above its box.
 */
export function RecordField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <dt className="text-record-foreground/55 font-mono text-[10px] tracking-[0.16em] uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-[13px] leading-snug break-words">{children}</dd>
    </div>
  );
}
