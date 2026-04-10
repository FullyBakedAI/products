# Modulo Component Skills

## The Goal
Everything you build feeds into a **reusable React ARIA component library**. Every screen is an opportunity to extract shared patterns into clean, accessible, themeable components. Don't just build screens — build the system.

## Stack
```
React ARIA (accessibility primitives)
    ↓
BakeKit tokens (--bk-* CSS custom properties)
    ↓
Shared components (reusable across screens)
    ↓
Screen components (compose shared components into pages)
```

## Component Extraction Rule
**If a pattern appears in 2+ screens, extract it.** These are already identified and need extraction:

### TokenInputCard
The "swap card" input block (card-label / card-middle / card-bottom). Used 35+ times across SwapScreen and ActionsScreen.
```jsx
<TokenInputCard
  label="You pay"
  token="ETH"
  tokenIcon={tokenEth}
  balance="1.1421 ETH"
  onTokenSelect={() => navigate('/swap/select/from')}
/>
```

### ScreenHeader
Back-button + title header. Duplicated in AutopilotScreen, OptimiseScreen, SimulateScreen, AchievementsScreen, SettingsScreen.
```jsx
<ScreenHeader title="Autopilot" onBack={() => navigate('/')} />
```

### SheetHandle
Drag-handle pill for bottom sheets. Duplicated in ActivityScreen, ReceiveScreen, ReviewScreen, SendScreen, SwapSelectScreen.
```jsx
<SheetHandle />
```

### TokenPill
Token selector pill button. 3 different class names for the same thing across SwapScreen, ActionsScreen, SendAmountScreen.
```jsx
<TokenPill token="ETH" icon={tokenEth} onPress={handleSelect} />
```

### FilterPills
Segmented filter tabs. Duplicated in ActivityScreen, ExploreScreen, ReceiveScreen.
```jsx
<FilterPills options={['All', 'Sent', 'Received']} selected={filter} onChange={setFilter} />
```

### OpportunityRow
Yield/protocol opportunity row. Duplicated in ActionsScreen and AssetScreen.
```jsx
<OpportunityRow icon={icon} label="Aave" sublabel="Variable rate" value="4.8% APY" onPress={handler} />
```

### CTAButton
Primary call-to-action at bottom of sheets. Used in 8+ screens with repeated disabled-state logic.
```jsx
<CTAButton label="Confirm Swap" disabled={!isValid} onPress={handleConfirm} />
```

## React ARIA — Use It Everywhere

### Must use React ARIA `Button` for ALL interactive elements:
```jsx
// CORRECT
import { Button } from 'react-aria-components';
<Button className="action-btn" onPress={handler}>Label</Button>

// WRONG — never do this
<button onClick={handler}>Label</button>
<div onClick={handler}>Label</div>
```

### React ARIA components to adopt:
| Pattern | Use | Instead of |
|---------|-----|-----------|
| `Button` | All buttons | `<button onClick>` |
| `Switch` | Toggles | Custom toggle divs |
| `Dialog` | Modals, sheets | Custom overlay divs |
| `Tabs` / `TabList` / `Tab` / `TabPanel` | Tab bars | Custom button groups |
| `ListBox` / `Option` | Token selectors | Custom scroll lists |
| `RadioGroup` / `Radio` | Segment controls | Custom button pills |

## Screen Structure
```jsx
<motion.main className="[screen]-screen">
  <StatusBar />
  <ScreenHeader title="..." onBack={() => navigate('/parent')} />
  <div className="scroll-content">
    ...content composed from shared components...
  </div>
  <BottomNav />  // only root screens: Home, Explore, Activity
</motion.main>
```

## CSS Rules
- Flat, descriptive names: `.portfolio-card`, `.token-row`
- Screen-prefixed when specific: `.home-header`, `.swap-card`
- Shared components get unprefixed names in `shared.css`
- No BEM, no CSS modules, no utility classes
- Spacing: 4/8/12/16/20/24px scale
- Border radius: 8/12/16/44/9999px scale

## Icons
**Never use Lucide in product screens.** Always `src/assets/*.svg`:
```jsx
import iconSwap from './assets/icon-action-swap.svg';
<img src={iconSwap} alt="" width="20" height="20" aria-hidden="true" />
```

## Motion
Always from `motion-tokens.js`:
```jsx
import { motion as m } from './motion-tokens';
// Fade: m.fade.enter / m.fade.exit
// Modal: m.modal.enter / m.modal.exit / m.modal.offsetEnter
// Sheet: m.sheet.enter / m.sheet.exit
// Spring: m.spring
// Stagger: { ...m.fade.enter, delay: 0.04 + index * 0.05 }
```

## Mobile Drag
- `onTap` not `onClick` on `motion.div` with drag
- `touchAction: 'pan-y'` always
- `dragElastic={0.05}`, `dragMomentum={false}`

## Accessibility (Non-Negotiable)
- `aria-label` on every interactive element
- `role="list"` / `role="listitem"` on lists
- Focus ring: `outline: 2px solid var(--bk-text-primary); outline-offset: 2px`
- Decorative: `aria-hidden="true"` + `alt=""`
- Live regions: `role="status"` + `aria-live="polite"`
- WCAG 2.1 AA contrast minimum

## Before Building
1. Read existing screens — reuse patterns
2. Check if a shared component already exists
3. If your pattern appears elsewhere, extract it first
4. Run the QA checklist
