---
title: Sportsbook User Guide
description: How to bet on events, understand pooled odds, and track your results.
sidebar:
  order: 1
---

# Sportsbook User Guide

The Sportsbook is a **pooled betting** game: players place bets on **Side A** or **Side B**, and the total pools determine the displayed **odds multiplier (x)**. Gameplay is **DM-driven** (private chat), but events can be shared to a group so everyone can jump into DM to bet.

---

## Quick Start

### 1) Open the Sportsbook
In a DM with the bot, run:
- **/sports** (or **/sportsbook**)

You’ll receive a list of active events with buttons.

> If you run **/sports** in a group, the bot may redirect you to DM for gameplay. This is intentional — betting actions are handled in DM.

### 2) Open an event
Tap an event from the list to open the event card.

### 3) Pick a side and bet
Tap:
- **Bet A** (Side A), or
- **Bet B** (Side B)

Choose an amount from the quick buttons (example: 1 / 3 / 5 / 10 / 25 / …) or tap **Custom** to type your own amount.

### 4) Track your bet
After betting, the event card updates to show:
- pools
- odds multipliers (x)
- event status
- your open bet amounts

---

## Understanding the Event Card

An event card typically includes:

- **Event title** (example: “Team A vs Team B”)
- **Status** (OPEN / LOCKED / AWAITING_RESULT / SETTLED / VOID)
- **Lock time** (or “Locks in …”) — when betting stops
- **Pools** for Side A and Side B
- **Odds multipliers (x)** for Side A and Side B
- **Bet counts** (how many bets on each side)
- **Your position** (your current total bet on A, on B, and overall)

---

## Pools and Odds Multipliers

### Pooled betting (the key concept)
This Sportsbook is **pooled**:
- All bets on **Side A** form the **A pool**
- All bets on **Side B** form the **B pool**
- The bot displays **x multipliers** based on the pool balance

In general:
- The **smaller** pool side often displays a **higher** multiplier
- The **larger** pool side often displays a **lower** multiplier

Why: the payout pressure is higher on the side with fewer total bets if it wins.

### Why odds move
While an event is **OPEN**, other players can bet anytime. That changes:
- pool sizes
- pool balance
- the displayed **x odds**

So you can open an event, see 2.1x, and after other bets it becomes 1.8x. That’s normal.

### When odds stop moving
At the **lock time**:
- betting stops
- the pools stop changing
- the event waits for the result

---

## Event Lifecycle

Events move through these statuses:

### OPEN
- Betting is live
- You can bet A or B
- Odds/pools can change as people bet
- The card shows a lock countdown or lock time

### LOCKED
- Betting is closed
- No new bets are accepted
- Event is in progress / approaching settlement

### AWAITING_RESULT
- Event is finished but the result hasn’t been posted yet
- No betting is possible

### SETTLED
- Result has been posted
- Winners are paid out based on the settled pools/odds rules
- The event is complete

### VOID
- Event was cancelled or invalidated
- Bets are refunded (no winners)

---

## Placing Bets

### Betting from a group vs DM
- You can **view** events shared into a group
- You typically **place bets in DM**, where the bot handles bet inputs and confirmations reliably

If you don’t see buttons working in a group, open DM and run **/sports**.

### Quick amounts vs Custom
- **Quick amounts**: fastest, one tap
- **Custom**: type a number manually in DM (example: `25`)

If custom isn’t working, make sure you’re entering a plain number (no symbols).

### Betting near lock time
If you try to bet right before lock:
- the bet may fail if the event locks between your taps
- refresh the event card and check the status

Best practice: place bets early if you care about a specific multiplier.

---

## Payouts and Results

When the event is **SETTLED**:
- one side is declared the winner
- winners receive payouts according to the settled pools/odds rules
- losers lose the wagered amount (unless the event is VOID)

If an event is **VOID**:
- bets are refunded
- no one wins or loses

---

## My Stats and History

You can view your Sportsbook stats any time from the event list or event card (button name may vary, commonly **My stats**).

Typical stats include:
- total bets placed
- wins / losses
- net profit
- recent bet history (event + side + amount + outcome)

Use stats to:
- confirm your understanding of payouts
- track if you’re up or down over time
- keep a record of your results

---

## Troubleshooting

### “Nothing happened when I clicked in a group”
Sportsbook actions are usually DM-first. Open DM with the bot and run:
- **/sports**

### “Betting closed”
That event is no longer OPEN. If it’s **LOCKED**, bets won’t be accepted.

### “Odds changed after I looked”
Odds can move while OPEN because pools change as other players bet. They lock at lock time.

### “Custom bet didn’t work”
Custom bets require you to type a number (example: `25`) in DM. Text like “25 credits” may fail.

### “I can’t find my bet”
Open the event again and look for **Your position / Your bets**. If the event is settled, check **My stats** or your history.

---

## Tips to Play Smarter

- **Place bets earlier** if you want more stable odds.
- **Refresh before betting** if the event has been open for a while.
- **Start small** when a new event format is introduced.
- **Track your results** using stats — don’t rely on memory.

---

## Want this guide to match your exact implementation?
Some previously uploaded files can expire in this chat environment. If you want me to align this doc to your **exact buttons/commands/fields** (and include your real wording/screens), re-upload your latest `sportsbook.zip` and/or the current `sportsbook.ts`.
