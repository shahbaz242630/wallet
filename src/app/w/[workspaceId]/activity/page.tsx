import { notFound } from 'next/navigation';
import { DocketList } from '@/components/docket-list';
import { usd } from '@/lib/format';
import { getWorkspace, listRequests } from '@/modules/demo/queries';
import type { Disposition } from '@/modules/demo/types';

const SUMMARY_ORDER: Disposition[] = ['awaiting', 'settled', 'denied', 'expired', 'refunded'];

const SUMMARY_LABEL: Record<Disposition, string> = {
  awaiting: 'awaiting',
  allowed: 'allowed',
  settled: 'settled',
  denied: 'refused',
  expired: 'lapsed',
  refunded: 'reversed',
};

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspace(workspaceId);
  if (!workspace) notFound();

  const requests = listRequests(workspaceId);
  const settledTotal = requests
    .filter((request) => request.disposition === 'settled')
    .reduce((sum, request) => sum + request.amountMinor, 0);

  const counts = SUMMARY_ORDER.map((disposition) => ({
    disposition,
    count: requests.filter((request) => request.disposition === disposition).length,
  })).filter((entry) => entry.count > 0);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <header>
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
          Activity
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold tracking-tight sm:text-[30px]">
          The full record
        </h1>
        <p className="text-muted-foreground mt-2 max-w-prose text-[14px] leading-relaxed">
          Every request an agent has made, in sequence. Entries are never edited or removed — a
          refusal or a reversal is added as a new line, so the numbering stays continuous.
        </p>
      </header>

      <div className="text-muted-foreground mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] tabular-nums">
        <span>
          <span className="text-foreground font-semibold">{requests.length}</span> entries
        </span>
        <span>
          <span className="text-foreground font-semibold">{usd(settledTotal)}</span> settled
        </span>
        {counts.map(({ disposition, count }) => (
          <span key={disposition}>
            <span className="text-foreground font-semibold">{count}</span>{' '}
            {SUMMARY_LABEL[disposition]}
          </span>
        ))}
      </div>

      <div className="border-border mt-4 overflow-hidden rounded-md border">
        <DocketList requests={requests} workspaceId={workspaceId} />
      </div>
    </div>
  );
}
