# Explore Screen — Structured Spec
Extracted from Figma file `rTAg5ODay1ac1ZZBq8lYwr`, node `2091-9116`
Generated: 2026-04-07 (re-extracted with full depth)

**This is the source of truth for building the explore screen HTML.** Use exact values. Do not guess.

---

## Screen Dimensions
- Width: 390px
- Height: 844px (mobile viewport)
- Background: `#0D0E17`
- Frame border-radius: 44px (device frame)
- Frame shadow: `0px 40px 100px 0px rgba(0, 0, 0, 0.9), 0px 0px 0px 12px rgba(26, 27, 40, 1), 0px 0px 0px 10px rgba(10, 11, 18, 1)`

## Assets
All assets are in `Prototype/assets/`. Every file is a real SVG from Figma. Do not substitute or redraw.

| File | What it is | Size |
|------|-----------|------|
| `icon-search.svg` | Search icon in search field | 16x16px |
| `icon-more.svg` | Three-dot menu (horizontal ellipsis) | 16x16px |
| `explore-card-eth.svg` | ETH icon for favourite card | 30x30px |
| `explore-card-btc.svg` | BTC icon for favourite card | 30x30px |
| `explore-sparkline-eth.svg` | ETH mini chart sparkline | fill-width x 32px |
| `explore-sparkline-btc.svg` | BTC mini chart sparkline | 136x32px |
| `token-usdc.svg` | USDC icon for token list | 40x40px |
| `token-eth.svg` | ETH icon for token list | 40x40px |
| `token-usdt.svg` | USDT icon for token list | 40x40px |
| `token-btc.svg` | BTC icon for token list | 40x40px |
| `token-sol.svg` | SOL icon for token list | 40x40px |
| `chain-arb.svg` | Arbitrum chain icon (for extended list) | 40x40px |
| `icon-dropdown.svg` | Dropdown chevron for Volume selector | 12x12px (inner arrow: 6x3px) |
| `icon-change-up.svg` | Up arrow for positive change | 7x7px |
| `icon-change-down.svg` | Down arrow for negative change | 7x7px |
| `icon-nav-home.svg` | Bottom nav: home | 22px |
| `icon-nav-search.svg` | Bottom nav: search | 22px |
| `icon-nav-activity.svg` | Bottom nav: activity | 22px |
| `icon-nav-swap.svg` | Bottom nav: swap | 22px |

---

## Colour Palette
Inherits all `--bk-*` tokens from home screen. Additional/specific usage:

| Token | Hex | Usage |
|-------|-----|-------|
| `--bk-bg-base` | `#0D0E17` | Screen background |
| `--bk-bg-card` | `#1A1A29` | Search field background |
| `--bk-bg-card-gradient` | `#1A1A29` to `#1F1F33` | Favourite cards gradient fill |
| `--bk-bg-nav` | `#13141F` | Bottom navigation bar, inactive chain filter pills |
| `--bk-border-subtle` | `#1E1F2E` | Chain filter pill borders, nav top border |
| `--bk-border-search` | `#2A2A3D` | Search field border (NOTE: different from card border) |
| `--bk-border-card` | `rgba(45, 44, 74, 0.2)` | Favourite card border |
| `--bk-border-row` | `#181929` | Token list row bottom separator |
| `--bk-text-primary` | `#F5F5F6` | Token names, prices |
| `--bk-text-secondary` | `#B3B2B8` | Chain filter text, Volume label |
| `--bk-text-muted` | `#87878C` | Rank numbers, section labels, search placeholder, search icon stroke, more icon stroke |
| `--bk-text-placeholder` | `rgba(245, 245, 246, 0.5)` | Search field placeholder text |
| `--bk-success` | `#22C55E` | Positive % changes, sparkline stroke (1.5px) |
| `--bk-error` | `#F04348` | Negative % changes (NOTE: `#F04348` not `#EF4444`) |
| `--bk-brand-primary` | `#584BEB` | Active chain filter ("All") background and border |

---

## Typography (all Inter)

