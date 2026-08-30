/**
 * Seeded demonstration data.
 *
 * Every figure here is invented. The agents and merchants are real products so
 * the demo is recognisable, but no relationship, endorsement or transaction is
 * implied by any of them. Nothing in this file describes a real customer,
 * a real payment, or a real partner.
 *
 * Dates are fixed rather than relative so the demo renders identically on the
 * server and the client, and identically every time it is shown.
 */

import type { Agent, CustodyEntry, Rule, SpendRequest, Wallet, Workspace } from './types';

export const WORKSPACES: readonly Workspace[] = [
  {
    id: 'ws-personal',
    name: 'Personal',
    kind: 'personal',
    subtitle: 'Shahbaz Malik',
  },
  {
    id: 'ws-northwind',
    name: 'Northwind Labs',
    kind: 'business',
    subtitle: '24 people · 9 agents',
  },
];

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

const buildRules: Rule[] = [
  {
    id: 'r-build-per-tx',
    kind: 'per-transaction',
    label: 'Nothing over $200 in one go',
    detail: 'A single payment may not exceed $200.00.',
    amountMinor: 20_000,
    version: 4,
  },
  {
    id: 'r-build-monthly',
    kind: 'monthly',
    label: '$500 a month, total',
    detail: 'All agents drawing on this wallet share one monthly ceiling.',
    amountMinor: 50_000,
    version: 4,
  },
  {
    id: 'r-build-approval',
    kind: 'approval-threshold',
    label: 'Ask me above $50',
    detail: 'Anything at or above $50.00 waits for a countersignature.',
    amountMinor: 5_000,
    version: 4,
  },
  {
    id: 'r-build-allow',
    kind: 'merchant-allow',
    label: 'Developer tools and infrastructure only',
    detail:
      'GitHub, Supabase, Vercel, Cloudflare, Anthropic, OpenAI, Linear, Namecheap, Higgsfield.',
    version: 4,
  },
  {
    id: 'r-build-deny',
    kind: 'category-deny',
    label: 'Never crypto, gambling or cash',
    detail: 'These categories are refused outright, whatever the amount.',
    version: 4,
  },
];

const everydayRules: Rule[] = [
  {
    id: 'r-every-per-tx',
    kind: 'per-transaction',
    label: 'Nothing over $150 in one go',
    detail: 'A single payment may not exceed $150.00.',
    amountMinor: 15_000,
    version: 2,
  },
  {
    id: 'r-every-monthly',
    kind: 'monthly',
    label: '$400 a month, total',
    detail: 'Shared monthly ceiling for everyday spending.',
    amountMinor: 40_000,
    version: 2,
  },
  {
    id: 'r-every-approval',
    kind: 'approval-threshold',
    label: 'Ask me above $100',
    detail: 'Anything at or above $100.00 waits for a countersignature.',
    amountMinor: 10_000,
    version: 2,
  },
  {
    id: 'r-every-window',
    kind: 'time-window',
    label: 'Only between 07:00 and 23:00',
    detail: 'Requests outside these hours are held until morning.',
    version: 2,
  },
  {
    id: 'r-every-deny',
    kind: 'category-deny',
    label: 'Never crypto, gambling or cash',
    detail: 'These categories are refused outright, whatever the amount.',
    version: 2,
  },
];

const platformRules: Rule[] = [
  {
    id: 'r-plat-per-tx',
    kind: 'per-transaction',
    label: 'Nothing over $1,500 in one go',
    detail: 'A single payment may not exceed $1,500.00.',
    amountMinor: 150_000,
    version: 11,
  },
  {
    id: 'r-plat-monthly',
    kind: 'monthly',
    label: '$5,000 a month, total',
    detail: 'Platform engineering ceiling, reset on the 1st.',
    amountMinor: 500_000,
    version: 11,
  },
  {
    id: 'r-plat-approval',
    kind: 'approval-threshold',
    label: 'Finance countersigns above $500',
    detail: 'Anything at or above $500.00 goes to the approval queue.',
    amountMinor: 50_000,
    version: 11,
  },
  {
    id: 'r-plat-allow',
    kind: 'merchant-allow',
    label: 'Approved infrastructure vendors',
    detail: 'AWS, Cloudflare, GitHub, Supabase, Vercel, Datadog, Anthropic, OpenAI.',
    version: 11,
  },
];

