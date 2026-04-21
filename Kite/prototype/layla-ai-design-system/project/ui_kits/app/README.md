# Layla.ai App — UI Kit

Recreation of the Layla planning app: a chat-forward trip builder where Layla and the user co-author an itinerary. The chat lives on the left, the live itinerary on the right.

## Components
- `AppShell.jsx` — two-column layout: chat rail + itinerary panel
- `ChatRail.jsx` — message stream with Layla avatar
- `ChatMessage.jsx` — single bubble (Layla / user variants)
- `Composer.jsx` — docked input with suggestion chips
- `ItineraryPanel.jsx` — right-side day-by-day
- `DayCard.jsx` — a single day with activities
- `FlightCard.jsx` / `HotelCard.jsx` / `ActivityCard.jsx` — inline planning cards

## Running
Open `index.html`. Try typing a destination into the composer — Layla replies and appends a day card to the itinerary.

## Caveats
- No production screens or code were available. Layout is inferred from product description ("conversational chat", "customize in real time", live itinerary).
- All itinerary content is placeholder data.
- Flight/hotel/activity card shapes are cosmetic guesses.
