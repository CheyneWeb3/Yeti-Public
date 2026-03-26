---
title: Architecture Overview
description: Responsibilities, boundaries, and why the split matters.
sidebar:
  order: 1
---

# Architecture Overview

YetiCashier is designed as split services so you can scale features without mixing custody risk.

## Split of duties

- **Core API**: business truth, accounting, tenant/subscription state, module isolation, intent queue.
- **Relayer**: holds the hot broadcaster key and only submits transactions.
- **Indexer**: watches on-chain events and writes verified facts into the DB.
- **Telegram module**: UX + community controls; it never signs wallet actions.

## Why this split matters

- The core surface area stays safe (no hot key exposure).
- Execution is auditable (intents → tx hash → indexed events).
- You can disable modules without disabling the cashier.
- Third-party modules become possible because access is scoped to their own buckets.

## Data flow at a glance

1. User/module requests an action (tip, wager, withdraw, etc.)
2. Core validates policy + entitlements + idempotency (`refId`)
3. Core creates an **intent** (if on-chain execution is needed)
4. Relayer submits the on-chain transaction
5. Indexer ingests events for reconciliation/analytics
6. Core finalizes balances/ledger based on the confirmed result