| Style | Weight | Size | Line Height | Extra |
|-------|--------|------|-------------|-------|
| Search placeholder | 400 | 15px | 1.21em | color: `rgba(245, 245, 246, 0.5)` |
| "Favourites" section label | 400 | 13px | 1.5em | color: `#87878C`, opacity: 0.7 on container |
| Favourite card token name | 600 | 15px | 1.5em | color: `#F5F5F6` |
| Favourite card price | 600 | 14px | 1.5em | color: `#F5F5F6` |
| Favourite card change % | 400 | 12px | 1.5em | color: `#22C55E` (up) or `#F04348` (down) |
| "Top tokens" label | 400 | 13px | 1.5em | color: `#87878C`, opacity: 0.7 on container |
| Volume selector text | 500 | 13px | 1.5em | color: `#B3B2B8` |
| Chain filter text (active) | 600 | 13px | 1.5em | color: `#FFFFFF` |
| Chain filter text (inactive) | 400 | 13px | 1.5em | color: `#87878C` |
| Token list rank number | 400 | 13px | 1.5em | color: `#87878C`, text-align: right, opacity: 0.6 on container |
| Token list name | 500 | 15px | 1.5em | color: `#F5F5F6` |
| Token list volume subtitle | 400 | 12px | 1.5em | color: `#87878C`, opacity: 0.6 on container |
| Token list price | 500 | 15px | 1.5em | color: `#F5F5F6`, text-align: right |
| Token list change % | 400 | 12px | 1.5em | text-align: right, color: `#22C55E` or `#F04348` |

---

## Layout -- Top to Bottom

### 1. Status Bar (y: 0, h: 37px)
- Same as home screen (see home-screen-spec.md section 1)

### 2. Search Field (y: 16 from content top)
- **Container:** x:16, w:358px, h:48.5px
- **Background:** `#1A1A29`
- **Border:** `#2A2A3D` 1px (NOTE: this is `#2A2A3D`, not the standard `#1E1F2E`)
- **Border-radius:** 14px
- **Layout:** row, align-center, gap: 12px, padding: 0 16px
- **Search icon:** 16x16px (stroke: `#87878C`, 1.33px weight)
  - Inner circle: 10.67x10.67px at offset (2,2)
  - Handle: 2.87x2.87px at offset (11.13, 11.13)
- **Text input area:** row, align-center, fill-width x 22.5px
  - Placeholder: "Token name or address", Inter 400, 15px, line-height: 1.21em, `rgba(245, 245, 246, 0.5)`

### 3. Favourites Section Header (y: 76.5 from content top)
- **Container:** 390x19.5px, row, space-between, align-center, padding: 0 16px
- **Left:** "Favourites" label
  - Inter 400, 13px, 1.5em, `#87878C`
  - Container: 63.74x19.5px, opacity: 0.7
- **Right:** Three-dot menu icon
  - 16x16px SVG
  - Three dots: 1.33px diameter each, stroke: `#87878C` 1.33px
  - Dot positions: x: 2.67, 7.33, 12 (all at y: 7.33)

### 4. Favourite Cards (y: 108 from content top)
Two cards side by side:

**Each card:**
- **Dimensions:** 173x151px
- **Background:** gradient `#1A1A29` to `#1F1F33`
- **Border:** `rgba(45, 44, 74, 0.2)` 1px
- **Border-radius:** 16px
- **Layout:** column, gap: 8px, padding: 17px 17px 1px 17px
- **Positions:** Left card at x:16, Right card at x:201

**Card content layers (top to bottom):**

1. **Header row (139x30px):**
   - Token icon: 30x30px at (0, 0) -- NOTE: 30px not 32px
   - Token name: Inter 600, 15px, 1.5em, `#F5F5F6`, positioned at x:38, y:3.75

2. **Sparkline (fill-width x 32px):**
   - Left card (ETH): fill-width x 32px
   - Right card (BTC): 136x32px
   - Stroke: `#22C55E` 1.5px (for positive trend)

3. **Price row (139x21px):**
   - Price: Inter 600, 14px, 1.5em, `#F5F5F6`

4. **Change row (139x18px):**
   - Change %: Inter 400, 12px, 1.5em, `#22C55E`

**Card data:**

| Card | Position | Icon | Name | Price | Change |
|------|----------|------|------|-------|--------|
| Left | x:16 | ETH 30px icon | ETH | $2,450.78 | +4.42% |
| Right | x:201 | BTC 30px icon | BTC | $88,421 | +2.14% |

