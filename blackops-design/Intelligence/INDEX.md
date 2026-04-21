# BlackOps — Intelligence Index

> *Stage 01. Recon on ourselves before we deploy. The deck is a hypothesis. This folder is where we try to break it before a VC does.*

**Engagement:** BlackOps Stage 01 — Intelligence on Ourselves
**Mode:** Delta (deck exists; we validate and fill gaps)
**Target artefact:** Intelligence Report for the NY May 2026 strike
**Started:** 2026-04-21

---

## Substrate

This Intelligence uses the Alpha Suite Discovery v2 substrate:

- **`atoms/`** — structured findings, one atom per file, every atom has an ID (e.g. `BO-PROBLEM-001`), frontmatter citations, and propagates forward through Architecture → Construction → Measurement (Evidence Spine).
- **`corpus/`** — the heterogeneous raw material that *feeds* atoms. Pitch deck, brand assets, competitor snapshots, interview transcripts, market reports, workshop exports. Not just markdown — anything. URIs in `manifest.json` point at `file://`, `https://`, `gdrive://`, `dropbox://` — backend is resolver-side.
- **`manifest.json`** — machine-readable index. Atom IDs → paths → source URIs. This is what a future client portal reads to render the view.
- **`pack/`** — rendered Intelligence Report when the Gate is passed.

---

## Atom areas (7 meta-areas, 25+ section types)

| Area | Code | Atom types |
|---|---|---|
| Problem & Market | A | PROBLEM, MARKET, WHY-NOW |
| People | B | PERSONA, JTBD, PAIN, TRIGGER, ANTI-PERSONA, INTERVIEW |
| Landscape | C | COMP, DIST, PRICING, PARTNER |
| Brand & Design | D | POSITION, AESTHETIC, VOICE, NAMING |
| Differentiation | E | AI-OPP, GAP, MOAT |
| Feasibility | F | TECH, REG, TEAM, RISK |
| Business | G | MONEY, GTM, METRIC |

---

## Current atoms

| ID | Title | Area | State | Confidence | Triangulated |
|---|---|---|---|---|---|
| [BO-PROBLEM-001](atoms/A-problem-market/BO-PROBLEM-001-core-problem.md) | Core Problem — Founder execution gap and fund-level Adoption Alpha loss | A | draft-v0.1 | medium | no |
| [BO-PROBLEM-002](atoms/A-problem-market/BO-PROBLEM-002-scattergun-slither.md) | Scattergun-Slither — founder thinks they know, spreads thin, drifts to slop | A | draft-v0.1 | medium-high | no |
| [BO-PERSONA-OPERATOR-001](atoms/B-people/BO-PERSONA-OPERATOR-001-ant-ludlow.md) | Ant Ludlow — BlackOps operator / founder | B | draft-v0.1 | medium | no |
| [BO-COMP-001](atoms/C-landscape/BO-COMP-001-antler.md) | Antler — Day-zero talent-first venture studio; closest structural comparable | C | draft-v0.1 | medium | no |
| [BO-COMP-002](atoms/C-landscape/BO-COMP-002-a16z.md) | a16z — Full-service VC platform; proves execution-layer gap at top of market | C | draft-v0.1 | medium-low | no |
| [BO-POSITION-001](atoms/D-brand-design/BO-POSITION-001-compelling-differentiation.md) | Compelling Differentiation — BlackOps' core positioning move | D | **stub-v0.1** (open probe) | low-medium | no |

## Hypotheses surfaced by atoms

| ID | From | Claim |
|---|---|---|
| H-COMP-001 | BO-COMP-001 | Funds who engaged with Antler will reflexively file BlackOps into the "another-one-of-those" bucket — segment NY pitch list accordingly |
| H-COMP-002 | BO-COMP-002 | Mid-tier VCs ($100M–$500M AUM) are the primary BlackOps customer — cannot build a16z-scale platform but feel the gap acutely |

---

## Corpus status

| Folder | Status | Next action |
|---|---|---|
| `corpus/pitch-deck/` | referenced via `../context-blackops.md` | — |
| `corpus/brand-assets/` | referenced via `../index.html`, `../preview*.png` | — |
| `corpus/competitors/` | **partial** — Antler + a16z sourced (single-model) | Triangulate existing two, add EF, Atomic, Pioneer Square Labs, Betaworks, High Alpha |
| `corpus/interviews/` | **1 in progress** — [operator founder Discovery (2026-04-21)](corpus/interviews/2026-04-21-founder-discovery.md); 0 VC partner interviews | Continue operator Discovery (paused at "compelling" probe); scope VC interview targets and book before NY trip |
| `corpus/market/` | **empty** | TAM/SAM/SOM for fund-embedded studios |
| `corpus/regulatory/` | **empty** | SPV/round-allocation legal constraints (Gemini long-context) |
| `corpus/why-now/` | **empty** | Post-2023 VC power-law + AI-native tooling surge |
| `corpus/context/` | holds supporting notes (`alpha-suite-reframe-2026-04-21.md`, `_exhaust.md`) | — |

---

## Intelligence-to-Architecture Gate

Before any further BlackOps build (deck iteration, site, sales collateral), this Intelligence must pass the Gate:

1. Does the pitch's primary message deliver on the core pain identified here?
2. Does the monetization model (equity-in-round) match what VCs actually sign up for?
3. Does the positioning honour what already works (track record, Talos intros) without leaning on it as the whole story?
4. Have we checked our own bias — building what Intelligence says to build, or what we find interesting to build?

**Gate status:** not yet passed.

---

## See also

- `README.md` — the doctrine framing, mindset, and full 11-section checklist in BlackOps voice
- `manifest.json` — machine-readable substrate index
- `../context-blackops.md` — captured pitch + brand + doctrine (this is what Intelligence tests)
- `../STATUS.md` — engagement status
- `_exhaust.md` — reusable intake patterns from running Intelligence on ourselves
