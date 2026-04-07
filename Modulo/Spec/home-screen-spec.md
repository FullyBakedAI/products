# Home Screen — Structured Spec
Extracted from Figma file `rTAg5ODay1ac1ZZBq8lYwr`, node `2091-8254`
Generated: 2026-04-07 (re-extracted with full depth)

**This is the source of truth for building the home screen HTML.** Use exact values. Do not guess.

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
| `logo-modulo.svg` | Modulo wordmark/logo | 93.38x18px |
| `icon-notification.svg` | Notification bell | 16x16px |
| `icon-settings.svg` | Settings gear | 16x16px |
| `icon-wifi.svg` | WiFi indicator (status bar) | 16x12px |
| `icon-gain-arrow.svg` | Green up-arrow for gains | 8x8px |
| `chart-line.svg` | Portfolio chart sparkline | 358x148px |
| `token-usdc.svg` | USD Coin icon | 40x40px |
| `token-btc.svg` | Bitcoin icon | 40x40px |
| `token-eth.svg` | Ethereum icon | 40x40px |
| `token-sol.svg` | Solana icon | 40x40px |
| `token-usdt.svg` | Tether icon | 40x40px |
| `icon-action-swap.svg` | Swap action button icon | 20px |
| `icon-action-buy.svg` | Buy action button icon | 20px |
| `icon-action-send.svg` | Send action button icon | 20px |
| `icon-action-receive.svg` | Receive action button icon | 20px |
| `icon-nav-home.svg` | Bottom nav: home | 22px |
| `icon-nav-search.svg` | Bottom nav: search | 22px |
| `icon-nav-activity.svg` | Bottom nav: activity | 22px |
| `icon-nav-swap.svg` | Bottom nav: swap (in purple circle) | 22px |

---

## Colour Palette (canonical from Figma)

| Token name | Hex | Usage |
|-----------|-----|-------|
| `--bk-bg-base` | `#0D0E17` | Screen/frame background |
| `--bk-bg-card` | `#1A1A29` | Card backgrounds, action buttons |
| `--bk-bg-card-alt` | `#1A1A29` to `#1F1F33` | Portfolio card inner gradient fill |
| `--bk-bg-nav` | `#13141F` | Bottom navigation bar |
| `--bk-border-subtle` | `#1E1F2E` | Card borders, nav top border, action button borders |
| `--bk-border-card` | `rgba(45, 44, 74, 0.2)` | Portfolio card inner border |
| `--bk-text-primary` | `#F5F5F6` | Primary text, headings, values |
| `--bk-text-secondary` | `#B3B2B8` | Secondary text (cents, action labels) |
| `--bk-text-muted` | `#87878C` | Muted text (token amounts, inactive tabs, "PORTFOLIO" label) |
| `--bk-brand-primary` | `#584BEB` | Brand purple -- active time button, CTA buttons, earn card accent, active tab underline |
| `--bk-brand-gradient` | `linear-gradient(135deg, #584BEB 0%, #4A3DE0 100%)` | Swap button in bottom nav |
| `--bk-success` | `#22C55E` | Positive gains text and chart sparkline stroke |
| `--bk-earn-card-bg` | `rgba(88, 75, 235, 0.18)` | Earn card background |
| `--bk-earn-card-border` | `rgba(88, 75, 235, 0.2)` | Earn card border |
| `--bk-chart-gradient` | `linear-gradient(180deg, rgba(88,75,235,0.18) 0%, rgba(88,75,235,0) 100%)` | Chart area fill behind sparkline |
| `--bk-chart-stroke` | `rgba(88, 75, 235, 0.5)` | Chart sparkline stroke, weight: 1.62px |
| `--bk-status-bar-dim` | `#3A3B4E` | Status bar signal bars (inactive) |
| `--bk-status-bar-battery-cap` | `rgba(245, 245, 246, 0.35)` | Battery cap and outline |

---

## Typography (all Inter)

