# Modulo — v3.0

Cross-chain DeFi wallet. "One vault, every chain."

## Read These First
1. `Skills/tokens.md` — every `--bk-*` design token with values and usage
2. `Skills/components.md` — screen structure, shared components, extraction targets, React ARIA, motion, accessibility
3. `Skills/constraints.md` — hard rules and strong defaults
4. `Skills/contexts.md` — user situations that drive design decisions
5. `Skills/qa-checklist.md` — pre-submit checklist
6. `Skills/agent-context.md` — assembled prompt block for AI build sessions

Also see: `Skills/foundations.md` (typography, spacing, principles), `Skills/README.md` (how to use)

## Structure

```
Modulo/
├── CLAUDE.md
├── Skills/            — agentic design system rules
├── React/             — React source code
│   ├── src/
│   │   ├── ds/        — design system page (Brand, Studio, Rules, Agentic Guide)
│   │   └── assets/    — SVG icons from Figma
│   ├── package.json
│   └── vite.config.js
├── Prototype/modulo/  — built output (served via tunnel)
├── ProductBrief/
├── Personas/
├── Discovery/
├── Spec/
├── VERSIONS.md        — version history (v1, v2 via git tags)
├── design-manifest.json
└── product.json
```

## Build
```bash
cd React && npm run build    # → outputs to Prototype/modulo/
```

## Screens

| Screen | File | Route |
|--------|------|-------|
| Home | `React/src/HomeScreen.jsx` | `/` |
| Explore | `React/src/ExploreScreen.jsx` | `/explore` |
| Activity | `React/src/ActivityScreen.jsx` | `/activity` |
| Swap | `React/src/SwapScreen.jsx` | `/swap` |
| SwapSelect | `React/src/SwapSelectScreen.jsx` | `/swap/select/:side` |
| Send | `React/src/SendScreen.jsx` | `/send` |
| SendAmount | `React/src/SendAmountScreen.jsx` | `/send/amount` |
| Receive | `React/src/ReceiveScreen.jsx` | `/receive` |
| Asset | `React/src/AssetScreen.jsx` | `/asset/:id` |
| Actions | `React/src/ActionsScreen.jsx` | `/actions` |
| Review | `React/src/ReviewScreen.jsx` | `/review` |
| Success | `React/src/SuccessScreen.jsx` | `/success` |
| Optimise | `React/src/OptimiseScreen.jsx` | `/optimise` |
| Autopilot | `React/src/AutopilotScreen.jsx` | `/autopilot` |
| Simulate | `React/src/SimulateScreen.jsx` | `/simulate` |
| Achievements | `React/src/AchievementsScreen.jsx` | `/achievements` |
| Settings | `React/src/SettingsScreen.jsx` | `/settings` |

## Design System Page
- **URL:** `/modulo/#/ds`
- **Shell:** `React/src/DesignSystemPage.jsx`
- **Tabs:** `React/src/ds/BrandTab.jsx`, `StudioTab.jsx`, `RulesTab.jsx`, `AgenticGuideTab.jsx`
- **Styles:** `React/src/ds/ds-page.css`

## Rules
1. All colours via `--bk-*` tokens — zero hardcoded hex
2. All icons from `React/src/assets/*.svg` — never Lucide in product screens
3. No `navigate(-1)` — always explicit routes
4. No dead-end buttons
5. `onTap` not `onClick` on draggable motion.div
6. React ARIA `Button` with `onPress`
7. Motion from `motion-tokens.js`
8. WCAG 2.1 AA minimum

## Figma
- **File key:** `rTAg5ODay1ac1ZZBq8lYwr`
- **Canvas node:** `2078-6541`
