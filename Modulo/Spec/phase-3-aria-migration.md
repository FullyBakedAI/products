# Phase 3 — Full React ARIA Migration

**Working directory:** `/Users/Frank/products/Modulo/React`

## Goal

Replace inline button/input patterns in screen files with the extracted ARIA components. Every interactive element in every screen should use React ARIA primitives — either directly or via the extracted component library.

## What's already done (DO NOT re-do)

These components are extracted and ARIA-compliant:
- `ScreenHeader`, `AppButton`, `BottomSheet`, `TokenPill`, `TabSwitcher`, `FinancialInputCard`, `StatusCard`
- Some screens already import these

## Tasks

### 1. Fix TokenPill Lucide violation

`src/components/TokenPill/index.jsx` imports `ChevronDown` from `lucide-react`. Replace with an inline SVG:

```jsx
const IconChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
```

Remove the Lucide import entirely.

### 2. Migrate screen files to use React ARIA Button

For every screen file in `src/`, find native `<button onClick=...>` elements and replace with React ARIA `Button` with `onPress`. Import `Button` from `react-aria-components`.

**Exception — do NOT replace:**
- The action row buttons in `HomeScreen.jsx` (`.action-btn`) — these use native button intentionally to avoid a WebKit grid/flex collapse bug with `-webkit-user-select: none`. Leave them as `<button onClick>`.
- Any `<button>` inside a `motion.div` with drag active — use `onTap` not `onPress` for these (Framer Motion drag conflict). Check `SwapScreen.jsx` for these.

### 3. Migrate native `<input>` elements

For any bare `<input type="text|number">` in screen files (outside of already-extracted components), wrap with React ARIA `TextField` + `Input`. Import from `react-aria-components`.

Check: `SwapScreen.jsx`, `SendAmountScreen.jsx`, `SettingsScreen.jsx`

### 4. Extract AssetRow component

Pattern appears in: `ActivityScreen.jsx`, `AssetScreen.jsx`, `ManageScreen.jsx`

A row showing: token icon + token name/chain + amount + USD value. Sometimes has a right chevron.

Create `src/components/AssetRow/`:
- `index.jsx` — React ARIA component
- `styles.css` — `--bk-*` tokens only, scoped class names (`.asset-row-*`)

Props:
```jsx
<AssetRow
  icon={<img src="..." alt="" />}
  name="Ethereum"
  chain="Mainnet"
  amount="1.24 ETH"
  usdValue="$3,200"
  onPress={() => navigate('/asset')}  // optional — makes row tappable
/>
```

Use React ARIA `Button` if `onPress` is provided, otherwise a plain `div`.

### 5. Update `src/components/index.js`

Add `AssetRow` export alongside the 7 existing components.

### 6. Run `npm run build`

Zero errors. Zero Lucide imports in `src/components/`. Confirm with:
```
grep -r "lucide-react" src/components/
```
Should return nothing.

## Hard rules (same as always)

1. No Lucide in `src/components/` — inline SVGs only
2. No hardcoded hex anywhere — `--bk-*` tokens
3. No brand names in components
4. Scoped CSS class names in component files
5. `npm run build` must pass clean

## Definition of done

- [ ] TokenPill has no Lucide import
- [ ] All screen `<button onClick>` replaced with React ARIA `Button onPress` (except HomeScreen action row and Framer drag elements)
- [ ] AssetRow component extracted with props API
- [ ] `components/index.js` exports 8 components
- [ ] `grep -r "lucide-react" src/components/` returns nothing
- [ ] `npm run build` passes