| Style | Font | Weight | Size | Line Height | Extra |
|-------|------|--------|------|-------------|-------|
| Status bar time | Inter | 600 | 14px | 1.5em | -- |
| Section label ("PORTFOLIO") | Inter | 500 | 11px | 1.5em | letter-spacing: 7%, text-transform: uppercase, color: `#87878C` |
| Time period button text | Inter | 600 | 11px | 1.5em | Active: `#FFFFFF`, Inactive: `#87878C` |
| Portfolio value (dollars) | Inter | 500 | 32px | 1.5em | letter-spacing: -3.125%, color: `#F5F5F6` |
| Portfolio value (cents) | Inter | 400 | 18px | 1.5em | opacity: 0.4, color: `#B3B2B8` |
| Gain text | Inter | 400 | 12px | 1.5em | color: `#22C55E` |
| Tab text (active - "Tokens") | Inter | 600 | 15px | 1.5em | color: `#F5F5F6` |
| Tab text (inactive - "NFTs") | Inter | 400 | 15px | 1.5em | color: `#87878C` |
| Token name | Inter | 500 | 15px | 1.5em | color: `#F5F5F6` |
| Token amount | Inter | 400 | 12px | 1.5em | opacity: 0.7, color: `#87878C` |
| Token value (right side) | Inter | 500 | 15px | 1.5em | text-align: right, color: `#F5F5F6` |
| Token change % | Inter | 400 | 12px | 1.5em | text-align: right, color: `#22C55E` (gain) |
| Action button label | Inter | 500 | 11px | 1.5em | color: `#B3B2B8` |
| Earn card label | Inter | 500 | 12px | 1.5em | color: `#584BEB` |
| Earn card value | Inter | 700 | 22px | 1.5em | color: `#F5F5F6` |
| Earn card unit | Inter | 400 | 13px | 1.5em | opacity: 0.7, color: `#B3B2B8` |
| Earn button text | Inter | 600 | 13px | 1.5em | color: `#FFFFFF` |

---

## Layout -- Top to Bottom

### 1. Status Bar (y: 0, h: 37px)
- **Container:** 390x37px, row, space-between, align-center, padding: 0 32px
- **Left:** "9:41" (Inter 600, 14px, `#F5F5F6`)
- **Right cluster:** row, align-center, gap: 6px, 79x12px total
  - Signal bars: 4 bars in row, gap: 2px, align: flex-end
    - Bar 1: 4x4px, `#3A3B4E`, radius: 6px
    - Bar 2: 4x6px, `#3A3B4E`, radius: 6px
    - Bar 3: 4x8px, `#F5F5F6`, radius: 6px
    - Bar 4: fill width x 10px, `#F5F5F6`, radius: 6px
  - WiFi icon: 16x12px SVG
  - Battery: 25x12px container
    - Body: 25x12px, border: `rgba(245, 245, 246, 0.35)` 1px, radius: 6px, padding: 3px 5.45px 1px 3px
    - Fill: green bar inside, fill width x 6px, `#F5F5F6`, radius: 6px
    - Cap: 2x5px, `rgba(245, 245, 246, 0.35)`, positioned at x:27

### 2. Header Bar (within content area, y: ~26.5px from content top)
- **Logo:** `logo-modulo.svg` at x:20, y:26.5, dimensions: 93.38x18px
- **Notification icon:** x:299, y:27.5, 16x16px (bell icon, stroke: `#87878C` 1.33px)
- **Settings icon:** x:345, y:27.5, 16x16px (gear icon, stroke: `#87878C` 1.33px)

### 3. Portfolio Card (y: 64, from content area)
- **Outer container:** x:15.5, w:358px, h:166px
  - Background: `#1A1A29`
  - Border: `#1E1F2E` 1px
  - Border-radius: 16px

- **Inner gradient overlay:** x:-15 (offset for bleed), w:373px, h:165px
  - Background: gradient `#1A1A29` to `#1F1F33`
  - Border: `rgba(45, 44, 74, 0.2)` 1px
  - Border-radius: 16px
  - Padding: 17px 17px 1px 17px
  - Layout: column, gap: 8px

- **Chart background SVG:** 358x148px, positioned at x:1, y:11 inside card
  - Fill: `linear-gradient(180deg, rgba(88,75,235,0.18) 0%, rgba(88,75,235,0) 100%)`
  - Stroke: `rgba(88, 75, 235, 0.5)` at 1.62px weight