### 5. Top Tokens Header (y: 286 from content top)
- **"Top tokens" label:**
  - Container: 67.68x19.5px at x:16, y:286
  - Text: "Top tokens", Inter 400, 13px, 1.5em, `#87878C`
  - Container opacity: 0.7

- **Volume selector pill (right side):**
  - Container: 88.65x33.5px at x:285.35, y:279
  - Background: `#13141F`
  - Border: `#1E1F2E` 1px
  - Border-radius: 16777200px (fully round / 9999px)
  - Layout: row, align-center, gap: 4px, padding: 0 12px
  - Text: "Volume", Inter 500, 13px, 1.5em, `#B3B2B8`
  - Dropdown icon: 12x12px (inner chevron: 6x3px, stroke: `#87878C` 1px)

### 6. Chain Filter Pills (y: 324.5 from content top)
Horizontal scrollable row of pills.

**Common pill specs:**
- **Height:** 33.5px
- **Border-radius:** 16777200px (fully round / 9999px)
- **Layout:** row, align-center, padding: 0 12px
- **Text:** Inter, 13px, 1.5em, centered

**Active pill ("All"):**
- **Dimensions:** 42.27x33.5px at x:16
- **Background:** `#584BEB`
- **Border:** `#584BEB` 1px
- **Text:** "All", Inter 600, 13px, `#FFFFFF`

**Inactive pills:**
- **Background:** `#13141F`
- **Border:** `#1E1F2E` 1px
- **Text:** Inter 400, 13px, `#87878C`

| Pill | X position | Width | Text |
|------|-----------|-------|------|
| All (active) | x:16 | 42.27px | "All" |
| Ethereum | x:66.27 | 84.67px | "Ethereum" |
| Arbitrum | x:158.94 | 79.4px | "Arbitrum" |
| Base | x:246.34 | 56.25px | "Base" |
| Optimism | x:310.59 | 84.09px | "Optimism" |

**Gap between pills:** ~8px (derived from positions)

**CONFIRMED chain pill values:**
- Height: 33.5px (not 37.5px)
- Border-radius: 16777200px (effectively 9999px)
- Inactive bg: `#13141F`
- Border: `#1E1F2E` 1px
- Font: Inter 400, 13px (inactive) / Inter 600, 13px (active)
- Inactive text color: `#87878C` (not `#B3B2B8`)
- No chain icons on the filter pills themselves (text-only pills)

### 7. Top Token List (starts y: 394)

**Top 5 tokens -- inline rows (no separators, ~73.5px spacing):**

Each row layout:
- **Rank number:** 18x19.5px container, text: Inter 400, 13px, 1.5em, `#87878C`, text-align: right, opacity: 0.6
- **Token icon:** 40x40px, positioned at x:46 (30px gap from rank left edge)
  - Inner icon circle: 33.34x33.34px at (3.33, 3.33) offset
  - Chain badge on some icons: smaller overlay at bottom-right
- **Name/volume column:** starts at x:98, column, align: stretch
  - Name: Inter 500, 15px, 1.5em, `#F5F5F6`, fill-width x 22.5px
  - Volume: Inter 400, 12px, 1.5em, `#87878C`, opacity: 0.6, fill-width x 18px
- **Price/change column:** right-aligned, column, align: stretch
  - Price: Inter 500, 15px, 1.5em, `#F5F5F6`, text-align: right, 22.5px height
  - Change row: row, justify: flex-end, align: center, gap: 4px
    - Arrow icon: 7x7px (inner: 5.25x4.38px)
    - Change text: Inter 400, 12px, 1.5em, text-align: right

**Token data:**

| # | Y pos | Icon | Name | Subtitle | Price | Change | Change color |
|---|-------|------|------|----------|-------|--------|-------------|
| 1 | 394 | `token-usdc.svg` | USD Coin | $514M Vol | $1.00 | -0.38% | `#F04348` |
| 2 | 467.5 | `token-eth.svg` | Ethereum | $480M Vol | $2,450.78 | +4.42% | `#22C55E` |
| 3 | 541 | `token-usdt.svg` | Tether | $398M Vol | $1.00 | +0.01% | `#22C55E` |
| 4 | 614.5 | `token-btc.svg` | Wrapped Bitcoin | $244M Vol | $88,421.33 | +2.14% | `#22C55E` |
| 5 | 688 | `token-sol.svg` | Solana | $220M Vol | $165.42 | -1.82% | `#F04348` |

