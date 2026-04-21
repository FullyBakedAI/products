# Bake Sheet — DayHero

The full-width hero image and day header at the top of the MainPanel. Sets the visual tone for each day. Displayed above the stop cards, below the day title.

---

## Purpose

Anchor each day visually with a landmark image and date. Gives the trip an editorial quality — it should feel like opening a magazine spread for that day's adventure.

---

## Props

| Prop        | Type      | Required | Description                                      |
|-------------|-----------|----------|--------------------------------------------------|
| `day`       | `Day`     | Yes      | Day object (label, sub, heroPhoto, num)          |
| `tripDates` | `string`  | No       | Full trip date range (shown in overview day only)|

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              [Hero photo — full bleed, 320px tall]          │
│                                                             │
│   DAY 3                    Jun 25                          │
│   Big Road Trip                                             │
└─────────────────────────────────────────────────────────────┘
```

The day label and subtitle sit below the photo (not overlaid) to preserve legibility over any photo colour.

---

## States

| State       | Description                                        |
|-------------|----------------------------------------------------|
| `withPhoto` | Hero photo displayed, full bleed                   |
| `noPhoto`   | Accent gradient band instead of photo              |
| `overview`  | First item (trip overview day) — different layout  |

---

## Accessibility

- Hero `<img>` has `alt={day.sub}` (the day subtitle as descriptive text)
- `<section>` wrapping with `aria-labelledby` pointing to day title heading
- Day number + title rendered as `<h2>` (within the overall page heading hierarchy)

---

## Tokens

| Token                | Usage                                |
|----------------------|--------------------------------------|
| `--bk-brand-primary` | Gradient band when no photo          |
| `--bk-text-primary`  | Day title, date                      |
| `--bk-text-secondary`| Day subtitle                         |
| `--bk-bg-card`       | Section background below photo       |
| `--bk-font-display`  | Day subtitle (display serif face)    |

---

## Acceptance Criteria

- [ ] Hero photo renders full-width (no horizontal padding) — `calc(100% + padding*2)` bleed
- [ ] Photo is `object-fit: cover` at fixed height (320px desktop, 220px mobile)
- [ ] No photo: accent gradient band, same height
- [ ] Day label (eyebrow, e.g. "DAY 3") and title rendered as semantic heading
- [ ] Smooth transition when switching between days (fade, not jump)
- [ ] Image lazy-loaded for non-active days
