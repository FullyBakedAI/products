# Persona Findings: Sam — High-Value Crypto Holder
**Evaluated by:** Peggy (BakedUX engagement agent), embodying Sam persona
**Date:** 2026-04-04
**Artefacts reviewed:** modulo.finance (live), mobile app screenshots (6 screens)
**Engagement phase:** Discovery → Persona Testing

---

## Executive Summary

Modulo has a compelling thesis and a genuinely interesting architecture claim. But from Sam's vantage point — $800k+ in BTC, 12 years in institutional trading, deeply comfortable with complexity — the current product surface raises more questions than it answers. The marketing is confident. The substance, at this stage, is thin. That gap is the work.

Sam would not commit real capital today. But Sam would not walk away either. That's actually a meaningful signal: the underlying idea has pull. The execution needs to earn the trust the marketing is already claiming.

---

## 1. First Impressions — Does the Value Proposition Hold Up?

**What the site says:** "One vault, every chain." Borrow, stake, lend, and trade across dozens of chains. No bridges, no wallet switching. Native asset support.

**Sam's read:**

The headline lands. "No bridges, no wrapping" is exactly what I've been waiting to hear — WBTC's dependence on BitGo is a real custodial risk I've been unwilling to accept, and the space hasn't solved it cleanly. If Modulo has genuinely solved native BTC collateral without wrapping, that's a structural differentiator. I want to believe it.

But the site doesn't tell me *how*. It describes what the system does — "real-time collateral routing," "four-layer architecture" — without explaining the mechanism. In TradFi, if someone told me they could lend against my asset without taking custody of it, my first question would be: what's the settlement mechanism? Who holds the lien? What enforces the collateral? These aren't nitpicks. They're the entire product.

The site's four-layer architecture diagram (Wallet → Logic → Protocol → Integration) is gestured at but not explained. That's fine for a waitlist page targeting mainstream holders, but it leaves someone like me with a list of unanswered technical questions and no obvious path to get them answered.

**Verdict on value prop:** Directionally right. Technically unsubstantiated. For Sam, directionally right is enough to keep reading — not enough to deploy capital.

---

## 2. What Genuinely Interests Sam

**Native BTC collateral without wrapping.** This is the product. If true, it solves the single biggest barrier preventing serious BTC holders from accessing DeFi. The WBTC/BitGo custodial risk is not theoretical — it's a real trust assumption that eliminates a significant population of self-custody holders. If Modulo routes collateral natively without wrapping, that's worth serious attention.

**Portfolio-wide borrowing in one click.** The site describes "one-click borrowing" against an entire cross-chain portfolio. This is a prime brokerage concept — netting exposure across assets, unified margin, single interface. I've wanted this for years. TradFi has it. DeFi doesn't.

**Fixed-rate borrowing.** The mention of fixed rates is notable. Variable rates in DeFi can spike catastrophically during volatility (the exact moment you most need liquidity). Fixed rates would dramatically change the risk calculus for large positions. I'd want to understand the rate-fixing mechanism — is it truly fixed or is there a repricing trigger?

**Username-based receiving and passkey auth.** Less relevant to my use case but signals that the team is thinking about UX holistically. Not a buying signal but a credibility signal for the team's product thinking.

**Tokenized RWAs as collateral.** Interesting. The combination of BTC + RWA collateral pools is a genuinely sophisticated institutional concept. Worth watching.

---

## 3. What Sam Needs to See Before Committing Real Capital

These are not feature requests. They are go/no-go criteria. If any one of these is missing when I'm ready to act, I close the tab.

