# Modulo — Full App Persona Review
Generated: 2026-04-11 08:32
Model: gemma4:26b
Screens reviewed: HomeScreen, SwapScreen, AssetScreen, SendScreen, ReceiveScreen, ActivityScreen, OptimiseScreen, ExploreScreen, ActionsScreen, ReviewScreen, SuccessScreen

---

## 🔴 Critical (fix before any user testing)
1. **Autopilot Transparency:** Define and display the logic, risk parameters, and specific actions taken by the "Autopilot" feature to eliminate "black box" fears (Alex, Jordan, Sam).
2. **Audit & Security Visibility:** Provide prominent, one-tap access to smart contract audits and a dedicated security overview/tab (Alex, Sam).
3. **Customer Support Access:** Implement a visible "Help" or "Support" button/center to provide reassurance for high-value or novice users (Jordan).

## 🟡 High Priority (next sprint)
1. **"Actions" Menu Clarity:** Redesign the "Actions" menu to show exactly which smart contracts are being called and provide more advanced options like "Adjust Collateral" (Alex, Jordan, Sam).
2. **Bridge & Swap Transparency:** Explicitly state when a bridge is being used during a swap and include price impact/slippage estimations (Alex, Jordan, Sam).
3. **Chain/Network Terminology:** Simplify or provide context for "Chains/Networks" (e.g., using "Locations" or more intuitive labeling) to reduce jargon-induced anxiety (Jordan, Alex).
4. **Liquidation Risk Metrics:** Add real-time LTV (Loan-to-Value) and "Distance to Liquidation" indicators for active lending/borrowing positions (Sam).

## 🟢 Medium Priority (next 2 sprints)
1. **Gas Management Tools:** Implement a "quick top-up" or one-click gas replenishment feature to move assets between chains (Alex).
2. **News Feed Curation:** Implement protocol-specific filtering for the news feed to remove generic market noise (Alex).
3. **Contextual "Nudges":** Refine "SmartNudges" to provide clear "Why" context (e.g., "Move USDC to earn +£2") rather than vague instructions (Jordan).

## 💡 Feature Requests (backlog)
1. **Transaction Path Visualization:** A visual "map" showing the route of cross-chain swaps (Asset A $\rightarrow$ Bridge $\rightarrow$ Asset B) (Alex).
2. **Coinbase Integration:** A "Connect Coinbase" shortcut to import existing balances easily (Jordan).
3. **Security/Safety Score:** A simplified security rating for tokens/networks for non-technical users (Jordan).
4. **Yield Comparison Tool:** A dedicated view to compare APYs across different protocols (Alex).
5. **Advanced Margin Dashboard:** A dedicated sub-screen for monitoring margin calls and liquidation settings (Sam).
6. **Customizable UI:** Ability to hide non-essential elements like "Achievements" for a professional terminal view (Alex).
7. **Gas Price Alerts:** On-screen indicators for low gas periods on specific networks (Alex).

## Cross-Persona Themes
All personas highly valued the transparency of fee breakdowns (Network vs. Protocol) and the visibility of projected yields. However, there is a universal lack of trust regarding "hidden" logic, specifically concerning automated features (Autopilot), cross-chain routing (Bridges), and the underlying smart contract interactions (Actions).

---

# Individual Persona Reviews

## Alex DeFi Intermediate

## First Impression
This looks like the "holy grail" dashboard I've been looking for. The fact that I can see my BTC, SOL, and ETH balances all in one list with their specific chains (Bitcoin, Solana, Base) attached right to the icon immediately hits my biggest pain point: fragmentation.

## What Works Well (keep these)
* **The Unified Asset View:** Seeing different ecosystems (Arbitrum, Bitcoin, Base, Solana) in a single, unified list without having to switch network contexts in a dropdown is exactly what I need to stop the "app-hopping" fatigue.
* **Transparency in Swap Fees:** On the Review screen, breaking down the fee into "network" and "protocol" costs is huge. I hate getting to the confirmation screen and realizing a massive chunk of my swap went to a hidden service fee.
  * **Yield Prominence:** In the `AssetScreen`, putting the APY and projected earnings as prominently as the price is great. I don't just want to see what I *have*; I want to see what it's *doing*.
* **Chain Badging:** The color-coded chain dots on the `HomeScreen` assets are a clever, low-friction way to know exactly where my liquidity is sitting at a glance.

