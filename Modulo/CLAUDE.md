# Modulo — Client Engagement

## What is Modulo
Cross-chain DeFi platform. "One vault, every chain." This is BakedUX's first external client engagement — it proves the Fully Baked methodology on a real product.

## Goal
The deliverable is a **working product front-end**, not a prototype. Build real, functional UI that can connect to any data source.

### Data Architecture
```
UI Layer (BakeKit + React ARIA components)
    ↓ consumes
Data Adapter Layer (typed interfaces)
    ↓ connects to
Any backend: REST API, GraphQL, WebSocket, mock data, local JSON
```

- **Define typed data interfaces** for every data need (vaults, positions, chains, prices, transactions)
- **Build UI against mock data** that conforms to those interfaces
- **Each data source gets its own adapter** — swap backends without touching UI
- **Works offline with mocks** — development and demos don't need a live backend
- This adapter pattern is reusable across all BakeKit products

## Build Pipeline — Follow Exactly
Read these from the **OpenClaw workspace** (`~/workspace/`) before building anything:
- **`~/workspace/Platform/Docs/design-quality-brief.md`** — what "good" looks like. Design principles, visual standards, token compliance, accessibility. **Read this first.**
- `~/workspace/Platform/BakeKit/Decisions/ADR-001-agentic-build-pipeline.md`
- `~/workspace/Platform/Docs/building-on-bakekit.md`
- `~/workspace/Platform/Comms/kickoffs/2026-04-03-modulo.md`

## The Build Progression — ONE STEP AT A TIME

Each step is a separate task. Do NOT jump ahead. Do NOT combine steps. Complete the current step, push, and stop.

| Step | Name | What to do | Status |
|------|------|-----------|--------|
| 1 | **Mise en Place** | Extract tokens from Figma via `get_figma_data`. Normalise into `--bk-*` tokens. Download all assets via `download_figma_images`. | DONE |
| 2 | **Prototype** | Build screens as static HTML/CSS that visually matches the Figma design intent. Use only extracted tokens and downloaded assets. This is about VISUAL FIDELITY — matching the design, not adding features. | **← CURRENT** |
| 3 | **Extract** | Harvest the token system from the working prototype — colours, spacing, type scale, radii, shadows, component patterns. Formalise into a clean BakeKit token set. | WAITING |
| 4 | **Componentise** | Identify repeating patterns, build as React ARIA + BakeKit components with typed data interfaces and mock data adapters. | WAITING |
| 5 | **Assemble** | Rebuild screens using the real components. This becomes the working front-end. | WAITING |

### CURRENT STEP: Prototype

**Your ONLY job right now:** build static HTML/CSS screens that faithfully represent the Figma design.

- Match the visual design from Figma — layout, colours, typography, spacing, hierarchy
- Use only `--bk-*` tokens and real downloaded assets
- Populate with realistic mock data (not empty shells)
- Do NOT add features, onboarding flows, or functionality not in the Figma
- Do NOT address persona review feedback — that comes later
- Do NOT build React components — that's step 4
- Do NOT build data adapters — that's step 4
- Ignore the product brief's feature wishlist — you are matching the DESIGN, not implementing the PRODUCT

### After each build stage
- **Commit and push both repos** — push `~/products` (prototypes, docs) AND `~/workspace` (tokens, assets, components). The QA pipeline watches for pushes and runs automatically. If you don't push, QA doesn't happen.

## File Locations
All paths below are in the **OpenClaw workspace** (`~/workspace/`):
| What | Where |
|------|-------|
| Screen demos | `~/workspace/Platform/BakeKit/System/demos/modulo/` |
| Tokens | `~/workspace/Platform/BakeKit/Tokens/modulo/` |
| Assets (icons, images) | `~/workspace/Media/Assets/modulo/` |
| QA reports | `~/workspace/Media/QA/modulo/` |
| Kickoff brief | `~/workspace/Platform/Comms/kickoffs/2026-04-03-modulo.md` |

## Repos
- **Product files** (briefs, personas, discovery, prototypes) live here in `~/products/Modulo/`
- **Built artifacts** (tokens, demos, components, assets) live in `~/workspace/` — the `FullyBakedAI/workspace` repo, `main` branch
- Do not create separate repos for Modulo

## Component Stack
```
Product screens (Modulo UI)
    ↓ consumes
BakeKit token skin (--bk-* CSS variables)
    ↓ wraps
React ARIA primitives (accessibility, keyboard, focus)
```
See `~/workspace/Platform/BakeKit/Decisions/ADR-002-component-primitives.md`.

## Key Rules
- **Tokens first** — never build before extracting tokens
- **Assets are real** — download from Figma, never approximate
- **Never self-evaluate** — builder and reviewer are always separate
- **No hardcoded values** — all visual properties via `--bk-*` variables
- **Figma is a sketch** — extract intent into a coherent system, don't pixel-match every detail
- **Document as you build** — every pattern discovered feeds back to BakeKit and the Framework

## Figma File
- **URL:** https://www.figma.com/design/rTAg5ODay1ac1ZZBq8lYwr/First-steps?node-id=2078-6541
- **File key:** rTAg5ODay1ac1ZZBq8lYwr
- **Starting node:** 2078-6541

## Figma MCP Workflow — Follow This Exactly

You have two Figma MCP tools. Use them in this order:

### Step 1: Extract data (values, structure)
Use **`mcp__figma__get_figma_data`** to get the real design data:
- Call it on the starting node to get the full structure
- Extract: hex colors, font families, font sizes, font weights, line heights, letter spacing, border radii, spacing/padding values, opacity values
- This gives you REAL values — do not guess or approximate from screenshots

### Step 2: Normalise into tokens
Take the extracted values and normalise into `--bk-*` tokens:
- Consolidate near-duplicate colors (e.g. `#131420` and `#13141f` → pick one)
- Round spacing to a consistent scale (4/8/12/16/20/24/32/48)
- Standardise font sizes into a type scale
- Write these to `~/workspace/Platform/BakeKit/Tokens/modulo/tokens.css`

### Step 3: Download real assets
Use **`mcp__figma__download_figma_images`** for:
- Every icon in the design → download as SVG
- Every logo/brand mark → download as SVG
- Complex illustrations → download as PNG
- Save to `~/workspace/Media/Assets/modulo/`
- **NEVER hand-draw an SVG substitute.** If download fails, stop and report it.

### Step 4: Build from tokens and assets only
- Import the tokens CSS file
- Reference only `var(--bk-*)` values in all styles
- Use only downloaded assets for icons and images
- If a value isn't in your tokens, add it to tokens first, then reference it

### Common mistake
Do NOT: look at a downloaded image/screenshot and guess the colors, fonts, and spacing.
DO: use `get_figma_data` to extract the actual values from the Figma JSON.

## Design Context
- Dark-first UI (DeFi standard)
- Data-heavy, financial precision required
- Mobile-first, responsive
- WCAG 2.1 AA minimum accessibility
