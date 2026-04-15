# Modulo Product Brief
**Version:** 1.0
**Date:** 2026-04-04
**Authors:** Peggy (BakedUX Product Team — PM, Senior Designer, Frontend Developer roles)
**Input sources:** persona-findings-jordan.md, persona-findings-alex.md, persona-findings-sam.md, modulo-kickoff.md

---

## Preamble

This brief is a set of decisions, not a set of opinions. It is written to drive the design system extraction and component build phases directly. Where research is referenced by persona name, that reference traces back to a specific finding in the discovery files. Where a decision is made, the reasoning is stated. Where a decision requires the Modulo team's input, it is flagged explicitly in Section 5.

The three personas — Jordan (crypto-curious holder), Alex (active DeFi intermediate), Sam (high-value holder) — represent the full spectrum of Modulo's stated target market. Their divergent needs create a useful forcing function: what must be true for all three is the product core; what is specific to one is a feature layer.

---

## 1. Cross-Persona Themes

These issues were raised independently by two or more personas. They represent the highest-priority problems in the product because they cut across the entire user base — not a single segment.

### 1.1 The WBTC Contradiction

**Raised by:** Jordan (P0 priority), Alex (critical), Sam (critical, noted in all screens)

Every persona independently flagged the same problem: the mobile app shows "Wrapped Bitcoin" (WBTC) in portfolio views, token selectors, and the browse screen, while the marketing site explicitly promises "No wrapping or bridging" as a core feature. This is not a design inconsistency — it is a trust-destroying contradiction between a product's central claim and its own interface.

**Impact:**
- Jordan perceives it as a lie and would close the app
- Alex treats it as evidence the "no wrapping" claim is unbuilt and aspirational
- Sam flags it as a fundamental product integrity issue that prevents capital commitment

**This is also flagged as a product decision in Section 5.** Until the product team resolves the underlying architecture question, design cannot fix this surface.

### 1.2 No Rate or Yield Numbers Anywhere

**Raised by:** Jordan (P0 — "show me a number"), Alex ("rate transparency" in must-haves), Sam (0/5 rating on rate transparency)

The product's value proposition is financial return. None of the three personas can evaluate whether Modulo is worth their time without seeing an indicative yield or borrow rate. "Earn native yield" (from the website) is not a number. It is a category description. A financial product that declines to show its rate is, from every persona's perspective, a product hiding something.

**What each persona needs:**
- Jordan: approximate APY on BTC or ETH, even a range, even estimated
- Alex: current borrow rate, yield rate by protocol, fee structure including Modulo's margin
- Sam: borrow rate history, rate-setting mechanism, whether "fixed" is contractually fixed or governance-adjustable

### 1.3 No Onboarding or Empty State

**Raised by:** Jordan (P1 — "where do I start?"), Alex (implied by health factor gap), Sam (noted as mismatch for high-value onboarding)

Every screen in the mobile app assumes the user already has assets inside Modulo. There is no empty state, no first-session flow, no "connect your exchange" prompt on the portfolio screen. A new user arriving at the portfolio screen sees a filled demo portfolio that is not theirs. They have no instruction for what to do next.

This is not a minor UX gap. Without an onboarding path, Modulo cannot convert waitlist signups to active users regardless of how polished the rest of the product is.

### 1.4 No Team Visibility

**Raised by:** Jordan (P2 — "no human face on the company"), Sam (hard stop criterion)

The current site lists no team members. Anthony Merriman's Talos background is a credibility asset that the site does not use. Jordan uses human faces to assess whether a product is a scam. Sam treats anonymous teams as a hard stop criterion before deploying capital.

The founder's name and relevant track record should be on the site. This costs nothing to add and materially improves trust signals for all three personas.

### 1.5 Swap Screen Missing Pre-Confirmation Information

**Raised by:** Jordan (P1 — no fee disclosure), Alex ("missing all the pre-confirmation information that makes swapping trustworthy"), Sam (rate and price impact)

The swap interface shows a keypad and percentage shortcuts but no exchange rate, no fee, no slippage tolerance, no route, and no minimum received amount before the user commits. All three personas require this information before executing any swap. For Alex and Sam, the absence is a blocker. For Jordan, it is a trust issue.

### 1.6 Select Recipient Screen — Unlabelled Hex Addresses

**Raised by:** Jordan (P1 — "anxiety-inducing"), Sam (explicitly flagged as dangerous for large transactions — "substring attacks are real")

Recent contacts shown as truncated hex addresses (0x4248...0f33) without names, labels, or contextual information are a UX and safety problem. Jordan finds them confusing and anxiety-inducing. Sam identifies them as a genuine attack surface for high-value transactions. Both agree the username path — the product's differentiator — should be the primary affordance, not buried in a generic text input.

---

## 2. Persona-Specific Priorities

These issues were raised by a single persona but are critical enough to warrant inclusion in the product brief.

### 2.1 Jordan: The Coinbase Question (P0)

Jordan's BTC and ETH are on Coinbase. The site never answers whether "any wallet" includes centralised exchange accounts. One sentence would resolve this — either confirming that exchange connections are supported or being honest that self-custody is required first. The Receive screen's exchange shortcuts (Coinbase, Binance, Kraken) suggest it is supported; the marketing site never says so.

**Action required:** One explicit sentence in the hero or problem section addressing exchange-held assets. Confirm or deny before onboarding flows are designed.

