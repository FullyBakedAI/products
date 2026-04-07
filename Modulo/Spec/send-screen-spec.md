# Send Screen — Structured Spec
Extracted from Figma file `rTAg5ODay1ac1ZZBq8lYwr`, node `2091-8794`
Generated: 2026-04-07 (updated with exact Figma values at depth 5)

**This is the source of truth for building the send screen HTML.** Use exact values. Do not guess.

---

## Screen Dimensions
- Width: 390px
- Height: 844px (mobile viewport)
- Background: `#0D0E17`
- Frame border-radius: 44px
- Frame box-shadow: `0px 40px 100px 0px rgba(0, 0, 0, 0.9), 0px 0px 0px 12px rgba(26, 27, 40, 1), 0px 0px 0px 10px rgba(10, 11, 18, 1)`

## Assets
All assets are in `assets/`. Every file is a real SVG from Figma. Do not substitute or redraw.

| File | What it is | Size |
|------|-----------|------|
| `wallet-avatar-purple.svg` | Wallet avatar (purple/indigo variant) | 44x44px |
| `wallet-avatar-green.svg` | Wallet avatar (green variant) | 44x44px |
| `wallet-avatar-red.svg` | Wallet avatar (red variant) | 44x44px |
| `icon-search.svg` | Search icon in search field | 16x16px |
| `icon-scan.svg` | Scan/QR icon button in search field (right side) | 18x18px |
| `icon-close.svg` | Close button (X) top-right of header | 20x20px |

---

## Colour Palette
Exact hex values from Figma:

| Token | Hex | Usage |
|-------|-----|-------|
| `--bk-bg-base` | `#0D0E17` | Screen background |
| `--bk-bg-card` | `#1A1A29` | Search field background |
| `--bk-bg-drag-handle` | `#1E1F2E` | Drag handle pill |
| `--bk-border-subtle` | `#1E1F2E` | Row bottom borders |
| `--bk-border-focus` | `#584BEB` | Search field border (active state) |
| `--bk-text-primary` | `#F5F5F6` | Header title, contact names, addresses |
| `--bk-text-placeholder` | `rgba(245, 245, 246, 0.5)` | Search placeholder text |
| `--bk-text-muted` | `#87878C` | "Recent" label |
| `--bk-brand-primary` | `#584BEB` | Modulo "M" badge background |
| `--bk-badge-text` | `#FFFFFF` | Modulo "M" badge letter |
| `--bk-avatar-purple-bg` | `#1A1330` | Purple avatar background |
| `--bk-avatar-purple-border` | `rgba(129, 140, 248, 0.2)` | Purple avatar border |
| `--bk-avatar-purple-icon` | `#818CF8` | Purple avatar icon stroke |
| `--bk-avatar-green-bg` | `#13201A` | Green avatar background |
| `--bk-avatar-green-border` | `rgba(52, 211, 153, 0.2)` | Green avatar border |
| `--bk-avatar-green-icon` | `#34D399` | Green avatar icon stroke |
| `--bk-avatar-red-bg` | `#201318` | Red avatar background |
| `--bk-avatar-red-border` | `rgba(248, 113, 113, 0.2)` | Red avatar border |
| `--bk-avatar-red-icon` | `#F87171` | Red avatar icon stroke |
| `--bk-icon-muted` | `#87878C` | Search icon stroke, close button stroke |

---

## Typography (all Inter)

