# Modulo Token Contract

Every visual value MUST come from a `--bk-*` CSS custom property. No hardcoded hex. No magic numbers.

## Surfaces
| Token | Value | Use |
|-------|-------|-----|
| `--bk-bg-base` | `#0D0E17` | Screen background |
| `--bk-bg-card` | `#1A1A29` | Cards, panels |
| `--bk-bg-card-alt` | `#1F1F33` | Hover/secondary cards |
| `--bk-bg-nav` | `#13141F` | Bottom nav, elevated bars |
| `--bk-bg-elevated` | `#13141F` | Modals, tooltips |
| `--bk-bg-outer` | `#0C0C0F` | Behind the phone frame |

## Borders
| Token | Value | Use |
|-------|-------|-----|
| `--bk-border-subtle` | `#1E1F2E` | Section dividers |
| `--bk-border-card` | `rgba(45,44,74,0.2)` | Card outlines |
| `--bk-border-pill` | `rgba(45,44,74,0.4)` | Chip/pill outlines |
| `--bk-border-active` | `#584BEB` | Selected/active borders |
| `--bk-border-row` | `#181929` | List row separators |

## Text
| Token | Value | Use |
|-------|-------|-----|
| `--bk-text-primary` | `#F5F5F6` | Headlines, primary content |
| `--bk-text-secondary` | `#B3B2B8` | Supporting text |
| `--bk-text-muted` | `#87878C` | Metadata, timestamps |
| `--bk-text-placeholder` | `rgba(245,245,246,0.5)` | Input placeholders |

## Brand
| Token | Value | Use |
|-------|-------|-----|
| `--bk-brand-primary` | `#584BEB` | Buttons, links, accents |
| `--bk-brand-dim` | `rgba(88,75,235,0.15)` | Tinted backgrounds |
| `--bk-brand-gradient` | `linear-gradient(135deg, #584BEB, #4A3DE0)` | Gradient fills |

## Semantic
| Token | Use |
|-------|-----|
| `--bk-success` (`#22C55E`) | Positive values, gains |
| `--bk-error` (`#F04348`) | Negative values, errors |

## Motion
| Token | Value | Use |
|-------|-------|-----|
| `--bk-motion-instant` | `80ms` | Toggles, hovers |
| `--bk-motion-fast` | `150ms` | Button presses |
| `--bk-motion-standard` | `220ms` | Panel transitions |
| `--bk-motion-slow` | `350ms` | Screen transitions |

## Rules
- Use `color-mix(in srgb, var(--bk-brand-primary) 18%, transparent)` for tinted backgrounds
- Use `transition: opacity var(--bk-motion-fast)` for hover states
- If a token doesn't exist for your use case, flag it — don't invent colours
- Light theme exists (`.theme-light` class) — always use tokens so both themes work
