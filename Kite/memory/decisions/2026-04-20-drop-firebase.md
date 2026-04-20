# 2026-04-20 — Drop Firebase BYO from Kite

**Decision**: Rip out user-facing Firebase config from Kite. The Settings page goes too. localStorage-only for SF test. Backend-we-own (Supabase or CF Workers + D1/R2) ADR drafted in parallel for v1.0.

## Why

The current "user pastes a Firebase config blob into Settings" model fails for both phases of GTM and for the SF test:

- **Lorena (SF test)**: she will never paste a Firebase config blob. The persona test fails before the Stop Card does.
- **White-label tour operators (Phase 1)**: they want a managed backend they don't own. BYO-Firebase makes every operator a Firebase admin. They won't.
- **B2C luxury community (Phase 2)**: end users won't either.

The BYO model only made sense as a "I need *some* sync to demo cross-device" stopgap. It has served. Time to drop it.

## What goes

- `Settings` page (entirely — for v1)
- Firebase config UI
- BYO-supplied Firebase credential storage
- The dependency on the user being a backend admin

## What stays / changes

- **Sync indicator UI pattern** is kept — it's reusable, just points at the new backend later.
- **For SF test**: localStorage-only. Sync is not load-bearing for a 5-day trip with two phones.
- **For v1.0**: backend we own. Tenant key per operator. End user configures nothing.
- **Photo storage** (currently localStorage, will hit limits) gets solved by the backend-we-own (Supabase Storage or R2).

## How to apply

- No new code touches Firebase.
- `lib/firebase*` deletions land in the rebuild scaffold, not as a separate refactor of the old repo.
- ADR for backend choice (Supabase vs. CF Workers + D1/R2) is a parallel artefact — does not block SF test if SF is local-only.
- Pending Ant decision: confirm "localStorage-only for SF + Supabase ADR drafted in parallel" — see `STATUS.md`.
