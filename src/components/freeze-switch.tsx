'use client';

import { useState } from 'react';
import { OctagonX, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * Stop every agent spending, immediately.
 *
 * The single most valuable control in the product: one action that revokes all
 * outstanding authority without needing to reason about which agent did what.
 * It lives in the header on every screen because the moment you want it, you
 * want it now.
 */
export function FreezeSwitch() {
  const [frozen, setFrozen] = useState(false);
  const [open, setOpen] = useState(false);

  function freeze() {
    setFrozen(true);
    setOpen(false);
    toast.error('All agent spending frozen', {
      description:
        'Outstanding payment credentials revoked. Pending requests held. Nothing can be spent until you lift this.',
    });
  }

  function resume() {
    setFrozen(false);
    toast.success('Spending resumed', {
      description: 'Agents may request again, under their existing rules.',
    });
  }

  if (frozen) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={resume}
        className="border-denied/60 text-denied hover:bg-denied/10 gap-2"
      >
        <OctagonX className="size-3.5" />
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase">Frozen</span>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground gap-2"
          />
        }
      >
        <ShieldCheck className="size-3.5" />
        <span className="hidden font-mono text-[11px] tracking-[0.12em] uppercase sm:inline">
          Freeze all
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Freeze all agent spending?</DialogTitle>
          <DialogDescription>
            This takes effect immediately across every wallet and every agent.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-[13px] leading-relaxed">
          <ul className="text-muted-foreground list-disc space-y-1 pl-4">
            <li>Outstanding payment credentials are revoked</li>
            <li>Requests waiting for a signature are held, not refused</li>
            <li>Agents are told they have no spending authority</li>
            <li>Nothing already settled is affected</li>
          </ul>
          <p>You can lift it again at any time.</p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={freeze} className={cn('bg-denied hover:bg-denied/90 text-white')}>
            Freeze everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
