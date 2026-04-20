# Kite — Project Context Log

> **Note (2026-04-20 evening)**: This is the running log through Discovery + Design phases earlier on 2026-04-20. The **Build decisions below are superseded** by the evening rebuild (Option B — clean rebuild, narrow scope, no Firebase, Modulo BakeKit canonical). See `memory/decisions/2026-04-20-rebuild-decision.md`, `2026-04-20-drop-firebase.md`, `2026-04-20-canonical-bakekit.md`, and `STATUS.md`. Design intent (personas, principles, component specs) remains valid; specific stack/backend answers here (Firebase, settings-page-as-home-for-config, v1.0 monetisation mechanics) are outdated.

**Project**: Kite Travel App
**Owner**: Ant (Sawfinger)
**Status**: Rebuild (post 2026-04-20 evening). This log captures Discovery+Design phases.
**Next**: Scaffold rebuild once three pending decisions answered (see STATUS.md)

---

## What This Is

Running documentation of the Discovery and Design phases for Kite. Every decision, every principle, every conversation. Not sanitized. The good and the bad.

---

## Discovery Phase (2026-04-20, 07:00–09:00 GMT+1)

### Interview with Ant & Lorena (via Ant)

**Setting**: Family of 4 (Ant, Lorena, 2 kids 15/16) planning premium adventure travel. Peru booked via Pura Aventura for July. Japan next.

**Key Insight #1: The Agency Gap**
- Pura Aventura delivers a beautiful web quote + PDF itinerary (day-by-day Peru trip with activities, accommodations, flights)
- Ant manually recreates this in his personal calendar system
- Lorena finds the calendar too complex; falls back to printing the PDF
- Result: two parallel documents that don't sync, information scattered

**Key Insight #2: Inspiration is Ephemeral**
- Lorena sources ideas from Instagram (restaurants, activities, lodges)
- Saves them to her head, not captured anywhere
- Many ideas forgotten by trip planning time
- "If our friends had used Kite, I could just look at their Peru trip and see what they loved"

**Key Insight #3: The Print-Out User**
- Lorena isn't anti-digital, she's anti-complexity
- A printed sheet with (Day | Activity | When | Where) is her ideal on-trip reference
- Ant wants everything (time, place, booking ref, QR code, description, notes)
- Two different user profiles, same product

**Key Insight #4: On-Trip Friction Points**
- No internet in the Amazon, Sacred Valley, rural Japan
- Booking confirmations and QR codes buried in email, unavailable when needed
- Paper gets lost or damaged
- Currently only Ant has the system — wife and kids aren't in it

**Key Insight #5: The Post-Trip Gap**
- Family photos scatter across camera rolls + shared album
- Lorena wants a physical printable album (keepsake)
- Currently no organised record exists
- "If our friends had documented Peru, I could see what worked and didn't work"

### Community & Monetisation Insights

**Why share?**
- Ant (correctly) challenged: "Why would people share their trips?"
- Lorena (correctly) challenged: "Won't influencers just game this?"
- Answer: Share as a byproduct of making your own keepsake (the album). The album is for you, not for an audience. Community happens as a side effect.
- Authenticity > reach. A family's honest 5-star rating on a lodge is more trustworthy than an influencer's paid post.

**Monetisation Path**:
1. Affiliates (Booking.com, Airbnb, OpenTable, Viator) — 3–8% commission on bookings made through the app
2. Subscription (£5–8/month or £40/year) — unlimited trips, Inspirations board, printable albums, Firebase sync
3. B2B white-label — travel agencies (Pura Aventura, etc) deliver trips as Kite-branded experiences
4. Community data (v2+) — trip operators pay for market insights (which stops rate 5 stars with families)

**Integrations to Explore**:
- Instagram share extension (Lorena saves a post → lands in Inspirations board)
- Email parsing (forward booking confirmations → auto-extracted into stop details)
- Google Places / TripAdvisor (search a place, pull details in)

---

## Design Principles Defined

**10 Design Principles (Kite)**:
1. Less is more — remove everything unnecessary
2. Mobile first — design for the phone experience
3. Experience is everything — elegant workflows
4. Clean, simple, beautiful
5. Visual — images shine, no clutter
6. Typography is key — use it wisely
7. Craft is everything — no AI slop, no emoticons, designer-quality
8. Iconography — clean minimal keyline or filled, modern
9. Animation — make it move purposefully
10. Clean — important content forward, no noise

**11 Product Principles (Fully Baked)**:
1. Always Make It Compelling
2. Balance Form and Function
3. Always Create Hooks
4. Brand Is the Experience
5. Simplicity Is Key
6. Remove the Unnecessary
7. Signal Over Noise
8. Sell the Exhaust
9. Evidence-Based Design
10. Methodology Over Tools
11. AI as Collaborator, Not Replacement

