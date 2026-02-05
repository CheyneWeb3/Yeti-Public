---
title: Core Principles
description: Solvency, split-of-duties, idempotency, and fees.
sidebar:
  order: 1
---

# YetiCashier System (BSC MVP) — Technical Reference

This is the technical reference for the **YetiCashier System (BSC MVP)**: a modular **cashier + credits + Telegram + games + SaaS** platform.

---

## 1) Core principles

### 1.1 Strict solvency
- Credits are stored as **integer smallest units** (respect token decimals).
- The ledger must be **strictly 1:1 solvent**: credits only exist when backed by on-chain custody (no token, no credit).
- Any movement of credits must be recorded in an append-only style ledger with idempotent `refId`s.

### 1.2 Split of duties
- **Core API**: business truth, policies, accounting, tenant/subscription state, module isolation, intent queue.
- **Relayer**: holds the **hot broadcaster key** and only submits transactions.
- **Indexer**: watches on-chain events and writes verified facts into the database for reconciliation/analytics.
- **Telegram module**: UX + community controls; it never “signs” wallet actions.

### 1.3 Fee policy
Day-1 policy:
- **3%** fee to dev/fee address on all transactions **except**:
- **withdraw/send/deposit** which have **0.5%** fee.

(Implement fees at ledger-layer and, if needed, enforce in module commands.)

---

## 2) Services

### 2.1 Core API
Responsibilities:
- Wallet auth (`/auth/nonce`, `/auth/verify`) -> JWT (token-mode).
- `/me/*` user endpoints: balances, ledger, stats.
- Tenant/SaaS: group subscriptions, trials, add-ons, feature gating.
- Module registry: allow modules to operate only within their own scope.
- Intents: create and store “to be relayed” actions (withdraw/swap/bridge/session config).

Core API does NOT:
- broadcast on-chain transactions (relayer does)
- store long-lived hot broadcaster private keys

### 2.2 Relayer
Responsibilities:
- Poll pending intents from Core API.
- Submit on-chain transactions to the vault (and only allowlisted targets/selectors when hardening is enabled).
- Mark intents as submitted/confirmed/failed.

Relayer does NOT:
- decide user authorization (must be proven by EIP-712 signatures or explicit module policy)
- write to DB directly

### 2.3 Indexer
Responsibilities:
- Watch vault events (deposit/withdraw/bridge).
- Ingest into DB for UI, analytics, and reconciliation.
- Provide re-sync capability if Core/Relayer restart.

---

## 3) On-chain layer

### 3.1 Vault contract
Core properties (as designed in this project):
- Multi-token custody vault.
- Deposit emits actual received amount (fee-on-transfer safe).
- Withdraw/swap/bridge execution is authorized via EIP-712 signatures.
- Security hardening options:
  - selector allowlist (recommended day-1: enabled)
  - target allowlist
  - optional pair allowlist

### 3.2 Authorization modes
There are two authorization tracks for withdrawals:

**A) Wallet-signed withdraw (always supported)**
- The user signs EIP-712 typed-data in a normal wallet environment.
- The relayer submits the signed call to the vault.
- Signer = the user wallet.

**B) Session-key withdraw (enables “TG withdraw without wallet popup”)**
- The user authorizes a session key on-chain once (wallet signs once in a web app).
- Session key has strict limits (token allowlist, per-token caps, max-per-tx, expiry).
- After that, the backend can sign withdraw typed-data with the session key.
- Relayer submits.
- Signer = the session key (not Telegram).

Telegram cannot do the EIP-712 signing step; it can only trigger flows once linking + session authorization is completed externally.

---

## 4) Data model (MongoDB)

### 4.1 Users
`users`
- `wallet` (EVM address)
- `createdAt`
- optional: profile fields

### 4.2 Credits balances
`balances`
- `wallet` (or internal `userId`)
- `assetKey` (native or ERC20 address; optionally tokenId mapping)
- `amountRaw` (string or Long, smallest units)

