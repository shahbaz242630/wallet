import { notFound } from 'next/navigation';
import { CheckCheck } from 'lucide-react';
import { CountersignCard } from '@/components/countersign-card';
import { usd } from '@/lib/format';
import {
  getAgent,
  getTotals,
  getWorkspace,
  listAwaiting,
  resolveMatchedRules,
} from '@/modules/demo/queries';

export default async function ApprovalsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspace(workspaceId);
  if (!workspace) notFound();

  const awaiting = listAwaiting(workspaceId);
  const totals = getTotals(workspaceId);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <header>
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
          Approvals
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold tracking-tight sm:text-[30px]">
          Held for your signature
        </h1>
        <p className="text-muted-foreground mt-2 max-w-prose text-[14px] leading-relaxed">
          Nothing here has any spending authority yet. Each one shows the exact amount, merchant and
          agent as recorded on our side — never as the agent described them.
        </p>
      </header>

      {awaiting.length === 0 ? (
        <div className="border-border mt-8 flex flex-col items-center gap-3 rounded-md border border-dashed px-6 py-16 text-center">
          <CheckCheck className="text-allowed size-7" />
          <p className="text-[15px] font-medium">Nothing waiting</p>
          <p className="text-muted-foreground max-w-sm text-[13px] leading-relaxed">
            Every request so far has been settled inside the rules you set. Your agents are spending
            without interrupting you.
          </p>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mt-6 font-mono text-[11px] tracking-wide tabular-nums">
            {awaiting.length} request{awaiting.length === 1 ? '' : 's'} ·{' '}
            {usd(totals.awaitingMinor, totals.currency)} total
          </p>
          <div className="mt-3 space-y-5">
            {awaiting.map((request) => {
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
        </>
      )}
    </div>
  );
}
