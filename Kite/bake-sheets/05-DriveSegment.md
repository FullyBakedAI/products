# Bake Sheet — DriveSegment

A muted, non-interactive row that represents a drive between two stops. Appears in both the StopTimeline (right panel) and the MainPanel stop list as a visual separator.

---

## Purpose

Signal a transition between stops without interrupting the narrative of the day. Communicates drive duration and direction at a glance — enough to plan, not enough to distract.

---

## Props

| Prop   | Type     | Required | Description                                       |
|--------|----------|----------|---------------------------------------------------|
| `time` | `string` | No       | Departure time (e.g. `"08:15"`)                   |
| `text` | `string` | Yes      | Drive description (e.g. `"1h 45m south via 101"`) |

---

## Anatomy

```
───  08:15  ──  [road icon]  Drive south via 101 — 1h 45m to Monterey  ───
```

Two thin horizontal rules flank the content. The road icon (`ph-fill ph-road-horizon`) is followed by the drive text. No left-border treatment; no icon circle; muted styling throughout.

---

## States

| State     | Description                    |
|-----------|--------------------------------|
| `default` | The only state — not clickable |

---

## Accessibility

- `role="listitem"` (within StopTimeline's `role="list"`)
- No interactive role — explicitly not a button
- `aria-hidden="true"` on the decorative horizontal rules
- Text content readable by screen readers as-is

---

## Tokens

| Token               | Usage                          |
|---------------------|--------------------------------|
| `--bk-text-muted`   | Drive text, time               |
| `--bk-border-subtle`| Horizontal rule lines          |
| `--bk-font`         | Body font                      |

---

## Acceptance Criteria

- [ ] Not clickable — no button role, no hover state
- [ ] Road icon aligned with text via `vertical-align: middle`
- [ ] Time shown only when `time` prop is present
- [ ] Renders correctly inside both StopTimeline and MainPanel contexts
- [ ] Does not break grid layout in StopTimeline (`auto 1fr auto` — no icon circle)
