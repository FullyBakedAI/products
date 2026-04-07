# Swap Screen — Structured Spec
Extracted from Figma file `rTAg5ODay1ac1ZZBq8lYwr`, node `2091-8499`
Generated: 2026-04-07 (updated with exact Figma values)

**This is the source of truth for building the swap screen HTML.** Use exact values. Do not guess.

---

## Screen Dimensions
- Width: 390px
- Height: 844px (mobile viewport)
- Background: `#0D0E17`
- Device frame border-radius: 44px
- Device frame box-shadow: `0px 40px 100px 0px rgba(0,0,0,0.9), 0px 0px 0px 12px rgba(26,27,40,1), 0px 0px 0px 10px rgba(10,11,18,1)`

## Assets
All assets are in `assets/`. Every file is a real SVG from Figma. Do not substitute or redraw.

| File | What it is | Size |
|------|-----------|------|
| `token-pill-eth.svg` | ETH icon for token pill selector | 22x22px |
| `icon-chevron-down.svg` | Dropdown chevron on token pill | 13x13px |
| `swap-arrow-divider.svg` | Circular arrow divider between pay/receive | 36x36px (button), 15x15px (icon inside) |
| `icon-backspace.svg` | Backspace/delete key on numpad | 20x16px |
| `icon-settings.svg` | Settings gear in header | 15x15px |
| `icon-close.svg` | Close X button in header | 20x20px |

---

## Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bk-bg-base` | `#0D0E17` | Screen background, swap direction button bg |
| `--bk-bg-card` | `#13141F` | Pay card (flat state), receive card, percentage button bg, bottom CTA bg |
| `--bk-bg-card-gradient` | linear-gradient `#1A1A29` to `#1F1F33` | Pay card background (swap-select variant with gradient) |
| `--bk-bg-input` | `#1A1A29` | Search field background (in select overlay) |
| `--bk-border-subtle` | `#1E1F2E` | Card borders, percentage button borders, header bottom border, token row separators, swap direction button border |
| `--bk-border-card-gradient` | `rgba(45, 44, 74, 0.2)` | Pay card border (gradient variant) |
| `--bk-text-primary` | `#F5F5F6` | Input values, header title, numpad digits, token pill text |
| `--bk-text-secondary` | `#B3B2B8` | Percentage button text, swap arrow icon stroke |
| `--bk-text-muted` | `#87878C` | "You pay"/"You receive" labels, dollar equivalent, balance text, close icon stroke |
| `--bk-brand-primary` | `#584BEB` | "Select token" button bg, input cursor |
| `--bk-brand-white` | `#FFFFFF` | "Select token" button text |

---

## Typography (all Inter)

| Element | Weight | Size | Line-height | Color | Notes |
|---------|--------|------|-------------|-------|-------|
| Header title "Swap" | 600 | 18px | 1.5em (27px) | `#F5F5F6` | |
| "You pay" / "You receive" | 400 | 12px | 1.5em (18px) | `#87878C` | opacity 0.6 on parent container |
| Input value "0" | 300 | 36px | 1.5em (54px) | `#F5F5F6` | Light weight, not regular |
| Dollar equivalent "≈ $0.00" | 400 | 13px | 1.5em (19.5px) | `#87878C` | opacity 0.7 on parent |
| Token pill ticker "ETH" | 600 | 14px | 1.5em (21px) | `#F5F5F6` | center-aligned |
| Balance "1.1421 ETH" | 400 | 12px | 1.5em (18px) | `#87878C` | opacity 0.6 on parent |
| "Select token" pill button | 600 | 14px | 1.5em (21px) | `#FFFFFF` | center-aligned |
| Percentage button text | 500 | 13px | 1.5em (20px) | `#B3B2B8` | center-aligned |
| Numpad digits 0-9, "." | 400 | 24px | 1.5em (36px) | `#F5F5F6` | center-aligned |
| Bottom CTA "Select a token" | 600 | 16px | 1.5em (24px) | `#87878C` | center-aligned, disabled state |

---

## Layout — Top to Bottom

