# Component Extraction Audit
Generated: 2026-04-11 08:14
Source: /Users/Frank/products/Modulo/React/src
Model: gemma4:26b

---

## Summary
- JSX files analysed: 28
- Shared CSS class patterns found: 174
- Files with findings: 0

---

## Repeated CSS Patterns (quick scan)

- `.offsetExit`: AchievementsScreen.jsx, ActivityScreen.jsx, App.jsx, AssetScreen.jsx, AutopilotScreen.jsx, OptimiseScreen.jsx, ReceiveScreen.jsx, SendAmountScreen.jsx, SendScreen.jsx, SettingsScreen.jsx, SimulateScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx
- `.enter`: AchievementsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, AutopilotScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx, ReceiveScreen.jsx, SendScreen.jsx, SimulateScreen.jsx, SuccessScreen.jsx, UndoToast.jsx
- `.scroll-content`: AchievementsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, AutopilotScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx, ReceiveScreen.jsx, SettingsScreen.jsx, SimulateScreen.jsx
- `.icon-btn`: AchievementsScreen.jsx, ActivityScreen.jsx, AutopilotScreen.jsx, HomeScreen.jsx, SettingsScreen.jsx, SimulateScreen.jsx
- `.drag-handle-pill`: ActionsScreen.jsx, ActivityScreen.jsx, ReceiveScreen.jsx, ReviewScreen.jsx, SendScreen.jsx, SwapSelectScreen.jsx
- `.drag-handle`: ActionsScreen.jsx, ActivityScreen.jsx, ReceiveScreen.jsx, ReviewScreen.jsx, SendScreen.jsx, SwapSelectScreen.jsx
- `.card-label`: ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ReviewScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx
- `.card-bottom`: ActionsScreen.jsx, ActivityScreen.jsx, ReviewScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx
- `.2`: ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, ReviewScreen.jsx
- `.token-amount`: ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx
- `.8`: ActionsScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, OptimiseScreen.jsx, SuccessScreen.jsx
- `.token-name-text`: ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx
- `.primary-btn`: OptimiseScreen.jsx, ReceiveScreen.jsx, ReviewScreen.jsx, SimulateScreen.jsx, SuccessScreen.jsx
- `.portfolio-label`: ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, HomeScreen.jsx
- `.swap-card`: ActionsScreen.jsx, ReviewScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx
- `.close-btn-shared`: ActionsScreen.jsx, SendAmountScreen.jsx, SendScreen.jsx, SwapSelectScreen.jsx
- `.38`: AssetScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx, SimulateScreen.jsx
- `.6`: AssetScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx, main.jsx
- `.symbol`: ActionsScreen.jsx, SendAmountScreen.jsx, SwapScreen.jsx
- `.swap-cards`: ActionsScreen.jsx, ReviewScreen.jsx, SwapScreen.jsx
- `.swap-amount`: ActionsScreen.jsx, AssetScreen.jsx, SwapScreen.jsx
- `.icon`: ActionsScreen.jsx, SendAmountScreen.jsx, SwapScreen.jsx
- `.amount-text`: ActionsScreen.jsx, AssetScreen.jsx, SwapScreen.jsx
- `.chain-pill`: ActivityScreen.jsx, AssetScreen.jsx, SendScreen.jsx
- `.75`: AssetScreen.jsx, SendAmountScreen.jsx, SimulateScreen.jsx
- `.82`: AssetScreen.jsx, ExploreScreen.jsx, SimulateScreen.jsx
- `.swap-screen-inner`: AssetScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx
- `.98`: AssetScreen.jsx, SendAmountScreen.jsx, SimulateScreen.jsx
- `.00`: AssetScreen.jsx, ExploreScreen.jsx, SendAmountScreen.jsx
- `.46`: AssetScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx


---

## Raw: Most Repeated CSS Classes

| Class | Appears In |
|-------|-----------|
| `.offsetExit` | AchievementsScreen.jsx, ActivityScreen.jsx, App.jsx, AssetScreen.jsx, AutopilotScreen.jsx, OptimiseScreen.jsx, ReceiveScreen.jsx, SendAmountScreen.jsx, SendScreen.jsx, SettingsScreen.jsx, SimulateScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx |
| `.enter` | AchievementsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, AutopilotScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx, ReceiveScreen.jsx, SendScreen.jsx, SimulateScreen.jsx, SuccessScreen.jsx, UndoToast.jsx |
| `.scroll-content` | AchievementsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, AutopilotScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx, ReceiveScreen.jsx, SettingsScreen.jsx, SimulateScreen.jsx |
| `.icon-btn` | AchievementsScreen.jsx, ActivityScreen.jsx, AutopilotScreen.jsx, HomeScreen.jsx, SettingsScreen.jsx, SimulateScreen.jsx |
| `.drag-handle-pill` | ActionsScreen.jsx, ActivityScreen.jsx, ReceiveScreen.jsx, ReviewScreen.jsx, SendScreen.jsx, SwapSelectScreen.jsx |
| `.drag-handle` | ActionsScreen.jsx, ActivityScreen.jsx, ReceiveScreen.jsx, ReviewScreen.jsx, SendScreen.jsx, SwapSelectScreen.jsx |
| `.card-label` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ReviewScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx |
| `.card-bottom` | ActionsScreen.jsx, ActivityScreen.jsx, ReviewScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx |
| `.2` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, ReviewScreen.jsx |
| `.token-amount` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx |
| `.8` | ActionsScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, OptimiseScreen.jsx, SuccessScreen.jsx |
| `.token-name-text` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx |
| `.primary-btn` | OptimiseScreen.jsx, ReceiveScreen.jsx, ReviewScreen.jsx, SimulateScreen.jsx, SuccessScreen.jsx |
| `.portfolio-label` | ActionsScreen.jsx, ActivityScreen.jsx, AssetScreen.jsx, HomeScreen.jsx |
| `.swap-card` | ActionsScreen.jsx, ReviewScreen.jsx, SuccessScreen.jsx, SwapScreen.jsx |
| `.close-btn-shared` | ActionsScreen.jsx, SendAmountScreen.jsx, SendScreen.jsx, SwapSelectScreen.jsx |
| `.38` | AssetScreen.jsx, ExploreScreen.jsx, HomeScreen.jsx, SimulateScreen.jsx |
| `.6` | AssetScreen.jsx, HomeScreen.jsx, OptimiseScreen.jsx, main.jsx |
| `.symbol` | ActionsScreen.jsx, SendAmountScreen.jsx, SwapScreen.jsx |
| `.swap-cards` | ActionsScreen.jsx, ReviewScreen.jsx, SwapScreen.jsx |
| `.swap-amount` | ActionsScreen.jsx, AssetScreen.jsx, SwapScreen.jsx |
| `.icon` | ActionsScreen.jsx, SendAmountScreen.jsx, SwapScreen.jsx |
| `.amount-text` | ActionsScreen.jsx, AssetScreen.jsx, SwapScreen.jsx |
| `.chain-pill` | ActivityScreen.jsx, AssetScreen.jsx, SendScreen.jsx |
| `.75` | AssetScreen.jsx, SendAmountScreen.jsx, SimulateScreen.jsx |
