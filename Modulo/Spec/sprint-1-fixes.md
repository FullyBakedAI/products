# Sprint 1 — Fix & Rebuild Plan
**Date:** 2026-04-08
**Author:** Frank (OpenClaw)
**For:** Claude Code

---

## Context

Sprint 1 screens were built without sufficiently inheriting the design language established in V1 (HomeScreen, SwapScreen, SendScreen, ReceiveScreen). The result was screens that looked like a different product. This plan is a strict fix-and-rebuild pass. Everything follows existing patterns — no invention.

**Do not modify:**
- `SwapScreen.jsx` / `swap.css` — these are working, well-designed, and sacred
- `HomeScreen.jsx` / `home.css` — established, only touch the swipe action wiring
- `shared.css` — design system base, no changes

---

## Part 1: Bug Fixes (required first)

### 1.1 — Asset tap not working on HomeScreen

**File:** `src/HomeScreen.jsx`

**Problem:** `onClick={handleTap}` on a `motion.div` with `drag="x"` does not reliably fire on mobile — Framer Motion's drag system consumes touch events before React's onClick.

**Fix:** Replace `onClick={handleTap}` with Framer Motion's `onTap` handler:

```jsx
// BEFORE
<motion.div
  className="token-row"
  onClick={handleTap}
  ...
>

// AFTER
<motion.div
  className="token-row"
  onTap={handleTap}
  ...
>
```

`onTap` is part of Framer Motion's gesture system and fires correctly even when `drag` is also active. It already receives `(event, info)` — the existing `handleTap` function only uses `x.get()` so no signature change needed.

### 1.2 — Swipe actions not navigating

**File:** `src/HomeScreen.jsx`

**Problem:** Every swipe action calls `snap(false)` only — no routing.

**Fix:** Wire each action to the correct route. Update the click handlers inside `TokenRow`:

```jsx
// Replace the swipe-actions block with:
<div className="token-swipe-actions">
  {SWIPE_ACTIONS.map(({ id, label, Icon, cls }) => (
    <button
      key={id}
      className={`swipe-action ${cls}`}
      aria-label={`${label} ${t.name}`}
      onClick={(e) => {
        e.stopPropagation();
        snap(false);
        // Route after snap completes
        setTimeout(() => {
          if (id === 'swap')    navigate('/swap');
          else if (id === 'manage')  navigate(`/asset/${t.id}`);
          else navigate(`/actions?tab=${id}&asset=${t.id}`);
        }, 280);
      }}
    >
      <Icon size={18} strokeWidth={1.5} />
      <span>{label}</span>
    </button>
  ))}
</div>
```

Note: 280ms delay lets the snap animation complete before the screen transitions — prevents jarring cuts.

---

## Part 2: Design System Rules (apply to all new/rebuilt screens)

These patterns are extracted from `SwapScreen.jsx`, `HomeScreen.jsx`, `SendScreen.jsx`, `ReceiveScreen.jsx`, `shared.css`, `swap.css`, and `home.css`. They ARE the design system. New screens must use them.

### Cards
```css
/* Standard card */
background: linear-gradient(180deg, var(--bk-bg-card), var(--bk-bg-card-alt));
border: 1px solid var(--bk-border-subtle);
border-radius: 16px;
padding: 16px;

/* Elevated surface (inputs, segments) */
background: var(--bk-bg-elevated);
border: 1px solid var(--bk-border-subtle);
border-radius: 14px;
```

### Header pattern (modal/action screens)
```jsx
// Same structure as SwapScreen's SwapHeader
<div className="swap-header">         // height: 52px, flex, border-bottom: 1px solid var(--bk-border-subtle)
  <div className="header-left">       // flex, align-items: center, gap: 10px
    <Button className="close-btn" onPress={onClose}>
      <X size={20} color="var(--bk-text-muted)" strokeWidth={1.5} />
    </Button>
    <h1 className="swap-title">Title</h1>   // font-size: 20px, font-weight: 600
  </div>
  <Button className="settings-btn">  // 38px, rounded, var(--bk-bg-elevated)
    <Settings size={20} color="var(--bk-text-muted)" strokeWidth={1.5} />
  </Button>
</div>
```