**Row column widths (from Figma):**

| # | Name col width | Price col width |
|---|---------------|-----------------|
| 1 | 210.46px | 53.54px |
| 2 | 190.27px | 73.73px |
| 3 | 210.41px | 53.59px |
| 4 | 182.91px | 81.09px |
| 5 | 206.34px | 57.66px |

### 8. Extended Token List (below fold, starts y: 745.5)

These rows have a different structure -- taller cards with bottom separator:

**Each extended row:**
- **Container:** 358x73.5px at x:16
- **Bottom border:** `#181929` 1px (strokeWeight: 0px 0px 1px)
- **Inner content** starts at y:16 within container (16px top padding)

**Row inner layout:**
- **Rank number:** 18x19.5px at x:0, y:26.5, Inter 400, 13px, `#87878C`, text-align: right, opacity: 0.6
- **Token icon:** 40x40px at x:30, y:16.25
- **Name/volume column:** at x:82, y:16, column layout
  - Name: Inter 500, 15px, 1.5em, `#F5F5F6`, 22.5px height
  - Volume: Inter 400, 12px, 1.5em, `#87878C`, opacity: 0.6, 18px height
- **Price/change column:** right-aligned, at x:~305, y:16, column layout
  - Price: Inter 500, 15px, 1.5em, `#F5F5F6`, text-align: right, 22.5px height
  - Change row: row, justify: flex-end, align: center, gap: 4px

**Extended row data:**

| # | Y pos | Name | Volume | Price | Change |
|---|-------|------|--------|-------|--------|
| 6 | 745.5 | Arbitrum | $213M Vol | $0.612 | -1.23% (`#F04348`) |
| 7 | 819 | (next token) | -- | -- | -- |
| 8 | 892.5 | (next token) | -- | -- | -- |
| 9 | 966 | (next token) | -- | -- | -- |

### 9. Bottom Navigation (y: bottom, h: 71px)
- **Background:** `#13141F`
- **Top border:** `#1E1F2E` 1px (strokeWeight: 1px 0px 0px)
- **Layout:** row, space-between, align-center, gap: 48.5px, padding: 0 40.25px

**Nav items (identical structure to home screen):**

| Item | Type | Dimensions | Icon size |
|------|------|-----------|-----------|
| Home | Standard | 38x38px | 22px wide, fill height, padding: 8px 0px, radius: 14px |
| Search | Standard | 38x38px | Same |
| Activity | Standard | 38x38px | Same |
| Swap | CTA circle | 50x50px | 22x22px, padding: 0 14px, radius: 16777200px |

- **Swap button fill:** `linear-gradient(135deg, rgba(88, 75, 235, 1) 0%, rgba(74, 61, 224, 1) 100%)`

---

## Key Design Decisions
1. **Search border is different** -- `#2A2A3D` not the standard `#1E1F2E`. This gives the search field slightly more contrast.
2. **Favourite card icons are 30px** -- not 32px or 40px. Smaller than token list icons.
3. **Token list icons are 40px** -- same as home screen, NOT 32px as previously documented.
4. **Sparklines are SVG assets** -- stroke: `#22C55E` 1.5px for positive trend.
5. **Chain filters are text-only pills** -- no chain icons within the filter pills. Icons only appear in the token list rows.
6. **Negative change color is `#F04348`** -- confirmed from Figma. NOT `#EF4444`.
7. **"Favourites" and "Top tokens" labels** both have opacity: 0.7 on their containers, in addition to `#87878C` text color. Double-muting.
8. **Search placeholder line-height** is 1.21em (tighter than the standard 1.5em used elsewhere).
9. **Volume selector** has the same pill styling as chain filters (fully rounded, `#13141F` bg, `#1E1F2E` border).
10. **Extended rows (6+)** use a different layout with explicit 73.5px row containers, 16px internal padding, and `#181929` bottom separators.
11. **Chain filter inactive text** is `#87878C` (muted), not `#B3B2B8` (secondary). The Volume selector text IS `#B3B2B8`.
12. **Rank numbers** are right-aligned within their 18px container, with opacity 0.6 -- creates a subtle, non-competing hierarchy.
