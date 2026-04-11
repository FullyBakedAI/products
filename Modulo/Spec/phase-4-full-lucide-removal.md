# Phase 4 — Full Lucide Removal from Product Screens

**Working directory:** `/Users/Frank/products/Modulo/React`

## Goal

Remove every `lucide-react` import from all product screen files. Replace each icon with an inline SVG component defined at the top of the file.

## Files to migrate

These files import from `lucide-react` and must be fully migrated:

1. `src/HomeScreen.jsx`
2. `src/ActionsScreen.jsx`
3. `src/ExploreScreen.jsx`
4. `src/AssetScreen.jsx`
5. `src/AssetScreen.jsx`
6. `src/SendScreen.jsx`
7. `src/SendAmountScreen.jsx`
8. `src/SettingsScreen.jsx`
9. `src/ManageScreen.jsx`
10. `src/AutopilotScreen.jsx`
11. `src/AchievementsScreen.jsx`
12. `src/ReceiveScreen.jsx`
13. `src/SmartNudges.jsx`

## Files to SKIP (do not touch)

- `src/v1/` — archived v1 screens, not in production
- `src/IconOverrideContext.jsx` — intentionally imports all Lucide icons as a dynamic icon picker for the design system studio (dev tool, not product)
- `src/ds/` — design system studio tabs, dev tools only

## How to replace each icon

For each Lucide icon used in a file, define an inline SVG component at the top of that file (after imports). Use the standard 20×20 viewBox unless the usage clearly needs a different size.

Common icon SVG paths to use:

```jsx
// X / Close
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ChevronLeft
const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ChevronRight
const IconChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ChevronDown
const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Search
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15.5 15.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Settings / Sliders
const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 4V7M10 13V16M4 10H7M13 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// TrendingUp
const IconTrendingUp = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// AlertCircle
const IconAlertCircle = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 7V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="13.5" r="0.75" fill="currentColor"/>
  </svg>
);

// AlertTriangle
const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L17.5 16H2.5L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="14.5" r="0.75" fill="currentColor"/>
  </svg>
);

// Check
const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10.5L8 14.5L16 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Zap / Lightning
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M11 3L4 11H10L9 17L16 9H10L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Star
const IconStar = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L11.8 7.8H17L12.8 10.7L14.5 15.5L10 12.5L5.5 15.5L7.2 10.7L3 7.8H8.2L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// Bell
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3C7.24 3 5 5.24 5 8V13H15V8C15 5.24 12.76 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8.5 13V14C8.5 14.83 9.17 15.5 10 15.5C10.83 15.5 11.5 14.83 11.5 14V13" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Pause
const IconPause = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="5.5" y="4" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="11.5" y="4" width="3" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Download / ArrowDownToLine
const IconDownload = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 4V13M10 13L7 10M10 13L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Upload / ArrowUpFromLine
const IconUpload = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 13V4M10 4L7 7M10 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Send / Arrow
const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M17 3L3 8.5L8.5 11L11 16.5L17 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8.5 11L17 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ArrowRight
const IconArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Lightbulb
const IconLightbulb = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3C7.24 3 5 5.24 5 8C5 9.77 5.93 11.32 7.33 12.2C7.75 12.47 8 12.93 8 13.43V14H12V13.43C12 12.93 12.25 12.47 12.67 12.2C14.07 11.32 15 9.77 15 8C15 5.24 12.76 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 16H12M8.5 14H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ScanLine (QR scanner)
const IconScanLine = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 4H7M13 4H16V7M16 13V16H13M7 16H4V13M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Delete (backspace)
const IconDelete = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7 4H17V16H7L3 10L7 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 8L14 12M14 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Globe
const IconGlobe = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 3C10 3 7.5 6 7.5 10C7.5 14 10 17 10 17" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 3C10 3 12.5 6 12.5 10C12.5 14 10 17 10 17" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Clock
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 7V10.5L12.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Award / Trophy
const IconAward = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="8" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 13.5L6 17H14L13 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Sparkles
const IconSparkles = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3V5M10 15V17M3 10H5M15 10H17M5.5 5.5L7 7M13 13L14.5 14.5M5.5 14.5L7 13M13 7L14.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

// Calendar
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="5" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 9H17M7 3V7M13 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
```

## Rules

1. Define the inline SVG component at the top of the file where it's used — don't create a shared icons file
2. Name them `IconX`, `IconSearch`, etc. — consistent prefix
3. All SVGs: `aria-hidden="true"`, `stroke="currentColor"`, no hardcoded colours
4. Match the `size` prop from the original Lucide usage — if Lucide used `size={16}`, use `width="16" height="16"`
5. After replacing, remove the `lucide-react` import line entirely
6. DO NOT touch `src/v1/`, `src/IconOverrideContext.jsx`, `src/ds/`

## After all files migrated

Run:
```bash
grep -r "lucide-react" src/ --include="*.jsx" | grep -v "v1/" | grep -v "IconOverrideContext" | grep -v "ds/"
```

Should return nothing. Then run `npm run build` — must pass clean.

## Definition of done

- [ ] All 13 product screen files have zero `lucide-react` imports
- [ ] All replaced icons are inline SVGs with `aria-hidden="true"` and `stroke="currentColor"`
- [ ] `grep` check returns nothing (excluding v1/, IconOverrideContext, ds/)
- [ ] `npm run build` passes
