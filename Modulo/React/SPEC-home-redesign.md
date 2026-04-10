# SPEC: HomeScreen Redesign + Navigation Update

## CRITICAL RULES
- ALL interactive elements: `<Button onPress>` from `react-aria-components`. ZERO `<button onClick>`.
- ALL colours via `--bk-*` CSS custom properties. No hardcoded hex.
- ALL motion via `motion-tokens.js` (`import { motion as m } from './motion-tokens'`).
- `whileTap={{ scale: 0.97 }}` on all pressable elements.
- Run `npx vite build` at the end and confirm zero errors.

## Changes

### 1. Remove StatusBar completely
- In `HomeScreen.jsx`: remove `import StatusBar` and `<StatusBar />` from render.
- The component itself stays for other screens, just remove from Home.

### 2. Header icons — tighter spacing
- In `home.css`, `.home-header-actions` gap: change from `30px` to `14px`.

### 3. Chart date range controls — make functional
- Currently `activePeriod` state exists but chart is static SVG.
- Create 5 simple SVG sparkline paths (one per period: 1D, 1W, 1M, 1Y, ALL) as inline constants.
- When `activePeriod` changes, swap the chart image for the matching SVG path.
- Use `<svg>` with `<polyline>` like the MiniSparkline component already does.
- Keep the green gradient fill below the line. Animate transition with framer-motion opacity crossfade.
- Data can be mocked — just make each period look visually distinct (1D: volatile, 1W: slight up, 1M: dip then recovery, 1Y: strong uptrend like current, ALL: hockey stick).

### 4. Remove action buttons row (Swap, Buy, Send, Receive)
- Delete the entire `.action-row` section from HomeScreen JSX.
- Remove related CSS (`.action-row`, `.action-btn`, `.action-label`) from `home.css`.
- Remove unused icon imports (`iconActionSwap`, `iconActionBuy`, `iconActionSend`, `iconActionRecv`).
- These actions will live in the new "Manage" nav tab (see #8) and also in asset detail.

### 5. "What if?" — move to right side as a button
- Currently below the all-time text as a left-aligned link.
- Move it to sit on the same row as the portfolio gain line, right-aligned.
- Style as a small pill button: `background: var(--bk-bg-elevated)`, `border-radius: 8px`, `padding: 4px 10px`, `font-size: 11px`, `font-weight: 600`, `color: var(--bk-brand-primary)`.
- Text: "What if? →"
- Remove the old `.portfolio-whatif-btn` positioning. Put it in a flex row with the gain text.

### 6. "Put it all to work" promo card — Modulo logo + amounts
- Replace the `<Sparkles>` Lucide icon with `<img src={logoModulo}>` (already imported as `logoModulo`).
- Remove the `.optimise-promo-icon` wrapper div with its background/border. Just show the logo directly, sized ~28px.
- Update the subtitle text to include the yield amount AND percentage: `"Estimated +$969/yr · 4.2% avg APY across 4 protocols"`
- Keep the "Optimise" button on the right.

### 7. Achievement toast — make whole thing clickable/dismissable
- Currently only the × button dismisses. The toast text is not clickable.
- Wrap the ENTIRE `.achievement-toast` content in a single `<Button onPress>` that both navigates to `/achievements` AND dismisses.
- Remove the separate × dismiss button.
- Add `whileTap={{ scale: 0.97 }}` to the toast motion.div.
- Add a subtle right chevron icon (ChevronRight, size 14) at the far right to indicate it's tappable.

### 8. Navigation — 5 tabs: Home, Markets, Actions, Activity, Manage
In `BottomNav.jsx`:
- **Home** — `/` — Home icon (keep current)
- **Markets** — `/explore` — BarChart3 icon (keep current)
- **Actions** — centre FAB — Zap icon (keep current, opens ActionsScreen overlay)
- **Activity** — `/activity` — Clock icon (keep current)
- **Manage** — NEW — `/manage` — SlidersHorizontal icon — opens a new ManageScreen

### 9. ManageScreen (new file: `ManageScreen.jsx` + `manage.css`)
Simple screen with 4 action cards in a 2×2 grid:
- **Deposit** — ArrowDownToLine icon — onPress: `openActions({ tab: 'deposit' })`
- **Withdraw** — ArrowUpFromLine icon — onPress: `openActions({ tab: 'withdraw' })` (or navigate to a placeholder)
- **Send** — Send icon — onPress: `navigate('/send')`
- **Receive** — Download icon — onPress: `navigate('/receive')`

Each card: `background: var(--bk-bg-card)`, `border: 1px solid var(--bk-border-subtle)`, `border-radius: 16px`, 
height ~100px, centered icon (size 24) + label below (13px, 600 weight).
Use staggered spring entrance and `whileTap={{ scale: 0.95 }}`.

Header: "Manage" title + settings icon top-right.
Include `<BottomNav />` at the bottom.

### 10. Register ManageScreen in App.jsx
- Add `import ManageScreen from './ManageScreen'`
- Add `<Route path="/manage" element={<ManageScreen />} />`
- Add `/manage` to fade variants (not modal — it's a tab destination).

## Files to modify
- `HomeScreen.jsx` — items 1-7
- `home.css` — items 2, 4, 5
- `BottomNav.jsx` — item 8
- `App.jsx` — item 10
- NEW: `ManageScreen.jsx` — item 9
- NEW: `manage.css` — item 9

## Validation
- `npx vite build` — zero errors
- No `onClick` anywhere in modified files
- No hardcoded hex colours in new/modified CSS
- All Buttons use react-aria-components Button with onPress
