import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KeyRound, ShieldOff } from 'lucide-react';
import { usd, formatDate, timeAgo } from '@/lib/format';
import { cn } from '@/lib/utils';
import { getWallet, getWorkspace, listAgents } from '@/modules/demo/queries';
import type { AgentStatus } from '@/modules/demo/types';

const STATUS: Record<AgentStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'text-allowed' },
  suspended: { label: 'Suspended', className: 'text-pending' },
  revoked: { label: 'Revoked', className: 'text-denied' },
};

export default async function AgentsPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = await params;
  const workspace = getWorkspace(workspaceId);
  if (!workspace) notFound();

  const agents = listAgents(workspaceId);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <header>
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
          Agents
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold tracking-tight sm:text-[30px]">
          {agents.length} machine identit{agents.length === 1 ? 'y' : 'ies'}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-prose text-[14px] leading-relaxed">
          Each agent authenticates as itself and holds its own revocable credential. None of them
          share a key, and none of them can see a card number.
        </p>
      </header>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {agents.map((agent) => {
          const wallet = getWallet(agent.walletId);
          const status = STATUS[agent.status];

          return (
            <article
              key={agent.id}
              className="border-border bg-card flex flex-col rounded-md border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-[16px] leading-tight font-semibold">{agent.name}</h2>
                  <p className="text-muted-foreground mt-0.5 truncate font-mono text-[11px]">
                    {agent.handle} · {agent.vendor}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 font-mono text-[10px] tracking-[0.14em] uppercase',
                    status.className,
                  )}
                >
                  {status.label}
                </span>
              </div>

              <p className="text-muted-foreground mt-3 text-[13px] leading-relaxed">
                {agent.purpose}
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
                <div>
                  <dt className="text-muted-foreground font-mono text-[10px] tracking-[0.14em] uppercase">
                    Spent this month
                  </dt>
                  <dd className="mt-0.5 font-mono text-[14px] font-semibold tabular-nums">
                    {usd(agent.spentThisMonthMinor)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground font-mono text-[10px] tracking-[0.14em] uppercase">
                    Requests
                  </dt>
                  <dd className="mt-0.5 font-mono text-[14px] font-semibold tabular-nums">
                    {agent.requestCount}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground font-mono text-[10px] tracking-[0.14em] uppercase">
                    Draws on
                  </dt>
                  <dd className="mt-0.5">
                    {wallet ? (
                      <Link
                        href={`/w/${workspaceId}/wallets`}
                        className="underline decoration-dotted underline-offset-4"
                      >
                        {wallet.name}
                      </Link>
                    ) : (
                      '—'
                    )}
                    {agent.team && <span className="text-muted-foreground"> · {agent.team}</span>}
                  </dd>
                </div>
              </dl>

              <div className="border-border text-muted-foreground mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 font-mono text-[10px]">
                <span className="inline-flex items-center gap-1.5">
                  <KeyRound className="size-3" />
                  Credential expires {formatDate(agent.credentialExpiresAt)}
                </span>
                <span>Last active {timeAgo(agent.lastActiveAt)}</span>
              </div>

              {agent.status === 'suspended' && (
                <p className="text-pending mt-3 inline-flex items-start gap-1.5 text-[12px] leading-relaxed">
                  <ShieldOff className="mt-0.5 size-3.5 shrink-0" />
                  Suspended by you on {formatDate(agent.lastActiveAt)}. Its record is kept; it
                  simply cannot request anything.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