## Pain Points
* **The "Autopilot" Mystery:** On the `HomeScreen`, there's an "Autopilot inline toggle." As a developer, this makes me nervous. What is this actually doing? Is it rebalancing my portfolio? Is it executing trades? If I can't see the logic behind this toggle, I'm not turning it on.
* **The "How" of Swapping:** The `SwapScreen` shows a rate and fees, but it doesn't explicitly tell me if a bridge is being triggered. If I'm swapping ETH on Base to USDC on Arbitrum, I need to know if I'm trusting a third-party bridge or if Modulo is handling it natively.
* **Gas Management is still manual-looking:** I see my assets, but I don't see a "quick top-up" feature. If I see I have 0 ETH on Base but plenty of USDC on Arbitrum, I still want a one-click way to move some of that USDC to cover gas without a 5-step process.
* **News Noise:** The `AssetScreen` news feed is a nice touch, but if it's just a generic RSS scraper, it’s going to clutter my UI with useless info. I need protocol-specific updates (e.g., "Aave V3 upgrade"), not just general market noise.
* **Hidden Logic in "Actions":** The `AssetScreen` has an "Actions" button. I need to be able to drill down into exactly which smart contract is being called when I trigger a "lend" or "swap" action.

## Missing Features (dealbreakers for me)
* **Proof of Non-Wrapping:** I see "Native BTC" mentioned in the concept, but I need to see the technical proof in the transaction details. If I click a BTC asset and see it's actually just WBTC under the hood, I'm closing the app.
* **Audit Visibility:** There is no prominent link to security audits or a "Security" tab. I won't move my SOL or BTC into an app that doesn't explicitly show me its security posture.
* **Transaction Traceability:** I need a way to see the "path" of a cross-chain swap. Show me: *Asset A -> Bridge -> Asset B*. If the path is hidden, I can't trust the risk.

## Nice-to-Have Improvements
* **Gas Price Alerts:** A small indicator on the `HomeScreen` that tells me "Gas is low on Ethereum—good time to move assets."
* **Customizable Dashboard:** Let me hide the "Achievements" and "SmartNudges" if I just want a clean, professional-grade terminal.
* **Yield Comparison Tool:** A dedicated view that lets me compare the 4.8% on USDC in Aave vs. a different protocol without having to click into each asset individually.

## Overall Rating
**8/1/10.** The UI architecture perfectly addresses my need for a unified, cross-chain view, but the "magic" (Autopilot, cross-chain swaps) needs to be much more transparently documented before I trust it with my main stack.

---

## Jordan Crypto Curious

## First Impression
It looks a lot more like a polished banking app than the scary, technical wallets I've seen before, which makes me feel a lot less like I'm about to break something. The "Autopilot" idea is exactly what I've been looking for, though I'm still a bit nervous when I see words like "Arbitrum" and "Base" popping up everywhere.

## What Works Well (keep these)
* **The "Autopilot" toggle on the Home screen:** This is a huge relief. If I can just turn something on and let the app handle the "doing," I'm much more likely to use it.
* **Detailed Fee Breakdowns:** On the Swap Review screen, seeing exactly how much is "Network" vs "Protocol" is great. It makes me feel like there are no hidden costs being snuck in.
* **Plain-English "About" sections:** In the Asset screen, the description for USDC explains what it actually *is* (backed by cash, etc.) without using a bunch of scary math. It builds trust.
* **Projected Earnings visibility:** Seeing "Projected earn" right next to the price helps me understand the "why" behind using the app. It makes the benefit of the app immediate and clear.
* **The News Sentiment:** I love that the news feed tells me if the sentiment is "positive" or "neutral." It saves me from having to figure out if a headline is actually good or bad for my money.

## Pain Points
* **The "Chain" confusion (Asset/Home screens):** I see "Arbitrum," "Base," "Solana," and "Ethereum" listed everywhere under tokens. I don't know what those are, and seeing them listed as if they are different things is confusing and makes me feel like I might be sending money to the wrong place.
* **Jargon in "Active Positions" (Asset screen):** Seeing "Aave v3" and "Lending" under my assets is a bit much. I don't care about the protocol name; I just want to know my money is safe and where it is.
* **"SmartNudges" ambiguity (Home screen):** I'm worried these "Nudges" are just going to be notifications telling me to do complex things I don't understand, which will just lead me to close the app again.
* **The "Bridge" fear (Swap screen):** While the swap screen is clear, if the app starts asking me to "bridge" assets to get a better rate, I'm going to panic. The word "bridge" is a huge red flag for me.
* **The "Actions" menu (Asset screen):** The "Actions" button feels a bit like a mystery box. I'm afraid if I click it, I'll be presented with a list of technical settings that I can't undo.

