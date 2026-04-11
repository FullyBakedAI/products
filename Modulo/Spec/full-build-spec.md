# Modulo Full Build — React ARIA Component System + White-Label Architecture

This is the Claude Code build spec for the next major phase of Modulo. It is detailed enough to execute without asking questions.

---

## Objective

End-to-end build of Modulo using a white-label React ARIA component library. The component library (BakeKit/Modulo) is the primary deliverable — the Modulo product is built on top of it. Components must be themed via a BrandProvider, not hardcoded to Modulo.

---

## Current State

- 18 screens roughed in at prototype quality
- Components are inline — no extraction yet
- 4 React Contexts for state
- design-manifest.json + Skills/ docs are the source of truth
- All tokens via --bk-* CSS custom properties

---

## Target Architecture

```
React/src/
├── components/          ← WHITE-LABEL LIBRARY (the deliverable)
│   ├── AppButton/       ← index.jsx + styles.css
│   ├── Card/
│   ├── TokenListItem/
│   ├── ActionBar/       ← 4-button action row
│   ├── BottomNav/
│   ├── SearchInput/
│   ├── PillFilter/
│   ├── SwapCard/
│   ├── ScreenHeader/    ← back/close + title
│   ├── PriceDisplay/    ← large price with cents
│   ├── YieldBar/
│   ├── ChainPill/
│   └── index.js         ← public API re-exports
├── theme/
│   ├── ThemeProvider.jsx
│   ├── modulo-theme.js  ← Modulo brand config
│   └── theme-types.js   ← Theme shape (jsdoc)
└── [screens]            ← product layer, consumes components
```

---

## Phase 1: ThemeProvider + Token System

Create `theme/ThemeProvider.jsx` that accepts a brand config object and maps it to CSS custom properties via a style tag injected at root.

`modulo-theme.js` must define the following tokens:

| Token | Purpose |
|-------|---------|
| primaryColor | Primary action colour |
| gradientStart | Gradient start (hero elements) |
| gradientEnd | Gradient end |
| bgBase | Root background |
| bgCard | Card background |
| bgElevated | Elevated surface |
| bgNav | Bottom nav background |
| bgCardAlt | Alternate card background |
| textPrimary | Primary text |
| textSecondary | Secondary text |
| textMuted | Muted/dim text |
| borderSubtle | Subtle border |
| success | Success state |
| error | Error/destructive state |
| statusBarDim | Status bar overlay dim |
| fontFamily | Primary typeface |
| brandName | String — product name |
| logoSrc | Path to logo asset |

ThemeProvider wraps the app and applies all tokens as --bk-* CSS custom properties. This makes the whole product skinnable by swapping the theme config.

---

## Phase 2: Component Library Extraction

For each component: what it is, which existing CSS classes it consolidates, what props it takes, and the React ARIA primitive it uses.

**12 components total:**

### 1. AppButton
Consolidates `.primary-btn`, `.action-btn`, `.close-btn-shared`.

Props:
- `variant` — `primary | action | close | icon`
- `size` — `sm | md | lg`
- `onPress` — React ARIA press handler
- `isDisabled` — boolean
- `children`
- `aria-label` — required when no visible text

React ARIA primitive: `Button`

---

### 2. Card
Consolidates `.swap-card`, `.asset-active-card`, `.asset-opp-row`.

Props:
- `variant` — `default | elevated | interactive`
- `onPress` — optional; makes the card interactive
- `children`

React ARIA primitive: `Button` (when interactive), `div` (when static)

---

### 3. ScreenHeader
Consolidates the swap-header pattern across screens.

Props:
- `title` — string
- `titleIcon` — optional ReactNode
- `onBack` — optional; renders back chevron
- `onClose` — optional; renders close button
- `rightSlot` — optional ReactNode for custom right-side content
- `transparent` — boolean; for hero/overlay screens

React ARIA primitive: `Heading`, `Button` for back/close

---

### 4. TokenListItem
Consolidates token-row + swipe actions.

Props:
- `token` — token data object (symbol, name, balance, value, yield, chain)
- `onPress` — press handler
- `swipeActions` — optional array of `{id, label, icon, onPress, variant}`
- `showYield` — boolean

React ARIA primitive: `Button` (row), listitem context

---

### 5. ActionBar
Consolidates `.action-row` + 4 `.action-btn` layout.

