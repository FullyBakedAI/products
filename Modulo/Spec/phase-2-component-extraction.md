# Phase 2 — Component Extraction Sprint

**Working directory:** `/Users/Frank/products/Modulo/React`
**Sprint contract:** `Platform/ProductTeam/sprint-contracts/002-modulo-component-library.md`

## Context

Phase 1 extracted: `ScreenHeader`, `AppButton`, `BottomSheet`, `TokenPill`.
Phase 2 extracts the next 3 Priority 2 components + documentation.

All components live in `src/components/`. Each gets:
- `index.jsx` — React ARIA component, no Lucide imports, inline SVGs only
- `styles.css` — all values via `--bk-*` tokens, zero hardcoded hex
- Entry in `src/components/index.js`

## Components to Extract

### 1. TabSwitcher

**Source pattern:** Find the segmented tab control used in `SwapScreen.jsx`, `ActionsScreen.jsx`, `ExploreScreen.jsx` (look for `.tab`, `.tabs`, `.tab-switcher`, `.segment` CSS classes in those files and their CSS).

**API:**
```jsx
<TabSwitcher
  tabs={[{ id: 'swap', label: 'Swap' }, { id: 'buy', label: 'Buy' }]}
  activeTab="swap"
  onChange={(id) => setTab(id)}
/>
```

**Rules:**
- Use React ARIA `TabList` / `Tab` from `react-aria-components`
- Active state via `data-selected` attribute (React ARIA sets this automatically)
- No hardcoded colours — use `--bk-brand-primary`, `--bk-bg-card`, `--bk-text-primary`, `--bk-text-muted`, `--bk-border-subtle`
- Pill/capsule style background slider if the existing design uses one; otherwise simple underline

### 2. FinancialInputCard

**Source pattern:** Find the token amount input used in `SwapScreen.jsx` and `SendAmountScreen.jsx` — the card containing a token selector + numeric input + USD value display.

**API:**
```jsx
<FinancialInputCard
  label="You pay"
  amount={amount}
  onAmountChange={setAmount}
  token={selectedToken}
  onTokenSelect={() => openTokenPicker()}
  usdValue="$1,234.56"
/>
```

**Rules:**
- Use React ARIA `TextField` / `Input` for the numeric field
- Token selector is a `Button` (onPress) — does NOT open a picker internally, just calls `onTokenSelect`
- No Lucide. Use inline SVG for any chevron/arrow needed.
- `--bk-bg-card`, `--bk-border-card`, `--bk-text-primary`, `--bk-text-muted`, `--bk-text-placeholder` tokens

### 3. StatusCard

**Source pattern:** Find the status/result card used in `SuccessScreen.jsx`, `ReviewScreen.jsx` — the card showing a status icon + title + subtitle + optional detail rows.

**API:**
```jsx
<StatusCard
  status="success" // "success" | "pending" | "error"
  title="Swap complete"
  subtitle="0.5 ETH → 1,200 USDC"
  details={[
    { label: 'Fee', value: '$2.40' },
    { label: 'Time', value: '~12 sec' },
  ]}
/>
```

**Rules:**
- Status icons are inline SVGs (checkmark, clock, X)
- `--bk-success`, `--bk-error` for semantic colours. Pending uses `--bk-text-muted`.
- `--bk-bg-card`, `--bk-border-card` for the card surface

## After Extracting All 3

### Update `src/components/index.js`

Add exports for all 3 new components alongside existing Phase 1 exports. Update the comment header to list Phase 2 components.

### Create `src/components/README.md`

Document the full component API. For each component include:
- One-line description
- Props table (name | type | default | description)
- Usage example (JSX snippet)
- Token dependencies (which `--bk-*` vars it reads)

Format: clean markdown, engineering audience.

### Update imports in screens

Where TabSwitcher, FinancialInputCard, StatusCard patterns were extracted from — replace the inline implementation with the new component import. Check these files:
- `SwapScreen.jsx` → TabSwitcher + FinancialInputCard
- `SendAmountScreen.jsx` → FinancialInputCard
- `ActionsScreen.jsx` → TabSwitcher
- `ExploreScreen.jsx` → TabSwitcher
- `SuccessScreen.jsx` → StatusCard
- `ReviewScreen.jsx` → StatusCard

Only replace where the pattern is clearly a match. Don't force-fit.

## Hard Rules (non-negotiable)

1. **No Lucide in components/** — inline SVGs only, `aria-hidden="true"` on all SVGs
2. **No hardcoded hex** — every colour via `--bk-*` token
3. **No brand names in components** — no "Modulo" strings, no brand-specific copy
4. **React ARIA primitives** — Button→onPress, TextField→Input, TabList→Tab
5. **Scoped class names** — prefix all CSS classes with component name (e.g. `.tab-switcher-`, `.financial-input-`, `.status-card-`)
6. **Run `npm run build` at the end** — confirm zero errors before finishing

## Definition of Done

- [ ] 3 new component folders under `src/components/`
- [ ] Each has `index.jsx` + `styles.css`
- [ ] `src/components/index.js` exports all 7 components
- [ ] `src/components/README.md` documents all 7 components with props tables
- [ ] Screen files updated to use extracted components where pattern matched
- [ ] `npm run build` passes with zero errors
