/**
 * Domain shapes for the demo.
 *
 * These mirror the real domain closely enough that the screens built on them
 * will not need rewriting when a database and a payment partner arrive. What
 * is fake here is the data, not the model.
 */

/** How a request ended up. The record only ever gains entries; nothing is deleted. */
export type Disposition =
  | 'awaiting' // needs a human countersignature
  | 'allowed' // policy permitted it, payment in flight
  | 'settled' // money has moved and the provider confirmed it
  | 'denied' // a rule refused it
  | 'expired' // nobody answered in time
  | 'refunded'; // reversed after settlement

export type AgentStatus = 'active' | 'suspended' | 'revoked';

export type WorkspaceKind = 'personal' | 'business';

export interface Workspace {
  id: string;
  name: string;
  kind: WorkspaceKind;
  /** Shown under the name in the switcher. */
  subtitle: string;
}

export interface Agent {
  id: string;
  workspaceId: string;
  /** The product, as people say it out loud: "Claude Code". */
  name: string;
  /** The machine identity this agent authenticates as. */
  handle: string;
  vendor: string;
  /** What its owner set it up to do. */
  purpose: string;
  status: AgentStatus;
  walletId: string;
  /** Department, for business workspaces. */
  team?: string;
  createdAt: string;
  lastActiveAt: string;
  credentialIssuedAt: string;
  credentialExpiresAt: string;
  spentThisMonthMinor: number;
  requestCount: number;
}

export type RuleKind =
  | 'per-transaction'
  | 'daily'
  | 'monthly'
  | 'merchant-allow'
  | 'merchant-deny'
  | 'category-deny'
  | 'approval-threshold'
  | 'time-window';

export interface Rule {
  id: string;
  kind: RuleKind;
  /** Plain language, as the owner would say it. */
  label: string;
  detail: string;
  amountMinor?: number;
  /** Rules are versioned; a decision records which version judged it. */
  version: number;
}

export interface Wallet {
  id: string;
  workspaceId: string;
  name: string;
  currency: string;
  monthlyLimitMinor: number;
  spentThisMonthMinor: number;
  status: 'active' | 'frozen';
  rules: Rule[];
  /** Which agents may draw on it. */
  agentIds: string[];
  policyVersion: number;
}

export type CustodyActorKind = 'agent' | 'system' | 'human' | 'provider';

/**
 * One line in the chain of custody. Append-only: a mistake is corrected by
 * adding a reversing entry, never by editing or removing one.
 */
export interface CustodyEntry {
  seq: number;
  at: string;
  actor: string;
  actorKind: CustodyActorKind;
  action: string;
  detail?: string;
}

export interface SpendRequest {
  /** Human-facing record number, e.g. SR-2026-0148. */
  id: string;
  seq: number;
  workspaceId: string;
  agentId: string;
  walletId: string;
  merchant: string;
  merchantDomain: string;
  /** What the agent said it needed the money for, in its own words. */
  purpose: string;
  amountMinor: number;
  currency: string;
  requestedAt: string;
  disposition: Disposition;
  decidedAt?: string;
  /** "Policy" for an automatic decision, or the person who countersigned. */
  decidedBy?: string;
  /** Which rules actually fired, in the order they were evaluated. */
  matchedRuleIds: string[];
  /** The one-line machine reason for the disposition. */
  reason: string;
  policyVersion: number;
  /** Set once a human has signed it. */
  countersignedBy?: string;
  countersignedAt?: string;
  /** Provider reference, once money has actually moved. */
  paymentReference?: string;
  custody: CustodyEntry[];
}
