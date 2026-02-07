---
title: Sportsbook User Guide
description: How to bet on events, understand pooled odds, and how payouts / fees / losses work.
sidebar:
  order: 1
---

# Sportsbook User Guide

The Sportsbook is a **pooled betting** game: players place bets on **Side A** or **Side B**, and the total pools determine the displayed **odds multiplier (x)**. Gameplay is typically **DM-driven** (private chat), and events can be shared into groups so users can jump into DM and place bets.

---

## Quick Start

### 1) Open the Sportsbook
In a DM with the bot, run:
- **/sports** (or **/sportsbook**)

You’ll receive a list of active events.

> If you use /sports in a group, the bot may redirect you to DM for gameplay. This is intentional — bets are handled in DM.

### 2) Open an event
Tap an event from the list to open the event card.

### 3) Pick a side and bet
Tap:
- **Bet A** (Side A), or
- **Bet B** (Side B)

Choose a quick amount or tap **Custom** to type an amount.

### 4) Track your bet
After betting, the event card updates to show:
- pools
- odds multipliers (x)
- event status
- your open bet amount(s)

---

## Understanding the Event Card

An event card typically includes:

- **Event title**
- **Status**: OPEN / LOCKED / AWAITING_RESULT / SETTLED / VOID
- **Lock time** (or “Locks in …”) — when betting stops
- **Pools**: total bet amount on A and on B
- **Odds multipliers (x)** for A and B
- **Bet counts** on each side
- **Your position**: how much you personally have on A, on B, and total

---

## Pools and Odds

### Pooled betting (the important concept)
This sportsbook is **pooled**:
- All bets on **Side A** form the **A pool**
- All bets on **Side B** form the **B pool**
- The displayed **x multipliers** are derived from pool balance

In general:
- the **smaller** pool side often shows a **higher** x
- the **larger** pool side often shows a **lower** x

### Why odds move
While an event is **OPEN**, other players can bet at any time. That changes:
- pool sizes
- pool balance
- the displayed x multipliers

So the x you see can change before lock. That’s expected.

### When odds stop moving
At the **lock time**:
- betting stops
- pools stop changing
- the event waits for result + settlement

---

## Event Lifecycle

### OPEN
- Betting is live
- You can bet A or B
- Odds/pools can change as others bet

### LOCKED
- Betting is closed
- No new bets are accepted
- Event progresses toward close / result

### AWAITING_RESULT
- Event ended
- Result not posted yet

### SETTLED
- Result posted
- Winners are paid out
- Event is complete

### VOID
- Event cancelled or invalid
- Bets are refunded (no winners)

---

## Betting Rules

### DM vs group
- Events can be shared into groups for visibility
- Betting is typically done in **DM** for reliable confirmations and inputs

### Quick amounts vs custom amount
- **Quick**: one tap
- **Custom**: type a plain number (example: `25`) in DM

### Betting near lock time
If you try to bet right before lock:
- the event may lock between taps
- your bet can be rejected
- refresh the event card and check status

---

# Accounting: Fees, Payouts, and Losses

This section explains exactly how money flows in a pooled event: **who loses what, who wins what, and what the house takes**.

## Definitions

Let:

- **A_pool** = total amount bet on Side A  
- **B_pool** = total amount bet on Side B  
- **Total_pool** = A_pool + B_pool  

House fee configuration (current default in your system):
- **House fee = 3%** (300 basis points, `feeBps = 300`)
- Fee is computed in basis points: **bps / 10,000**
- Common caps: usually 0–10% (0–1000 bps) depending on your config

## Step 1 — House fee is taken from the total pool

At settlement time:

- **fee = Total_pool × feeBps / 10,000**
- **Net_pool = Total_pool − fee**

With a 3% fee:
- **fee = Total_pool × 0.03**
- **Net_pool = Total_pool × 0.97**

### Example
If A_pool = 70 and B_pool = 30:
- Total_pool = 100
- fee = 100 × 0.03 = 3
- Net_pool = 97

## Step 2 — Winners split the net pool proportionally

If **Side A wins**, then only bets on Side A win.

Each winning bettor is paid as a proportional share of the **Net_pool** based on how much they contributed to the winning pool:

- **payout(user) = Net_pool × (userBet / A_pool)**

If **Side B wins**:

- **payout(user) = Net_pool × (userBet / B_pool)**

This model is fair and solvency-safe because:
- total payouts to winners = Net_pool
- house gets fee
- losers get 0
- Total_pool = Net_pool + fee (balances perfectly)

### Example (Side A wins)
A_pool = 70, B_pool = 30, Total_pool = 100  
fee = 3, Net_pool = 97

User X bet 14 on A:

- payout = 97 × (14 / 70)
- payout = 97 × 0.2
- payout = 19.4

So:
- user risked 14
- user receives 19.4
- net profit = +5.4

## Step 3 — Losers incur full loss (unless VOID)

If you bet on the losing side:
- your payout is **0**
- your loss is your full bet amount

So in pooled betting:
- **winners profit is funded by losers**, minus the house fee.

## What “Odds Multiplier (x)” actually means

The displayed **x** is a shortcut estimate of expected payout multiple **at that moment** based on pools and fee.

A good mental model:

- **x_if_A_wins ≈ Net_pool / A_pool**
- **x_if_B_wins ≈ Net_pool / B_pool**

Because if you bet 1 unit on the winning side, your payout is roughly:
- 1 × (Net_pool / winningPool)

### Example
A_pool = 70, B_pool = 30, Total_pool = 100  
Net_pool = 97

- x_if_A_wins ≈ 97 / 70 ≈ 1.3857x
- x_if_B_wins ≈ 97 / 30 ≈ 3.2333x

This also explains why:
- smaller pool side tends to have higher x
- larger pool side tends to have lower x

## How losses occur (dissection)

Losses happen in three places:

### 1) Losing bettors
They lose **100%** of their bet (payout 0).

### 2) House fee
Even the winners collectively “lose” the fee in the sense that it reduces Net_pool.

Without fee, winners would split the full Total_pool. With fee, winners split Total_pool minus fee.

### 3) Timing risk (odds movement)
Even if you don’t “lose” from movement directly, the **x you see** can change before lock because pools change.

So you can:
- bet at 2.2x shown
- later it becomes 1.9x because more money piled onto your side
- final payout is based on **locked pools**, not the moment you opened the card

## Settlement integrity (solvency check)

A correct settlement always satisfies:

- **Total_pool = fee + sum(payouts_to_winners)**
- Losing side total is redistributed (minus fee) to winners

This makes the book solvent by construction — it never pays out more than it has.

## VOID accounting

If an event is **VOID**:
- all bets are returned to users
- no one wins, no one loses
- house fee should be **0** on void (refund full principal)

---

## My Stats and History

Use the stats screen (usually **My stats**) to see:
- total bets
- wins/losses
- net profit
- recent history

Stats are the fastest way to confirm:
- your bet was recorded
- you were settled correctly
- your profit/loss matches expectations

---

## Troubleshooting

### “Nothing happened when I clicked in a group”
Open DM with the bot and run:
- **/sports**

### “Betting closed”
Event is no longer OPEN (LOCKED / AWAITING_RESULT / SETTLED).

### “Odds changed”
Odds change while OPEN as pools change. They lock at lock time.

### “Custom bet didn’t work”
Type a plain number in DM (example: `25`). Avoid extra text.

### “I can’t find my bet”
Re-open the event to view **Your position**, or check **My stats**.

---

## Tips to Play Smarter

- Bet earlier if you want more stable odds
- Refresh right before placing a bet
- Start small when testing new event types
- Track profit/loss via stats — don’t guess
