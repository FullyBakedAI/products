# Kite — Design Specs

> **Note (2026-04-20 evening)**: Component intent here is preserved and still guides the rebuild. The "Build Phase" notes lower in the doc (implementation stack details) are superseded — canonical rebuild plan is in `STATUS.md`. Rebuild v1 scope = Stop Card + Trip Creation Flow + Multi-trip home + Journal; Inspirations Board + Album deferred to v2.

**Date**: 2026-04-20  
**Status**: Design intent frozen. Implementation happens in rebuild (see STATUS.md)
**Next**: Scaffold rebuild after pending decisions answered

Designed against:
- 11 Product Principles (compelling, balance, hooks, brand, simplicity, signal, etc.)
- 10 Design Principles (less is more, mobile first, craft, clean, visual, typography, animation, etc.)

---

## 1. Stop Card — Ant View (Detail)

**Mobile (full-width)**

```
┌─────────────────────────────────────┐
│ Day 3 · Amazon                      │ ← Header, subtle
├─────────────────────────────────────┤
│                                     │
│     [Hero Photo 16:9 ratio]         │ ← Image shines (Design Principle 5)
│     Macaw Clay Lick                 │ ← Stop name over image, bottom-left
│     08:00 · 2.5 hours               │    Time/duration
│                                     │
├─────────────────────────────────────┤
│ Location                            │ ← Section labels, tiny caps, subtle
│ 80km northeast of Puerto Maldonado  │
│                                     │
│ [Map pin icon] Open in Maps         │ ← Minimal icon (Design Principle 8)
├─────────────────────────────────────┤
│ Description                         │
│ Watch herds of macaws flock to the  │
│ clay lick. Local jungle guide will  │
│ point out species and behaviours.   │
│ Binoculars recommended.             │
├─────────────────────────────────────┤
│ Booking                             │ ← Section labels, tiny caps
│ Reference: TURO-2025-AMAZON-0847    │
│ [QR code image - small, clean]      │
│ Contact: +51 982 123 456            │
├─────────────────────────────────────┤
│ [✓ Visited toggle — big, clear]     │ ← 48px tap target (Design Principle 2)
│ Rating: [★★★★★] 5/5                │ ← Large stars, tappable
├─────────────────────────────────────┤
│ Notes                               │
│ "Incredible experience. Kids loved  │
│  spotting the blue macaws. Bring    │
│  sunscreen."                        │
├─────────────────────────────────────┤
│ [+ Add photos] [+ Add video]        │ ← Full-width buttons, clean
│ [3 photos] [View gallery]           │ ← Shows count, expandable
└─────────────────────────────────────┘
```

**States & Interactions**:
- Visited toggle: smooth animation, turns green when checked (signal not noise)
- Photos expand inline, lazy-load
- Rating stars are tappable, update on tap
- Swipe up to collapse, see next stop
- QR code tappable → enlarges in lightbox
- Booking contact is a link (tel:)

**Design Principles Applied**:
- (1) Less is more — only essential info visible, deep context available
- (2) Mobile first — full-width, thumb-friendly
- (4) Clean, simple, beautiful — typography hierarchy, plenty of space
- (5) Visual — photo dominates, shines
- (6) Typography — section labels in tiny caps, body in readable size
- (7) Craft — no emoticons, clean design
- (9) Animation — subtle transitions on toggle/expand

---

## 2. Stop Card — Lorena View (Simple)

**Mobile (what she prints)**

```
┌─────────────────────────────────────┐
│ Day 3                               │
│ Monday, August 2                    │
├─────────────────────────────────────┤
│ Macaw Clay Lick                     │
│ 08:00 · 2.5 hours                  │
│                                     │
│ 80km NE of Puerto Maldonado         │
│ Contact: +51 982 123 456            │
│                                     │
│ Booking Ref: TURO-2025-AMAZON-0847  │
│ [QR code]                           │
│                                     │
│ Directions: [Open in Maps]          │
└─────────────────────────────────────┘
```

**What's NOT here**:
- No description (trust the agency itinerary or briefing)
- No journal entry
- No photos
- No rating

**Design Principles Applied**:
- (1) Less is more — absolute minimum, just the actionable facts
- (2) Mobile first — card fits in a pocket
- (7) Craft — clean typography, nothing extraneous
- (10) Clean — only what matters forward

---

## 3. Trip Creation Flow

**Step 1: Describe Your Trip**