1. **Smart contract audit reports** — named firm, date, scope, findings, remediation status. Not "audited by" — the actual report PDF linked.
2. **Liquidation mechanics documented end-to-end** — at what LTV does liquidation trigger? Is there a grace period? Is there a notification mechanism? What is the liquidation penalty? Who executes the liquidation — keepers, protocol, third party?
3. **Borrow rate transparency** — what is the rate today? How is it set? What are the historical rate bounds? Is "fixed" truly fixed for the loan duration or subject to governance?
4. **TVL and counterparty depth** — how much liquidity is in the protocol? Who are the lenders on the other side? A $500k borrow against thin liquidity is a different risk profile than borrowing from a deep pool.
5. **Legal and regulatory structure** — where is Modulo incorporated? What jurisdiction governs disputes? Is there a terms of service that creates any recourse, or is this purely code-is-law?
6. **Team identities** — I need to know who is accountable. "Anthony Merriman" is mentioned in our brief as the founder. That name and track record (Talos) should be front and centre on the site. Anonymous teams are a hard stop.
7. **Oracle mechanism** — what price feeds determine collateral value and trigger liquidation? Chainlink? TWAP? Custom? Oracle manipulation is a real attack vector.
8. **The native BTC mechanism explained** — how exactly does BTC stay "native"? Is it held in a multisig? A threshold signature scheme? A cross-chain messaging protocol? Who controls the unlock conditions?

---

## 4. Trust Signals — Present and Absent

### Present

- Non-custodial framing ("your keys, your control") — correct instinct, but unverified
- Legal disclaimer present ("use at your own risk") — minimal but shows legal awareness
- Social presence (LinkedIn, Twitter, Discord, Telegram) — some accountability surface
- Passkey authentication — signals modern security thinking
- Professional visual design — inspires baseline confidence, not a trust signal on its own

### Absent (and these matter)

- **No audit reports** — this is the single biggest gap for someone at my level
- **No team page** — who built this? Who is responsible if something goes wrong?
- **No TVL figure** — protocol depth is a primary risk indicator
- **No rate disclosure** — not even indicative ranges
- **No whitepaper or technical documentation** — just marketing copy
- **No track record** — no case studies, no user testimonials from verifiable sources, no disclosed institutional relationships
- **No regulatory clarity** — nothing about jurisdiction, licensing, or how they handle compliance for non-custodial infrastructure

The trust deficit is significant. It's not disqualifying — Modulo is clearly early stage and some of these will come — but the gap between the marketing confidence and the substantiation is wide.

---

## 5. Is the Mobile App Appropriate for Sam's Use Case?

**Short answer: No, not as shown. But that's expected at this stage.**

The mobile app is the right *direction* for accessibility and onboarding, but Sam's use case is not a mobile use case. Managing an $800k BTC collateral position — monitoring LTV ratios in real time, adjusting collateral buffers, responding to margin pressure — is a desktop or professional terminal activity. The equivalent in TradFi is a Bloomberg terminal, not a banking app.

The mobile app shown appears to be a portfolio/wallet/swap interface. That has real value for Sam as a secondary tool — checking position health on the go, receiving assets, quick status checks. But the primary interface for active position management needs to be desktop, and it needs to be dense with data.

The mobile app also shows a portfolio value of $12,847 — a plausible retail position but not a high-value holder's primary account. If the app scales to display $800k+ positions with the same visual grammar, it needs to handle that magnitude clearly (both the numbers and the risk indicators that come with them).

**The right frame:** Mobile = monitoring and simple transactions. Desktop = position management, borrow decisions, collateral adjustment.

---

## 6. Screen-by-Screen Reactions — Mobile App

### Screen 1: Portfolio (mobile-2091-8253.png)

The portfolio home screen. Total value: $12,847 with a sparkline trend indicator. Navigation bar at top. Asset list below: USD Coin, Wrapped Bitcoin, Ethereum, Solana, Tether.

**Sam's reaction:**

The layout is clean. Asset list is sensible. But I immediately notice: **Wrapped Bitcoin** is in the asset list. This is a problem. The entire value proposition of Modulo is native BTC without wrapping — but the portfolio screen is showing WBTC. Either this is a design artefact from an early prototype, or the native BTC story is aspirational rather than current. I need to understand which.

The sparkline trend is decorative at this resolution — I can't see the timeframe, scale, or any meaningful data. For monitoring purposes it's useless; it just tells me the line went up. I need real data: 24h change, 7d change, absolute P&L.

