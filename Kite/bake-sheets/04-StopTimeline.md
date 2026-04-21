# Bake Sheet — StopTimeline

The right panel. A scrollable vertical timeline of all stops for the active day — thumbnail, time, name, location. Clicking a stop scrolls the MainPanel to that stop card.

---

## Purpose

Give the user a fast-scan overview of the day — what's coming, what order, what times — without reading every card. Acts as a secondary navigation surface within a day.

---

## Props

| Prop            | Type                          | Required | Description                                       |
|-----------------|-------------------------------|----------|---------------------------------------------------|
| `stops`         | `Stop[]`                      | Yes      | All stops for the active day (inc. drive segments)|
| `activeStop`    | `string \| null`              | No       | ID of the stop currently in view in MainPanel     |
| `onStopClick`   | `(stopId: string) => void`    | Yes      | Scroll MainPanel to this stop                     |
| `customisations`| `Record<string, StopCustomisation>` | No | Used to show journal photo thumbnails        |

---

## Anatomy

```
┌───────────────────────────────┐
│  Day overview header          │  ← Day label + stop count
├───────────────────────────────┤
│  [icon]  07:00  Corvette      │  ← StopTimelineRow (start)
│          San Francisco, CA    │
│  │                            │  ← connector line
│  [icon]  07:20  Golden Gate   │  ← StopTimelineRow (sight)
│          [thumb] SF, CA       │  ← thumbnail if photo
│  │
│  ──── Drive ────────────────  │  ← DriveSegment (muted row)
│         1h 45m south via 101  │
│  │
│  [icon]  10:00  Breakfast     │  ← StopTimelineRow (food)
│          Pacific Grove, CA    │
│          ✓ Jeninni booked     │  ← selected choice (muted)
│  │
│  ...                          │
└───────────────────────────────┘
```

---

## StopTimelineRow Anatomy

Each non-drive stop renders:
- **Icon column** (`auto`) — Phosphor fill icon in a small circle
- **Info column** (`1fr`) — time (muted), name (primary), loc (muted), choice badge
- **Thumb column** (`auto`) — 48×48 photo thumbnail if `stop.photo` present; hidden when stop is expanded

Grid: `auto 1fr auto` — icon column must always be in the DOM (grid structure).

---

## States

| State         | Description                                             |
|---------------|---------------------------------------------------------|
| `default`     | Normal, unselected row                                  |
| `active`      | Currently visible stop in MainPanel — left accent border|
| `hover`       | Tint + cursor pointer (except drive segments)          |
| `drive`       | Muted segment — no icon circle, lighter text, no click  |
| `expanded`    | Stop card is open — thumbnail hidden, slight indent     |

---

## Accessibility

- Timeline root: `role="list"` with `aria-label="Day stops"`
- Each stop row: `role="listitem"`
- Clickable rows: `role="button"` or wrapped in `<button>` element
- Drive segments: `role="listitem"` without button (not interactive)
- `aria-current="true"` on the active stop row
- Keyboard: `Tab` reaches each clickable row; `Enter/Space` fires `onStopClick`

---

## Tokens

| Token                  | Usage                                    |
|------------------------|------------------------------------------|
| `--bk-bg-base`         | Timeline panel background                |
| `--bk-bg-card`         | Active stop row background tint          |
| `--bk-brand-primary`   | Active stop left border, icon fill       |
| `--bk-primary-subtle`  | Active row background tint               |
| `--bk-text-primary`    | Stop name                                |
| `--bk-text-secondary`  | Time, location                           |
| `--bk-text-muted`      | Drive segment text, choice badge text    |
| `--bk-border-subtle`   | Connector line between stops             |
| `--bk-border-row`      | Row separator                            |

---

## Acceptance Criteria

- [ ] All stops for the day render in correct order (drive segments included)
- [ ] Grid columns `auto 1fr auto` — icon div always in DOM
- [ ] Active stop has left accent border in `--bk-brand-primary`
- [ ] Clicking a stop fires `onStopClick` and does not change `activeStop` directly (parent owns state)
- [ ] Drive segments are not clickable; no hover state; no icon circle
- [ ] Photo thumbnail hidden when stop is in expanded state
- [ ] Journal photos: first uploaded photo replaces default `stop.photo` as thumbnail
- [ ] `aria-current="true"` updates as active stop changes
- [ ] Timeline scrolls independently of MainPanel
- [ ] Hidden on mobile (bottom tab bar used instead)
