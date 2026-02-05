---
title: Introduction
description: What YetiCashier is and why it exists.
sidebar:
  order: 1
---

# YetiCashier in one sentence

YetiCashier is a modular **cashier + credits + community modules** platform built so communities can run like products — with security, accounting, and monetization that actually scales.

## Communities should be able to run like products

Crypto communities don’t fail because they lack passion. They fail because the tools don’t scale with the energy: bots, spreadsheets, manual work, giveaways you can’t track, and “engagement” that depends on whoever has time to grind the chat.

YetiCashier closes that gap with a real operating system for communities: identity, credits, accounting, security — plus modular experiences (games + utilities) that a group can turn on/off.

## The key idea: a group is a micro-economy

When you treat a group like a micro-economy, everything gets clearer:

- tipping that settles
- wagers and competitions
- treasury buckets for prize pools, dev funds, events
- measurable engagement based on real usage

Credits are designed to be solvent and auditable, so the economy isn’t pretend.

## Modular by design

The core stays clean. Modules plug in:

- blackjack, dice, whack-a-yeti
- tipping and utilities
- analytics
- third-party modules

This is how you scale features without turning the system into a shared-risk blob.

## Trust is not optional

This is architected like an enterprise platform:

- the Core API does **not** hold hot keys
- transaction sending is isolated to a Relayer
- on-chain events are indexed independently for accountability
- modules are isolated so one feature can’t drain another feature’s funds
- every balance-changing action is idempotent and auditable
