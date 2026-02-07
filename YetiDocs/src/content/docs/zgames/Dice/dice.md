---
title: Dice V1 Beta User Guide
description: Roll a 6 to win 5×, ride your winnings up to 4 times, and understand payouts + losses.
sidebar:
  order: 1
---


Dice V1 Beta is a fast, public chat game: you place a bet, the bot rolls a die, and **you win if it lands on 6**.

- **Win condition:** roll **6**
- **Payout:** **5× your bet**
- **Lose condition:** roll 1–5 → you lose your bet
- **After a win:** you can **Ride winnings** (re-bet your payout) up to **4 times**

---

## Quick Start

### Play a round
In a group (or allowed public chat), run:

- **/dice `<amount>`**

Example:
- `/dice 5`

The bot will:
1) post a “rolling…” message  
2) wait ~2 seconds  
3) post the result (WIN or GAME OVER)

### After a win
If you win, the result message gives you buttons:

- **🎲 Try again** — starts a fresh round with the same original bet
- **🔥 Ride winnings** — re-bets your **payout** (not your original bet) and starts the next “ride” step

You can ride up to **4 times**.

---

## What the Result Message Means

### If you win
The bot will show:

- “WIN”
- what you rolled
- **“won `<payout>` credits”**
- **“Profit: `<profit>`”**

### If you lose
The bot will show:

- “GAME OVER”
- what you rolled
- **“lost `<bet>` credits”**

---

## Rules

### Win rule
You only win if the roll is **6**.

### Payout rule
When you win, your **payout is 5× your bet**.

Most systems show:
- **Payout = 5 × bet**
- **Profit = payout − bet = 4 × bet**

(Your UI explicitly prints both *payout* and *profit*.)

### Ride winnings rule (important)
If you press **Ride winnings**, your next bet becomes your **previous payout**.

- Win → you can keep riding (up to 4 rides)
- Lose on a ride → you lose the entire ride bet (which is your rolled-over payout)

The bot labels this as:
- **(Ride 1/4)**, **(Ride 2/4)**, … up to **(Ride 4/4)**

> Riding is high risk: one loss can wipe the entire rolled-over amount.

---

# Accounting: Payouts, Profit, and Losses

This section breaks down exactly what you win/lose and what “Ride winnings” does to your bankroll.

## Single Round Accounting

Let your bet be **B**.

### If you win (roll 6)
- **Payout = 5B**
- **Profit = 4B** (net gain)

Example: B = 10  
- payout = 50  
- profit = 40  

### If you lose (roll 1–5)
- **Loss = B**
- payout = 0  
- profit = −B  

Example: B = 10  
- loss = 10

---

## Expected Value (House Edge)

A fair way to understand the “cost” of the game is expected value:

- Chance to win = **1/6**
- Chance to lose = **5/6**
- Win pays **5×**

**Expected payout multiple = (1/6) × 5 = 5/6 ≈ 0.8333×**

So on average:
- expected loss ≈ **1/6 of your bet = 16.67%**
- per bet B, expected value ≈ **−0.1667B**

That’s the built-in house edge from the math (even with no explicit fee).

---

## Ride Winnings Accounting (How Big It Can Get)

If you keep winning and always ride, the bet grows like this:

- Start bet: **B**
- After 1st win: payout = **5B**
- Ride 1 win: payout = **25B**
- Ride 2 win: payout = **125B**
- Ride 3 win: payout = **625B**
- Ride 4 win: payout = **3125B**

That’s **5 wins in a row** (initial + 4 rides).

### The risk (what you can lose)
If you ride, you are staking your entire payout again.

Example with B = 10:
1) You bet 10 and win → you’re up +40 profit
2) You ride with 50
3) If you lose that ride → you lose 50, and your overall net becomes:
   - started with 10 stake risked
   - after win you had +40 net
   - then you lose 50 → net becomes **−10 overall**

So: **winning then losing your first ride puts you down your original bet**.

That’s why Ride is “all-in on the payout”.

---

## “Try again” vs “Ride winnings”

### 🎲 Try again
- New round
- Uses your original bet again
- You’re not compounding risk

### 🔥 Ride winnings
- Bets your last payout
- Massive upside if you streak
- Massive downside if you lose even once mid-streak

If you want steady play, **Try again**.
If you want volatility (degenerate streak chasing), **Ride winnings**.

---

## Limits and Controls (What Players May See)

Depending on your backend config, players may run into:

- **Min bet** (chat-configured)
- **Max bet** (system risk control)
- **Daily profit cap / remaining daily profit** (system risk control)

Even if the bot doesn’t always print these numbers on the result card, they commonly exist behind the scenes to protect the treasury.

---

# Admin Guide (Chat Settings)

Dice has per-chat settings controlled via **/diceadmin**.

## Who can use /diceadmin
- In groups: **group admins**
- In DM: only the configured **adminTgUserId**

## /diceadmin menu controls

### 🧹 Auto-delete
Toggles whether the bot **auto-deletes its previous dice messages** per user to keep chats clean.

### 🖼 WIN banner URL
Image shown on a win.

### 🖼 LOSE banner URL
Image shown on a loss (fallback).

### 😈 TAUNT banner URL
Image shown on a loss (preferred). If set, it overrides lose banner for losses.

### 💰 Min bet
Sets the minimum bet allowed in that chat.

### 🔢 Quick bets
Sets the quick bet presets (comma-separated), e.g.
`1,3,5,10,25`

---

# Troubleshooting

## “Usage: /dice <amount>”
You didn’t include an amount. Example:
- `/dice 5`

## “It won’t run in DM”
Dice is intended as a **public chat / group** game (your module checks for allowed public chat).
Run it in the enabled group/supergroup.

## “Buttons don’t work / it says still rolling…”
Wait a moment and tap again. The bot resolves after a short delay.

## “Ride winnings button disappeared”
You can only ride if:
- you just **won**, and
- you haven’t exceeded **Ride 4/4**

---

# Tips

- If you want less pain: **don’t ride** (or only ride once).
- If you ride: treat it like **all-in** — because it is.
- Use **quick bets** and set a sensible **min bet** for your group.
