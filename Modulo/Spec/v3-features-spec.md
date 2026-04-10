# Modulo v3 Feature Spec

**Version:** 3.0
**Date:** 2026-04-09
**Base:** v2-modulo tag (locked)
**Excludes:** Swipe-to-act (#4 from brainstorm — already covered by ActionsScreen)

## Design System

Use existing tokens from `tokens.css`. Dark theme. All values via `--bk-*` custom properties. Font: Inter. Brand purple: `#584BEB`. No hardcoded hex values.

Key patterns to reuse:
- `.card` pattern (bg-card, border-subtle, border-radius 16px)
- `.primary-btn` (brand-primary background, white text, 48px height, 12px radius)
- `.scroll-content` for scrollable areas
- Motion tokens from `motion-tokens.js`
- StatusBar + BottomNav on all main screens

## Feature 1: "Put It All To Work" — One-tap optimisation

**Location:** New prominent card on HomeScreen, below the portfolio chart, above the token list.

**Design:**
- Card with `--bk-earn-card-bg` background, `--bk-earn-card-border` border
- Icon: sparkle/magic wand (use Lucide `Sparkles` or `Wand2`)
- Headline: "Put it all to work"
- Subtext: "Estimated +$969/yr across 4 protocols"
- CTA button: "Optimise" using brand-primary
- Tapping opens a new `/optimise` screen

**Optimise Screen (`/optimise`):**
- Modal transition (slide up)
- Shows a breakdown: each token → recommended protocol → APY
- Use the existing TOKENS data from HomeScreen
- Example rows:
  - USDC → Aave → 4.8% APY → +$256/yr
  - BTC → Native staking → 1.8% APY → +$101/yr
  - ETH → Lido → 3.8% APY → +$168/yr
  - SOL → Marinade → 6.8% APY → +$288/yr
  - USDT → Compound → 4.6% APY → +$156/yr
- Total: +$969/yr
- Big "Confirm & Deploy" button at bottom (brand-primary)
- Tapping confirm → navigates to /success

## Feature 2: Live yield counter

**Location:** HomeScreen portfolio card — the main balance number.

**Design:**
- The total balance number (`$22,999.83`) animates upward continuously
- Use `requestAnimationFrame` or a `useEffect` interval
- Calculate rate: total yield per second from staked positions = $969/yr ÷ 31,536,000 = ~$0.0000307/sec
- Display: fractional cents tick up every ~300ms (smooth enough to see movement)
- Only animate when positions are "active" (after optimise or staking)
- Add a small green pulse dot next to the total when yield is active
- Subtle glow effect on the number when it ticks

## Feature 3: Autopilot mode

**Location:** New toggle in the HomeScreen header area OR a new section below the optimise card.

**Design:**
- A card with a toggle switch
- "Autopilot" label with a small `Zap` icon
- When toggled on: shows risk level selector (Conservative / Balanced / Aggressive) as pill tabs
- Below: "Last rebalance: 2 days ago — moved USDC to Compound (+0.7% APY)"
- Subtle animated border glow when active (pulse the brand-primary border)
- Create new route `/autopilot` for settings detail view

**Autopilot Detail Screen:**
- Risk tolerance selector (3 options with descriptions)
- "Autopilot activity" feed — list of past actions taken
- Toggle to enable/disable notifications
- "Pause autopilot" button

## Feature 4: Smart nudges

**Location:** HomeScreen — between the optimise card and token list.

**Design:**
- Horizontal scrollable row of nudge cards (like Instagram stories but for financial suggestions)
- Each card: 280px wide, `--bk-bg-card` background, 12px radius
- Card contents:
  - Small icon (trend arrow, alert, lightbulb)
  - 2-line message
  - Action button (small, outline style)
- Example nudges:
  1. "ETH yield up +0.9% on Lido" → "Move now"
  2. "SOL idle for 14 days — could've earned $12" → "Stake"
  3. "BTC health factor: 3.2x — you're safe" → "Details"
- Dismissable (swipe up or X button)
- Max 3 visible at a time

## Feature 5: "What if?" simulator

**Location:** New route `/simulate`, accessible from portfolio card (add a small "What if?" link/button) and from Explore.

**Design:**
- Full screen with modal transition
- A slider at the top: "If BTC hits..." with price range ($50k – $200k)
- Below: live-updating projection cards for each token showing:
  - Current value → Projected value
  - Current yield → Projected yield
- A second tab/mode: "If you staked everything..."
  - Shows current yield total vs optimised yield total
  - Animated bar chart comparing the two
- Use smooth motion (framer-motion `animate` on value changes)
- Brand-primary accent on the slider thumb

## Feature 6: Achievement milestones

**Location:** New `/achievements` route, plus toast notifications on HomeScreen.

**Design:**
- Achievements screen: grid of cards, locked ones are dimmed
- Each achievement: icon, title, description, date earned
- Achievements:
  1. "First Deposit" — moved crypto into Modulo
  2. "Yield Hunter" — first $10 earned from yield
  3. "Century Club" — first $100 earned
  4. "Cross-Chain Native" — assets on 3+ chains
  5. "Set & Forget" — Autopilot active for 7 days
  6. "Optimiser" — used Put It All To Work
  7. "30-Day Streak" — money working for 30 days straight
- Toast on HomeScreen when milestone is hit: small card slides up from bottom with confetti particle effect (CSS-only, use `@keyframes`)
- Access from a small trophy icon in the home header

## Feature 7: One-tap undo

**Location:** Toast/snackbar overlay on any screen after a transaction.

**Design:**
- After any action (stake, swap, send, optimise), show a bottom toast:
  - "Staked 1.14 ETH on Lido" + "Undo" button + countdown ring (30s)
  - Background: `--bk-bg-elevated` with a subtle border
  - Countdown: circular progress ring around the undo button, depleting over 30s
  - Tapping "Undo" → reverses action, shows "Reversed" confirmation
  - After 30s → toast slides away, action is "confirmed"
- Use framer-motion for the slide-in/out
- The countdown ring uses SVG `stroke-dashoffset` animation

## New Routes Summary

| Route | Screen | Transition |
|-------|--------|------------|
| `/optimise` | Put It All To Work detail | modal |
| `/autopilot` | Autopilot settings | modal |
| `/simulate` | What-if simulator | modal |
| `/achievements` | Achievement gallery | modal |

## Implementation Notes

- All data is mocked — no real API calls
- Reuse TOKENS array from HomeScreen for consistent data
- Add new CSS files: `optimise.css`, `autopilot.css`, `simulate.css`, `achievements.css`
- Keep existing v2 screens untouched — add new features alongside
- All new components use React ARIA for accessibility
- All motion uses framer-motion with existing motion-tokens
