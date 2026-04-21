# Bake Sheet — StopCard

The central content unit. Displays a single stop's full detail — photo, time, description, choices, journal, and booking info. Has two variants: **Ant** (full detail, organiser view) and **Lorena** (simplified, traveller view).

---

## Purpose

Give the trip organiser (Ant) complete control and visibility of every stop's logistics, and give the casual traveller (Lorena) a clean, uncluttered view that doesn't overwhelm. Same data, two lenses.

---

## Props

| Prop            | Type                        | Required | Description                                         |
|-----------------|-----------------------------|----------|-----------------------------------------------------|
| `stop`          | `Stop`                      | Yes      | The stop data (canonical, from DB)                  |
| `custom`        | `StopCustomisation`         | No       | User overrides (selected choice, rating, notes)     |
| `variant`       | `'ant' \| 'lorena'`         | Yes      | Which view to render                                |
| `journalPhotos` | `JournalPhoto[]`            | No       | User-uploaded photos for this stop                  |
| `isEditing`     | `boolean`                   | No       | Whether the edit overlay is open                    |
| `onEdit`        | `() => void`                | No       | Open the edit overlay (Ant variant only)            |
| `onPhotoAdd`    | `(files: File[]) => void`   | No       | Handle photo upload                                 |
| `onPhotoRemove` | `(photoId: string) => void` | No       | Remove a journal photo                              |
| `onChoiceSelect`| `(choice: string) => void`  | No       | Select a choice option (restaurant/activity)        |
| `onRating`      | `(rating: number) => void`  | No       | Set stop rating (1–5)                               |
| `onNotesChange` | `(notes: string) => void`   | No       | Update stop notes                                   |

---

## Ant Variant

Full organiser view. Shows everything.

```
┌─────────────────────────────────┐
│  [Hero photo or placeholder]    │  ← full-width, 220px tall
│  [photo badge] or [time badge]  │  ← overlaid bottom-right
│  [edit button ✎]               │  ← overlaid top-right
├─────────────────────────────────┤
│  07:30  •  Sightseeing          │  ← time + type (eyebrow)
│  Battery Spencer                │  ← stop name (h3)
│  Marin Headlands, CA            │  ← location (muted)
│                                 │
│  Pull into the car park…        │  ← description
│                                 │
│  ┌─ Choices ─────────────────┐  │  ← ChoiceSelector (if stop has choices)
│  │ ○ Flying Fish Grill  $$   │  │
│  │ ● Passionfish        $$$  │  │  ← selected
│  │ ○ Old Fisherman's    $$   │  │
│  └───────────────────────────┘  │
│                                 │
│  [Photo gallery strip]          │  ← JournalPhotos
│  [+ Add photos]                 │
│                                 │
│  Notes…                         │  ← editable textarea
│  ★★★★☆                         │  ← rating (RatingInput)
│                                 │
│  Booking ref: BA2847            │  ← booking info (Ant only)
│  [QR code]                      │  ← if qrCode present
│                                 │
│  [🧭 Directions]                │  ← link to Google Maps
│  [📋 Paste confirmation]        │  ← paste booking email
└─────────────────────────────────┘
```

---

## Lorena Variant

Simplified traveller view. No journal, no editing, no booking refs.

```
┌─────────────────────────────────┐
│  [Hero photo]                   │
├─────────────────────────────────┤
│  Thursday                       │  ← day label
│  Point Lobos State Reserve      │  ← stop name (h3)
│  11:20                          │  ← time (large, prominent)
│  CA-1, Carmel, CA               │  ← location
│                                 │
│  Walk the North Shore Trail…    │  ← short description (2–3 lines max)
│                                 │
│  [🧭 Directions]                │
└─────────────────────────────────┘
```

---

## States

| State          | Description                                         |
|----------------|-----------------------------------------------------|
| `default`      | Normal read state                                   |
| `withPhoto`    | Hero photo visible; time/icon badge overlaid        |
| `withJournal`  | Photo gallery strip shown; photo badge on hero      |
| `editing`      | Edit overlay open (Ant variant only)                |
| `uploading`    | Photo upload in progress — gallery shows spinner    |
| `hasRating`    | Star rating rendered                                |
| `hasChoice`    | ChoiceSelector rendered with options                |
| `selected`     | A choice has been made — shows selected badge       |

