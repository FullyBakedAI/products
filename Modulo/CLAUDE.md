# Modulo — Build Instructions

## What is Modulo
Cross-chain DeFi wallet. "One vault, every chain." BakedUX's first client engagement.

## Before You Build ANYTHING
1. Read `product.json` in this directory — it has all Figma node IDs, screen list, component specs, and build rules.
2. Key validated lessons (from decision log — Mac Studio only, summarised here):
   - Never redefine a shared CSS class in a screen file — always put it in `shared.css`
   - Don't export text nodes from Figma — always export the parent group/frame to get the actual icon
   - `swap-card` is for interactive input areas only — not data display sections (strips panels from non-input UI)
   - All colours must use `--bk-*` tokens — no hardcoded hex values anywhere
   - `asset-opp-row` lives in `asset.css` only — don't redefine it in screen-specific CSS files
   - Tab IDs in navigation calls must exactly match the receiving component's TABS array
   - Use HashRouter (`/#/path`) for deep linking — standard history router loses state on PWA launch

## Build Pipeline — Follow This Order

### Step 0: Read the product config
```bash
cat ~/products/Modulo/product.json
```
This file defines: Figma file key, every screen's node ID, shared components list, and build rules.

### Step 1: Extract shared components from Figma
For EACH component listed in `product.json → sharedComponents`, drill into Figma at depth 5+ to get exact specs:
- Use `mcp__figma__get_figma_data` with the relevant screen's `figmaMobileFrame` node ID
- Extract: height, padding, border-radius, background, border, font-size, font-weight, color, icon size, gap
- Do NOT approximate. Do NOT guess. Read the actual Figma node values.

### Step 2: Generate `shared.css`
Create `Prototype-v2/shared.css` containing:
- **All design tokens** as CSS custom properties (`:root { --bk-* }`)
- **All shared components** as CSS classes with Figma-verified values
- Every screen will `<link rel="stylesheet" href="shared.css">` — no duplicated tokens or component styles in screen files

### Step 3: Download all assets from Figma
- Use `mcp__figma__download_figma_images` for every icon, logo, avatar, chart, and brand mark
- Save to `Prototype-v2/assets/`
- **Verify each asset after download** — open the SVG and check it contains the intended shape, not a text glyph or wrong node export
- Common mistake: exporting a text node instead of its parent group gives you a raw letter glyph, not an icon

### Step 4: Build each screen
- Each screen is a standalone HTML file importing `shared.css`
- Screen-specific styles go in an inline `<style>` block — only styles unique to that screen
- Use only `--bk-*` tokens and shared component classes — never hardcode colours or repeated component styles
- Populate with realistic mock data (not empty shells)
- Add proper ARIA attributes and semantic HTML
- Wire navigation between screens (`<a href="...">`)

### Step 5: Self-verify
- Take Playwright screenshots of all screens: `npx playwright screenshot --viewport-size="500,900" "http://localhost:PORT/screen.html" /tmp/screen.png`
- Visually inspect each screenshot — do elements match your Figma extraction?
- Check all asset references resolve (no broken images)
- Check navigation links point to valid files

### Step 6: Push
- Commit and push `~/products`
- Frank (Mac Studio) will automatically detect the push and run visual QA with gemma4

## What NOT To Do
- Do NOT build React components (that's step 4 of the engagement, not now)
- Do NOT add features, onboarding, or functionality not visible in the Figma
- Do NOT create data adapters or typed interfaces (that's later)
- Do NOT run `evaluate.py`, `persona-review.py`, or any Ollama script — you don't have local models, Frank handles QA
- Do NOT approximate icons or SVGs — always download from Figma
- Do NOT define tokens or component styles in individual screen files — they belong in `shared.css`

## File Locations
| What | Where |
|------|-------|
| Product config | `~/products/Modulo/product.json` |
| Prototype screens | `~/products/Modulo/Prototype-v2/` |
| Shared CSS | `~/products/Modulo/Prototype-v2/shared.css` |
| Component snippets | `~/products/Modulo/Prototype/SNIPPETS.md` |
| Design system page | `~/products/Modulo/Prototype/design-system.html` |
| Downloaded assets | `~/products/Modulo/Prototype-v2/assets/` |
| Decision log | Mac Studio only — key learnings summarised above |
| Extract script | Mac Studio only (`Platform/Scripts/extract-components.py`) |

## Building New Screens (Experimentation Mode)
**Read `Prototype/SNIPPETS.md` first.** It contains copy-paste HTML/CSS building blocks extracted from the 6 existing screens — shells, cards, token rows, contact rows, pills, buttons, tabs, and more. All use `modulo-shared.css` tokens.

To build a new screen:
1. Copy a shell (full screen or sheet) from SNIPPETS.md
2. Drop in components from the snippet library
3. Use Lucide icons: `<i data-lucide="icon-name"></i>` (browse at https://lucide.dev/icons)
4. Add only screen-specific styles in the `<style>` block
5. Save as `Prototype/new-screen-name.html`
6. Never hardcode colours — always use `--bk-*` tokens
7. Include Lucide script before `</body>`: `<script src="https://unpkg.com/lucide@latest"></script><script>lucide.createIcons();</script>`

## Figma Access
You have direct access to Figma via MCP tools:
- `mcp__figma__get_figma_data` — read node trees, layouts, styles, typography
- `mcp__figma__download_figma_images` — download assets as SVG/PNG

**File key:** `rTAg5ODay1ac1ZZBq8lYwr`
**Canvas node:** `2078-6541`

Screen node IDs are in `product.json → screens → [name] → figmaMobileFrame`.

## Design Context
- Dark-first UI, mobile-first (390×844 viewport)
- WCAG 2.1 AA minimum
- Font: Inter (400, 500, 600, 700)
- Icons: Lucide (via CDN), configured by `--bk-icon-size`, `--bk-icon-stroke`, `--bk-icon-color`
- All values via `--bk-*` CSS custom properties
