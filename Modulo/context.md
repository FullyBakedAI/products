# Peggy — Context Log

## Current State (2026-04-04)

### Who is Modulo
- Cross-chain DeFi platform — "One vault, every chain"
- Founded by Anthony Merriman (Ant knows him from Talos, also an investor)
- Early stage, trying to get users and investment
- Product needs significant design work — been let down by devs multiple times
- Site is mostly interest-generation right now; waitlist model

### Ant's Role on This Engagement
- Giving them product direction and vision
- Using BakeKit/Fully Baked methodology to build a frontend framework for them
- Goal: replace expensive dev resources with methodology-driven pipeline
- All work feeds back into BakeKit methodology — no hard IP ringfencing

### The Pipeline Ant Wants to Build
Rough idea → working prototype → production-level code
Underpinned by agentic design systems

1. Design screens in Figma (using Figma Make currently)
2. Import into Pencil.dev (Figma → Pencil native import via desktop app)
3. Extract design system / tokens
4. Claude Code generates and iterates production frontend from there
5. Figma MCP is the preferred bridge (structured design data, not just screenshots)

### Outstanding Setup
- **Figma MCP**: Config ready to go, blocked by permissions. Token: `REDACTED`
  - Need to add to `~/.claude/settings.json` (as Frank user, no sudo)
  - Ant needs to edit manually or approve via admin access
- **SSH**: sshd not running on server. Need `ant` user to run:
  `sudo launchctl load -w /System/Library/LaunchDaemons/ssh.plist`
  Frank user has no sudo rights.

### settings.json target state
```json
{
  "permissions": {
    "allow": [
      "mcp__openclaw",
      "mcp__pencil",
      "mcp__figma"
    ]
  },
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "REDACTED"
      }
    },
    "openclaw": {
      "command": "openclaw",
      "args": [
        "mcp",
        "serve",
        "--token-file",
        "/Users/Frank/.openclaw/.gateway-token"
      ]
    }
  }
}
```

### Discovery Phase — Persona Testing (2026-04-04)
- Sam persona evaluation COMPLETE → `Discovery/persona-findings-sam.md`
- Alex persona evaluation COMPLETE → `Discovery/persona-findings-alex.md`
- Jordan persona evaluation COMPLETE → `Discovery/persona-findings-jordan.md`
- Artefacts reviewed: modulo.finance (live), 6 mobile app screenshots

#### Sam key findings (High-Value Holder):
  - Native BTC claim unverified — WBTC appears in app token lists, contradicts "no wrapping" marketing
  - Zero trust signals for high-value holders: no audits, no team page, no rates disclosed
  - Liquidation mechanics completely absent from public materials (hard stop for Sam)
  - Mobile app is portfolio/wallet/swap — missing position management dashboard entirely
  - Value prop directionally right; substantiation is the gap
  - Sam would waitlist. Would NOT commit capital at current state.

#### Alex key findings (DeFi Intermediate):
  - WBTC in token lists directly contradicts "no wrapping" core claim — critical product-level issue
  - No technical explanation of cross-chain mechanism; absence of architecture = absence of trust for DeFi-natives
  - Smart contract audit status absent from site — hard blocker for real capital
  - Browse screen (screen 6) should be the most powerful screen for Alex but currently shows token prices, not protocol rates/APY
  - Swap screen missing route info, slippage, price impact, minimum received
  - Portfolio screen missing health factor, liquidation price, cost basis, P&L
  - Username-based receiving and passkey login are genuine differentiators (positive)
  - Fixed-rate borrowing and conditional automation are promising but unexplained
  - Alex would join waitlist. Would NOT move real funds without audits and on-chain verifiability.

#### Jordan key findings (Crypto-Curious Holder):
  - WBTC labelling contradicts "no wrapping" promise — same critical issue, amplified for a non-technical user
  - No yield numbers anywhere on site — fatal for someone evaluating if it's worth acting on
  - "Non-custodial" language unexplained; Jordan holds on Coinbase and this implies she must already have solved self-custody
  - Problem section ("broken DeFi") is the strongest content on the site — resonates deeply
  - "Passkeys, not seed phrases" is her most important reassurance — buried, should be hero-level
  - Username-based receiving is the most delightful feature (discord/telegram over addresses)
  - App has no onboarding/empty state — assumes assets already inside Modulo
  - User typology on site (Traders, Stakers, Degens) excludes her; she doesn't see herself
  - Jordan would sign up for waitlist but is not excited — interest without trust
  - Ideal first flow: connect Coinbase → see balance + projected yield → one-tap to start earning