const growthRules: Rule[] = [
  {
    id: 'r-growth-per-tx',
    kind: 'per-transaction',
    label: 'Nothing over $2,000 in one go',
    detail: 'A single campaign charge may not exceed $2,000.00.',
    amountMinor: 200_000,
    version: 7,
  },
  {
    id: 'r-growth-monthly',
    kind: 'monthly',
    label: '$12,000 a month, total',
    detail: 'Combined paid media ceiling across every channel.',
    amountMinor: 1_200_000,
    version: 7,
  },
  {
    id: 'r-growth-approval',
    kind: 'approval-threshold',
    label: 'Marketing lead countersigns every campaign launch',
    detail: 'Any new campaign spend waits for a countersignature, whatever the amount.',
    amountMinor: 0,
    version: 7,
  },
  {
    id: 'r-growth-allow',
    kind: 'merchant-allow',
    label: 'Approved ad platforms only',
    detail: 'Google Ads, Meta Ads, LinkedIn Ads, Reddit Ads.',
    version: 7,
  },
];

const procurementRules: Rule[] = [
  {
    id: 'r-proc-per-tx',
    kind: 'per-transaction',
    label: 'Nothing over $3,000 in one go',
    detail: 'A single purchase may not exceed $3,000.00.',
    amountMinor: 300_000,
    version: 5,
  },
  {
    id: 'r-proc-monthly',
    kind: 'monthly',
    label: '$8,000 a month, total',
    detail: 'Software and services ceiling.',
    amountMinor: 800_000,
    version: 5,
  },
  {
    id: 'r-proc-approval',
    kind: 'approval-threshold',
    label: 'Two signatures above $1,000',
    detail: 'Purchases at or above $1,000.00 need finance and a department head.',
    amountMinor: 100_000,
    version: 5,
  },
];

// ---------------------------------------------------------------------------
// Wallets
// ---------------------------------------------------------------------------

export const WALLETS: readonly Wallet[] = [
  {
    id: 'w-build',
    workspaceId: 'ws-personal',
    name: 'Build & Infrastructure',
    currency: 'USD',
    monthlyLimitMinor: 50_000,
    spentThisMonthMinor: 21_704,
    status: 'active',
    rules: buildRules,
    agentIds: ['a-claude-code', 'a-codex', 'a-kimi'],
    policyVersion: 4,
  },
  {
    id: 'w-everyday',
    workspaceId: 'ws-personal',
    name: 'Everyday',
    currency: 'USD',
    monthlyLimitMinor: 40_000,
    spentThisMonthMinor: 17_390,
    status: 'active',
    rules: everydayRules,
    agentIds: ['a-gemini', 'a-thursday'],
    policyVersion: 2,
  },
  {
    id: 'w-platform',
    workspaceId: 'ws-northwind',
    name: 'Platform Engineering',
    currency: 'USD',
    monthlyLimitMinor: 500_000,
    spentThisMonthMinor: 318_640,
    status: 'active',
    rules: platformRules,
    agentIds: ['a-nw-claude', 'a-nw-codex'],
    policyVersion: 11,
  },
  {
    id: 'w-growth',
    workspaceId: 'ws-northwind',
    name: 'Growth & Campaigns',
    currency: 'USD',
    monthlyLimitMinor: 1_200_000,
    spentThisMonthMinor: 742_500,
    status: 'active',
    rules: growthRules,
    agentIds: ['a-nw-hermes'],
    policyVersion: 7,
  },
  {
    id: 'w-procurement',
    workspaceId: 'ws-northwind',
    name: 'Procurement',
    currency: 'USD',
    monthlyLimitMinor: 800_000,
    spentThisMonthMinor: 289_900,
    status: 'active',
    rules: procurementRules,
    agentIds: ['a-nw-clawbot'],
    policyVersion: 5,
  },
];

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------

