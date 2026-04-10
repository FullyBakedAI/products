# Settings + Screen Fixes Spec

## Overview
Fix all remaining raw `<button onClick>` elements, `navigate(-1)` calls, remove StatusBar from modal screens, and build out Settings sub-screens so nothing is a dead end.

---

## Part 1: Global Fixes (apply to ALL files listed)

### Replace `<button onClick>` → `<Button onPress>`
Every raw `<button>` must become `<Button>` from `react-aria-components` with `onPress` instead of `onClick`. Ensure `Button` is imported in each file.

**Files with remaining raw buttons:**
- `SettingsScreen.jsx` — wallet card (line ~75), all settings rows (line ~94), sign out (line ~112)
- `SimulateScreen.jsx` — tab buttons (lines ~79-98)
- `AutopilotScreen.jsx` — risk pill buttons (lines ~92-100)
- `AssetScreen.jsx` — opportunity row (line ~429), contract button (line ~515)
- `SendAmountScreen.jsx` — token pill (line ~108), max button (line ~121), token options (line ~132), numpad keys (line ~150)
- `SuccessScreen.jsx` — share button (line ~138)

### Replace `navigate(-1)` → explicit routes
- `SettingsScreen.jsx` → `navigate('/')`
- `SimulateScreen.jsx` → `navigate('/')`
- `AutopilotScreen.jsx` → `navigate('/')`
- `AchievementsScreen.jsx` → `navigate('/')`
- `AssetScreen.jsx` → `navigate('/')`

### Remove `<StatusBar />` from modal screens
Remove `<StatusBar />` and its import from:
- `SettingsScreen.jsx`
- `SimulateScreen.jsx`
- `AutopilotScreen.jsx`
- `AchievementsScreen.jsx`
- `AssetScreen.jsx` (appears twice — remove both)
- `SendAmountScreen.jsx`

Keep StatusBar ONLY in root screens: HomeScreen, ExploreScreen, ActivityScreen.

---

## Part 2: Settings Sub-Screens

Currently every settings row shows "Coming soon". Build real sub-screens as inline panels within SettingsScreen (don't create new route files — use state to show/hide panels within the same component).

### Settings Architecture
```jsx
const [activePanel, setActivePanel] = useState(null);
// null = main list, 'security' | 'notifications' | 'networks' | 'appearance' | 'help' | 'about' = sub-panel
```

Each panel slides in from right (like iOS). Back button returns to main list.

### Security & Privacy panel
- Biometric unlock toggle (React ARIA Switch)
- Transaction signing toggle
- Auto-lock timeout selector (1min / 5min / 15min / 30min) — use pills
- "Connected apps" row (shows count, e.g. "3 apps") → placeholder list

### Notifications panel
- Price alerts toggle
- Transaction confirmations toggle
- Yield opportunities toggle
- Marketing toggle (off by default)

### Networks panel
- List of chains with toggle on/off:
  - Ethereum (on by default)
  - Solana (on by default)
  - Polygon (on by default)
  - Arbitrum (on by default)
  - Base (off)
  - Optimism (off)
- Each row: chain icon (use token icons as placeholder), name, toggle

### Appearance panel
- Theme selector: Dark (active) / Light / System — use pills
- Currency: USD / EUR / GBP — use pills
- Language: English (only option for now, shown as selected)

### Help & Support panel
- "FAQ" row → dead end OK (would link externally)
- "Contact Support" row → dead end OK
- "Report a Bug" row → dead end OK
- Version info at bottom: "Modulo v3.0"

### About panel
- Modulo logo
- "v3.0" version
- "One vault, every chain." tagline
- Built with BakedUX badge/text
- Links: Terms, Privacy, Licenses (dead end OK — external links)

### Wallet detail (when tapping wallet card at top)
- Full address display: `0x7f3e...9A14` expanded to full
- Copy address button
- "View on explorer" row
- "Rename wallet" row

---

## Part 3: Fix About version
Change `sub: 'v1.0.0'` to `sub: 'v3.0'` in SETTINGS_SECTIONS.

---

## Rules
- All interactive elements: React ARIA `Button` with `onPress`, or `Switch` for toggles
- All colours via `--bk-*` tokens — no hardcoded hex
- Icons from `src/assets/*.svg` where available, Lucide for UI chrome (ChevronLeft, Shield, etc.)
- `aria-label` on all interactive elements
- Motion from `motion-tokens.js` for panel transitions
- Run `cd React && npm run build` and verify 0 errors when done
- Add any new CSS to `settings.css` — don't create new CSS files
