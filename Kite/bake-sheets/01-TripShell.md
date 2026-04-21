# Bake Sheet — TripShell

The outer layout container. Renders the three-column shell on desktop and a tab-based single-column layout on mobile. Owns the top-level layout; all other components live inside it.

---

## Purpose

Provide the structural frame for a trip — sidebar nav, main content, and right panel — and manage which panel is visible on mobile. Does not own trip data; receives it as props and distributes to children.

---

## Props

| Prop           | Type                              | Required | Description                                         |
|----------------|-----------------------------------|----------|-----------------------------------------------------|
| `trip`         | `Trip`                            | Yes      | Full trip object (days, stops, metadata)            |
| `activeDay`    | `string`                          | Yes      | ID of the currently selected day                    |
| `mode`         | `'proposal' \| 'live' \| 'plan'`  | Yes      | Trip mode — affects available actions               |
| `operator`     | `Operator \| null`                | No       | Operator config (theme, logo). Null = Kite default  |
| `onDayChange`  | `(dayId: string) => void`         | Yes      | Called when user selects a different day            |
| `children`     | `ReactNode`                       | Yes      | DayNav, MainPanel, RightPanel slots                 |

---

## Layout

### Desktop (≥ 1024px)
```
┌──────────────┬────────────────────────────┬───────────────┐
│   DayNav     │      MainPanel             │  RightPanel   │
│   280px      │      1fr                   │   460px       │
│   fixed      │      scrollable            │   scrollable  │
└──────────────┴────────────────────────────┴───────────────┘
```

### Tablet (768–1023px)
```
┌──────────────┬─────────────────────────────────────────────┐
│   DayNav     │      MainPanel (full width, no right panel) │
│   240px      │                                             │
└──────────────┴─────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────────────────────────────────────────────┐
│                    Active Panel                             │
│              (Itinerary | Map | Timeline)                  │
├─────────────────────────────────────────────────────────────┤
│              Bottom Tab Bar                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## States

| State       | Description                                          |
|-------------|------------------------------------------------------|
| `default`   | Desktop three-column view                            |
| `mobile`    | Single panel + bottom tab bar                        |
| `loading`   | Skeleton shimmer on MainPanel and RightPanel         |
| `error`     | Full-shell error state (trip failed to load)         |

---

## Accessibility

- `role="main"` on the main content area
- `role="complementary"` on right panel
- `role="navigation"` on DayNav sidebar (`aria-label="Day navigation"`)
- Mobile tab bar uses `role="tablist"` + `role="tab"` + `aria-selected`
- Focus trapped within modal/lightbox overlays
- `aria-live="polite"` on main panel when day changes

---

## Tokens

| Token                | Usage                          |
|----------------------|--------------------------------|
| `--bk-bg-base`       | Page/shell background          |
| `--bk-bg-sidebar`    | Sidebar background             |
| `--bk-bg-nav`        | Mobile bottom tab bar          |
| `--bk-border-subtle` | Column dividers                |
| `--bk-brand-primary` | Mobile active tab indicator    |
| `--bk-text-on-dark`  | Sidebar and tab bar text       |

---

## Breakpoints

```ts
const breakpoints = {
  mobile:  '< 768px',
  tablet:  '768px – 1023px',
  desktop: '≥ 1024px',
};
```

Mobile is the primary design target. Desktop is an enhancement.

---

## Acceptance Criteria

- [ ] Three-column layout renders correctly at ≥1024px
- [ ] Two-column layout (no right panel) renders at 768–1023px
- [ ] Mobile shows single panel with bottom tab switcher
- [ ] Day navigation change updates `aria-live` region and scrolls MainPanel to top
- [ ] Keyboard: Tab moves through nav items; Enter/Space selects day
- [ ] No horizontal scroll at any breakpoint
- [ ] Shell does not re-mount when active day changes (only panel content updates)
- [ ] `operator` theme applied via BrandProvider when provided
