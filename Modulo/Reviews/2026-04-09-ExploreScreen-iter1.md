# Persona Review: ExploreScreen
**Date:** 2026-04-09
**Product:** modulo
**Iteration:** 1
**Input:** /Users/Frank/products/Modulo/React/src/ExploreScreen.jsx

## Results

### Alex DeFi Intermediate\n\n**Verdict:** CONCERNS

**Summary:** It’s a clean, functional market discovery UI, but right now it’s just a glorified CoinGecko clone that doesn't show me any of the cross-chain magic or yield data I actually need.

**Pain points addressed:** 
- **Rate comparison is manual:** I like that I can see price and volume at a glance, and the ability to filter by "Gainers" or "Losers" helps me spot market movements quickly without tab-switching.
- **Fragmented portfolio view:** The "All" chain filter suggests a unified view, which is a good start for seeing everything in one list.

**Red flags triggered:** 
- **App feels like a polished MetaMask with no real cross-chain innovation:** This code is just a list of tokens. I don't see any mention of lending rates, liquidity pools, or the "how" behind the cross-chain movement. If this is just a price tracker, I'm not interested; I need to see the *utility* (yield/borrow) attached to these tokens.

**Missing:** 
- **Yield/Lending Data:** This is the biggest gap. If I'm looking at ETH, I don't just want to see the price; I want to see "4.2% APY on Aave" right there in the list.
- **Chain-specific visibility:** The `CHAINS` constant exists, but the token data itself doesn't show which chain the liquidity is sitting on. If I click "Arbitrum," I need to see the Arbitrum-native opportunities.
- **The "Native BTC" promise:** I see BTC in the list, but there's no indication of how it's being handled. Is it WBTC? Is it native? The UI needs to signal the tech advantage.

**Quote:** "The UI looks slick and the filtering works, but it's currently just a pretty price aggregator. It's missing the actual 'engine'—show me the yields and the cross-chain mechanics, or it's just another tab I have to keep open."\n\n---\n\n### Jordan Crypto Curious\n\n**Verdict:** CONCERNS

**Summary:** It looks like a decent market tracker, but it feels like a trading terminal for pros rather than a helpful tool for someone who just wants to earn interest on what they already have.

**Pain points addressed:** 
- **Jargon kills confidence:** It uses recognizable names like Bitcoin and Ethereum, which helps me feel oriented.
- **I don't know what I'm getting into:** Seeing the price and the 24h change helps me see the current state of the market without needing to leave the app.

**Red flags triggered:**
- **Anything that looks like it was designed for traders, not for me:** This screen is all about "Volume," "Gainers," "Losers," and "Price." It’s very "Wall Street." I’m not trying to day-trade; I'm trying to find a safe place to put my ETH. The focus on "Top Losers" and "Volume" makes it feel volatile and high-risk.

**Missing:**
- **The "So What?" factor:** I see Bitcoin is up 2.14%, but I don't see a button or a clear message saying "You could earn 4% on this." It's just data.
- **Connection to my assets:** I don't see anything here that links back to my actual Coinbase holdings. I want to see my £3,500 and then see these tokens as *opportunities* for that specific money.
- **Simplicity:** The "Chains" filter (Arbitrum, Optimism, etc.) is exactly the kind of jargon that makes me want to close the tab. I don't care about the chain; I care about the coin.

**Quote:** "It's a nice-looking list of crypto prices, but it feels like a stock market app for people who spend all day staring at charts—I'm still just looking for a way to make my coins work without the headache."\n\n---\n\n### Sam High Value Holder\n\n**Verdict:** CONCERNS

**Summary:** This is a standard market-tracking interface that functions like a basic crypto aggregator, but it lacks the specific financial primitives—like borrow rates and lending yields—that a liquidity seeker needs to make a decision.

**Pain points addressed:** None. While it provides basic market visibility (price and volume), it does nothing to address my concerns regarding opaque rates, liquidation mechanics, or the distinction between native and wrapped assets.

**Red flags triggered:** Opaque rates. I'm looking at a list of assets, but I see zero information regarding the cost of borrowing USDC or the yield available for supplying BTC. If I'm browsing "Explore" to find opportunities, seeing only price action is useless; I need to see the spread and the cost of capital.

**Missing:** 
- **Borrow/Supply Rates:** There is no APY/APR visible for any of the tokens.
- **LTV Information:** If I'm looking at BTC, I need to see the maximum allowable Loan-to-Value (LTV) right there in the discovery phase.
- **Asset Type Clarification:** I need to see a clear indicator if the BTC listed is native or a wrapped variant.
- **Actionability:** The screen shows "Trending" and "Gainers," but there's no "Borrow" or "Lend" quick-action button to move from discovery to execution.

**Quote:** "It’s a nice-looking dashboard for tracking price volatility, but it’s essentially just a glorified CoinGecko clone. I don't need to see that BTC is up 2%; I need to see what it costs me to borrow USDC against it."\n\n---\n\n## Overall: CONCERNS — review feedback before proceeding\n