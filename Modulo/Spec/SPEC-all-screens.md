# Build Spec: All Remaining Screens + Navigation

**Date:** 2026-04-07
**Prerequisite:** SwapScreen already built at `src/SwapScreen.jsx`. Do not modify it unless wiring navigation.

---

## Goal

Complete the Modulo React app with all 6 screens, React Router navigation, and a shared layout shell. The result should feel like a real mobile app — tapping nav items switches screens, modal screens open/close correctly.

---

## Navigation Model

```
/ (HomeScreen)               ← default route
/explore                     ← bottom nav tab
/swap                        ← bottom nav swap button (full-screen modal, no bottom nav)
/swap/select/:side           ← "select token" within swap (slide-up sheet OR full-screen)
/send                        ← from home action button (full-screen modal, no bottom nav)
/receive                     ← from home action button (full-screen modal, no bottom nav)
```

**Bottom nav** appears on: Home, Explore only.
**No bottom nav** on: Swap, Send, Receive, Swap-Select (these are modals with a close/back button).

### Install
```bash
npm install react-router-dom
```

### Router setup in `src/main.jsx`:
```jsx
import { HashRouter } from 'react-router-dom';
// Wrap <App /> in <HashRouter>
```

Use `HashRouter` (not `BrowserRouter`) so the static build works when served from a subfolder.

---

## File Structure

```
src/
├── main.jsx              ← add HashRouter
├── App.jsx               ← define all routes
├── tokens.css            ← unchanged
├── shared.css            ← NEW: shared layout, bottom nav, phone frame, status bar
├── SwapScreen.jsx        ← existing, wire in useNavigate for close + token select
├── swap.css              ← unchanged
├── HomeScreen.jsx        ← NEW
├── home.css              ← NEW
├── ExploreScreen.jsx     ← NEW
├── explore.css           ← NEW
├── SendScreen.jsx        ← NEW
├── send.css              ← NEW
├── ReceiveScreen.jsx     ← NEW
├── receive.css           ← NEW
├── SwapSelectScreen.jsx  ← NEW
├── swap-select.css       ← NEW
└── assets/               ← add new SVGs as needed
```

---

## App.jsx — Routes

```jsx
import { Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import ExploreScreen from './ExploreScreen';
import SwapScreen from './SwapScreen';
import SwapSelectScreen from './SwapSelectScreen';
import SendScreen from './SendScreen';
import ReceiveScreen from './ReceiveScreen';

export default function App() {
  return (
    <div className="phone">
      <Routes>
        <Route path="/"        element={<HomeScreen />} />
        <Route path="/explore" element={<ExploreScreen />} />
        <Route path="/swap"    element={<SwapScreen />} />
        <Route path="/swap/select/:side" element={<SwapSelectScreen />} />
        <Route path="/send"    element={<SendScreen />} />
        <Route path="/receive" element={<ReceiveScreen />} />
      </Routes>
    </div>
  );
}
```

Move the `.phone` frame wrapper from individual screens to App.jsx — it should only appear once.

---

## Shared Components

### BottomNav
Appears on Home and Explore screens only.

```jsx
// src/BottomNav.jsx
import { Button } from 'react-aria-components';
import { useNavigate, useLocation } from 'react-router-dom';

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // 4 items: Home (/), Search (/explore), Activity (placeholder), Swap (/swap)
  // Swap button has gradient purple circle background (--bk-brand-gradient)
  // Active tab shows icon in --bk-text-primary, inactive in --bk-text-muted
  // Swap tab is always the purple circle, no active/inactive state
}
```

Assets: `icon-nav-home.svg`, `icon-nav-search.svg`, `icon-nav-activity.svg`, `icon-nav-swap.svg` — copy from `../Prototype/assets/` if not already in `src/assets/`.

### StatusBar
Already in SwapScreen. Extract to `src/StatusBar.jsx` and import it everywhere. `aria-hidden="true"` on the wrapper.

---

## SwapScreen — Navigation Wiring

