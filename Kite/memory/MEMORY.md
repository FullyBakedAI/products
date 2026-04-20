# Kite Product Memory Index

This is the canonical memory store for Kite project decisions, learnings, and context. All agents working on Kite cross-reference these.

## Decisions

- [2026-04-20: Kite is a Fully Baked flagship product](decisions/2026-04-20-kite-standalone.md) — Standalone product at kite.red; all FB rules apply; white-label from day 1; phase mindsets required
- [2026-04-20: Two blockers gate Peru trip](decisions/2026-04-20-blockers.md) — Lorena's Stop Card view + Claude API integration must ship before May 2026 (carries into rebuild scope)
- [2026-04-20 evening: Rebuild over retrofit (Option B)](decisions/2026-04-20-rebuild-decision.md) — Clean rebuild, narrow scope. v1 = Multi-trip home + Stop Card + Plan + Journal. Defer Inspirations, Album, Map, Highlight Reel, Memory Timeline.
- [2026-04-20 evening: Drop Firebase BYO from Kite](decisions/2026-04-20-drop-firebase.md) — Settings page gone. localStorage-only for SF. Backend-we-own ADR drafted in parallel for v1.0.
- [2026-04-20 evening: Canonical BakeKit = Modulo BakeKit](decisions/2026-04-20-canonical-bakekit.md) — React ARIA + tokens lifted into shared package. Kite consumes as dependency, not copy-paste.
- [2026-04-20 ~22:20: Backend = localStorage for SF, Supabase ADR in parallel](decisions/2026-04-20-backend-localstorage-then-supabase.md) — Last of the three rebuild blockers cleared. Scaffold all data access behind a `Storage` interface; Supabase wired in for v1.0.

## Pending Decisions

All three rebuild blockers cleared. Scaffolding is unblocked. See `STATUS.md`.

## Session Logs

- Daily logs go here: `YYYY-MM-DD.md`

---

**Last Updated**: 2026-04-20 22:20 GMT+1
