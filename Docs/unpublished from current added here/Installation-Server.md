---
title: Installation & Setup
description: Full installation details for the system.
sidebar:
  order: 3
---


# YetiCashier — Installation & Setup (Latest Zip)

This guide installs the full MVP stack locally (or on a single VPS) exactly matching the current repo layout:

- `services/core-api` — API + ledger + SaaS + module registry (NO private keys)
- `services/relayer` — hot key broadcaster (executes intents on-chain)
- `services/indexer` — watches vault events and posts them into Core
- `services/tg-bot` — Telegram runner that authenticates as a module
- `modules/tg` — TG commands implementation (drop-in module pattern)
- `packages/common` — shared types/config

---

## 1) Prerequisites

### Required
- **Node.js 18+** (20+ recommended)
- **npm** (comes with Node)
- **MongoDB** with **replica set enabled** (even single-node) — required for Mongo transactions
- (Optional) **PM2** for production process management
- (Optional) **cloudflared** for exposing services via Cloudflare Tunnel

### Network / chain assumptions
- MVP targets **BSC (chainId 56)**
- Vault addresses and chain configuration live in:
  - `services/core-api/config/system.json`

---

## 2) Unzip / install dependencies

From the repo root:

```bash
npm install
```


---

## 3) MongoDB replica set (single node)

Mongo transactions require a replica set, even if you only have one Mongo instance.

### Option A — System Mongo (Linux)
1) Edit your `mongod.conf` to include:

```yaml
replication:
  replSetName: rs0
```

2) Restart Mongo and initialize the replica set:

```bash
sudo systemctl restart mongod
mongosh --eval 'rs.initiate()'
```

3) Verify:

```bash
mongosh --eval 'rs.status()'
```

### Option B — Docker (quickest for dev)
Example docker run (single-node replset):

```bash
docker run -d --name mongo-yc -p 27017:27017 mongo:6   --replSet rs0 --bind_ip_all
docker exec -it mongo-yc mongosh --eval 'rs.initiate()'
```

Mongo URI for `.env` then becomes:

```text
mongodb://127.0.0.1:27017/yeticashier
```

---

## 4) Configure Core API

### 4.1 Create `.env`
```bash
cd services/core-api
cp .env.example .env
```

### 4.2 Edit required values

**Required**
- `MONGO_URI=...`
- `JWT_SECRET=...` (generate with: `openssl rand -hex 64`)
- `RELAYER_SHARED_KEY=...` (long random)
- `INDEXER_SHARED_KEY=...` (long random)
- `FEE_TREASURY_ID=fees` (default OK)

**Optional / feature flags**
- `WITHDRAW_FEE_BPS=50` (0.50% default)
- `ENABLE_TG_SESSION_WITHDRAW=0` (keep 0 until you have session setup UX)
- `SESSION_KEY_ENC_SECRET=...` (required only if session-withdraw is enabled; `openssl rand -hex 32`)

### 4.3 Start Core API
From `services/core-api`:

```bash
npm run dev
```

Confirm:
- `GET http://localhost:8088/health` returns OK
- `GET http://localhost:8088/config/public` returns config JSON

---

## 5) Configure and start the Relayer

The relayer is the **only** component that holds a hot private key for broadcasting transactions.

### 5.1 Create `.env`
```bash
cd ../relayer
cp .env.example .env
```

### 5.2 Edit required values
- `CORE_API_URL=http://localhost:8088`
- `RELAYER_SHARED_KEY=` **(must match Core)**
- `RELAYER_PRIVATE_KEY=0x...` (hot key)
- `POLL_MS=1500` (default OK)

### 5.3 Start relayer
```bash
npm run dev
```

---

## 6) Configure and start the Indexer

Indexer watches vault events (deposit/withdraw + token enable/disable events) and posts them into Core.

### 6.1 Create `.env`
```bash
cd ../indexer
cp .env.example .env
```

### 6.2 Edit required values
- `CORE_API_URL=http://localhost:8088`
- `INDEXER_SHARED_KEY=` **(must match Core)**
- `CONFIG_PATH=../core-api/config/system.json`
- `START_BLOCK=0` (for a fresh DB; set higher to reduce historical scanning)
- `POLL_MS=3000` (default OK)

### 6.3 Start indexer
```bash
npm run dev
```

---

## 7) Configure Telegram bot module (tg-bot)

The Telegram bot service authenticates to Core as a **module** using a module key.
You must **register the tg module** first to obtain `TG_MODULE_KEY`.