The "Ready to Earn" label beneath the total is interesting copy but unexplained in context. Earn what? At what rate? With what risk?

Action buttons (Swap, Buy, Send, Receive) are basic wallet actions. Nothing specific to borrowing or lending — the core product use case is invisible from the home screen.

**Critical gap:** No LTV indicator, no borrow position summary, no health factor, no liquidation distance. If I have an active borrow position, where do I see it?

### Screen 2: Receive (mobile-2091-8010.png)

QR code screen with username display and options to receive from Coinbase, Binance, or Kraken.

**Sam's reaction:**

Clean and functional. The username-based identity is a good UX concept. The exchange integration shortcuts (Coinbase, Binance, Kraken) are practical for onboarding capital from where it currently sits. This is one of the better-executed screens I've seen so far in terms of clear purpose.

No complaints at the functional level. For my use case this is a secondary screen — I'd use it once to fund the account, then rarely again.

**Minor observation:** The chain selector tabs below the QR code (partially visible) matter a lot. If I'm receiving native BTC, I need to know exactly which network/address I'm sending to. This has to be unambiguous — a single send to the wrong address on an $800k transaction is catastrophic.

### Screen 3: Swap (mobile-2091-8498.png)

Swap interface. From token: ETH, Amount: 0. To token: "Select token." Percentage shortcuts (25%, 50%, 75%, Max). Numeric keypad.

**Sam's reaction:**

Functional but minimal. Standard AMM swap UI. My concern here is rate transparency — where is the exchange rate? The slippage tolerance? The fee? The price impact? Before I execute any swap of meaningful size, I need to see all of these *before* I hit confirm. The screen as shown offers none of it.

For large orders, price impact is material. A swap of significant ETH into USDC on a thin pool could have 1-3% slippage. I need to see this displayed prominently, not buried in a settings screen.

The "Select a token" prompt at the bottom suggests the interface isn't fully rendered without a destination token selected, which makes sense — but it means I'm evaluating a partially complete UI. Can't judge the output screen.

**Missing for Sam's use case:** No swap-to-collateral shortcut. If I want to rebalance collateral, I should be able to swap directly into a collateral position from this screen.

### Screen 4: Select Token (mobile-2091-8609.png)

Token selection modal. Search bar. List: ETH, USDC, WBTC, SOL, USDT with balances.

**Sam's reaction:**

Again I see WBTC, not native BTC. This reinforces my concern from the Portfolio screen. If the core product claim is "no wrapping" but the token list shows WBTC, one of these is wrong. The native BTC story needs to be represented in the token list — or explicitly explained (perhaps "BTC" represents the native asset and "WBTC" is shown as an alternative for compatibility).

The search functionality is appropriate. The balance display alongside each token is correct — I want to see what I have before I select what to swap. Clean execution.

**Minor:** No price display alongside assets. I'd want to see current USD value, not just balance quantity, before selecting.

### Screen 5: Select Recipient (mobile-2091-8793.png)

Recipient selection. Address/ENS/username search field. Recent contacts: a hex address, "modulo.eth", and "0x0d45_0x3a".

**Sam's reaction:**

The address book concept is solid. Repeat transactions are common and manual address entry is error-prone (and catastrophic when wrong). Saving recipients is a sensible feature.

The modulo.eth name in recents is interesting — suggests ENS resolution is supported, which is good. The username system mentioned on the marketing site should be more prominent here.

**Sam's concern:** For high-value sends, I want address verification that goes beyond "I recognise this address." I want to see the full address displayed, not truncated. I want to be able to confirm the last time I sent to this recipient and what I sent. The truncated display (0x4248_0733, 0x0d45_0x3a) is genuinely dangerous for large transactions — substring attacks are real.

### Screen 6: Browse (mobile-2091-9115.png)

Search/browse screen. Featured assets: ETH ($2,406.78, +4.5%) and BTC ($66,421.33, -12.9%). Filter tabs: All, Gainers, Base, Optimism. Asset list: USD Coin, Ethereum, Tether, Wrapped Bitcoin, Solana.

