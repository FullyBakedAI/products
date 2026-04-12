# Persona Review: HomeScreen
**Date:** 2026-04-12
**Product:** modulo
**Iteration:** 1
**Input:** /Users/Frank/products/Modulo/React/src/HomeScreen.jsx

## Results

### Alex DeFi Intermediate\n\n**Verdict:** CONCERNS

**Summary:** The UI layout directly targets my biggest headaches—fragmentation and manual management—but the "Autopilot" and "SmartNudges" features feel like potential black boxes that could easily hide the exact friction I'm trying to avoid.

**Pain points addressed:** 
- **Fragmented portfolio view:** The "Live yield counter on portfolio balance" is exactly what I need—one unified number that actually tells me what my money is doing.
- **Rate comparison:** "SmartNudges" and "Autopilot" suggest the app is doing the heavy lifting of scanning protocols for me.
- **Cross-chain friction:** The "Autopilot" toggle implies a way to bypass the manual bridging dance.

**Red flags triggered:**
- **The "Black Box" Risk:** "Autopilot" is a massive red flag if it's just a polished interface hiding a chain of wrapped assets and high fees. If I can't see the path the transaction is taking, I won't use it.
- **Hidden Costs:** I see "SmartNudges," but if these nudges don't explicitly break down the gas costs and bridge slippage before I hit "confirm," it's just another way to lose money.

**Missing:**
- **Transparency of Mechanism:** I need to see a "View Path" or "Transaction Breakdown" component. I need to see the actual movement of assets (e.g., ETH -> Arbitrum -> Aave).
- **Proof of Nativity:** The code imports `tokenBtc`, but I need to see the logic that proves this isn't just another WBTC wrapper.
- **Audit/Security Visibility:** There's no immediate way to verify the safety of the "Autopilot" actions from this screen.

**Quote:** "The dashboard looks like it's actually trying to solve the fragmentation mess with that live yield counter and the autopilot toggle, but if 'Autopilot' is just a fancy way to hide a bunch of wrapped tokens and extra bridge fees, I'm out. Show me the plumbing or don't bother."\n\n---\n\n### Jordan Crypto Curious\n\n**Verdict:** CONCERNS

**Summary:** The dashboard looks like it's trying to be the "savings account" I want, but the code shows a lot of "smart" features and animations that might just be more confusing noise if they aren't explained simply.

**Pain points addressed:** 
- **F2 (Live yield counter):** Seeing my balance and how much it's actually earning in real-time is exactly what I need to feel like it's "working."
- **F3 (Autopilot toggle):** This is the "do it for me" feature I'm looking for—if it actually works without me needing to move funds manually, that's huge.
- **F4 (SmartNudges):** If these are actually helpful tips (like "you could earn more by doing X") rather than jargon, they could help me learn.

**Red flags triggered:** 
- **"Autopilot" ambiguity:** I don't know what "Autopilot" actually does. Does it move my money? Does it sell my Bitcoin? If I don't know the exact mechanics, I'm not clicking that toggle.
- **Complexity risk:** The sheer amount of motion, transforms, and "SmartNudges" makes me worry the app is going to be a flashy distraction from the actual facts (fees, rates, safety).

**Missing:** 
- **The "How":** I see "Live yield," but I don't see "How much does it cost me to get this?" or "How do I get my money back to Coinbase?"
- **The "Safety":** I don't see any mention of insurance, regulation, or how my assets are protected in this view.
- **The "Support":** I don't see a "Help" or "Contact" button in this initial layout.

**Quote:** "It looks pretty and it's showing me my earnings, which is great, but I'm still terrified that if I flip that 'Autopilot' switch, I'm going to wake up and find my Ethereum has vanished into some 'bridge' I didn't authorize."\n\n---\n\n### Sam High Value Holder\n\n**Verdict:** CONCERNS

**Summary:** The dashboard provides the right high-level visibility for monitoring yield and alerts, but the "Autopilot" feature and the promotional UI style lean too heavily toward retail marketing rather than institutional-grade transparency.

**Pain points addressed:** Portfolio health visibility (via SmartNudges) and monitoring idle capital (via Live yield counter).

**Red flags triggered:** "Autopilot" (implies a black-box mechanism that could execute trades or rebalances without my explicit, transparent oversight).

**Missing:** Transparent borrow rate displays, detailed LTV/Liquidation threshold breakdowns, and technical documentation for the "Autopilot" logic.

**Quote:** "The dashboard has the right idea with the alerts, but I'm wary of this 'Autopilot' nonsense—I need a professional terminal, not a magic button."\n\n---\n\n## Overall: CONCERNS — review feedback before proceeding\n