### 7.1 Register the TG module in Core (admin)
1) Obtain an admin JWT via wallet login:
- `POST /auth/nonce`
- sign nonce in wallet
- `POST /auth/verify` → returns JWT

2) Call admin endpoint (example payload):
- `POST /admin/modules/register`
```json
{
  "moduleId": "tg",
  "controllerAddress": "0xYOUR_ADMIN_OR_CONTROLLER_WALLET",
  "allowedTreasuries": ["tg-main"]
}
```

Response includes the **one-time module key** (save it — you’ll paste it into tg-bot `.env`).

> If you re-register, Core will rotate the module key (old key stops working).

### 7.2 Create `.env`
```bash
cd ../tg-bot
cp .env.example .env
```

### 7.3 Edit required values
- `TELEGRAM_BOT_TOKEN=...`
- `CORE_API_URL=http://localhost:8088`
- `TG_MODULE_ID=tg`
- `TG_MODULE_KEY=...` (from admin register)
- `TREASURY_ID=tg-main`
- `CHAIN_ID=56`

Optional feature flags:
- `ENABLE_RAIN=1` / `ENABLE_MONSOON=1`
- `ENABLE_TG_SESSION_WITHDRAW=0` (only enable when ready)
- `WITHDRAW_DEFAULT_CHAIN_ID=56`
- `WITHDRAW_DEFAULT_VAULT_ID=main`
- `WITHDRAW_DEFAULT_ASSET=native`

### 7.4 Start tg-bot
```bash
npm run dev
```

---

## 8) Configure `system.json` (chains + vaults)

Path:
- `services/core-api/config/system.json`

This is the source of truth for:
- enabled chains (BSC)
- vault IDs and addresses
- RPC endpoints
- token metadata (seed list / display)

**Important note about token lists:**  
The vault uses mappings, so the platform cannot enumerate enabled tokens by on-chain reads alone. The indexer maintains the enabled-token set by ingesting:
- `TokenEnabled(token, decimals)`
- `TokenDisabled(token)`

Core then exposes:
- `GET /vault/config?chainId=...&vaultId=...`

---

## 9) Quick verification checklist

### Core
- `/health` returns OK
- `/config/public` returns config
- wallet login works (`/auth/nonce` → `/auth/verify`)

### Relayer
- polls Core without auth failures
- can mark intents (shared key matches)

### Indexer
- reads `system.json`
- posts events to Core successfully (shared key matches)

### Telegram bot
- starts and can call Core
- module key is accepted (no 401)
- commands are gated correctly by your module configuration

---

## 10) Production notes (single VPS)

### Recommended process manager (PM2)
Install:
```bash
npm i -g pm2
```

Typical approach:
- run Core, Relayer, Indexer, tg-bot as separate PM2 apps
- ensure each service has its own `.env`
- use `pm2 save` and startup scripts

### Secrets
- Keep `RELAYER_PRIVATE_KEY` only on the relayer host/service.
- Keep `RELAYER_SHARED_KEY` and `INDEXER_SHARED_KEY` private.
- Rotate module keys if leaked (`/admin/modules/register` again).

### Monitoring
- Watch relayer backlog (pending intents)
- Watch indexer lag (block height vs head)
- Add alerting around error rates and failed intents

---

## 11) Optional: TG “no wallet popup” withdrawals (session key)

The repo includes env flags and plumbing for session-withdraw, but it becomes safe and usable only when you have a one-time session setup flow (web app) that:
1) links TG ↔ wallet, and
2) authorizes a session key on-chain with limits.

When you are ready:
- set `ENABLE_TG_SESSION_WITHDRAW=1` in Core and tg-bot
- set `SESSION_KEY_ENC_SECRET` in Core
- configure token limits via `TG_SESSION_TOKEN_LIMITS_JSON` (optional)

Until then, withdrawals should be **wallet-signed per withdraw**.

---

## 12) Common issues

### “Mongo transactions require a replica set”
You forgot to enable replSet. Follow Section 3 and restart Mongo.

### “401 relayer” or “401 indexer”
Shared keys don’t match between Core and relayer/indexer env files.

### Telegram bot runs but commands fail
- module not registered (missing TG_MODULE_KEY)
- allowed treasuries don’t include `tg-main`
- Core URL wrong (Cloudflare tunnel mismatch)

---

## Appendix: Service ports (defaults)
- Core API: `8088`
- Mongo: `27017`
- Others: no public ports required (they call Core)