- **Content layer** (x:1, y:1 inside card, 330x141px):

  **Row 1 -- Header (x:16, y:16 inside content, 324x22.5px):**
  - Layout: row, space-between, align-center
  - Left: "PORTFOLIO" label
    - Inter 500, 11px, 1.5em line-height, letter-spacing: 7%, uppercase
    - Color: `#87878C`
    - Container: 69.3x16.5px
  - Right: Time period buttons row
    - Layout: row, align-center, gap: 4px
    - Container: 131.8x22.5px
    - **1D (active):** 28.6x22.5px, bg: `#584BEB`, radius: 10px, text: Inter 600 11px `#FFFFFF`, centered
    - **1W (inactive):** fill-width x 22.5px, no bg, radius: 10px, text: Inter 600 11px `#87878C`
    - **1M (inactive):** 30.8x22.5px, no bg, radius: 10px, text: Inter 600 11px `#87878C`
    - **1Y (inactive):** 28.51x22.5px, no bg, radius: 10px, text: Inter 600 11px `#87878C`

  **Row 2 -- Value (x:16, y:50.5, 324x48px):**
  - "$12,847" -- Inter 500, 32px, 1.5em, letter-spacing: -3.125%, color: `#F5F5F6`
  - ".53" -- Inter 400, 18px, 1.5em, color: `#B3B2B8`, opacity: 0.4, positioned adjacent at x:120.77 relative

  **Row 3 -- Gain indicator (x:16, y:106.5, 324x18px):**
  - Layout: row, align-center, gap: 6px
  - Green arrow icon: 8x8px SVG (inner arrow: 6x5px)
  - "$623.11 (5.08%)" -- Inter 400, 12px, 1.5em, color: `#22C55E`

### 4. Action Buttons Row (y: 241.5 from content top)
- 4 buttons in a horizontal row
- Each button specs:
  - **Dimensions:** 82x70.5px
  - **Background:** `#1A1A29`
  - **Border:** `#1E1F2E` 1px
  - **Border-radius:** 16px
  - **Layout:** column, align-center, gap: 6px, padding: 13px 0px
  - **Icon area:** 20px wide, fill height (icon SVG inside)
  - **Label:** Inter 500, 11px, 1.5em, color: `#B3B2B8`, centered

| Button | X position | Label | Icon stroke color |
|--------|-----------|-------|-------------------|
| Swap | x:16 | "Swap" | `#584BEB` (1.82px stroke) |
| Buy | x:108 | "Buy" | `#584BEB` |
| Send | x:200 | "Send" | `#584BEB` |
| Receive | x:292 | "Receive" | `#584BEB` |

### 5. Token/NFT Tabs (y: 328 from content top)
- **"Tokens" tab (active):**
  - Container: 52.37x36.5px at x:20
  - Text: "Tokens", Inter 600, 15px, 1.5em, `#F5F5F6`, centered
  - Bottom border: `#584BEB` 2px (applied as border-bottom via strokeWeight: 0px 0px 2px)

- **"NFTs" tab (inactive):**
  - Container: 36.66x36.5px at x:96.37
  - Text: "NFTs", Inter 400, 15px, 1.5em, `#87878C`, centered
  - Bottom border: transparent 2px (rgba(0, 0, 0, 0))

### 6. Token List (starts y: 381.25, ~73.5px per row)
Each token row is a pair of containers:
- **Left group:** Token icon + text (variable width, 41.5px height)
- **Right group:** Value + change (variable width, 42.5px height)

**Left group layout:**
- Token icon: 40x40px, positioned at x:0, y:0.75 within row
- Text container: column, gap: 1px, starts at x:52
  - Line 1 (name): Inter 500, 15px, 1.5em, `#F5F5F6`, fill-width x 22.5px height
  - Line 2 (amount): Inter 400, 12px, 1.5em, `#87878C`, opacity: 0.7, fill-width x 18px height

**Right group layout:**
- Column, align: stretch, gap: 2px
- Line 1 (value): Inter 500, 15px, 1.5em, `#F5F5F6`, text-align: right, 22.5px height
- Line 2 (change): row, justify: flex-end, align: center, gap: 4px
  - Change arrow icon: 7x7px
  - Change text: Inter 400, 12px, 1.5em, text-align: right, color: `#22C55E` (up) or `#F04348` (down)

**Row positions (y from content top):**

