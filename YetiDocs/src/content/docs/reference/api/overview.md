---
title: Core API Overview
description: What the Core API owns and what it never does.
sidebar:
  order: 1
---

# Core API Overview

The Core API is the platform brain. It owns:

- Wallet auth (`/auth/nonce`, `/auth/verify`) → JWT
- `/me/*` endpoints: balances, ledger, stats
- Tenant/SaaS: group subscriptions, trials, add-ons, feature gating
- Module registry: scope modules to their own treasuries (“buckets”)
- Intents: store “to be relayed” actions (withdraw/swap/bridge/session config)

## What Core API never does

- It does **not** broadcast on-chain transactions (Relayer does)
- It does **not** store long-lived hot broadcaster private keys

## Non-negotiables

- Ledger + balances must be explainable and auditable
- Every balance-changing operation should be idempotent via `refId`
