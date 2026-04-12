# Batch H — ActionsScreen Split (MOD-032)
**Source:** QA Sprint QA-001, Wave 2  
**DO THIS LAST — after all other ActionsScreen changes are committed.**  
**Files:** ActionsScreen.jsx (712 lines) → split into 5 files  
**Instruction:** Structural refactor only. No functionality changes. All 4 tab components move to `src/tabs/`. Build must pass.

---

## MOD-032 — ActionsScreen 712 lines → split into tab files

### Files to create:
- `src/tabs/SwapTab.jsx`
- `src/tabs/TradeTab.jsx`
- `src/tabs/LendBorrowTab.jsx`
- `src/tabs/DepositTab.jsx`

### What each tab file contains:
Read `src/ActionsScreen.jsx` and identify the 4 tab components (SwapTab, TradeTab, LendBorrowTab, DepositTab). Each is likely a function component defined inline in the file.

For each tab:
1. Move the full component function to its own file in `src/tabs/`
2. Move any data arrays that are ONLY used by that tab (e.g., PLATFORMS array used only in LendBorrowTab → goes in LendBorrowTab.jsx)
3. Import any shared state/context at the top of each tab file

Shared data/utilities used by multiple tabs stay in ActionsScreen.jsx.

### ActionsScreen.jsx after split:
- Remove the 4 tab component definitions
- Keep: the shell component, state management, navigation, `isOpen`, `activeTab` state
- Import the 4 tab components from `./tabs/SwapTab`, etc.
- Render them via `{activeTab === 'swap' && <SwapTab />}` pattern (or existing render pattern)

### Props to pass to each tab:
Each tab needs access to shared ActionsScreen state. Pass as props:
- `from`, `setFrom`, `to`, `setTo` — swap amounts
- `activeChain` — selected chain  
- `navigate`, `onClose` — navigation

Check the actual state used by each tab and pass only what it needs.

### CSS stays in one file:
Do NOT split actions.css — CSS files can stay monolithic. Only split JSX.

### Zero functionality change:
After the split, the app should work identically. All state, navigation, animations, and interactions must work the same as before.

---

After split: run `npm run build` and verify the full app works (navigate to ActionsScreen, switch tabs, complete a swap flow).