export const AGENTS: readonly Agent[] = [
  {
    id: 'a-claude-code',
    workspaceId: 'ws-personal',
    name: 'Claude Code',
    handle: 'claude-code-01',
    vendor: 'Anthropic',
    purpose: 'Builds and ships the platform. Buys the infrastructure it needs to finish a job.',
    status: 'active',
    walletId: 'w-build',
    createdAt: '2026-06-14T09:12:00Z',
    lastActiveAt: '2026-08-30T14:22:00Z',
    credentialIssuedAt: '2026-08-24T08:00:00Z',
    credentialExpiresAt: '2026-09-23T08:00:00Z',
    spentThisMonthMinor: 12_704,
    requestCount: 34,
  },
  {
    id: 'a-codex',
    workspaceId: 'ws-personal',
    name: 'GPT Codex',
    handle: 'codex-personal',
    vendor: 'OpenAI',
    purpose: 'Second opinion on builds and test runs.',
    status: 'active',
    walletId: 'w-build',
    createdAt: '2026-07-02T11:40:00Z',
    lastActiveAt: '2026-08-29T19:05:00Z',
    credentialIssuedAt: '2026-08-24T08:00:00Z',
    credentialExpiresAt: '2026-09-23T08:00:00Z',
    spentThisMonthMinor: 6_000,
    requestCount: 11,
  },
  {
    id: 'a-kimi',
    workspaceId: 'ws-personal',
    name: 'Kimi Dev',
    handle: 'kimi-dev-01',
    vendor: 'Moonshot',
    purpose: 'Long-context refactors and documentation passes.',
    status: 'suspended',
    walletId: 'w-build',
    createdAt: '2026-07-19T16:20:00Z',
    lastActiveAt: '2026-08-21T10:11:00Z',
    credentialIssuedAt: '2026-07-19T16:20:00Z',
    credentialExpiresAt: '2026-09-17T16:20:00Z',
    spentThisMonthMinor: 3_000,
    requestCount: 5,
  },
  {
    id: 'a-gemini',
    workspaceId: 'ws-personal',
    name: 'Gemini',
    handle: 'gemini-shop',
    vendor: 'Google',
    purpose: 'Finds the best price on things I ask for, and buys within budget.',
    status: 'active',
    walletId: 'w-everyday',
    createdAt: '2026-05-30T13:00:00Z',
    lastActiveAt: '2026-08-30T11:48:00Z',
    credentialIssuedAt: '2026-08-01T09:00:00Z',
    credentialExpiresAt: '2026-08-31T09:00:00Z',
    spentThisMonthMinor: 8_990,
    requestCount: 22,
  },
  {
    id: 'a-thursday',
    workspaceId: 'ws-personal',
    name: 'Thursday Shop',
    handle: 'routine-groceries',
    vendor: 'Custom routine',
    purpose: 'Orders the weekly groceries every Thursday morning.',
    status: 'active',
    walletId: 'w-everyday',
    createdAt: '2026-04-11T08:30:00Z',
    lastActiveAt: '2026-08-27T07:02:00Z',
    credentialIssuedAt: '2026-08-01T09:00:00Z',
    credentialExpiresAt: '2026-08-31T09:00:00Z',
    spentThisMonthMinor: 8_400,
    requestCount: 4,
  },
  {
    id: 'a-nw-claude',
    workspaceId: 'ws-northwind',
    name: 'Claude Code',
    handle: 'nw-platform-claude',
    vendor: 'Anthropic',
    purpose: 'Ships platform work and keeps the build pipeline running.',
    status: 'active',
    walletId: 'w-platform',
    team: 'Platform',
    createdAt: '2026-03-02T10:00:00Z',
    lastActiveAt: '2026-08-30T15:31:00Z',
    credentialIssuedAt: '2026-08-15T10:00:00Z',
    credentialExpiresAt: '2026-09-14T10:00:00Z',
    spentThisMonthMinor: 214_800,
    requestCount: 96,
  },
  {
    id: 'a-nw-codex',
    workspaceId: 'ws-northwind',
    name: 'GPT Codex',
    handle: 'nw-qa-codex',
    vendor: 'OpenAI',
    purpose: 'Runs the regression suite and reports failures.',
    status: 'active',
    walletId: 'w-platform',
    team: 'QA',
    createdAt: '2026-04-18T09:15:00Z',
    lastActiveAt: '2026-08-30T06:44:00Z',
    credentialIssuedAt: '2026-08-15T10:00:00Z',
    credentialExpiresAt: '2026-09-14T10:00:00Z',
    spentThisMonthMinor: 103_840,
    requestCount: 41,
  },
  {
    id: 'a-nw-hermes',
    workspaceId: 'ws-northwind',
    name: 'Hermes',
    handle: 'nw-growth-hermes',
    vendor: 'Custom agent',
    purpose: 'Plans and launches paid campaigns against a weekly budget.',
    status: 'active',
    walletId: 'w-growth',
    team: 'Marketing',
    createdAt: '2026-02-20T14:00:00Z',
    lastActiveAt: '2026-08-30T13:10:00Z',
    credentialIssuedAt: '2026-08-15T10:00:00Z',
    credentialExpiresAt: '2026-09-14T10:00:00Z',
    spentThisMonthMinor: 742_500,
    requestCount: 58,
  },
  {
    id: 'a-nw-clawbot',
    workspaceId: 'ws-northwind',
    name: 'Clawbot',
    handle: 'nw-procurement-claw',
    vendor: 'Custom agent',
    purpose: 'Renews software licences and sources vendors on request.',
    status: 'active',
    walletId: 'w-procurement',
    team: 'Procurement',
    createdAt: '2026-01-15T11:30:00Z',
    lastActiveAt: '2026-08-29T16:20:00Z',
    credentialIssuedAt: '2026-08-15T10:00:00Z',
    credentialExpiresAt: '2026-09-14T10:00:00Z',
    spentThisMonthMinor: 289_900,
    requestCount: 27,
  },
];

