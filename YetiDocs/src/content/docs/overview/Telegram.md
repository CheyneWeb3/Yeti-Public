---
title: Tips, Rain, and Monsoon
description: Learn how to use tip, rain, and monsoon in Telegram.
---


The Telegram bot supports three main ways to send credits to users:

- **Tip** sends to one user.
- **Rain** splits across the last **N** unique recent speakers.
- **Monsoon** splits across **all** unique recent speakers in a chosen time window.

These commands are designed for quick group rewards and easy community distributions.

## Quick overview

| Command | What it does | Best for |
| --- | --- | --- |
| `/tip` | Send to one user | Direct rewards |
| `/rain` | Split across the last **N** unique eligible speakers | Small targeted drops |
| `/monsoon` | Split across all unique eligible speakers in a recent time window | Bigger community drops |

## /tip

Use `/tip` when you want to send credits to one specific user.

### Format

```bash
/tip @username <amount> <token>
```

### Example

```bash
/tip @alice 1000 YETI
```

### What it does

- Sends the amount to the tagged user
- Deducts the amount from your balance
- Works as a direct one-to-one transfer

### Best for

- rewarding one person
- giveaways to a winner
- paying back a user
- manual rewards

## /rain

Use `/rain` when you want to split an amount across the **last N unique eligible speakers** in the group.

### Format

```bash
/rain <amount> <token> <peopleCount>
```

### Example

```bash
/rain 15000 YETI 15
```

### What it does

This command:

- takes **15,000 YETI**
- finds the **last 15 unique eligible speakers**
- splits the total evenly across them

### How rain chooses users

Rain is based on **recent counted group chat activity**, not on all members in the group.

It selects the **last N unique speakers** that were captured by the activity tracker.

That means:

- it is **not** based on a time window
- it is **not** every active user today
- it is only the **most recent unique speakers**

### Simple example

If the recent speaker order is:

`Alice, Bob, Carl, Dana, Eve, Frank, Gina`

and someone runs:

```bash
/rain 700 YETI 3
```

the bot may select:

- Gina
- Frank
- Eve

Each person would receive an equal split of the total.

### Best for

- rewarding the latest active chatters
- targeted drops
- quick group engagement

## /monsoon

Use `/monsoon` when you want to split an amount across **all unique eligible speakers inside a recent time window**.

### Format

```bash
/monsoon <amount> <token> <window>
```

### Examples

```bash
/monsoon 15000 YETI 1h
/monsoon 5000 YETI 30m
/monsoon 25000 YETI 2h
```

### What it does

This command:

- takes the total amount
- checks the chosen time window
- finds **all unique eligible speakers** in that time
- splits the amount evenly across them

### How monsoon chooses users

Monsoon uses a real time window such as:

- `15m` = 15 minutes
- `30m` = 30 minutes
- `1h` = 1 hour
- `2h` = 2 hours

It includes all unique eligible speakers whose counted messages were captured during that period.

### Simple example

If 7 unique users spoke in the last hour and someone runs:

```bash
/monsoon 700 YETI 1h
```

then all 7 users are included and the amount is split evenly across them.

### Best for

- larger community drops
- rewarding everyone active recently
- event-based giveaways

## The difference between rain and monsoon

This is the main thing to remember:

- **Rain** = the last **X** unique speakers
- **Monsoon** = **everyone** in the last **X** time

### In plain English

If you want to reward a specific number of the most recent people, use **rain**.

If you want to reward everyone who has been active recently, use **monsoon**.

## Eligible activity

Rain and monsoon are based on **counted chat activity**, not simply being present in the group.

The activity tracker only uses messages that are actually captured by the bot.

### Important notes

A user may **not** be counted if:

- they only sent stickers
- they only joined or left the group
- they sent an empty message
- their message matched a banned phrase
- their Telegram ID is excluded
- the bot did not capture or store their activity

Because of that, users may sometimes feel active but still not be included.

The system only uses counted messages logged by the bot.

## Group-only behavior

Rain and monsoon are designed for **group chats**.

They do not use private chat activity, and they do not consider users from other groups.

Activity is tracked for the specific group where the command is used.

## Token format

The asset field supports:

- a token symbol
- a token address
- `native`

Examples:

```bash
/rain 1000 YETI 10
/rain 0.5 native 5
/monsoon 2500 0xYourTokenAddressHere 1h
```

## Limits

The current implementation has built-in caps:

- `TG_RAIN_MAX_USERS` default cap: **50**
- `TG_MONSOON_MAX_USERS` default cap: **200**

### What this means

- rain cannot exceed its maximum allowed user count
- monsoon can fail if too many eligible users exist inside the chosen window

In busy groups, a large monsoon window may include too many users and be rejected.

## Do users need to be registered?

Not always.

Based on the current behavior:

- the **sender** needs enough funds
- **recipients do not necessarily need to be linked first**
- recipients can receive into Telegram holding accounts before linking later

So users can still receive distributions even if they have not fully linked yet, depending on the system setup.

## Important behavior on send failures

Rain and monsoon are processed **one recipient at a time** in the current implementation.

That means they are **not** atomic all-or-nothing sends.

### Why this matters

If a send fails partway through:

- earlier recipients may already have received their share
- later recipients may not receive anything
- the command can stop with a partial-complete result

## Examples

### Tip one user

```bash
/tip @alice 1000 YETI
```

### Rain on the last 10 unique speakers

```bash
/rain 5000 YETI 10
```

### Monsoon across everyone active in the last 30 minutes

```bash
/monsoon 25000 YETI 30m
```

### Monsoon across everyone active in the last hour

```bash
/monsoon 15000 YETI 1h
```

## Which command should I use?

Use **tip** when:

- you want to reward one person

Use **rain** when:

- you want to reward the latest active users
- you want a fixed number of recipients

Use **monsoon** when:

- you want to reward everyone active in a recent period
- you want a broader community drop

## Common questions

### Why didn’t I get included in a rain?

Rain only uses the **last N unique eligible speakers**.

If enough people spoke after you, you may have been pushed out of that set.

### Why didn’t I get included in a monsoon?

Monsoon only includes users whose counted messages were captured by the bot inside the exact chosen time window.

### Does just being in the group count?

No.

Rain and monsoon are based on counted messages, not group membership or passive presence.

## Summary

- **Tip** sends to one user
- **Rain** splits across the last **N** unique speakers
- **Monsoon** splits across **all** unique speakers in a chosen recent time window

That is the easiest way to think about the three commands.
