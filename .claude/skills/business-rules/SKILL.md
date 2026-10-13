---
name: business-rules
description: Implement or change domain logic — wallet/ledger and money, order status transitions, trial limits, moderation, refunds, settings-driven values. Use whenever code touches money, order status, trial counting, moderation or customer-visible files.
---

# Business rules

Source of truth: `docs/BUSINESS_LOGIC.md`. Read the relevant section first and
quote the rule (section number) in your summary. If the request contradicts the
doc, ask the owner before coding; if it changes a rule, update the doc in the
same change.

## Money (§6)

- Amounts are integer tiyin, `bigint` columns, `string`/`bigint` in TS — never `number`
  arithmetic on floats, never so'm decimals.
- Balance = `SUM(wallet_transactions.amount)`; no stored balance column is authoritative.
- Transactions are append-only. Fix mistakes with a reversing row.
- Every row has a unique `idempotency_key` (e.g. `order:<id>:charge`,
  `payme:<transaction_id>`); insert with conflict detection and treat a duplicate as success.
- Debit flow, all in one `dataSource.transaction()`:
  lock the wallet row (`SELECT ... FOR UPDATE` / `lock: { mode: 'pessimistic_write' }`),
  compute balance, reject if insufficient, insert the negative row, update the order.
- `ADJUSTMENT` requires the `wallet.adjust` permission and a reason; always audit-logged.
- Bonus and main money are separate pockets (§6.3): spend bonus first, refund to the
  pocket it came from; bonus is never withdrawable.

## Order status (§7.2)

- One transition map (`from → allowed to[]` + who may do it) in a single module;
  a single `transition(orderId, to, actor, comment)` method enforces it.
- Each transition writes `order_status_history` and an audit row in the same DB
  transaction, then enqueues a notification job (after commit).
- Cancellation/refund rules per §7.3; refunds go back to the wallet, never cash.
- Prices are snapshotted on the order at payment time.

## Trial (§5)

- Limit is per verified **phone**, counted on successful generation only.
- Check `ai.daily_budget_usd` against today's `generation_logs` cost before enqueueing.
- One active generation per user; same child + template reuses the existing trial.

## Moderation (§8)

- Keep every page version; mark the one approved for print.
- Order can be approved only when all pages are approved.

## Settings

Read undecided values via `SettingsService.get(key)`; add new keys with a seed
migration (`db-migration` skill) and list them in §15. Never hard-code them.

## Files (§11)

Customer endpoints return only watermarked low-res previews through short-lived
signed URLs. Full-res pages and print PDFs are admin-only (`logistics`), audited.

## Tests

Every rule above gets a vitest unit test (pure functions for transition maps,
price calculation, limit checks). Money and transitions also get a DB-level test
or a scripted curl smoke test showing concurrent/duplicate requests don't
double-charge.
