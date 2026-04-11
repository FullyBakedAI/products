# ADR-008: White-Label Component Architecture

**Date:** 2026-04-11  
**Status:** Accepted  
**Deciders:** Ant (product owner), Frank (QA/orchestration)

---

## Context

The Modulo prototype has 18 screens built with inline CSS patterns and no extracted component library. All styling lives in per-screen CSS files and shared.css. Components are monolithic (300–600 lines each). The next phase requires:

1. A component library that can be repackaged for future products
2. Full end-to-end build quality across all screens
3. A clear path to React Native without a full rewrite

The engagement is also a Fully Baked methodology proof-of-concept — every build artifact should be reusable IP.

---

## Decision

Extract a white-label React ARIA component library at `React/src/components/`. Modulo-the-product is built on top of it — not alongside it.

**Component layer** (`React/src/components/`):
- 12 components, each in its own folder with index.jsx + styles.css
- React ARIA primitives for accessibility
- All styling via `--bk-*` CSS custom properties — zero hardcoded brand values
- Props-driven API, no Modulo-specific logic

**Theme layer** (`React/src/theme/`):
- `ThemeProvider.jsx` accepts a brand config object, injects CSS custom properties at root
- `modulo-theme.js` is the Modulo brand config (colors, fonts, logo, name)
- Swapping `modulo-theme.js` for a different config rebrands the entire product

**Product layer** (`React/src/[screens]`):
- Screens import from `components/` — never define patterns inline that belong in the library
- Modulo-specific business logic (token data, DeFi flows) lives here, not in components

---

## Consequences

### Good
- Component library is publishable and reusable across future products
- Theming is first-class — any future client gets a white-label wallet by swapping one config file
- React ARIA handles accessibility by construction — no bolt-on ARIA attributes needed
- Cleaner screens: each screen is ~50% shorter when consuming components vs. inline patterns
- React Native path: component API contracts can be honoured by a native rendering layer
- Methodology IP: the component library is a deliverable the consulting practice can sell

### Trade-offs
- Upfront extraction cost: ~1-2 sessions to extract 12 components before screens are rebuilt
- CSS-in-separate-files (not CSS modules or styled-components) — consistent with existing approach but means class name collisions are possible; mitigated by scoped class naming convention (component-name prefix)

### React Native implications
The `--bk-*` CSS token system is web-only. For React Native, tokens must also be exported as JS constants from `theme/tokens.js`. This should be added during the theme layer build so both platforms can consume the same values. See `Spec/react-native-assessment.md` for full migration plan.

---

## Rejected alternatives

**Keep components inline**: Fast short-term but produces zero reusable IP and makes future products start from scratch. Inconsistent with "sell the exhaust" principle.

**CSS Modules / Styled Components**: Would require a toolchain change mid-project with no clear benefit over the existing scoped CSS approach.

**react-native-web (one codebase)**: React ARIA doesn't work well with RN Web's translation layer. Creates more problems than it solves. Separate rendering layers with shared logic is the right architecture (see ADR rationale in react-native-assessment.md).
