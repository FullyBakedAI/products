# Modulo Desktop Layout — Build Spec
**Status:** Ready to build  
**Breakpoint:** `min-width: 1024px`  
**Approach:** New desktop layout wrapping existing screens — mobile code untouched

---

## Overview

At ≥1024px, replace the iPhone frame with a true desktop dashboard. Same React routes, same screens, new layout shell. The goal is a high-density, professional DeFi interface — dark theme, data-forward, actions always within reach.

```
┌────────────────────────────────────────────────────────────────┐
│ SIDEBAR (240px) │  MAIN CONTENT (flex: 1)  │ PANEL (340px opt) │
│                 │                          │                    │
│  Logo           │  <current screen>        │  Trade / Actions   │
│  Nav items      │                          │  (replaces sheet)  │
│  ─────────────  │                          │                    │
│  Wallet addr    │                          │                    │
│  Settings       │                          │                    │
└────────────────────────────────────────────────────────────────┘
```

---

## Files to create

| File | Purpose |
|------|---------|
| `src/DesktopLayout.jsx` | Layout shell: sidebar + main + optional right panel |
| `src/SidebarNav.jsx` | Desktop sidebar navigation |
| `src/desktop.css` | All desktop layout styles |

## Files to modify

| File | Change |
|------|--------|
| `src/App.jsx` | Detect desktop viewport; render `<DesktopLayout>` instead of `.phone` at ≥1024px |
| `src/shared.css` | Suppress phone frame at ≥1024px |
| `src/ActionsScreen.jsx` | Accept `variant="panel"` prop — render inline (no overlay/sheet chrome) |
| `src/HomeScreen.jsx` | Hide `<BottomNav />` when `useIsDesktop()` |
| `src/ExploreScreen.jsx` | Hide `<BottomNav />` when `useIsDesktop()` |
| `src/ManageScreen.jsx` | Hide `<BottomNav />` when `useIsDesktop()` |
| `src/AssetScreen.jsx` | Two-column layout at desktop |

---

## 1. Viewport detection hook

Create `src/hooks/useIsDesktop.js`:

```js
import { useState, useEffect } from 'react';

export function useIsDesktop() {
  const mq = window.matchMedia('(min-width: 1024px)');
  const [isDesktop, setIsDesktop] = useState(mq.matches);
  useEffect(() => {
    const handler = e => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}
```

---

## 2. App.jsx changes

Wrap the existing `.phone` layout with a desktop branch:

```jsx
import { useIsDesktop } from './hooks/useIsDesktop';
import DesktopLayout from './DesktopLayout';

// Inside App():
const isDesktop = useIsDesktop();

return (
  <ActionsProvider>
    <IconOverrideProvider>
      <SwapProvider>
        <UndoToastProvider>
          {isDesktop ? (
            <DesktopLayout />
          ) : (
            <div className="phone">
              <AnimatedRoutes />
              <ActionsOverlay />
              <UndoToast />
            </div>
          )}
        </UndoToastProvider>
      </SwapProvider>
    </IconOverrideProvider>
  </ActionsProvider>
);
```

---

## 3. DesktopLayout.jsx

Three-column shell. Right panel shows `<ActionsScreen variant="panel" />` when `isOpen` is true (from `useActions()`).

```jsx
import SidebarNav from './SidebarNav';
import ActionsScreen from './ActionsScreen';
import { useActions } from './ActionsContext';
import { AnimatePresence, motion } from 'framer-motion';
import './desktop.css';

export default function DesktopLayout() {
  const { isOpen } = useActions();
  return (
    <div className="desktop-root">
      <SidebarNav />
      <main className="desktop-main">
        <AnimatedRoutes />
        <UndoToast />
      </main>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="desktop-panel"
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 340, damping: 32 } }}
            exit={{ x: 340, opacity: 0, transition: { duration: 0.18 } }}
          >
            <ActionsScreen variant="panel" />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## 4. SidebarNav.jsx

Navigation items match the existing bottom nav: Home, Explore, Manage. Add wallet info and settings at the bottom.

```jsx
// Nav items
const NAV = [
  { path: '/',        label: 'Portfolio',  Icon: IconHome    },
  { path: '/explore', label: 'Markets',    Icon: IconCompass },
  { path: '/manage',  label: 'Manage',     Icon: IconGrid    },
];
```

Structure:
```
.desktop-sidebar
  .sidebar-logo          ← "Modulo" wordmark / icon
  .sidebar-nav           ← nav items
    .sidebar-nav-item (+ .active)
      <Icon />
      <span>Label</span>
  .sidebar-divider
  .sidebar-footer        ← wallet address + settings btn
    .sidebar-wallet      ← truncated address "0x1a2b…3c4d"
    .sidebar-settings-btn
```

Use `useNavigate` + `useLocation` for active state. Use React ARIA `Button` for each nav item.

---

## 5. desktop.css

### Root layout
```css
.desktop-root {
  display: flex;
  width: 100vw;
  height: 100vh;
  background: var(--bk-bg-outer);
  overflow: hidden;
}
```

### Sidebar
```css
.desktop-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--bk-bg-base);
  border-right: 1px solid var(--bk-border-subtle);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  gap: 0;
}

.sidebar-logo {
  padding: 0 8px 24px;
  font-size: 18px;
  font-weight: 700;
  color: var(--bk-text-primary);
  font-family: var(--bk-font);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--bk-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--bk-font);
  width: 100%;
  text-align: left;
  transition: background var(--bk-motion-fast), color var(--bk-motion-fast);
}

.sidebar-nav-item:hover {
  background: var(--bk-bg-elevated);
  color: var(--bk-text-secondary);
}

