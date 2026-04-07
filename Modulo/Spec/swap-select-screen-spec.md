# Swap Select Token Screen — Structured Spec
Extracted from Figma file `rTAg5ODay1ac1ZZBq8lYwr`, node `2091-8610`
Generated: 2026-04-07 (updated with exact Figma values)

**This is the source of truth for building the swap select token screen HTML.** Use exact values. Do not guess.

---

## Screen Dimensions
- Width: 390px
- Height: 844px (mobile viewport)
- Background: `#0D0E17`
- Device frame border-radius: 44px

## Relationship to Swap Screen
This is an **overlay** that sits on top of the swap screen (node `2091-8499`). In the Figma, the swap screen (with the select token overlay) is node `2091-8610`. The overlay container (node `2091-8701`) occupies the full content area (390x807px) with bg `#0D0E17`.

## Assets
All assets are in `assets/`. Every file is a real SVG from Figma. Do not substitute or redraw.

| File | What it is | Size |
|------|-----------|------|
| `token-eth.svg` | Ethereum icon | 42x42px (frame), 35x35px (icon within, at x=3.49 y=3.49) |
| `token-usdc.svg` | USD Coin icon | 42x42px (frame), uses `#2775CA` bg |
| `token-btc.svg` | Bitcoin/WBTC icon | 42x42px (frame), uses `#E8821B` bg |
| `token-sol.svg` | Solana icon | 42x42px (frame), uses `#9945FF` bg |
| `token-usdt.svg` | Tether icon | 42x42px (frame), uses `#26A17B` bg |
| `icon-search.svg` | Search magnifier icon | 16x16px |
| `icon-close.svg` | Close X button | 22x22px (frame), 11x11px (X strokes inside at x=5.5 y=5.5) |

---

## Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bk-bg-base` | `#0D0E17` | Overlay background |
| `--bk-bg-input` | `#1A1A29` | Search field background |
| `--bk-border-subtle` | `#1E1F2E` | Token row bottom separator (1px) |
| `--bk-border-focus` | `#584BEB` | Search field border (focus/active state) |
| `--bk-text-primary` | `#F5F5F6` | Header title, token names |
| `--bk-text-muted` | `#87878C` | Search placeholder, close button X stroke, search icon stroke, balance label text |
| `--bk-text-placeholder` | `rgba(245, 245, 246, 0.5)` | Search field placeholder text (50% white) |

### Token Brand Colors
| Token | Color |
|-------|-------|
| ETH | `#627EEA` |
| USDC | `#2775CA` |
| WBTC | `#E8821B` |
| SOL | `#9945FF` |
| USDT | `#26A17B` |

---

## Typography (all Inter)

| Element | Weight | Size | Line-height | Color | Notes |
|---------|--------|------|-------------|-------|-------|
| Header "Select token" | 600 | 18px | 1.5em (27px) | `#F5F5F6` | |
| Search placeholder "Token name or address" | 400 | 15px | ~1.21em (18.15px) | `rgba(245, 245, 246, 0.5)` | 50% opacity white |
| Token name (e.g. "ETH") | 500 | 16px | 1.5em (24px) | `#F5F5F6` | |
| Balance text (e.g. "Balance: 1.1421 ETH") | 500 | 13px | 1.5em (19.5px) | `#87878C` | opacity 0.7 on parent container |

---

## Layout — Top to Bottom

### 1. Status Bar
- Position: y=0, width=390px, height=37px
- Same as swap screen — time left, signal/wifi/battery right

### 2. Overlay Container
- Position: y=37px, width=390px, height=807px
- Background: `#0D0E17`
- Contains all overlay content with absolute positioning

### 3. Header
- **Title "Select token"**: positioned at x=20px, y=20px
  - Text frame: ~108x27px
  - Inter 600, 18px, 1.5em, `#F5F5F6`
- **Close button (X)**: positioned at x=348px, y=22.5px
  - Frame: 22x22px
  - X strokes: 11x11px centered (at x=5.5, y=5.5 within frame)
  - Stroke color: `#87878C`, stroke weight: 1.83px