### 4.3 Ledger (accounting log)
`ledger`
- `refId` (idempotency)
- `type` (deposit, tip, rain, bet, win, withdraw, fee, admin_adjust, module_transfer)
- `from` / `to` (wallets or buckets)
- `bucketFrom` / `bucketTo` (for module/tenant treasuries)
- `assetKey`
- `amountRaw`
- `feeRaw`
- `createdAt`
- `meta` (txHash, chatId, moduleId, etc.)

Solvency: you can audit that total credits match total backing (by asset) once indexer-backed custody totals are known.

### 4.4 Tenants (Telegram groups = SaaS customers)
`tenants`
- `chatId` (primary tenant key; subscription is NOT transferable between groups)
- `createdAt`
- `planStatus`: `trial | active | expired`
- `trialUsed`: boolean (trial is 7 days and cannot be purchased)
- `subSecondsRemaining` (or `subDaysRemaining`)
- `subLastChargedAt`
- `billingMode`: `bundle | daily_topup`
- `planSku`: `monthly | quarterly | yearly | eons3y | null`
- `features`: flags (dice enabled, lottery enabled, withdraw enabled, etc.)
- `addons`: map `{ addonId: { enabled, expiresAt, priceModel } }`

### 4.5 Telegram linking
`tg_link_requests`
- `code`
- `tgId`
- `chatId` (optional, if you want binding per group)
- `expiresAt` (TTL index)

`tg_links`
- `tgId`
- `wallet`
- `createdAt`

### 4.6 Modules and treasuries/buckets
`modules`
- `moduleId`
- `ownerWallet` (admin-approved)
- `enabled`
- `scopes` / permissions

`treasuries` (bucket accounting)
- `bucketId` (examples: `tenant:<chatId>:module:<moduleId>`, `fees`, `game:<id>`)
- `assetKey`
- `amountRaw`

Rule: third-party modules must only be able to affect their own buckets (never other buckets).

### 4.7 Intents (relayer queue)
`vaultIntents`
- `intentId`
- `refId` (idempotency key)
- `action`:
  - `withdraw`
  - `withdraw_native`
  - `swap`
  - `bridge`
  - `register_session`
  - `config_session_token`
- `chainId`
- `vaultId`
- `ownerWallet`
- `payload` (message fields: token, to, amountRaw, deadline, nonce, etc.)
- `sig` (owner sig or session sig depending on action)
- `status`: `pending | submitted | confirmed | failed`
- `txHash` (optional)
- `error` (optional)
- timestamps

---

## 5) SaaS subscription model

### 5.1 Trial
- 7-day trial, one-time only.
- Trial cannot be purchased.
- Trial is keyed at least by `chatId`. (Optional later: also key by “owner account” to prevent farming trials via new groups.)

### 5.2 Paid access
After trial ends, a group must become `active` via:
- bundle purchase (monthly/quarterly/yearly/3-year), or
- “subb additions”: top-up time at **$5.50/day**.

All access is represented by remaining seconds/days.

### 5.3 Lazy time burn (MVP-friendly)
No cron required. On each command:
1. `elapsed = now - subLastChargedAt`
2. `subSecondsRemaining = max(0, subSecondsRemaining - elapsed)`
3. update `subLastChargedAt = now`
4. if remaining == 0 => `planStatus = expired`

### 5.4 Base package feature set
Base package includes group access to:
- `/tip`
- `/rain`
- `/monsoon`
- `/dice`
- `/lottery`

Add-ons can extend this list and define their own pricing and policies.

---

## 6) Telegram integration & command gating

### 6.1 Tenant gating
For each command in a group:
1. resolve `chatId`
2. load `tenant`
3. enforce subscription:
   - trial: allowed while time remains
   - active: allowed while time remains
   - expired: deny with “subscribe or daily top-up”
4. enforce per-feature flags (dice enabled, etc.)
5. execute action by calling Core API endpoints

### 6.2 DM-only gameplay
Gameplay commands should be DM-only (per project rule). Admin actions can remain in group context.

---

## 7) Withdraw flows (technical)