### 2.2 Jordan: "Non-Custodial" Language Without Context

The phrase "non-custodial" appears twice on the site without explanation. For Jordan, non-custodial implies she needs a self-custody wallet — which is the exact step she hasn't taken and doesn't know how to take. If Modulo's passkey model means users do NOT need a prior self-custody setup, that needs to be stated directly and prominently.

### 2.3 Alex: No Active Position Management Screen

Alex explicitly requires a position management view showing open borrows, collateral breakdown, health factor, and liquidation price. This is standard DeFi infrastructure. Its complete absence from the 6 mobile screens means the product cannot serve an active borrower — which is the core product use case. This is not a nice-to-have for Alex; it is the primary screen he needs to use the product at all.

### 2.4 Alex: No Audit Information

Before committing any real capital, Alex requires publicly available audit reports from a named firm. This is a blocker condition, not a preference. Without it, Alex is willing to try the testnet but will not move meaningful funds.

### 2.5 Alex: Browse Screen Must Show Rates, Not Just Prices

The current Browse screen shows market prices and percentage changes. Alex needs it to show protocol rates (APY by protocol per asset), his current position in each protocol, available liquidity, and risk indicators. As currently designed, the screen is a market data view (comparable to CoinGecko) rather than a DeFi opportunity browser. The Uniswap/Lido/Aave tabs suggest the intent is rate comparison — the execution needs to match that intent.

### 2.6 Sam: Desktop Dashboard is Non-Optional for High-Value Holders

Sam explicitly states the mobile app is a companion tool, not a primary interface, for positions at the $800k+ scale. The Kickoff notes that the Figma file includes a desktop dashboard. For Sam's segment, that desktop view is the primary product. It must include: a position health panel (collateral value, borrowed value, LTV ratio, health factor with visual indicator), active positions list, rate transparency, liquidation mechanics, oracle price feeds, and exportable transaction history.

This brief acknowledges that a full desktop build is out of scope for phase one. However, the design system must accommodate it, and at minimum a Position Health screen must exist on mobile for monitoring.

### 2.7 Sam: Legal and Regulatory Clarity

Sam requires knowledge of Modulo's jurisdiction, user eligibility (particularly US persons), and an honest statement of the "code is law" risk posture. This is a product/legal decision, not a design decision. It is flagged in Section 5.

---

## 3. Build Priorities

These are ordered. The order is non-negotiable for phase one. Items 1-4 represent the minimum viable product for any persona. Items 5-8 are required for the product to serve its stated use case. Items beyond that are next sprint.

---

### Priority 1: Onboarding Flow (Screens 1–4)

**What it is:** A first-session experience that starts from zero assets, asks the user where they hold crypto, connects to their exchange or wallet, reads their holdings, and presents a first actionable step (deposit to start earning). This is Jordan's ideal flow described in detail in persona-findings-jordan.md Section 8.

**Personas served:** Jordan (primary), Alex (secondary — testnet entry), Sam (concierge/managed path)

**Why it matters:** Without this, no persona can start. The entire product is currently a filled demo state. There is no conversion path from waitlist to active user.

**Acceptance criteria:**
- Empty portfolio state exists and is distinct from the filled portfolio state
- User is prompted on first open: "Where is your crypto?" with options for Coinbase, Binance, Kraken, and "I have a wallet"
- Exchange connection flow does not require the user to understand wallet addresses
- After connection, user sees their actual balance (or a simulated balance in testnet)
- User is presented with one clear next action: "Start earning" with an illustrative rate
- Passkey creation is part of this flow and is framed as the primary authentication method
- The phrase "no seed phrases" appears in this flow explicitly

---

### Priority 2: Portfolio Screen with Position Health

**What it is:** A revised portfolio home screen that displays total portfolio value, per-asset breakdown, AND (when the user has active positions) a position health panel showing LTV ratio, health factor with colour coding (green/amber/red), and distance-to-liquidation in plain language. For users without active positions, the health panel is replaced by a yield summary showing what the portfolio is currently earning.

**Personas served:** Jordan (earnings visibility), Alex (health factor — critical blocker), Sam (LTV and liquidation distance — primary monitoring need)

**Why it matters:** The current portfolio screen shows a balance and a sparkline. It tells no persona what they need to know. Alex cannot manage borrows without a health factor. Sam cannot monitor a large position without LTV. Jordan cannot see whether her money is working without an earnings display.

**Acceptance criteria:**
- Total portfolio value displayed prominently
- Per-asset rows show: asset name, amount, current USD value, 24h change
- "Earning" summary visible (total yield accrued, current APY, updatable in near real-time)
- When active borrow exists: health factor displayed as coloured indicator + numeric ratio
- When active borrow exists: LTV ratio and liquidation threshold both displayed
- Quick actions: Swap, Receive, Borrow, Earn (not "Save" — see Section 5 note on labelling)
- Chain breakdown accessible (tap through on asset row)

---

### Priority 3: Receive Screen — Exchange-First Flow

**What it is:** A revised Receive screen where the exchange connection options (Coinbase, Binance, Kraken) are the primary, above-the-fold affordance. The QR code / wallet address is secondary and accessible via an "Advanced" or "I have a wallet" toggle. The screen includes plain-language instruction copy explaining exactly what the user is about to do.

**Personas served:** Jordan (primary — Coinbase flow must be first), Alex (also needs this for onboarding), Sam (less critical but should be clean)

