# Modulo — Client Engagement

## What is Modulo
Cross-chain DeFi platform. "One vault, every chain." This is BakedUX's first external client engagement — it proves the Fully Baked methodology on a real product.

## Build Pipeline — Follow Exactly
Read these before building anything:
- `Platform/BakeKit/Decisions/ADR-001-agentic-build-pipeline.md`
- `Framework/Patterns/agentic-build-loop.md`
- `Platform/Docs/building-on-bakekit.md`
- `Platform/Comms/kickoffs/2026-04-03-modulo.md`

## The 5-Stage Build Loop
1. **Mise en Place** — Extract tokens from Figma into `Platform/BakeKit/Tokens/modulo/tokens.css` using `--bk-*` CSS custom properties. Download ALL assets (icons, logos, images) to `Media/Assets/modulo/` as real files from Figma. **Hard gate:** if any asset fails or is zero bytes, stop immediately. No hand-drawn substitutes. Ever.
2. **Build** — Consume only extracted tokens and downloaded assets. No hardcoded hex values, pixel sizes, or guessed fonts. Tokens are the single source of truth.
3. **Visual QA** — Run `Platform/Scripts/visual-qa.py`. Do NOT self-evaluate. If you built it, you cannot judge it.
4. **Interaction QA** — Run `Platform/Scripts/interaction-qa.py`. 100% pass rate required.
5. **Human Gate** — Present structured QA output to Ant for review.

## File Locations
| What | Where |
|------|-------|
| Screen demos | `Platform/BakeKit/System/demos/modulo/` |
| Tokens | `Platform/BakeKit/Tokens/modulo/` |
| Assets (icons, images) | `Media/Assets/modulo/` |
| QA reports | `Media/QA/modulo/` |
| This project brief | `Platform/Comms/kickoffs/2026-04-03-modulo.md` |

## Repo
Everything lives in the `FullyBakedAI/workspace` repo, `main` branch. Do not create separate repos for Modulo.

## Component Stack
```
Product screens (Modulo UI)
    ↓ consumes
BakeKit token skin (--bk-* CSS variables)
    ↓ wraps
React ARIA primitives (accessibility, keyboard, focus)
```
See `Platform/BakeKit/Decisions/ADR-002-component-primitives.md`.

## Key Rules
- **Tokens first** — never build before extracting tokens
- **Assets are real** — download from Figma, never approximate
- **Never self-evaluate** — builder and reviewer are always separate
- **No hardcoded values** — all visual properties via `--bk-*` variables
- **Figma is a sketch** — extract intent into a coherent system, don't pixel-match every detail
- **Document as you build** — every pattern discovered feeds back to BakeKit and the Framework

## Figma File
- **URL:** https://www.figma.com/design/rTAg5ODay1ac1ZZBq8lYwr/First-steps?node-id=2078-6541
- **File key:** rTAg5ODay1ac1ZZBq8lYwr
- **Starting node:** 2078-6541

## Design Context
- Dark-first UI (DeFi standard)
- Data-heavy, financial precision required
- Mobile-first, responsive
- WCAG 2.1 AA minimum accessibility