### 7.1 Wallet-signed withdraw (standard)
1. User logs in with wallet (JWT):
   - `POST /auth/nonce`
   - `POST /auth/verify`
2. Frontend requests typed data for withdrawal (or constructs it using contract values).
3. User signs EIP-712 typed data.
4. Core API creates a withdraw intent:
   - `action = withdraw` or `withdraw_native`
   - stores payload + sig
5. Relayer polls pending intents and submits to vault.
6. Indexer sees events; Core reconciles ledger.

### 7.2 Session-key withdraw (TG “no wallet popup”)
This requires a separate web app for the one-time signature.

**Link (no signing):**
- TG bot issues a link code.
- User confirms in web app after wallet login, binding `tgId -> wallet`.

**Authorize session (one-time signing in web app):**
- User signs `registerSessionWithSig` typed data.
- Relayer submits.
- Optionally configure token limits with `configSessionTokenWithSig`.

**Use from Telegram:**
- TG bot requests a withdraw.
- Core signs the withdraw typed-data with the session key (encrypted at rest).
- Relayer submits.
- Default asset is native, but any configured token can be withdrawn within limits.

---

## 8) Suggested API surface (reference)

> Names may differ by repo; this is the recommended stable contract between services.

### 8.1 Auth
- `POST /auth/nonce` -> `{ address }` => `{ nonce }`
- `POST /auth/verify` -> `{ address, signature }` => `{ token }`

### 8.2 User
- `GET /me/balances`
- `GET /me/ledger`
- `GET /me/stats`

### 8.3 Intents (Core <-> Relayer)
- `GET /relayer/intents?status=pending&limit=50`
- `POST /relayer/intents/:id/mark` -> `{ status, txHash?, error? }`

### 8.4 SaaS (Tenant)
- `GET /tg/tenant/:chatId/status`
- `POST /tg/tenant/:chatId/sub/credit` (admin/manual) -> `{ seconds }`
- `POST /tg/tenant/:chatId/sub/topup` (daily rate) -> `{ days }`

### 8.5 TG link (for session withdraw track)
- `POST /tg/link/request` -> `{ tgId }` => `{ code, expiresAt }`
- `POST /me/tg/link/confirm` (JWT) -> `{ code }`

### 8.6 Session (for session withdraw track)
- `POST /me/session/register/typedData` (JWT) -> typed data for owner signature
- `POST /vault/intents/session/register` (JWT) -> queues register-session intent
- `POST /me/session/config/typedData` (JWT) -> typed data for token limits
- `POST /vault/intents/session/configToken` (JWT) -> queues config intent

---

## 9) Module developer isolation (platform safety)

### 9.1 Module registry
- Modules are registered and enabled by an admin/owner allowlist.
- Each module is granted explicit scopes and gets a dedicated bucket/treasury namespace.

### 9.2 Bucket isolation rule
- A module can only debit/credit within its own bucket(s) and only for assets it is allowed to use.
- A module must never be able to read or write other module buckets.

### 9.3 Intent origin tagging
When a module creates an intent, include:
- `moduleId`
- `tenant chatId`
- `refId`
So intents can be audited and rate limited per module.

---

## 10) Operational notes (single VPS MVP)

Recommended PM2 processes:
- `core-api`
- `relayer`
- `indexer`
- `tg-bot`
- (optional) URL publisher service if using a Cloudflare tunnel + on-chain URL registry pattern

Database:
- MongoDB single node for MVP.
- Later: replica set (durability and read scaling).

Ingress:
- Cloudflare Tunnel for public routing.
- Token-mode CORS for web clients.

---

## 11) Security checklist (day-1)
- Vault: selector allowlist enabled with a tiny set of router functions.
- Relayer key: minimal permissions, rotated and protected.
- Core API:
  - idempotent `refId` on ledger and intents
  - strict validation on amounts/asset keys
  - rate limits per tenant and per module
- Session keys (if enabled):
  - encrypted at rest (AES-GCM)
  - strict on-chain limits (token allowlist, max per tx, expiry)
  - ability to revoke/rotate session keys quickly
