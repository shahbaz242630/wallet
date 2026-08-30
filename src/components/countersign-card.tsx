'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, PenLine, X } from 'lucide-react';
import { toast } from 'sonner';
import { DispositionStamp } from '@/components/disposition';
import { RecordRule, RecordSheet } from '@/components/record-sheet';
import { Button } from '@/components/ui/button';
import { usd, formatDateTime, timeAgo } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Agent, Rule, SpendRequest } from '@/modules/demo/types';

type Outcome = 'open' | 'signed' | 'refused';

/**
 * The unsealed form: a request holding for a human signature.
 *
 * This is the product's whole argument in one component. Everything shown here
 * is served from our own record — never from anything the agent supplied — so
 * what the human signs is what actually happens.
 */
export function CountersignCard({
  request,
  agent,
  rules,
  href,
  compact = false,
}: {
  request: SpendRequest;
  agent: Agent;
  rules: Rule[];
  href: string;
  compact?: boolean;
}) {
  const [outcome, setOutcome] = useState<Outcome>('open');

  function sign() {
    setOutcome('signed');
    toast.success(`${request.id} countersigned`, {
      description: `Single-use credential issued to ${agent.name}, locked to ${request.merchant} and capped at ${usd(request.amountMinor, request.currency)}.`,
    });
  }

  function refuse() {
    setOutcome('refused');
    toast('Request refused', {
      description: `${agent.name} has been told it has no authority for this payment.`,
    });
  }

  return (
    <RecordSheet sealed className={cn('flex flex-col', compact && 'h-full')}>
      {/* Header strip: the record's identity */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pt-4 pb-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[12px] font-semibold tracking-[0.1em] tabular-nums">
            {request.id}
          </span>
          <span className="text-record-foreground/50 font-mono text-[11px]">
            {timeAgo(request.requestedAt)}
          </span>
        </div>
        <span className="text-record-foreground/50 font-mono text-[11px] tabular-nums">
          {formatDateTime(request.requestedAt)}
        </span>
      </div>

      <RecordRule />

      {/* The ask */}
      <div className="px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
          <div className="min-w-0 flex-1">
            <p className="text-record-foreground/55 font-mono text-[10px] tracking-[0.16em] uppercase">
              {agent.name} · {agent.vendor} wants to pay
            </p>
            <p className="mt-1.5 text-[22px] leading-tight font-semibold">{request.merchant}</p>
            <p className="text-record-foreground/70 mt-2 max-w-prose text-[13px] leading-relaxed">
              “{request.purpose}”
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-[34px] leading-none font-bold tracking-tight tabular-nums sm:text-[40px]">
              {usd(request.amountMinor, request.currency)}
            </p>
            <p className="text-record-foreground/50 mt-1.5 font-mono text-[10px] tracking-[0.16em] uppercase">
              {request.currency} · one payment
            </p>
          </div>
        </div>
      </div>

      <RecordRule />

      {/* Why it is being asked at all */}
      <div className="px-5 py-4">
        <p className="text-record-foreground/55 font-mono text-[10px] tracking-[0.16em] uppercase">
          Why you are being asked
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed">{request.reason}</p>
        {rules.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="border-record-rule bg-record-foreground/[0.04] rounded-[3px] border px-2 py-1 font-mono text-[10px] tracking-wide"
              >
                {rule.label}
                <span className="text-record-foreground/45"> · v{rule.version}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <RecordRule />

      {/* The signature block */}
      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 px-5 py-4">
        {outcome === 'open' ? (
          <>
            <div className="min-w-0">
              <p className="text-record-foreground/55 font-mono text-[10px] tracking-[0.16em] uppercase">
                Countersignature
              </p>
              <div className="border-record-foreground/35 mt-2 w-52 border-b border-dashed pb-1">
                <span className="text-record-foreground/30 font-mono text-[11px] italic">
                  unsigned
                </span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                onClick={refuse}
                className="text-record-foreground/70 hover:bg-record-foreground/[0.06] hover:text-record-foreground gap-1.5"
              >
                <X className="size-3.5" />
                Refuse
              </Button>
              <Button
                onClick={sign}
                className="bg-record-foreground text-record hover:bg-record-foreground/90 gap-2 font-semibold"
              >
                <PenLine className="size-4" />
                Countersign
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="min-w-0">
              <p className="text-record-foreground/55 font-mono text-[10px] tracking-[0.16em] uppercase">
                {outcome === 'signed' ? 'Countersigned by' : 'Refused by'}
              </p>
              <p className="mt-1.5 text-[15px] font-semibold">Shahbaz Malik</p>
              <p className="text-record-foreground/50 font-mono text-[11px]">
                just now · passkey on this device
              </p>
            </div>
            <DispositionStamp
              disposition={outcome === 'signed' ? 'allowed' : 'denied'}
              className="shrink-0"
            />
          </>
        )}
      </div>

      <RecordRule />

      <Link
        href={href}
        className="text-record-foreground/60 hover:bg-record-foreground/[0.04] hover:text-record-foreground flex items-center justify-between px-5 py-2.5 font-mono text-[11px] tracking-wide transition-colors"
      >
        Full record and chain of custody
        <ArrowUpRight className="size-3.5" />
      </Link>
    </RecordSheet>
  );
}
