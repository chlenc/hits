
# HITS4FUN: The Zero-Day Volatility Betting Protocol

## Overview

**HITS4FUN** is a decentralized on-chain protocol that enables users to speculate on intraday volatility through simplified, game-like options strategies with zero risk of liquidation. Built on **Base**, HITS4FUN transforms the traditionally complex world of zero-day options (0DTE) into a low-barrier experience for crypto traders and degen gamblers alike.

There is no token at this stage. The protocol is currently in public whitelist phase, offering early access to tickets that will become usable once the platform launches in mainnet.

## Vision

Zero-day options are one of the fastest-growing instruments in traditional finance. We aim to bring this explosive format into DeFi — in a radically simplified and gamified way.

With HITS4FUN:
* There is no need to guess market direction
* There is no liquidation risk
* There are no variable funding rates
* There is no complexity

Just one question: **Will the price break out of the range today?**

Our goal is to make high-frequency volatility exposure as easy and fun as placing a bet.

## Core Strategy: Range Breakout

At launch, HITS4FUN supports a single strategy:

### 🎯 Range Breakout

* You buy a ticket before the U.S. trading session opens
* Your ticket becomes active during the session
* If the price **breaks out** of a predefined range (either up or down), your ticket wins
* The **further** it breaks out, the **higher** the payout
* If the price stays within the range, your ticket expires

There is no need to choose direction. You're betting on **volatility**, not price action.

## Strategy Lifecycle: Three Phases

Each daily strategy runs through three distinct stages:

1. **Open**
   - Users may buy tickets
   - The range is not yet known
   - Starts several hours before the U.S. session

2. **Active**
   - U.S. session begins
   - Range is calculated and locked
   - Bets are frozen
   - Ticket outcomes will be determined after session ends

3. **Expired**
   - Session ends
   - Final price is compared to range boundaries
   - Payouts are calculated and distributed

## Ticket Economics & Payout

Tickets are fixed-price entries into a shared prize pool.

* The cost is determined based on market volatility
* The payout depends on how far the price moves **beyond** the range
* Winning tickets receive a proportional share of the prize pool

In case of a narrow move or no breakout, the ticket burns and no payout is granted.

## Oracle & Price Data

* HITS4FUN uses an internal price oracle integrated with **Deribit**, a leading options exchange
* The range boundaries are calculated based on **implied volatility** and real-time market data
* Opening and closing prices are captured from Deribit at U.S. session start and end

The system is **fully autonomous** and on-chain verifiable.

## Risk Model & Hedging

To ensure sustainability, all user bets are internally hedged:

* When a user buys a breakout ticket, HITS4FUN opens **straddle positions** (long + short) at the range boundaries
* If price breaks out — the hedge wins, and those profits fund the user’s payout
* If price stays inside the range — the ticket is lost, and the hedge is closed near breakeven

This model creates a **self-balancing loop** where:

- Payouts are real, not subsidized
- Risk is contained
- Treasury stays healthy

## User Journey

1. **Connect Wallet**
   - Supported chains: Base and Ethereum
   - User authorizes access through MetaMask or WalletConnect

2. **Select Asset**
   - Choose between available markets (e.g., ETH/USD, BTC/USD)
   - Asset list may grow over time

3. **Buy Ticket**
   - Available only during "Open" phase before the U.S. session begins
   - Ticket is purchased at a fixed price shown in the UI

4. **Wait for Session Start**
   - Once the U.S. session opens, your ticket becomes active
   - The price range is generated and displayed
   - No more tickets can be purchased during this phase

5. **Session Ends**
   - The trading session closes
   - The final price is captured and compared with the locked range

6. **Check Results & Claim**
   - If the price broke out of the range, you can claim your winnings immediately
   - If the price stayed inside the range, your ticket expires with no return

7. **Referral Rewards (Optional)**
   - If friends joined through your link, cashback accrues automatically

## Referral Program

Early users can earn rewards by inviting others to the protocol.

* Every user has a unique referral code or link
* Referrers earn **cashback** on every ticket purchase by their invitees
* The cashback percentage increases with volume
* Cashback is calculated even for **losing tickets**

Later versions will include a dashboard showing:
- Number of invitees
- Total volume from referrals
- Pending and earned rewards

## Early Access & Whitelist Benefits

The protocol is now in **Whitelist Phase**. Early participants who purchase tickets now will:

* Lock in a **20% discount** on ticket prices
* Become eligible for future **airdrop** rewards
* Be first to access the live strategies on mainnet
* Receive **cashback** on ticket purchases — even for failed tickets

This is your chance to bet early and double up later.

## Roadmap

| Phase         | Milestone                                             |
|---------------|--------------------------------------------------------|
| ✅ Now        | Site live, whitelist open, Base contracts deployed     |
| ⏳ +1 week    | Full UI, strategy engine, referral dashboard           |
| 🔜 +2 weeks   | Mainnet strategy launch, real ticket settlement        |
| 🔁 +1 month   | Multichain rollout planning (TON, Mantle, Gaianet etc) |
| 🧱 Q4         | Analytics, mobile app, multi-strategy support          |

## Links

Website: [https://hits4.fun](https://hits4.fun)  
Twitter: [https://twitter.com/hits4fun](https://twitter.com/hits4fun)  
Telegram: [https://t.me/hits4fun](https://t.me/hits4fun)  
Whitelist: [https://hits4.fun/whitelist](https://hits4.fun/whitelist)

_This whitepaper is a living document and will be updated as the protocol evolves._
