# Bake Sheet — DayNav

The left sidebar. Shows the trip identity (logo + trip name), a list of day tabs, and a checklist summary. This is the primary navigation surface on desktop.

---

## Purpose

Let the user orient within the trip (which day, what's covered) and jump to any day instantly. Secondary: show booking checklist status at a glance. Always visible on desktop; hidden on mobile (replaced by bottom tab bar).

---

## Props

| Prop             | Type                      | Required | Description                                       |
|------------------|---------------------------|----------|---------------------------------------------------|
| `trip`           | `Trip`                    | Yes      | Trip metadata (title, dates, days array)          |
| `activeDay`      | `string`                  | Yes      | ID of the currently selected day                  |
| `onDayChange`    | `(dayId: string) => void` | Yes      | Called when a day tab is selected                 |
| `checklistItems` | `ChecklistItem[]`         | No       | Booking checklist items for status badge          |
| `checklistDone`  | `string[]`                | No       | IDs of completed checklist items                  |
| `operator`       | `Operator \| null`        | No       | Operator branding (logo override)                 |

---

## Anatomy

```
┌─────────────────────────┐
│  [Logo]                 │  ← operator logo or Kite default (white variant)
│  Trip title             │  ← trip.title
│  Jun 22–28, 2026        │  ← trip.dates
├─────────────────────────┤
│  ● Jun 22  London→SF    │  ← DayTab (active = coral highlight)
│  ○ Jun 23–24  Figma     │
│  ○ Jun 25  Big Road Trip│
│  ○ Jun 26  Mist Trail   │
│  ○ Jun 27  4-Mile+Tenaya│
│  ○ Jun 28  → Home       │
├─────────────────────────┤
│  Checklist  3/6 done    │  ← collapsed by default; expand on click
│  □ Hire car             │
│  ✓ AutoCamp             │
│  ...                    │
└─────────────────────────┘
```

---

## Day Tab Anatomy

Each tab renders:
- Day number badge (circle, filled when active)
- Date label (e.g. "Jun 25")
- Day subtitle (e.g. "Big Road Trip")
- Stop count (muted, e.g. "8 stops")

---

## States

| State         | Description                                          |
|---------------|------------------------------------------------------|
| `default`     | Unselected day tab                                   |
| `active`      | Currently selected day — accent left border + bg tint|
| `hover`       | Light tint on hover                                  |
| `disabled`    | Future day tabs in proposal mode (not yet available) |

---

## Accessibility

- `role="navigation"` with `aria-label="Day navigation"`
- Day tabs use `role="tab"` within `role="tablist"`
- `aria-selected="true"` on active tab
- `aria-controls` points to the main panel region ID
- Keyboard: `ArrowUp/Down` moves between tabs; `Enter/Space` selects
- Checklist section: `role="list"`, items `role="listitem"`

---

## Tokens

| Token                    | Usage                              |
|--------------------------|------------------------------------|
| `--bk-bg-sidebar`        | Sidebar background (`#2A182E`)     |
| `--bk-bg-sidebar-hover`  | Day tab hover tint                 |
| `--bk-bg-sidebar-active` | Active day tab background          |
| `--bk-brand-primary`     | Active tab left border + badge fill|
| `--bk-text-on-dark`      | Day tab text (white on dark)       |
| `--bk-text-secondary`    | Muted text (stop count)            |
| `--bk-border-subtle`     | Divider between logo area and tabs |
| `--bk-primary-subtle`    | Active tab background tint         |

---

## Data Shape

```ts
interface Day {
  id: string;
  label: string;       // "Jun 25"
  sub: string;         // "Big Road Trip"
  num: number;         // 3
  stops: Stop[];
  heroPhoto?: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  sub?: string;
  notes?: string;
  link?: string;
}
```

---

## Acceptance Criteria

- [ ] Logo renders from `operator.logoInverse` if present, else Kite default white logo
- [ ] Active day tab has left border in `--bk-brand-primary` and subtle background tint
- [ ] `ArrowDown/Up` keyboard navigation cycles through tabs without page scroll
- [ ] `Enter` on a tab fires `onDayChange`
- [ ] Checklist section shows done count badge (e.g. "3/6") and expands on click
- [ ] Sidebar does not scroll independently of day tabs on desktop
- [ ] Hidden (via CSS, not unmounted) on mobile — DayNav is always in the tree
