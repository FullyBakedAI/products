# Kite — Status

**Last updated**: 2026-04-20 20:55 GMT+1
**Phase**: Build → **Rebuild** (clean slate, narrow scope) — agreed in #kite this evening
**Status**: Standalone product at **kite.red** (domain reserved, no content yet)
**Code**: `~/.openclaw/workspace/Products/Kite/` — single canonical tree, cloned from `FullyBakedAI/travel-planner-next` (Next.js 16 / React 19). Builds clean as of 2026-04-20 21:00.
**Discord**: `#kite` — Sonnet agent with full Kite + Fully Baked context

---

## What changed (2026-04-20 evening)

After reviewing the current build, three foundation problems agreed:

1. **Design system was up in the air.** Components made foundation assumptions that don't hold; no clean dependency on a canonical BakeKit. → Canonical DS = `Products/Modulo/BakeKit/` (React ARIA + `--bk-*` tokens). To be lifted into a shared platform package; Kite consumes it as a dependency.
2. **Firebase in current form is wrong.** BYO Firebase config in Settings is hostile UX for both Lorena (won't paste a config blob) and tour operators (won't admin Firebase). → Ripped out. localStorage-only for SF test. Backend-we-own (Supabase or CF Workers + D1/R2) ADR drafted in parallel for v1.0.
3. **Existing code accumulated cruft from prior versions.** Even running the current staging URL fails; retrofitting is more expensive than rebuilding narrow scope.

→ **Decision: Option B — clean rebuild, narrow scope**, BakeKit consumed from line 1, no Firebase, no Settings page.

---

## Build scope (rebuild v1)

**Ship:**
- Multi-trip home
- Stop Card (Lorena variant + Ant variant)
- Plan creation flow (describe → Claude drafts → edit)
- Journal (entries, photos, ratings)

**Deferred to v2 (post-SF):**
- Inspirations Board
- Album printable output
- Map (Leaflet/Mapbox)
- Highlight Reel
- Memory Timeline
- Settings page (Firebase config — gone entirely)

Cut from v1 ≠ deleted forever. v2 features come back only after they earn their slot post-SF.

---

## Pending decisions

1. ~~**Repo**~~: **Resolved 2026-04-20 21:00** — keep `FullyBakedAI/travel-planner-next` as canonical remote (existing history, Vercel wired). Reset/rename later if/when `kite` repo is created.
2. ~~**Backend**~~: **Resolved 2026-04-20 ~22:20** — localStorage-only for SF, Supabase ADR drafted in parallel. See `memory/decisions/2026-04-20-backend-localstorage-then-supabase.md`.
3. ~~**Code location**~~: **Resolved 2026-04-20 21:00** — `~/.openclaw/workspace/Products/Kite/` (workspace, alongside other products). Cloned and verified building.

All three rebuild blockers cleared. Scaffolding is unblocked.

---

## Design system foundation

- **Canonical**: `~/.openclaw/workspace/Products/Modulo/BakeKit/` (React ARIA + `--bk-*` tokens). Validated across 137 tickets / 4 waves on Modulo.
- **Plan**: lift to top-level shared package, Kite + Modulo + future products consume via workspace symlink or private package.
- **Legacy**: `Platform/BakeKit/` (web components) is older paradigm — not what Kite consumes.
- **Why**: Kite must build *on* BakeKit, not alongside it. The design system was the foundation that wasn't there.

See decision: `memory/decisions/2026-04-20-canonical-bakekit.md`.

---

## Backend

- **SF test**: localStorage-only. Sync is not load-bearing for a 5-day trip with two phones.
- **v1.0**: backend we own. Supabase or Cloudflare Workers + D1/R2. ADR pending.
- **What's gone**: BYO Firebase config in Settings. The Settings page itself is gone for v1.
- **What's kept**: the sync indicator UI pattern — points at the new backend later.

See decision: `memory/decisions/2026-04-20-drop-firebase.md`.

---

## Done (prior versions — preserved as design intent, not consumed by rebuild)

- Discovery phase: `DISCOVERY.md` (users, market, pain, vision, monetisation)
- Design phase: `DESIGN.md` (4 component specs with ASCII mockups + principle annotations)
- Decisions log: `CONTEXT.md`
- Multi-trip home, Plan mode, Journal mode, Copilot, Memory timeline, Highlight reel, Inspirations Board component (built but not integrated)

These docs stay valid as design intent. **The implementation does not.**

---

## Open — quality (carries to rebuild)

- Mobile responsive testing (iPhone 12–15 Pro)
- Visual regression pass against `DESIGN.md` mockups
- TDD coverage for Stop Card variants from line 1
- San Francisco trip built from scratch inside the rebuilt app

---

## Decisions made (preserved + new)

- Product name locked: **Kite**
- Primary persona: boutique family travel (Pura Aventura tier)
- Two user roles per trip: Organiser (Ant) + Visual Planner (Lorena)
- Architecture: Capture → Live → Remember
- AI is infrastructure, not identity
- **GTM**: white-label for tour operators (Phase 1) → B2C luxury trip community (Phase 2)
- **Kite is a Fully Baked flagship product** — all FB rules apply (design tokens, QA gates, phase mindsets, enterprise quality, no AI slop)
- **NEW (2026-04-20 evening)**: Firebase BYO config dropped — backend-we-own for v1.0
- **NEW (2026-04-20 evening)**: Rebuild over retrofit — Option B agreed
- **NEW (2026-04-20 evening)**: Modulo BakeKit is canonical DS

---

## Next steps (priority order, post Ant decisions)

1. Answer the three Pending Decisions above
2. Lift Modulo BakeKit into a shared package, set up workspace symlink
3. Scaffold rebuild with BakeKit consumed from line 1 (TDD from the start)
4. Stop Card (Lorena + Ant variants)
5. Multi-trip home
6. Plan creation flow (Claude API for Step 2)
7. Journal mode
8. Build SF trip from scratch inside the rebuilt app
9. Run QA gate (Fully Baked process)
10. Real-world test with the family

---

## Known risks

- **Lorena adoption**: if she doesn't use the app on trip, product fails. SF test is the real signal.
- **Photo storage at scale**: localStorage hits size limits; backend-we-own solves this in v1.0.
- **Print quality** (when Album returns in v2): untested on a real printer.
- **Backend latency in deferring**: fine *if* SF test is local-only — confirm in pending decision (2).
- **Third rebuild**: this is the third version of Kite. Cost has been paid twice already. Rebuild discipline (narrow scope, no scope creep) is mandatory.

---

## Vercel staging (legacy)

`travel-planner-next.vercel.app` — old version. Will rot rather than be updated. Live URL replaced when rebuild ships.