| Element | Weight | Size | Line Height | Color | Align |
|---------|--------|------|-------------|-------|-------|
| Header "Select recipient" | 600 | 18px | 1.5em (27px) | `#F5F5F6` | LEFT |
| Search placeholder "Address, ENS, or username" | 400 | 15px | 1.21em (~18px) | `rgba(245, 245, 246, 0.5)` | LEFT |
| "Recent" section label | 400 | 13px | 1.5em (19.5px) | `#87878C` | LEFT |
| Contact name / address (e.g. "0x4248...EF33") | 500 | 15px | 1.5em (22.5px) | `#F5F5F6` | LEFT |
| Contact ENS name (e.g. "modulo.eth") | 500 | 15px | 1.5em (22.5px) | `#F5F5F6` | LEFT |
| Contact sub-address (e.g. "0x540e...7262") | 500 | 12px | 1.5em (18px) | `#87878C` | LEFT |
| Modulo badge "M" | 700 | 8px | 1.5em (12px) | `#FFFFFF` | LEFT |
| Status bar time "9:41" | 600 | 14px | 1.5em (21px) | `#F5F5F6` | LEFT |

---

## Layout — Top to Bottom

### 1. Status Bar
- Position: y=0, full width 390px, height: 37px
- Layout: row, justify: space-between, align: center
- Padding: 0 32px
- Left: "9:41" (Inter 600, 14px, `#F5F5F6`)
- Right: signal bars + wifi + battery (system icons)

### 2. Drag Handle
- Position: y=0 within SendScreen (top of sheet)
- Container: 390px wide, 20px tall, flex row, justify: center
- Padding: 12px 179px 0px
- **Handle pill:**
  - Width: 32px
  - Height: 4px
  - Border-radius: 16777200px (fully rounded / pill)
  - Background: `#1E1F2E`

### 3. Header Area
- **Title "Select recipient":**
  - Position: x=20, y=36.5
  - Dimensions: ~136px x 27px
  - Font: Inter 600, 18px, line-height 1.5em
  - Color: `#F5F5F6`
- **Close button (X):**
  - Position: x=350, y=40
  - Dimensions: 20px x 20px
  - SVG icon, stroke: `#87878C`, stroke-width: 1.67px

### 4. Search Field
- Position: x=20, y=96
- Width: 350px
- Height: 48.5px
- Background: `#1A1A29`
- Border: 1px solid `#584BEB` (active/focus state shown)
- Border-radius: 14px
- Layout: row, align: center, gap: 12px
- Padding: 0 16px

**Children (left to right):**
1. **Search icon:** 16x16px, stroke `#87878C`, stroke-width: 1.33px
2. **Text input area:** flex: 1 (fill), height: 22.5px, align: center
   - Placeholder: "Address, ENS, or username"
   - Font: Inter 400, 15px, line-height 1.21em
   - Color: `rgba(245, 245, 246, 0.5)`
3. **Scan button:** 18x18px icon container

### 5. "Recent" Section Label
- Position: x=20, y=160.5 (within contact list container)
- Container: 350px x 19.5px
- Opacity: 0.7 on the container
- Text: "Recent"
  - Dimensions: ~43px x 20px
  - Font: Inter 400, 13px, line-height 1.5em
  - Color: `#87878C`

### 6. Contact List
- Container position: x=0, y=160.5 within SendScreen
- Container dimensions: 390px x 646.5px

#### Contact Row 1 — Address only (purple avatar)
- Position: x=20, y=31.5 (within contact container)
- Width: 350px, Height: 77px
- Layout: row, align: center, gap: 16px
- Bottom border: 1px solid `#1E1F2E`

**Avatar:**
- Width: 44px, Height: 44px
- Border-radius: fully round (16777200px)
- Background: `#1A1330`
- Border: 1px solid `rgba(129, 140, 248, 0.2)`
- Internal icon: 24.2px, strokes in `#818CF8` at 1.9px weight
- Padding: 0 ~8.9px (centering icon)

**Text container:**
- Width: 106.2px, Height: 24px
- Text: "0x4248...EF33"
- Font: Inter 500, 15px, line-height 1.5em
- Color: `#F5F5F6`

#### Contact Row 2 — ENS name + Modulo badge (green avatar)
- Position: x=20, y=108.5 (within contact container)
- Width: 350px, Height: 77px
- Layout: row, align: center, gap: 16px
- Bottom border: 1px solid `#1E1F2E`

