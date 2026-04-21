# Exhaust Catalogue — Kite

**Purpose:** Live register of productisable shapes emerging from the Kite build. Every template, prompt, gate, pattern, or workflow that could live outside Kite gets logged here the moment it takes shape — not retroactively.

**What counts as exhaust:** Any primitive — a prompt template, a gate checklist, an agent config, a spec pattern, a component contract, a workflow — that produced value once and could produce it again in another project.

**What gets captured:** The *primitive itself* (file path to the actual artifact), not just a description. Modulo lost its primitives by describing-not-preserving. Don't repeat.

**Maturity levels:**
- **raw** — discovered in use, not yet extracted
- **extracted** — pulled out into a standalone artifact in a reusable location
- **packaged** — documented with usage guide, ready to hand to another project
- **productised** — sellable artifact (internal product, Alpha Suite module, or external offer)

---

## Catalogue

| # | Shape | Source phase | Customer | Maturity | Primitive location | Notes |
|---|-------|--------------|----------|----------|--------------------|-------|
| 1 | **Bake Sheet — component contract** | Construction | Product teams running agentic builds | productised | `~/.openclaw/Products/Kite/bake-sheets/` (00–07) | Originated pre-Kite; Kite is second serious application. Bridge between Figma MCP and Claude Code. |
| 2 | **Overnight agentic scaffold pattern** | Construction | Any FB-style product shop | raw | Kite overnight 2026-04-20/21 build | Bake Sheets → Claude Code agent on Sonnet → full Next.js scaffold deployed in one run. Document the prompt/setup before it's lost. |
| 3 | **QA gate checklist (Kite 2026-04-21)** | Construction | Any client project | raw | Kite morning QA pass commits | Missing assets, accessibility ids, localStorage key bugs, robots.txt hygiene. Generalise into reusable gate. |
| 4 | **Two-phase GTM framework (wedge → community)** | Discovery | Client project Discovery phase | raw | `project_kite_gtm.md` memory + Kite DISCOVERY.md | B2B-white-label-first narrative pattern. Applies broadly to "product that wants to be B2C eventually." |
| 5 | **Discovery document structure (Kite DISCOVERY.md)** | Discovery | Alpha Suite Discovery module | raw | `~/.openclaw/Products/Kite/DISCOVERY.md` | Problem framing, personas, tier/revenue map, positioning. Template candidate. |
| 6 | **End-user vs buyer persona split** | Discovery | White-label product Discovery | raw | — (concept flagged, not yet a template) | Kite has end-user personas but not buyer persona. The gap itself is the insight; formalise both-must-exist as a Discovery rule. |
| 7 | **Themeable primitives from day one (white-label readiness)** | Construction | Any product with B2B2C potential | raw | `lib/theme/kite-theme.ts` + `ThemeProvider.tsx` + `--bk-*` CSS vars | Modulo proved the pattern; Kite is re-applying. Extract into a "white-label-ready design tokens" primitive. |
| 8 | **Agentic DS extraction pipeline** | Construction | Alpha Suite Construction module | raw | Referenced in memory `feedback_sell_own_exhaust.md` | Flagged in past work; needs primitive to be located and preserved. |
| 9 | **Spec-first approval gate** | Discovery → Construction bridge | Any agentic build team | raw | `feedback_spec_first.md` memory rule | Rule exists; the *enforcement mechanism* (what a spec must contain, how approval is granted) is the productisable shape. |
| 10 | **Visual regression prevention gate** | Construction | Any design-led build | raw | `feedback_visual_regression_prevention.md` memory rule | Hard gate before any CSS/layout commit. Primitive: baseline capture + diff tooling config. |
| 11 | **Phase-specific agent mindsets** | Meta / all phases | Alpha Suite core | raw | `feedback_phase_mindsets.md` | Discovery = deep research/empathy; Ideation = innovation; Definition = architectural rigor. Formalise as agent system prompts per phase. |
| 12 | **BlackOps Log pattern (this file's sibling)** | Meta | Alpha Suite / BlackOps case studies | extracted | `BlackOps-Log.md` (this directory) | The log format itself is productisable — every Alpha Sprint should keep one. |
| 13 | **Exhaust Catalogue pattern (this file)** | Meta | Alpha Suite / BlackOps case studies | extracted | `Exhaust-Catalogue.md` (this directory) | Same — the catalogue format is the meta-product. |

---

## Capture protocol (for future entries)

When a new shape appears, add a row with:
1. **Shape name** — short, descriptive
2. **Source phase** — Discovery / Ideation / Construction / Measurement / Meta
3. **Customer** — who would pay for or reuse this (be specific)
4. **Maturity** — raw / extracted / packaged / productised
5. **Primitive location** — **actual file path or commit ref**, not a description
6. **Notes** — context, adjacent work, gaps

**Do not describe-without-preserving.** If the primitive isn't checked in somewhere, either check it in or note "primitive lost — recreate before capture is valid."

---

## Open exhaust questions

- Can the Modulo kanban process be generalised into an Alpha Suite QA module?
- Is the "overnight agentic scaffold" reproducible, or was it Kite-specific?
- What's the minimum set of primitives needed to pitch "the playbook" in a VC deck without naming Fully Baked?