### Bottom CTA button
```jsx
// Use the existing .bottom-cta-btn pattern from swap.css:
<Button className={`bottom-cta-btn ${ready ? 'cta-ready' : 'cta-disabled'}`}>
  Label
</Button>
// OR the shared .primary-btn from shared.css for simpler cases
```

### Tab bar
```jsx
// Match the HomeScreen pattern (not React ARIA Tabs — native buttons with active class)
<div className="tabs" role="tablist">
  <button className="tab active" role="tab">Swap</button>
  <button className="tab" role="tab">Trade</button>
  ...
</div>
// Tab content is conditionally rendered based on state
```

### Sheet / Bottom modal pattern
```jsx
// DragHandle + title at top (from SendScreen/ReceiveScreen)
<div className="drag-handle"><div className="drag-handle-pill" /></div>
<h1>Title</h1>
// Content
// .primary-btn at bottom with margin: 0 16px 20px
```

### Icons
- Always Lucide, `strokeWidth={1.5}`, sized 16–22px
- Nav/muted: `color="var(--bk-text-muted)"`
- Brand/active: `color="var(--bk-brand-primary)"`
- On coloured backgrounds (swipe actions, icon badges): pure `#fff`
- **Never** use arbitrary icon background colours — use the existing swipe action classes

### Amount input pattern
- Use the numpad (`Numpad` component) for amount entry, NOT HTML `<input type="number">`
- Use the `swap-amount` display pattern (styled div with amount-text + cursor)
- Exception: search/filter fields use `<input type="text">`

---

## Part 3: Screen Rebuilds

### 3.1 — AssetScreen

**Files:** `src/AssetScreen.jsx`, `src/asset.css`

**Goal:** A screen that feels like it belongs in the same app as SwapScreen. World-class DeFi asset detail — think Coinbase's asset view combined with Revolut's clean metrics.

**Structure:**
```
StatusBar
SwapHeader-style header (← back, "Bitcoin", ···)
━━━ Scrollable content ━━━
  [Price + Chart section]
    Large price (36px, font-weight: 300 — matches swap-amount style)
    24h change badge (green/red)
    PriceChart — full width, 140px, lightweight-charts
    Period pills — same style as .time-btn from home.css
  
  [Position card — swap-card style]
    Token icon (40px) + amount on left
    USD value on right
    Yield bar (same as home.css token-yield-bar-row)
    Chain breakdown pills if multi-chain
  
  [Quick actions — action-row style from home.css]
    Send / Receive / Swap — same .action-btn pattern (70.5px tall, icon + label)
  
  [Opportunities section]
    Section label (same style as .portfolio-label — 11px, uppercase, letter-spacing 0.07em)
    List of opportunity rows (same card style, NOT a custom card — use .swap-card gradient)
    Each row: icon badge | label + sub | chevron right
  
  [Active positions — only shown if any]
    Section label
    Position cards (swap-card style)
  
  [Contract info row at bottom]
━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**CSS rules:**
- Reuse `.swap-card` class for any card container (import swap.css or copy the pattern)
- Reuse `.time-btn` / `.time-btn.active` for period pills
- Section labels: same as `.portfolio-label` in home.css
- Period pills and quick actions: same dimensions as HomeScreen equivalents
- Quick action buttons: identical to `.action-btn` in home.css
- The scroll area uses `.scroll-content` class from shared.css

### 3.2 — ActionsScreen

**Files:** `src/ActionsScreen.jsx`, `src/actions.css`

**Goal:** The hub screen that replaces Swap in the nav. Tabs across the top for each action type. Each tab renders a UI matching the quality of SwapScreen. Swap tab should embed the ACTUAL swap functionality (SwapContext), not just a "Go to Swap" button.

**Structure:**
```
StatusBar
SwapHeader-style header (X, "Actions", settings icon)
Tab bar (.tabs / .tab / .tab.active pattern from home.css — 4 tabs: Swap · Trade · Lend & Borrow · Deposit)
━━━ Tab content ━━━

