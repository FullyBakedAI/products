# Kite — Discovery Phase

> **Note (2026-04-20 evening)**: This document captures discovery-phase intent. Stack/monetisation references to **Firebase** are superseded by the rebuild decision — Firebase BYO is dropped, backend-we-own replaces it. See `memory/decisions/2026-04-20-drop-firebase.md` and `STATUS.md`. Product intent below is preserved and still guides the rebuild.

> **Note (2026-04-21)**: Re-scoped — this is **not** a complete Discovery by the Framework checklist. Personas and vision exist; deep market research, competitor teardowns, real interviews, GTM metrics, "why now" thesis, and technical architecture exploration are still owed. See **Discovery Gaps** at the end of this doc. Rebuild may proceed with localStorage SF test, but the Framework Discovery Gate is not yet passed — flag before any external/commercial commitments.

**Date**: 2026-04-20 (initial) · 2026-04-21 (gap review)
**Status**: **Partial** — vision/users/pain captured; research depth outstanding
**Next**: Close gaps (see bottom), then Definition → Bake Sheets

---

## The Problem

Boutique family travel (Peru, Japan, Africa) is planned through agencies like Pura Aventura who deliver a beautiful PDF + web quote. But that document doesn't translate into something the family actually uses on the trip. It's not accessible offline, booking confirmations are buried in email, and the printed itinerary gets lost.

Meanwhile, inspiration for trips lives in Lorena's head (Instagram saved posts) and gets forgotten. Photos scatter across camera rolls. Post-trip, there's no good record.

---

## Users

### Ant (The Organiser)
- Plans the trips, handles logistics
- Wants **everything**: time, place, booking ref, QR code, full activity description
- Tech-comfortable but frustrated nothing holds it all together
- On the trip: pulls out the phone to check details, coordinate timing
- Post-trip: wants full documentation

### Lorena (The Visual Planner)
- Drives inspiration via Instagram
- Not digitally savvy — finds complex systems frustrating
- Currently uses a printed sheet with day + activity + when + where
- Needs clarity and simplicity above all
- Post-trip: wants a physical album she can hold

### Kids (15, 16)
- Share a photo album with parents
- Would engage if it was visual and easy
- Not active itinerary consumers

---

## The Market

**Primary**: Families choosing exclusive adventures (boutique lodges, private guides, active itineraries). Not budget, not mass market. They spend properly and care deeply.

**Secondary archetypes**:
- **Multi-Gen Coordinator** — three generations, one person holding it together
- **Friend Group** — couples travelling together, decisions are democratic
- **One-Sided Planner** — one partner does everything, the other needs zero-friction access
- **Solo Adventurer** — independent traveller, same taste, same planning problem
- **Foodies** — travel built around restaurants and food experiences

**Taste taxonomy for community (v2)**: Adventure, Food, Culture, Multi-Gen, Solo.

---

## Pain Points

1. **Agency itinerary → trip reality gap** — PDF doesn't translate into usable trip structure
2. **No offline access** — signal is unreliable in remote destinations
3. **Booking confirmations buried** — QR codes and confirmation details scattered across email
4. **Inspiration is ephemeral** — Lorena saves things to her head, forgets them
5. **Only one person runs it** — wife and kids aren't in the system
6. **Photos scatter** — no organised record of what happened
7. **No record to look back on** — or share with friends planning the same place

---

## The Real Job on the Trip

**Right stop, right moment — everything there offline.**
- Time, place, full description
- Booking reference + QR code image
- Directions, contact details
- Context from the itinerary

No hunting through email. No "where was that restaurant?" No printed sheet that gets lost.

---

## Product Vision

**Three integrated phases, one product:**

### Phase 1: Capture
- Import agency itinerary (URL or PDF → AI extracts), or build from scratch
- Inspirations board: visual canvas where Lorena saves Instagram posts, restaurants, activities (tagged to destinations)
- Ant adds all the detail: booking refs, QR codes, times, notes

### Phase 2: Live
- Offline-first stop cards with everything
- Two views:
  - **Ant's view**: full detail, edit capability, all context
  - **Lorena's view**: day, activity, when, where — printable, dead simple
- GPS awareness, weather per day, next-stop nudges
- Journal entry per stop: photos, narrative text, rating

