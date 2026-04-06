# Modulo Home Screen — Build Spec

Extracted directly from Figma node 2118-5757. All values are exact — use them verbatim.

## Canvas
- Frame: 390 × 844px (iPhone 14 dimensions)
- Background: `#0D0E17`
- Border radius: 44px (phone shell)
- Box shadow: `0px 40px 100px 0px rgba(0,0,0,0.9), 0px 0px 0px 12px rgba(26,27,40,1), 0px 0px 0px 10px rgba(10,11,18,1)`

## Color Tokens (exact from Figma)
```css
--bk-bg-base:         #0D0E17;   /* MobileFrame background */
--bk-bg-surface:      #13141F;   /* Cards, elevated surfaces */
--bk-bg-elevated:     #1A1A29;   /* Higher elevation, containers */
--bk-bg-card:         #3A3B4E;   /* Token/asset card bg */
--bk-border:          #1E1F2E;   /* Borders (from v2 extraction) */
--bk-purple:          #584BEB;   /* Primary accent */
--bk-purple-soft:     #627EEA;   /* Softer purple, secondary */
--bk-purple-dim:      rgba(88,75,235,0.18); /* Purple tint background */
--bk-text-primary:    #F5F5F6;   /* Main text */
--bk-text-white:      #FFFFFF;   /* Pure white text */
--bk-text-secondary:  #87878C;   /* Subdued/label text */
--bk-text-subtle:     #B3B2B8;   /* Placeholder/hint text */
--bk-text-muted:      rgba(245,245,246,0.35); /* Ghost text */
--bk-green:           #22C55E;   /* Positive/gain */
--bk-teal:            #26A17B;   /* USDT brand */
--bk-red:             #F04348;   /* Negative/loss */
--bk-orange:          #F7931A;   /* BTC brand */
--bk-blue:            #2775CA;   /* USDC brand */
--bk-blue-arb:        #627EEA;   /* Arbitrum brand */
--bk-purple-sol:      #9945FF;   /* Solana brand */
--bk-font:            'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

## Typography Scale (exact from Figma)
| Use | Size | Weight | Color token |
|-----|------|--------|-------------|
| Nav label (active) | 11px | 500 | `--bk-text-secondary` → active: `--bk-purple-soft` |
| Caption / label | 12px | 400–500 | `--bk-text-secondary` |
| Body small | 13px | 400–500 | `--bk-text-primary` |
| Body | 14px | 400–500 | `--bk-text-primary` |
| Body medium | 15px | 500–600 | `--bk-text-primary` |
| Subheading | 18px | 600 | `--bk-text-primary` |
| Heading | 22px | 600–700 | `--bk-text-primary` |
| Balance hero | 32px | 700 | `--bk-text-primary` |

## Border Radii
```css
--bk-r-sm:   6px;
--bk-r-md:   10px;
--bk-r-lg:   14px;
--bk-r-xl:   16px;
--bk-r-2xl:  44px;   /* phone shell */
--bk-r-pill: 9999px;
```

## Screen Structure — Home

### 1. Status Bar (top, full width)
- Height: ~44px
- Padding: 14px 28px
- Left: time "9:41" — 15px, weight 600, `--bk-text-primary`
- Right: signal icon + wifi icon + battery icon (SVGs from assets/)

### 2. Portfolio Header
- Background: gradient blending into `--bk-bg-base`
- "Portfolio" tab label — 11px, weight 500, `--bk-text-secondary` (active state: `--bk-purple-soft`)

### 3. Balance Block (centre)
- Total balance: **$12,847** — 32px, weight 700, `--bk-text-primary`
- Cents: **.53** — 22px, weight 700, `--bk-text-secondary`
- Change pill: **$623.11 (5.08%)** — 13px, weight 500, `--bk-green`
- Arrow icon next to change amount

### 4. Chart
- SVG area chart, ~96px tall, full width minus 32px padding
- Line colour: `--bk-purple`
- Fill: gradient from `rgba(88,75,235,0.3)` → transparent
- Time pills below: **1D / 1W / 1M / 1Y** — 12px, weight 500
  - Active pill: bg `--bk-bg-elevated`, text `--bk-text-primary`
  - Inactive: no bg, text `--bk-text-secondary`

### 5. Action Buttons (row of 4)
- Each: icon (52×52, bg `--bk-purple-dim`, border `rgba(88,75,235,0.25)`) + label below
- Icons from assets/: `icon-swap.svg`, `icon-buy.svg`, `icon-send.svg`, `icon-receive.svg`
- Labels: "Swap" / "Buy" / "Send" / "Receive" — 12px, weight 500, `--bk-text-secondary`
- Gap between buttons: 8px
- Row padding: 20px horizontal

### 6. Assets List
Section header: "Assets" — 15px, weight 600, `--bk-text-primary`

Each asset row (height ~64px, padding 16px horizontal):
- Left: token icon (36px circle) + chain badge (14px, bottom-right)
- Centre: token name (15px, 600, primary) + chain/network (13px, 400, secondary)
- Right: USD value (15px, 600, primary) + change % (13px, 500, green/red)

Assets to show:
| Token | Icon | Chain | Value | Change |
|-------|------|-------|-------|--------|
| ETH | token-eth.svg | Ethereum | $8,240.16 | +3.2% |
| BTC | token-btc.svg | Bitcoin | $3,114.85 | +1.8% |
| USDC | token-usdc.svg | Base | $876.44 | 0.0% |
| SOL | token-sol.svg | Solana | $616.08 | -2.1% |

### 7. Bottom Navigation
- Height: 64px + safe area
- Background: `--bk-bg-surface`
- Border-top: 1px `--bk-border`
- 4 tabs: Portfolio / Swap / Send / Explore
- Icons: 22×22 SVG stroke icons
- Active tab: `--bk-purple-soft`
- Inactive: `--bk-text-secondary`
- Label: 10px, weight 500

## Assets Required (already in Prototype/assets/)
- `icon-signal.svg`, `icon-wifi.svg`, `icon-battery.svg` — status bar
- `icon-swap.svg`, `icon-buy.svg`, `icon-send.svg`, `icon-receive.svg` — action buttons
- `token-eth.svg`, `token-btc.svg`, `token-usdc.svg`, `token-sol.svg` — asset list
- `wallet-avatar.svg` — greeting (if shown)
- `icon-change-up.svg`, `icon-change-down.svg` — change indicators

## What NOT to do
- No hardcoded hex values — use `var(--bk-*)` tokens for everything
- No emoji or unicode as icon substitutes — use the SVG files
- No empty state — populate with the mock data in this spec
- No guessing — if a value isn't here, ask
