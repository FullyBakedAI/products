# Modulo Design Contexts

> **Load when:** building a specific screen (swap, send, receive, explore, home, confirm), writing a screen prompt for an agent, making layout or density decisions based on user state.
>
> Context is the difference between a correct UI and a good one.
> The same component renders differently in high-stakes vs. exploratory situations.
> Before designing a screen, name the context. Then design for it.

---

## What a Context Is

A context is a combination of:
- **User state** — what the user knows, feels, and is trying to do
- **Cognitive load** — how much they're tracking at once
- **Stakes** — consequences of errors
- **Time pressure** — how fast they need to act

Getting context right means the design naturally reduces friction in low-stakes moments and builds trust in high-stakes ones — without being asked.

---

## The Core Contexts

### 1. Reviewing — "What do I have?"
*User is orienting. No immediate action planned.*

User state: Calm, curious, periodic. Often just opened the app.
Stakes: Low. Reading only.
Cognitive load: Low.

Design response:
- Lead with the most meaningful number (portfolio total, % change)
- Make scanning easy — strong visual hierarchy, clear separators
- Suppress action density — actions available but not prominent
- Show relative context (is this gain good? vs yesterday, vs market)
- Micro-animation is fine for delight (chart rendering, number counting)

Examples: HomeScreen portfolio card, token list

---

### 2. Deciding — "Should I make this swap?"
*User has a plan and is evaluating whether to execute.*

User state: Focused, possibly anxious. Price-sensitive.
Stakes: Medium–high. Financial transaction.
Cognitive load: High — tracking multiple values simultaneously.

Design response:
- Every number visible without scrolling
- Rate and fees shown upfront, not after confirmation
- The dominant action (Swap) is unavailable until the decision is complete
- Allow easy correction — change tokens, amounts without friction
- Reduce noise — no marketing, no suggestions, no upsell

Examples: SwapScreen

---

### 3. Confirming — "I've decided. Lock it in."
*User has made a decision and is executing it.*

User state: Committed, wants speed. Confirmation anxiety possible.
Stakes: High. Irreversible transaction.
Cognitive load: Low — just needs to verify the key details.

Design response:
- Show only what changes: "You pay X, you receive Y"
- CTA language matches the action exactly ("Swap ETH → USDC" not "Confirm")
- No distractions at this moment
- Fast feedback once submitted — optimistic update, then settle
- Error recovery must be clear and immediate

Examples: Swap confirm state (pending implementation)

---

### 4. Sending — "Get this to someone else."
*User needs to specify a recipient and amount. High precision required.*

User state: Purposeful, focused. May be time-pressured.
Stakes: High. Wrong address = lost funds.
Cognitive load: High — address + network + amount all in play.

Design response:
- Address input must be prominent and clearly formatted
- Network must be stated explicitly (not implied)
- Show balance available before amount input
- Warn on partial matches, unknown addresses, unusual amounts
- Confirmation screen must show full address (no truncation at confirm step)

Examples: SendScreen

---

### 5. Discovering — "What's out there?"
*User is exploring without a specific transaction in mind.*

User state: Curious, low urgency. Browsing mode.
Stakes: Low. Reading only.
Cognitive load: Variable — user controls depth.

Design response:
- Surface social proof (volume, holders, chains supported)
- Make comparison easy — consistent data points across tokens
- Low-friction entry to transactions (one tap to swap a discovered token)
- No pressure — no countdown timers, no "buy now" urgency

Examples: ExploreScreen

---

### 6. Receiving — "Give someone my address."
*User needs to share their address. Passive, social context.*

User state: Relaxed. Waiting for someone else to act.
Stakes: Low for showing QR. Medium for ensuring the right network.
Cognitive load: Low.

Design response:
- Large, clear QR code — no surrounding clutter
- Network stated prominently
- Copy address button front and centre
- Share affordance available
- No financial data on this screen — it breaks the mental model

Examples: ReceiveScreen

---

## How to Use Contexts in Agent Prompts

When asking an agent to build a screen, name the context:

```
Build a transaction history screen for Modulo.
Context: Reviewing — user is orienting, no immediate action planned.
Stakes are low. Design for scanning, not action.
```

vs.

```
Build a transaction detail screen for Modulo.
Context: Confirming — user is reviewing before submitting.
Stakes are high. Show only what changes. No distractions.
```

The same component library produces very different experiences when the context is named.

---

## Cross-Context Rules

Some things don't change regardless of context:

- Token amounts are always exact (no rounding)
- Brand accent (`--bk-brand-primary`) is always the primary action indicator
- Network identity is always explicit (never implicit)
- Reversibility is always communicated before destructive actions
- Loading states always show structure, never blank space

---

## Personas

See `/Personas/` for the three primary user archetypes:
- **Alex** — DeFi intermediate, optimises frequently, values speed
- **Jordan** — Crypto-curious, needs legibility, avoids jargon
- **Sam** — High-value holder, risk-aware, wants trust signals first

When in doubt, design for Jordan. Alex can find advanced features. Sam needs trust before speed.
