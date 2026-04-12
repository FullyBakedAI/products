# Batch C — ActionsScreen Fixes (ARIA + DeFi + UX)
**Source:** QA Sprint QA-001, Waves 1 & 2  
**Primary file:** ActionsScreen.jsx (~712 lines)  
**Also touches:** ReviewScreen.jsx  
**Instruction:** Make all changes below in order. Read the full file before editing. Do not change anything not listed. Build must pass.

IMPORTANT: MOD-032 (ActionsScreen split into tab files) is a SEPARATE, LATER task. Do NOT split the file in this batch — make all fixes in-place in the monolithic ActionsScreen.jsx.

---

## MOD-001 — role="textbox" misused on amount display divs (P1)

Find all amount display divs in ActionsScreen.jsx that have `role="textbox" aria-readonly="true"`. These are the divs that display the entered amount (numpad output), not actual input fields.

Change: `role="textbox" aria-readonly="true"` → `role="status" aria-live="polite"`

There should be ~3 instances across SwapTab, TradeTab, and LendBorrowTab sections.

---

## MOD-002 — No focus trap when ActionsScreen opens (P1)

In ActionsScreen.jsx, the sheet/modal opens when `isOpen` is true (or equivalent state). 

Add:
1. A `ref` (e.g., `closeButtonRef`) on the close button of the actions sheet.
2. A `useEffect` that when `isOpen` becomes true, calls `closeButtonRef.current?.focus()`.
3. Store the previously focused element before opening: `const previousFocusRef = useRef(null)`. On open: `previousFocusRef.current = document.activeElement`. On close (isOpen → false): `previousFocusRef.current?.focus()`.

Use standard React patterns. React ARIA's useDialog handles this automatically if the sheet uses Dialog — check if that's already in use before adding manual focus management.

---

## MOD-007 — Focus not managed on overlay open/close (P1)

Similar to MOD-002 but for any other modal overlays within ActionsScreen (token selector overlay, platform selector, etc.).

For each overlay: when it opens, move focus to its close/first-focusable element. When it closes, return focus to the trigger element.

If the overlays are React ARIA `Dialog` components they already handle this — skip those. Only add manual focus management for non-Dialog overlays.

---

## MOD-036 — Gas fees hardcoded regardless of chain (P2)

Find the gas fee display in ActionsScreen (the fee breakdown rows showing network fee + protocol fee). Currently hardcoded to ~$2.40 + $0.88.

Replace with a chain-aware fee lookup:
```js
const GAS_FEES = {
  ethereum: { network: '$14.20', protocol: '$0.88' },
  arbitrum: { network: '$0.08', protocol: '$0.22' },
  base: { network: '$0.04', protocol: '$0.18' },
  polygon: { network: '$0.02', protocol: '$0.15' },
  optimism: { network: '$0.05', protocol: '$0.19' },
};
```

Use the currently selected chain (`activeChain` or equivalent state) to look up fees. Default to `ethereum` if chain unknown. Show the selected chain's values.

---

## MOD-037 — APY/APR distinction missing or inconsistent (P2)

In the data arrays in ActionsScreen.jsx (PLATFORMS, STAKING_PLATFORMS, or similar):
- Add an `apyType: 'APY'` or `apyType: 'APR'` field to each platform/rate item.
- Rule: staking = APY, lending = APY, borrowing = APR.
- Update the display so the suffix shown is the `apyType` value, not a hardcoded "APY" or "APR".

In ExploreScreen.jsx (TOP_YIELDS or similar array): Same treatment — add `apyType` field and display correctly.

---

## MOD-038 — Price impact hardcoded as "0.12% Low" always (P2)

Find the price impact display in the Swap tab.

Replace the hardcoded value with a calculated mock:
```js
const priceImpact = Math.min(15, Math.max(0.01, (parseFloat(payAmount) || 0) / 1000000 * 100));
const impactLevel = priceImpact < 1 ? 'low' : priceImpact < 3 ? 'medium' : 'high';
const impactLabel = priceImpact < 1 ? 'Low' : priceImpact < 3 ? 'Medium' : 'High impact';
```

Display: `{priceImpact.toFixed(2)}% — {impactLabel}`

Apply `data-level={impactLevel}` to the impact element so CSS can style it (green/amber/red based on level).

---

## MOD-040 — Health factor non-interactive (P2)

Find the health factor display in the Borrow tab (`Health Factor: 2.4 — Safe` or similar text).

Make it tappable:
1. Wrap in a Button component with `aria-label="Health factor details"`.
2. Add `healthFactorOpen` state (default false).
3. When open, show an inline card/tooltip below:
   ```
   Liquidation occurs below 1.0x.
   Current ratio: 2.4x — Safe
   You could borrow [calculated amount] more before risk.
   ```
   Use mock calculation for the "could borrow more" value.
4. Close on button press again or Escape.

---

## MOD-043 — No slippage warning on high-impact trades (P2)
*Depends on MOD-038 above — do this after MOD-038.*

In the Swap tab, after implementing dynamic price impact (MOD-038):

1. If `priceImpact > 3 && priceImpact <= 10`: Show amber warning below the impact row:
   ```
   ⚠ High price impact — you may receive significantly less than shown.
   ```

2. If `priceImpact > 10`: Show red warning with required acknowledgement:
   ```
   ⚠ Very high price impact ({priceImpact.toFixed(1)}%) — this trade may be unfavourable.
   ```
   Add a checkbox: `I understand the risk` — the Review/Swap CTA is disabled until checked.
   Use `slippageAcknowledged` state.

---

## MOD-022 — No loading state before ReviewScreen navigation (P2)

Find the primary CTA button in each tab (Swap, Trade, Lend) that navigates to `/review`.

Add a loading state:
1. Add `isQuoting` state (default false).
2. On CTA press: set `isQuoting = true`, disable the button, show "Fetching best rate..." spinner + text for 600ms.
3. After 600ms: navigate to `/review`.
4. Use a simple `setTimeout` for prototype realism — no actual API call needed.

Loading state: button text changes to "Fetching best rate..." with a small spinner inline. Button stays full-width but shows loading treatment.

---

After all changes: run `npm run build` to confirm zero errors.
