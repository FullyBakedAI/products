# 2026-04-20 — Canonical BakeKit for Kite = Modulo BakeKit

**Decision**: Kite's design system foundation is the React ARIA + tokens BakeKit currently living at `~/.openclaw/workspace/Products/Modulo/BakeKit/`. To be lifted into a shared platform package and consumed by Kite as a real dependency.

## Why

Two BakeKits exist:

- `Platform/BakeKit/` — older web-components paradigm. Brand "retired" (see `Platform/BakeKit/STATUS.md`). Not what Kite needs.
- `Products/Modulo/BakeKit/` — React ARIA primitives + `--bk-*` token skin + BrandProvider. Validated across 137 tickets / 4 waves on Modulo. White-label-ready.

Kite is a React app with a white-label GTM. The Modulo stack is the only one of the two that fits.

The current state — Kite shipping ad-hoc components alongside no canonical DS dependency — is what made the design system feel "up in the air". Building *on* BakeKit (not alongside) is the fix.

## What this means concretely

- The Modulo BakeKit is **lifted** out of `Products/Modulo/` into a top-level shared package (exact location TBD as part of scaffold work, but workspace-resolvable).
- Kite consumes BakeKit via workspace symlink or private package — not copy-paste.
- Modulo continues to consume the same canonical package (no fork).
- Future products do the same.
- React ARIA → tokens → product components stack stays as defined in `project_bakekit_stack.md`.

## How to apply

- No Kite component is built without first checking BakeKit for the primitive.
- Tokens come from `--bk-*` CSS variables. No raw values in Kite components.
- Brand-specific theming uses `BrandProvider` + a Kite theme config — same pattern as `moduloTheme`.
- Any new primitive Kite needs that doesn't exist in BakeKit yet gets *added to BakeKit*, then consumed — never built only inside Kite.
- Legacy `Platform/BakeKit/` (web components) is not consumed by Kite. Treat as ClawCommand-era artefact.
