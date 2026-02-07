---
title: Relayer Overview
description: How intents become on-chain transactions.
sidebar:
  order: 1
---

# Relayer Overview

The Relayer is the only service that holds the hot key and submits vault transactions.

## Responsibilities

- Poll pending intents from Core API
- Submit on-chain calls to the vault
- Mark intents as submitted/confirmed/failed (via Core API)
- Stay minimal and isolated (small blast radius)

## What it does NOT do

- It does not decide authorization (Core + signatures do)
- It does not write to the database directly

## Hardening (recommended)

- selector allowlist (day-1 recommended: enabled)
- target allowlist
- optional pair allowlist
