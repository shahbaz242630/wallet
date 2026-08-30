import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { CountersignCard } from '@/components/countersign-card';
import { DocketList } from '@/components/docket-list';
import { usd, formatDate, percentUsed, DEMO_NOW } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  getAgent,
  getTotals,
  getWorkspace,
  listAwaiting,
  listRequests,
  resolveMatchedRules,
} from '@/modules/demo/queries';

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspace(workspaceId);
  if (!workspace) notFound();

  const totals = getTotals(workspaceId);
  const awaiting = listAwaiting(workspaceId);
  const recent = listRequests(workspaceId).slice(0, 8);
  const used = percentUsed(totals.spentMinor, totals.limitMinor);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      {/* Docket head */}
      <header>
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
          Docket · {formatDate(DEMO_NOW.toISOString())}
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold tracking-tight sm:text-[30px]">
          {workspace.name}
        </h1>
      </header>

      {/* Figures. Hairline-separated, not a row of rounded tiles. */}
      <dl className="border-border bg-border mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border sm:grid-cols-4">
        <Figure
          label="Spent this month"
          value={usd(totals.spentMinor, totals.currency)}
          note={`of ${usd(totals.limitMinor, totals.currency)} · ${used}%`}
          bar={used}
        />
        <Figure
          label="Awaiting you"
          value={String(totals.awaitingCount)}
          note={
            totals.awaitingCount > 0
              ? usd(totals.awaitingMinor, totals.currency)
              : 'nothing to sign'
          }
          emphasis={totals.awaitingCount > 0}
        />
        <Figure
          label="Agents active"
          value={String(totals.activeAgents)}
          note="with a live grant"
        />
        <Figure
          label="Refused"
          value={String(totals.deniedThisMonth)}
          note="blocked by your rules"
        />
      </dl>

      {/* What needs a signature */}
      {awaiting.length > 0 && (
        <section className="mt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase">
              Held for your signature
            </h2>
            {awaiting.length > 1 && (
              <Link
                href={`/w/${workspaceId}/approvals`}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
              >
                All {awaiting.length}
                <ArrowRight className="size-3" />
              </Link>
            )}
          </div>

          <div className="mt-3 space-y-4">
            {awaiting.slice(0, 1).map((request) => {
              const agent = getAgent(request.agentId);
              if (!agent) return null;
              return (
                <CountersignCard
                  key={request.id}
                  request={request}
                  agent={agent}
                  rules={resolveMatchedRules(request)}
                  href={`/w/${workspaceId}/activity/${request.id}`}
                />
              );
            })}
          </div>

          {awaiting.length > 1 && (
            <p className="text-muted-foreground mt-3 font-mono text-[11px]">
              {awaiting.length - 1} more waiting ·{' '}
              <Link
                href={`/w/${workspaceId}/approvals`}
                className="hover:text-foreground underline underline-offset-2"
              >
                open the queue
              </Link>
            </p>
          )}
        </section>
      )}

      {/* The record */}
      <section className="mt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase">Recent entries</h2>
          <Link
            href={`/w/${workspaceId}/activity`}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-mono text-[11px] transition-colors"
          >
            Full record
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="border-border mt-3 overflow-hidden rounded-md border">
          <DocketList requests={recent} workspaceId={workspaceId} />
        </div>
      </section>
    </div>
  );
}

function Figure({
  label,
  value,
  note,
  bar,
  emphasis = false,
}: {
  label: string;
  value: string;
  note: string;
  bar?: number;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-card px-4 py-3.5">
      <dt className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
        {label}
      </dt>
      <dd
        className={cn(
          'mt-1.5 font-mono text-[22px] leading-none font-bold tracking-tight tabular-nums',
          emphasis && 'text-pending',
        )}
      >
        {value}
      </dd>
      <p className="text-muted-foreground mt-1.5 font-mono text-[11px] tabular-nums">{note}</p>
      {typeof bar === 'number' && (
        <div className="bg-muted mt-2.5 h-1 w-full overflow-hidden rounded-full">
          <div
            className={cn('h-full rounded-full', bar > 85 ? 'bg-denied' : 'bg-primary')}
            style={{ width: `${bar}%` }}
          />
        </div>
      )}
    </div>
  );
}
