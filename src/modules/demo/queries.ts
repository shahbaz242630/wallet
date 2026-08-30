/**
 * Read helpers over the seeded data.
 *
 * These stand in for what will become repository calls. Keeping the screens
 * behind functions like these means swapping seed data for a database later
 * touches this file and nothing in the UI.
 */

import { AGENTS, SPEND_REQUESTS, WALLETS, WORKSPACES } from './seed';
import type { Agent, SpendRequest, Wallet, Workspace } from './types';

export function listWorkspaces(): readonly Workspace[] {
  return WORKSPACES;
}

export function getWorkspace(id: string): Workspace | undefined {
  return WORKSPACES.find((workspace) => workspace.id === id);
}

export function listAgents(workspaceId: string): Agent[] {
  return AGENTS.filter((agent) => agent.workspaceId === workspaceId);
}

export function getAgent(id: string): Agent | undefined {
  return AGENTS.find((agent) => agent.id === id);
}

export function listWallets(workspaceId: string): Wallet[] {
  return WALLETS.filter((wallet) => wallet.workspaceId === workspaceId);
}

export function getWallet(id: string): Wallet | undefined {
  return WALLETS.find((wallet) => wallet.id === id);
}

/** Newest first — the docket reads top-down like a ledger page. */
export function listRequests(workspaceId: string): SpendRequest[] {
  return SPEND_REQUESTS.filter((request) => request.workspaceId === workspaceId).sort(
    (a, b) => b.seq - a.seq,
  );
}

export function getRequest(id: string): SpendRequest | undefined {
  return SPEND_REQUESTS.find((request) => request.id === id);
}

/** Everything holding for a human signature. This is the queue that matters. */
export function listAwaiting(workspaceId: string): SpendRequest[] {
  return listRequests(workspaceId).filter((request) => request.disposition === 'awaiting');
}

export interface WorkspaceTotals {
  limitMinor: number;
  spentMinor: number;
  currency: string;
  awaitingCount: number;
  awaitingMinor: number;
  activeAgents: number;
  deniedThisMonth: number;
}

export function getTotals(workspaceId: string): WorkspaceTotals {
  const wallets = listWallets(workspaceId);
  const requests = listRequests(workspaceId);
  const awaiting = requests.filter((request) => request.disposition === 'awaiting');

  return {
    limitMinor: wallets.reduce((sum, wallet) => sum + wallet.monthlyLimitMinor, 0),
    spentMinor: wallets.reduce((sum, wallet) => sum + wallet.spentThisMonthMinor, 0),
    currency: wallets[0]?.currency ?? 'USD',
    awaitingCount: awaiting.length,
    awaitingMinor: awaiting.reduce((sum, request) => sum + request.amountMinor, 0),
    activeAgents: listAgents(workspaceId).filter((agent) => agent.status === 'active').length,
    deniedThisMonth: requests.filter((request) => request.disposition === 'denied').length,
  };
}

/** The rules that fired on a request, resolved against the wallet that judged it. */
export function resolveMatchedRules(request: SpendRequest) {
  const wallet = getWallet(request.walletId);
  if (!wallet) return [];
  return request.matchedRuleIds
    .map((id) => wallet.rules.find((rule) => rule.id === id))
    .filter((rule): rule is NonNullable<typeof rule> => rule !== undefined);
}