---

## Accessibility

- `role="article"` on the card root
- `aria-label` = stop name
- Edit button: `aria-label="Edit stop"`, `aria-expanded` when overlay open
- Photo upload: `<label>` wrapping `<input type="file" accept="image/*" multiple>`
- Rating: `role="radiogroup"` with `aria-label="Rating"` (via React ARIA `RadioGroup`)
- Choices: see `ChoiceSelector` Bake Sheet
- Notes: `<textarea aria-label="Notes for this stop">`
- Gallery: each `<img>` has meaningful `alt` text

---

## Tokens

| Token                  | Usage                               |
|------------------------|-------------------------------------|
| `--bk-bg-card`         | Card background                     |
| `--bk-bg-base`         | Page background behind card         |
| `--bk-brand-primary`   | Edit button, selected state accents |
| `--bk-primary-subtle`  | Selected choice tint                |
| `--bk-text-primary`    | Stop name, description              |
| `--bk-text-secondary`  | Time, type label, location          |
| `--bk-text-muted`      | Notes placeholder, muted labels     |
| `--bk-border-card`     | Card outline                        |
| `--bk-border-subtle`   | Internal section dividers           |
| `--bk-gold`            | Star rating colour                  |
| `--bk-shadow-md`       | Card elevation                      |

---

## Data Shape

```ts
interface Stop {
  id: string;
  tripId: string;
  dayIndex: number;
  position: number;
  type: 'sight' | 'food' | 'nature' | 'transit' | 'start' | 'end' | 'swim' | 'drive';
  name: string;
  loc?: string;
  time?: string;         // "07:30"
  desc?: string;
  icon?: string;         // Phosphor icon class e.g. "ph-mountains"
  photo?: string;        // hero image URL
  choices?: Choice[];
  hike?: HikeInfo;
  swimInfo?: string;
  bookingRef?: string;
  qrCode?: string;
  notes?: string;
  lat?: number;
  lng?: number;
}

interface StopCustomisation {
  selectedChoice?: string;
  rating?: number;       // 1–5
  notes?: string;
  journalPhotos?: JournalPhoto[];
  extraChoices?: Choice[];
}

interface Choice {
  name: string;
  price?: string;        // "$" | "$$" | "$$$"
  loc?: string;
  desc?: string;
  link?: string;
}

interface JournalPhoto {
  id: string;
  dataUrl: string;       // base64 (localStorage) or Supabase Storage URL
  uploadedAt: string;
}

interface HikeInfo {
  distance: string;      // "5.4 mi"
  gain: string;          // "1,900 ft"
  time: string;          // "4–5 hrs"
}
```

---

## Acceptance Criteria

### Both variants
- [ ] Hero photo renders full-width with correct aspect ratio (16:9 or cover)
- [ ] No hero photo = coloured type-band using stop type colour
- [ ] Stop name is always visible even without photo
- [ ] Directions link opens Google Maps deep link in new tab
- [ ] `role="article"` with `aria-label` on card root

### Ant variant
- [ ] Edit button visible; opens edit overlay on click
- [ ] Choices render via ChoiceSelector when `stop.choices` is present
- [ ] Selected choice shows selected badge
- [ ] Photo gallery strip renders uploaded photos
- [ ] Add photos triggers file picker (multi, image/*)
- [ ] Uploading state shows spinner instead of camera icon
- [ ] Rating input renders 5 stars; click sets rating
- [ ] Booking ref and QR code render when present
- [ ] Notes textarea auto-expands; changes saved on blur

### Lorena variant
- [ ] No edit button, no journal, no booking refs
- [ ] Time displayed prominently (larger than in Ant variant)
- [ ] Description truncated to 3 lines with expand option if > 3 lines
- [ ] No choices visible (selection is pre-made by operator/Ant)