**Sam's reaction:**

This is a market discovery screen. The price data is live — I can see BTC at $66,421 (which suggests this is an older design vintage, or test data). The percentage changes are displayed.

The filter tabs reference specific chains (Base, Optimism) which is interesting — it implies the portfolio view is chain-aware, not just asset-aware. That's architecturally promising.

But again: WBTC appears in the asset list, not native BTC. And this screen is fundamentally a retail discovery tool. Sam doesn't need a "Browse" screen — Sam already knows what assets exist. What Sam needs is a "Positions" screen showing active borrows, collateral health, and utilisation.

**The deeper problem with this screen:** It reframes Modulo as a trading/portfolio app, not a borrowing/lending protocol. For Sam's use case, this screen is noise. The signal is: where is my borrow health? What is my LTV? How far am I from liquidation?

---

## 7. What Sam Would Need in a Dashboard to Manage a Significant Position

This is the product Modulo needs to build for the high-value holder segment. The mobile app as shown doesn't contain it. Here's what the primary dashboard must include:

### Position Health Panel (above the fold, always visible)
- Total collateral value (USD, updated in near real-time)
- Total borrowed value (USD)
- Current LTV ratio — displayed prominently, not in a sub-screen
- Liquidation threshold LTV — clearly labelled
- Health factor or "distance to liquidation" (as a percentage buffer, not just a ratio)
- Visual indicator: green/amber/red based on health (not just a number — make the risk state legible at a glance)

### Active Positions List
- Each borrow: asset, amount, borrow rate, origination date, maturity (if fixed)
- Each collateral position: asset, amount, current value, contribution to LTV
- Net APY on overall position (earnings minus borrow cost)

### Rate Transparency
- Current borrow rate for each borrowed asset (displayed before and during borrow)
- Rate type: fixed vs variable, rate history graph (30d minimum)
- Rate change alert settings

### Liquidation Mechanics Panel
- Step-by-step explanation of what happens at liquidation (accessible from dashboard, not hidden in docs)
- Current liquidation penalty percentage
- Partial vs full liquidation mechanics
- Notification settings (push, email, SMS threshold alerts at e.g. 80% LTV, 90% LTV)

### Oracle Price Feeds
- Which oracle is providing prices for my collateral
- Last updated timestamp
- Deviation bands (how far can the price move before triggering liquidation vs the oracle price)

### Transaction History
- Full history with filtering by type (borrow, repay, add collateral, withdraw)
- Gas costs visible per transaction
- Exportable for tax reporting

### Desktop-first consideration
All of the above should be accessible on desktop with data-dense layout. The mobile version should be a monitoring-focused subset. The design system needs to accommodate both contexts without compromising either.

---

## 8. Due Diligence Gaps

These are structured as the questions Sam would submit to any DeFi protocol before committing capital. They are not rhetorical — they are actual gaps in the current public materials.

### Security / Technical
- **Audit status:** No audit reports linked anywhere on modulo.finance. This is a hard stop for deploying significant capital. Minimum acceptable: one report from a named top-tier firm (Trail of Bits, OpenZeppelin, Halborn, Certora). Preferred: two independent audits plus a bug bounty program.
- **Smart contract addresses:** Not disclosed. I can't independently verify on-chain what I'm interacting with.
- **Oracle mechanism:** Not specified. Price feed manipulation is the most common DeFi exploit vector.
- **Bridge/cross-chain security:** The "no bridges" claim needs technical explanation. Cross-chain messaging still has failure modes. What is the failure mode here?
- **Upgrade mechanism:** Are contracts upgradeable? Who controls the upgrade keys? Is there a timelock?

