# Persona Review: swap-screen
**Date:** 2026-04-09
**Product:** modulo
**Iteration:** 1
**Input:** /Users/Frank/products/modulo/Prototype/swap-screen.html

## Results

### Alex DeFi Intermediate\n\n**Verdict:** CONCERNS

**Summary:** It's a clean-looking UI for a swap interface, but it's currently just a pretty skin that doesn't show me the actual cross-chain mechanics I need.

**Pain points addressed:** 
- **Rate comparison:** The UI structure allows for seeing token amounts clearly, which is a start for comparing values.
- **Fragmented view:** If this screen pulls from a unified liquidity pool/source, it could help reduce the need to jump between apps.

**Red flags triggered:** 
- **Under the hood uncertainty:** I see a "Swap" screen, but I don't see any indication of *how* the swap is happening. Is this just a Uniswap clone for one chain? Where is the destination chain selection? If I don't see a "Destination Chain" field, I'm assuming it's just a standard single-chain swap, which makes this just another MetaMask-style interface.

**Missing:** 
- **Destination Chain Selection:** This is the biggest gap. If I'm swapping ETH, I need to see if it's landing on Arbitrum, Optimism, or Base. Without a chain selector, there is no "cross-chain" value here.
- **Gas Transparency:** I don't see a breakdown of estimated gas fees or a way to see if the gas is being pulled from the source or destination.
- **Slippage/Route Info:** I need to see the path. Are we hitting a bridge? A DEX? A liquidity aggregator? I need to know the "how" before I click confirm.
- **Native BTC visibility:** I want to see if I can select a native BTC pair here without seeing a "wBTC" label.

**Quote:** "The UI is slick and doesn't feel like a cluttered mess, but right now it's just a pretty swap box—I need to see the destination chain and the routing logic before I'll even consider trusting it with my assets."\n\n---\n\n### Jordan Crypto Curious\n\n**Verdict:** CONCERNS

**Summary:** The interface is visually clean and uses intuitive language, but it's missing the critical "bottom line" details that prevent me from panicking.

**Pain points addressed:** 
- **Jargon kills confidence:** I love that it says "Pay" and "Receive" instead of "Input" and "Output" or "Liquidity Pool." It feels like a standard banking app.
- **Too many steps:** The layout suggests a single-screen transaction, which is much less intimidating than navigating a dozen different menus.

**Red flags triggered:** None yet, but I'm waiting to see if the next screen asks me to "bridge" or "approve" anything.

**Missing:** 
- **The "Deal":** I can see the amounts, but I don't see the exchange rate (e.g., "1 ETH = 2,500 USDC") or the total fee. I need to know exactly what I'm losing to the "house" before I click anything.
- **The "Safety Net":** There's no visible "Review" step or summary of the total impact on my balance. 
- **The "Go" button:** The code cuts off before the action button, and if that button just says "Swap" without a "Review Transaction" step, I'm going to be too scared to press it.

**Quote:** "It looks like a proper app, not some shady website, and I like that it doesn't use scary words, but I'm not hitting 'confirm' until I see exactly how much this is going to cost me in fees."\n\n---\n\n### Sam High Value Holder\n\n**Verdict:** CONCERNS

**Summary:** The interface is a clean, standard mobile swap UI, but it currently functions as a retail-grade "toy" rather than a professional-grade execution tool.

**Pain points addressed:** None. While the UI is legible, it doesn't address my need for rate transparency, slippage management, or the underlying mechanics of the trade.

**Red flags triggered:** None explicitly in the code, but the "retail" feel of the UI—focusing on large numbers and pretty icons rather than depth and execution data—is a yellow flag for me.

**Missing:** 
- **Slippage & Price Impact:** I can't see my tolerance settings or how much this trade will move the market.
- **Fee Transparency:** I don't see a breakdown of network fees, protocol fees, or spread.
- **Execution Logic:** There is no indication of where this liquidity is coming from or the "why" behind the quoted rate.
- **Security Context:** No quick-access link to the audit reports or smart contract addresses for the assets being swapped.

**Quote:** "It’s a polished interface for a retail user, but if I'm moving significant capital, I don't care about the 'pretty' font—I need to see the slippage, the impact, and the plumbing. Right now, this looks like a place where I'd lose money to hidden spreads."\n\n---\n\n## Overall: CONCERNS — review feedback before proceeding\n