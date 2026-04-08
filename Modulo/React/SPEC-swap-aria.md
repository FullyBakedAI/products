# Build Spec: Swap Screen — React ARIA

**Date:** 2026-04-07
**Purpose:** Rebuild the HTML prototype swap screen as a React component using React ARIA. This is a proof-of-concept to validate the React ARIA → BakeKit token stack before building all screens.

**Success criteria:**
1. Visually identical to the HTML prototype at `../Prototype/swap-screen.html`
2. All interactive elements use React ARIA components (`Button`, `TextField`, etc.)
3. All values sourced from `../Prototype/modulo-shared.css` via `--bk-*` CSS custom properties — no hardcoded hex values in component styles
4. Keyboard navigable: Tab moves focus between all interactive elements, Enter/Space activates buttons
5. Screen reader: all buttons have correct labels, live region announces receive amount changes
6. Runs at `localhost:5173` with `npm run dev`

---

## Setup

```
~/products/Modulo/React/
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── tokens.css          ← copy of ../Prototype/modulo-shared.css (tokens only, no components)
    ├── swap.css            ← swap screen styles (uses --bk-* vars from tokens.css)
    └── SwapScreen.jsx      ← the component
```

**Install:**
```bash
npm create vite@latest . -- --template react
npm install react-aria-components
```

---

## Component Tree

```
SwapScreen
├── StatusBar (aria-hidden)
├── SwapHeader
│   ├── Button (close) — aria-label="Close"
│   ├── h1 "Swap"
│   └── Button (settings) — aria-label="Swap settings"
├── SwapCards
│   ├── PayCard (role="region" aria-label="You pay")
│   │   ├── label "You pay"
│   │   ├── AmountDisplay (aria-live="polite" aria-label="Pay amount")
│   │   ├── TokenPill (Button — aria-label="Pay token: ETH, tap to change")
│   │   └── BalanceRow
│   ├── SwapDirectionButton (Button — aria-label="Swap pay and receive tokens")
│   └── ReceiveCard (role="region" aria-label="You receive")
│       ├── label "You receive"
│       ├── AmountDisplay (aria-live="polite" aria-label="Receive amount")
│       └── SelectTokenButton (Button — aria-label="Select receive token") OR TokenPill
├── PercentagePills (role="group" aria-label="Amount presets")
│   └── Button × 4 (25%, 50%, 75%, Max)
├── Numpad (role="group" aria-label="Number input")
│   └── Button × 12 (1-9, ., 0, delete)
└── CTAButton (Button — aria-label dynamic)
```

---

## React ARIA Usage

Use `Button` from `react-aria-components` for **every** tappable element:
```jsx
import { Button } from 'react-aria-components';
```

The amount display is NOT a native input — it's driven by the numpad. Represent it as:
```jsx
<div
  role="textbox"
  aria-readonly="true"
  aria-label="Pay amount"
  aria-live="polite"
>
  {payAmount || '0'}
</div>
```

For the receive amount, add `aria-atomic="true"` so screen readers announce the full updated value, not just the diff.

---

## State

```js
const [payAmount, setPayAmount] = useState('');
const [receiveToken, setReceiveToken] = useState(null); // null = not selected
const [swapped, setSwapped] = useState(false);

const ETH_BALANCE = 1.1421;
const ETH_PRICE = 1842.50;

const payUSD = payAmount ? (parseFloat(payAmount) * ETH_PRICE).toFixed(2) : '0.00';
const receiveAmount = payAmount && receiveToken
  ? (parseFloat(payAmount) * ETH_PRICE).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : '';

const ctaLabel = !receiveToken
  ? 'Select a token'
  : !payAmount || parseFloat(payAmount) === 0
  ? 'Enter an amount'
  : 'Swap';

const ctaReady = receiveToken && payAmount && parseFloat(payAmount) > 0;
```

---

## Numpad Logic

```js
function handleKey(key) {
  setPayAmount(prev => {
    if (key === 'del') return prev.slice(0, -1);
    if (key === '.') {
      if (prev.includes('.')) return prev;
      return prev.length === 0 ? '0.' : prev + '.';
    }
    if (prev === '0' && key !== '.') return key;
    return prev + key;
  });
}
```

---

## Percentage Pills

```js
function handlePct(pct) {
  const amount = ETH_BALANCE * pct / 100;
  setPayAmount(amount % 1 === 0 ? amount.toString() : amount.toFixed(4));
}
```

---

## Swap Direction Button

On click:
1. Toggle `swapped` state
2. Rotate the arrow icon 180deg via CSS class
3. (For now) swap the visual position of pay/receive cards

```jsx
<Button
  aria-label="Swap pay and receive tokens"
  aria-pressed={swapped}
  onPress={() => setSwapped(s => !s)}
  className={`swap-direction ${swapped ? 'swapped' : ''}`}
>
  <SwapArrowIcon />
</Button>
```

---

## Select Token (inline mock)

For this test, clicking "Select token" doesn't navigate — it inline-selects USDC:
```js
function handleSelectToken() {
  setReceiveToken({ symbol: 'USDC', color: '#2775CA', label: '$' });
}
```
Update the aria-label on the TokenPill to reflect the new selection.

---

## Visual Spec

All layout, sizing, colours, and typography values are in `../Spec/swap-screen-spec.md`. Key points:
- Amount input font: Inter 300 (light), 36px
- Numpad key tap target: 74.13px height
- Cards: 16px inset from screen edges, 138px (pay) / 114px (receive)
- Swap direction button: 36×36px, sits at the join between the two cards
- All colours via `--bk-*` variables — reference `../Prototype/modulo-shared.css` for the full token set
- Assets: copy SVGs from `../Prototype/assets/` as needed (swap-arrow-divider.svg, icon-backspace.svg, icon-settings.svg, icon-close.svg)

Wrap the whole screen in a `.phone` container matching the HTML prototype (390px wide, mobile frame) so it looks identical side-by-side.

---

## What NOT to do
- Do not use native `<input type="number">` — the amount is numpad-driven, not typed
- Do not hardcode hex values in JSX styles — all colours via CSS custom properties
- Do not use `aria-label` and visible text that contradict each other
- Do not add React Router or any navigation — this is a single-screen component test
- Do not install any UI library other than `react-aria-components`

---

## Deliverable
A working `npm run dev` that shows the swap screen, visually matching the HTML prototype, with React ARIA components powering all interactions. No broken layout, no missing assets.
