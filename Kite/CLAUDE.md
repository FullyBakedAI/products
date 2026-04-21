# Kite — Agent Instructions

You are working on **Kite**, Ant's family travel product. This file is the entry point — read it first.

## What Kite is

Kite is a **Fully Baked flagship product**, not a personal app. GTM has two phases:

1. **White-label for tour operators** — boutique agencies (Pura Aventura tier) brand the app and hand it to their clients instead of PDFs. This is the initial wedge. **Buyer = tour operator. End-user = their traveller.**
2. **B2C luxury trip community** — opened up directly to travellers as a premium community around high-end trips.

Stack: Next.js 16 + React 19 PWA + **Modulo-canonical BakeKit (React ARIA + tokens)** + Claude API. Test case for v1.0 is a San Francisco family trip (Ant + Lorena) — this is user research signal, not the target market.

End-user personas: Ant (Organiser — wants everything) and Lorena (Visual Planner — wants simplicity). Design decisions serve both.

## Current phase: REBUILD (2026-04-20 evening)

Kite is being **rebuilt from scratch** with narrow scope. See `STATUS.md` for the full reasoning. Headline:

- **Drop**: Firebase BYO config + Settings page; existing accreted code; old Platform/BakeKit (web components paradigm)
- **Adopt**: Modulo's React ARIA + tokens BakeKit as canonical, consumed from line 1
- **Ship in v1**: Multi-trip home, Stop Card (Lorena + Ant variants), Plan creation, Journal
- **Defer to v2**: Inspirations Board, Album, Map, Highlight Reel, Memory Timeline, Settings

Three decisions are still pending Ant (repo, backend, code location) — see `STATUS.md` "Pending decisions". **Do not scaffold until they are answered.**

## Kite is a Fully Baked product

All Fully Baked rules apply here. This is not a detached build:

- **Design system**: canonical BakeKit lives at `~/.openclaw/workspace/Products/Modulo/BakeKit/` (React ARIA + `--bk-*` tokens). White-label requires themeable primitives from day one — brand tokens, swappable logos/copy, no hardcoded Kite branding in components. Same pattern as Modulo's white-label work.
- **Phase mindsets**: Discovery = empathy/research; Ideation = innovation; Definition = architectural rigor; Construction = craft. See `memory/feedback_phase_mindsets.md`.
- **MOBILE FIRST — ALWAYS**: every component and every QA pass starts on mobile. Never declare work done without a mobile screenshot QA pass. Reference design for mobile: `~/.openclaw/Products/Kite/references/travel-planner/index.html` line 1083. Set 2026-04-21 — no exceptions.
- **Visual QA at every stage**: mandatory visual+code checks at every handoff. No skipping.
- **TDD mindset**: tests before implementation on every build. From line 1 of the rebuild.
- **Enterprise quality**: no AI slop. Robust, enterprise-grade, ready for tour operators to put their name on.
- **Component sync**: every proto update cascades to DS + all site content. No drift.
- **Proactive guide behaviour**: fix problems, don't wait to be asked.

Cross-reference: `~/.openclaw/workspace/context-fullybaked.md` for FB-wide context.

## Where the code lives

**Pending decision (Ant).** Two options on the table:
1. New `kite` repo under FullyBakedAI org, cloned to `~/.openclaw/workspace/kite/`
2. Reset `main` of existing `travel-planner-next` repo, treat as fresh tree

Either way, the code lives **back inside `~/.openclaw/workspace/`** (not in a separate untracked location) so it is visible from this hub.

**Until decided, no scaffolding.**

The legacy Vercel project `travel-planner-next` (team `team_Zac7Wv0X3vG1TRQXEl8NUV97`) staging at `https://travel-planner-next.vercel.app` is left to rot — not updated by the rebuild.

## Where the context lives

Canonical hub: `~/.openclaw/Products/Kite/` (this directory).

- `STATUS.md` — current build state + pending decisions + scope
- `CLAUDE.md` — this file
- `AGENTS.md` — agent config + capabilities + spawn rules
- `DISCOVERY.md` — user research, market, pain points, product vision (intent preserved across rebuild)
- `DESIGN.md` — four component specs (Stop Card Ant/Lorena, Trip Creation, Inspirations Board, Album) with ASCII mockups (intent preserved)
- `CONTEXT.md` — running project log: decisions, principles, conversations
- `memory/MEMORY.md` — Kite memory index
- `memory/decisions/` — non-obvious decisions with rationale
- `memory/YYYY-MM-DD.md` — daily activity logs
- `references/` — prior code snapshots + spec reviews
- `assets/` — brand assets (logo, etc.) — `assets/logo.svg` is the canonical Kite wordmark (black "Kite" + red kite shape, viewBox 539×340)

The duplicate at `~/.openclaw/workspace/Products/Kite/` is **deprecated** (per file-path rule, product context belongs only here). It will be consolidated.

## Standing rules

- **Pre-flight checklist** before any build spawn: see `~/.openclaw/workspace/subagent-policy.md`. Product hub must exist + memory wiring in place + post-spawn `git status` clean. No exceptions.
- **File paths**: all context lives under `~/.openclaw/Products/Kite/` (this hub). Code under `~/.openclaw/workspace/<kite-or-travel-planner-next>/` once decided. Never in workspace root.
- **Daily log**: every session that touches Kite writes to `memory/YYYY-MM-DD.md` — what was tried, what worked, what failed.
- **Decisions**: non-obvious choices land in `memory/decisions/` with a **Why** line.
- **Promote** significant learnings up to the shared `MEMORY.md` index (`~/.claude/projects/-Users-Frank--openclaw-workspace/memory/MEMORY.md`).
- **QA gate**: before any demo link goes to Ant, full gate runs.
- **Model rule**: building = Sonnet sub-agent, conversation = Opus main. No building on Opus.
- **No scaffolding until 3 pending decisions answered** (see STATUS.md).

## The #kite Discord channel

Kite has its own dedicated `#kite` Discord channel. A **Sonnet-based agent** with full Kite + Fully Baked context runs there, aware of all product decisions and blockers. This is the primary command post for Kite work. Sync here before building.

---

## Product Domain: kite.red

**Live**: kite.red (currently empty; will serve the rebuilt app once v1 ships)

Legacy staging at `https://travel-planner-next.vercel.app` is the **old** version — not updated by rebuild.
