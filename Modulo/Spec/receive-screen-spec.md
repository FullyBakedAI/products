# Receive Screen — Structured Spec
Extracted from Figma file `rTAg5ODay1ac1ZZBq8lYwr`, node `2091-8011`
Generated: 2026-04-07 (updated with exact Figma values at depth 5)

**This is the source of truth for building the receive screen HTML.** Use exact values. Do not guess.

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
| `wallet-avatar-green.svg` | Green wallet avatar | 42x42px |
| `icon-copy.svg` | Copy address action button | 34x34px container, 15x15px icon |
| `icon-share.svg` | Share action button | 34x34px container, 15x15px icon |
| `qr-code.svg` | QR code pattern | 163x163px (within 203px container) |
| `network-ethereum.svg` | Ethereum network icon | 18x18px |
| `network-arbitrum.svg` | Arbitrum network icon | 18x18px |
| `network-base.svg` | Base network icon | 18x18px |
| `network-optimism.svg` | Optimism network icon | 18x18px |
| `network-polygon.svg` | Polygon network icon | 18x18px |

---

## Colour Palette
Exact hex values from Figma:

| Token | Hex | Usage |
|-------|-----|-------|
| `--bk-bg-base` | `#0D0E17` | Screen background |
| `--bk-bg-card` | `#1A1A29` to `#1F1F33` | Address card (gradient, two stops) |
| `--bk-bg-card-border` | `rgba(45, 44, 74, 0.2)` | Address card border |
| `--bk-bg-drag-handle` | `#1E1F2E` | Drag handle pill |
| `--bk-bg-pill` | `#13141F` | Network pill background |
| `--bk-bg-exchange` | `#13141F` | Exchange button background |
| `--bk-bg-qr` | `#FFFFFF` | QR code container background |
| `--bk-border-subtle` | `#1E1F2E` | Network pill borders, exchange button borders |
| `--bk-text-primary` | `#F5F5F6` | Title, wallet name, exchange button text |
| `--bk-text-subtitle` | `#87878C` | Subtitle, truncated address, section labels |
| `--bk-text-pill` | `#B3B2B8` | Network pill text |
| `--bk-brand-primary` | `#584BEB` | Modulo badge bg, Done button gradient start |
| `--bk-brand-secondary` | `#4A3DE0` | Done button gradient end |
| `--bk-brand-glow` | `rgba(88, 75, 235, 0.3)` | Done button glow shadow |
| `--bk-avatar-green-bg` | `#13201A` | Green avatar background |
| `--bk-avatar-green-border` | `rgba(52, 211, 153, 0.2)` | Green avatar border |
| `--bk-avatar-green-icon` | `#34D399` | Green avatar icon stroke |
| `--bk-badge-primary` | `#584BEB` | Modulo "M" badge background |
| `--bk-badge-text` | `#FFFFFF` | Modulo "M" badge letter |
| `--bk-icon-action` | `#B3B2B8` | Copy/Share button icon stroke |

---

## Typography (all Inter)

| Element | Weight | Size | Line Height | Color | Align |
|---------|--------|------|-------------|-------|-------|
| Screen title "Receive crypto" | 600 | 20px | 1.5em (30px) | `#F5F5F6` | LEFT (within centered container) |
| Subtitle "Share your address or QR code to receive crypto" | 400 | 14px | 1.6em (~22.4px) | `#87878C` | CENTER |
| Wallet name "modulo.eth" | 600 | 15px | 1.5em (22.5px) | `#F5F5F6` | LEFT |
| Truncated address "0x7f3e...9A14" | 400 | 12px | 1.5em (18px) | `#87878C` | LEFT |
| Modulo badge "M" | 700 | 8px | 1.5em (12px) | `#FFFFFF` | LEFT |
| Section labels ("Supported networks", "Fund from an exchange") | 400 | 12px | 1.5em (18px) | `#87878C` | LEFT |
| Network pill text (Ethereum, Arbitrum, etc.) | 400 | 13px | 1.5em (19.5px) | `#B3B2B8` | LEFT |
| Exchange button text (Coinbase, Binance, etc.) | 500 | 15px | 1.5em (22.5px) | `#F5F5F6` | CENTER |
| Done button text | 600 | 16px | 1.5em (24px) | `#FFFFFF` | CENTER |
| Status bar time "9:41" | 600 | 14px | 1.5em (21px) | `#F5F5F6` | LEFT |

---

## Layout — Top to Bottom

### 1. Status Bar
- Position: y=0, full width 390px, height: 37px
- Layout: row, justify: space-between, align: center
- Padding: 0 32px
- Left: "9:41" (Inter 600, 14px, `#F5F5F6`)
- Right: signal bars + wifi + battery (standard system icons)