Modify `SwapScreen.jsx`:
1. Close button: `useNavigate()` → `navigate(-1)` or `navigate('/')`
2. "Select token" CTA and receive token pill: `navigate('/swap/select/receive')` (or `pay`)
3. Remove the `.phone` wrapper (it moves to App.jsx)

---

## SwapSelectScreen

Route: `/swap/select/:side` — the `side` param is `pay` or `receive`.

- Back button: `navigate(-1)`
- Tapping a token: `navigate(-1)` (in real app would pass state back — for now just navigate back and mock-select the token)
- Full-screen, no bottom nav
- Dark background, search bar at top, scrollable token list

Spec: `../Spec/swap-select-screen-spec.md`
HTML reference: `../Prototype/swap-select-screen.html`
Assets: copy from `../Prototype/assets/` as needed

---

## HomeScreen

Main dashboard. Has bottom nav.

**Key sections (top to bottom):**
1. StatusBar (reuse component)
2. Header — Modulo logo left, notification + settings icons right
3. Portfolio card — gradient bg, "$12,854.32" value, gain "+$124.50 (0.98%)", sparkline chart, time period buttons (1D/1W/1M/1Y/ALL)
4. Action buttons row — Swap, Buy, Send, Receive (4 equal buttons)
5. Tokens/NFTs tab bar — "Tokens" active, "NFTs" inactive
6. Token list — USDC, BTC, ETH, SOL, USDT rows
7. Earn card — purple tinted, "Earn up to 8.5% APY"
8. BottomNav

**Navigation:**
- Swap button → `navigate('/swap')`
- Send button → `navigate('/send')`
- Receive button → `navigate('/receive')`
- Bottom nav → appropriate routes

**All data is mock** — hardcode the values from the HTML prototype.

Spec: `../Spec/home-screen-spec.md`
HTML reference: `../Prototype/home-screen.html`

---

## ExploreScreen

Market discovery screen. Has bottom nav.

**Key sections:**
1. StatusBar
2. Header — "Explore" title, search bar
3. Trending section — horizontal scroll cards (BTC, ETH, SOL)
4. Top tokens list — table with token rows
5. BottomNav

**All data is mock.**

Spec: `../Spec/explore-screen-spec.md`
HTML reference: `../Prototype/explore-screen.html`

---

## SendScreen

Full-screen modal. No bottom nav.

**Key sections:**
1. StatusBar
2. Header — close button + "Send" title left, settings right
3. Recipient input — search bar with recent/contact list
4. Amount input — large value display
5. Asset selector
6. Bottom CTA

Spec: `../Spec/send-screen-spec.md`
HTML reference: `../Prototype/send-screen.html`

---

## ReceiveScreen

Full-screen modal. No bottom nav.

**Key sections:**
1. StatusBar
2. Header — close button + "Receive" title left
3. Token selector pills (network selector)
4. QR code display area
5. Wallet address with copy/share buttons
6. Bottom CTA

Spec: `../Spec/receive-screen-spec.md`
HTML reference: `../Prototype/receive-screen.html`

---

## General Rules

1. **Every tappable element uses `Button` from `react-aria-components`** — same as SwapScreen
2. **No hardcoded hex values** — all colours via `--bk-*` custom properties from `tokens.css`
3. **All data is mock** — hardcode values from the HTML prototypes. No API calls.
4. **Assets** — copy SVGs from `../Prototype/assets/`. Do not redraw or approximate.
5. **Styles** — one CSS file per screen. Import into the component file.
6. **Accessibility** — headings, landmarks, aria-labels on all icon buttons. Same standard as SwapScreen.
7. **No TypeScript** — plain JSX throughout.
8. **Phone frame** — single `.phone` div in App.jsx wrapping `<Routes>`. Remove from individual screens.

---

## Success Criteria

1. `npm run dev` starts, all 6 routes load without errors
2. Home → tap Swap → Swap screen opens, Close button returns to Home
3. Home → tap Send → Send screen opens
4. Home → tap Receive → Receive screen opens
5. Swap → tap "Select token" → SwapSelectScreen opens, back returns to Swap
6. Bottom nav works on Home and Explore
7. `npm run build` produces a clean build (zero errors)
8. Visually matches HTML prototypes at `../Prototype/`