.sidebar-nav-item.active {
  background: var(--bk-brand-dim);
  color: var(--bk-brand-primary);
  font-weight: 600;
}

.sidebar-divider {
  height: 1px;
  background: var(--bk-border-subtle);
  margin: 16px 0;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.sidebar-wallet {
  flex: 1;
  font-size: 12px;
  color: var(--bk-text-muted);
  font-family: var(--bk-font);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-settings-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bk-bg-elevated);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bk-text-muted);
  flex-shrink: 0;
  transition: background var(--bk-motion-fast);
}

.sidebar-settings-btn:hover {
  background: var(--bk-bg-card);
  color: var(--bk-text-primary);
}
```

### Main content
```css
.desktop-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bk-bg-base);
  position: relative;
  min-width: 0;
}

/* All existing screens scroll in this column — reset phone-specific constraints */
.desktop-main .screen-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
}
```

### Right panel
```css
.desktop-panel {
  width: 340px;
  flex-shrink: 0;
  background: var(--bk-bg-base);
  border-left: 1px solid var(--bk-border-subtle);
  overflow-y: auto;
  overflow-x: hidden;
}

/* Adapt ActionsScreen for panel mode — no overlay chrome */
.desktop-panel .actions-overlay {
  position: static;
  height: 100%;
}

.desktop-panel .actions-backdrop {
  display: none;
}

.desktop-panel .actions-sheet {
  border-radius: 0;
  height: 100%;
  border-top: none;
}
```

### Screen overrides — remove phone-specific constraints on desktop
```css
/* Hide bottom nav — sidebar replaces it */
.desktop-main .bottom-nav {
  display: none;
}

/* HomeScreen — full width, remove max-width caps */
.desktop-main .home-screen {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 32px 32px;
}

/* Remove swipe actions on desktop — click row to open panel instead */
.desktop-main .token-swipe-actions {
  display: none;
}

/* ExploreScreen */
.desktop-main .explore-screen {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px;
}

/* ManageScreen */
.desktop-main .manage-screen {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px;
}

/* AssetScreen — two column */
.desktop-main .asset-screen {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}
```

---

## 6. ActionsScreen variant="panel"

In `ActionsScreen.jsx`, accept a `variant` prop. When `variant === 'panel'`:
- Render without the slide-up overlay and backdrop
- Remove the close button (panel is dismissed differently — clicking a non-panel area or via context)
- Add a panel-specific close: `<button className="panel-close-btn">` in the header row, calls `closeActions()`

```jsx
export default function ActionsScreen({ variant }) {
  const isPanel = variant === 'panel';
  // ...existing code...
  
  return (
    <div className={isPanel ? 'actions-panel-root' : 'actions-overlay'}>
      {!isPanel && <button className="actions-backdrop" onClick={closeActions} />}
      <div className="actions-sheet">
        {/* existing sheet content — no changes needed */}
      </div>
    </div>
  );
}
```

---

## 7. Suppress phone frame on desktop (shared.css)

Add to the existing `@media (min-width: 501px)` block — or add a new block:

```css
@media (min-width: 1024px) {
  .phone {
    display: none; /* desktop layout renders instead */
  }
}
```

---

## 8. Hide BottomNav on desktop

In `BottomNav.jsx`, wrap with:
```jsx
import { useIsDesktop } from './hooks/useIsDesktop';
export default function BottomNav() {
  const isDesktop = useIsDesktop();
  if (isDesktop) return null;
  // ...existing render
}
```

This is the cleanest approach — no changes needed in individual screens.

---

## 9. Asset screen two-column (AssetScreen.jsx)

When `isDesktop`, the existing `.asset-screen` should use a two-column CSS grid (done via `desktop.css` above). The JSX structure needs a wrapper to enable this:

```jsx
// Wrap main content in a grid container when desktop
const isDesktop = useIsDesktop();

return (
  <motion.div className={`asset-screen${isDesktop ? ' asset-screen-desktop' : ''}`}>
    {/* Column 1: chart + price header */}
    <div className="asset-col-main">
      {/* existing: header, chart, period tabs, quick actions */}
    </div>
    {/* Column 2: positions + about + news (desktop only) */}
    {isDesktop && (
      <div className="asset-col-side">
        {/* existing: active positions, about, news */}
      </div>
    )}
  </motion.div>
);
```

Add to `desktop.css`:
```css
.asset-screen-desktop {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

.asset-col-main { min-width: 0; }
.asset-col-side { min-width: 0; }
```

---

## Priority order

Build in this sequence — each step is independently testable:

1. `useIsDesktop` hook + `App.jsx` branch (desktop shows empty shell, mobile unaffected)
2. `SidebarNav.jsx` + `desktop.css` sidebar styles (navigation works, main content fills space)
3. `BottomNav.jsx` null guard (clean up nav duplication)
4. Screen max-width overrides in `desktop.css` (Home, Explore, Manage look good at full width)
5. `ActionsScreen variant="panel"` + right panel animation in `DesktopLayout`
6. `AssetScreen` two-column layout

---

## What NOT to do

- Do not modify any mobile styles — all desktop overrides go in `desktop.css` or behind `isDesktop` checks
- Do not recreate screen content — reuse everything, only change layout containers
- Do not hardcode colours — all `--bk-*` tokens only
- Do not add hover effects to touch targets (swipe rows, etc.) — those don't exist on desktop
- Do not build new screens — Home/Explore/Manage/Asset are sufficient for v1

---

## Token row click behaviour on desktop

Since swipe is hidden on desktop, clicking a token row should open the actions panel:

In `HomeScreen.jsx`, when `isDesktop`, wrap `TokenRow` onPress to call:
```js
openActions({ asset: token.id })
```
instead of the swipe gesture path.