#### Themes common to all three personas:
  - WBTC contradiction must be resolved at product level — affects all segments
  - Audit information is non-negotiable trust signal (Sam, Alex); trust signals broadly are missing (Jordan)
  - Position management (health factor, liquidation price) is the biggest app-level gap (Sam, Alex)
  - No yield numbers is a critical gap — affects all segments differently but blocks conversion for everyone
  - Value prop directionally right; substantiation and specificity are the gap
  - App assumes fully-onboarded state; no empty/onboarding experience exists

- Product Brief COMPLETE → `ProductBrief/product-brief.md` (2026-04-04)

#### Product Brief summary:
  - 6 cross-persona themes identified (WBTC contradiction, no rates, no onboarding state, no team visibility, swap missing pre-confirmation data, hex addresses in recipient screen)
  - 7 persona-specific priorities documented (Jordan: Coinbase clarification; Alex: position management screen, audit, Browse screen rates; Sam: desktop dashboard, legal/regulatory clarity)
  - 8 build priorities ordered: Onboarding → Portfolio with health panel → Receive exchange-first → Swap with rate transparency → Position management → Browse as rate comparison → Recipient screen username-first → Yield display
  - 12 screens inventoried (A–L): Onboarding Welcome, Onboarding Connect, Onboarding Portfolio, Portfolio active, Receive, Send/Recipient, Swap, Select Token, Earn/Deposit, Borrow, Positions, Browse
  - 6 product decisions flagged for Modulo team: WBTC/native BTC status, exchange connection mechanism, action label (Save/Earn/Lend), fixed-rate definition, audit timeline, US person eligibility
  - Design system requirements defined: colour tokens, typography scale, component list (~20 components), 5 required patterns (jargon resolution, confirmation gate, empty state, rate display, health factor)
  - Deferred list: desktop dashboard, automation/conditional orders, RWA collateral, CSV export, Ledger, price alerts, multi-account, testnet, full address book, "send any asset you don't own" feature
  - Success metrics defined per persona: Jordan (activation/onboarding completion), Alex (position creation rate, swap abandonment), Sam (capital depth per user, LTV monitoring frequency)

- Next: Design System agent reads product brief + Figma file, extracts tokens/components/patterns → `DesignSystem/system.md`
  - BLOCKED: Figma MCP still needs settings.json config (Ant action)

### Open Threads
- What screens is Ant designing first in Figma Make?
- Modulo brand voice not yet started
- No formal engagement scope/brief documented yet

### Patterns to Extract
- Figma MCP as design→code bridge is a reusable pattern worth documenting for BakeKit methodology
- Pencil.dev bidirectional Figma integration worth noting as a toolchain option
- Persona-as-agent evaluation format produced richer, more specific UX research than a standard heuristic review — worth codifying as a methodology step
- High-value holder segment has distinct dashboard requirements vs retail: LTV health panel, liquidation distance, rate transparency must be above-fold and always-visible. Reusable pattern for any DeFi or financial product engagement.
- "Broken current experience" walkthrough (showing the painful multi-step path before the solution) is highly effective for complex workflow products — worth codifying as a discovery copywriting pattern
- "Promise/proof audit" should be a standard framework step: every marketing claim checked for visible consistency in the product UI. WBTC example is canonical for this.
- Passive holder segment (Jordan's type) is commonly excluded from DeFi product typologies that default to Trader/Degen framing — framework heuristic: check that all target segments see themselves in the product's own language.
- Any financial product must show a number (even approximate yield/rate) before asking for sign-up. This is a near-universal DeFi marketing failure worth capturing as a framework heuristic.
- **BakeKit component explorer with industry taxonomy** (Ant, 2026-04-04): Component library should live somewhere browsable for both Ant and clients. Organised by industry vertical taxonomy — e.g. Finance > Crypto > Wallet — so domain-specific components are discoverable. Clients see their own industry slice. Frank to action. Flag: needs platform thinking on where this lives (Storybook? Custom explorer? Part of BakeKit site?).
- **Agentic design system bootstrap** (Ant, 2026-04-04): The ideation phase of Fully Baked should include a "rough Figma → canonical tokens → derived extensions → bilateral code loop" pattern. Client doesn't need to design everything upfront. Extract what's definitively theirs, derive the rest, accumulate confirmed decisions into a living system. The bilateral piece (code decisions feeding back to design) is the new element to develop. This is being explored live in the Modulo engagement.