// ---------------------------------------------------------------------------
// Spend requests
// ---------------------------------------------------------------------------

interface RequestSeed {
  id: string;
  seq: number;
  workspaceId: string;
  agentId: string;
  walletId: string;
  merchant: string;
  merchantDomain: string;
  purpose: string;
  amountMinor: number;
  requestedAt: string;
  disposition: SpendRequest['disposition'];
  decidedAt?: string;
  decidedBy?: string;
  matchedRuleIds: string[];
  reason: string;
  policyVersion: number;
  countersignedBy?: string;
  countersignedAt?: string;
  paymentReference?: string;
}

const REQUEST_SEEDS: RequestSeed[] = [
  // --- Personal: the hero. Work stopped; the agent asked instead of stopping.
  {
    id: 'SR-2026-0148',
    seq: 148,
    workspaceId: 'ws-personal',
    agentId: 'a-claude-code',
    walletId: 'w-build',
    merchant: 'GitHub',
    merchantDomain: 'github.com',
    purpose:
      'Actions minutes exhausted mid-build. Pay-as-you-go top-up needed to finish the release pipeline.',
    amountMinor: 12_000,
    requestedAt: '2026-08-30T14:22:00Z',
    disposition: 'awaiting',
    matchedRuleIds: ['r-build-allow', 'r-build-per-tx', 'r-build-approval'],
    reason: 'Within limits, but $120.00 is above the $50.00 approval threshold.',
    policyVersion: 4,
  },
  {
    id: 'SR-2026-0147',
    seq: 147,
    workspaceId: 'ws-personal',
    agentId: 'a-gemini',
    walletId: 'w-everyday',
    merchant: 'Kraken',
    merchantDomain: 'kraken.com',
    purpose: 'Purchase requested while researching payment rails.',
    amountMinor: 20_000,
    requestedAt: '2026-08-30T11:48:00Z',
    disposition: 'denied',
    decidedAt: '2026-08-30T11:48:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-every-deny'],
    reason: 'Cryptocurrency is refused outright by this wallet, at any amount.',
    policyVersion: 2,
  },
  {
    id: 'SR-2026-0146',
    seq: 146,
    workspaceId: 'ws-personal',
    agentId: 'a-claude-code',
    walletId: 'w-build',
    merchant: 'Supabase',
    merchantDomain: 'supabase.com',
    purpose: 'Pro plan for the staging project so migrations can run against real data.',
    amountMinor: 2_500,
    requestedAt: '2026-08-29T10:04:00Z',
    disposition: 'settled',
    decidedAt: '2026-08-29T10:04:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-build-allow', 'r-build-per-tx'],
    reason: 'Approved vendor, $25.00 is below the $50.00 approval threshold.',
    policyVersion: 4,
    paymentReference: 'pay_3QK8vTx01',
  },
  {
    id: 'SR-2026-0145',
    seq: 145,
    workspaceId: 'ws-personal',
    agentId: 'a-codex',
    walletId: 'w-build',
    merchant: 'OpenAI',
    merchantDomain: 'openai.com',
    purpose: 'API credit top-up to finish the regression run.',
    amountMinor: 6_000,
    requestedAt: '2026-08-29T19:05:00Z',
    disposition: 'settled',
    decidedAt: '2026-08-29T19:11:00Z',
    decidedBy: 'Shahbaz Malik',
    matchedRuleIds: ['r-build-allow', 'r-build-approval'],
    reason: '$60.00 is above the $50.00 threshold. Countersigned after 6 minutes.',
    policyVersion: 4,
    countersignedBy: 'Shahbaz Malik',
    countersignedAt: '2026-08-29T19:11:00Z',
    paymentReference: 'pay_3QK7bNm44',
  },
  {
    id: 'SR-2026-0144',
    seq: 144,
    workspaceId: 'ws-personal',
    agentId: 'a-thursday',
    walletId: 'w-everyday',
    merchant: 'Tesco',
    merchantDomain: 'tesco.com',
    purpose: 'Weekly grocery order, standing routine.',
    amountMinor: 8_400,
    requestedAt: '2026-08-27T07:02:00Z',
    disposition: 'settled',
    decidedAt: '2026-08-27T07:02:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-every-per-tx', 'r-every-window'],
    reason: '$84.00 is below the $100.00 approval threshold and inside the allowed hours.',
    policyVersion: 2,
    paymentReference: 'pay_3QJ9wLp22',
  },
  {
    id: 'SR-2026-0143',
    seq: 143,
    workspaceId: 'ws-personal',
    agentId: 'a-gemini',
    walletId: 'w-everyday',
    merchant: 'Amazon',
    merchantDomain: 'amazon.com',
    purpose: 'Best price found for the requested camera. Asked to buy if under $100.',
    amountMinor: 8_990,
    requestedAt: '2026-08-26T15:33:00Z',
    disposition: 'settled',
    decidedAt: '2026-08-26T15:33:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-every-per-tx'],
    reason: '$89.90 is below both the per-payment cap and the approval threshold.',
    policyVersion: 2,
    paymentReference: 'pay_3QJ7cRt09',
  },
  {
    id: 'SR-2026-0142',
    seq: 142,
    workspaceId: 'ws-personal',
    agentId: 'a-claude-code',
    walletId: 'w-build',
    merchant: 'Higgsfield',
    merchantDomain: 'higgsfield.ai',
    purpose: 'Credits to generate the launch video.',
    amountMinor: 2_900,
    requestedAt: '2026-08-25T12:15:00Z',
    disposition: 'settled',
    decidedAt: '2026-08-25T12:15:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-build-allow', 'r-build-per-tx'],
    reason: 'Approved vendor, below the approval threshold.',
    policyVersion: 4,
    paymentReference: 'pay_3QJ4kMb71',
  },
  {
    id: 'SR-2026-0141',
    seq: 141,
    workspaceId: 'ws-personal',
    agentId: 'a-kimi',
    walletId: 'w-build',
    merchant: 'Namecheap',
    merchantDomain: 'namecheap.com',
    purpose: 'Register the documentation domain before it lapses.',
    amountMinor: 1_216,
    requestedAt: '2026-08-21T10:11:00Z',
    disposition: 'settled',
    decidedAt: '2026-08-21T10:11:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-build-allow', 'r-build-per-tx'],
    reason: 'Approved vendor, below the approval threshold.',
    policyVersion: 4,
    paymentReference: 'pay_3QH2dSv18',
  },
  {
    id: 'SR-2026-0139',
    seq: 139,
    workspaceId: 'ws-personal',
    agentId: 'a-claude-code',
    walletId: 'w-build',
    merchant: 'Vercel',
    merchantDomain: 'vercel.com',
    purpose: 'Preview deployment bandwidth overage.',
    amountMinor: 7_500,
    requestedAt: '2026-08-19T22:41:00Z',
    disposition: 'expired',
    decidedAt: '2026-08-20T22:41:00Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-build-allow', 'r-build-approval'],
    reason: 'Waited 24 hours for a countersignature and received none. Authority lapsed.',
    policyVersion: 4,
  },
  {
    id: 'SR-2026-0136',
    seq: 136,
    workspaceId: 'ws-personal',
    agentId: 'a-gemini',
    walletId: 'w-everyday',
    merchant: 'Uniqlo',
    merchantDomain: 'uniqlo.com',
    purpose: 'Replacement order after the first arrived damaged.',
    amountMinor: 4_500,
    requestedAt: '2026-08-14T18:20:00Z',
    disposition: 'refunded',
    decidedAt: '2026-08-14T18:20:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-every-per-tx'],
    reason: 'Allowed at the time. Reversed on 18 August after the item was returned.',
    policyVersion: 2,
    paymentReference: 'pay_3QG1xWq55',
  },

  // --- Northwind Labs
  {
    id: 'SR-2026-0912',
    seq: 912,
    workspaceId: 'ws-northwind',
    agentId: 'a-nw-hermes',
    walletId: 'w-growth',
    merchant: 'Google Ads',
    merchantDomain: 'ads.google.com',
    purpose: 'Launching the Q3 retargeting campaign. Initial daily budget.',
    amountMinor: 5_000,
    requestedAt: '2026-08-30T13:10:00Z',
    disposition: 'awaiting',
    matchedRuleIds: ['r-growth-allow', 'r-growth-approval'],
    reason: 'Every campaign launch waits for a countersignature, whatever the amount.',
    policyVersion: 7,
  },
  {
    id: 'SR-2026-0911',
    seq: 911,
    workspaceId: 'ws-northwind',
    agentId: 'a-nw-clawbot',
    walletId: 'w-procurement',
    merchant: 'Figma',
    merchantDomain: 'figma.com',
    purpose: 'Annual seat renewal for the design team, 12 seats.',
    amountMinor: 180_000,
    requestedAt: '2026-08-30T09:05:00Z',
    disposition: 'awaiting',
    matchedRuleIds: ['r-proc-per-tx', 'r-proc-approval'],
    reason: '$1,800.00 is above $1,000.00 and needs two signatures. One received.',
    policyVersion: 5,
  },
  {
    id: 'SR-2026-0910',
    seq: 910,
    workspaceId: 'ws-northwind',
    agentId: 'a-nw-claude',
    walletId: 'w-platform',
    merchant: 'Cloudflare',
    merchantDomain: 'cloudflare.com',
    purpose: 'Workers paid plan for the new edge routing service.',
    amountMinor: 2_500,
    requestedAt: '2026-08-30T15:31:00Z',
    disposition: 'settled',
    decidedAt: '2026-08-30T15:31:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-plat-allow', 'r-plat-per-tx'],
    reason: 'Approved vendor, below the $500.00 approval threshold.',
    policyVersion: 11,
    paymentReference: 'pay_3QKAzYt66',
  },
  {
    id: 'SR-2026-0909',
    seq: 909,
    workspaceId: 'ws-northwind',
    agentId: 'a-nw-codex',
    walletId: 'w-platform',
    merchant: 'Datadog',
    merchantDomain: 'datadoghq.com',
    purpose: 'Additional log ingestion during the incident review.',
    amountMinor: 62_000,
    requestedAt: '2026-08-29T08:12:00Z',
    disposition: 'settled',
    decidedAt: '2026-08-29T08:47:00Z',
    decidedBy: 'Priya Raman',
    matchedRuleIds: ['r-plat-allow', 'r-plat-approval'],
    reason: '$620.00 exceeded the $500.00 threshold. Countersigned by Finance.',
    policyVersion: 11,
    countersignedBy: 'Priya Raman',
    countersignedAt: '2026-08-29T08:47:00Z',
    paymentReference: 'pay_3QK6hFg30',
  },
  {
    id: 'SR-2026-0907',
    seq: 907,
    workspaceId: 'ws-northwind',
    agentId: 'a-nw-hermes',
    walletId: 'w-growth',
    merchant: 'Meta Ads',
    merchantDomain: 'business.facebook.com',
    purpose: 'Scaling the best performing creative set beyond its daily cap.',
    amountMinor: 250_000,
    requestedAt: '2026-08-28T16:55:00Z',
    disposition: 'denied',
    decidedAt: '2026-08-28T16:55:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-growth-per-tx'],
    reason: '$2,500.00 exceeds the $2,000.00 cap on a single campaign charge.',
    policyVersion: 7,
  },
  {
    id: 'SR-2026-0904',
    seq: 904,
    workspaceId: 'ws-northwind',
    agentId: 'a-nw-clawbot',
    walletId: 'w-procurement',
    merchant: 'Linear',
    merchantDomain: 'linear.app',
    purpose: 'Business plan renewal, 24 seats.',
    amountMinor: 43_200,
    requestedAt: '2026-08-26T11:00:00Z',
    disposition: 'settled',
    decidedAt: '2026-08-26T11:00:01Z',
    decidedBy: 'Policy',
    matchedRuleIds: ['r-proc-per-tx'],
    reason: '$432.00 is below the $1,000.00 two-signature threshold.',
    policyVersion: 5,
    paymentReference: 'pay_3QJ6tHn87',
  },
];

