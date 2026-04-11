# Component Extraction Audit
Generated: 2026-04-11 08:43
Source: /Users/Frank/products/Modulo/React/src
Model: gemma4:26b

---

## Summary
- JSX files analysed: 28
- Shared CSS class patterns found: 174
- Files with findings: 28

---

## Priority 1 — Extract First (foundation components used everywhere)
**IconButton** — Minimal circular button for compact actions — complexity: Low
  - Consolidates: `.icon-btn`
  - Props: `icon`, `onPress`, `variant`, `ariaLabel`

**ScreenHeader** — Standardized top navigation bar — complexity: Low
  - Consolidates: `achievements-header`, `achievements-title`
  - Props: `title`, `onBack`, `showBack`

**ScreenTransitionWrapper** — Motion-enabled container for entry/exit animations — complexity: Low
  - Consolidates: `.enter`, `.offsetExit`, `.screen-wrapper`
  - Props: `variant`, `children`

**TabSwitcher** — Segmented control for navigation toggles — complexity: Low
  - Consolidates: `tab-switcher-track`, `tab-switcher-item`, `tab-switcher-active`
  - Props: `tabs`, `activeTab`, `onTabChange`

## Priority 2 — Extract Second (screen-level patterns)
**FinancialInputCard** — Structured container for transaction amount and token selection — complexity: Medium
  - Consolidates: `.swap-card`, `.card-label`, `.card-bottom`, `.amount-text`, `.card-middle`
  - Props: `label`, `amount`, `subtext`, `variant`, `children`

**BottomSheet** — Animated slide-up drawer for context-specific actions — complexity: Medium
  - Consolidates: `.drag-handle`, `.drag-handle-pill`, `.action-sheet-container`, `.action-sheet-content`
  - Props: `isOpen`, `onClose`, `children`, `dragHandle`

**TokenPill** — Interactive button representing a cryptocurrency — complexity: Low
  - Consolidates: `.token-pill-btn`, `.token-icon`, `.token-name`, `.token-chevron`
  - Props: `token`, `onPress`, `side`

**StatusCard** — Versatile card for displaying achievement or asset states — complexity: Medium
  - Consolidates: `.achievement-card`, `.locked`, `.earned`, `.achievement-card-title`
  - Props: `icon`, `title`, `description`, `status`, `subtext`

## Priority 3 — Extract Later (specialised/single-use)
**Numpad** — Standardized numeric grid for manual amount entry — complexity: Medium
  - Consolidates: `.numpad`, `.numpad-key-btn`
  - Props: `onKey`, `keys`, `theme`

**TransactionHero** — High-emphasis visual area for transaction details — complexity: Medium
  - Consolidates: `.tx-detail-focal`, `.tx-detail-icons`, `.tx/detail-icon2`
  - Props: `amount`, `isPositive`, `detailText`, `icons`

---

## Raw: Most Repeated CSS Classes

| Class | Appears In |
|-------|-----------|
| `.offsetExit` | AchievementsScreen.jsx, ActivityScreen.jsx, App.jsx, AssetScreen.jsx, AutopilotScreen.jsx, OptimiseScreen.jsx, ReceiveScreen.jsx, SendAmountScreen.jsx, SendScreen.jsx, SettingsScreen.jsx, SimulateScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx |
| `.enter` | AchievementsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, AutopilotScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx, ReceiveScreen.jsx, SendScreen.jsx, SimulateScreen.jsx, SuccessScreen.jsx, UndoToast.jsx |
| `.scroll-content` | AchievementsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, AutopilotScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx, ReceiveScreen.jsx, SettingsScreen.jsx, SimulateScreen.jsx |
| `.icon-btn` | AchievementsScreen.jsx, ActivityScreen.jsx, AutopilotScreen.jsx, HomeScreen.jsx, SettingsScreen.jsx, SimulateScreen.jsx |
| `.drag-handle` | ActionsScreen.jsx, ActivityScreen.jsx, ReceiveScreen.jsx, ReviewScreen.jsx, SendScreen.jsx, SwapSelectScreen.jsx |
| `.drag-handle-pill` | ActionsScreen.jsx, ActivityScreen.jsx, ReceiveScreen.jsx, ReviewScreen.jsx, SendScreen.jsx, SwapSelectScreen.jsx |
| `.card-label` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ReviewScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx |
| `.2` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, ReviewScreen.jsx |
| `.8` | ActionsScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, OptimiseScreen.jsx, SuccessScreen.jsx |
| `.token-amount` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx |
| `.token-name-text` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx |
| `.card-bottom` | ActionsScreen.jsx, ActivityScreen.jsx, ReviewScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx |
| `.primary-btn` | OptimiseScreen.jsx, ReceiveScreen.jsx, ReviewScreen.jsx, SimulateScreen.jsx, SuccessScreen.jsx |
| `.portfolio-label` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, HomeScreen.jsx |
| `.close-btn-shared` | ActionsScreen.jsx, SendAmountScreen.jsx, SendScreen.jsx, SwapSelectScreen.jsx |
| `.swap-card` | ActionsScreen.jsx, ReviewScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx |
| `.6` | AssetScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx, main.jsx |
| `.38` | AssetScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx, SimulateScreen.jsx |
| `.amount-text` | ActionsScreen.jsx, AssetScreen.jsx, SwapScreen.jsx |
| `.symbol` | ActionsScreen.jsx, SendAmountScreen.jsx, SwapScreen.jsx |
| `.icon` | ActionsScreen.jsx, SendAmountScreen.jsx, SwapScreen.jsx |
| `.swap-cards` | ActionsScreen.jsx, ReviewScreen.jsx, SwapScreen.jsx |
| `.swap-amount` | ActionsScreen.jsx, AssetScreen.jsx, SwapScreen.jsx |
| `.chain-pill` | ActivityScreen.jsx, AssetScreen.jsx, SendScreen.jsx |
| `.98` | AssetScreen.jsx, SendAmountScreen.jsx, SimulateScreen.jsx |
