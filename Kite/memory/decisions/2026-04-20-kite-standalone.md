---
date: 2026-04-20
title: Kite is now a standalone product at kite.red
tags: [product-positioning, gtm, fully-baked]
---

# Decision: Kite Becomes Standalone Product

**Date**: 2026-04-20 19:10 GMT+1  
**Owner**: Ant  
**Scope**: Product positioning, GTM, organizational structure

## What Changed

Kite transitioned from "personal family travel app" to **Fully Baked flagship product** with its own domain and dedicated Discord channel.

- **Domain**: kite.red (reserved, empty for now; will serve live app after Phase 1)
- **Discord**: Dedicated `#kite` channel with Sonnet-based agent
- **Product Hub**: Canonical location at `~/.openclaw/Products/Kite/` (not workspace root)
- **GTM**: White-label for tour operators (Phase 1) → B2C luxury community (Phase 2)

## Implications

1. **All Fully Baked rules apply**: Design tokens, Bake Sheet component contract, phase mindsets, TDD, visual QA gates, enterprise quality — inherited from day 1.

2. **Multi-tenant architecture from day 1**: RLS policies, operator-aware theming, tenant isolation — even though Phase 1 is single-user (Ant). Phase 2 just "flips the switch."

3. **Component sync discipline**: Every design update cascades to design system. No drift allowed.

4. **Cross-context loading**: Agents must load both Kite CLAUDE.md + Fully Baked context. Not a silo.

5. **Dedicated agent**: Kite has its own Discord-bound Sonnet agent with full product context, separate from #general / #modulo.

## Why This Matters

**Fully Baked is positioning as a full UX agency replicating with agentic team.** Kite is a test case: if Kite ships as enterprise-grade (not "AI slop"), it proves the model works. This is not a side project — it's the north star for what Fully Baked agents can produce.

**White-label from day 1 means**: Design decisions serve both Ant (Phase 1 single user) and Phase 2 operators simultaneously. No "we'll theme it later" — it's built in from the schema up.

**Dedicated #kite channel** means: Full product context lives there, decisions are captured there, blockers surface there. A single source of truth.

## References

- `~/.openclaw/Products/Kite/CLAUDE.md` — Product brief
- `~/.openclaw/workspace/context-fullybaked.md` — Fully Baked context (load this every Kite session)
- `memory/decisions/2026-04-20-blockers.md` — The two things blocking Peru trip
