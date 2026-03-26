---
title: SDK & Templates
description: Recommended patterns for auth, entitlements, ledger safety, and refId.
sidebar:
  order: 2
---

# SDK & Templates

## The goal

Ship modules fast without rebuilding auth, billing, accounting, and safety from scratch.

## What an SDK should include

- Auth helpers (module auth + user auth where needed)
- Entitlement checks (subscription status → feature gate)
- Ledger helpers (credit in/out with strict validation)
- Idempotency everywhere (`refId` required)
- Starter templates (game module, utility module)

## Two rules to follow

1. **Never bypass solvency or ledger rules**.
2. **Never operate outside your scoped treasuries (“bucket isolation”)**.