### 1. Status Bar
- Position: y=0, width=390px, height=37px
- Layout: row, justify space-between, align center, padding 0 32px, gap ~219px
- Time "9:41": Inter 600, 14px, `#F5F5F6`
- Signal/wifi/battery icons on right, total width 79px, height 12px, gap 6px

### 2. Header Bar
- Position: y=37px (below status bar), width=390px, height=67px
- Layout: row, justify space-between, align center, padding 0 20px
- Border-bottom: 1px `#1E1F2E` (via stroke on bottom only)
- **Left group** (width ~80px, height 27px, row, gap 12px, align center):
  - Close button: 20x20px frame (contains X icon)
  - Title container: height 27px, contains "Swap" text
- **Right**: Settings button — 34x34px, border-radius 10px, bg `#13141F`, border 1px `#1E1F2E`, padding 0 8.5px, contains 15x15px icon

### 3. Content Area
- Position: y=67px (below header), width=390px, height=646px
- Contains pay card, receive card, percentage pills, keypad, swap direction button, all absolutely positioned

### 4. "You Pay" Card
- Position: x=16px, y=16px (relative to content area; y=83px from screen top)
- Width: 358px, height: 138px
- Background: `#13141F` (flat) OR linear-gradient `#1A1A29` to `#1F1F33` (active/selected variant)
- Border: 1px `#1E1F2E` (flat) OR 1px `rgba(45, 44, 74, 0.2)` (gradient variant)
- Border-radius: 16px
- Padding: 17px 17px 1px 17px (top right bottom left)
- Layout: column, gap 8px, align stretch

**Card content:**
- **Label row** (height 18px, full-width):
  - "You pay" text at x=0, y=0.5px
  - Entire row has opacity 0.6
- **Value row** (height 78px, full-width, absolutely positioned within card):
  - **Left column** (width 48.26px, height 78px, column, gap 5px):
    - Amount container (row, align center, gap 4px):
      - "0" text frame: 22.23x54px
      - Cursor: 1x36px, fill `#584BEB`, opacity ~0.99 (blinking cursor)
    - Dollar equivalent (row, full-width, opacity 0.7):
      - "≈ $0.00" text: hug content
  - **Right column** (x=218.84px, y=4px, width 105.16px, height 66px, column, align end, gap 8px):
    - TokenPill (width 105.16px, height fills parent):
      - Border-radius: 16777200px (fully round / pill shape)
      - Background: `#13141F`
      - Border: 1px `#1E1F2E`
      - TokenIcon: 22x22px at x=13, y=9 inside pill
      - Ticker text "ETH": at x=43, y=9.5, width 28.16px
      - Chevron icon: 13x13px at x=79.16, y=13.5 (stroke `#87878C`, weight 1.08px)
    - Balance text "1.1421 ETH" (width 59.39px, height 18px, opacity 0.6):
      - Inter 400, 12px, `#87878C`

### 5. Swap Direction Button
- Container: width=390px, height=36px, positioned at y=140px (relative to content area)
- Layout: row, justify center, padding 0 177px
- **Button**: 36x36px, border-radius 14px
  - Background: `#0D0E17` (base bg color)
  - Border: 1px `#1E1F2E`
  - Padding: 0 9.5px, layout row, justify center, align center
  - **Arrow icon**: 15x15px inside
    - Vertical line: x=7.5, y=3.13, height 8.75px, stroke `#B3B2B8`, weight 1.25px
    - Arrowhead: x=3.13, y=7.5, width 8.75px, height 4.38px, stroke `#B3B2B8`, weight 1.25px

### 6. "You Receive" Card
- Position: x=16px, y=166px (relative to content area; y=233px from screen top)
- Width: 358px, height: 114px
- Background: `#13141F`
- Border: 1px `#1E1F2E`
- Border-radius: 16px
- Padding: 17px 17px 1px 17px
- Layout: column, gap 8px, align stretch

**Card content:**
- **Label row** (height 18px, full-width, opacity 0.6):
  - "You receive" text at x=0, y=0.5px