**Why it matters:** Jordan's primary path into the product is through a centralised exchange. Making her navigate past a QR code and a raw wallet address to find the Coinbase button is friction that will cause drop-off. The exchange shortcut is the right first-class path for the majority of new users.

**Acceptance criteria:**
- Exchange logos (Coinbase, Binance, Kraken) appear above the fold, labelled clearly
- QR code and wallet address visible only after scrolling or tapping "Use wallet address instead"
- Instruction copy on screen: one sentence explaining what will happen when the user taps an exchange ("We'll generate a receive address for your BTC. Copy it into Coinbase to transfer.")
- Wrong-network send risk is addressed: "Make sure you're sending [BTC] on the [Bitcoin] network" — the selected chain is named in the instruction
- Chain selector (Ethereum / Bitcoin / Solana / etc.) is visible and clearly labelled before user acts

---

### Priority 4: Swap Screen — Rate and Fee Transparency

**What it is:** The swap screen, redesigned so that once both tokens and an amount are entered, the user sees exchange rate, price impact, Modulo fee, estimated minimum received, and route (which protocol is executing the swap) before they confirm. These fields are not optional sub-screens — they appear in the main flow above the Confirm button.

**Personas served:** Jordan (fee disclosure — P1), Alex (route and slippage — critical), Sam (price impact for large orders)

**Why it matters:** All three personas independently flagged this as a trust issue. Executing a financial transaction without seeing its terms first is not acceptable to any of them. The current design shows a keypad with no rate information.

**Acceptance criteria:**
- Rate display: "1 ETH = X USDC" appears once both tokens are selected
- Price impact displayed as percentage; highlighted amber if >1%, red if >3%
- Fee displayed: "Modulo fee: X%" or "$Y"
- Minimum received displayed: "You receive at least: Z USDC"
- Route displayed: "via Uniswap v3" or equivalent
- Slippage tolerance: default displayed, adjustable via settings icon
- Confirm button is disabled until both tokens and amount are entered
- All of the above visible on the main swap screen, not behind a details toggle

---

### Priority 5: Position Management Screen

**What it is:** A dedicated screen for active DeFi positions — open borrows, collateral deposits, active earn positions. Each entry shows asset, amount, current value, rate, origination date, and (for borrows) distance to liquidation. This screen is accessible from the Portfolio screen via a tab or a persistent "Positions" entry in the navigation.

**Personas served:** Alex (critical blocker — cannot manage borrows without this), Sam (primary mobile use case for monitoring)

**Why it matters:** The core product use case — borrowing against a cross-chain portfolio — produces ongoing positions that need to be monitored and managed. The current 6-screen set contains no position management screen. Without it, the product cannot serve its primary stated function.

**Acceptance criteria:**
- Lists all active borrows: asset borrowed, amount, borrow rate, origination date, current accrued interest
- Lists all active collateral positions: asset, amount, current USD value, contribution to total LTV
- Health factor displayed prominently with colour-coded status
- Liquidation price visible per position (the price at which collateral would be liquidated)
- Notification settings accessible from this screen (push alerts at configurable LTV thresholds)
- "Add collateral" and "Repay" actions accessible directly from each borrow row
- Mobile screen; desktop version deferred to next sprint but data model must support it

---

### Priority 6: Browse / Discover Screen — Rate Comparison, Not Market Data

**What it is:** The Browse screen, repurposed from a market price view to a DeFi opportunity browser. For each major asset, the screen shows the best available APY across supported protocols (Aave, Compound, Lido, etc.), current TVL in each protocol, and the user's current position in each. The protocol tabs (Uniswap/Lido/Aave) in the existing design are the right navigation pattern — they need to surface rate data, not price charts.

**Personas served:** Alex (high — protocol rate comparison is explicitly listed as a "should have"), Sam (lower priority for monitoring but useful for allocation decisions)

**Why it matters:** Alex explicitly states this is the screen that would give Modulo genuine utility over his existing stack (DeBank + direct protocol access). As currently designed, it is a market data view that adds no value over any existing tool. Reworking it to show rates and yields is what makes the "one app" promise credible.

**Acceptance criteria:**
- Protocol tabs (Earn tab: Aave, Lido, Compound, etc.) filter the asset list by protocol
- For each asset-protocol combination: current APY, TVL, and user's current position (or zero)
- Default sort: highest APY for the selected protocol
- Search bar finds assets by name or contract address
- User's active positions highlighted with a distinct indicator
- Price data is secondary (available on tap-through to asset detail), not the primary display

---

### Priority 7: Select Recipient Screen — Username-First, Named Contacts

**What it is:** The recipient selection screen, redesigned so the username input field (the product differentiator) is the primary affordance. Recent contacts are displayed with human-readable names, not truncated hex addresses. Users can label any address. Full address is accessible on tap but not displayed by default.

**Personas served:** Jordan (must resolve hex anxiety — P1), Sam (safety-critical for large transactions)

**Why it matters:** The username feature is the product's most distinct UX claim (Telegram/WhatsApp/Discord handles). It is currently buried in a generic text field. Meanwhile, the recent contacts list shows raw hex addresses — which are anxiety-inducing for Jordan and a security risk for Sam.

