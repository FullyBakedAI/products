# Modulo Sprint 1 — Screen Build Spec
**Date:** 2026-04-08  
**Status:** Ready for implementation  
**Repo:** ~/products/Modulo/React

---

## Context

Modulo is a multi-chain DeFi platform. "One vault, every chain." USP: access liquidity across all stored assets — trade, borrow, stake, swap — everything in one place.

This spec covers Sprint 1: Asset Detail (rebuild), Actions Hub (new), Universal Review+Confirm (new), Activity Screen (new), and wiring everything together.

**Read first:**
- `~/products/Modulo/React/src/HomeScreen.jsx` — the reference for screen structure and patterns
- `~/products/Modulo/React/src/SwapScreen.jsx` — reference for modal screen patterns
- `~/products/Modulo/React/src/motion-tokens.js` — all animation curves
- Existing token system: all colours via `--bk-*` CSS custom properties. Zero hardcoded hex values.
- ADR-002: React ARIA → BakeKit tokens → product components. Mandatory.

---

## Design Principles (MUST follow)

1. **All tokens via `--bk-*` CSS custom properties.** No hardcoded colours, ever.
2. **React ARIA for all interactive elements.** `Button`, `Tabs`, `TabList`, `Tab`, `TabPanel` from `react-aria-components`.
3. **Motion via `motion-tokens.js`.** Import `{ motion as m } from './motion-tokens'`. Use `m.fade`, `m.modal`, `m.sheet` curves.
4. **Dark-first, mobile-first.** Phone width 390px, everything fits within that.
5. **WCAG 2.1 AA.** aria-labels on all interactive elements.
6. **Stagger animations on list items.** Same pattern as HomeScreen token list.
7. **`data-bk-component` attributes** on all major components (for the design system inspector).
8. **StatusBar component** at top of every screen that's not a modal.

---

## Screen 1: Asset Detail (REBUILD — replace existing AssetScreen.jsx)

**Route:** `/asset/:id`  
**Entry animation:** Modal slide-up (same as SwapScreen)  
**File:** `src/AssetScreen.jsx` + `src/asset.css`

### Layout (top to bottom):

#### Header
- Back chevron (left) → navigates to `/`
- Asset name (centre)
- Three-dot "more" menu (right, `MoreHorizontal` from lucide) — placeholder onPress for now

#### Price Chart Area
- Use `lightweight-charts` package (already installed). Import `createChart` from `lightweight-charts`.
- Chart type: Area chart (filled line)
- Chart dimensions: full width × 160px height
- Chart colours: line `var(--bk-brand-primary)`, fill gradient from brand-primary (0.3 opacity) to transparent
- Background transparent (chart sits over the dark app background)
- Time period pills below chart: `1D | 1W | 1M | 1Y | ALL` — active pill uses `--bk-brand-primary` colour
- Mock data: generate 30 data points of plausible price movement. For ETH: range ~$3,800-$4,500. For BTC: range ~$90,000-$105,000. For SOL: range ~$220-$280. For USDC/USDT: flat at $1.00. For each period, generate different mock data.
- Chart should initialise on mount and resize to container width

#### Position Summary (card)
- `data-bk-component="portfolio-metric"`
- Background: `var(--bk-bg-elevated)`, border-radius 16px, padding 16px 20px
- Row 1: Token icon (40px) + `{amount} {symbol}` + USD value (right-aligned, large)
- Row 2: 24h change badge (green/red) + yield display: `{APY}% APY · {yieldUsd}/yr`
- Subtle yield bar underneath (same pattern as home screen token rows)

#### Opportunities Section
- Heading: "Put it to work" — small uppercase label `--bk-text-muted`
- Three action cards in a vertical list:
  
  **Stake card:**
  - Icon: `Zap` (lucide), background `var(--bk-brand-primary)` in 36px rounded square
  - Title: "Stake" — subtitle: "4.2% APY · Flexible unlock"
  - Right: `> ` chevron
  - onPress → navigates to `/stake/:id`

  **Lend card:**
  - Icon: `Landmark` (lucide), background `#6d28d9`
  - Title: "Lend" — subtitle: "3.1% APY · Earn on idle assets"
  - Right: chevron
  - onPress → navigates to `/lend/:id`

  **Trade card:**
  - Icon: `TrendingUp` (lucide), background `#3b82f6`
  - Title: "Trade" — subtitle: "Market & limit orders"
  - Right: chevron
  - onPress → navigates to `/trade/:id`

