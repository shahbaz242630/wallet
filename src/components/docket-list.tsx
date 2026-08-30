import Link from 'next/link';
import { DispositionMark } from '@/components/disposition';
import { usd, formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { getAgent } from '@/modules/demo/queries';
import type { SpendRequest } from '@/modules/demo/types';

/**
 * The docket: every request in sequence, newest at the top.
 *
 * Sequence numbers are shown because they are the point — the record is
 * continuous, and a gap in it would be visible.
 */
export function DocketList({
  requests,
  workspaceId,
  className,
}: {
  requests: SpendRequest[];
  workspaceId: string;
  className?: string;
}) {
  if (requests.length === 0) {
    return (
      <p className="text-muted-foreground px-4 py-10 text-center text-[13px]">
        Nothing on the docket yet.
      </p>
    );
  }

  return (
    <ul className={cn('divide-border divide-y', className)}>
      {requests.map((request) => {
        const agent = getAgent(request.agentId);
        const voided = request.disposition === 'denied' || request.disposition === 'expired';

        return (
          <li key={request.id}>
            <Link
              href={`/w/${workspaceId}/activity/${request.id}`}
              className="hover:bg-accent/60 focus-visible:ring-ring grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 transition-colors focus-visible:ring-2 focus-visible:-outline-offset-2 focus-visible:outline-none sm:grid-cols-[3.5rem_1fr_auto_10rem]"
            >
              <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                {String(request.seq).padStart(4, '0')}
              </span>

              <span className="col-start-2 min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span
                    className={cn(
                      'truncate text-[14px] font-medium',
                      voided && 'text-muted-foreground struck',
                    )}
                  >
                    {request.merchant}
                  </span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {agent?.name ?? 'Unknown agent'}
                  </span>
                </span>
                <span className="text-muted-foreground mt-0.5 block truncate text-[12px]">
                  {request.purpose}
                </span>
              </span>

              <span
                className={cn(
                  'col-start-3 row-start-1 text-right font-mono text-[14px] font-semibold tabular-nums',
                  voided && 'text-muted-foreground struck',
                )}
              >
                {usd(request.amountMinor, request.currency)}
              </span>

              <span className="col-span-3 flex items-center justify-between gap-3 sm:col-span-1 sm:col-start-4 sm:justify-end">
                <DispositionMark disposition={request.disposition} />
                <span className="text-muted-foreground font-mono text-[10px] tabular-nums sm:hidden">
                  {formatDateTime(request.requestedAt)}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
