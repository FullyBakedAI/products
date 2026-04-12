# OptimiseScreen Redesign Spec

## File: `src/OptimiseScreen.jsx` + `src/optimise.css`

## Changes Required

### 1. Replace AI icon with Modulo logo
- Remove: `import { Sparkles } from 'lucide-react'`
- Add: `import logoModulo from './assets/logo-modulo.svg'`
- Replace the `<Sparkles>` in `.optimise-hero-icon` with `<img src={logoModulo} alt="Modulo" height="28" />`

### 2. Make yield amount more prominent
- The `+$969/yr estimated` badge should be larger and more visually impactful
- Increase font size to 24px, font-weight 700
- Use `color: var(--bk-success)` for the dollar amount
- Consider making it the hero focal point (above the description text)

### 3. Add spacing between list items
- Currently `.optimise-row` items are tight together
- Add `gap: 12px` to `.optimise-list` (or margin-bottom: 12px to each row)
- Each row should have clear separation — either spacing or a subtle border

### 4. Toggle selection on each item
- Each recommendation row needs an on/off toggle state
- Use React state: `const [selected, setSelected] = useState(new Set(RECOMMENDATIONS.map(r => r.id)))` (all on by default)
- Tapping a row toggles it on/off
- Visual: selected rows have normal opacity, deselected rows have `opacity: 0.4` and a line-through or dimmed style
- Add a toggle indicator on the right side (checkmark or switch using React ARIA `Switch`)
- The row itself should be a pressable element (React ARIA `Button` with `onPress`)

### 5. Dynamic total based on selection
- The `+$969 / yr` total must recalculate based on which items are selected
- Parse the yield values from the data (store as numbers, not strings):
  ```js
  const RECOMMENDATIONS = [
    { id: 'usdc', icon: tokenUsdc, name: 'USDC', protocol: 'Aave',           apy: 4.8, yieldNum: 256 },
    { id: 'btc',  icon: tokenBtc,  name: 'BTC',  protocol: 'Native staking', apy: 1.8, yieldNum: 101 },
    { id: 'eth',  icon: tokenEth,  name: 'ETH',  protocol: 'Lido',           apy: 3.8, yieldNum: 168 },
    { id: 'sol',  icon: tokenSol,  name: 'SOL',  protocol: 'Marinade',       apy: 6.8, yieldNum: 288 },
    { id: 'usdt', icon: tokenUsdt, name: 'USDT', protocol: 'Compound',       apy: 4.6, yieldNum: 156 },
  ];
  ```
- Total = sum of `yieldNum` for all selected items
- Both the hero badge AND the bottom total row update in real time
- The "Confirm & Deploy" button should say how many are selected: "Deploy 3 of 5 assets" or similar
- If none selected, disable the button

### 6. Fix existing issues
- Line 56: `navigate(-1)` → `navigate('/')` (explicit route, no history-based back)
- Remove `<StatusBar />` (hidden on mobile anyway, remove from this screen entirely since it's a modal)

## Rules (from Skills/)
- All interactive elements: React ARIA `Button` with `onPress`
- All colours via `--bk-*` tokens
- Motion from `motion-tokens.js`
- Icons from `src/assets/*.svg` — no Lucide except where no asset exists (ChevronLeft is OK)
- `aria-label` on all interactive elements
- Run `npm run build` and verify 0 errors when done