- Action cards style: `background: var(--bk-bg-elevated)`, gap 2px between cards (stacked list), border-radius 12px on outer container. Each row: `padding: 14px 20px`, `display: flex`, `align-items: center`, `gap: 14px`.
- Top-radius only on first card, bottom-radius only on last card (grouped list appearance).

#### Active Positions (conditional — show if mock has open positions)
- For ETH: show a mock "Staking position" card
  - Label: "Active" badge (green)
  - Title: "Staked via Lido"
  - Details: "1.0 ETH · Earning 4.2% APY · $167.69/yr"
  - Health: green bar
  - Manage button → `/manage/:id`
- For USDC: show a mock "Lending position" card
  - Label: "Active" badge
  - Title: "Lent on Aave v3"
  - Details: "3,000 USDC · 3.8% APY · earning $114/yr"
  - Manage button
- For other tokens: no active positions section

#### Quick Actions strip (at the bottom, fixed above any content)
- Horizontal row of pills: `Send | Receive | Swap`
- Each pill: icon + label, background `var(--bk-bg-elevated)`, border: 1px solid `var(--bk-border)`, border-radius 24px, padding 10px 16px
- Send → navigates to `/send`
- Receive → navigates to `/receive`  
- Swap → navigates to `/actions` with swap tab pre-selected (pass query param `?tab=swap&asset={id}`)

---

## Screen 2: Actions Hub (NEW — replaces SwapScreen as the primary action surface)

**Route:** `/actions`  
**Entry animation:** Modal slide-up  
**File:** `src/ActionsScreen.jsx` + `src/actions.css`  

The existing SwapScreen at `/swap` STAYS — it's used internally. This screen wraps it and adds other tabs.

### Layout:

#### Header
- Close X button (top right) → navigates to `/`
- Title: "Actions"

#### Tab Bar
- 4 tabs using React ARIA `Tabs`, `TabList`, `Tab`, `TabPanel`
- Tabs: `Swap | Trade | Lend & Borrow | Deposit`
- Active tab: `--bk-brand-primary` underline, text `--bk-text-primary`
- Inactive: `--bk-text-muted`
- Tab bar styling: horizontal, full width, border-bottom `1px solid var(--bk-border)`, no background

#### Swap Tab
- Renders the existing `SwapScreen` content inline (NOT as a nested route — copy the core swap UI markup here or render `<SwapInner />` — extract the core UI from SwapScreen.jsx into a reusable component if needed)
- Actually: simplest approach — just render a message "Swap" + description + CTA button that navigates to `/swap`. Clean handoff. Label: "Swap any token across any chain." Button: "Open Swap" → `/swap`.

#### Trade Tab
- Header: "Trade" with subtitle "Market and limit orders"
- Two-button toggle: `Market | Limit` (styled like the time-period pills on the portfolio card)
- Asset selector: tappable row showing current asset icon + name + "Change →" (placeholder)
- Amount input: large number input, same style as swap screen pay input
  - Label: "Amount"
  - Right: `MAX` button
- Direction toggle: `Buy | Sell` — two equal-width buttons, selected state uses brand primary background
- For Limit only: price input field "Limit price"
- Order summary: small card showing "Order: Buy 0.05 ETH at $4,400 = $220"
- CTA: "Review Order" button (primary, full width) → `/review` with action params (placeholder for now)