[Swap tab] — Use SwapScreen's exact UI inline:
  - Import SwapContext / useSwap
  - Render PayCard, SwapDirectionButton, ReceiveCard (copy from SwapScreen or refactor into shared)
  - PercentagePills + Numpad
  - Bottom CTA → /review

[Trade tab]
  - Segment: Market | Limit (same style as existing .time-btn pills in a row)
  - Asset selector pill (token-pill-btn style from swap.css)
  - Buy/Sell toggle (two .pct-pill-btn style buttons, green/red tint when active)
  - Amount display (.swap-amount style) + Numpad
  - Platform/order summary card (.swap-card style)
  - Bottom CTA → /review

[Lend & Borrow tab]
  - Sub-tabs: Lend | Borrow (same segment style)
  - Lend: asset selector, platform comparison in .swap-card cards, amount + Numpad, CTA
  - Borrow: collateral card (swap-card), health factor display, amount + Numpad, CTA → /review

[Deposit tab]
  - Two large .action-btn style cards side by side: Deposit (→ /receive) | Withdraw (→ /send)
  - Info note at bottom
```

**CSS rules:**
- No new CSS patterns — reuse `.tabs`, `.tab`, `.tab.active` from home.css
- All cards: `.swap-card` gradient background pattern
- Amount entry: `.swap-amount` div + `.numpad` grid (or navigate to SwapScreen)
- CTA: `.bottom-cta-btn` / `.cta-ready` / `.cta-disabled` pattern
- The tab list border-bottom: `1px solid var(--bk-border-subtle)`

### 3.3 — ReviewScreen

**Files:** `src/ReviewScreen.jsx`, `src/review.css`

**Goal:** Sheet that slides up from bottom. Clean, trustworthy confirmation. Inspiration: Coinbase's trade confirmation sheet.

**Structure:**
```
drag-handle + drag-handle-pill (from shared.css)
h1 "Review [Action]" (swap-title style)
━━━ Summary card (swap-card style) ━━━
  [You give row]
    token icon (40px) | label + amount | USD value
  [Arrow down separator]
  [You receive row OR earning badge]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[Fee breakdown — swap-card style]
  Row: label (card-label style) | value
  Exchange rate / Network fee / Protocol fee / Total
[Warning (if any) — amber-tinted card]
[Confirm button — .primary-btn from shared.css]
[Cancel text link]
```

**CSS rules:**
- Sheet container: `position: fixed`, `bottom: 0`, `border-radius: 24px 24px 0 0`, `background: var(--bk-bg-elevated)`
- Summary and fee cards: `.swap-card` gradient + border-subtle
- `.card-label` for row labels (matches swap.css)
- `.primary-btn` from shared.css for CTA (gradient, 56px height, box-shadow)
- Rows inside cards: 12px font, `.card-bottom` style horizontal rule items

### 3.4 — SuccessScreen

**Files:** `src/SuccessScreen.jsx`, `src/success.css`

**Goal:** Full-screen animated celebration. Minimal, premium. No excess chrome.

**Structure:**
```
Centred content (full height flex column, justify: center)
  Animated SVG checkmark (circle + tick, brand purple)
  "Swap complete" — 28px, font-weight: 600
  Subtitle — card-label style
  [View in Activity] — .primary-btn
  [Back to Portfolio] — ghost button (same as close-btn but full width)
