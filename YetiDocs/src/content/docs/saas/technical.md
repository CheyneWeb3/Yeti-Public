---
title: SaaS Technical Reference
description: Data model, billing states, invoices, and entitlement derivation.
sidebar:
  order: 2
---

## SaaS Module Technical Reference + Example Pricing

This is a technical reference for the **SaaS (Group Subscriptions) Module**: what it stores, what it enforces, how billing works, and example subscription pricing for **monthly / 3-monthly / yearly / lifetime** group plans.

---

# 1) Core Concepts (data model level)

### Group

A **Group** is a billable entity (Telegram chat group today; other platforms later).

**Key fields**

* `groupId` (platform-native id, e.g. telegram chatId)
* `platform` (`telegram`, later `discord`, `web`, etc.)
* `title`, `createdAt`
* `ownerAddress` (primary controller wallet)
* `adminAddresses[]` (optional controllers)
* `status` (`active`, `suspended`, `deleted`)

### Plan

A **Plan** defines pricing + entitlements.

**Key fields**

* `planId` (`starter`, `pro`, `whale`, etc.)
* `billingPeriod` (`monthly`, `quarterly`, `yearly`, `lifetime`)
* `price` (in credits, integer smallest units)
* `currency` (`USDC`, or `native` credits rail)
* `features[]` (enabled modules + limits)
* `limits` (examples below)
* `graceDays` (ex: 3–7 days)
* `status` (`active`, `hidden`, `retired`)

### Subscription

A **Subscription** is the active agreement between group and plan.

**Key fields**

* `subscriptionId`
* `groupId`
* `planId`
* `status` (`active`, `grace`, `past_due`, `canceled`, `expired`)
* `currentPeriodStart`, `currentPeriodEnd`
* `renewalMode` (`auto`, `manual`)
* `nextChargeAt`
* `cancelAtPeriodEnd` (bool)
* `priceSnapshot` (so plan price changes don’t rewrite history)

### Invoice / Charge Attempt

Billing is recorded as invoices (even if “auto-charge”).

**Invoice fields**

* `invoiceId`
* `groupId`, `subscriptionId`
* `amount`, `currency`
* `periodStart`, `periodEnd`
* `status` (`open`, `paid`, `failed`, `void`)
* `attempts[]` (charge attempts with timestamps + reason codes)

### Entitlements

Effective permissions the group has “right now”.

**Examples**

* enabled modules: `tg`, `bj`, `dice`, `whack`, `analytics`
* limits: max bet %, max concurrent games, daily volume cap, command rate limits
* branding: custom images / skins allowed
* analytics tier: basic vs advanced

> Entitlements should be derived from: `subscription.status` + `plan.features/limits` + optional per-group overrides.

---

# 2) Billing Engine (how charging works)

### Charge source

Group pays subscription fees from a **group-owned credit balance**, not a personal wallet.

Recommended structure:

* A group has a “billing wallet” identity on the ledger (logical account).
* Charges are a **ledger transfer** from `groupBillingAccount` → `saas-fees` treasury.

### Idempotency

Every billing action uses `refId`:

* `refId = saas:invoice:<invoiceId>`
* retries do not double charge

### State transitions

* `active` → (at period end) attempt charge
* if paid: new period created, stays `active`
* if insufficient funds / failure: go `grace` until `graceDays` end
* if still unpaid: `past_due` (entitlements degrade or disable)
* optional: auto-cancel after N periods unpaid

### Grace + degrade behavior (recommended)

Instead of “hard off” immediately:

* **active**: full features
* **grace**: keep core commands, disable high-risk features (wagering), keep read-only analytics
* **past_due**: disable premium modules, keep “top up” prompts + basic access

---

# 3) Fees (platform take + billing fees)

You’ll likely have **two fee layers** in the ecosystem:

### A) Subscription fee (SaaS revenue)

This is the plan price (monthly/quarterly/yearly/lifetime).

Flows:

* group → `saas-fees` treasury
* optional split:

  * platform revenue treasury
  * dev incentives treasury
  * affiliate/referral treasury
  * module ecosystem treasury

