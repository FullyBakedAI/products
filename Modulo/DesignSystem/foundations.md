# Modulo Design Foundations

> Foundations are the raw materials. Get these right and everything built on top is consistent.
> Nothing is hardcoded. Everything derives from these values.

---

## Token System

All visual values are CSS custom properties prefixed `--bk-*`.
No hardcoded hex, no hardcoded pixel values outside this file.

```css
/* Usage pattern */
color: var(--bk-text-primary);       /* not #F5F5F6 */
background: var(--bk-bg-card);       /* not #1A1A29 */
transition: all var(--bk-motion-fast); /* not 150ms */
```

### Colour Tokens

| Token | Default | Role |
|-------|---------|------|
| `--bk-brand-primary` | `#584BEB` | CTAs, active states, highlights, interactive indicators |
| `--bk-bg-base` | `#0D0E17` | App background — the floor |
| `--bk-bg-card` | `#1A1A29` | Surface elevation 1 — cards, input areas |
| `--bk-bg-card-alt` | `#1F1F33` | Surface elevation 2 — nested cards |
| `--bk-bg-nav` | `#13141F` | Bottom nav, header, drawers |
| `--bk-bg-elevated` | `#13141F` | Modals, sheets, overlays |
| `--bk-bg-outer` | `#0C0C0F` | Outside the phone frame |
| `--bk-border-subtle` | `#1E1F2E` | All borders — one value, one opacity |
| `--bk-text-primary` | `#F5F5F6` | Headlines, values, primary labels |
| `--bk-text-secondary` | `#B3B2B8` | Body text, descriptions |
| `--bk-text-muted` | `#87878C` | Captions, metadata, disabled states |
| `--bk-success` | `#22C55E` | Gains, confirmations, positive change |
| `--bk-error` | `#F04348` | Losses, errors, destructive actions |

### Motion Tokens

| Token | Default | When to use |
|-------|---------|------------|
| `--bk-motion-instant` | `80ms` | State changes, toggles — user expects immediate response |
| `--bk-motion-fast` | `150ms` | Micro-transitions — hover, active, selection |
| `--bk-motion-standard` | `220ms` | Screen transitions, appearing elements |
| `--bk-motion-slow` | `350ms` | Complex layouts, staggered reveals |
| `--bk-motion-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Tactile interactions — swaps, selections |
| `--bk-motion-ease-out` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elements entering — decelerating |
| `--bk-motion-ease-in-out` | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Elements in transit |

Motion should inform, not decorate. If removing an animation makes the interaction clearer, remove it.

---

## Typography

**Family:** Inter (Google Fonts — 300, 400, 500, 600, 700)

The type scale is functional, not decorative. Every size serves a specific role.

| Role | Weight | Size | Use |
|------|--------|------|-----|
| Display | 700 | 28px | Hero numbers, portfolio totals |
| Heading | 600 | 18px | Screen titles, section headers |
| Subheading | 600 | 15px | Card titles, action names |
| Body | 400 | 14–15px | Descriptions, copy |
| Label | 500 | 13px | Form labels, token names, tab titles |
| Caption | 400 | 11–12px | Metadata, timestamps, rate labels |
| Monospace | — | 11–13px | Token keys, addresses, technical values |

Rules:
- Sentence case everywhere. No ALL CAPS except data labels in tiny contexts.
- Numbers use tabular lining figures (Inter default).
- Financial values: always show 2 decimal places minimum. Never round to the nearest dollar.

---

## Spacing

No spacing scale is formally tokenised yet. Until it is, use these multiples of 4px:

| Use | Value |
|-----|-------|
| Component internal padding | 12–16px |
| Between related elements | 8px |
| Between sections | 24–32px |
| Screen horizontal padding | 20px |
| Card border-radius | 14–16px |
| Small element border-radius | 8px |
| Pill / badge border-radius | 20px |

---

## Dark-First Principles

Modulo is dark-first because crypto users operate in low-light environments, dark themes reduce eye strain during long sessions, and dark surfaces make financial data easier to scan.

- Never assume white backgrounds. Design on `--bk-bg-base` first.
- Light mode is not in scope.
- Contrast minimum: 4.5:1 for text, 3:1 for UI components (WCAG 2.1 AA).
