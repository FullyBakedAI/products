# Bake Sheet — ChoiceSelector

Renders a set of options for a stop (e.g. restaurant choices, activity alternatives) and lets the organiser select one. The selected choice is surfaced in the StopTimeline and preserved in trip customisations.

---

## Purpose

Allow the organiser to make a decision directly in the itinerary — "which restaurant are we going to?" — and have that decision reflected throughout the trip view. Supports adding custom alternatives not in the original list.

---

## Props

| Prop              | Type                          | Required | Description                                          |
|-------------------|-------------------------------|----------|------------------------------------------------------|
| `choices`         | `Choice[]`                    | Yes      | Default options from the stop data                   |
| `extraChoices`    | `Choice[]`                    | No       | User-added custom options                            |
| `selected`        | `string \| null`              | No       | Name of the currently selected choice                |
| `onSelect`        | `(choiceName: string) => void`| Yes      | Called when a choice is selected                     |
| `onAddChoice`     | `(choice: Choice) => void`    | No       | Called when user adds a custom option                |
| `onRemoveExtra`   | `(choiceName: string) => void`| No       | Remove a user-added option                           |

---

## Anatomy

```
┌─ Where are we eating? ──────────────────┐
│  ○  Flying Fish Grill            $$     │  ← unselected
│     542 Lighthouse Ave                  │
│     Japanese-Pacific Rim seafood.       │
│                                         │
│  ●  Passionfish              $$$  ✓     │  ← selected (accent bg)
│     701 Lighthouse Ave, Pacific Grove   │
│     Sustainable local catch…            │
│                                         │
│  ○  Old Fisherman's Grotto       $$     │
│     Fisherman's Wharf, Monterey         │
│     Classic wharf seafood…              │
│                                         │
│  + Add your own option                  │  ← add custom
└─────────────────────────────────────────┘
```

---

## States

| State        | Description                                          |
|--------------|------------------------------------------------------|
| `unselected` | All options in neutral state                         |
| `selected`   | One option highlighted with accent background + tick |
| `adding`     | Inline form to add a custom choice                   |

---

## Accessibility

- Root: `role="radiogroup"` via React ARIA `RadioGroup`
- `aria-label="Choose an option for [stop name]"`
- Each choice: `role="radio"` via React ARIA `Radio`
- `aria-checked="true"` on selected choice
- Keyboard: `ArrowUp/Down` moves between options; `Space` selects
- Add form: standard form with labelled inputs

---

## Tokens

| Token                  | Usage                               |
|------------------------|-------------------------------------|
| `--bk-bg-card`         | Container background                |
| `--bk-primary-subtle`  | Selected option background tint     |
| `--bk-brand-primary`   | Selected radio indicator, tick icon |
| `--bk-text-primary`    | Choice name                         |
| `--bk-text-secondary`  | Location, price tier                |
| `--bk-text-muted`      | Description text                    |
| `--bk-border-card`     | Container outline                   |
| `--bk-border-subtle`   | Row dividers between options        |

---

## Data Shape

```ts
interface Choice {
  name: string;
  price?: '$' | '$$' | '$$$' | '$$$$';
  loc?: string;
  desc?: string;
  link?: string;
}
```

---

## Acceptance Criteria

- [ ] `RadioGroup` + `Radio` from React ARIA — full keyboard navigation
- [ ] Selected choice shows accent background tint and tick mark
- [ ] Price tier badge renders next to name (`$`, `$$`, `$$$`)
- [ ] Clicking an already-selected option deselects it (toggle behaviour)
- [ ] "Add your own" expands inline form — name, price, location, description
- [ ] User-added choices show remove button (`✕`)
- [ ] `onSelect` fires with choice name; parent persists to customisations
- [ ] Selection visible in StopTimeline row as muted badge below stop name
- [ ] No change to canonical `stop.choices` — extras stored in `StopCustomisation.extraChoices`
