---
title: Quickstart
description: What the system is, what it already does, and how to validate the first end-to-end flow.
sidebar:
  order: 1
---

# YetiCashier System (Phase 1 BSC MVP) — Core API + Relayer + Indexer + Telegram Module

**enterprise core with split modules**:
- **Core API** handles: auth, credits ledger, user balances, module registry, intents, and public endpoints for miniapps/dapps.
- **Relayer** is a **separate service** that holds the **hot private key** and only submits vault transactions.
- **Indexer** is a separate watcher that ingests on-chain vault events (deposit/withdraw/CCIP) into the database for UIs/analytics.
- **Telegram** lives as a **module** and is run by its own service (`tg-bot`).
- **Chains/vaults are configured in a JSON config file** (not env), including enable/disable.

> **BSC-only for now**: config contains only chainId `56`, but the structure is ready for more chains + more vaults.

---

## Repo layout

```
packages/common            Shared types + Zod config schema
services/core-api          Main API (NO private keys)
services/relayer           Vault transaction sender (HOLDS the hot key)
services/indexer           Vault log watcher (NO private keys)
services/tg-bot            Telegram runner (uses module API)
modules/tg                 Telegram commands module (drop-in pattern)
```

---

## What this system already does

### ✅ Secure core primitives
- Wallet login (`/auth/nonce` + `/auth/verify`) → JWT
- Mongo-backed **credits ledger** with **idempotency keys** (`refId`) to prevent double-spends
- Per-user balances query (`/me/balances`) + ledger view (`/me/ledger`)
- **Module registry** (admin-controlled): modules get an API key that is **scoped** to their own treasuries (“buckets”)
- Admin treasury management (create treasuries, transfer between treasuries)

### ✅ Vault integration (enterprise split)
- Core API stores **vault intents** (withdraw / native withdraw / bridge stubs), validates user JWT, and enforces idempotency.
- Relayer polls core, submits transactions on-chain, and reports tx status back.
- Indexer polls chains/vaults and stores raw on-chain event records for miniapps + dashboards.

### ✅ Telegram as a module
- Telegram commands live in `modules/tg`.
- The Telegram bot service (`services/tg-bot`) authenticates to Core API as a module (not as an admin).

---

## Key security rules baked in

1) **No hot keys in Core API**
- `core-api` never sees a signing private key.

2) **Module isolation (3rd party safety)**
- A module can only debit/credit accounts involving treasuries that belong to that module.
- It cannot touch other module treasuries (“buckets”).

3) **Admin can rebalance own buckets**
- Admin-only endpoints allow treasury creation and treasury-to-treasury transfers.

4) **Idempotency everywhere**
- Every balance-changing action requires a `refId` that is enforced unique.

5) **Transactions for solvency**
- Ledger + balances update is done in a Mongo transaction.
- This requires Mongo running as a **replica set** (even single-node). Instructions below.

---

## Config (not env)

Chains/vault enable/disable is in:

- `services/core-api/config/system.json`

This holds:
- chain list (BSC enabled)
- vault list for that chain
- default token allowlist metadata (addresses/decimals are still read from chain when needed)

Secrets stay in env (`JWT_SECRET`, shared keys, Mongo URI, relayer private key).

---

## Running Internally (dev)

### 1) Mongo replica set (single node)
Transactions require a replSet. On Linux:

```bash
# 1) Edit mongod.conf and add:
# replication:
#   replSetName: rs0

sudo systemctl restart mongod
mongosh --eval 'rs.initiate()'
```

### 2) Install deps
From repo root:

```bash
npm install
```

### 3) Core API
```bash
cd services/core-api
cp .env.example .env
npm run dev
```

### 4) Register your Telegram module (admin)
Use your admin wallet JWT (login via /auth):

- `POST /admin/modules/register` with:
  - moduleId: "tg"
  - controllerAddress: your admin or module controller wallet
  - allowedTreasuries: ["tg-main"]

The response returns the one-time module key.

### 5) Relayer
For development prior to hand off to governance.
```bash
cd services/relayer
cp .env.example .env
# set RELAYER_PRIVATE_KEY
npm run dev
```

### 6) Indexer
```bash
cd services/indexer
cp .env.example .env
npm run dev
```

### 7) Telegram bot
```bash
cd services/tg-bot
cp .env.example .env
# set TELEGRAM_BOT_TOKEN and module key
npm run dev
```

---

## Core API endpoints (high level)

### Public / Dapp / Miniapp
- `GET /health`
- `GET /config/public`
- `POST /auth/nonce`
- `POST /auth/verify`
- `GET /me/balances`
- `GET /me/ledger`
- `GET /me/events`

### User actions (credits layer)
- `POST /ledger/transfer` (user-to-user transfer; idempotent)
- `POST /vault/intents/withdraw` (creates withdraw intent; relayer executes)

### Admin (wallet-auth)
- `POST /admin/modules/register`
- `POST /admin/modules/rotateKey`
- `POST /admin/treasuries/create`
- `POST /admin/treasuries/transfer`

### Module (API key)
- `POST /modules/:moduleId/ledger/transfer` (scoped; can only touch owned allowed treasuries)

### Internal (shared secret)
- `GET /relayer/intents` + `POST /relayer/intents/:id/mark`
- `POST /internal/indexer/event`

---

## Drop-in modules pattern

- Each module lives under `modules/<id>`.
- The **only** thing you change to enable/disable behavior is:
  - config + admin registration (module key)
  - and/or service env flags

No core rewrites required for module additions.

---

## Next upgrades

- Multi-relayer quorum (N-of-M)
- Vault intent signing policy upgrades (operator set rotation, multi-sig approvals, etc.)
- CCIP full flow
- Per-module risk limits + circuit breakers
- Websocket event streaming
- Time Lock Multisig Governance (Core system control)
