# Naim — Name Checker

## What is Naim
AI-powered name validation tool. Check a name across domains, trademarks, social handles, cultural sensitivity, and more — before you commit to it.

## Strategic Context
Read these from the **OpenClaw workspace** (`~/workspace/`) before building anything:
- `~/workspace/CLAUDE.md` — methodology rules, architecture principles, build pipeline
- `~/workspace/Platform/BakeKit/Decisions/` — ADRs (component stack, design language, etc.)
- `~/workspace/Platform/Docs/building-on-bakekit.md` — how to build on BakeKit
- `~/workspace/Platform/Naim/STATUS.md` — current project status and blockers

## Product Docs (this repo)
| What | Where |
|------|-------|
| Discovery | `Discovery/` |
| Personas | `Personas/` |
| Spec/Contract | `Spec/` |
| Product brief | `ProductBrief/` |
| Prototype | `Prototype/` |

## Built Artifacts (in ~/workspace/)
| What | Where |
|------|-------|
| Naim source | `~/workspace/Platform/Naim/` |
| BakeKit tokens | `~/workspace/Platform/BakeKit/Tokens/` |
| Build journal | `~/workspace/Platform/Naim/Docs/Build-Journal.md` |

## Component Stack
```
Product screens (Naim UI)
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
- **Document as you build** — every pattern feeds back to BakeKit and Framework
- **Zero-cost architecture** — free/open APIs, local processing where possible

## Personas (5)
- First-Time Founder
- Serial Builder
- Creator
- Agency Namer
- Accidental Rebrander

## See also

- [[Platform/Naim/STATUS]] — current Naim build status
- [[bakekit|BakeKit]] — design system Naim is built on
- [[overview]] — Fully Baked methodology
