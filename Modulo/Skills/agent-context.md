# Modulo — Agent Build Context

> Assembled prompt block for AI agents building Modulo UI.
> Paste into any AI tool, Cursor session, or Claude conversation.
> This file is the single source of truth — it references the detailed files below.

---

## System Prompt

```
You are building UI for Modulo — a cross-chain DeFi platform.
Tagline: "One vault, every chain."
Version: v3.0

## Stack
- React + React ARIA (react-aria-components) + Framer Motion
- React Router v7 (HashRouter)
- Vite build → outputs to ../Prototype/modulo/
- CSS custom properties (--bk-* tokens) — never hardcode values
- All icons from src/assets/*.svg — NEVER use Lucide in product screens

## Build
cd App && npm run build    # → outputs to Prototype/modulo/

## Read These Files (in order)
1. Skills/tokens.md     — every --bk-* token with values and usage
2. Skills/components.md — screen structure, shared components, extraction targets, React ARIA, motion, accessibility
3. Skills/constraints.md — hard rules and strong defaults
4. Skills/contexts.md   — user contexts that drive design decisions
5. Skills/qa-checklist.md — pre-submit checklist (run before every PR)

## Critical Rules (read constraints.md for full list)
- All colours via --bk-* tokens. Zero hardcoded hex.
- All icons from App/src/assets/*.svg. Never Lucide in product screens.
- React ARIA Button with onPress for ALL interactive elements. Never <button onClick> or <div onClick>.
- No navigate(-1). Always explicit routes.
- No dead-end buttons. Every button goes somewhere.
- onTap not onClick on draggable motion.div elements.
- Motion from motion-tokens.js, not raw durations.
- WCAG 2.1 AA minimum. aria-label on every interactive element.
- One primary CTA per screen, bottom-anchored.
- 44px minimum touch targets.
- Never truncate financial values.

## Screens (17 total)
HomeScreen (/)                     — root, has BottomNav
ExploreScreen (/explore)           — root, has BottomNav
ActivityScreen (/activity)         — root, has BottomNav
SwapScreen (/swap)                 — modal transition
SwapSelectScreen (/swap/select/:side) — sheet transition
SendScreen (/send)                 — modal
SendAmountScreen (/send/amount)    — modal
ReceiveScreen (/receive)           — modal
AssetScreen (/asset/:id)           — modal
ActionsScreen (/actions)           — modal
ReviewScreen (/review)             — sheet
SuccessScreen (/success)           — modal
OptimiseScreen (/optimise)         — modal
AutopilotScreen (/autopilot)       — modal
SimulateScreen (/simulate)         — modal
AchievementsScreen (/achievements) — modal
SettingsScreen (/settings)         — modal

## Screen Structure Template
<motion.main className="[screen]-screen">
  <StatusBar />
  <ScreenHeader title="..." onBack={() => navigate('/parent')} />
  <div className="scroll-content">
    ...content composed from shared components...
  </div>
  <BottomNav />  // only on root screens: Home, Explore, Activity
</motion.main>

## Shared Components (extract if pattern appears in 2+ screens)
See Skills/components.md for the full extraction plan:
- TokenInputCard — swap card input block
- ScreenHeader — back button + title
- SheetHandle — drag handle pill for bottom sheets
- TokenPill — token selector pill button
- FilterPills — segmented filter tabs
- OpportunityRow — yield/protocol opportunity row
- CTAButton — primary call-to-action

## Transitions
Root screens: fade (opacity)
Modal screens: slide up from offset + fade
Sheet screens: slide up from 100%
Springs from motion-tokens.js for interactive elements

## Phone Frame
402×874px on desktop (iPhone 17 Pro), 100vw×100dvh on mobile.
```

---

## Context Additions

Append the relevant context when building specific screen types. See `contexts.md` for full detail.

| Context | When | Key principle |
|---------|------|---------------|
| Reviewing | Portfolio, history | Design for scanning, not action |
| Deciding | Swap, send input | Every number visible without scrolling |
| Confirming | Review, execute | Show only what changes |
| Sending | Send amount, address | High precision, explicit network |
| Discovering | Explore, browse | No urgency, easy comparison |
| Receiving | QR, address share | Large QR, no financial data |
