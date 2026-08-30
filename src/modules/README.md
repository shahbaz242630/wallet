# Modules

Business logic lives here — never in React components or route handlers.

Each module owns one bounded area of the product and talks to others through
explicit exported functions, not shared mutable state.

```
shared/          money, ids, result types — no business rules
identity/        users, sessions
organizations/   tenants, members, roles
agents/          agent identities, credentials, grants
wallets/         wallet lifecycle, spending capacity
policies/        the rules engine (deterministic, versioned)
spend-requests/  agent asks to spend -> decision
approvals/       human approval flow and evidence
transactions/    normalised payment records
audit/           append-only event log
providers/       payment partner adapters (all partner-specific code lives here)
```

## Rules

1. Nothing in here may import from `src/app` or `src/components`.
2. Only `providers/` knows a payment partner's name, endpoints or field names.
3. Policy decisions are plain deterministic TypeScript. No AI, no network calls.
4. Every module exports types and functions; no classes holding global state.

When the API becomes a separate service, this folder lifts out whole. Keep it
free of Next.js imports so that stays true.