| # | Y pos | Icon | Name | Amount | Left width | Right width |
|---|-------|------|------|--------|------------|-------------|
| 1 | 381.25 | `token-usdc.svg` | USD Coin | 5,342.9824 USDC | 154.97px | -- |
| 2 | 454.5 | `token-btc.svg` | Bitcoin | 0.0574 BTC | 170.52px | 70.21px |
| 3 | 528 | `token-eth.svg` | Ethereum | 1.1421 ETH | 120.67px | 71.38px |
| 4 | 601.5 | `token-sol.svg` | Solana | 17.4352 SOL | 122.27px | 74.2px |
| 5 | 675 | `token-usdt.svg` | Tether | 3,398.7553 USDT | 151.95px | 72.65px |

**Row 1 right side (USDC):** Special -- sparkline chart instead of value
- Sparkline container: 138x20px at x:252, y:392 (aspect ratio: 6.9), column layout, gap: 2px

**Row 2 right side values (from Figma):**
- Value: "$5,616.88", Change: "+2.14%", color: `#22C55E`

### 7. Earn Promo Card (y: 753, from content top)
- **Container:** x:20, w:350px, h:87px
- **Background:** `rgba(88, 75, 235, 0.18)`
- **Border:** `rgba(88, 75, 235, 0.2)` 1px
- **Border-radius:** 16px
- **Layout:** row, space-between, align-center, gap: 120.23px, padding: 0 16px

**Left side (118.91x53px):**
- Column, align: stretch, gap: 2px
- Line 1: "Annual Yield Accrual" -- Inter 500, 12px, 1.5em, `#584BEB`, fill-width x 18px
- Line 2: "0.00" (Inter 700, 22px, 1.5em, `#F5F5F6`) + "k USD" (Inter 400, 13px, 1.5em, `#B3B2B8`, opacity: 0.7)
  - "0.00" container: 50.56x33px
  - "k USD" container: 38.19x19.5px, positioned at x:54.56

**Right side -- Earn button:**
- Dimensions: 76.86x35.5px
- Background: `#584BEB`
- Border-radius: 14px
- Text: "Earn ->" -- Inter 600, 13px, 1.5em, `#FFFFFF`, centered
- Text padding: ~16px from left edge, ~9px from top

### 8. Bottom Navigation (y: bottom of screen, h: 71px)
- **Background:** `#13141F`
- **Top border:** `#1E1F2E` 1px (strokeWeight: 1px 0px 0px)
- **Layout:** row, space-between, align-center, gap: 48.5px, padding: 0 40.25px

**Nav items (left to right):**

| Item | Type | Dimensions | Icon size | Extra |
|------|------|-----------|-----------|-------|
| Home | Standard | 38x38px touch target | 22px wide, fill height | column, align-center, padding: 8px 0px, radius: 14px |
| Search | Standard | 38x38px touch target | 22px wide, fill height | Same as above |
| Activity | Standard | 38x38px touch target | 22px wide, fill height | Same as above |
| Swap | CTA circle | 50x50px | 22x22px | row, justify-center, align-center, padding: 0 14px, border-radius: 16777200px (fully round) |

- **Swap button fill:** `linear-gradient(135deg, rgba(88, 75, 235, 1) 0%, rgba(74, 61, 224, 1) 100%)`

---

## Key Design Decisions (read before building)
1. **No glow effects.** Ant explicitly killed the purple glow. Don't add it.
2. **Inter is the only font.** Not SF Pro, not system fonts. Inter everywhere.
3. **The chart is an SVG asset**, not generated. Use `chart-line.svg` directly.
4. **Cents are visually de-emphasised** -- smaller font, lower opacity. This is intentional hierarchy.
5. **The purple (#584BEB) is used sparingly** -- active states, CTAs, the earn card, the swap button. Never as a background wash.
6. **Token amounts show full precision** -- 5,342.9824 not 5,342.98. Financial data.
7. **Status bar is decorative** -- 9:41 time, signal bars, battery. Include for fidelity but don't overthink it.
8. **Portfolio card has inner gradient overlay** -- the 373x165px inner frame overshoots by -15px on x. This creates the gradient bleed effect.
9. **Chart sparkline stroke** is `rgba(88, 75, 235, 0.5)` at 1.62px -- semi-transparent purple, not solid.
10. **Action button icon strokes** use `#584BEB` (brand purple) at 1.82px weight.
