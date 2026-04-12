# Batch B — Motion Token System Fixes
**Source:** QA Sprint QA-001, Wave 2  
**Files:** motion-tokens.js, DesktopLayout.jsx, UndoToast.jsx, HomeScreen.jsx, ExploreScreen.jsx, AchievementsScreen.jsx  
**Instruction:** Make all changes below. Read each file before editing. Do not change anything not listed.

---

## MOD-065 — Standardise whileTap scale values

**File:** `src/motion-tokens.js` — add a `tap` export to the motion tokens:
```js
export const tap = {
  default: 0.96,
  card: 0.97,
  heavy: 0.90,
  numpad: 0.82,
};
```

Then do a global pass across all JSX files to standardise `whileTap={{ scale: X }}` values:
- Card-level elements (`.portfolio-card`, `.token-row`, large swipeable rows) → `scale: 0.97`
- Standard buttons (`.primary-btn`, tab pills, sort pills) → `scale: 0.96`
- Action/heavy buttons (large CTAs, action tiles) → `scale: 0.90`
- Numpad keys → `scale: 0.82`

Import `tap` from `./motion-tokens` where needed. Do not change any `whileTap` that uses the exact correct value already.

---

## MOD-068 — Standardise stagger delay values

**File:** `src/motion-tokens.js` — add a `stagger` export:
```js
export const stagger = {
  base: 0.06,
  perItem: 0.05,
};
```

Then find all list entry animations across `HomeScreen.jsx`, `ExploreScreen.jsx`, `AchievementsScreen.jsx` (and any other screen using staggered list animations) that have hardcoded stagger delays like `delay: 0.12 + i*0.05` or `delay: 0.04 + i*0.04`.

Replace with: `delay: m.stagger.base + i * m.stagger.perItem`

The import alias `m` for motion-tokens is already established in each file (`import { motion as m } from './motion-tokens'`). Add `stagger` to that import.

---

## MOD-069 — UndoToast uses modal spring — needs own token

**File:** `src/motion-tokens.js` — add a `toast` export:
```js
export const toast = {
  initial: { y: -56, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { y: -56, opacity: 0, transition: { duration: 0.16 } },
};
```

**File:** `src/UndoToast.jsx` — find the AnimatePresence/motion animation on the toast. Currently uses `...m.modal.enter` or similar. Replace with `m.toast.initial`, `m.toast.animate`, `m.toast.exit` from the new token. Adjust import to include `toast` from motion-tokens.

---

## MOD-066 — Desktop panel exit uses duration not spring

**File:** `src/DesktopLayout.jsx` — find the `exit` animation prop on the panel element (the right panel that slides in). Currently uses `exit={{ x: 340, opacity: 0, transition: { duration: 0.18 } }}` or similar duration-based exit.

Change to:
```jsx
exit={{ x: 340, opacity: 0, transition: { type: "spring", stiffness: 280, damping: 26 } }}
```

This makes the panel spring out (lighter feel) rather than snap on a duration.

---

After all changes: run `npm run build` to confirm zero errors.