### 2. Drag Handle
- Position: y=0 within ReceiveScreen (top of sheet content)
- Container: 390px wide, 20px tall, flex row, justify: center
- Padding: 12px 179px 0px
- **Handle pill:**
  - Width: 32px
  - Height: 4px
  - Border-radius: 16777200px (fully rounded / pill)
  - Background: `#1E1F2E`

### 3. Screen Header
- Container: 390px wide, 94.4px tall
- Layout: column, align: center, gap: 6px
- Padding: 16px 0 0

**Title:**
- Container: 144.78px x 30px
- Text: "Receive crypto"
- Font: Inter 600, 20px, line-height 1.5em
- Color: `#F5F5F6`

**Subtitle:**
- Container: 322.97px x 22.4px
- Text: "Share your address or QR code to receive crypto"
- Font: Inter 400, 14px, line-height 1.6em
- Color: `#87878C`
- Text-align: CENTER

### 4. Address Card
- Position: x=20, y=94.4 (within content container)
- Width: 350px, Height: 76.5px
- Background: gradient from `#1A1A29` to `#1F1F33`
- Border: 1px solid `rgba(45, 44, 74, 0.2)`
- Border-radius: 16px
- Layout: row, gap: 8px
- Padding: 17px 17px 1px

**WalletAvatar (left):**
- Width: 42px, Height: 42px
- Border-radius: fully round (16777200px)
- Background: `#13201A`
- Border: 1px solid `rgba(52, 211, 153, 0.2)`
- Internal icon: strokes in `#34D399` at ~1.81px weight
- Padding: 0 ~8.45px (centering icon)

**Text container (middle):**
- Layout: column, gap: 2px, flex: 1 (fill)

**Row 1 — Name + Badge:**
- Layout: row, align: center, gap: 8px
- Name text frame: ~82.4px x 22.5px
  - "modulo.eth" — Inter 600, 15px, line-height 1.5em, color `#F5F5F6`
- **Modulo "M" badge:**
  - Width: 17px, Height: 17px
  - Border-radius: 4px
  - Background: `#584BEB`
  - Layout: row, justify: center, align: center
  - Padding: 0 ~4.3px
  - Letter "M" text frame: 8.39px x 13.5px
  - Letter: "M", Inter 700, 8px, line-height 1.5em, color `#FFFFFF` (probably not visible at this size, acts as brand mark)

**Row 2 — Truncated address:**
- Container: fill width, height 18px
- Opacity: 0.7
- Text: "0x7f3e...9A14"
- Font: Inter 400, 12px, line-height 1.5em
- Color: `#87878C`

**Action buttons (right):**
- Container: 76px x 34px
- Layout: row, align: center, gap: 8px
- Two circular icon buttons:
  - Each: 34px x 34px
  - Layout: row, justify: center, align: center
  - Padding: 0 9.5px
  - Icon inside: 15px x 15px
  - Icon stroke: `#B3B2B8`, stroke-width: 1.25px
  - First button: Copy icon
  - Second button: Share icon

### 5. QR Code Container
- Position: x=0 (centered), y=190.9 (within content container)
- Outer wrapper: 390px wide, 203px tall
- Layout: row, justify: center
- Padding: 0 93.5px

**QR code frame:**
- Width: 203px, Height: 203px
- Background: `#FFFFFF`
- Border-radius: 24px
- Padding: 20px 20px 0
- Contains QR code pattern (grid of 2px-radius cells in black `#000000` on white)
- Effective QR display area: ~163px x ~183px

### 6. Supported Networks Section
- Position: x=0, y=413.9 (within content container)
- Container: 390px wide, 69.5px tall
- Layout: column, gap: 10px
- Padding: 0 20px

**Section label:**
- Container: fill width, height 18px
- Opacity: 0.7
- Text: "Supported networks"
- Font: Inter 400, 12px, line-height 1.5em
- Color: `#87878C`

**Network pills row:**
- Layout: row, gap: 8px, fill width

Each network pill:
- Border-radius: 16777200px (fully rounded / capsule)
- Background: `#13141F`
- Border: 1px solid `#1E1F2E`
- Height: 37.5px

**Pill internal layout (absolute positioning):**
- Icon: 18x18px, positioned at x=13, y=9.75
- Text: positioned at x=39, y=9
- Padding effectively: ~13px left (to icon), ~13px right (after text)

**Individual pill widths:**

| Network | Pill Width | Text |
|---------|-----------|------|
| Ethereum | 110.67px | "Ethereum" — Inter 400, 13px, `#B3B2B8` |
| Arbitrum | 105.4px | "Arbitrum" — Inter 400, 13px, `#B3B2B8` |
| Base | 82.25px | "Base" — Inter 400, 13px, `#B3B2B8` |
| Optimism | 110.09px | "Optimism" — Inter 400, 13px, `#B3B2B8` |
| Polygon | 101.74px | "Polygon" — Inter 400, 13px, `#B3B2B8` |

Total pills width: ~518px (will overflow 350px available). Needs horizontal scroll or wrap.