### Financial / Protocol
- **Borrow rates:** Not disclosed. Not even indicative ranges. I don't know if I'm looking at 2% APR or 15% APR.
- **LTV ratios by asset:** What LTV does BTC collateral support? 50%? 70%? This drives the entire product utility calculation.
- **Liquidation mechanics:** Fully absent from public materials. This is the risk I care most about and it's completely undisclosed.
- **TVL:** Not published. Protocol depth is a primary risk indicator.
- **Insurance/backstop:** Is there a protocol insurance fund? What happens to under-collateralised positions in extreme market conditions?
- **Counterparty risk on lending side:** Who are the lenders? What's the redemption mechanism if lenders withdraw en masse?

### Legal / Regulatory
- **Jurisdiction:** Not disclosed. Where is Modulo incorporated?
- **User eligibility:** Are US persons permitted to use the protocol? What jurisdictions are excluded?
- **Regulatory status:** Non-custodial DeFi exists in a grey zone that is actively being litigated in multiple jurisdictions. What is Modulo's legal position?
- **Recourse:** The disclaimer says "use at your own risk." If a bug in the protocol causes loss, is there any recourse? This is not about trust — it's about understanding the actual risk I'm accepting.

### Team / Governance
- **Team identities:** No team page on the site. The brief mentions Anthony Merriman (Talos background). This should be publicly visible.
- **Governance:** Who controls protocol parameters? Is there a DAO? A multisig? Named individuals?
- **Roadmap:** What's built vs what's planned? The site describes a full product suite but this appears to be pre-launch.

---

## 9. Summary Assessment

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Value proposition clarity | 3/5 | Right thesis, missing mechanism |
| Trust signals | 1/5 | No audits, no team, no rates |
| Native BTC claim | Unverified | WBTC shown in app contradicts marketing |
| Mobile app fitness for Sam | 2/5 | Wrong mode — monitoring not management |
| Due diligence readiness | 1/5 | Most critical questions unanswered |
| Visual/UX quality | 3/5 | Clean, functional, lacks financial sophistication |
| Liquidation transparency | 0/5 | Completely absent |
| Rate transparency | 0/5 | Completely absent |

**Would Sam join the waitlist?** Yes — the underlying concept has genuine merit.
**Would Sam commit capital at current state?** No.
**What would move Sam to commit?** Audit reports, rate disclosure, liquidation documentation, team visibility, and a position management dashboard that respects the complexity of what's being asked.

---

## 10. Recommendations for Product Direction (Sam's Lens)

These are not design opinions. They are the product requirements that would convert a high-value holder into an active user.

1. **Publish audit reports before any soft launch.** Not "audits are in progress." Actual reports. This is table stakes.

2. **Build the position health dashboard first.** Before the browse screen, before the swap screen — the core product is collateral management. Build that. Everything else is secondary.

3. **Resolve the native BTC / WBTC contradiction.** The app shows WBTC; the marketing says no wrapping. This needs to be clear in the UI — ideally with a native BTC token displayed distinctly from WBTC.

4. **Publish borrow rates prominently.** Even indicative ranges. "Fixed rates from X% APR" is a marketing claim. Back it up.

5. **Document liquidation mechanics in plain language** — not legal copy, not a whitepaper. A clear explanation of what happens, when, and what Sam can do about it. Include notification options.

6. **Put the team on the site.** Anthony Merriman's Talos background is a credibility asset. Use it.

7. **Desktop dashboard is not optional for this segment.** The mobile app is a companion tool. The primary interface for sophisticated position management is desktop.

8. **Consider a separate high-value holder onboarding path.** The waitlist model treats all users the same. A private beta or concierge onboarding for institutional/high-value users would let Modulo get real capital on-platform with managed risk while still being early stage.

---

*Sam would give Modulo a second look in 6 months — if they've filled the audit gap, published rate mechanics, and shown that "native BTC" is real and running. The idea is right. The proof is what's missing.*

---

**Findings authored by:** Peggy (BakedUX), Sam persona
**Next phase:** Product team reads these findings and defines build priorities
**Output destination:** `Discovery/persona-findings-sam.md`

## See also

- [[Platform/Modulo/STATUS]] — Modulo build status
- [[Personas/Sam-High-Value-Holder]] — Sam persona definition
- [[Discovery/README]] — Fully Baked discovery phase
