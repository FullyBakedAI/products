# Decision: Kite Product hub structure (2026-04-20)

## Decision

Kite gets a Product hub at `~/.openclaw/Products/Kite/` for context + memory + status. The Next.js app stays at `~/.openclaw/workspace/travel-planner-next/` as its own git repo (FullyBakedAI org remote) — it is gitignored from the workspace repo.

## Why

The app has its own remote (`github.com/FullyBakedAI/travel-planner-next`) and a Vercel project with paths locked to the current directory. Moving the code would break both. But without a Product hub the travel work had no shared-memory surface — MEMORY.md didn't know about Kite, `#travel` couldn't find its context, and the pre-flight checklist had nowhere to point.

Decoupling the hub (context/memory) from the app (code) keeps both stable and makes the pre-flight checklist satisfiable without filesystem surgery.

## How to apply

- All Kite strategy, context, status, and memory lives under `~/.openclaw/Products/Kite/`.
- All code lives under `~/.openclaw/workspace/travel-planner-next/` (gitignored from workspace).
- Cross-references: the app's own `DISCOVERY.md`/`DESIGN.md`/`CONTEXT.md` are the canonical product docs; the hub's `STATUS.md` mirrors build state; the hub's `memory/` is the session activity log.
- Future Kite spawns: pass `~/.openclaw/Products/Kite/CLAUDE.md` as the primary context file, with `travel-planner-next/` as the working directory.

## Considered alternatives

- **Move the app into `~/.openclaw/Products/Kite/`** — rejected. Breaks Vercel project paths and the separate git repo's remote relationship. Rename churn with no upside.
- **Leave everything in workspace root** — rejected. Violates file-path convention, no Product hub, no way to satisfy pre-flight checklist.
- **Duplicate docs between hub and app** — rejected. Two sources of truth always drift. Hub references app docs by path.
