# Modulo — Agent Context

> This file is the assembled context block for AI agents building Modulo UI.
> Paste the relevant section(s) into any AI tool, Cursor session, or Claude conversation.
> Keep this file in sync with foundations.md, constraints.md, and contexts.md.

---

## Full System Prompt

Use this when starting a new Modulo build session.

```
You are building UI for Modulo — a cross-chain DeFi platform.
Tagline: "One vault, every chain."

## Stack
- React + React ARIA (react-aria-components) + Framer Motion
- React Router v7 (HashRouter)
- Lucide React (icon library — `import { IconName } from 'lucide-react'`)
- Vite build system
- CSS custom properties (--bk-* tokens) — never hardcode values

## Design tokens (CSS custom properties)
--bk-brand-primary: #584BEB   (CTAs, active states)
--bk-bg-base: #0D0E17         (app background)
--bk-bg-card: #1A1A29         (card surfaces)
--bk-bg-nav: #13141F          (nav, header)
--bk-bg-elevated: #13141F     (modals, sheets)
--bk-border-subtle: #1E1F2E   (all borders)
--bk-text-primary: #F5F5F6    (headlines, values)
--bk-text-secondary: #B3B2B8  (body text)
--bk-text-muted: #87878C      (captions, metadata)
--bk-success: #22C55E         (gains, confirmations)
--bk-error: #F04348           (losses, errors)
--bk-motion-fast: 150ms        (micro-transitions, hover, selection)
--bk-motion-standard: 220ms   (screen transitions, appearing elements)
--bk-motion-slow: 350ms       (complex layouts, staggered reveals)

## Framer Motion spring presets (JS — not CSS tokens)
Default spring:  { type: 'spring', damping: 18, stiffness: 260, mass: 0.6 }
Tight spring:    { type: 'spring', damping: 22, stiffness: 340, mass: 0.5 }
Use springs for: swap arrow, token selection, sheet entry
Use duration for: fades, cross-fades, subtle position shifts

## Icons (Lucide React)
Use Lucide icons. Always use `strokeWidth={1.5}` and token-based colour:
- `<Send size={20} color="var(--bk-brand-primary)" strokeWidth={1.5} />`
- `<ArrowLeftRight size={16} color="var(--bk-text-muted)" strokeWidth={1.5} />`
Never use emoji or SVG hand-drawn substitutes when a Lucide icon exists.

Key icons: Home, Search, Send, Download, ArrowLeftRight, ArrowUpDown, TrendingUp,
TrendingDown, Wallet, Shield, Check, X, AlertCircle, Settings, ChevronRight, Copy, QrCode

## Hard rules
- Never hardcode hex values. Always use --bk-* tokens.
- All interactive elements use Button from react-aria-components.
- Never use navigate(-1). Use explicit paths: navigate('/'), navigate('/swap').
- One primary CTA per screen, bottom-anchored.
- 44px minimum touch targets.
- WCAG 2.1 AA minimum contrast.
- Never truncate financial values.

## Typography
Inter (Google Fonts). Weights: 400, 500, 600, 700.
Display: 700/28px | Heading: 600/18px | Body: 400/15px | Label: 500/13px | Caption: 400/11px

## Available screens
HomeScreen, SwapScreen, SwapSelectScreen, ExploreScreen, SendScreen, ReceiveScreen

## Shared components
StatusBar (iOS status bar), BottomNav (4-tab: Home/Explore/Activity/Swap)

## Pattern for new screens
1. Import tokens via CSS custom properties
2. Use Button from react-aria-components for all interactive elements
3. Compose StatusBar + content + BottomNav
4. Import screen-specific CSS (e.g. ./swap.css)
5. Use useNavigate() for routing (not Link components)
```

---

## Context-Specific Additions

Append these to the full system prompt when building specific screen types.

### For Reviewing screens (portfolio, history)
```
Context: Reviewing — user is orienting, no immediate action planned.
Stakes: Low. Design for scanning.
- Lead with the most meaningful number
- Strong visual hierarchy, clear separators
- Actions available but not prominent
- Show relative context (vs yesterday, vs peers)
```

### For Deciding screens (swap, send input)
```
Context: Deciding — user is evaluating whether to execute a transaction.
Stakes: Medium–high. Every number visible without scrolling.
- Rate and fees shown upfront
- Dominant action unavailable until inputs complete
- Easy correction without friction
- No noise: no marketing, no upsell
```

### For Confirming screens
```
Context: Confirming — user is executing an irreversible transaction.
Stakes: High. Show only what changes.
- "You pay X, you receive Y" — nothing else
- CTA matches the action exactly
- Fast feedback once submitted
- Error recovery must be immediate
```

### For Discovery screens
```
Context: Discovering — user exploring without a specific transaction in mind.
Stakes: Low. Browsing mode.
- Surface social proof (volume, chains, holders)
- Easy comparison across tokens
- Low-friction entry to transactions
- No urgency or pressure
```

---

## Token Manifest (JSON)

Machine-readable token values for programmatic use.

```json
{
  "--bk-brand-primary": "#584BEB",
  "--bk-bg-base": "#0D0E17",
  "--bk-bg-card": "#1A1A29",
  "--bk-bg-card-alt": "#1F1F33",
  "--bk-bg-nav": "#13141F",
  "--bk-bg-elevated": "#13141F",
  "--bk-bg-outer": "#0C0C0F",
  "--bk-border-subtle": "#1E1F2E",
  "--bk-text-primary": "#F5F5F6",
  "--bk-text-secondary": "#B3B2B8",
  "--bk-text-muted": "#87878C",
  "--bk-success": "#22C55E",
  "--bk-error": "#F04348",
  "--bk-motion-fast": "150ms",
  "--bk-motion-standard": "220ms",
  "--bk-motion-slow": "350ms"
}
```

---

## Component Inventory

```
Screens
  HomeScreen         — portfolio overview, token list, action row
  SwapScreen         — token swap with numpad and token selection
  SwapSelectScreen   — bottom sheet for token selection
  ExploreScreen      — market discovery
  SendScreen         — send with address input
  ReceiveScreen      — QR code + wallet address

Shared
  StatusBar          — iOS-style status bar (time, signal, battery)
  BottomNav          — 4-item tab bar (Home, Explore, Activity, Swap)

Atoms (all use React ARIA + --bk-* tokens)
  Button             — react-aria Button. Variants: primary, secondary, ghost, destructive
  TokenPill          — token selector (icon + symbol + chevron). Navigates to /swap/select/:side
  PercentagePill     — amount preset (25% / 50% / 75% / Max)
  NumpadKey          — single numpad key (0–9, ., del)
  SwapCard           — pay/receive surface with amount and token pill
  PortfolioCard      — portfolio total, chart, time period selector
  TokenRow           — token list item (icon, name, amount, USD value, change%)
  SwapArrow          — animated direction toggle between pay/receive
```

---

## Constraints Summary

```
MUST
  Use --bk-* tokens for all visual values
  Use Button from react-aria-components
  Include WCAG 2.1 AA compliant contrast
  Show structure before content (skeleton states)
  State the chain explicitly in transaction contexts
  Name the action in success messages

MUST NOT
  Hardcode hex values
  Use navigate(-1) for back navigation
  Truncate financial values
  Place more than one primary CTA per screen
  Use jargon without context in user-facing copy
  Show destructive actions without confirmation
  Generate new brand colours, route paths, or legal copy
```