/**
 * Builds the chain of custody for a request from its facts.
 *
 * In the real system these entries are written as they happen and never
 * derived. Here they are generated so the demo stays consistent, but the shape
 * and the ordering are exactly what the audit view will render in production.
 */
function buildCustody(seed: RequestSeed, agent: Agent, wallet: Wallet): CustodyEntry[] {
  const entries: CustodyEntry[] = [
    {
      seq: 1,
      at: seed.requestedAt,
      actor: agent.name,
      actorKind: 'agent',
      action: 'Requested authority to spend',
      detail: seed.purpose,
    },
    {
      seq: 2,
      at: seed.requestedAt,
      actor: 'Agent Wallet',
      actorKind: 'system',
      action: 'Verified agent identity and wallet grant',
      detail: `${agent.handle} holds an active grant on ${wallet.name}.`,
    },
    {
      seq: 3,
      at: seed.requestedAt,
      actor: 'Policy engine',
      actorKind: 'system',
      action: `Evaluated ${seed.matchedRuleIds.length} rules against policy v${seed.policyVersion}`,
      detail: seed.reason,
    },
  ];

  let seq = 4;

  if (seed.disposition === 'awaiting') {
    entries.push({
      seq: seq++,
      at: seed.requestedAt,
      actor: 'Agent Wallet',
      actorKind: 'system',
      action: 'Held for countersignature',
      detail: 'No payment authority issued. The agent is waiting.',
    });
    return entries;
  }

  if (seed.disposition === 'denied') {
    entries.push({
      seq: seq++,
      at: seed.decidedAt ?? seed.requestedAt,
      actor: 'Policy engine',
      actorKind: 'system',
      action: 'Refused',
      detail: 'No payment credential was created. Nothing was sent to the provider.',
    });
    return entries;
  }

  if (seed.disposition === 'expired') {
    entries.push({
      seq: seq++,
      at: seed.decidedAt ?? seed.requestedAt,
      actor: 'Agent Wallet',
      actorKind: 'system',
      action: 'Authority lapsed',
      detail: 'The approval window closed without a signature. The request is void.',
    });
    return entries;
  }

  if (seed.countersignedBy && seed.countersignedAt) {
    entries.push({
      seq: seq++,
      at: seed.countersignedAt,
      actor: seed.countersignedBy,
      actorKind: 'human',
      action: 'Countersigned',
      detail: 'Signed on a trusted device. The signature covers this exact amount and merchant.',
    });
  }

  entries.push({
    seq: seq++,
    at: seed.decidedAt ?? seed.requestedAt,
    actor: 'Agent Wallet',
    actorKind: 'system',
    action: 'Issued single-use payment credential',
    detail: `Locked to ${seed.merchant}, capped at this amount, expires in 60 minutes. The agent never sees a card number.`,
  });

  entries.push({
    seq: seq++,
    at: seed.decidedAt ?? seed.requestedAt,
    actor: 'Payment provider',
    actorKind: 'provider',
    action: 'Payment authorised',
    detail: seed.paymentReference ? `Provider reference ${seed.paymentReference}.` : undefined,
  });

  if (seed.disposition === 'settled' || seed.disposition === 'refunded') {
    entries.push({
      seq: seq++,
      at: seed.decidedAt ?? seed.requestedAt,
      actor: 'Payment provider',
      actorKind: 'provider',
      action: 'Settled',
      detail: 'Confirmed by the provider and reconciled against this record.',
    });
  }

  if (seed.disposition === 'refunded') {
    entries.push({
      seq: seq++,
      at: '2026-08-18T09:30:00Z',
      actor: 'Payment provider',
      actorKind: 'provider',
      action: 'Reversed in full',
      detail: 'Refund posted as a new entry. The original entry is preserved unchanged.',
    });
  }

  return entries;
}

function hydrate(seed: RequestSeed): SpendRequest {
  const agent = AGENTS.find((a) => a.id === seed.agentId);
  const wallet = WALLETS.find((w) => w.id === seed.walletId);
  if (!agent || !wallet) {
    throw new Error(`Seed ${seed.id} references a missing agent or wallet.`);
  }
  return {
    ...seed,
    currency: wallet.currency,
    custody: buildCustody(seed, agent, wallet),
  };
}

export const SPEND_REQUESTS: readonly SpendRequest[] = REQUEST_SEEDS.map(hydrate);