```
┌─────────────────────────────────────┐
│ ← Create New Trip                   │ ← Back button, top-left
├─────────────────────────────────────┤
│                                     │
│ Destination & Dates                 │
│                                     │
│ [Destination: "Peru"]               │ ← Input, clean border
│ [Start date: "July 30, 2026"]       │
│ [End date: "August 9, 2026"]        │
│                                     │
│ Tell us about your trip             │
│ [Large textarea]                    │ ← 4-5 lines, enough space
│ "Family of 4 (kids 15/16).          │
│  Interested in Amazon, Machu Picchu,│
│  Sacred Valley. Mix of adventure    │
│  and culture. Private guide."       │
│                                     │
│ [Generate Itinerary]                │ ← Primary button
│                                     │
└─────────────────────────────────────┘
```

**Step 2: Claude Drafts (Loading State)**

```
┌─────────────────────────────────────┐
│ ← Creating your trip...             │ ← Back still available
├─────────────────────────────────────┤
│                                     │
│ [Spinner — minimal, subtle]         │ ← Animation (Design Principle 9)
│ "Drafting your itinerary..."        │
│                                     │
│ This usually takes 30 seconds.      │ ← Manage expectations
│                                     │
└─────────────────────────────────────┘
```

**Step 3: Review & Edit**

```
┌─────────────────────────────────────┐
│ ← Peru Family Adventure             │ ← Trip name, editable
│                                     │ 
│ Jul 30 – Aug 9, 2026 · 11 days      │
│                                     │
├─────────────────────────────────────┤
│ Day 1: Arrival in Lima              │
│ • Check in to bohemian hotel        │
│ • Explore UNESCO centre             │
│                                     │
│ Day 2: Lima City                    │
│ • Local markets                     │
│ • Seafood dinner                    │
│                                     │
│ [More days...]                      │ ← Scrollable list
│                                     │
├─────────────────────────────────────┤
│ [Edit] [Next]                       │ ← Actions
│                                     │
└─────────────────────────────────────┘
```

**Design Principles Applied**:
- (3) Experience everything — elegant, clear flow
- (2) Mobile first — one question at a time, vertical flow
- (6) Typography — clear hierarchy, readable inputs
- (9) Animation — loading spinner is purposeful
- (10) Clean — only what's needed on screen

---

## 4. Inspirations Board

**Mobile View**

```
┌─────────────────────────────────────┐
│ Inspirations                        │ ← Title, top
│ Peru                                │ ← Destination pill, tappable
├─────────────────────────────────────┤
│                                     │
│ [Image] [Image]  [Image]            │ ← 2-column grid, cards
│ Restaurant    Activity    Hike      │
│                                     │
│ [Image] [Image]  [Image]            │
│ Stay       Restaurant   Activity    │
│                                     │
│ [Image] [Image]  [Image]            │
│ Restaurant Activity    Restaurant   │
│                                     │
│ [+ New Inspiration]                 │ ← Add button, full-width
│                                     │
└─────────────────────────────────────┘
```

**Tap on a card:**

```
┌─────────────────────────────────────┐
│ ← Back                              │
├─────────────────────────────────────┤
│                                     │
│     [Full image, fill screen]       │ ← Image shines (Design Principle 5)
│                                     │
├─────────────────────────────────────┤
│ Restaurant Name                     │ ← Title
│ Lima, Peru                          │
│                                     │
│ Cevichería Moderna                  │
│ Fresh seafood, local favourite      │ ← Description
│                                     │
│ Saved from: Instagram post by       │ ← Source attribution
│ @peru_food_guide                    │
│                                     │
│ [Add to a trip] [Remove] [Share]    │ ← Actions
│                                     │
└─────────────────────────────────────┘
```

**Add to Trip Flow:**

```
┌─────────────────────────────────────┐
│ Add to trip                         │
├─────────────────────────────────────┤
│ Which trip?                         │
│ ○ Peru (Jul 30 – Aug 9)            │ ← Radio buttons
│ ○ Japan (TBD)                      │
│ ○ Create new trip                  │
│                                     │
│ Day in Peru?                        │
│ Day 1: Arrival in Lima              │ ← Dropdown, specific
│                                     │
│ Stop type?                          │
│ ○ Restaurant                        │ ← Auto-filled based on card
│                                     │
│ [Cancel] [Add]                      │
└─────────────────────────────────────┘
```

**Design Principles Applied**:
- (5) Visual — images dominate, minimal text overlay
- (2) Mobile first — 2-column grid, thumb-friendly taps
- (1) Less is more — no unnecessary UI
- (9) Animation — smooth expand/collapse
- (6) Typography — titles and captions only