**Acceptance criteria:**
- Input field placeholder: "Enter username, ENS, or address" with username listed first
- Recent contacts shown with: avatar/icon, display name (user-provided or ENS), and last transaction date
- Hex addresses NOT displayed by default — accessible via "Show address" tap
- Full address (not truncated) revealed when tapped, with "Copy" affordance
- "Save contact" option available from any resolved address
- Username resolution shows a confirmation state before the user can proceed ("Sending to: @username on Discord — is this right?")
- Verified badge for ENS/known addresses

---

### Priority 8: Yield/Earnings Display (Surface-Level)

**What it is:** The display of a rate — an actual number — at every point in the product where it is relevant. Specifically: on the portfolio home screen (total APY earned on deposited assets), on the onboarding screen (illustrative rate for the user's asset type), and on the earn/deposit confirmation screen.

**Personas served:** Jordan (P0 — the most critical gap), Alex (should have), Sam (table-stakes)

**Why it matters:** Jordan's P0 finding is "show me a number." She has no basis for a decision without it. This is the single highest-impact change for the crypto-curious segment, and it costs nothing compared to the engineering lift of the earlier priorities. The number does not have to be live-fetched from a protocol on day one — an illustrative range from a supported protocol is sufficient to unblock the trust gap.

**Acceptance criteria:**
- Portfolio screen shows "Earning X% APY" when user has deposited assets
- Onboarding screen shows "BTC holders in our beta earned approximately X–Y% annually" (clearly labelled as illustrative)
- Earn/deposit flow shows the expected rate before confirmation
- Borrow flow shows the borrow rate before confirmation
- All rates labelled with their type: "estimated," "variable," "fixed," or "indicative"

---

## 4. Screen Inventory

This is the complete set of screens the mobile app requires for the product to function for all three personas at launch. Screens are listed in dependency order.

---

### Screen A: Onboarding — Welcome
**Purpose:** First session entry point. Establishes trust, sets expectations, routes the user to their connection method.
**Primary persona:** Jordan
**Key components:** Logo/wordmark, headline, sub-headline, exchange selection cards (Coinbase, Binance, Kraken, "I have a wallet"), passkey creation prompt, "no seed phrases" callout
**Critical requirements:**
- This screen replaces the empty portfolio state — it must appear on first open before any assets are connected
- Must include the phrase "no seed phrases required" or equivalent
- Exchange selection must be visual (logos), not a text list
- No wallet address shown at any point on this screen

---

### Screen B: Onboarding — Connect (Exchange Flow)
**Purpose:** Walks the user through connecting their exchange account. No technical knowledge required.
**Primary persona:** Jordan
**Key components:** Exchange logo (full-size), step-by-step instruction (3 steps maximum), "what we can see / what we can't touch" trust statement, a single action button
**Critical requirements:**
- Must be a separate screen per exchange (Coinbase, Binance, Kraken) or a dynamic screen that fills in exchange-specific detail
- Trust statement must appear: "We read your balance. We don't control your assets."
- No wallet address shown; no gas token required

---

### Screen C: Onboarding — Your Portfolio (First Look)
**Purpose:** Shows the user their holdings (real or illustrative) and presents the first actionable opportunity.
**Primary persona:** Jordan
**Key components:** "Your portfolio" headline, asset list with real balances, illustrative earnings projection ("At current rates, you could earn approximately X%"), single CTA: "Start earning"
**Critical requirements:**
- Earnings projection must be present and clearly labelled as illustrative
- Single CTA — do not present Swap, Borrow, or any other action on this screen
- Asset names must be plain English: "Bitcoin," not "WBTC" or "Wrapped Bitcoin"

---

### Screen D: Portfolio (Active State)
**Purpose:** Primary home screen for returning users with connected assets.
**Primary persona:** All three
**Key components:** Total value display, performance graph (with timeframe selector), quick-action bar, asset list, earnings summary panel, position health panel (conditional — visible only when active borrows exist)
**Critical requirements:**
- Asset names: "Bitcoin" not "WBTC" (pending product decision — see Section 5)
- Quick-action labels: Swap, Receive, Earn, Borrow (not "Save")
- Earnings summary: total APY, total earned to date (in USD)
- Position health: LTV ratio, health factor with colour coding, liquidation threshold — visible above the asset list when active borrow exists
- 24h change and % change per asset
- Chain breakdown on tap-through (Alex and Sam requirement)

---

### Screen E: Receive
**Purpose:** Allow the user to receive assets from an exchange or another user.
**Primary persona:** Jordan (exchange flow), Alex (wallet-to-wallet)
**Key components:** Exchange quick-access cards (above the fold), instruction copy, chain selector, QR code and address (secondary, below fold or behind toggle), username display
**Critical requirements:**
- Exchange cards (Coinbase, Binance, Kraken) must appear before QR code
- Active chain displayed by name: "Receiving Bitcoin on Bitcoin network" — not just a chip
- QR code visible without additional tap for users who need it, but not the dominant element
- Wrong-network warning logic: if user selects Ethereum but is receiving BTC, display a caution state

---

### Screen F: Send / Select Recipient
**Purpose:** Initiate an outgoing transfer to a user or address.
**Primary persona:** Jordan (username flow), Alex (address/ENS), Sam (verified address with safety checks)
**Key components:** Username/ENS/address search field, recent contacts list (name-first, not address-first), contact detail view with full address on tap, save-contact affordance
**Critical requirements:**
- Recent contacts must show display names, not hex addresses, by default
- Full address (non-truncated) accessible on tap with copy button
- Username resolution confirmation state required before user can proceed
- "Verified" badge only for ENS-verified or platform-verified addresses

---

### Screen G: Swap
**Purpose:** Exchange one asset for another.
**Primary persona:** Alex (primary), Jordan (secondary), Sam (tertiary)
**Key components:** Source token selector, amount input (keypad + percentage shortcuts), destination token selector, rate display panel (exchange rate, price impact, fee, minimum received, route), slippage settings, Confirm button
**Critical requirements:**
- Rate display panel is not a details screen — it appears inline between the inputs and the Confirm button
- Price impact displayed prominently; amber >1%, red >3%
- Confirm button disabled until both tokens selected and amount entered
- Slippage tolerance adjustable via accessible settings (not buried)
- Route displayed: "via [Protocol]"

---

### Screen H: Select Token
**Purpose:** Token selection for swaps or earn positions.
**Primary persona:** All three
**Key components:** Search field (name or contract address), token list with balance and USD value, chain filter
**Critical requirements:**
- Token list must show USD value alongside quantity balance
- "Bitcoin" must not appear as "WBTC" if the product's claim is native asset support (pending Section 5 decision)
- Chain filter available (Alex and Sam requirement)
- Custom token import by contract address (Alex requirement)

---

### Screen I: Earn / Deposit
**Purpose:** Allow user to deposit assets into a yield-generating position.
**Primary persona:** Jordan (primary — this is her entire use case), Alex (secondary)
**Key components:** Asset selector, amount input, rate display (current APY, rate type, protocol), estimated earnings projection (annualised), deposit confirmation, terms summary
**Critical requirements:**
- Current APY must be displayed before confirmation
- Rate type labelled: "fixed," "variable," or "estimated"
- Lock-up period (if any) displayed prominently — Jordan explicitly asked this question
- "You can withdraw at any time" or equivalent must appear if there is no lock-up
- Confirmation screen shows: you are depositing X, at Y%, you will earn approximately Z per year

---

### Screen J: Borrow
**Purpose:** Allow the user to borrow against their deposited collateral.
**Primary persona:** Alex (primary), Sam (primary)
**Key components:** Collateral summary (total deposited, current LTV), borrow amount input, asset selector for borrowed asset, borrow rate display, post-borrow LTV projection, liquidation threshold display, Confirm button
**Critical requirements:**
- Borrow rate displayed before confirmation: fixed or variable, current rate in %
- Post-borrow LTV calculated and displayed as user enters amount
- Liquidation threshold shown: "Your position will be liquidated if your LTV reaches X%"
- Health factor shown post-borrow: "After this borrow, your health factor will be Y"
- LTV slider or visual indicator showing user's position relative to liquidation
- "What happens at liquidation?" accessible as a tap-through from this screen

---

### Screen K: Positions
**Purpose:** Monitor and manage all active DeFi positions.
**Primary persona:** Alex (critical), Sam (primary mobile monitoring screen)
**Key components:** Health factor banner (top), active borrows list, active collateral list, active earn positions list, notification settings access, Add Collateral / Repay actions inline
**Critical requirements:**
- Health factor displayed at the top of the screen with colour coding
- Each borrow row: asset, amount, rate, origination date, accrued interest, action buttons
- Each collateral row: asset, amount, current USD value, % contribution to LTV
- Distance to liquidation in plain language: "Your position is X% from liquidation"
- Liquidation price per collateral asset: "BTC liquidates at $X"
- Notification threshold settings accessible from this screen

---

### Screen L: Browse / Opportunities
**Purpose:** Discover and compare DeFi earning opportunities across supported protocols.
**Primary persona:** Alex (high priority), Sam (reference use)
**Key components:** Protocol tabs (All / Earn / Aave / Lido / Compound / etc.), asset list with APY per protocol, TVL indicator, user's current position in each, filter and sort controls
**Critical requirements:**
- Primary data shown: APY (not price)
- Protocol filter tabs visible above the asset list
- User's active positions highlighted in the list
- TVL or liquidity depth shown as secondary indicator
- Price available on tap-through to asset detail, not primary display
- Market prices (current Browse function) retained as a secondary tab, not removed

---

## 5. Product Decisions Required from Modulo

These are not design decisions. They are product and strategy decisions that only the Modulo team can make, and design cannot proceed on the affected surfaces until they are resolved. Ant should take these back to the Modulo team before the design system extraction phase.

---

### Decision 5.1: Native BTC vs. WBTC — What Is Actually Built?

**The issue:** The marketing site states "No wrapping or bridging" as a feature. The mobile app designs (across all 6 screens) show "Wrapped Bitcoin" (WBTC) as the Bitcoin representation. Every persona flagged this independently as a critical contradiction.

**The question Modulo must answer:** Is native BTC collateral (without wrapping) currently built and live, planned for a specific date, or aspirational? There are three possible states:
1. Native BTC is live. WBTC appears in the designs because the design work used placeholder data. Design fix: replace "Wrapped Bitcoin" with "Bitcoin" throughout.
2. Native BTC is in development. WBTC is currently used as the Bitcoin representation. Marketing fix: update "no wrapping" to "no wrapping required" or be explicit about the roadmap.
3. WBTC is the Bitcoin representation and the "no wrapping" claim refers to the user not having to manually wrap. If so, the UI should present "Bitcoin (via WBTC)" or similar — users should not be surprised.

None of these options is a blocker for design, but the answer determines what appears in every screen that mentions Bitcoin. Design cannot proceed with the token naming until this is resolved.

**Owner:** Anthony Merriman / Modulo team
**Unblocks:** Screens D, E, G, H, I, J, L — all screens that display asset names

---

### Decision 5.2: Exchange Connection — Is It Actually Supported at Launch?

**The issue:** The Receive screen shows Coinbase, Binance, and Kraken as exchange quick-links. Jordan's entire value proposition depends on being able to connect her Coinbase account directly, without needing to copy wallet addresses manually. But the marketing site never confirms this is a real feature.

**The question:** Does the product allow direct connection to exchange accounts (OAuth or API key), or do the exchange logos simply link to a withdrawal guide? If the latter, this is a serious mismatch between the UX affordance and the actual functionality.

**Owner:** Modulo engineering
**Unblocks:** Screens B, E (Receive) — the exchange flow cannot be designed without knowing the real mechanism

---

### Decision 5.3: Labelling — "Save," "Earn," or "Lend"?

**The issue:** Alex notes that the quick-action button labelled "Save" is an unusual label in a DeFi context — it implies a savings account rather than a yield-generating deposit. "Earn" is Alex's preferred term. "Lend" is technically more accurate.

**The question:** What is Modulo's intended framing for the deposit-to-yield-pool action? This is a brand and product positioning decision, not just a copy decision. "Save" is more accessible for Jordan; "Earn" is more accurate for Alex and Sam; "Lend" is technically precise but less emotionally compelling.

**Recommendation from the product team:** Use "Earn" as the primary label. It is accurate enough for all personas, aspirational for Jordan, and precise enough for Alex. But this must be confirmed by the Modulo team as consistent with how they want to frame the product.

**Owner:** Modulo brand / product
**Unblocks:** All screens using action labels

---

### Decision 5.4: Fixed-Rate Borrowing — Is It Contractually Fixed?

**The issue:** Sam explicitly asks whether "fixed rate" means fixed for the duration of the loan or subject to governance repricing. Alex lists this as a "should have." This is a meaningful product distinction that affects how the Borrow screen is designed.

**The question:** Is the fixed rate truly fixed at origination for the full loan term, or is it fixed at a point in time but subject to change? If the latter, what are the conditions? This affects every rate disclosure in the product.

**Owner:** Modulo protocol team
**Unblocks:** Screen J (Borrow), Screen K (Positions) — rate labels and disclaimers

---

### Decision 5.5: Audit Status and Timeline

**The issue:** Both Alex and Sam list smart contract audits as a non-negotiable condition for depositing real money. The product currently has no audit information publicly available. Alex will try a testnet without audits; Sam will not deploy capital.

**The question:** What is the current audit status? Has any audit been commissioned? If so, from which firm and what is the expected completion date? If not, this needs to be on the roadmap before any real-money launch.

**This is a trust-table-stakes issue:** The product can be beautifully designed and still fail to convert Alex or Sam without published audits. The design system should include a trust signals component (audit badge, named firm, date) that will display on relevant screens once the audit exists.

**Owner:** Modulo legal / security
**Unblocks:** Trust signal components in the design system

---

### Decision 5.6: Legal and Regulatory Posture for US Persons

**The issue:** Sam requires clarity on whether US persons can use the protocol and what jurisdiction governs. This is particularly important given that Modulo Finance LLC is a US entity (from the site footer) operating a non-custodial DeFi protocol — a legal category that is actively being litigated.

**The question:** Can US persons participate? Are any jurisdictions excluded? What is the regulatory strategy?

This affects whether a US-person eligibility gate needs to be in the onboarding flow, which in turn affects Screen A (Onboarding) design.

**Owner:** Modulo legal
**Unblocks:** Onboarding flow gating logic

---

## 6. Design System Requirements

This section defines what the design system must support. The Design System agent should use this as its specification input alongside the Figma file.

### 6.1 Tokens

**Colour system:**
- Background base: very dark (near-black; currently appears ~#0f0f14 in designs)
- Surface elevated: slightly lighter dark for cards and modals
- Accent primary: purple (#6b5fff confirmed in kickoff)
- Accent secondary: for protocol badges, chain labels — a distinct purple variant or complementary tone
- Semantic: success green, warning amber, danger red — required for health factor indicator (green/amber/red is a cross-persona requirement)
- Text primary: near-white
- Text secondary: muted grey for labels, metadata
- Border: subtle, low-contrast for separators

**Typography scale:**
- Display: total portfolio value, headline numbers — largest, heaviest weight
- Title: screen headers ("Portfolio," "Swap," "Receive")
- Label: token names, action labels
- Body: instruction copy, descriptions
- Caption: rates, timestamps, secondary metadata
- Numeric: a numerically-spaced font variant for financial figures (prevents layout shift as numbers update)

**Spacing:**
- 4pt base grid minimum
- Touch targets: 44pt minimum (accessibility baseline)
- Card padding, list item height, modal handle — all need tokens

**Elevation:**
- Surface 0: base background
- Surface 1: card / list item
- Surface 2: modal sheet / bottom drawer
- Surface 3: tooltip / overlay

**Status tokens:**
- Health good: green token
- Health warning: amber token
- Health danger: red token
- Price up: green (for 24h change)
- Price down: red (for 24h change)

---

### 6.2 Components

**Navigation:**
- Tab bar (bottom navigation): Portfolio, Browse, Positions, Profile — 4 tabs
- Screen header with back navigation

**Data display:**
- Portfolio value display (large number, currency, percentage change)
- Asset row (icon, name, balance, USD value, 24h change)
- Protocol row (icon, name, APY, TVL, user position badge)
- Position row (asset, amount, rate, health indicator)
- Health factor indicator (numeric + colour band + label)
- Sparkline chart (for Portfolio screen and Browse featured assets)
- Full chart with timeframe selector (for asset detail)
- Rate display (APY label, rate value, rate type badge: Fixed / Variable / Estimated)
- LTV gauge (visual indicator showing LTV position between 0% and liquidation threshold)

**Actions:**
- Quick-action button (icon + label, 4-button row: Swap / Receive / Earn / Borrow)
- Primary button (full-width, solid accent fill)
- Secondary button (full-width, outlined)
- Destructive button (for Repay, Liquidate)
- Amount input (keypad + percentage shortcuts: 25% / 50% / 75% / Max)
- Token selector (icon + name + balance, opens Sheet H)
- Percentage shortcut row (25/50/75/Max)

**Selection:**
- Exchange card (logo + name + "Connect" label — large tap target, above the fold on Receive screen)
- Token list item (icon + name + balance + USD value)
- Recipient list item (avatar + display name + last transaction date — NO default hex display)
- Chain selector chip (chain name, icon, selected state)
- Protocol tab (filter tab bar pattern)

**Trust signals:**
- Verified badge (for ENS-resolved or platform-verified addresses and accounts)
- Audit badge component (firm name + date + report link — placeholder until audit exists)
- Trust statement block ("We read your balance. We don't control your assets.")

**Feedback and information:**
- Instruction copy block (plain-language explanation that appears on Receive, Borrow, and Earn screens)
- Warning banner (wrong-network sends, high price impact, health factor at risk)
- Confirmation sheet (summarises the action before execution: amount, rate, fee, outcome)
- Empty state (for portfolio with no assets, positions with no borrows, contacts with no history)
- Onboarding step indicator (progress through Screens A–C)
- Rate disclaimer label ("Estimated based on current protocol rates. Subject to change.")

**Sheets and overlays:**
- Bottom sheet / modal (for token selection, recipient selection, confirmation)
- Tooltip (for jargon terms: tapping "LTV" shows a one-sentence explanation)

---

### 6.3 Patterns

**Jargon resolution pattern:** Any technical term that appears in the product (LTV, health factor, oracle, non-custodial, fixed rate) must be tappable and resolve to a one-sentence plain-language explanation. This pattern is a cross-persona requirement — Jordan needs it for comprehension, Alex and Sam need it for quick verification.

**Confirmation gate pattern:** Any action that moves real assets (Swap, Borrow, Earn/Deposit, Send) must pass through a confirmation sheet that summarises all terms (amount, rate, fee, what you get, what you risk) before the primary action button is enabled. This is not optional — it is a trust requirement across all personas.

**Empty-to-filled state pattern:** Every screen that displays user data (Portfolio, Positions, Contacts) must have a defined empty state with instruction copy directing the user to their next action. No screen should appear as a blank list.

**Rate display pattern:** Any screen that shows a yield or borrow rate must also show the rate type label (Fixed / Variable / Estimated) and a tap-through to a brief explanation of what that rate type means. Rates are never shown without context.

**Health factor pattern:** Health factor is always shown as three things simultaneously: a numeric ratio, a colour state (green/amber/red), and a plain-language label ("Healthy" / "Caution" / "At risk"). Never show the number alone.

---

## 7. What NOT to Build Now

These items came up in research but should be explicitly deferred. Including them in scope now would delay delivery of the core product without material benefit to the launch personas.

**Desktop dashboard.** Sam's primary interface is desktop. A full position management desktop dashboard is the right product for Sam. It is not phase-one scope. The design system should be built with desktop in mind (using responsive tokens and a flexible grid), but the desktop build itself is deferred. Delivery: phase two, after the mobile foundation is stable.

**Smart automation / conditional orders.** Alex lists "borrow on dips, deploy on moves" as a nice-to-have. Jordan identifies it as trading-persona territory that alienates her. Sam does not prioritise it. This is a power-user feature for a later sprint when the core borrow/earn flows are proven.

**Tokenized RWA collateral.** Mentioned in the product and of interest to Sam. Not required for any persona's onboarding journey. Deferred to phase two after native crypto collateral is working.

**CSV export / tax reporting.** Alex lists this as a nice-to-have; Sam implicitly requires it for a sophisticated position. Important but not launch-blocking. Deferred to phase two.

**Hardware wallet integration (Ledger).** Alex uses a Ledger for significant holdings. This is a trust and security feature that matters for Alex-level users. It is also a non-trivial integration. Deferred to phase two.

**Price alerts.** Listed by Alex as a nice-to-have. Does not serve onboarding or core-use-case flows. Deferred.

**Multiple accounts / sub-accounts.** Alex lists this. Sam would benefit for portfolio separation. Adds significant product complexity. Deferred.

**Testnet / sandbox mode.** Alex explicitly requests this as a barrier-reduction tool. It is architecturally separate from the production product. It should be on the near-term roadmap as a conversion mechanism for Alex-tier users, but it is a platform feature, not a UI feature. Deferred and noted as a separate workstream.

**Full address book with labels and grouping.** The Select Recipient screen needs labelled contacts (Priority 7 above). A full address book with grouping, tags, and management UI is an extension. The label-and-save pattern is in scope; the full address book management screen is deferred.

**"Send any asset you don't own."** This feature, as described on the site, is ambiguous and raises trust concerns (Alex notes it "reads like a bug"). Until the Modulo team clarifies what this actually means (flash advance? cross-asset routing on send?), it should not be surfaced in the product UI. If it's cross-asset routing on send, it belongs inside the Send flow as a "Convert and send" option, not a separate feature. Hold.

---

## 8. Success Metrics

These metrics define what "working" looks like for each persona. They are framed as observable outcomes, not vanity metrics.

### Jordan

**Primary metric:** Activation rate — percentage of waitlist signups who complete the onboarding flow (Screens A–C) and deposit at least one asset.
**Target:** To be set by Modulo. Benchmark for similar products: 15–25% of signups reach first deposit.

**Secondary metrics:**
- Onboarding completion rate: percentage who reach Screen C after starting Screen A
- Drop-off point analysis: which step in onboarding causes abandonment (exchange connection vs passkey creation vs first deposit)
- "Start earning" tap rate: on Screen C, what percentage tap the primary CTA vs navigate elsewhere

**Qualitative signal:** Jordan saying "I understand what I'm earning and I trust that I can get my money back." If user interviews post-launch reveal continued confusion about yield or withdrawal, the onboarding content has failed regardless of completion rate.

---

### Alex

**Primary metric:** Position creation rate — percentage of connected users who open at least one borrow or earn position within 7 days of connecting assets.

**Secondary metrics:**
- Health factor screen engagement: how often Alex-type users visit the Positions screen per week (indicates active position management)
- Swap completion rate with rate panel visible: does the pre-confirmation rate display reduce or increase swap abandonment? (Lower abandonment = better)
- Browse screen APY data engagement: click-through from protocol tab to earn position creation (measures whether the rate comparison screen is driving yield allocation decisions)

**Qualitative signal:** Alex's stated condition: "If I can verify positions on-chain and see an audit, I'd move meaningful capital in." Publish audit, add Etherscan links to transaction receipts. Alex's first $10k deposit is the signal.

---

### Sam

**Primary metric:** Capital depth per user — median deposit value among users who qualify as high-value holders (self-reported or inferred from deposit size >$50k).

**Secondary metrics:**
- LTV monitoring frequency: how often Sam-type users check their position health from the Positions screen (daily monitoring = product is trusted for large position management)
- Notification engagement: do high-value users configure LTV threshold alerts? (Indicates they trust the alerting system to keep their position safe)
- Position health actions: when health factor reaches amber, what percentage of users add collateral vs let it deteriorate to red? (Higher proactive response = product's risk communication is working)

**Qualitative signal:** Sam's stated condition: "Audit reports, rate disclosure, liquidation documentation, team visibility, and a position management dashboard." These are binary — either present or not. The metric is: are all five present before soft launch? Sam will not convert otherwise.

---

### Cross-persona

**Trust signal uptake:** Percentage of new users who tap through to the jargon-resolution tooltips (LTV, health factor, fixed rate) — measures whether non-technical users are engaging with the explanatory content.

**WBTC confusion rate:** After the WBTC/BTC naming decision is implemented, measure support tickets or user feedback mentioning "wrapped bitcoin" or "wrapping" — should trend toward zero if the naming is clear.

**Swap abandonment at confirmation screen:** Compare abandonment rate between current designs (no pre-confirmation info) and post-redesign (with rate panel). Expected outcome: lower abandonment after redesign, because users who proceed past the rate panel are informed and committed.

**Waitlist-to-active conversion:** The end metric for the whole engagement. What percentage of waitlist emails become users who hold a real balance in the product? This number, measured at 30/60/90 days post-launch, is the answer to whether the product brief was correct.

---

## Appendix: Open Questions for Next Phase

These are unresolved questions that the Design System agent and Build agent should keep visible:

1. What is the exact colour value for the background and surface layers? The Figma file should be the source of truth — the Design System agent should extract exact values rather than approximate them from screenshots.
2. Is there an existing icon set in the Figma file or should one be selected? Token icons (BTC, ETH, SOL, USDC) will need network-standard visual treatment.
3. What is the font? The designs appear to use a geometric sans-serif. The Design System agent should confirm from Figma.
4. Does the passkey onboarding create a smart contract wallet, an MPC wallet, or a different key model? This affects the copy on Screens A and B — the explanation of "your keys, your control" differs per model.
5. Are there animation/motion design specs in the Figma? If not, a minimal motion system (transition timing, easing) should be defined in the design system to ensure the product feels cohesive.

---

*This brief is filed by Peggy (BakedUX) as the Product Team output for the Modulo engagement.*
*Next phase: Design System agent reads this brief and the Figma file to extract tokens, components, and patterns.*
*Blockers: Figma MCP access (Ant to resolve SSH/settings.json). Product decisions in Section 5 (Ant to take to Modulo team).*

## See also

- [[Platform/Modulo/STATUS]] — Modulo build status
- [[bakekit|BakeKit]] — design system Modulo is built on
- [[overview]] — Fully Baked methodology this brief follows
