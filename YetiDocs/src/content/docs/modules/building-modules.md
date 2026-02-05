---
title: Build Modules
description: Why developers build here, how isolation works, and how modules monetize.
sidebar:
  order: 1
---

## Build Modules on YetiCashier: Ship Faster, Earn More, Sleep Better

If you’ve ever built a crypto bot, a miniapp, or a web3 game, you already know the pain:

* auth is a mess (wallets, sessions, spoofing, replay)
* accounting becomes a nightmare (double spends, refunds, disputes)
* treasury handling is risky (one bug = headline)
* “payments” are duct tape (manual admin, random wallets, no reporting)
* distribution is fragmented (Telegram, web, mobile, Discord… all different)

YetiCashier exists so module developers can stop rebuilding the same infrastructure and focus on what matters: **shipping features people actually use**.

This is a platform where you can plug in a module (game, utility, commerce flow), register it, get scoped permissions, and immediately operate inside real communities across **Telegram + web browsers + social platforms** using the same backbone.

---

# Why build modules here?

### 1) You get instant distribution

You’re not building for “a website.” You’re building for **communities**.

Modules live where attention already is:

* Telegram group chats (high engagement + viral loops)
* Web miniapps (shareable links + embed-ready)
* Social platform flows (commands, prompts, challenges, “play now” links)

When a module performs well in one community, it naturally spreads to others. Communities copy what works.

---

### 2) You don’t touch hot keys

This is the difference between a hobby project and something you can scale.

* Your module does **not** hold the platform’s private key.
* Vault actions are executed by an isolated relayer service.
* You integrate through APIs and signed user intent flows.

So you can build faster *without* carrying existential security risk.

---

### 3) You get solvent credits + a real ledger

Most “credit systems” are fake points. YetiCashier credits are designed to be **solvent and auditable**.

You can:

* accept wagers
* run pots
* charge fees
* settle rewards
* refund cleanly

…and every action is traceable, idempotent, and compatible with proper analytics.

---

### 4) You operate inside your own bucket (module isolation)

When you register a module, you get scoped access to **your treasuries only**.

That means:

* you can debit/credit within your allowed treasuries
* you cannot touch other modules’ funds
* blast radius is limited by design

This is what enables an ecosystem of third-party modules without everything turning into one shared-risk blob.

---

### 5) You can monetize immediately

Modules can earn in multiple ways:

* **take-rate** on wagers, swaps, tips, utilities
* **subscription revenue share** (group plans unlock your module)
* **feature add-ons** (premium modes, higher limits, cosmetics)
* **usage-based pricing** (you earn more when you create more value)

It’s “build once, deploy everywhere, earn continuously.”

---

# Module registration: what it unlocks

When you register your module, you get:

* a `moduleId` identity on the platform
* a **module API key** scoped to your allowed treasuries (“buckets”)
* optional per-group configuration storage (for your module settings)
* analytics hooks so communities can see usage + outcomes

Think of it like getting a verified slot in the ecosystem:

* communities can enable you
* billing/entitlements can unlock you
* you can prove your track record with real metrics

---

# What you can build (examples)

High-uptake module ideas that work across Telegram + web:

**Games**

* blackjack / dice / PvP lobbies / tournaments
* prediction markets (admin-settled MVP → oracle upgrades later)
* seasonal ladders + jackpots

**Utilities**

* group “quest” engines (tasks + rewards)
* token-gated access / role automation
* community raffles and prize distribution

**Commerce**

* paid group tools (pin ads, featured posts, premium channels)
* creator “drops” with claim logic
* affiliate/referral loops

**Automation**

* scheduled contests
* sentiment + engagement scoring
* alerts and triggers based on on-chain events

---

# SDK: the “eager dev” path

If you’re serious about building modules, you want the fastest route from idea → revenue. The SDK path is exactly that.

### What the SDK gives you

**1) Auth helpers**

* wallet login flow (nonce → verify → JWT)
* module authentication (API key + scoped permissions)
* safe request signing patterns (where needed)

**2) Ledger helpers**

* create idempotent `refId` consistently
* perform credit transfers inside your allowed treasuries
* read balances + ledger events for UI state

**3) Group + entitlement helpers**

* check if a group has your module enabled
* read group plan status (active / grace / lapsed)
* fetch per-group module config (limits, modes, settings)

**4) Events + analytics**

* standard event emission (so dashboards work automatically)
* usage counters (commands run, games played, volume, fees)
* “module health” signals for community trust

### SDK shape (how it feels)

You’re basically writing this kind of code:

* **Server-side module runner**

  * validate group entitlement
  * run your game/utility logic
  * settle with credit transfers (idempotent)
  * emit events

* **Web UI / miniapp**

  * user login (wallet → JWT)
  * show balances + state
  * call module endpoints safely
  * subscribe to events for live updates (polling now, streaming later)

### Starter kits (what we want devs to clone)

* `module-template-node-ts` (Express/Fastify module service)
* `module-template-miniapp-react` (web UI)
* `module-template-tg-bot` (Telegram integration)
* shared `packages/common` types + Zod schemas so all modules speak the same language

---

# Why build for “social platforms + web browsers + more” with one module?

Because your logic should not depend on the front-end surface.

With YetiCashier:

* Telegram is just a **client surface**
* web is just a **client surface**
* future social integrations become **client surfaces**

Your module is the product. The platform gives you:

* identity
* settlement
* accounting
* distribution hooks
* billing unlocks

So you’re not rebuilding infrastructure every time a new distribution channel pops up.

---

# The ecosystem angle (the real shill)

Most platforms die because they try to be the only feature.

We’re doing the opposite:

* the core stays minimal and secure
* modules create the variety
* communities create demand
* devs capture upside

If you build a module that people love, it can spread across hundreds of groups without you negotiating one-by-one integrations.

That’s the play:
**stop building apps nobody discovers — build modules communities adopt.**

---

# What to build first (if you want uptake fast)

If you want immediate adoption, build modules that:

* generate engagement loops (people come back daily)
* create measurable value (volume, fees, rewards)
* are simple to understand in a chat environment

Examples:

* PvP duel games with leaderboards
* “quest + rewards” engines for communities
* raffle + jackpot systems with transparent settlement
* group utilities that reduce admin workload

Those spread. Those get enabled. Those get paid.

---

If you want, tell me what kind of module you’re building (game, utility, commerce, analytics) and I’ll write a **Module Pitch + README** that’s ready to ship to other devs, including:

* module description
* monetization model
* API contract outline
* SDK usage examples
* rollout plan across Telegram + web miniapps
