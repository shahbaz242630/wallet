import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Bot, CircleUser, Landmark, Server } from 'lucide-react';
import { DispositionStamp } from '@/components/disposition';
import { RecordField, RecordRule, RecordSheet } from '@/components/record-sheet';
import { usd, formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  getAgent,
  getRequest,
  getWallet,
  getWorkspace,
  resolveMatchedRules,
} from '@/modules/demo/queries';
import type { CustodyActorKind } from '@/modules/demo/types';

const ACTOR_ICON: Record<CustodyActorKind, React.ComponentType<{ className?: string }>> = {
  agent: Bot,
  system: Server,
  human: CircleUser,
  provider: Landmark,
};

export default async function RequestPage({
  params,
}: {
  params: Promise<{ workspaceId: string; requestId: string }>;
}) {
  const { workspaceId, requestId } = await params;
  const workspace = getWorkspace(workspaceId);
  const request = getRequest(decodeURIComponent(requestId));
  if (!workspace || !request || request.workspaceId !== workspaceId) notFound();

  const agent = getAgent(request.agentId);
  const wallet = getWallet(request.walletId);
  const rules = resolveMatchedRules(request);
  const refused = request.disposition === 'denied' || request.disposition === 'expired';

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
      <Link
        href={`/w/${workspaceId}/activity`}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Back to the record
      </Link>

      <RecordSheet className="mt-4">
        {/* Head */}
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5 pb-4">
          <div className="min-w-0">
            <p className="font-mono text-[13px] font-semibold tracking-[0.1em] tabular-nums">
              {request.id}
            </p>
            <h1
              className={cn('mt-1.5 text-[24px] leading-tight font-semibold', refused && 'struck')}
            >
              {request.merchant}
            </h1>
            <p className="text-record-foreground/55 mt-1 font-mono text-[11px]">
              {request.merchantDomain}
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <p
              className={cn(
                'font-mono text-[30px] leading-none font-bold tracking-tight tabular-nums',
                refused && 'struck',
              )}
            >
              {usd(request.amountMinor, request.currency)}
            </p>
            <DispositionStamp disposition={request.disposition} />
          </div>
        </div>

        <RecordRule />

        {/* The facts */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-5 sm:grid-cols-3">
          <RecordField label="Agent">
            {agent ? (
              <>
                {agent.name}
                <span className="text-record-foreground/50"> · {agent.handle}</span>
              </>
            ) : (
              '—'
            )}
          </RecordField>
          <RecordField label="Authorised by">{workspace.subtitle}</RecordField>
          <RecordField label="Wallet">{wallet?.name ?? '—'}</RecordField>
          <RecordField label="Requested">{formatDateTime(request.requestedAt)}</RecordField>
          <RecordField label="Decided">
            {request.decidedAt ? formatDateTime(request.decidedAt) : 'Not yet'}
          </RecordField>
          <RecordField label="Decided by">{request.decidedBy ?? 'Awaiting a human'}</RecordField>
          <RecordField label="Policy version" className="col-span-2 sm:col-span-1">
            <span className="font-mono tabular-nums">v{request.policyVersion}</span>
            <span className="text-record-foreground/50"> · in force at decision time</span>
          </RecordField>
          {request.paymentReference && (
            <RecordField label="Provider reference" className="col-span-2 sm:col-span-1">
              <span className="font-mono text-[12px]">{request.paymentReference}</span>
            </RecordField>
          )}
          <RecordField label="What the agent asked for" className="col-span-2 sm:col-span-3">
            <span className="text-record-foreground/80 italic">“{request.purpose}”</span>
            <span className="text-record-foreground/50 mt-1 block font-mono text-[10px] tracking-wide uppercase">
              Agent-supplied text · treated as a description, never as an instruction
            </span>
          </RecordField>
        </dl>

        <RecordRule />

        {/* The decision */}
        <div className="px-5 py-5">
          <h2 className="text-record-foreground/55 font-mono text-[10px] tracking-[0.16em] uppercase">
            Why it was {refused ? 'refused' : 'allowed'}
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed font-medium">{request.reason}</p>

          {rules.length > 0 && (
            <ol className="mt-4 space-y-2">
              {rules.map((rule, index) => (
                <li
                  key={rule.id}
                  className="border-record-rule bg-record-foreground/[0.03] flex items-start gap-3 rounded-[4px] border px-3 py-2.5"
                >
                  <span className="text-record-foreground/45 mt-0.5 font-mono text-[11px] tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium">{rule.label}</span>
                    <span className="text-record-foreground/65 mt-0.5 block text-[12px] leading-relaxed">
                      {rule.detail}
                    </span>
                  </span>
                  <span className="text-record-foreground/45 shrink-0 font-mono text-[10px] tabular-nums">
                    v{rule.version}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <RecordRule />

        {/* Chain of custody */}
        <div className="px-5 py-5">
          <h2 className="text-record-foreground/55 font-mono text-[10px] tracking-[0.16em] uppercase">
            Chain of custody
          </h2>
          <ol className="mt-4">
            {request.custody.map((entry, index) => {
              const Icon = ACTOR_ICON[entry.actorKind];
              const last = index === request.custody.length - 1;
              return (
                <li key={entry.seq} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {!last && (
                    <span
                      aria-hidden
                      className="bg-record-rule absolute top-7 bottom-0 left-[13px] w-px"
                    />
                  )}
                  <span className="bg-record border-record-rule text-record-foreground/70 relative z-10 grid size-7 shrink-0 place-items-center rounded-full border">
                    <Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-record-foreground/45 font-mono text-[10px] tabular-nums">
                        {String(entry.seq).padStart(2, '0')}
                      </span>
                      <span className="text-[13px] font-semibold">{entry.action}</span>
                    </div>
                    <p className="text-record-foreground/55 mt-0.5 font-mono text-[10px] tracking-wide">
                      {entry.actor} · {formatDateTime(entry.at)}
                    </p>
                    {entry.detail && (
                      <p className="text-record-foreground/75 mt-1.5 text-[12.5px] leading-relaxed">
                        {entry.detail}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <RecordRule />

        <p className="text-record-foreground/50 px-5 py-3 font-mono text-[10px] leading-relaxed tracking-wide">
          This record is append-only. Corrections are added as new entries; nothing above can be
          edited or removed.
        </p>
      </RecordSheet>
    </div>
  );
}
