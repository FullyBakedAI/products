# ClawCommand — Command Bar

## What is ClawCommand
Spotlight-style command bar for OpenClaw products. Keyboard-first, voice-capable, white-label ready. The universal interaction layer across all BakeKit products.

## Strategic Context
Read these from the **OpenClaw workspace** (`~/workspace/`) before building anything:
- `~/workspace/CLAUDE.md` — methodology rules, architecture principles, build pipeline
- `~/workspace/Platform/BakeKit/Decisions/` — ADRs (component stack, design language, etc.)
- `~/workspace/Platform/Docs/building-on-bakekit.md` — how to build on BakeKit
- `~/workspace/Platform/ClawCommand/STATUS.md` — current project status and blockers
- `~/workspace/Platform/ClawCommand/CLAUDE.md` — product scope, rules, tech stack

## Product Docs (this repo)
| What | Where |
|------|-------|
| Personas | `Personas/` |
| Discovery | `Discovery/` |
| Product brief | `ProductBrief/` |
| Prototype | `Prototype/` |

## Built Artifacts (in ~/workspace/)
| What | Where |
|------|-------|
| ClawCommand source | `~/workspace/Platform/ClawCommand/` |
| Voice architecture | `~/workspace/Platform/ClawCommand/Docs/voice-architecture.md` |
| BakeKit tokens | `~/workspace/Platform/BakeKit/Tokens/` |

## Component Stack
```
Product screens (ClawCommand UI)
    ↓ consumes
BakeKit token skin (--bk-* CSS variables)
    ↓ wraps
React ARIA primitives (accessibility, keyboard, focus)
```
See `~/workspace/Platform/BakeKit/Decisions/ADR-002-component-primitives.md`.

## Key Rules
- **Tokens first** — never build before extracting tokens
- **No hardcoded values** — all visual properties via `--bk-*` variables
- **Never self-evaluate** — builder and reviewer are always separate
- **Keyboard-first** — every action must be keyboard accessible
- **White-label ready** — all theming via tokens, no product-specific hardcoding
- **Document as you build** — every pattern feeds back to BakeKit and Framework

## Personas (4)
- Keyboard Pilot
- Design-Led Builder
- Offline Operator
- White-Label Client
