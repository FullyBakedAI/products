# 2026-04-20 — Backend: localStorage for SF, Supabase ADR in parallel

**Decision**: SF test runs on **localStorage-only**. Supabase ADR is drafted in parallel for v1.0. No backend dependency blocks the rebuild scaffold.

**Status**: Approved 2026-04-20 ~22:20 GMT+1 — last of the three rebuild blockers cleared. Scaffolding can start.

## Why this option (not Supabase from line 1)

- **Time-to-first-working-build is the priority.** Rebuild was chosen over retrofit precisely because the old code accumulated cruft. Adding Supabase wiring before the first Stop Card renders re-introduces foundation risk.
- **SF test is two phones, five days.** Cross-device sync is not load-bearing for that signal. localStorage is sufficient.
- **The product-market-fit signal is Lorena's behaviour, not the backend's reliability.** Spending the first week on auth + RLS + sync delays the only signal that matters.
- **Backend is reversible.** A localStorage adapter behind a `Storage` interface lets us swap in Supabase without rewriting screens.
- **Consistent with prior decisions**: Drop Firebase (2026-04-20-drop-firebase.md) explicitly noted the backend ADR could be parallel, not blocking.

## What this means in practice

- Scaffold all data access behind a `Storage` interface; the localStorage adapter is the v1 implementation.
- Supabase ADR drafted in parallel: schema sketch (trips, stops, journal_entries, photos), auth model (magic link), RLS policy outline, storage bucket layout for photos. Not implemented yet.
- v1.0 ships when Supabase adapter is wired and the cross-device path works for Lorena + Ant on different phones.
- Photo storage: localStorage works for SF (compress aggressively, lazy-load). v1.0 moves to Supabase Storage.

## What stays open

- Choice between Supabase vs Cloudflare Workers + D1/R2 for v1.0 — defer until SF test results in. Supabase is the working assumption.
- Auth model: magic link is the working assumption; no decision needed until v1.0 implementation.

## How to apply

- All new screens use the `Storage` interface; never import `localStorage` directly.
- Rebuild scaffold proceeds: lift Modulo BakeKit → shared package → Stop Card (TDD) → Multi-trip home → Plan creation flow → Journal.
- Supabase ADR lives at `~/.openclaw/Products/Kite/memory/decisions/2026-XX-XX-supabase-adr.md` (TBD), drafted in parallel.
