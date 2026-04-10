# Persona Review: HomeScreen
**Date:** 2026-04-09
**Product:** modulo
**Iteration:** 1
**Input:** /Users/Frank/products/Modulo/React/src/HomeScreen.jsx

## Results

### Alex DeFi Intermediate\n\n**Verdict:** CONCERNS

**Summary:** The UI looks like it’s hitting the right notes for a unified dashboard, but the underlying tech is still a black box that could easily be hiding the same old bridging mess.

**Pain points addressed:** 
- **Fragmented portfolio view:** I like seeing USDC on Arbitrum, BTC, and ETH on Base all in one list with a single total balance. It solves the "how much do I actually have" problem.
- **Rate comparison is manual:** The "SmartNudges" and yield info (yield/yieldUsd) directly on the token line are great; I don't want to hunt for where my money is working hardest.
- **Gas management:** Seeing the chain badges (Arbitrum, Base, etc.) right next to the tokens helps me realize immediately which chain I'm about to run out of gas on.

**Red flags triggered:**
- **Under the hood it's still wrapping assets:** The `CHAIN_BADGE` shows `btc` on `Bitcoin` and `eth` on `Base`. If I click that BTC and it's actually just WBTC sitting on Arbitrum, I'm out. I need to see the settlement layer.
- **Gas costs hidden until confirmation:** The UI shows "SmartNudges" and "Autopilot," which sounds like it's making decisions for me. If the app is automating swaps or moves, I better see the exact gas fee and slippage *before* I hit confirm.

**Missing:**
- **The "How":** I need a "View Transaction Path" or "View Settlement" button. If I'm moving SOL to ETH, I need to see if it's a cross-chain swap or a bridge.
- **Proof of Native:** For the BTC entry, I need a way to verify this isn't a wrapped derivative.
- **Detailed Protocol Breakdown:** I see the yield, but I don't see *where* it's coming from (Aave? Uniswap V3? Something else?).

**Quote:** "The dashboard finally gives me a single number for my entire mess of a portfolio across four different chains, but I'm not clicking 'Autopilot' until I can see the actual transaction path and verify there's no hidden wrapping involved."\n\n---\n\n### Jordan Crypto Curious\n\n**Verdict:** CONCERNS

**Summary:** The dashboard looks visually professional and easy to read, but it's already overwhelming me with too much data and "crypto-native" details that I don't need.

**Pain points addressed:** 
- **I don't know what I'm getting into:** I like that it shows me the actual dollar value (`$5,616.88`) alongside the crypto amount; it makes it feel more like a real bank account.
- **Trust signals:** The "Yield" being shown as a dollar amount (`$101.10`) is helpful because I can actually see the reward in money I understand.
- **Too many steps:** The "Autopilot" toggle and "Put It All To Work" promo suggest there might be a way to automate this without me having to manually bridge everything.

**Red flags triggered:** 
- **Jargon kills confidence:** Seeing "Arbitrum," "Base," and "Solana" as badges on my tokens is confusing. I don't care what "chain" they are on; I just want to know my money is safe.
- **Trader-centric design:** The screen is packed with "mini sparklines," "1D/1W/1M" toggles, and "PnL" percentages. This looks like a trading terminal for pros, not a simple savings app for me. It's a lot of "noise" that makes me feel like I'm going to make a mistake.

**Missing:** 
- **The "How":** I see my Bitcoin is earning 1.8%, but I don't see a clear "Connect Coinbase" button or a simple explanation of how the money gets from my Coinbase account to this app.
- **Support/Safety:** I don't see any obvious way to contact a human or any reassurance that this isn't just another DeFi protocol that could disappear tomorrow.

**Quote:** "The app looks clean and it's great seeing exactly how much extra cash I could be making, but there's a lot of technical clutter and 'chain' nonsense that makes it feel like I'm looking at a professional trading screen instead of a simple savings tool."\n\n---\n\n### Sam High Value Holder\n\n**Verdict:** CONCERNS

**Summary:** This looks like a polished retail wallet interface, but it's missing the institutional-grade depth and risk management tools I need to actually move my BTC.

**Pain points addressed:** 
- **Portfolio health visibility:** I see the token list and the ability to track balances and yields at a glance, which is a start.
- **Yield visibility:** The "Live yield counter" and specific yield percentages per token (e.g., 0.048 for USDC) show you're at least thinking about the incentive for me to move capital.

**Red flags triggered:** 
- **Lack of Transparency:** The code shows "all data mocked." While I get it's a frontend artifact, I see no mention of the underlying collateralization mechanism or how the "Autopilot" (F3) actually functions. If "Autopilot" means automated liquidation or rebalancing without my explicit oversight, that's a massive red flag.
- **Retail Bias:** The UI elements like "Achievements" (F6) and "Trophy" icons feel like they're designed for a Gen-Z crypto trader, not someone managing an $800k BTC position. I don't need "gamification"; I need "professionalism."

**Missing:** 
- **The "Why" of the Rate:** You show me a 4.8% yield on USDC, but you don't show me the *mechanism*. Is this lent out on Aave? Is it a liquidity pool? Where is the risk disclosure?
- **LTV and Risk Management:** I see "pnl" and "change," but I don't see my Margin Call price, my current Loan-to-Value (LTV) ratio, or my liquidation buffer.
- **Audit Trail/Security:** There is no visible link to smart contract audits or technical documentation within this primary view.
- **Native BTC Evidence:** The `CHAIN_BADGE` shows 'Bitcoin' for BTC, but I need to see the technical proof that this isn't just another wrapped derivative (WBTC/cbBTC).

**Quote:** "The dashboard looks slick and the yield tracking is a nice touch, but right now it feels like a high-end retail trading app, not the DeFi prime brokerage I'm looking for. It's got the 'what' (my balances), but it's missing the 'how' (the risk and the mechanics)."\n\n---\n\n## Overall: CONCERNS — review feedback before proceeding\n