#### Lend & Borrow Tab
- Sub-toggle at top: `Lend | Borrow`
  
  **Lend sub-view:**
  - "Select asset" tappable row (shows first asset as default)
  - APY comparison cards (3 platforms):
    - Aave v3: 3.8% APY, TVL $2.1B, `Lend` button
    - Compound: 3.2% APY, TVL $890M, `Lend` button
    - Spark: 4.1% APY, TVL $1.4B, `Lend` button
  - Each card: platform name + APY (large, green) + TVL + security badge ("Audited") + Lend CTA
  - Amount input below platform selection
  - CTA: "Review" → review screen

  **Borrow sub-view:**
  - Your collateral: shows current holdings that can be used as collateral
    - ETH: $4,412 available → toggle to enable as collateral
  - Borrow amount input
  - Health factor indicator: large number (e.g. "2.4") with label "Health Factor" — colour coded (green > 2, orange 1.2-2, red < 1.2)
  - Liquidation price: "ETH liquidation at $2,100" 
  - Interest rate: "Variable 4.8% APR"
  - CTA: "Review Borrow" → review screen

#### Deposit Tab
- Title: "Deposit & Withdraw"
- Two equal cards:
  - **Deposit:** "Add funds to your vault" → shows network options (crypto address QR, bank transfer coming soon)
  - **Withdraw:** "Move funds out" → connects to `/send`
- Keep simple — these are placeholders pointing to existing flows

---

## Screen 3: Universal Review + Confirm (NEW)

**Route:** `/review`  
**Entry animation:** Sheet slide-up from bottom  
**File:** `src/ReviewScreen.jsx` + `src/review.css`  

This screen receives action details via React Router location state (`useLocation().state`). It's the final step before any action executes.

### Props (via router state):
```
{
  action: 'swap' | 'stake' | 'lend' | 'borrow' | 'trade' | 'send',
  from: { icon, symbol, amount, usd },  // what you're giving
  to: { icon, symbol, amount, usd },    // what you're getting (null for stake/lend)
  fee: { network: string, protocol: string, total: string },
  rate: string,  // e.g. "1 ETH = 3,241 USDC"
  warning: string | null,  // e.g. "High slippage: 2.3%"
}
```

For screens that don't pass state yet, use sensible mock data so the screen renders.

### Layout:

#### Handle bar (top, draggable indicator)
- 36px wide, 4px tall pill, `var(--bk-text-muted)` colour, centered

#### Title
- "Review {action}" — capitalised action name, e.g. "Review Swap"

#### Action Summary Card
- Large card, `background: var(--bk-bg-elevated)`, border-radius 20px, padding 24px
- **You give:** icon + amount + symbol + USD value (right)
- Arrow down icon (`ArrowDown` from lucide), centred, `--bk-text-muted`
- **You receive:** icon + amount + symbol + USD value (right)
- For stake/lend (no "receive" asset): show "Earning" with the APY rate instead

#### Details breakdown
- Thin list below the card:
  - Exchange rate: "1 ETH = 3,241 USDC"
  - Network fee: "$2.40"
  - Protocol fee: "$0.88"  
  - Total cost: "$3.28"
- Each row: label (muted) left + value right, separator line between rows

#### Warning (conditional)
- If `warning` exists: amber warning card with `AlertTriangle` icon + warning text

#### Confirm button
- Full width, `--bk-brand-primary` background, large (56px height)
- Label: "Confirm {action}" — e.g. "Confirm Swap"
- On press: navigates to `/success` with state `{ action, summary }`

#### Cancel link
- Below confirm button, centered, text-only "Cancel" → navigate back

---

## Screen 4: Transaction Success (NEW)

**Route:** `/success`  
**Entry animation:** Modal slide-up  
**File:** `src/SuccessScreen.jsx` + `src/success.css`  

### Layout:
- Full screen dark background
- Centred content with large success animation:
  - Animated checkmark circle using Framer Motion (draw animation on the circle stroke, then scale-in the check)
  - Circle: 80px, stroke `var(--bk-brand-primary)`, 3px stroke width
  - Check: drawn using SVG path animation
- Title: "{action} complete" — e.g. "Swap complete"
- Subtitle: brief summary — "You swapped 0.1 ETH for 324.10 USDC"
- Two buttons:
  - Primary: "View in Activity" → `/activity`
  - Secondary/ghost: "Back to Portfolio" → `/`
- Share button (top right, ghost): `Share2` icon — placeholder

---