---

## Design Phase (2026-04-20, 09:00–09:20 GMT+1)

### What Was Designed

Four key components specified with ASCII mockups + design principle annotations:

**1. Stop Card**
- Ant view: full detail (time, place, booking, description, QR code, photos, rating, notes)
- Lorena view: minimal (day, activity, when, where — printable)
- Interaction: visited toggle, tap to rate, swipe to collapse, QR code expandable
- Principle: (1) Less is more — only essential visible, deep context on demand
- Principle: (5) Visual — photo dominates
- Principle: (6) Typography — section labels in tiny caps, clear hierarchy

**2. Trip Creation Flow**
- Step 1: User describes the trip (destination, dates, freeform text about their vision)
- Step 2: Claude drafts an itinerary (generates day-by-day structure)
- Step 3: User reviews and edits (refine, add booking details, QR codes)
- Principle: (3) Experience everything — elegant, clear flow
- Principle: (2) Mobile first — one question at a time
- Principle: (9) Animation — loading spinner is purposeful

**3. Inspirations Board**
- Visual grid of saved ideas (2-column, cards with images)
- Tap a card → full image + details + "add to trip" action
- Source attribution (e.g., "Saved from Instagram @peru_food_guide")
- Drag-and-drop or tap to add to a specific trip/day
- Principle: (5) Visual — images dominate, minimal text
- Principle: (1) Less is more — no unnecessary UI

**4. Album Output**
- Digital view (day-by-day narrative + photos + rating)
- Printable version (photo-book style, A4 landscape)
- Beautiful layout: photo + story + date on each spread
- Actions: Print, Share (read-only URL), Download as PDF
- Principle: (4) Clean, simple, beautiful — photo book aesthetic
- Principle: (7) Craft — professionally designed, printable at home

### Design Decisions & Rationale

**Why two Stop Card views?**
- Ant is detail-hungry; Lorena is context-light. Both are correct for their role.
- On the trip, Ant may need booking details; Lorena just needs to know where and when.
- One view doesn't serve both. Two views designed to a specific user solves the real problem.
- Cost of supporting two views < benefit of each person getting their ideal experience.

**Why AI trip drafting instead of templates?**
- Templates feel prescriptive. Users want their trip, not a pre-built path.
- Claude can generate a day-by-day structure from a description, fast enough to feel interactive.
- User still reviews and edits — AI is a starting point, not an answer.
- Reduces friction for trip creation, especially for complex itineraries.

**Why Inspirations board before building the trip?**
- Lorena's Instagram saves are currently scattered. Capturing them early is an "always-on" feature.
- Inspirations → Trip → Album is a natural progression that mirrors real planning.
- Users who bookmark 20 things in Inspirations are more likely to build a trip (engagement hook).
- The board also serves as a taste profile — helps the community matching later (v2).

**Why printable album is core, not an afterthought?**
- Lorena explicitly asked for it. It's not a "nice to have," it's the output she wants.
- The album is the keepsake that drives sharing (not forced sharing, but natural "show my friends what we did" sharing).
- Printable album is also a distribution lever — people print it, gift it, leave it on the coffee table.
- Designing for print-first keeps the digital view clean and purposeful.

### What Wasn't in the Specs (Intentionally)

