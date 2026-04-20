# 2026-04-20 — Rebuild over retrofit (Option B)

**Decision**: Build a new version of Kite from scratch with narrow scope. Do not retrofit the existing `travel-planner-next` codebase.

## Why

Three foundation problems agreed in #kite this evening:

1. The design system was up in the air — components made foundation assumptions that don't hold (no canonical BakeKit dependency).
2. Firebase BYO config in Settings is hostile UX for both Lorena and tour operators (see separate decision).
3. Existing code accumulated cruft from prior versions; even running the staging URL fails.

Retrofitting would mean fixing every component's foundation assumptions one by one, while still carrying old Settings/Firebase/scope decisions that need to die. Net cost > clean rebuild on a narrow scope.

## What rebuild means

**Ship in v1 (SF test target):**
- Multi-trip home
- Stop Card (Lorena variant + Ant variant)
- Plan creation flow (describe → Claude drafts → edit)
- Journal (entries, photos, ratings)

**Defer to v2 (post-SF):**
- Inspirations Board
- Album printable output
- Map (Leaflet/Mapbox)
- Highlight Reel
- Memory Timeline
- Settings page

**Reject (Option C — full rebuild with everything)**: too much scope, would miss SF window.
**Reject (Option A — surgical patch on existing repo)**: foundation fixes can't be retrofitted without compounding cost.

## How to apply

- Existing `DESIGN.md` and `DISCOVERY.md` are preserved as **design intent** — they inform the rebuild.
- Existing implementation in `travel-planner-next/` is **reference only** — not consumed.
- Scope creep is the primary risk. Deferred features come back in v2 only after they earn their slot post-SF.
- This is the **third** version of Kite. Cost has been paid twice already. Discipline is mandatory.