### B) Module activity fee (take-rate on volume)

Separate from subscription: modules can take fees on gameplay/usage.

Example defaults:

* wagering games: **house edge** or **service fee** per bet
* utilities: per-action fee or per-transaction fee

> This lets you price subscriptions low while monetizing success via volume.

---

# 4) Example Plan Structure (entitlements)

Here’s an example investor-friendly set, but it’s also technical because limits map directly to enforcement:

### Starter

* Modules: `tg`, `dice`, basic `analytics`
* Limits: max bet 2% treasury, max 1 concurrent game, basic rate limits
* Support: community

### Pro

* Modules: `tg`, `dice`, `blackjack`, `whack`, analytics+
* Limits: max bet 5% treasury, 3 concurrent games, higher command limits
* Includes: group branding pack (logo/banner)

### Whale

* Modules: all current + early access modules
* Limits: max bet 10% treasury (your standard cap), tournaments, advanced analytics
* Includes: priority support, custom limits review

---

# 5) Example Subscription Pricing (monthly / 3-monthly / yearly / lifetime)

Below is a clean set of example prices denominated in **USDC credits** (you can keep native credits as an option, but USDC is easiest for “SaaS clarity”).

### Recommended discount structure

* **Monthly**: baseline
* **3-monthly**: ~10–15% discount vs paying monthly
* **Yearly**: ~20–25% discount
* **Lifetime**: priced like 2.5–4 years upfront (depends on your risk appetite)

### Example pricing table (per chat group)

**Starter**

* Monthly: **$49**
* 3-monthly: **$129** (≈12% off)
* Yearly: **$449** (≈24% off)
* Lifetime: **$1,499** (≈2.5 years)

**Pro**

* Monthly: **$149**
* 3-monthly: **$399** (≈11% off)
* Yearly: **$1,299** (≈27% off)
* Lifetime: **$4,499** (≈2.5–3 years)

**Whale**

* Monthly: **$399**
* 3-monthly: **$1,099** (≈8% off)
* Yearly: **$3,499** (≈27% off)
* Lifetime: **$11,999** (≈2.5–3 years)

> These are *example* numbers designed to be easy to communicate. You can tune them to match real ARPU from game/module activity.

---

# 6) Example Platform Take (optional, technical)

If you want a consistent economic model:

### Subscription revenue split (example)

* 85% platform treasury
* 10% dev incentives / grants
* 5% referrals / affiliates

### Module activity take-rate (example)

* Games run by platform: keep house edge in game treasury, skim X% to platform
* Third-party modules: module keeps majority, platform takes 10–20% of module fee revenue (not user principal)

This creates a clear “build here and earn” story.

---

# 7) Implementation Notes (still reference-level, not step-by-step)

### Storage + solvency

* Subscription charges must be ledger transfers with Mongo transaction + unique `refId`.
* Billing must not mint credits. It moves credits into `saas-fees` like any other treasury.

### Platform-agnostic group identity

* `groupId` should be `(platform, platformGroupId)` tuple so Discord/web can slot in later.

### Entitlement checks

Every module call should be able to ask:

* “Is group active?”
* “Does group have plan that enables module X?”
* “What limits apply (max bet %, concurrency, etc.)?”

---

# 8) Quick examples (how fees look in real life)

### Example A: Pro group pays monthly

* Group balance: 250 USDC credits
* Monthly invoice: 149 USDC
* Ledger transfer: `group:123 → treasury:saas-fees` amount 149
* Status stays `active`, next period created.

### Example B: Past due, then top-up

* Group balance: 20 USDC at renewal, invoice 49 fails
* Group goes `grace` for 7 days
* Members top up group treasury to 60 USDC
* Auto retry succeeds → back to `active`

### Example C: Lifetime purchase

* One-time invoice paid
* Subscription `status=active`, `billingPeriod=lifetime`, no renewal
* Entitlements stay active unless admin disables for abuse.

---

If you want, I can convert this into a clean markdown section that drops straight into your main README under:

`## SaaS Module — Group Subscriptions (Technical Reference)`

…and I’ll format it to match your repo tone (same headings and brevity level).