### Phase 3: Remember + Share
- Beautiful printable album (Lorena's keepsake) generated from journal
- Trip profile browsable by taste-matched families (v2)
- Community driven by honest documentation, not performance

---

## Monetisation

**Tier 1 — Affiliates (immediate)**
When building a stop, suggest booking it through partners (Booking.com, Airbnb, OpenTable, Viator). Earn 3–8% commission.

**Tier 2 — Subscription**
Free: 1 trip, basic. Paid (£5–8/month or £40/year): unlimited trips, Inspirations board, community access, printable album, Firebase sync.

**Tier 3 — B2B White Label**
Travel agencies (Pura Aventura, etc) deliver trips as Kite. Per-client-trip revenue.

**Tier 4 — Community Data (longer term)**
Trip operators pay for market insights: which stops consistently rate 5 stars with the right families.

---

## Integrations (v2+)

**Instagram share extension** — Lorena sees something on Instagram, taps Share → Kite → lands in Inspirations.

**Email parsing** — Forward booking confirmations to kite@yourapp.com → auto-extracted and populated into stops (Booking.com, Airbnb, OpenTable, airline confirmations, etc).

**Platform lookups** — when creating a stop, search for a place and pull details in (Google Places, TripAdvisor data).

---

## Why Not Influencers, Why Share?

**On influencers**: They optimise for reach and sponsorship. Your honest trip doc is more trustworthy precisely because you have no incentive to perform. Authenticity is the value.

**On why share**: Can't rely on altruism. Incentives:
- **Reciprocity**: access only if you've published
- **Status**: reputation from trips logged and recommendations made
- **Utility**: you share because a friend is planning Peru and wants your real take
- **The album**: you make the album for yourself; sharing is the byproduct

The last one is the most elegant. The product sells the keepsake, not the sharing.

---

## Technology

**MVP Stack**: Next.js web app, PWA (offline-capable, installable on phones), Firebase (auth + Realtime DB).

**Future**: Expo (React Native) for native iOS/Android while maintaining web PWA.

**AI Role**: Infrastructure, not identity. Invisible: parsing PDFs, extracting booking confirmations, generating albums, matching taste profiles. User never thinks "AI did that."

---

## Test Case: San Francisco

The app currently has a hardcoded California road trip. For the real test: **build San Francisco trip from scratch inside the product**.

1. Describe the trip → Claude drafts the itinerary
2. Ant edits, adds booking details, QR codes
3. Lorena uses it on the trip instead of a print-out
4. Family documents the trip, generates the album

If this works, the product is real.

---

## Next Steps

**Definition Phase**: Bake Sheets for:
1. Stop Card (Ant view + Lorena view)
2. Trip Creation Flow (describe → AI draft → edit)
3. Inspirations Board (visual, simple)
4. Album Output (printable, beautiful)

These go to the user for sign-off before any code changes.

---

## Discovery Gaps (owed — 2026-04-21)

Flagged by Ant 2026-04-21: Discovery as written is thin against the Framework checklist. The following must be filled before this phase is truly complete (Framework/Discovery/README.md sections 7–11 are newly added).

### 1. Deep Market Research
- Global boutique/adventurous family travel market sizing (TAM/SAM/SOM with sources)
- Growth trends, post-COVID shifts, luxury travel segments
- Segment spend per trip, frequency, decision-making dynamics
- Tour-operator market (Pura Aventura tier): size, consolidation, white-label appetite

### 2. Competitor Teardowns (each)
Direct: **TripIt, Wanderlog, Polarsteps, Roadtrippers, Mindtrip, Roam Around, Layla, Kayak Trips, Google Trips (historical), Hopper, Out of Office**. Adjacent: **Notion/Day One trip templates, Pura Aventura's own web quote, Airbnb Guidebooks**.

For each: positioning, feature set, pricing, user sentiment (App Store + Reddit + review mining), moat, fragility, AI posture.

### 3. Real User Interviews
Target: 5–8 per persona. Minimum first wave:
- 3× Organiser families (Pura Aventura / Jacada / Abercrombie tier) — **wave 1 starts with Ant himself as test subject for Organiser archetype** (agreed 2026-04-21 in #kite); Lorena follows for Visual Planner
- 3× Visual Planner partners (Lorena archetype)
- 2× Multi-Gen Coordinators
- 2× Tour operators (for white-label appetite)
Record, synthesise quotes, cite in Spec.

### 4. GTM Strategy & Metrics
- Phase 1 white-label: partner targets, outreach motion, expected CAC/close cycle, pricing model, per-operator revenue modelling
- Phase 2 B2C: community seeding strategy, acquisition channels (referral, SEO, Instagram), CAC/LTV ranges with assumptions, retention model
- Sequence: which operator partner first, which geography first, why

### 5. "Why Now" Thesis
- LLM affordability → itinerary parsing at <£0.01 per import (quantify)
- Remote-work families staying longer, more trips
- Instagram/Pinterest visual-planning behaviour entrenched
- PWA tech now viable offline-first without native
- What would have killed this in 2022? What might commoditise it by 2028?

### 6. Technical Architecture Exploration
- Offline-first PWA vs Expo React Native — decision criteria
- Backend-we-own: Supabase vs Cloudflare Workers+D1/R2 (ADR deferred — needs decision before v1.0)
- AI layer: which models for which tasks (itinerary parse, album gen, suggestion), cost per action, cache strategy
- Media storage scaling (photos, QR codes) — cost model for 10/100/1000 active trips
- Sync model: CRDT vs last-write-wins vs per-trip owner
- Security/privacy: family data, booking refs, QR codes — threat model
- Third-party dependencies + build-vs-buy line (auth, email parsing, Google Places, Instagram share extension)

### 7. Pain-Point Evidence
Current pains are Ant+Lorena observed. Needs evidencing from interviews — which pains are universal in the segment, which are Ludlow-specific, which we've invented.

Until these are closed, Kite Discovery is **Partial** and the Discovery-to-Spec Gate is not formally passed.
