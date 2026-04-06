# Design System: Omni Chain DeFi Wallet

**File Name:** First steps  
**Type:** Mobile Application UI (390px × 844px viewport)  
**Design Tool:** Figma  
**Date Extracted:** April 4, 2026

---

## Table of Contents

1. [Color Tokens](#color-tokens)
2. [Typography System](#typography-system)
3. [Spacing & Layout](#spacing--layout)
4. [Border Radius & Corners](#border-radius--corners)
5. [Shadows & Effects](#shadows--effects)
6. [Components & Screens](#components--screens)
7. [Visual Patterns](#visual-patterns)
8. [Design Decisions](#design-decisions)

---

## Color Tokens

### Primary & Neutral Colors

| Token ID | Color Value | Hex/RGBA | Use Case |
|----------|-------------|----------|----------|
| fill_MYCNUI | #0D0E17 | Deep dark navy | Primary background (main screens) |
| fill_M0W6TS | #0C0C0F | Very dark (almost black) | Secondary background |
| fill_ONYDF7 | #13141F | Dark navy-blue | Alternative dark background |
| fill_29LNWO | #3A3B4E | Dark gray-blue | Tertiary backgrounds, cards |
| fill_1E1F2E | #1E1F2E | Medium dark gray | Border/stroke color |
| fill_Y6JMRU | #1E1F2E | Medium dark gray | Dividers |
| fill_IBC0WI | #F5F5F6 | Light off-white | Primary text, light elements |
| fill_EZMJIZ | #FFFFFF | Pure white | Secondary text, emphasis |
| fill_LSMAF6 | #87878C | Medium gray | Tertiary text, disabled states |
| fill_4XWSFP | #B3B2B8 | Light gray | Subtle text, borders |
| fill_U5ZMM0 | rgba(245, 245, 246, 0.5) | White 50% opacity | Placeholder text |
| fill_ZPXL0K | rgba(245, 245, 246, 0.35) | White 35% opacity | Very subtle text |

### Brand & Accent Colors

| Token ID | Color Value | Use Case |
|----------|-------------|----------|
| fill_0ZT4RN | #584BEB | Primary action/brand purple |
| fill_1ICX49 | #627EEA | Secondary purple |
| fill_J0C97X | #8247E5 | Tertiary purple variant |

### Semantic & Status Colors

| Token ID | Color Value | Status/Meaning |
|----------|-------------|----------------|
| fill_4ITABI | #22C55E | Success/Green (positive) |
| fill_FVOTQD | #26A17B | Teal success variant |
| fill_FR30BA | #2775CA | Info/Blue |
| fill_ZHWJRG | #28A0F0 | Sky blue |
| fill_FIKOH0 | #0052FF | Deep blue |
| fill_X0IRNZ | #375BD2 | Navy blue |
| fill_M1J7HD | #F7931A | Warning/Orange |
| fill_CAM0YV | #E8821B | Darker orange |
| fill_ORQLRR | #F04348 | Error/Red |
| fill_NZ6DMY | #FF0420 | Bright red |

### Overlay & Glassmorphism Colors

| Token ID | Color Value | Purpose |
|----------|-------------|---------|
| fill_S4LO1N | rgba(88, 75, 235, 0.18) | Purple overlay, subtle |
| fill_AEIMNR | #13201A | Dark green tint |
| fill_QVRYX5 | #1A1330 | Deep purple tint |
| fill_MOE0WS | #201318 | Dark red-brown tint |

---

## Typography System

All text uses **Inter** as the primary font family. Line height consistently set to 1.5em (some styles use 1.21em for tighter spacing).

### Font Sizes & Weights

#### Display/Headline Styles

| Style ID | Font Size | Weight | Line Height | Case | Alignment | Use |
|----------|-----------|--------|------------|------|-----------|-----|
| style_1BZB4I | 36px | 300 (Light) | 1.5em | — | LEFT | Hero/Large headings |
| style_IUO49F | 24px | 400 (Regular) | 1.5em | — | CENTER | Large modals/dialogs |
| style_SMC2CK | 22px | 700 (Bold) | 1.5em | — | LEFT | Major section headers |
| style_6HZ4L4 | 18px | 600 (Semibold) | 1.5em | — | LEFT | Section headers |
| style_RPDN5Q | 20px | 600 (Semibold) | 1.5em | — | LEFT | Prominent headings |

#### Body Text Styles

| Style ID | Font Size | Weight | Line Height | Case | Alignment | Use |
|----------|-----------|--------|------------|------|-----------|-----|
| style_S04VT2 | 18px | 400 (Regular) | 1.5em | — | LEFT | Large body text |
| style_4N5XH4 | 16px | 500 (Medium) | 1.5em | — | LEFT | Emphasized body |
| style_F7MUF7 | 16px | 600 (Semibold) | 1.5em | — | CENTER | Button text (centered) |
| style_MU6PJA | 16px | 400 (Regular) | 1.21em | — | LEFT | Compact body |
| style_R4SO21 | 15px | 500 (Medium) | 1.5em | — | LEFT | Medium body (left) |
| style_MBOCSO | 15px | 500 (Medium) | 1.5em | — | RIGHT | Medium body (right) |
| style_PA5QIP | 15px | 500 (Medium) | 1.5em | — | CENTER | Medium body (centered) |
| style_M66X5F | 15px | 400 (Regular) | 1.5em | — | CENTER | Regular body (centered) |
| style_9WH9EC | 15px | 600 (Semibold) | 1.5em | — | CENTER | Emphasized body (centered) |
| style_6Q15TG | 15px | 600 (Semibold) | 1.5em | — | LEFT | Emphasized body (left) |
| style_L09YAQ | 15px | 400 (Regular) | 1.21em | — | LEFT | Compact body variant |

#### Small/Caption Text

| Style ID | Font Size | Weight | Line Height | Case | Alignment | Use |
|----------|-----------|--------|------------|------|-----------|-----|
| style_0KZBRZ | 14px | 600 (Semibold) | 1.5em | — | LEFT | Small headers |
| style_MZHNCX | 14px | 600 (Semibold) | 1.5em | — | CENTER | Small centered headers |
| style_QG66GY | 14px | 400 (Regular) | 1.60em | — | CENTER | Small body |
| style_54C6B1 | 13px | 400 (Regular) | 1.5em | — | LEFT | Caption text |
| style_AHFZB9 | 13px | 400 (Regular) | 1.5em | — | CENTER | Centered caption |
| style_MOPY40 | 13px | 400 (Regular) | 1.5em | — | RIGHT | Right-aligned caption |
| style_TTZILW | 13px | 500 (Medium) | 1.5em | — | LEFT | Medium caption |
| style_1NG0EJ | 13px | 500 (Medium) | 1.5em | — | CENTER | Centered medium caption |
| style_CVXUOT | 13px | 600 (Semibold) | 1.5em | — | CENTER | Bold caption (centered) |

#### Extra Small Text

| Style ID | Font Size | Weight | Line Height | Use |
|----------|-----------|--------|------------|-----|
| style_72BI9K | 12px | 400 (Regular) | 1.5em | Small body text |
| style_58LCU4 | 12px | 500 (Medium) | 1.5em | Medium small text |
| style_5TLZ25 | 12px | 400 (Regular) | 1.5em | Small right-aligned |
| style_BU4DV9 | 10px | 400 (Regular) | 1.21em | Tiny text (vertically centered) |
| style_ALD6MH | 10px | 400 (Regular) | 1.21em | Tiny centered text |
| style_XA2L6W | 9px | 700 (Bold) | 1.5em | Minimal bold text |
| style_1EV9E4 | 8px | 700 (Bold) | 1.5em | Tiny bold text |

#### Label & Badge Text

| Style ID | Font Size | Weight | Line Height | Case | Alignment | Use |
|----------|-----------|--------|------------|------|-----------|-----|
| style_HL9PP1 | 11px | 500 (Medium) | 1.5em | UPPER | LEFT | **Uppercase labels** |
| style_D9L48Z | 11px | 600 (Semibold) | 1.5em | — | CENTER | Badge/button labels |
| style_G573UK | 11px | 500 (Medium) | 1.5em | — | CENTER | Centered labels |

---

## Spacing & Layout

The design system uses a flexible grid with consistent spacing increments based on 4px, 8px, and 16px units.

### Common Padding Values

**Horizontal Padding:**
- `0px 20px` - Main container padding (most screens)
- `0px 16px` - Secondary container padding
- `0px 12px` - Compact padding
- `0px 8px` - Minimal padding
- `0px 14px` - Button/control padding

**Vertical Padding:**
- `14px 0px` - Vertical rhythm in buttons/controls
- `13px 0px` - Variant vertical padding
- `17px 17px 1px` - Mixed padding (card headers)
- `20px 20px 0px` - Large section padding
- `16px 0px 0px` - Top padding emphasis

**Full Padding:**
- `0px 0px 0px 16px` - Left-only indentation
- `0px 0px 0px 20px` - Left-only indentation (larger)

### Common Gap Values

| Gap | Usage |
|-----|-------|
| 1px | Minimal spacing between tight elements |
| 2px | Tight spacing between list items |
| 4px | Very compact component spacing |
| 5px | Compact icon/text pairs |
| 6px | Small component spacing |
| 8px | Standard horizontal spacing (inline elements) |
| 10px | Larger horizontal spacing |
| 12px | Standard spacing between UI elements |
| 16px | Section spacing |
| 24px | Large section spacing |
| 48px+ | Full-width spacing (edge cases) |

### Layout Patterns

**Row Layouts (horizontal):**
- `mode: row`, `justifyContent: space-between`, `gap: 12px` - Navigation, header bars
- `mode: row`, `alignItems: center`, `gap: 12px` - Icon + text pairs
- `mode: row`, `justifyContent: center`, `alignItems: center` - Centered controls
- `mode: row`, `gap: 8px`, `padding: 0px 16px` - Button groups

**Column Layouts (vertical):**
- `mode: column`, `alignItems: stretch`, `gap: 2px` - Tight vertical lists
- `mode: column`, `alignItems: stretch`, `gap: 8px` - Standard vertical spacing
- `mode: column`, `alignItems: stretch`, `gap: 10px` - Larger vertical spacing
- `mode: column`, `alignItems: center`, `gap: 6px` - Centered vertical layouts

### Mobile Viewport

- **Container Width:** 390px
- **Safe Area Height:** 807px (excluding status/nav bars)
- **Total Height:** 844px
- **Border Radius:** 44px (rounded corners for mobile frame)

---

## Border Radius & Corners

The design uses a tiered border-radius system for visual hierarchy:

| Value | Usage |
|-------|-------|
| **0px** | Sharp corners, full-edge elements |
| **2px** | Minimal rounding, subtle elements |
| **4px** | Tight rounding, small components |
| **6px** | Moderate rounding |
| **10px** | Button corners (standard) |
| **14px** | Card corners, content containers |
| **16px** | Modal/dialog corners, large cards |
| **20px** | Large section corners |
| **24px** | Extra large components |
| **44px** | Full screen frame rounding (mobile bezel) |
| **0px 0px 20px 20px** | Bottom-only rounding (bottom sheets) |
| **0px 0px 44px 44px** | Full mobile screen bottom rounding |

---

## Shadows & Effects

### Box Shadows

| Effect ID | Shadow | Purpose |
|-----------|--------|---------|
| effect_SN8QGP | `0px 40px 100px 0px rgba(0, 0, 0, 0.9), 0px 0px 0px 12px rgba(26, 27, 40, 1), 0px 0px 0px 10px rgba(10, 11, 18, 1)` | Large depth shadow (modal/prominent card) |
| effect_QYWFTP | `0px 0px 24px 0px rgba(88, 75, 235, 0.3)` | Purple glow/halo effect (brand accent) |

### Stroke/Border Weights

| Weight (px) | Usage |
|------------|-------|
| 0.67px | Very subtle (hairline) |
| 1px | Standard border |
| 1.25px | Slightly thicker border |
| 1.33px | Medium border |
| 1.5px | Emphasized border |
| 1.67px | Thicker border |
| 1.81px | Strong border |
| 2px | Bold border |
| 3px | Very bold border |
| 3.5px | Extra bold border |

---

## Components & Screens

### Main Screens

The application contains the following primary screens (mobile DeFi wallet):

1. **HomeScreen** - Portfolio overview with balances and quick actions
2. **SendScreen** - Token/asset sending interface
3. **ReceiveScreen** - Address sharing and QR code display
4. **SwapScreen** - Token exchange/swap interface
5. **ExploreScreen** - Browse/discover section
6. **QRCodeDisplay** - Dedicated QR code component

### Common Components

#### Buttons

- **Standard Buttons:** 10px border-radius, inter-medium (500) 15-16px text
- **Primary (Brand Purple):** fill_0ZT4RN (#584BEB)
- **Success:** fill_4ITABI (#22C55E)
- **States:** Default, Hover (implied by opacity changes), Disabled (gray #87878C)

#### Input Fields

- **Container Styling:** 14px border-radius, border #2A2A3D
- **Placeholder Text:** style_L09YAQ (15px, 400 weight, 50% opacity white)
- **Focus State:** Purple stroke (fill_0ZT4RN) with optional glow effect_QYWFTP

#### Cards

- **Border Radius:** 14-16px
- **Background:** fill_29LNWO (#3A3B4E) or fill_LR4L7W (#1A1A29)
- **Border:** 1px stroke #1E1F2E
- **Padding:** 16-20px horizontal, 13-17px vertical

#### TokenPill

- Layout: `row`, `alignItems: center`, `gap: 12px`
- Padding: `0px 16px`
- Border Radius: 16px
- Used for displaying token symbols/balances

#### Text/Label Components

- Standard label: style_HL9PP1 (11px, uppercase, 7% letter-spacing)
- Section title: style_SMC2CK or style_RPDN5Q (20-22px, 600-700 weight)
- Body content: style_S04VT2 or style_4N5XH4 (16-18px, 400-500 weight)

---

## Visual Patterns

### Navigation & Headers

- **Header Layout:** Row, space-between, 20px horizontal padding
- **Background:** fill_MYCNUI (#0D0E17)
- **Text:** White or light gray (fill_IBC0WI / fill_EZMJIZ)
- **Height:** ~67px (typical mobile header)

### Portfolio/Asset Lists

- **Item Layout:** Column, stretch, 2px gaps (tight list)
- **Item Background:** Alternating between transparent and fill_29LNWO (3A3B4E)
- **Text Hierarchy:** 
  - Primary (asset name): 15px, 500-600 weight
  - Secondary (balance): 13px, 400 weight, gray
  - Tertiary (change/%) 12px, 400 weight, color-coded green/red

### Forms & Input Groups

- **Container:** Column, 10px gap between fields
- **Field Styling:** 14px border-radius, 1px border #2A2A3D
- **Label:** 11px uppercase, style_HL9PP1
- **Error State:** Red stroke #F04348 or #FF0420

### Search/Filter Bars

- **Layout:** Row, center-aligned, 12px padding horizontal, 16px gap
- **Height:** 40-48px
- **Border:** 1px, #1E1F2E
- **Text:** Placeholder in light gray

### Status Badges/Pills

- **Layout:** Row, center-aligned, 8px gap
- **Padding:** 0px 8px (horizontal)
- **Height:** 34px (typical badge height)
- **Border Radius:** 10px
- **Text:** style_D9L48Z (11px, 600 weight, centered)
- **Colors:** Green (#22C55E) for positive, Red (#F04348) for negative

### Dividers & Separators

- **Style:** 1px solid stroke
- **Color:** fill_Y6JMRU or stroke_TE79UB (#1E1F2E)
- **Opacity:** Usually 1, sometimes rgba with 0.35-0.5 opacity

### QR Code Display

- **Container:** 14-16px border-radius
- **Background:** White or light color
- **Padding:** 16-20px
- **Shadow:** Optional depth shadow (effect_SN8QGP)

---

## Design Decisions

### Dark Mode / Theme

This design system is **dark-first**, optimized for low-light environments:

- **Primary Background:** Very dark navy-blue (#0D0E17) with minimal contrast glare
- **Secondary Elements:** Slightly lighter (#1A1A29, #3A3B4E) for depth
- **Text on Dark:** Off-white (#F5F5F6) for primary readability, pure white (#FFFFFF) for emphasis
- **Accessibility:** High contrast ratios maintained between text and backgrounds

### Brand & Accent Colors

- **Primary Brand Color:** Purple (#584BEB) used consistently for primary actions, CTAs, and visual emphasis
- **Secondary Palette:** Semantic colors (green for success, red for error, orange for warning) follow standard conventions
- **Accent Variety:** Multiple purple/blue shades allow for visual hierarchy without color overload

### Glassmorphism Elements

Subtle transparency overlays using `rgba(88, 75, 235, 0.18)` and similar techniques create depth without cluttering the interface. Used sparingly for:
- Hover states
- Focus indicators
- Overlay containers

### Micro-interactions

- **Shadows:** Effect_QYWFTP provides a purple halo effect for interactive elements, drawing attention to actionable items
- **Opacity Variance:** Opacity values (0.4, 0.6, 0.7) used for disabled/inactive states and hover effects
- **Smooth Radius:** Tiered border radius creates visual rhythm and guides focus through the interface

### Typography Hierarchy

- **Heavy Use of Weight:** 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), and 300 (Light) provide clear visual distinction
- **Inter Font:** Clean, modern, highly legible sans-serif specifically chosen for crypto/fintech products
- **Consistent Line Height:** 1.5em standard maintains rhythm across all text sizes
- **Uppercase Labels:** style_HL9PP1 with 7% letter-spacing emphasizes UI controls and labels

### Spacing System

- **4px Base Unit:** Gap increments (4, 8, 12, 16, 24px) follow a strict scale
- **Mobile-First Padding:** 20px horizontal padding on main containers balances content on 390px screen
- **Vertical Rhythm:** 2px gaps in lists, 8px in standard layouts, 24px between sections

### Component Sizing

- **Consistent Button Height:** 34px for pills/badges, 40-48px for full-width buttons
- **Icon Size:** Standardized at 16px × 16px (layout_CEOZNF)
- **Spacing Increments:** 12px gaps between icon and text in standard components

---

## Implementation Notes

### For Developers

1. **Design Tokens:** All colors, typography, and spacing are defined as named tokens (fill_*, style_*, layout_*) and should be mapped to CSS variables or design token systems (e.g., Style Dictionary).

2. **Responsive:** While designed for mobile (390px), many layouts use `stretch`/`fill` sizing that scales to larger screens. Test responsive behavior on tablet sizes.

3. **Text Truncation:** Consider truncation for asset names and long text where space is limited (typical in financial UIs).

4. **Iconography:** All icons are SVG-based (IMAGE-SVG type) at 16px × 16px with specific stroke colors. Maintain these dimensions for consistency.

5. **State Variants:** Button and form states (hover, active, disabled) should follow the opacity and color token patterns established here.

6. **Dark Mode:** This is the default. If light mode is needed, reverse foreground/background fills and adjust opacity/alpha for readability.

---

**End of Design System Document**

