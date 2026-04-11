## Session: 2026-04-11 — Phase 3 React ARIA Migration

### What was built/fixed
- **TokenPill Lucide fix:** Removed `ChevronDown` from `lucide-react`, replaced with inline `IconChevronDown` SVG. `src/components/` now has zero Lucide imports.
- **AssetRow component extracted:** `src/components/AssetRow/index.jsx` + `styles.css`. React ARIA `Button` when `onPress` provided, plain `div` otherwise. Props: `icon`, `name`, `chain`, `amount`, `usdValue`, `onPress`.
- **index.js updated:** 8 exports, Phase 3 section added in JSDoc header.
- **Build passes clean:** `npm run build` ✓ zero errors.

### Decisions made (and why)
- **HomeScreen action row left as native `<button onClick>`:** Spec requires this — WebKit bug collapses grid/flex items when `-webkit-user-select: none` is applied to React ARIA Button in that layout.
- **No bare `<input>` migrations needed:** Full audit confirmed all screen files already use React ARIA TextField/Input or custom numpad Button patterns.
- **All other screens already migrated:** ExploreScreen, ActivityScreen, SwapScreen, SendAmountScreen, SettingsScreen, AssetScreen, ManageScreen all use `Button` from `react-aria-components` with `onPress` throughout.
- **AssetRow tappable uses negative margin:** `padding: 12px; margin: 0 -12px` pattern makes hit target full-width without affecting layout flow.

### Bugs found — root causes
- None new. Pre-existing chunk size warning (1.7MB) is not Phase 3 related.

### Patterns to reuse next time
- `motion.create(Button)` — correct Framer Motion + React ARIA composition.
- Inline SVG: `const IconFoo = () => <svg aria-hidden="true">...</svg>` scoped to component file.
- React ARIA state via CSS: `[data-hovered]`, `[data-focused]`, `[data-pressed]`.

### Open threads / next session
- AssetRow extracted but not yet consumed by screen files (ActivityScreen, AssetScreen) — Phase 4 screen-level refactor opportunity.
- Bundle size (1.7MB) — lightweight-charts + framer-motion likely main contributors, worth code-splitting investigation.
- ManageScreen has no AssetRow-like pattern (shows action cards, not asset list rows).

---

## Session: 2026-04-11 — Phase 2 Component Extraction

### What was built/fixed

**3 new components extracted to `React/src/components/`:**

- **TabSwitcher** (`TabSwitcher/index.jsx` + `styles.css`)
  - React ARIA `Tabs` + `TabList` + `Tab` primitives
  - Controlled via `activeTab` / `onChange` props
  - Underline active indicator via `[data-selected]` + `::after`
  - Scoped class prefix: `.tab-switcher-`

- **FinancialInputCard** (`FinancialInputCard/index.jsx` + `styles.css`)
  - React ARIA `TextField` + `Input` for the numeric field (`inputMode="decimal"`)
  - Token selector is a plain `Button` (onPress) — no internal picker
  - Inline SVG chevron — no Lucide
  - Scoped class prefix: `.financial-input-`

- **StatusCard** (`StatusCard/index.jsx` + `styles.css`)
  - Inline SVG icons for success (green checkmark circle), pending (clock), error (red X)
  - All props optional — gracefully omits empty sections
  - Scoped class prefix: `.status-card-`

**`src/components/index.js` updated** — exports all 7 components with Phase 1/2 comment header.

**`src/components/README.md` created** — documents all 7 components with props tables, usage examples, token dependency lists.

**Screen updates:**
- `ExploreScreen.jsx` → market tabs replaced with `<TabSwitcher>`
- `SendAmountScreen.jsx` → inline amount display replaced with `<FinancialInputCard>`; balance row + error kept as screen-specific elements below the card
- `SuccessScreen.jsx` → `swap-card success-summary-card` replaced with `<StatusCard status="success" details={[...]} />`; animated `SuccessCheck` retained above (too specific to genericise)

**ReviewScreen.jsx** — not updated. Asset-in/asset-out card layout with Lucide icons doesn't match StatusCard. Tagged as out-of-scope per "don't force-fit" rule.

**ActionsScreen.jsx** — not updated. Tab navigation uses a cycle-button pattern (`actions-cycle-btn`), not a tablist. Buy/Sell toggle is a segmented directional control, not content tabs.

**Build:** `npm run build` passes, zero errors. Bundle size warning is pre-existing.

### Decisions made (and why)

- Used `Tabs` + `TabList` + `Tab` from react-aria-components (no `TabPanel`) — for filter-style tabs the parent manages content; `TabPanel` adds complexity without benefit here.
- Made all StatusCard props optional — supports both the full status card (icon + title + subtitle + rows) and the details-only variant used in SuccessScreen.
- SendAmountScreen balance row kept outside FinancialInputCard — balance + MAX button are send-flow-specific, not part of the generic amount-entry pattern.
- SuccessScreen retained animated `SuccessCheck` component — the motion.svg animated checkmark is specific enough that wrapping it inside StatusCard would break the animation or require a custom-icon prop beyond spec.

### Bugs found — root causes

- TokenPill in `components/TokenPill/index.jsx` uses Lucide `ChevronDown` — violates component rules. Not fixed this session (Phase 1 artefact). Flag for Phase 3 cleanup.

### Patterns to reuse next time

- Inline chevron SVG pattern from FinancialInputCard: `<polyline points="2,4 6,8 10,4" .../>` — use for any dropdown indicator going forward.
- `[data-selected]::after` pattern in TabSwitcher for underline indicators — reuse in any nav-style tab.
- `TextField` + `Input` with `inputMode="decimal"` for any financial input field.

### Open threads / next session

- **TokenPill Lucide violation** — replace `ChevronDown` import with inline SVG (same polyline as FinancialInputCard).
- **ReviewScreen** — needs a proper asset-row component extraction (from/to layout with token icon + amount + USD).
- **ActionsScreen tabs** — the `trade-direction-tabs` / `trade-dir-tab` Buy/Sell toggle could become a `SegmentedControl` component in Phase 3.
- Design system page (`/ds`) — should showcase TabSwitcher, FinancialInputCard, StatusCard in the BrandTab or new StudioTab section.
