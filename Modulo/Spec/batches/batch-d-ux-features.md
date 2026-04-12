# Batch D — UX Feature Additions (Multi-screen)
**Source:** QA Sprint QA-001, Waves 1 & 2  
**Files:** HomeScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, SmartNudges.jsx, SwapScreen.jsx, ReviewScreen.jsx  
**Instruction:** Make all changes below. Read each file before editing. Each ticket is independent. Build must pass.

---

## MOD-005 — Swipe row has no keyboard alternative (P1)

**File:** `src/HomeScreen.jsx`

Find the token row swipeable `motion.div` (the draggable row that reveals Trade/Lend/Swap actions on swipe-left).

Add `onKeyDown` handler to the draggable element:
```jsx
onKeyDown={(e) => {
  if (e.key === 'ArrowLeft' || e.key === ' ') {
    e.preventDefault();
    // snap row open — set the x offset to reveal action buttons
    // use the same state/mechanism that drag uses to show the buttons
  }
  if (e.key === 'Escape') {
    // close/reset the row
  }
}}
tabIndex={0}
aria-label={`${token.symbol} — press Space or Arrow Left to reveal actions`}
```

The revealed action buttons (Trade, Lend, Swap) are already Button components and will be keyboard accessible once visible.

---

## MOD-017 — SimulateScreen dead-end (P1)

**File:** `src/HomeScreen.jsx`

Find the "What if?" card or simulator entry point. Check if SimulateScreen exists and is functional. If it's an incomplete placeholder:

Option A (recommended): Remove the "What if?" card/section entirely from HomeScreen. Comment it out with a note: `{/* Simulator — coming in v2 */}`.

Option B: If removing feels wrong, add a back button to SimulateScreen and a minimal placeholder message: "Portfolio scenario planning — coming soon."

Choose option A unless SimulateScreen has meaningful content. The goal is no dead ends.

---

## MOD-020 — No empty/onboarding state for zero-asset wallet (P2)

**File:** `src/HomeScreen.jsx`

Find where the portfolio value is derived or displayed. When `totalPortfolioValue === 0` (or the token list is empty), show an onboarding card above the token list instead of the empty list:

```jsx
{totalPortfolioValue === 0 && (
  <div className="onboarding-card">
    <h3>Welcome to Modulo</h3>
    <p>Deposit to get started — see your portfolio grow across every chain.</p>
    <Button className="primary-btn" onPress={() => openActions({ tab: 'deposit' })}>
      Deposit
    </Button>
  </div>
)}
```

Add minimal CSS for `.onboarding-card` in `home.css`: card background, 20px padding, 16px border-radius, centred text, 24px gap.

---

## MOD-021 — AssetScreen lacks risk and volatility context (P2)

**File:** `src/AssetScreen.jsx`

Find the "About" section in AssetScreen. Below the about text, add a "Risk profile" row:

```jsx
<div className="risk-profile-row">
  <span className="risk-item">Volatility: <strong>High</strong></span>
  <span className="risk-item">Market cap: <strong>#2</strong></span>
  <span className="risk-item">Audit: <strong>CertiK ✓</strong></span>
</div>
```

Add to `asset.css`:
```css
.risk-profile-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 0;
  font-size: 13px;
  color: var(--bk-text-muted);
}
.risk-profile-row strong {
  color: var(--bk-text-primary);
}
```

Use mock data — these values don't need to be dynamic.

---

## MOD-023 — No APY education for new users (P2)

**Files:** `src/HomeScreen.jsx`, `src/ExploreScreen.jsx`, `src/AssetScreen.jsx`

Add an info tooltip to the first APY display on each screen.

Pattern to add alongside the first APY value:
```jsx
<button 
  className="apy-info-btn"
  aria-label="What is APY?"
  onClick={() => setApyTooltipOpen(true)}
>ⓘ</button>
{apyTooltipOpen && (
  <div className="apy-tooltip" role="tooltip">
    <p>APY = Annual Percentage Yield. Rates are variable and may change daily.</p>
    <button onClick={() => setApyTooltipOpen(false)}>Got it</button>
  </div>
)}
```

Add `apyTooltipOpen` state (default false) to each screen. Add minimal CSS for `.apy-info-btn` (inline, 14px, muted colour) and `.apy-tooltip` (small card, absolute position, dark bg, white text, 12px font, dismissable).

Only add to the FIRST APY occurrence on each screen — not every APY value.

---

## MOD-024 — Top Rates not filtered by user's assets (P2)

**File:** `src/ExploreScreen.jsx`

Find the yield cards row (TOP_YIELDS display). Add a "Your assets" tab alongside any existing tabs/filters:

```jsx
const [yieldFilter, setYieldFilter] = useState('all'); // 'all' | 'mine'

const PORTFOLIO_ASSETS = ['ETH', 'USDC', 'BTC']; // mock portfolio

const filteredYields = yieldFilter === 'mine'
  ? TOP_YIELDS.filter(y => PORTFOLIO_ASSETS.includes(y.symbol))
  : TOP_YIELDS;
```

Add tab pills above the yield cards: "All rates" and "Your assets". Active pill uses existing pill active pattern. Show `filteredYields` in the cards.

---

## MOD-025 — No multi-chain position breakdown (P2 - L ticket)

**File:** `src/AssetScreen.jsx`

Below the chain pills section (the row showing ETH balance across chains), add an expandable "Chain breakdown" row:

```jsx
const [chainBreakdownOpen, setChainBreakdownOpen] = useState(false);

// Chain breakdown data (mock)
const CHAIN_BREAKDOWN = [
  { chain: 'Ethereum', balance: '$1,240', gas: '~$14 to transact', hasBalance: true },
  { chain: 'Arbitrum', balance: '$580', gas: '~$0.08 to transact', hasBalance: true },
  { chain: 'Base', balance: '$320', gas: '~$0.04 to transact', hasBalance: true },
];
```

The row shows "Chain breakdown ▼" button. Expanding shows each chain's balance, gas cost, and a "Bridge" text button (CTA only — no navigation needed).

Add to `asset.css`:
```css
.chain-breakdown { margin-top: 8px; }
.chain-breakdown-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-top: 1px solid var(--bk-border-card); font-size: 14px; }
.chain-breakdown-gas { font-size: 12px; color: var(--bk-text-muted); margin-top: 2px; }
```

---

## MOD-039 — No protocol trust signals on lending platform selector (P2)

**File:** `src/ActionsScreen.jsx`

Find the platform data array (PLATFORMS or similar, used in LendBorrowTab). Add `audit` and `verified` fields:

```js
{ name: 'Aave', ..., audit: 'CertiK', verified: true },
{ name: 'Compound', ..., audit: 'OpenZeppelin', verified: true },
{ name: 'Spark', ..., audit: 'ChainSecurity', verified: true },
```

In the platform selector row JSX, add a `✓ Audited` badge next to the platform name when `verified: true`:
```jsx
{platform.verified && <span className="audit-badge">✓ {platform.audit}</span>}
```

Add to CSS: `.audit-badge { font-size: 11px; color: var(--bk-success); font-weight: 600; margin-left: 6px; }`

---

## MOD-042 — SmartNudge dual overlapping tap targets (P2)

**File:** `src/SmartNudges.jsx`

The nudge card is a Button with a dismiss X overlaid. Fix the overlap:

1. Check if the dismiss X uses `onPress={(e) => { e.stopPropagation?.(); dismiss(id); }}`. If not, add stopPropagation.
2. Find any "→" or arrow CTA text inside the card that looks like a button. Make it plain `<span>` text (not interactive) — the whole card fires the action.
3. Ensure the dismiss X is visually inside but interaction-isolated from the card button.

---

## MOD-044 — No token selection error state (P2)

**File:** `src/SwapScreen.jsx` or `src/ActionsScreen.jsx` — wherever token selection navigation returns to.

After navigating back from `/swap/select/:side`, check if `receiveToken` (or `toToken`) is null. If null after 500ms, show a toast:

```js
useEffect(() => {
  if (location.state?.fromTokenSelect && !receiveToken) {
    const timer = setTimeout(() => {
      showToast('No token selected'); // use existing toast mechanism
    }, 500);
    return () => clearTimeout(timer);
  }
}, [receiveToken, location.state]);
```

Use the existing `UndoToast` or toast pattern already in the codebase. Don't create a new toast system.

---

## MOD-011 — No transaction deadline on swaps (P1 - touches ReviewScreen)

**File:** `src/ReviewScreen.jsx`

Add a transaction deadline display to the review summary:

```jsx
const deadline = 20; // minutes, default
// ...in the fee/detail rows section:
<div className="review-row">
  <span>Expires in</span>
  <span>{deadline} min</span>
</div>
```

Add the deadline row to the swap summary only (not for lend/deposit flows). Place it with the other fee rows.

**File:** `src/ActionsScreen.jsx` (Swap tab)

Add a `deadline` state (default 20 min). In the fee breakdown display, show: `Expires in: 20 min`. This is prototype — no UI to change it yet.

---

After all changes: run `npm run build` to confirm zero errors.