**Avatar:**
- Width: 44px, Height: 44px
- Border-radius: fully round
- Background: `#13201A`
- Border: 1px solid `rgba(52, 211, 153, 0.2)`
- Internal icon: 24.2px, strokes in `#34D399` at 1.9px weight

**Text container:**
- Width: 106.03px, Height: 42.5px
- Layout: column, gap: 2px

**Row 1 — Name + Badge:**
- Layout: row, align: center, gap: 8px
- Name text frame: height 22.5px
  - "modulo.eth" — Inter 500, 15px, line-height 1.5em, color `#F5F5F6`
- **Modulo "M" badge:**
  - Width: 17px, Height: 17px
  - Border-radius: 4px
  - Background: `#584BEB`
  - Layout: row, justify: center, align: center
  - Padding: 0 ~4.77px
  - Letter "M": Inter 700, 8px, line-height 1.5em, color `#FFFFFF`

**Row 2 — Sub-address:**
- Container: fill width, height 18px
- Opacity: 0.7
- Text: "0x540e...7262"
- Font: Inter 500, 12px, line-height 1.5em
- Color: `#87878C`

#### Contact Row 3 — Address only (red avatar)
- Position: x=20, y=185.5 (within contact container)
- Width: 350px, Height: 77px
- Layout: row, align: center, gap: 16px
- Bottom border: 1px solid `#1E1F2E`

**Avatar:**
- Width: 44px, Height: 44px
- Border-radius: fully round
- Background: `#201318`
- Border: 1px solid `rgba(248, 113, 113, 0.2)`
- Internal icon: 24.2px, strokes in `#F87171` at 1.9px weight

**Text container:**
- Width: 107.72px, Height: 24px
- Text: "0xb5A9...Db3a"
- Font: Inter 500, 15px, line-height 1.5em
- Color: `#F5F5F6`

---

## Home Indicator Bar
- Position: x=132, y=0 (bottom of screen container)
- Width: 126px, Height: 34px
- Background: `#0D0E17`
- Border-radius: 0 0 20px 20px

---

## Shared Component: WalletAvatar
All three contact rows use the same avatar structure at identical sizes. Only the color scheme varies:

| Variant | Background | Border | Icon Stroke |
|---------|-----------|--------|-------------|
| Purple/Indigo | `#1A1330` | `rgba(129, 140, 248, 0.2)` 1px | `#818CF8` 1.9px |
| Green | `#13201A` | `rgba(52, 211, 153, 0.2)` 1px | `#34D399` 1.9px |
| Red | `#201318` | `rgba(248, 113, 113, 0.2)` 1px | `#F87171` 1.9px |

- Size: 44x44px
- Border-radius: fully round
- Inner icon bounding box: 24.2x24.2px (centered)
- Padding: 0 ~8.9px

## Shared Component: Modulo Badge
- Width: 17px, Height: 17px
- Border-radius: 4px
- Background: `#584BEB`
- Letter: "M", Inter 700, 8px, `#FFFFFF`
- Appears inline next to ENS names, 8px gap from name text

## Key Design Decisions
1. **Header font is 18px, not 20px** — confirmed from Figma style_Y5Z0MT
2. **Search field height is 48.5px** with 14px border-radius — not 44px/12px
3. **Search border is `#584BEB`** (brand purple) — this is the active/focus state shown in the design
4. **Placeholder color is `rgba(245, 245, 246, 0.5)`** — 50% opacity white, not solid `#87878C`
5. **Contact row height is 77px** — taller than typical list rows, gives breathing room
6. **Contact row gap between avatar and text is 16px**
7. **Row separator is bottom border only**: 1px `#1E1F2E`
8. **"Recent" label container has opacity 0.7** — not the text color alone
9. **Sub-address text weight is 500** (medium), not 400 (regular)
10. **Avatars are 44px, not 40px** — confirmed from all three avatar layouts
11. **No bottom navigation** — this is a modal/overlay sheet
12. **Close button is top-right at x=350** — 20x20px SVG with ~1.67px stroke
