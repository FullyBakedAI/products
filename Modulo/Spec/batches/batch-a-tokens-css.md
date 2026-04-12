# Batch A — CSS Tokens & Design System Fixes
**Source:** QA Sprint QA-001, Wave 2  
**Files:** tokens.css, shared.css, explore.css, desktop.css, actions.css  
**Instruction:** Make all changes below. Read each file before editing. Do not change anything not listed. Build must pass (no CSS errors).

---

## MOD-026 — Hardcoded rgba opacity values → tokens

**File:** `src/tokens.css` — add to `:root` block:
```
--bk-white-05: rgba(255,255,255,0.05);
--bk-white-07: rgba(255,255,255,0.07);
--bk-white-08: rgba(255,255,255,0.08);
--bk-white-12: rgba(255,255,255,0.12);
--bk-white-15: rgba(255,255,255,0.15);
--bk-white-20: rgba(255,255,255,0.20);
```

Then grep through `actions.css`, `shared.css`, `review.css` and replace every `rgba(255,255,255,X)` with the corresponding token above. Use the closest match. Do not change values that are clearly intentional one-offs with no token match.

---

## MOD-035 — Z-index scale → tokens

**File:** `src/tokens.css` — add to `:root` block:
```
--bk-z-base: 1;
--bk-z-card: 2;
--bk-z-overlay: 10;
--bk-z-modal: 20;
--bk-z-toast: 30;
```

Then replace hardcoded `z-index` values across `shared.css`, `home.css`, `actions.css`, `desktop.css`:
- `z-index: 1` → `z-index: var(--bk-z-base)`
- `z-index: 2` → `z-index: var(--bk-z-card)` (if it's a card layering context)
- `z-index: 10` → `z-index: var(--bk-z-overlay)`
- `z-index: 20` → `z-index: var(--bk-z-modal)` (only if clearly a modal)

Do NOT change `z-index: auto` or negative z-index values.

---

## MOD-061 — Swipe action colours → tokens

**File:** `src/tokens.css` — add to `:root` block after existing brand tokens:
```
--bk-action-swap: var(--bk-brand-primary);
--bk-action-lend: color-mix(in srgb, var(--bk-brand-primary) 72%, #1a1a40 28%);
--bk-action-trade: color-mix(in srgb, var(--bk-brand-primary) 55%, #1a1a40 45%);
```

**File:** `src/home.css` — find the `.swipe-swap`, `.swipe-lend`, `.swipe-trade` background rules and replace their `color-mix()` or `var(--bk-brand-primary)` values with the corresponding `--bk-action-*` tokens above.

---

## MOD-064 — Buy/Sell toggle direction tokens

**File:** `src/tokens.css` — add to `:root`:
```
--bk-dir-buy: var(--bk-success);
--bk-dir-sell: var(--bk-error);
```

**File:** `src/actions.css` — find `.dir-buy-active` and `.dir-sell-active` rules. Replace any `color-mix()` using `--bk-success` with one using `--bk-dir-buy`, and `--bk-error` with `--bk-dir-sell`. Pattern example: `color-mix(in srgb, var(--bk-dir-buy) 18%, transparent 82%)`.

---

## MOD-027 — Missing focus/hover states on Explore rows and sort controls

**File:** `src/explore.css` — add these rules:
```css
.token-row-explore[data-focused] {
  outline: 2px solid var(--bk-brand-primary);
  outline-offset: -2px;
  border-radius: 12px;
}

.sort-btn[data-focused] {
  outline: 2px solid var(--bk-brand-primary);
  outline-offset: 2px;
}
```

---

## MOD-029 — Inconsistent active state patterns

**File:** `src/shared.css` — add a utility class:
```css
.btn-active {
  background: var(--bk-brand-primary);
  color: #fff;
  font-weight: 600;
}
```

Do NOT change existing active state classes on individual components — this is just adding the utility. Do not refactor all active states now; that's a larger task.

---

## MOD-031 — Desktop padding has no tablet transition zone

**File:** `src/desktop.css` — add a new media query breakpoint for tablet:
```css
@media (min-width: 768px) and (max-width: 1023px) {
  .screen-max-width,
  .home-content,
  .explore-content,
  .actions-content,
  .asset-content {
    padding-left: 24px;
    padding-right: 24px;
  }
}
```

If the class names are different, find the equivalent container classes in desktop.css and apply the 24px padding override.

---

## MOD-059 — Screen header base class

**File:** `src/shared.css` — add:
```css
.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 52px;
  flex-shrink: 0;
}
```

Do NOT refactor existing headers to use this class. Just add the base class to shared.css so it's available.

---

## MOD-060 — Primary CTA button two heights

**File:** `src/shared.css` — find `.primary-btn` rule. Confirm it is at `height: 56px`. Add a modifier class below it:
```css
.primary-btn--compact {
  height: 48px;
}
```

**File:** `src/actions.css` — find any `!important` height overrides on `.primary-btn` and remove the `!important` flags. If the intent was a 48px height, change the class reference to `.primary-btn--compact` instead.

---

## MOD-082 — Manage screen grid not responsive

**File:** `src/tokens.css` — add:
```
--bk-manage-grid-cols: 2;
```

**File:** `src/actions.css` — find the `.manage-grid` (or equivalent) rule with `grid-template-columns: repeat(2, 1fr)`. Change to `grid-template-columns: repeat(var(--bk-manage-grid-cols), 1fr)`.

**File:** `src/desktop.css` — in the desktop media query, add:
```css
--bk-manage-grid-cols: 4;
```
(Inside the `:root` or the appropriate container override.)

---

After all changes: run `npm run build` to confirm zero errors.