- **Value row** (row, justify space-between, align center, gap ~178px, full-width):
  - **Left**: "0" text frame (22.23x54px, opacity 0.4)
    - Inter 300, 36px, `#87878C` (muted because no token selected)
  - **Right**: "Select token" button
    - Width: 123.8px, height: 41px
    - Background: `#584BEB`
    - Border-radius: 16777200px (fully round / pill shape)
    - Text "Select token": at x=20, y=10, width 85px
    - Inter 600, 14px, `#FFFFFF`, center-aligned

### 7. Percentage Buttons Row
- Position: x=0, y=300px (relative to content area; y=367px from screen top)
- Width: 390px, height: 37.5px
- Layout: row, gap 8px, padding 0 16px
- **Each button** (4 total: "25%", "50%", "75%", "Max"):
  - Width: fills available (equal distribution within 358px usable)
  - Height: 37.5px
  - Background: `#13141F`
  - Border: 1px `#1E1F2E`
  - Border-radius: 14px
  - Text: Inter 500, 13px, `#B3B2B8`, center-aligned
  - Text positioned roughly centered (y=10px from top of button)

### 8. Numpad
- Position: x=0, y=349.5px (relative to content area; y=416.5px from screen top)
- Width: 390px, height: 296.5px
- Layout: absolute positioning (grid-like, 3 columns x 4 rows)
- **Each key cell**:
  - Width: 119.33px (col 1) or 119.34px (cols 2-3)
  - Height: 74.13px
  - Border-radius: 14px
  - Padding: 14px 0px (vertical centering)
  - Layout: row, justify center, align center
  - No visible background (transparent)
  - Text: Inter 400, 24px, `#F5F5F6`, center-aligned
- **Grid positions** (x, y relative to numpad container):
  - Row 1: (16, 0), (135.33, 0), (254.66, 0) — keys "1", "2", "3"
  - Row 2: (16, 74.13), (135.33, 74.13), (254.66, 74.13) — keys "4", "5", "6"
  - Row 3: (16, 148.25), (135.33, 148.25), (254.66, 148.25) — keys "7", "8", "9"
  - Row 4: (16, 222.38), (135.33, 222.38), (254.66, 222.38) — keys ".", "0", backspace
- **Backspace key** (bottom-right):
  - Same cell dimensions, padding 0 49.67px (horizontal centering for icon)
  - Contains icon frame: 20x16px

### 9. Bottom CTA Button
- Position: x=16px, y=725px (relative to swap screen frame; absolute from content area)
- Width: 358px, height: 58px
- Background: `#13141F`
- Border: 1px `#1E1F2E`
- Border-radius: 16px
- Text "Select a token": centered at x=123.51, y=16, width 110px, height 24px
- Inter 600, 16px, `#87878C`, center-aligned
- This is the disabled/prompt state — not the active swap button

---

## Key Design Decisions
1. **Input font weight is 300 (Light)** — not 400. This is a deliberate design choice for the large amount display.
2. **Numpad is custom** — not a native input. Each key is a tap target with 74.13px height for easy tapping.
3. **No bottom navigation** — this is a full-screen modal.
4. **Token pill has dropdown chevron** — 13x13px, indicates it's tappable to change token.
5. **Swap direction button overlaps both cards** — 36x36px circle at the boundary, bg matches screen bg to "cut out" of the cards.
6. **"Select token" is purple CTA** — `#584BEB` pill, draws attention to required action.
7. **Bottom button is disabled state** — `#13141F` bg with `#87878C` text, not purple, until both tokens selected.
8. **Pay card has two variants** — flat (`#13141F`) and gradient (`#1A1A29` to `#1F1F33`). The gradient variant appears in the swap-select state.
9. **Cursor is brand-colored** — 1px wide, 36px tall, `#584BEB` with ~0.99 opacity.
10. **Percentage buttons use 14px border-radius** — same as keypad cells and settings button, creating visual consistency.
11. **Label opacity** — "You pay"/"You receive" labels sit in a container with opacity 0.6, not on the text itself.
12. **Receive card "0" has opacity 0.4** — dimmer than pay card to indicate no input yet.
