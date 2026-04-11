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

## Architecture — v4 Target (see `Spec/full-build-spec.md`)

The component library is the primary deliverable. Modulo-the-product is built on top of it.

```
Modulo/
├── CLAUDE.md
├── BakeKit/           — white-label component library docs
├── Skills/            — agentic design system rules
├── React/src/
│   ├── components/    ← WHITE-LABEL LIBRARY (extract here first)
│   │   ├── AppButton/
│   │   ├── Card/
│   │   ├── TokenListItem/
│   │   ├── ActionBar/
│   │   ├── BottomNav/
│   │   ├── SearchInput/
│   │   ├── PillFilter/
│   │   ├── SwapCard/
│   │   ├── ScreenHeader/
│   │   ├── PriceDisplay/
│   │   ├── YieldBar/
│   │   ├── ChainPill/
│   │   └── index.js
│   ├── theme/         ← BrandProvider + modulo-theme.js
│   ├── ds/            — design system page
│   └── assets/        — SVG icons from Figma
├── Prototype/modulo/  — built output (served via tunnel)
├── Spec/              — build specs and assessments
├── VERSIONS.md
├── design-manifest.json
└── product.json
```

**Before building any screen:** check `components/` first. If the pattern exists there, use it. If not, extract it before using it inline.

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
9. Components go in `components/` first, screens consume them — never inline a pattern that belongs in the library
10. `box-sizing: border-box` on any element using `height: 100%` with `padding-top` (prevents layout overflow on iOS)
11. Never add `-webkit-user-select: none` to `<button>` elements — WebKit bug collapses grid/flex items (see shared.css comment)

## White-Label
All components must accept theming via `--bk-*` CSS custom properties set by `ThemeProvider`. No component should reference Modulo branding directly. The theme config lives in `theme/modulo-theme.js` — swapping it rebrands the whole product.

## Figma
- **File key:** `rTAg5ODay1ac1ZZBq8lYwr`
- **Canvas node:** `2078-6541`

## Session Handoff — Required

At the end of every session, before finishing, write a session notes file:

**Path:** `Modulo/Reviews/YYYY-MM-DD-session-notes.md` (use today's date)

**Format:**
```markdown
## Session: YYYY-MM-DD — [brief topic]

### What was built/fixed
- ...

### Decisions made (and why)
- ...

### Bugs found — root causes
- ...

### Patterns to reuse next time
- ...

### Open threads / next session
- ...
```

Then commit and push. Frank (the OpenClaw QA agent) will pick this up on the next watch-commits cycle, update the decision log, and post a digest to Discord.

This is not optional — undocumented sessions are lost sessions.