---

## 5. Album Output (Printable)

**Digital View (before print)**

```
┌─────────────────────────────────────┐
│ Peru Family Adventure               │ ← Trip title
│ July 30 – August 9, 2026            │
│                                     │
│ [Trip hero photo — full width]      │
│                                     │
│ Ant, Lorena, [Kids]                 │ ← Family names
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ Day 1: Lima                         │ ← Day section
│ Monday, July 30                     │
│                                     │
│ Arrival at Lima airport. Settled    │
│ into our bohemian hotel in Miraflores. │ ← Narrative
│                                     │
│ [3 photos in grid]                  │
│ [★★★★★ 5/5]                        │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ Day 2: Lima                         │ ← Day 2
│ Tuesday, July 31                    │
│                                     │
│ Explored the UNESCO heritage centre.│ ← Narrative
│ Markets were chaotic and wonderful. │
│                                     │
│ [5 photos in grid]                  │
│ [★★★★☆ 4/5]                        │
│                                     │
│ ─────────────────────────────────── │
│ [More days...]                      │
│                                     │
│ [Print] [Share] [Download as PDF]   │ ← Actions
│                                     │
└─────────────────────────────────────┘
```

**Printed Output (A4 landscape, photo-book style)**

```
┌───────────────────────────────────────────────┐
│                                               │
│        Peru Family Adventure                  │ ← Centered, elegant
│        July 30 – August 9, 2026               │
│                                               │
│             [Trip photo — fills page]         │
│                                               │
└───────────────────────────────────────────────┘

┌───────────────────────────────────────────────┐
│                                               │
│        Day 1: Lima · Monday, July 30          │
│                                               │
│   Arrival at Lima airport. Settled into      │
│   our bohemian hotel in Miraflores. Kids     │
│   were amazed by the ocean views.            │
│                                               │
│                                               │
│        [Photo 1]  [Photo 2]  [Photo 3]       │
│                                               │
│        Rating: ★★★★★ (5/5)                  │
│                                               │
└───────────────────────────────────────────────┘

[Repeat for each day, alternating layouts]
```

**Design Principles Applied**:
- (4) Clean, simple, beautiful — photo book aesthetic
- (5) Visual — large photos, minimal text
- (6) Typography — elegant serif for titles, readable body
- (7) Craft — professionally designed, printable at home
- (10) Clean — narrative + photos, nothing else

---

## Motion & Animation Principles

**Throughout the app**:

1. **Toggle visited** — smooth fill animation (300ms), green confirmation
2. **Expand photos** — slides up from bottom, image scales in
3. **Rate stop** — stars fill individually on tap, satisfying micro-animation
4. **Load inspirations** — cards fade in staggered
5. **Navigate days** — gentle swipe or scroll, no jarring transitions
6. **Submit journal** — "Saving..." indicator, then subtle "Saved" confirmation
7. **Print album** — shows progress quietly, no modal spam

**Rule**: Animation is purposeful. If it doesn't clarify intent or provide feedback, it's gone.

---

## Color Palette (Inferred from FullyBaked)

- **Primary**: Coral (accent, active states, CTAs)
- **Background**: Off-white/bone (no pure white, warm)
- **Text**: Dark ink (primary), muted ink (secondary)
- **Dividers**: Subtle, very light gray
- **Success**: Green (visited toggle, saved state)
- **Error**: Red (warnings only)

---

## Typography

- **Display**: Serif, italic (trip names, day headers)
- **Heading**: Sans-serif, 18-20px (section titles)
- **Body**: Sans-serif, 16px (descriptions, notes)
- **Caption**: Sans-serif, 12px (metadata, tiny caps for section labels)
- **Mono**: 14px (booking refs, QR code labels)

**Rule**: Typography carries meaning. Don't overuse weight or size.

---

## Next Steps

**Build Phase**: Implement these four components in React/Next.js using CSS Modules (existing pattern). Each component gets its own file:
- `StopCard.tsx` + `StopCard.module.css`
- `TripCreationFlow.tsx` + `TripCreationFlow.module.css`
- `InspirationBoard.tsx` + `InspirationBoard.module.css`
- `AlbumOutput.tsx` + `AlbumOutput.module.css`

**QA Phase**: Run through Fully Baked QA gate with Persona Agents reviewing against these specs.

**Ship Phase**: Deploy to travel.fullybaked.ai and test with San Francisco trip.