**Not specified**: 
- Detailed Firebase/auth flow (that's backend concern)
- Weather integration (mentioned in Discovery, deferred to v1.1)
- Real-time family sync UI (deferred to v1.1, basic version shipping with app)
- Video highlight reel (deferred, mentioned in Discovery but not core to San Fran test)
- Advanced search / community discovery (v2 feature)

**Why defer?**:
- San Francisco is the test case. Nail Plan + Journal first.
- Weather is nice-to-have. Offline-first stop cards are must-have.
- Family sync is nice-to-have for the first trip. One person (Ant) managing it works.
- Video highlight reel is complex. Photos + narrative are the core memorial first.

---

## Test Case: San Francisco

**What we're building for first**:
- Ant creates the California road trip from scratch inside Kite (describe → Claude drafts → edit)
- Lorena uses her phone view on the trip instead of a print-out
- Family documents the trip with journal entries, photos, ratings
- At the end, they print the album

**Success criteria**:
- Lorena actually uses the app (doesn't fall back to paper)
- Ant can capture everything he needs (booking ref, QR code, notes, etc)
- Journal entries + photos feel natural to add during the trip (not friction)
- The printed album looks beautiful

**Risk**: If Lorena doesn't pick up the phone, the product failed. The specs assume she will.

---

## Decisions Made & Deferred

### Made
1. ✅ Product name: **Kite** (kite.travel not available, but name locked)
2. ✅ Primary user: families doing exclusive adventures (Pura Aventura, private guides, boutique stays)
3. ✅ Two roles per trip: Organiser (Ant) + Visual Planner (Lorena)
4. ✅ Architecture: three phases (Capture → Live → Remember)
5. ✅ MVP scope: Plan + Journal for San Francisco
6. ✅ Design approach: mobile-first, craft-first, no AI slop
7. ✅ Monetisation: affiliates → subscription → B2B white-label

### Deferred to v1.1+
- Weather per stop (nice-to-have, not core)
- Real-time family sync (basic version only, advanced sync deferred)
- Video highlight reel (photos + narrative core first)
- Advanced search & community matching (v2)
- Multi-trip home screen optimization (works, but not polished)

---

## Next Steps

**Build Phase (2026-04-20, starting after design review)**:
1. Implement Stop Card (Ant view + Lorena view)
2. Implement Trip Creation Flow
3. Implement Inspirations Board
4. Implement Album Output
5. Wire up Claude API for trip drafting
6. Wire up Firebase for basic auth + trip storage
7. Test with San Francisco trip
8. QA gate (Fully Baked process)
9. Ship to travel.fullybaked.ai

**Timeline**: 2–3 weeks to launch San Francisco test.

---

## Conversations & Decisions Log

### 2026-04-20, 07:31 GMT+1: Discovery Interview

**Topic**: Family travel planning patterns  
**Outcome**: Identified the agency PDF → manual calendar → printed sheet workflow. Discovered Lorena's ephemeral inspiration problem.

**Key Quote (Lorena, via Ant)**:
> "My wife has just said one of the reasons this might not work is because people do this for a living. Influencers etc"

**Response**: Influencers optimise for reach & sponsorship. Honest family documentation is more trustworthy. The product sells the album keepsake, not the audience.

---

### 2026-04-20, 07:54 GMT+1: Ideation Critique

**Topic**: Three product directions  
**User feedback**: "I think all of those are good. Solo travellers might be good - digital nomads"

**My response**: Solo adventurers (late 30s, specialist operators) are in scope, but different from core family market. Digital nomads are different product.

**Ant's decision**: Stay with families. "Foodies" added as secondary persona (heavy journal users, high-value community).

---

### 2026-04-20, 08:00 GMT+1: Why Share? (Hard Question)

**Lorena (via Ant)**: "Why would you share stuff, what's in it for you?"

**Initial answer**: Reciprocity, status, utility.  
**Refined answer**: The album is the keepsake. Sharing is a byproduct. Families make albums for themselves, not for strangers.

**Decision**: Design album-first, sharing as side effect. Honesty > reach.

---

### 2026-04-20, 08:13 GMT+1: Firebase vs. NotebookLM

**Question**: Is Firebase the right backend?

**Answer**: Yes. Firebase = login + real-time sync + storage, all in one simple package. NotebookLM is a thinking tool, not a backend. Long-term: Supabase for the community data layer (v2).

---

### 2026-04-20, 08:16 GMT+1: AI Visibility

**Ant**: "AI built within it is important, but shouldn't be the main advertising point."

**Principle established**: AI is infrastructure, not identity. Claude drafts itineraries, parses PDFs, generates albums — all invisible to the user. The product is about *your adventure*, not *AI-powered adventure*.

---

### 2026-04-20, 09:18 GMT+1: Design Review

**Ant**: "And hurry your ass up."

**Response**: Delivered design specs in 5 minutes instead of 20 (chose markdown + tunnel over custom Figma builds).

**Learning**: Ant values speed over perfect presentation. ASCII mockups > Figma ideation in this context.

---

## Principles Applied

All design specs grounded in:
- **Product Principles** (11): Compelling, balance, hooks, brand, simplicity, signal
- **Design Principles** (10): Mobile first, less is more, craft, clean, visual

Every component has explicit principle annotations showing which principles are active in that design.

---

## Known Gaps & Risks

1. **Lorena adoption risk**: If she doesn't use the app on trip, product fails. Specs assume she will; real test is San Francisco.
2. **QA on photos**: Storing large photos in localStorage will hit size limits. Firebase Storage needed before v1.0 launch.
3. **Offline sync**: Real-time sync doesn't work offline; local changes must merge when connection returns. Not yet designed.
4. **Print quality**: Album print path untested. First print-out will reveal gaps.
5. **Community trust signals**: How do we prevent influencer gaming? Not solved yet (v2 problem).

---

## Version History

- **v1.0 (MVP)**: San Francisco test. Plan + Journal. One trip at a time. Offline-first. Simple Firebase sync.
- **v1.1**: Weather, advanced sync, photo memory timeline.
- **v2**: Community, album sharing, B2B white-label, trip matching by taste profile.

---

**Last updated**: 2026-04-20 09:20 GMT+1  
**Next review**: After design approval and before build starts