Props:
- `actions` — array of `{id, label, icon, onPress}`

React ARIA primitive: `Button` per action, toolbar role on container

---

### 6. BottomNav
Already extracted — needs theme awareness added.

Props:
- `items` — array of `{id, label, icon, route}`
- `activeItem` — string id
- `onItemPress` — handler
- `centerAction` — optional config for the centre FAB slot

React ARIA primitive: `nav`, `Button` per item

---

### 7. SearchInput
Consolidates `.search-field`.

Props:
- `placeholder` — string
- `onPress` — for tap-to-open sheet behaviour
- `value` — controlled value
- `onChange` — change handler

React ARIA primitive: `SearchField` or `TextField`

---

### 8. PillFilter
Consolidates `.chain-pill` + `.pill`.

Props:
- `label` — string
- `icon` — optional ReactNode
- `active` — boolean
- `onPress` — handler

React ARIA primitive: `ToggleButton`

---

### 9. PriceDisplay
New component — no existing equivalent.

Props:
- `value` — number
- `currency` — string (default: 'USD')
- `size` — `large | medium | small`
- `animated` — boolean; springs in on mount

React ARIA primitive: none (presentational); `aria-label` with full value string

---

### 10. YieldBar
Consolidates `.token-yield-track` + `.token-yield-fill`.

Props:
- `percentage` — number (0–100)
- `maxPercentage` — number (for scale reference)
- `animated` — boolean

React ARIA primitive: `ProgressBar` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

---

### 11. ChainPill
Already in shared.css — needs extraction as a proper component.

Props:
- `chain` — string id
- `active` — boolean
- `onPress` — handler

React ARIA primitive: `ToggleButton`

---

### 12. SwapCard
Consolidates the swap screen card pattern.

Props:
- `children`
- `variant` — `default | compact`

React ARIA primitive: none (container); `section` with appropriate landmark

---

## Phase 3: Screen Rebuild

After the component library is complete, rebuild each screen using extracted components only. No inline patterns.

Priority order:

1. HomeScreen — most complex, proves the library end-to-end
2. SwapScreen + SwapSelectScreen
3. AssetScreen
4. SendScreen + SendAmountScreen
5. ReceiveScreen
6. ActivityScreen
7. ActionsScreen
8. OptimiseScreen
9. ReviewScreen → SuccessScreen
10. All remaining screens

Each screen rebuild must:
- Import from `components/` — no inline style blocks replicating component patterns
- Consume ThemeProvider tokens via CSS custom properties
- Pass accessibility checks (keyboard nav, focus management, ARIA roles)

---

## Phase 4: Documentation Updates

These files MUST be updated before the phase is considered complete:

- `Modulo/Skills/components.md` — full component API for every extracted component (props, variants, usage example)
- `Modulo/Skills/agent-context.md` — updated import paths, component availability
- `Modulo/design-manifest.json` — add component registry section listing all 12 components with their prop shapes
- `Modulo/CLAUDE.md` — update architecture section to reflect new component structure

---

## Phase 5: Design System Page

Update `DesignSystemPage.jsx` to showcase all 12 components in the Studio tab with:
- Live component renders (not screenshots)
- All variants shown for each component
- Live theme switching demo — button or toggle that swaps the active theme config and rebrands the full page in real time

---

## Hard Rules — Do Not Break

- All tokens via `--bk-*` CSS custom properties — zero hardcoded hex values anywhere
- React ARIA `Button` with `onPress` on all interactive elements — never `onClick` on interactive UI
- `onTap` not `onClick` on draggable `motion.div` elements (onClick silently fails on mobile when drag is active)
- No `navigate(-1)` — always explicit named routes
- `box-sizing: border-box` on any element using `height: 100%` with `padding-top`
- Never add `-webkit-user-select: none` to button elements (WebKit grid-collapse bug — see comment in shared.css)
- WCAG 2.1 AA minimum across all components and screens

---

## Definition of Done

- All 12 components exist in `components/` with their own `index.jsx` + `styles.css`
- ThemeProvider accepts a brand config object and applies all tokens as CSS custom properties
- Swapping `modulo-theme.js` for a different config object visually rebrands the entire product
- All screens rebuilt using `components/` — no inline patterns remaining
- `Skills/components.md` updated with full API documentation for all 12 components
- Design system page shows live component demos with working theme switcher
