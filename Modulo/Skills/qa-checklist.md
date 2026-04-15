# Modulo QA Checklist

Run through before submitting ANY UI work.

## Tokens
- [ ] All colours from `--bk-*` tokens — zero hardcoded hex
- [ ] All motion from `motion-tokens.js` — no raw durations
- [ ] Font uses `var(--bk-font)` — no raw font strings
- [ ] Works in dark AND light themes

## Accessibility
- [ ] `aria-label` on all interactive elements
- [ ] `alt=""` + `aria-hidden="true"` on decorative images
- [ ] Focus ring visible on keyboard navigation
- [ ] Colour contrast meets WCAG 2.1 AA (4.5:1 text, 3:1 large)
- [ ] Lists use `role="list"` / `role="listitem"`

## Icons
- [ ] Zero Lucide icons in product screens — all from `./assets/*.svg`
- [ ] Icon buttons have `aria-label`

## Layout
- [ ] Fits 402px phone frame — no horizontal overflow
- [ ] 20px page margins respected
- [ ] Touch targets minimum 44x44px
- [ ] `padding-bottom: 100px` on scroll-content for bottom nav clearance

## Navigation
- [ ] Every button goes somewhere — no dead ends, no `() => {}`
- [ ] No `navigate(-1)` — use explicit routes
- [ ] Back buttons navigate to a specific parent route

## Interaction Design
- [ ] Cards/panels representing a single concept are fully tappable — not just sub-buttons
- [ ] Tappable cards have press feedback (`whileTap` scale)
- [ ] Shared state (autopilot, theme, wallet) stays in sync across all screens that display it
- [ ] Status badges update immediately when state changes — no stale ON/OFF labels
- [ ] No elements that look tappable but do nothing

## Code
- [ ] No unused imports
- [ ] No console.log
- [ ] React ARIA `Button` with `onPress` for interactive elements
- [ ] `onTap` not `onClick` on draggable `motion.div` elements

## Build
- [ ] `npm run build` — 0 errors
- [ ] No new warnings introduced
