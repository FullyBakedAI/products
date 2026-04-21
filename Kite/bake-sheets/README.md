# Kite — Bake Sheets

Component contracts for the Kite rebuild. Each sheet defines the full contract before any implementation code is written.

## Component Index

| # | Component          | Status   | Description                                     |
|---|--------------------|----------|-------------------------------------------------|
| 00| Theme              | ✅ Done  | BakeKit token mapping + Kite theme config       |
| 01| TripShell          | ✅ Done  | Outer 3-column layout container                 |
| 02| DayNav             | ✅ Done  | Left sidebar: logo, day tabs, checklist         |
| 03| StopCard           | ✅ Done  | Stop detail (Ant full + Lorena simple variants) |
| 04| StopTimeline       | ✅ Done  | Right panel scrollable day timeline             |
| 05| DriveSegment       | ✅ Done  | Muted drive-time row between stops              |
| 06| ChoiceSelector     | ✅ Done  | Restaurant/activity option picker (RadioGroup)  |
| 07| DayHero            | ✅ Done  | Full-bleed hero image + day header              |
| 08| ProposalCard       | 🔜 v1.1 | Pre-booking trip option card                    |
| 09| RatingInput        | 🔜 v1   | 5-star rating (React ARIA RadioGroup)           |
| 10| PhotoGallery       | 🔜 v1   | Journal photo strip + upload + lightbox         |

## Design Reference

All visual decisions come from the prototype at `travel.fullybaked.ai`.
Source: `prototype/index.html`.

Key decisions preserved:
- Dark ink sidebar (`#2A182E`) with white Kite logo
- Kite red `#E20000` as primary accent
- Card-based stop layout, day tabs, right panel timeline
- Mobile-first: single panel + bottom tabs on mobile
- DM Serif Display for headings, Inter for body

## Build Order

1. Theme config (extend BakeKit `theme-types.js` + `ThemeProvider.jsx`)
2. TripShell (layout skeleton, no data)
3. DayNav (static, keyboard nav)
4. DayHero
5. StopCard — Lorena variant first (simpler)
6. StopCard — Ant variant
7. DriveSegment
8. ChoiceSelector
9. StopTimeline
10. Wire together with real data (SF trip)

TDD throughout: test file before implementation file, every time.