### 4. Search Field
- Position: x=20px, y=67px (relative to overlay container)
- Width: 350px, height: 48.5px
- Background: `#1A1A29`
- Border: 1px `#584BEB` (purple focus indicator)
- Border-radius: 14px
- Layout: row, align center, gap 12px, padding 0 16px

**Search field content:**
- **Search icon**: 16x16px (magnifier)
  - Icon detail: 10.67x10.67px circle stroke at x=2 y=2, stroke weight 1.33px, color `#87878C`
  - Handle: 2.87x2.87px at x=11.13 y=11.13
- **Text input area**: fills remaining width, height 22.5px, row, align center
  - Placeholder "Token name or address": Inter 400, 15px, line-height ~1.21em, `rgba(245, 245, 246, 0.5)`

### 5. Token List
- Position: x=0, y=131.5px (relative to overlay container)
- Width: 390px, height: 675.5px
- Layout: column, padding 0 20px
- Usable content width: 350px

**Each token row:**
- Width: fills parent (350px usable)
- Height: 76.5px
- Border-bottom: 1px `#1E1F2E` (bottom only, not on last row)
- Layout: absolutely positioned children

**Row content:**
- **Token icon**: 42x42px, positioned at x=0, y=16.75px
  - Icon artwork: 35x35px centered within frame (at x=3.49, y=3.49)
- **Text block**: positioned at x=58px, y=16px
  - Width: varies by token name (~118-134px)
  - Height: 43.5px
  - Layout: column, align stretch
  - **Token name row** (height 24px, full-width):
    - Token ticker text at y=-1px
    - Inter 500, 16px, 1.5em, `#F5F5F6`
  - **Balance row** (height 19.5px, full-width, opacity 0.7):
    - Balance text at y=1px
    - Inter 500, 13px, 1.5em, `#87878C`

**Token data (top to bottom):**

| # | Icon | Ticker | Balance Text | Text Block Width |
|---|------|--------|-------------|-----------------|
| 1 | `token-eth.svg` | ETH | Balance: 1.1421 ETH | 121.94px |
| 2 | `token-usdc.svg` | USDC | Balance: 5,342 USDC | 133.16px |
| 3 | `token-btc.svg` (WBTC icon) | WBTC | Balance: 0.0574 BTC | 128.90px |
| 4 | `token-sol.svg` | SOL | Balance: 17.43 SOL | 117.94px |
| 5 | `token-usdt.svg` | USDT | Balance: 3,398 USDT | 131.90px |

---

## Underlying Swap Screen (visible behind overlay in Figma composite)

The Figma node `2091-8610` is a composite showing the swap screen WITH the select token overlay. Under the overlay, the swap screen is identical to the standalone swap screen (node `2091-8499`) except:

- The "You Pay" card uses the **gradient background** (`#1A1A29` to `#1F1F33`) with border `rgba(45, 44, 74, 0.2)` instead of the flat `#13141F`
- The bottom CTA "Select a token" button is still visible at y=725px

---

## Key Design Decisions
1. **Token icons are 42px frames with 35px artwork** — consistent padding within circular icon containers.
2. **Search field uses purple border** — `#584BEB` 1px, not the standard `#1E1F2E`. This is the focused/active state.
3. **Search border-radius is 14px** — matches percentage buttons and numpad cells, not the 16px of cards.
4. **Close button X uses 1.83px stroke weight** — thicker than typical 1px borders for tap target visibility.
5. **Token row height is 76.5px** — generous touch targets, with icon vertically centered at y=16.75px.
6. **Balance text weight is 500 (Medium)** — not 400, slightly bolder than typical body text.
7. **Balance text opacity 0.7** — applied on the parent container, not the text fill itself.
8. **No hover states visible** — Figma shows default state only.
9. **Overlay is full-screen** — 390x807px, covers entire content area below status bar.
10. **Text gap from icon is 58px** — measured from x=0 of row to x=58px where text starts (42px icon + 16px gap).
11. **Search field placeholder is rgba white** — `rgba(245, 245, 246, 0.5)`, not the `#87878C` muted color.
