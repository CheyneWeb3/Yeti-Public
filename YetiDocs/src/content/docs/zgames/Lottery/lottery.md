---
title: Lottery User Guide
description: Group lottery with ticket buying, pot boosts, auto-draw, and 90/10 payout split.
sidebar:
  order: 3
---

# Lottery User Guide

Lottery is a **credits-based** group game where users buy tickets into a shared pot. When the timer ends, the system **draws one winner** and pays out the pot with a fixed split:

- **Winner payout:** **90%** of the pot
- **Dev fee:** **10%** of the pot

A “shill post” (the main lottery post with buttons) is created in the group, and users can buy tickets via buttons or commands.

---

## What Players Do

### Quick Start (players)

1) In the group, find the Lottery post (it shows ticket price, pot, time left).  
2) Tap a button like:
- 🎟️ **Buy 1**
- 🎟️ **Buy 3**
- 🎟️ **Buy 5**

Or buy by command:
- `/lottery <amount>`
- `/lotterybuy <amount>`

Example:
- `/lottery 6000`

3) Check your entries:
- Tap **👤 My tickets**
- or run `/lotterymytickets`

4) When time expires, the winner is announced in the group.

---

## Understanding the Lottery Post

The main lottery post shows:

- **Ticket price** (in credits)
- **Pot** (in credits)
- **Boosted** amount (extra donated credits, if any)
- **Tickets** (total tickets sold)
- **Entrants** (unique users who bought tickets)
- **Time left** (minutes until draw)
- Optional **title**, **image**, and **description** (set by admins)

Buttons on the post:
- 🎟️ Buy 1 / Buy 3 / Buy 5 (admin-configurable)
- 👤 My tickets
- 🔄 Refresh
- 🛠️ Admin (admins only)

---

## Buying Tickets

You can enter in two ways:

### A) Buy via buttons (recommended)
Tap **🎟️ Buy 1 / Buy 3 / Buy 5** on the lottery post.

This buys exactly that number of tickets.

### B) Buy via command (spend amount)
In the group chat:
- `/lottery <amount>`
- `/lotterybuy <amount>`

Example:
- `/lottery 6000`

This spends credits to buy tickets according to the ticket price (the backend returns how many tickets were added). The bot will confirm something like:
- ✅ `@you bought X ticket(s).`

> Note: The bot automatically **reposts/refreshes the main lottery post** after purchases so the pot/tickets are always current.

---

## Boosting the Pot (Donation)

Boosting increases the pot but **does not give you tickets**.

Command:
- `/lotteryboost <amount>`

Example:
- `/lotteryboost 10000`

Boost is a straight donation to the pot:
- **No extra entries**
- **No extra win chance**
- Just makes the prize bigger for the eventual winner

The lottery post will show Boosted amount if it’s > 0.

---

## My Tickets and Stats

### My tickets (your personal entries)
- Tap **👤 My tickets** on the post  
or
- `/lotterymytickets`

You’ll see:
- Your ticket count
- Your total spent (credits)
- Your share % of total tickets
- Current pot, boosted amount, total tickets, entrants, and time left

### Lottery stats (overall)
- `/lotterystats`

Shows the same global info (ticket price, pot, tickets, entrants, time left), useful if you’re not looking at the shill post.

---

# Draw, Payouts, and Accounting

When the timer ends, the system automatically draws a winner and posts a message like:

- 🎉 LOTTERY DRAWN  
- Winner: `tg://user?id=...`  
- Pot: `<pot>` credits  
- Payout (90%): `<winner amount>`  
- Dev (10%): `<dev amount>`

## Pot definition
Let:

- **Pot** = total credits in the pot at draw time  
  (includes ticket purchases + boosts)

## Fixed payout split
At settlement:

- **Winner payout = 90% of Pot**
- **Dev fee = 10% of Pot**

### Example
If Pot = 100,000 credits:
- Winner gets 90,000
- Dev gets 10,000

## Player profit/loss (simple view)

### If you lose (most players)
- You receive **0**
- Your loss is what you spent on tickets

### If you win
- You receive the **winner payout (90% of pot)**
- Your net profit depends on how many credits you spent on tickets

Example:
- You spent 6,000 credits on tickets
- Pot is 100,000 → winner payout is 90,000
- Your net profit = 90,000 − 6,000 = +84,000

## How win chance works
This is a pure ticket lottery:
- Each ticket is one entry
- Your win chance is approximately:

`yourTickets / totalTickets`

So if you have 10 tickets out of 200 total:
- your chance ≈ 5%

Boosting does not change your ticket count, so it does not change your odds.

---

## Timing and Auto-Draw

- Lotteries have an end time (shown as “Time left”).
- A background poll checks for draw eligibility and draws shortly after the timer expires.
- If the lottery ends with **no entries**, it can be **cancelled** (and a cancel message is posted).

After a draw, the system may clean up the old shill post.

---

# Admin Guide (Starting and Managing Lotteries)

## Start a lottery (group admins only)

Command format:

`/lottery YETI <ticket> <duration> [imageUrl] [title/description...]`

Example:

`/lottery YETI 2000 24h https://example.com/img.png Friday Night Pot`

What each part means:
- `YETI` = token symbol label shown in creation (your lottery is credits-based; this is display/config)
- `<ticket>` = ticket price in credits (human amount)
- `<duration>` = how long the lottery runs
- `[imageUrl]` = optional http/https image for the shill post
- `[title/description...]` = optional text to hype the pot / explain the event

### Duration formats
Duration accepts time specs like:
- `6h` (hours)
- `2d` (days)

Admin UI guidance enforces typical limits (example: hours 1–23, days 1–7).

## Admin menu
Run:
- `/lotteryadmin`

You’ll get inline admin buttons for:

- **Edit title**
- **Edit description**
- **Set image URL**
- **Set duration** (resets end time from “now”)
- **Set buy buttons** (configure the quick ticket buttons)
- **Set shill interval**
- **Turn shill ON/OFF**
- **Repost shill now**
- **Cancel lottery**

> Only group admins can access /lotteryadmin.

---

## Shill behavior (anti-spam but keeps it visible)

Lottery uses a repost system:
- It can periodically repost/refresh the main lottery message (“shill”)
- It can also repost after purchases so the pot stays current and visible

Admins can:
- Turn shill ON/OFF
- Set the shill interval (minutes)
- Force repost immediately

---

# Troubleshooting

## “Only group admins can start a lottery”
Only group admins can run the create command:
- `/lottery YETI <ticket> <duration> ...`

## “No lottery is running”
There isn’t an active lottery in that chat right now.
Ask an admin to start one, or check `/lotterystats`.

## “I bought tickets but don’t see them”
- Tap **👤 My tickets**
- or run `/lotterymytickets`
Then tap **🔄 Refresh** on the main post if needed.

## “What’s the difference between Buy and Boost?”
- **Buy** = gives you tickets (odds go up)
- **Boost** = adds to pot only (odds do not change)

---

# Command Reference

### Player commands
- `/lottery <amount>` — buy tickets by spending an amount of credits
- `/lotterybuy <amount>` — same as /lottery
- `/lotteryboost <amount>` — donate to pot (no tickets)
- `/lotterystats` — show current lottery stats
- `/lotterymytickets` — show your ticket count + share %

### Admin commands
- `/lottery YETI <ticket> <duration> [imageUrl] [title/description...]` — create a lottery
- `/lotteryadmin` — admin menu (title/desc/image/duration/buttons/shill/cancel)
