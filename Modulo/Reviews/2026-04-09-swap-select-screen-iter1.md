# Persona Review: swap-select-screen
**Date:** 2026-04-09
**Product:** modulo
**Iteration:** 1
**Input:** /Users/Frank/products/modulo/Prototype/swap-select-screen.html

## Results

### Alex DeFi Intermediate\n\n**Verdict:** CONCERNS

**Summary:** It looks like a clean, standard token picker, but it's currently just a UI shell that doesn't show me the cross-chain magic I actually need to see.

**Pain points addressed:** 
- **Fragmented portfolio view:** I can see balances right next to the token names, which is good for a quick glance.
- **Rate comparison:** If the search/list includes info on where the best rates are (as mentioned in my goals), that would be huge.

**Red flags triggered:** 
- **None yet**, but I'm waiting to see if the "Token name or address" search actually pulls up assets from different chains or if it's just a filtered list of one chain. If I search for an ETH address and it only shows me ERC-20s, I'm out.

**Missing:** 
- **Chain Indicators:** This is the biggest issue. If I see "USDC" in this list, I need to know *instantly* if that's USDC on Arbitrum, Polygon, or Ethereum. Without a chain icon or label next to the token, I'm flying blind and might accidentally initiate a swap that requires a bridge I didn't plan for.
- **Native Asset Distinction:** I want to see a clear visual difference between a native asset (like SOL or BTC) and a wrapped version. 
- **Multi-chain filtering:** I need a way to filter this list by network so I'm not scrolling through 500 tokens just to find my Polygon MATIC.

**Quote:** "The UI is slick and the search for contract addresses is a must-have, but unless they start labeling which chain each token belongs to, it's just another way to get confused."\n\n---\n\n### Jordan Crypto Curious\n\n**Verdict:** CONCERNS

**Summary:** It looks like a clean, standard list, but the moment I see "Token name or address" in the search bar, I feel that familiar spike of anxiety.

**Pain points addressed:** 
- **Too many steps to do anything:** The interface looks simple and easy to navigate, like a standard banking app, which is a relief.
- **Jargon kills confidence:** I don't see any scary terms like "liquidity pools" or "slippage" on this specific screen.

**Red flags triggered:** 
- **"Token name or address":** This is a huge red flag for me. Why on earth would I need to know or type in a "token address"? That's exactly the kind of technical, scary stuff that makes me want to close the tab. It makes me feel like I'm one wrong string of numbers away from losing my money.

**Missing:** 
- **Context/Safety:** I need to see more than just a name and a balance. If I'm selecting a token to "swap" or move, I need to see what the expected return is or a clear "safe" indicator.
- **Support/Help:** There's no "Help" icon or way to ask "What is this token?" if I don't recognize it.
- **Connection clarity:** I want to see a confirmation that the tokens listed are actually the ones I already have in my connected account (like Coinbase), so I don't feel like I'm hunting for something that isn't there.

**Quote:** "The app looks pretty easy to use and doesn't look like a hacker's terminal, but then it asks me for a 'token address' and suddenly I'm terrified I'm going to break something."\n\n---\n\n### Sam High Value Holder\n\n**Verdict:** CONCERNS

**Summary:** This is a standard, clean retail-grade token selector that lacks the financial data density required for institutional-level collateral management.

**Pain points addressed:** None; this is a purely navigational component that facilitates asset selection but does not address risk, rates, or transparency.

**Red flags triggered:** None, but the "retail" aesthetic is a slight warning; it feels more like a consumer swap tool than a professional liquidity interface.

**Missing:** I need to see the borrow APY/APR directly in the token list, the liquidity depth for the pair, and an indication of how selecting this token impacts my current LTV (Loan-to-Value).

**Quote:** "It’s a clean enough UI for a retail swap, but I’m not looking for a pretty list—I need to see the cost of capital and the liquidity depth before I even bother clicking a token."\n\n---\n\n## Overall: CONCERNS — review feedback before proceeding\n