```

**CSS rules:**
- Full-screen, `background: var(--bk-bg-base)`
- Title: same scale/weight as `swap-title` but larger (26–28px)
- Buttons: `.primary-btn` for primary, transparent border button for secondary

### 3.5 — ActivityScreen

**Files:** `src/ActivityScreen.jsx`, `src/activity.css`

**Goal:** Clean transaction history. Group by date. Filter chips at top.

**Structure:**
```
StatusBar
Header: "Activity" (home-header style), filter icon button
Filter chips row (same .chain-pill / .chain-pill.active pattern from shared.css)
━━━ Scrollable list ━━━
  [Pending group — only if any]
  [Date groups: Today / Yesterday / Apr 7 etc]
    Group label (.portfolio-label style — 11px uppercase)
    Transaction rows:
      Action icon badge (32px, rounded, colour-coded)
      [Label + Amount] row
      [Detail + Chain pill] row
```

**CSS rules:**
- Filter chips: reuse `.chain-pill` / `.chain-pill.active` from shared.css
- Group labels: `.portfolio-label` pattern (11px, uppercase, letter-spacing)
- Row hover: `background: rgba(255,255,255,0.025)` — same as token-row feel
- Transaction icon badges: same colour coding as swipe actions (stake=brand, swap=purple, send=blue, receive=green, lend=deep purple)
- Chain badge: `.chain-pill` without active state, smaller (same shared.css pattern)

---

## Part 4: BottomNav

**File:** `src/BottomNav.jsx`

Ant's feedback: the Swap screen was good and should stay accessible. The nav had a distinctive FAB-style Swap button.

**Fix:** Restore the 4-tab layout with the FAB-style Actions button replacing Swap. The button should keep the `.nav-btn-swap` class (which gives it the gradient circle treatment from shared.css). The icon becomes `Zap` (Actions) instead of `ArrowRightLeft` (Swap). This preserves the visual hierarchy — one dominant action button in the nav.

```jsx
// 4 tabs: Home | Markets | [Actions FAB] | Activity
// Profile is accessible via Settings icon in the header, not nav
<nav className="bottom-nav">
  <Button className={`nav-btn${path === '/' ? ' active' : ''}`} onPress={() => navigate('/')}>
    <NavHome size={22} strokeWidth={1.5} />
  </Button>
  <Button className={`nav-btn${isActive('/explore') ? ' active' : ''}`} onPress={() => navigate('/explore')}>
    <NavExplore size={22} strokeWidth={1.5} />
  </Button>
  <Button className="nav-btn nav-btn-swap" aria-label="Actions" onPress={() => navigate('/actions')}>
    <Zap size={22} strokeWidth={1.5} />
  </Button>
  <Button className={`nav-btn${isActive('/activity') ? ' active' : ''}`} onPress={() => navigate('/activity')}>
    <Clock size={22} strokeWidth={1.5} />
  </Button>
</nav>
```

Remove the Profile tab — it doesn't have a screen yet. 4 tabs keeps the nav balanced.

---

## Part 5: Build & Deploy

After all changes:

```bash
cd ~/products/Modulo/React
npm run build
# Fix any compile errors
rsync -a --delete dist/ ~/products/Modulo/Prototype/modulo/
```

If build errors occur, fix them before deploying. Do not deploy a broken build.

---

## Summary checklist

- [ ] 1.1 Fix asset tap: `onClick` → `onTap` on draggable token-row
- [ ] 1.2 Wire swipe actions with navigation + 280ms delay
- [ ] 3.1 Rebuild AssetScreen — follow card, header, action-row, time-btn patterns
- [ ] 3.2 Rebuild ActionsScreen — use SwapContext in Swap tab, numpad for amounts, home.css tab pattern
- [ ] 3.3 Rebuild ReviewScreen — drag-handle, swap-card summary, primary-btn CTA
- [ ] 3.4 Rebuild SuccessScreen — animated checkmark, primary-btn, clean
- [ ] 3.5 Rebuild ActivityScreen — chain-pill filters, portfolio-label groups
- [ ] 4.0 Fix BottomNav — 4 tabs, Zap FAB, no Profile tab
- [ ] npm run build — zero errors
- [ ] Deploy to Prototype
