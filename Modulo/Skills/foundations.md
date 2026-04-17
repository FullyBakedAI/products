# Modulo Design Foundations

> **Load when:** making typography or spacing decisions, applying dark-first principles, setting up a new screen's visual baseline, or reviewing whether the design feel is consistent.
>
> Foundations are the raw materials. Get these right and everything built on top is consistent.
> For token values, see `tokens.md`. This file covers typography, spacing, and principles.

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

See `tokens.md` for the complete token table with every value.

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
- Light theme exists (`.theme-light` class) — always use tokens so both themes work.
- Contrast minimum: 4.5:1 for text, 3:1 for UI components (WCAG 2.1 AA).
