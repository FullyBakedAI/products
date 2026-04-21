# Kite Theme — BakeKit Config

Maps to `--bk-*` CSS custom properties via `BrandProvider`.
Kite extends the base BakeKit theme with travel-specific tokens.

---

## Base Token Mapping

```js
export const kiteTheme = {
  brandName: 'Kite',
  logoSrc: '/logo.svg',               // black wordmark + red kite mark
  logoInverse: '/logo-white.svg',     // white wordmark for dark sidebar
  fontFamily: "'Inter', -apple-system, sans-serif",
  fontDisplay: "'DM Serif Display', Georgia, serif",

  // Brand
  primaryColor:    '#E20000',   // Kite red
  primaryStrong:   '#B80000',   // hover/pressed state
  primarySubtle:   '#FFE8E8',   // tinted surface
  gradientStart:   '#E20000',
  gradientEnd:     '#B80000',

  // Surfaces
  bgBase:          '#FAF7F2',   // bone — warm off-white page
  bgCard:          '#FFFFFF',   // paper — card surface
  bgCardAlt:       '#F5F0EA',   // slightly warmer card alt
  bgSidebar:       '#2A182E',   // ink — dark sidebar
  bgSidebarHover:  '#3B2440',
  bgSidebarActive: '#1A0E1D',
  bgNav:           '#2A182E',   // same as sidebar (mobile bottom nav)
  bgElevated:      '#FFFFFF',   // modals, dropdowns
  bgOuter:         '#F0EBE3',   // behind shell frame
  bgSunken:        '#E8DFD3',   // sand — recessed surfaces

  // Text
  textPrimary:     '#2A182E',   // ink
  textSecondary:   '#6B5B6E',   // muted-ink
  textMuted:       '#A39AA5',   // faint-ink
  textPlaceholder: 'rgba(42, 24, 46, 0.4)',
  textOnDark:      '#FFFFFF',   // text on sidebar/dark surfaces

  // Borders
  borderSubtle:    '#EDE7DD',   // line
  borderCard:      'rgba(237, 231, 221, 0.8)',
  borderPill:      'rgba(237, 231, 221, 0.6)',
  borderActive:    '#E20000',
  borderSearch:    '#E8DFD3',
  borderRow:       '#EDE7DD',

  // Semantic
  success:         '#5FA574',
  successSoft:     '#E3F1E7',
  error:           '#C9553D',
  errorSoft:       '#F8E1DA',
  warning:         '#E8B961',
  warningSoft:     '#FAEFD5',

  // Special
  overlay:         'rgba(42, 24, 46, 0.6)',
  gold:            '#E8B961',   // star ratings / premium
};
```

---

## CSS Variable Reference

| Token                  | Value           | Usage                           |
|------------------------|-----------------|----------------------------------|
| `--bk-brand-primary`   | `#E20000`       | Kite red — CTAs, active states  |
| `--bk-bg-base`         | `#FAF7F2`       | Page background                 |
| `--bk-bg-card`         | `#FFFFFF`       | Stop cards, panels              |
| `--bk-bg-sidebar`      | `#2A182E`       | Left nav sidebar                |
| `--bk-text-primary`    | `#2A182E`       | Body copy, headings             |
| `--bk-text-secondary`  | `#6B5B6E`       | Meta, secondary labels          |
| `--bk-text-on-dark`    | `#FFFFFF`       | Sidebar text, on-red text       |
| `--bk-border-subtle`   | `#EDE7DD`       | Dividers, card outlines         |

---

## Theme Extension Required

The BakeKit `theme-types.js` must be extended with:
- `bgSidebar`, `bgSidebarHover`, `bgSidebarActive`
- `primaryStrong`, `primarySubtle`
- `fontDisplay`
- `textOnDark`
- `gold`, `successSoft`, `errorSoft`, `warningSoft`
- `logoInverse`

And `ThemeProvider.jsx` must inject the additional `--bk-*` vars.

---

## White-Label Override

Each operator provides a partial theme override:

```js
const puraAventuraTheme = {
  ...kiteTheme,
  brandName: 'Pura Aventura',
  logoSrc: '/operators/pura-aventura/logo.svg',
  logoInverse: '/operators/pura-aventura/logo-white.svg',
  primaryColor: '#2E7D32',
  primaryStrong: '#1B5E20',
  primarySubtle: '#E8F5E9',
  gradientStart: '#2E7D32',
  gradientEnd: '#1B5E20',
  borderActive: '#2E7D32',
};
```

Operator theme is loaded from `operators.theme_config` (Supabase) at request time via Next.js middleware and injected as a `<style>` block in the root layout.
