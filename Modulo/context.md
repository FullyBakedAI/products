# Modulo Build Session Notes

## Session: 2026-04-11 — Phase 1: ThemeProvider + Component Library Foundation

### What was built/fixed

**Theme System (White-Label Architecture):**
- Created `React/src/theme/ThemeProvider.jsx` — BrandProvider component that accepts a theme config and injects all --bk-* CSS custom properties via a style tag at document root
- Created `React/src/theme/modulo-theme.js` — Modulo brand configuration mapping all token values to JS keys
- Created `React/src/theme/theme-types.js` — JSDoc typedef for the BakeKitTheme shape
- Updated `React/src/main.jsx` to wrap the entire app in BrandProvider with moduloTheme

**Component Library (4 Priority 1 Components):**
- Created `React/src/components/ScreenHeader/` — Standardized top navigation bar with back/close buttons, title, and rightSlot. Consolidates the header pattern used across 10+ screens.
- Created `React/src/components/AppButton/` — React ARIA Button wrapper with variants (primary, action, icon, close). Consolidates .primary-btn, .action-btn, .icon-btn patterns.
- Created `React/src/components/BottomSheet/` — Animated slide-up drawer with drag handle and overlay. Used in swap, send, receive, review, actions screens.
- Created `React/src/components/TokenPill/` — Interactive token selector pill. Consolidates .token-pill-btn pattern.
- Created `React/src/components/index.js` — Public API re-exports for all 4 components

**SwapScreen Rebuild:**
- Refactored `React/src/SwapScreen.jsx` to use ScreenHeader and TokenPill from the component library
- Removed inline SwapHeader and TokenPill sub-components
- Proof that the library works end-to-end

### Decisions made (and why)

**ThemeProvider Implementation:**
- Used a style tag injection approach (not React context) because CSS custom properties need to be at :root for global cascading
- Theme provider wraps at the top level (above all other providers) to ensure tokens are available before any component renders
- Chose to inject via useEffect rather than SSR approach because this is a SPA with no SSR requirements

**Component Structure:**
- Each component gets its own directory with index.jsx + styles.css (not CSS modules) to match the existing Modulo pattern
- Components accept theme via --bk-* tokens (not direct theme object props) to maintain clean separation between JS and CSS
- All components use React ARIA primitives (Button, Dialog) for accessibility — never native HTML elements for interactive UI

**ScreenHeader API:**
- Added `rightSlot` prop instead of hardcoding settings button — makes the component more flexible for different screens
- Kept onBack and onClose separate (not a single onNav prop) because some screens need back, some need close, some need both
- `transparent` variant for hero/overlay screens where border would interfere with visual design

**TokenPill API:**
- Normalized token shape to `{ id, name, icon }` rather than using raw swap context shape — decouples the component from specific data structures
- Added `appear` animation prop (optional) for screens that want the spring-in effect
- Used motion.create(Button) wrapper for whileTap animation while maintaining React ARIA accessibility

### Bugs found — root causes

None encountered. Build succeeded on first run.

### Patterns to reuse next time

**Component Extraction Checklist:**
1. Identify the CSS classes being consolidated
2. Map props to React ARIA primitives (Button, Dialog, etc.)
3. Move all styles to component-local styles.css
4. Use --bk-* tokens exclusively (no hardcoded hex)
5. Add proper ARIA labels and roles
6. Export from components/index.js
7. Test in at least one screen before marking complete

**White-Label Theme Pattern:**
- Theme config as plain JS object (not React context)
- ThemeProvider injects CSS custom properties at :root
- Components never reference theme object directly — always via CSS tokens
- Swapping theme file = instant rebrand

**Motion + React ARIA Pattern:**
```jsx
const MotionButton = motion.create(Button);
<MotionButton whileTap={{ scale: 0.93 }} onPress={handler}>
```
This preserves accessibility while adding motion.

### Open threads / next session

**Immediate Next Steps (Phase 2):**
1. Extract remaining Priority 2 components:
   - Card (consolidates .swap-card, .asset-active-card, .asset-opp-row)
   - ActionBar (4-button action row)
   - SearchInput (consolidates .search-field)
   - PillFilter (consolidates .chain-pill + .pill)

2. Refactor more screens to use the component library:
   - SendScreen (uses ScreenHeader + BottomSheet pattern)
   - ReceiveScreen (uses ScreenHeader + BottomSheet)
   - AchievementsScreen (uses ScreenHeader pattern)
   - ActionsScreen (uses BottomSheet + TokenPill)

**Component Library Validation:**
- Verify BottomSheet works in all 6 screens that use drag-handle pattern
- Test ScreenHeader across all modal screens (AutopilotScreen, OptimiseScreen, SimulateScreen, etc.)
- Ensure AppButton covers all button variants across the app

**Documentation Debt:**
- Update `Skills/components.md` with full API docs for all 4 extracted components
- Update `Skills/agent-context.md` with new import paths
- Update `design-manifest.json` with component registry

**Known Gaps:**
- swap.css still contains styles for .close-btn, .settings-btn, .token-pill-btn — these can be cleaned up after confirming no other screens depend on them
- Some screens still use inline close buttons (SendScreen, ActionsScreen) — these should migrate to AppButton variant="close"