## Screen 5: Activity Screen (NEW)

**Route:** `/activity`  
**Entry animation:** Fade  
**File:** `src/ActivityScreen.jsx` + `src/activity.css`  

### Layout:

#### Header
- Title: "Activity"
- Filter button (right): `SlidersHorizontal` icon

#### Filter chips (horizontal scroll)
- All | Swaps | Trades | Staking | Lending | Transfers
- Active chip: `--bk-brand-primary` background, white text
- Inactive: `--bk-bg-elevated` background, `--bk-text-muted`

#### Pending section (show if pending items exist)
- Section label: "Pending" (uppercase, muted)
- 1 mock pending item: Swap 0.05 ETH → USDC, "Confirming on Ethereum" with spinner

#### Transaction list (grouped by date)
- Section headers: "Today", "Yesterday", "Apr 7" — small, muted, uppercase
- Each transaction row:
  - Left: action type icon in coloured 36px circle (Swap=brand, Send=blue, Receive=green, Stake=purple)
  - Middle: action label + asset pair + timestamp
  - Right: amount (green for received/earned, neutral for sent), chain badge
  - `data-bk-component="tx-row"`

Mock transactions (at least 8-10):
```
Today:
- Swap: 0.1 ETH → 324.10 USDC · $324.10 · 2 hours ago
- Received: +0.5 SOL · +$121.25 · 5 hours ago

Yesterday:
- Staking reward: +0.0012 ETH · +$5.28 · Lido
- Swap: 500 USDC → 0.1534 ETH · $500 · 14:22

Apr 7:
- Sent: -100 USDC · to 0x4248...EF33 · 11:05
- Lending deposit: 3,000 USDC → Aave v3 · $3,000 · 09:33
- Received: +0.0574 BTC · +$5,616.88 · 08:14
- Swap: 1,000 USDT → 0.3082 ETH · $1,000 · 07:51
```

---

## Routing Changes

Update `src/App.jsx`:

```
Add routes:
- /actions          → ActionsScreen (modal)
- /review           → ReviewScreen (sheet)  
- /success          → SuccessScreen (modal)
- /activity         → ActivityScreen (fade)
/asset/:id         → AssetScreen (already exists, rebuilt)
```

Update `MODAL_PATHS` to include `/actions`, `/success`
Update `SHEET_PATHS` to include `/review`

---

## Bottom Nav Changes

Update `src/BottomNav.jsx`:

Current nav items (check current file). Replace/update to:
1. Home (`/`) — Home icon
2. Markets (`/explore`) — Compass icon  
3. Actions (`/actions`) — Zap icon (replaces Swap)
4. Activity (`/activity`) — Clock icon (NEW)
5. Profile (`/profile`) — User icon (placeholder screen or existing)

---

## Notes & Constraints

- `lightweight-charts` is already in package.json — use it for the price chart
- All chart colours must use CSS variable values computed at render time via `getComputedStyle(document.documentElement).getPropertyValue('--bk-brand-primary')`
- The `AssetScreen.jsx` file currently exists — REPLACE its content entirely
- The `asset.css` file currently exists — REPLACE its content entirely  
- All new CSS files: start with the token comment header pattern from `home.css`
- No TypeScript (project uses JSX)
- Framer Motion is installed and in use — use it for all animations
- React Router v6 (`useNavigate`, `useParams`, `useLocation`) — already in use
- `lucide-react` for all icons — already in use
- After completing all screens, run `npm run build` from `~/products/Modulo/React/` and verify it compiles clean

---

## Deliverables

1. `src/AssetScreen.jsx` — rebuilt
2. `src/asset.css` — rebuilt
3. `src/ActionsScreen.jsx` — new
4. `src/actions.css` — new
5. `src/ReviewScreen.jsx` — new
6. `src/review.css` — new
7. `src/SuccessScreen.jsx` — new
8. `src/success.css` — new
9. `src/ActivityScreen.jsx` — new
10. `src/activity.css` — new
11. `src/App.jsx` — updated with new routes
12. `src/BottomNav.jsx` — updated with new nav items

Clean build required before marking done.