## Missing Features (dealbreakers for me)
* **A visible "Help" or "Support" button:** If I'm moving £3,500, I need to know there's a human or at least a very good help center I can reach. I don't see an obvious way to contact anyone.
* **A "Connect Coinbase" shortcut:** If the app could just pull in my existing balances from Coinbase automatically, I wouldn't have to deal with the "transferring" part, which is the part that terrifies me most.

## Nice-to-Have Improvements
* **A "Safety Score" for tokens:** Instead of showing "Chains," maybe show a "Security Level" or "Reliability" rating that a non-expert can understand.
* **More "Why" context:** When the app suggests a move (like in the Nudges), it should say, "Move your USDC to earn an extra £2/month" rather than just "Optimize your USDC."
* **Simplified "Chains" terminology:** Could we just call them "Networks" or "Locations"? "Arbitrum" sounds like a sci-fi movie; "USDC (Network: Arbitrum)" is still scary.

## Overall Rating
7/10 — It feels much safer and more professional than other crypto apps, but the underlying technical jargon still makes me feel like I'm one wrong click away from a disaster.

---

## Sam High Value Holder

## First Impression
The interface looks surprisingly professional—it feels more like a high-end wealth management dashboard than a typical retail "degens" wallet. I like the immediate focus on yield and "putting assets to work," which aligns with my current goal, but I'm already looking for the fine print.

## What Works Well (keep these)
* **Fee Transparency:** In the `SwapScreen`, seeing the breakdown between network fees and protocol fees is vital. I hate getting to the confirmation screen only to realize the gas cost wiped out my margin.
* **Asset Context:** The `AssetScreen` is excellent. Including the "About" section, news sentiment, and specific protocol info (like seeing "Aave v3" listed under active positions) gives me the due diligence I need without hunting through block explorers.
* **Yield Visibility:** The live yield counter on the `HomeScreen` and the prominence of APY on the `AssetScreen` are great. I need to see my earnings as clearly as I see my principal.
* **Chain Clarity:** The color-coded chain badges on the `HomeScreen` are a small but significant detail. I need to know instantly if I'm interacting with a native Bitcoin layer or an Arbitrum-wrapped version.

## Pain Points
* **The "Autopilot" Mystery:** On the `HomeScreen`, there’s an "Autopilot" toggle. As someone who hates opacity, this is a red flag. Is this an automated strategy? A smart contract? If I can't see the logic or the risk parameters, I'm not turning this on.
* **Liquidation Blind Spot:** While I see "Active Positions" on the `AssetScreen`, I don't see a real-time LTV (Loan-to-Value) or a "Distance to Liquidation" metric. If I'm borrowing USDC against BTC, I need to know exactly how much of a price drop will trigger a liquidation.
* **Slippage & Impact:** The `SwapScreen` shows fees, but it doesn't show price impact or slippage estimation. If I'm swapping a significant amount of capital, I need to know if I'm moving the market before I hit "Review."
* **Audit Accessibility:** I see news and "About" sections, but there is no obvious, one-tap access to the underlying smart contract audits. In this industry, if the audit isn't visible, it's a dealbreaker.
* **Incomplete "Actions" menu:** The `AssetScreen` has an "Actions" button, but for a holder like me, I need more than just "Swap" or "Send." I need "Adjust Collateral" or "View Margin Call Settings" to be front and center.

## Missing Features (dealbreakers for me)
* **Margin Call/Liquidation Dashboard:** I need a dedicated sub-screen that aggregates all my collateralized positions and ranks them by risk (LTV %). I can't manage a portfolio if the risk metrics are buried.
* **Technical Proof of "Native" BTC:** If you claim to support native BTC, I need a way to verify the UTXO/Script logic within the app. I need to see the "how" to trust the "what."
* **Slippage Controls:** A way to set maximum allowable slippage on the Swap screen to prevent predatory MEV or liquidity issues.

## Nice-to-Have Improvements
* **Advanced Charting:** The `AssetScreen` uses a basic line chart. Adding volume or RSI would help me understand market momentum when deciding whether to move capital.
* **Direct Explorer Links:** A small icon next to every transaction or active position that opens the specific transaction on Arbiscan, Etherscan, or Mempool.space.
* **Stress-Test Simulator:** A tool where I can input a hypothetical BTC price (e.g., "What happens if BTC hits $60k?") and see the immediate impact on my borrowing power.

## Overall Rating
**7.5/10.** The UI/UX is sophisticated and respects my need for data, but the lack of explicit risk management tools (LTV/Liquidation tracking) prevents me from trusting it with my primary BTC stack.

---

