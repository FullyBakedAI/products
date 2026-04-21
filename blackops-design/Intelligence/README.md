# BlackOps — Stage 01 · Intelligence

> *"Mapping the terrain. Market, user, technical landscape. Output: Intelligence Report."*
> — BlackOps Doctrine, Stage 01

This is BlackOps running Intelligence on BlackOps. Same rigour we would deploy for a portfolio company, turned on ourselves before the NY strike.

Two outputs from one motion:

1. **The Intelligence Report** — the rigorous recon that sharpens the NY May 2026 pitch, stress-tests the Alpha-by-Design thesis, and produces the go / no-go case for BlackOps as a standing capability.
2. **The exhaust** — the questions, flow, and tension points, captured as a reusable intake pattern (see `_exhaust.md`). Same intake substrate applies at company / product / experience altitudes — Intelligence-as-onboarding is the likely downstream shape.

## Mindset

Research & Empathy. Every slide in `context-blackops.md` is a hypothesis, not a foundation. The deck reads sharp — that is exactly the failure mode. Intelligence is where we try to break it before a VC does. Nothing progresses to Stage 02 (Architecture) until the Intelligence-to-Architecture Gate is passed.

## Substrate

This Intelligence runs on the Alpha Suite Discovery v2 substrate. Start at **[INDEX.md](INDEX.md)** for the atom list, corpus status, and Gate state. The folder structure:

- **`atoms/`** — one file per finding, IDs like `BO-PROBLEM-001`, organised by the seven meta-areas below
- **`corpus/`** — the heterogeneous raw material that feeds atoms (pitch deck, brand, competitors, interviews, market, regulatory, why-now, supporting context)
- **`manifest.json`** — machine-readable index; atom → source URIs; backend-agnostic
- **`pack/`** — rendered Intelligence Report when the Gate passes

### Non-markdown is first-class

Corpus is **not** a markdown folder. Any file format or external tool can live here — the rule is that every source is registered in `manifest.json` with a URI. The resolver is viewer-side, so the same manifest renders whether the backend is local disk, Drive, Dropbox, SharePoint, or a SaaS board.

Supported URI schemes (extend as needed):

| Scheme | Used for |
|---|---|
| `file://` | Local files — markdown, PDF, image, audio, video, spreadsheet, export |
| `https://` | Any web source — articles, deck-on-cloud, published docs |
| `gdrive://`, `dropbox://`, `s3://`, `sharepoint://` | Cloud drives — resolver handles auth |
| `miro://`, `figjam://`, `figma://` | Boards and canvases — live link, resolver renders an embed or preview |
| `loom://`, `youtube://` | Video — interview recordings, walkthroughs, workshop captures |
| `notion://` | Notion pages — if a client's corpus lives there |

A Miro board of a competitor teardown goes in `corpus/competitors/` (semantic location), registered under its native `miro://` URI (native source of truth). Same for a FigJam workshop export under `corpus/workshops/` or `corpus/market/` depending on what it captured. The folder is about *what the material is about*; the URI captures *where it actually lives and in what format*.

## The seven meta-areas

| Area | Code | Doctrine mapping | Atom types |
|---|---|---|---|
| Problem & Market | A | Sections 1, 2 (part), 9 | PROBLEM, MARKET, WHY-NOW |
| People | B | Sections 2, 7 | PERSONA, JTBD, PAIN, TRIGGER, ANTI-PERSONA, INTERVIEW |
| Landscape | C | Section 3 | COMP, DIST, PRICING, PARTNER |
| Brand & Design | D | (new in v2) | POSITION, AESTHETIC, VOICE, NAMING |
| Differentiation | E | Sections 4, 5 | AI-OPP, GAP, MOAT |
| Feasibility | F | Section 8 | TECH, REG, TEAM, RISK |
| Business | G | Sections 6, 10, 11 | MONEY, GTM, METRIC |

The old 11-section doctrine checklist is absorbed into these seven areas. No content dropped — same scope, cleaner organisation, plus atom-level granularity so findings can propagate forward into Architecture → Construction → Measurement.

## Intelligence-to-Architecture Gate

Before any further BlackOps build (deck iteration, site, sales collateral), this Intelligence must pass the Gate. The Doctrine demands it.

1. **Does the pitch's primary message deliver on the core pain identified here?** If Intelligence says the pain is X, the deck's opening slide must land X, not a related-but-different problem.
2. **Does the monetization model (equity-in-round) match what VCs actually sign up for?** If real partners say no, the model is theoretical no matter how internally consistent.
3. **Does the positioning honour what already works (Ant's track record, Talos intros) without leaning on it as the whole story?** Warm intros are the channel, not the product.
4. **Have we checked our own bias?** Are we building what Intelligence says to build, or what we find interesting to build?

## The Intelligence Report — final artefact

When the atoms are filled, the Gate is passed, and the corpus has the evidence to back every load-bearing claim, the outputs consolidate into a single **Intelligence Report** in `pack/`. That document is the canonical input to Stage 02 (Architecture → Mission Brief).

## See also

- [`INDEX.md`](INDEX.md) — atom list, corpus status, gate state
- [`manifest.json`](manifest.json) — machine-readable substrate index
- [`../context-blackops.md`](../context-blackops.md) — the pitch + brand + doctrine material this Intelligence will test
- [`alpha-suite-reframe-2026-04-21.md`](alpha-suite-reframe-2026-04-21.md) — systems-framing reframe captured 2026-04-21
- [`_exhaust.md`](_exhaust.md) — reusable intake patterns captured along the way
- [`../STATUS.md`](../STATUS.md) — engagement status
