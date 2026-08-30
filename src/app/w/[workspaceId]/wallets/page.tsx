import { notFound } from 'next/navigation';
import {
  Ban,
  CalendarClock,
  CircleDollarSign,
  Clock,
  PenLine,
  Store,
  Wallet as WalletIcon,
} from 'lucide-react';
import { usd, percentUsed } from '@/lib/format';
import { cn } from '@/lib/utils';
import { getAgent, getWorkspace, listWallets } from '@/modules/demo/queries';
import type { RuleKind } from '@/modules/demo/types';

const RULE_ICON: Record<RuleKind, React.ComponentType<{ className?: string }>> = {
  'per-transaction': CircleDollarSign,
  daily: CalendarClock,
  monthly: CalendarClock,
  'merchant-allow': Store,
  'merchant-deny': Ban,
  'category-deny': Ban,
  'approval-threshold': PenLine,
  'time-window': Clock,
};

/** Rules that refuse things are drawn in the refusing colour. */
const DENYING: ReadonlySet<RuleKind> = new Set(['merchant-deny', 'category-deny']);

export default async function WalletsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const workspace = getWorkspace(workspaceId);
  if (!workspace) notFound();

  const wallets = listWallets(workspaceId);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
      <header>
        <p className="text-muted-foreground font-mono text-[11px] tracking-[0.18em] uppercase">
          Wallets &amp; rules
        </p>
        <h1 className="mt-1.5 text-[26px] leading-tight font-semibold tracking-tight sm:text-[30px]">
          What your agents may do
        </h1>
        <p className="text-muted-foreground mt-2 max-w-prose text-[14px] leading-relaxed">
          Rules are plain sentences you set, held as exact conditions the system checks on every
          request. They are versioned, so a decision made last week can still be explained by the
          rules that were in force when it was made.
        </p>
      </header>

      <div className="mt-7 space-y-6">
        {wallets.map((wallet) => {
          const used = percentUsed(wallet.spentThisMonthMinor, wallet.monthlyLimitMinor);
          const agents = wallet.agentIds
            .map((id) => getAgent(id))
            .filter((agent): agent is NonNullable<typeof agent> => agent !== undefined);

          return (
            <section key={wallet.id} className="border-border bg-card rounded-md border">
              <div className="flex flex-wrap items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h2 className="flex items-center gap-2 text-[17px] leading-tight font-semibold">
                    <WalletIcon className="text-muted-foreground size-4 shrink-0" />
                    {wallet.name}
                  </h2>
                  <p className="text-muted-foreground mt-1 font-mono text-[11px]">
                    {wallet.currency} · policy v{wallet.policyVersion} · {agents.length} agent
                    {agents.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[18px] leading-none font-bold tabular-nums">
                    {usd(wallet.spentThisMonthMinor, wallet.currency)}
                  </p>
                  <p className="text-muted-foreground mt-1 font-mono text-[11px] tabular-nums">
                    of {usd(wallet.monthlyLimitMinor, wallet.currency)} this month
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className={cn('h-full rounded-full', used > 85 ? 'bg-denied' : 'bg-primary')}
                    style={{ width: `${used}%` }}
                  />
                </div>
              </div>

              <div className="border-border border-t px-4 py-3">
                <p className="text-muted-foreground font-mono text-[10px] tracking-[0.16em] uppercase">
                  Agents drawing on this wallet
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {agents.map((agent) => (
                    <li
                      key={agent.id}
                      className="border-border bg-background rounded-[3px] border px-2 py-1 font-mono text-[11px]"
                    >
                      {agent.name}
                      <span className="text-muted-foreground"> · {agent.handle}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="border-border divide-border divide-y border-t">
                {wallet.rules.map((rule) => {
                  const Icon = RULE_ICON[rule.kind];
                  const denying = DENYING.has(rule.kind);
                  return (
                    <li key={rule.id} className="flex items-start gap-3 px-4 py-3">
                      <Icon
                        className={cn(
                          'mt-0.5 size-4 shrink-0',
                          denying ? 'text-denied' : 'text-muted-foreground',
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            'text-[14px] leading-snug font-medium',
                            denying && 'text-denied',
                          )}
                        >
                          {rule.label}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-[12px] leading-relaxed">
                          {rule.detail}
                        </p>
                      </div>
                      <span className="text-muted-foreground shrink-0 font-mono text-[10px] tabular-nums">
                        v{rule.version}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