### 7. Fund from Exchange Section
- Position: x=0, y=503.4 (within content container)
- Container: 390px wide, 278px tall
- Layout: column, gap: 10px
- Padding: 0 20px

**Section label:**
- Container: fill width, height 18px
- Opacity: 0.7
- Text: "Fund from an exchange"
- Font: Inter 400, 12px, line-height 1.5em
- Color: `#87878C`

**Exchange buttons column:**
- Layout: column, gap: 8px, fill width
- Height: 250px

Each exchange button:
- Width: 350px, Height: 56.5px
- Background: `#13141F`
- Border: 1px solid `#1E1F2E`
- Border-radius: 16px

**Exchange button text (centered within button):**

| Exchange | Text | Text Width |
|----------|------|-----------|
| Coinbase | "Coinbase" — Inter 500, 15px, `#F5F5F6` | ~68px |
| Binance | "Binance" — Inter 500, 15px, `#F5F5F6` | ~58px |
| Kraken | "Kraken" — Inter 500, 15px, `#F5F5F6` | ~50px |
| Another wallet | "Another wallet" — Inter 500, 15px, `#F5F5F6` | ~105px |

Text position: centered horizontally (x varies), y=16 within button.

### 8. Done Button
- Position: x=16, y=727 (within content container, near bottom)
- Width: 358px, Height: 56px
- Background: `linear-gradient(135deg, rgba(88, 75, 235, 1) 0%, rgba(74, 61, 224, 1) 100%)`
- Border-radius: 16px
- Box-shadow (glow): `0px 0px 24px 0px rgba(88, 75, 235, 0.3)`

**Button text:**
- Text: "Done"
- Position: centered (x=158.73, y=15 within button)
- Dimensions: ~41px x 24px
- Font: Inter 600, 16px, line-height 1.5em
- Color: `#FFFFFF`
- Text-align: CENTER

### 9. Home Indicator Bar
- Position: x=132, y=0 (bottom of screen container)
- Width: 126px, Height: 34px
- Background: `#0D0E17`
- Border-radius: 0 0 20px 20px

---

## Shared Component: WalletAvatar (Receive variant)
- Size: 42x42px (slightly smaller than Send screen's 44px)
- Border-radius: fully round
- Background: `#13201A` (green variant)
- Border: 1px solid `rgba(52, 211, 153, 0.2)`
- Icon stroke: `#34D399` at ~1.81px weight

## Shared Component: Modulo "M" Badge
- Width: 17px, Height: 17px
- Border-radius: 4px
- Background: `#584BEB`
- Letter: "M", Inter 700, 8px, `#FFFFFF`
- Appears inline next to ENS names with 8px gap

## Shared Component: Network Pill
- Height: 37.5px
- Border-radius: fully round (capsule)
- Background: `#13141F`
- Border: 1px solid `#1E1F2E`
- Icon: 18x18px, positioned left
- Text: Inter 400, 13px, color `#B3B2B8`
- Width varies by network name

## Shared Component: Exchange Button
- Width: 350px (fill), Height: 56.5px
- Background: `#13141F`
- Border: 1px solid `#1E1F2E`
- Border-radius: 16px
- Text: Inter 500, 15px, `#F5F5F6`, centered

## Shared Component: Done Button (CTA)
- Width: 358px, Height: 56px
- Background: `linear-gradient(135deg, #584BEB 0%, #4A3DE0 100%)`
- Border-radius: 16px
- Glow: `0px 0px 24px 0px rgba(88, 75, 235, 0.3)`
- Text: Inter 600, 16px, `#FFFFFF`, centered

---

## Key Design Decisions
1. **Title is 20px** (vs Send screen's 18px) — Receive is a full sheet, Send is a modal
2. **Subtitle font is 14px with 1.6em line height** — slightly looser than body text
3. **Address card has a gradient background** — `#1A1A29` to `#1F1F33`, not flat
4. **Address card border is very subtle** — `rgba(45, 44, 74, 0.2)`, nearly invisible
5. **Wallet name weight is 600 (semibold)** on Receive vs 500 (medium) on Send — intentional hierarchy difference
6. **QR container radius is 24px** — larger than card radius (16px)
7. **Network pills are fully rounded capsules** — not 20px radius
8. **5 networks shown** (Ethereum, Arbitrum, Base, Optimism, Polygon) — total width exceeds container, needs scroll
9. **4 exchange buttons** including "Another wallet" — not 3
10. **Done button has gradient + glow** — this is the primary CTA pattern for the app
11. **Done button gradient is 135deg** — diagonal, not horizontal
12. **Exchange button background is `#13141F`** — darker than address card, same as network pills
13. **Action buttons (Copy/Share) are 34px circles** with 15px icons, not text links
14. **Sub-address has opacity 0.7 on container** — not just muted text color
15. **Avatar on Receive is 42px** — 2px smaller than Send screen's 44px avatars
