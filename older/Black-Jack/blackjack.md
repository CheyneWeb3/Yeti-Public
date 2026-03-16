---
title: Blackjack User Guide
description: DM-only blackjack with Hit/Stand/Double/Split, 3:2 blackjack payout, 6-deck shoe, and stats.
sidebar:
  order: 2
---

# Blackjack User Guide

Blackjack is a **DM-only** game. You place a bet, get dealt cards, then use buttons to play your hand against the dealer.

**Core rules (player view):**
- Goal: get as close to **21** as possible without busting.
- Dealer reveals the full hand after you Stand (or once your hands resolve).
- Dealer **stands on 17**.
- **Natural blackjack** pays **3:2**.
- Regular win returns **2.0× total** (your bet back + same profit).
- Push refunds **1.0× total**.
- Loss/bust returns **0**.

---

## Quick Start

### 1) Open Blackjack in DM
Open a DM with the bot and run:

- **/bj `<amount>`**
- or **/blackjack `<amount>`**

Example:
- `/bj 25`

You’ll receive a game message with your cards, the dealer’s upcard, and action buttons.

> If you try to play in a group, it will refuse. Blackjack is DM-only.

---

## What You See on the Game Message

The message shows:

- **Your bet** (total bet shown; if you split, you’ll see total bet across hands)
- **Dealer hand**
  - While the game is ACTIVE, the dealer shows the **upcard + a facedown card** (🂠)
  - Dealer total displayed during ACTIVE is the **upcard total only**
- **Your hand(s)**
  - If you split, you’ll have **2 hands** and an **active hand indicator**
- **Status**
  - ACTIVE → you can act
  - DEALER_TURN → dealer is resolving (pending animation)
  - RESOLVED → shows payout + profit line

---

## Buttons and Actions

### 👊 Hit
Draw one card on the active hand.

### ✋ Stand
End your turn for the active hand.
- If you have one hand: dealer plays immediately.
- If you split: it advances to your next hand (then dealer plays after both hands resolve).

### 💰 Double
Double your bet on the current hand and draw **exactly one** card, then auto-stand that hand.
- Only available when the server allows it (`canDouble`).

### ✂️ Split
Split your starting hand into **two hands** if your first two cards match.
- Split is allowed **once** (you end with 2 hands max).
- Your total bet becomes **2×** your original bet (one bet per hand).

### ✖ Cancel
Cancels the current round (when allowed by the server).

### 🔁 Replay (same bet)
After a round ends, starts a new round with the same bet amount.

### 🏆 Stats
Shows your blackjack stats (games played, profit, biggest win, and leaderboards).

---

## Hand Totals and Card Values

Standard blackjack totals apply:
- 2–10 are face value
- J/Q/K are **10**
- Ace counts as **1 or 11** (whichever is better for your hand)

A **natural blackjack** means:
- exactly **2 cards**
- total **21**
- typically **Ace + 10-value**

---

## Shoe and Shuffle Rules

Blackjack uses a **6-deck shoe** (standard casino-style shoe):

- **6 decks × 52 cards = 312 cards**
- Cards are dealt from the shoe as games are played.
- The shoe **auto-reshuffles when fewer than 52 cards remain**.

Why this matters:
- It keeps randomness strong over time.
- It reduces edge from long-run card tracking because the shoe refreshes before it gets too thin.

---

## Payouts and Results

At the end of a round, the message includes a result line such as:

- **Blackjack! Payout: X (3:2)**
- **You win! Payout: X**
- **Push. Refunded: X**
- **Bust. Lost: X**
- **Dealer wins. Lost: X**
- **Dealer blackjack. Lost: X**
- **Push (both blackjack). Refunded: X**

### Payout meaning (important)
The amount shown as **Payout** is the **total return** you receive back from the game (not just profit).

- **Natural blackjack pays 3:2**
  - Total return = **2.5× bet**
  - Profit = **+1.5× bet**

- **Regular win pays even money**
  - Total return = **2.0× bet**
  - Profit = **+1.0× bet**

- **Push refunds**
  - Total return = **1.0× bet**
  - Profit = **0**

- **Loss / Bust**
  - Total return = **0**
  - Profit = **−1.0× bet**

If you split:
- each hand is settled independently
- total payout is the sum of both hand payouts
- the UI shows total bet and total payout across hands

---

# Accounting: Profit and Loss Breakdown

Let your base bet be **B**.

## Natural Blackjack (3:2)
- Return = **2.5B**
- Profit = **+1.5B**

Example: B = 20  
- Return = 50  
- Profit = +30  

## Regular Win
- Return = **2.0B**
- Profit = **+1.0B**

Example: B = 20  
- Return = 40  
- Profit = +20  

## Push
- Return = **1.0B**
- Profit = 0

Example: B = 20  
- Return = 20  
- Profit = 0  

## Loss / Bust
- Return = 0
- Profit = **−1.0B**

Example: B = 20  
- Return = 0  
- Profit = −20  

---

## Split Accounting (2 hands)

If you split, your total stake becomes **2B** (B on each hand).

Example (B = 20):
- You split → total at risk = 40
- Hand 1 wins (returns 40)
- Hand 2 loses (returns 0)
- Total return = 40
- Net profit = 0 (break-even)

---

## Double Accounting

Doubling makes your hand stake **2B**.

If you double and win (regular win):
- Return = 2.0 × (2B) = **4B**
- Profit = +2B

If you double and lose:
- Profit = −2B

Example (B = 20):
- Double stake = 40  
- Win return = 80 (profit +40)  
- Lose = −40  

---

## Betting Limits

Blackjack enforces a risk control:

- **Max bet = 10% of the blackjack pool**

So if the pool is 10,000 credits, max bet is 1,000 credits.

(The pool size is internal; the server enforces the limit.)

---

## Commands

- **/bj `<amount>`** — start a round (DM only)
- **/blackjack `<amount>`** — same as /bj
- **/bjhelp** — shows help text
- **🏆 Stats** button — shows your stats + leaderboards

---

## Dealer Reveal and “Pending…”

When you Stand, the game may enter a short **DEALER_TURN** phase:
- the UI shows result as **pending…**
- the bot may automatically update the message as the dealer reveals cards

If it doesn’t update immediately, use:
- **🔄 Refresh** (during dealer turn)

---

## Troubleshooting

### “It won’t let me play in a group”
Blackjack is **DM-only**. Open DM with the bot and use `/bj 25`.

### “Buttons don’t work”
Try tapping once, wait a moment, then tap again.
If it’s in dealer turn, use **Refresh**.

### “I can’t Split/Double”
Those buttons only appear when the server says you’re allowed:
- Split requires your first 2 cards match (once).
- Double is usually only on the first move of that hand.

### “Dealer total looks wrong while I’m playing”
During ACTIVE play, the dealer total shown is **upcard only** (the second card is hidden). Once resolved, full dealer total is shown.

---

## Tips

- Don’t auto-double unless you’re comfortable risking **2×** on one decision.
- Splitting increases volatility fast because your total bet becomes **2×** immediately.
- Use **Stats** to track whether you’re up or down instead of guessing.
