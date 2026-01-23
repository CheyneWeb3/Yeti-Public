# Yeti Dice House Guide and User Overview

## 1) Game rules (player-facing)

### Base game

* Command: **`/dice <amount>`**
* The system rolls a **fair 6-sided die (1–6)**.
* **Win condition:** roll a **6**
* **Payout on win:** **5× your bet** (credited to your internal balance)

  * Your **net profit on win** = **+4× bet**
  * Your **net loss on loss** = **−1× bet**

### “Ride winnings” chain (up to 4 times)

* After a win, the UI offers **“🔥 Ride winnings”**
* If you press it, the next bet becomes **your full payout** (i.e., bet = previous `payout`, which is 5× the prior bet).
* Max chain depth enforced: **4 rides** (chainIndex 0→4)

**Important real-world behavior:** the ride button can fail if your new (larger) bet is above max-bet / daily-cap / treasury-coverage at that moment (details below). As written, it doesn’t auto-clamp; it will just error.

---

## 2) House edge + why it’s economically viable

### Expected value (per bet)

House outcomes per bet size **b**:

* With probability **5/6**: player loses → **house +b**
* With probability **1/6**: player wins 5× → house pays 5b but already collected b → **house −4b**

So expected house profit:
[
E[\text{house}] = \frac{5}{6}(+b) + \frac{1}{6}(-4b) = \frac{1}{6}b
]

✅ **House edge = 1/6 ≈ 16.67% of handle** (very strong).

* Example: if players wager **100,000 credits/day**, expected house profit ≈ **16,667 credits/day** (before your broader platform fees/costs).

### Variance (risk)

This game is high variance (big spikes on wins), but you built strong caps so the house can’t get blown out by a single hit.

---

## 3) Hard safety checks and restrictions (enforced in API)

These are not “guidelines”—they are enforced in `diceStart()` and `diceResolve()`.

### A) Global rails kill-switch

* If `ctx.getRailsPaused()` is true → **start/resolve blocked**

### B) Per-chat pause toggle

* Each chat has `DiceSettings.paused`
* If paused → **dice disabled in that chat**

### C) Bet must be > 0

* `betRaw <= 0` → reject

### D) Optional per-chat minimum bet

* `DiceSettings.minBetYetiRaw`
* If set and bet < min → reject with “min bet here is X”

### E) Max bet is capped by BOTH treasury % AND daily win cap

#### 1) Treasury max bet (default 5% of dice treasury)

* Treasury has `maxBetBps` (default **500 bps = 5%**)
* `maxBetByTreasury = treasuryBalance * maxBetBps / 10000`

#### 2) Daily win cap (profit cap per user)

* `DAILY_WIN_CAP_HUMAN = "5000"` credits
* The system sums **today’s positive profits** for that user.
* Remaining allowed profit today:

  * `remainingProfit = 5000 - profitToday`
* Since a win yields **profit = 4× bet**, it computes:

  * `maxBetByCap = remainingProfit / 4`

#### Final max bet:

* `maxBet = min(maxBetByTreasury, maxBetByCap)`
* If bet > maxBet → reject with:

  * `max bet right now is X (cap/treasury)`

✅ This prevents one user from extracting more than **5000 credits/day profit** from Dice, regardless of bankroll size.

### F) Treasury solvency coverage check (critical)

Before accepting the bet, it checks the treasury can cover a win:

* Win payout = **5× bet**
* Treasury already receives the bet, so it only needs to have **extra 4× bet** available.
* Enforced:

  * `treasuryBalance >= 4× bet`
* If not, reject: **“treasury insufficient to cover payouts”**

### G) Game expiry safety

* Each game expires after **2 minutes**
* If user resolves after expiry:

  * Best-effort refund and mark **CANCELLED**
* **Note:** as written, the refund happens on *resolve attempt*, not automatically in the background.

---

## 4) Bankroll safety: worst-case scenario math (with your 5% cap)

Let treasury balance be **B**.

Max bet by treasury (default): **b = 0.05B**
Worst case: player wins → house net is **−4b = −0.20B**

So even the biggest allowed win costs the treasury **20%** of bankroll.

That’s a solid safety margin. It’s why this is deployable without getting insta-rekt.

---

## 5) Operator/admin controls (current)

Per-chat settings stored in `dice_settings`:

* Pause dice in that chat (`paused`)
* Auto-delete bot messages (`autoDeleteMessages`)
* Banner URLs: win/lose/taunt
* “Taunt streak” threshold (default 3)
* Min bet
* Quick bets list

Bot command:

* `/diceadmin` (group admins; or a single DM admin id if in private)

---

## 6) Practical issues to fix before production

These matter for “economically viable” because they affect abuse, support load, and stuck funds.

### 1) ACTIVE games can strand user funds if they never resolve

Right now:

* Bet is debited immediately.
* Refund on expiry only occurs if user later calls resolve (or you add a cleanup job).

**Fix:** add a scheduled cleanup that:

* Finds `status=ACTIVE && expiresAt < now`
* Refunds and marks CANCELLED automatically

### 2) No “one active game at a time” / spam throttling

A user can start many games quickly (each debits funds so not free), but it can still hammer your bot/API.

**Fix:** enforce:

* max 1 ACTIVE per user per treasury (or per chat), or
* rate limit: e.g. 1 start per 3–5 seconds per user

### 3) Ride winnings UX can error a lot

Because the ride bet is **5×**, it frequently hits:

* max bet cap
* daily cap
* treasury coverage

**Fix options:**

* auto-clamp ride bet to max allowed and message it
* or “ride profit” (4×) instead of full payout (5×)
* or reduce payout multiple so rides don’t explode as hard

---

## 7) Tuning knobs (if you want a softer game)

Current payout (5×) gives **16.67%** house edge, which is high.

General formula (win on 6, total payout = **m× bet**):

* Player EV = ((m-6)/6) per bet
* House edge = ((6-m)/6)

Examples:

* **m = 5.75×** → house edge ≈ **4.17%**
* **m = 5.5×** → house edge ≈ **8.33%**
* **m = 5×** → house edge ≈ **16.67%** (current)

---
