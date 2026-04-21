# Kite — Technical Architecture Discovery

**Date**: 2026-04-21
**Status**: Complete (first full pass)
**Authored by**: Frank (sub-agent, Sonnet 4.6)
**Feeds into**: Definition phase — Bake Sheets + ADR decisions before v1.0 build

---

## 1. TL;DR — Recommendations at a Glance

These are the calls. Rationale follows in each section.

| Question | Recommendation |
|---|---|
| Client platform | **Start PWA (Next.js) for SF test, migrate to Expo React Native before Phase 1 white-label launch** |
| Backend | **Supabase** — $25/month base, covers the product through ~1,000 active trips with no architectural change |
| AI: itinerary generation | **Claude Haiku 4.5** — ~$0.002 per trip draft. Fast, cheap, good enough for the task |
| AI: email/PDF parsing | **Claude Haiku 4.5 with prompt caching** — ~$0.001 per booking email parsed |
| AI: suggestions / matching | **Gemini 2.5 Flash-Lite** ($0.10/M input) — bulk inference at minimal cost |
| Sync model | **Last-write-wins with per-trip owner** — CRDT is overkill for a single-owner trip model |
| Media storage | **Cloudflare R2** for photo storage (zero egress), Supabase Storage for access-controlled documents |
| Auth | **Supabase Auth** — already bundled, $0.00325/MAU, magic link is right for Lorena |
| Maps / Places | **Mapbox** — 50,000 free mobile MAUs/month, geocoding at $0.75/1,000 vs Google's $5/1,000 |
| Email parsing (build/buy) | **LLM-first (Claude Haiku)** — dedicated APIs (TripIt, AwardWallet) are B2B/enterprise-priced; LLM at <$0.002/email beats them on cost and flexibility |
| Payments | **Stripe** — 2.9% + $0.30 per transaction, standard, no alternative worth the switch cost |
| Observability | **PostHog** (analytics + error tracking in one tool, 1M events/month free) |
| Biggest risk | **iOS Share Extension requires Expo (native)** — PWA cannot do it. This is a Phase 2 feature but the architecture decision must be made before Phase 1 ships |

---

## 2. Client: PWA (Next.js) vs Expo React Native

### What each approach actually is

**PWA (Next.js)**: A website that can be "installed" on a phone's home screen and cached for offline use. It runs inside the browser (Safari on iOS). Users add it from Safari's share menu. No App Store listing. Good enough for most things; blocked from a small set of native iOS APIs.

**Expo React Native**: A genuine mobile app that happens to share code with a web version. Ships to the App Store and Google Play. Full access to every iOS/Android API. One codebase for both platforms, but still requires App Store submission, review, and distribution overhead.

### Feature-by-feature for Kite

| Feature | PWA | Expo RN | Winner |
|---|---|---|---|
| Offline stop cards | Yes (Service Worker + IndexedDB) | Yes (native SQLite) | Expo (more reliable) |
| Camera / photo capture | Yes (MediaDevices API on iOS 15+) | Yes (expo-camera) | Expo (no Safari quirks) |
| iOS Share Sheet (Instagram → Inspirations) | **No** | Yes (expo-share-extension) | **Expo only** |
| App Store presence (Phase 1 white-label ops need this) | No | Yes | **Expo only** |
| Installability without App Store | Yes (Add to Home Screen) | No | PWA |
| PDF generation (album) | Yes (react-pdf, html2canvas) | Yes (react-native-pdf) | Tie |
| Upfront build cost | Lower (existing Next.js codebase) | Higher (new build) | PWA |
| Switching cost later (PWA → native) | Medium (shared logic, rewrite screens) | N/A | — |

**iOS storage caveat**: Safari PWAs on iOS clear IndexedDB if the app is not opened for ~7 days. For trip data that spans weeks between uses (planning Peru in March, using it in July), this is a real data loss risk. Expo's SQLite/AsyncStorage does not have this behaviour. Source: [MagicBell — PWA iOS Limitations 2026](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide).

### Real-world comparable apps

- **Polarsteps**: Expo React Native. Automatic GPS tracking, photo journaling, offline path recording — exactly the feature surface Kite needs.
- **Wanderlog**: React Native. Trip planning with offline access, collaboration.
- **TripIt**: Native iOS/Android. Email-based itinerary parsing, offline access.

None of the direct competitors ship a PWA as primary client. All rely on native to deliver offline reliability and photo handling. This is not a coincidence.

### Cost of switching later

If Kite ships PWA today and migrates to Expo React Native in Phase 1, the switch costs roughly:
- 4–6 weeks of rebuild (screen-by-screen migration, since React Native components are not the same as Next.js)
- The logic layer (data models, API calls, AI wiring) is reusable if built behind clean interfaces
- The UI layer is a rewrite

### Recommendation

**Phase SF test**: Continue as Next.js PWA. It builds on the existing codebase, localStorage works fine for a 5-day trip, and the Lorena adoption test does not depend on native features.

**Before Phase 1 white-label launch**: Migrate to Expo React Native. The two features that Phase 1 and Phase 2 absolutely need — iOS Share Extension (Lorena's Instagram saves) and App Store distribution (tour operators need a real app to hand clients) — are locked behind native. Building on PWA and migrating later is doable but costs 4–6 weeks you could avoid by deciding now.

**The practical path**: Build the SF test as PWA to validate the product idea, then treat the Expo migration as Sprint 0 of Phase 1. The time is recoverable; the architecture direction is not easily reversed once tour operator contracts start.

---

## 3. Backend: Supabase vs Cloudflare Workers+D1+R2

### Contenders

**Supabase**: Postgres database + Auth + Storage + Realtime + Edge Functions in one managed platform. Open-source core, hosted by Supabase Inc. Row Level Security (RLS) enforces per-user data access at the database layer — critical for multi-tenant white-label.

**Cloudflare Workers + D1 + R2**: Serverless compute at the edge (Workers), SQLite database distributed globally (D1), object storage with zero egress (R2). Lower cost floor at scale, but requires assembling and maintaining all three pieces yourself.

### Cost model: active trips at different scales

Assumptions: 1 trip = ~50 stops, ~20 journal entries, ~150 photos (stored separately), ~5MB of structured data. Backend = trips table, stops, journal entries. Photos go to R2 or Supabase Storage (separate calculation in Section 6).

**Supabase**:
- Free tier: 500MB database, 1GB file storage, 50,000 MAUs, 5GB egress. Pauses after 1 week of inactivity (not suitable for production).
- Pro ($25/month): 8GB database, 100GB storage, 100K MAUs, 250GB egress included.
- At 10 active trips: Free tier sufficient during dev. Pro needed for production (pause behaviour).
- At 100 active trips: ~$25/month flat. Well within Pro.
- At 1,000 active trips: ~$25-35/month. Database stays small; egress may tick slightly.
- At 10,000 active trips: ~$50-80/month. MAU overages ($0.00325/MAU) kick in if each trip has 2 users. Database scales fine; Supabase handles Postgres at this size without concern.

Source: [Supabase Pricing](https://supabase.com/pricing), [Real Costs at Scale](https://designrevision.com/blog/supabase-pricing).

**Cloudflare Workers + D1 + R2**:
- Workers Paid: $5/month base, includes 10M requests + 30M CPU milliseconds. At $0.30/M requests beyond that.
- D1: 25B reads and 50M writes/month included in Workers Paid. $0.001/M reads, $1.00/M writes beyond.
- R2: $0.015/GB/month storage, $4.50/M Class A ops (writes), $0.36/M Class B ops (reads), **zero egress fees**.
- Auth: not included — you need Clerk ($0.02/MAU after 10K) or build your own.
- Realtime: not included — you need a separate pub/sub layer.
- Total at 10 trips: ~$10-15/month (once Clerk is added for auth). Marginally cheaper but more moving parts.
- Total at 10,000 trips: ~$30-50/month. The zero-egress R2 matters at this scale. Small win.

Source: [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/), [R2 Pricing](https://developers.cloudflare.com/r2/pricing/), [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/).

### Ergonomics for a non-technical founder commissioning work

Supabase has a visual dashboard, SQL editor, auth UI, storage browser, and realtime inspector. Contractors can inspect data without asking you. Cloudflare's D1/R2 dashboard is functional but barebones — it's an ops console, not a product dashboard. If Ant ever wants to look at what's in the database, Supabase wins clearly.

### Lock-in risk

Supabase runs on standard Postgres. Data export is a `pg_dump`. Moving to another Postgres host later is a half-day task. Storage is S3-compatible. The lock-in is low.

Cloudflare D1 is SQLite, not Postgres. Schema migrations require the Wrangler CLI. Moving off Cloudflare requires a data migration from SQLite to another format. More lock-in, not less.

### Realtime and sync

Supabase Realtime (built on Phoenix Channels) broadcasts Postgres changes to connected clients. This is exactly what cross-device sync needs in Phase 1 — Ant edits a stop on his phone, Lorena sees the update without refreshing. Cloudflare requires you to wire this yourself (Durable Objects or an external pub/sub service like Ably).

### Multi-tenant white-label (Phase 1)

Supabase Row Level Security policies can enforce tenant isolation at the database level: `WHERE organisation_id = auth.jwt() -> 'org_id'`. Tour operators get a dedicated `organisation` record. Their end users see only their operator's trips. This is a standard Supabase pattern, well-documented, and does not require separate database instances per operator (avoiding the cost and ops overhead of database-per-tenant). Source: [Multi-Tenant Architecture Guide 2026](https://developex.com/blog/building-scalable-white-label-saas/).

### Recommendation

**Supabase**. The cost difference versus Cloudflare is negligible at Kite's scale through 10,000 trips. What is not negligible is the operational overhead of assembling and maintaining three separate Cloudflare services, adding external auth, and wiring your own realtime layer. For a founder commissioning work out rather than running an in-house engineering team, Supabase's integrated platform is materially less risky and faster to iterate.

Cloudflare Workers + D1 + R2 becomes interesting if Kite ever reaches 100,000+ trips and R2's zero-egress benefit compounds. That is not a 2026 problem. Defer.

---

## 4. AI Layer

### Tasks and model selection

**Task 1: Itinerary generation** (user describes trip → Claude drafts day-by-day structure)

This is the most demanding task. A good draft requires understanding geography, pacing, activity types, and family context. Output is 300-800 tokens of structured itinerary.

Token estimate: ~800 input (system prompt + user description) + ~500 output = 1,300 tokens total.

Cost per trip draft:
- Claude Haiku 4.5 ($1/$5 per M tokens): (800 × $0.000001) + (500 × $0.000005) = **$0.0008 + $0.0025 = ~$0.003**
- Claude Sonnet 4.6 ($3/$15): ~$0.010 per draft
- Gemini 2.5 Flash ($0.30/$2.50): ~$0.0015 per draft

**Recommendation: Claude Haiku 4.5**. Quality matters here — this is the product's showcase moment — and Haiku is demonstrably capable of structured itinerary generation at this complexity level. The $0.003/draft cost is negligible (at 1,000 trips/month, it's $3/month). Gemini Flash saves $0.0015 per draft but risks the quality consistency that Ant's "craft is everything" standard demands. Source: [Claude API Pricing 2026](https://platform.claude.com/docs/en/about-claude/pricing).

**Task 2: Email / PDF booking confirmation parsing** (forward email → extract stop details: name, date, time, booking ref, QR code URL, address)

Booking confirmation emails are formulaic. A typical Booking.com or airline confirmation email is ~2,000-4,000 characters = ~600-1,200 tokens. Output is structured JSON (~200 tokens).

Cost per email parsed:
- Claude Haiku 4.5: ~$0.0006 input + $0.001 output = **~$0.0016**
- Gemini 2.5 Flash-Lite ($0.10/$0.40): ~$0.0001 + $0.00008 = **~$0.0002**

With **prompt caching** (Anthropic charges 10% of input price for cache hits), the system prompt (~500 tokens, identical every call) can be cached. On repeat calls, input cost drops to ~$0.0001. Effective cost per email falls to **~$0.001 with caching**.

Dedicated email parsing APIs (TripIt, AwardWallet, Traxo) are enterprise-tier B2B products, not priced for indie SaaS. TripIt's parser is excellent (99.3% accuracy on 1,247 templates) but not available as a public pay-per-call API. Source: [AwardWallet Email Parsing API](https://awardwallet.com/email-parsing-api). For Kite's use case, LLM-based parsing with a well-engineered prompt is the right call — flexible, cheap, and Ant can tune the prompt rather than waiting for a vendor to add a new booking template.

**Recommendation: Claude Haiku 4.5 with prompt caching**.

**Task 3: Suggestions and recommendations** (suggest activities/restaurants based on destination + taste profile)

This is a lower-stakes inference task — suggestions are helpful but not load-bearing. Volume could be high (every time a user views a destination). Needs to be cheap.

Cost per suggestion batch (10 suggestions, ~400 input + 300 output tokens):
- Claude Haiku: **$0.002**
- Gemini 2.5 Flash-Lite ($0.10/$0.40): **$0.00016**

**Recommendation: Gemini 2.5 Flash-Lite**. At 16x cheaper than Haiku for a task where fine-grained quality is less critical, the cost difference matters as trips scale. Source: [Gemini API Pricing 2026](https://ai.google.dev/gemini-api/docs/pricing).

### Failure modes and guardrails

**Hallucinated flight numbers**: The AI invents a plausible-looking booking reference. This is a genuine risk for the email parsing task. Mitigation: never present AI-extracted data as confirmed without a user review step. The trip creation flow already builds in "review and edit" — apply the same pattern to email parsing. Show the extracted data in a diff view: "We found this — does this look right?" before committing to the trip.

**Wrong dates/times**: Timezone confusion is common (booking email in local time, LLM interprets as UTC). Mitigation: extract the timezone explicitly as a separate field; surface it in the UI for user confirmation.

**Hallucinated locations**: The AI invents coordinates. Mitigation: geocode place names via Mapbox/Google Places after extraction, not during. If geocoding returns no match, flag to user.

**Album narrative generation**: For Phase 2, AI generates a narrative paragraph for each trip day. This is a bonus feature. Use Haiku here too. Failure mode is generic AI-sounding text ("We had an amazing adventure in the stunning landscapes of..."). Mitigation: inject the user's actual journal notes and ratings as grounding context. If the user wrote "kids complained all day, then the macaws saved it" — that should appear in the output.

### Cache strategy

Prompt caching applies to: the system prompt for itinerary generation (constant, ~800 tokens), the extraction schema for email parsing (constant, ~400 tokens). Both should use Anthropic's cache control headers (`cache-control: ephemeral`). Cache TTL is 5 minutes for ephemeral; for common system prompts, use the longer-lived cache option (up to 1 hour). This reduces input token costs by ~90% on repeated calls. Source: [Anthropic API Pricing](https://platform.claude.com/docs/en/about-claude/pricing).

---

## 5. Sync and Offline Model

### The problem

Two phones (Ant + Lorena) need access to the same trip. Sometimes with no internet (Amazon, Sacred Valley). Changes made offline need to propagate when connection returns.

### Three options

**CRDT (e.g. Yjs)**: A CRDT (Conflict-free Replicated Data Type) is a data structure that mathematically guarantees two independent changes can always be merged without conflict — even if both devices edited the same document simultaneously while offline. Example: Ant edits a stop's description offline; Lorena adds a photo to the same stop offline. When they reconnect, both changes survive.

CRDTs are the right answer when: multiple users might edit the same data concurrently (collaborative document editing, shared spreadsheets). Yjs + IndexedDB can work without a backend at all for small-scale local-first apps.

**Last-write-wins (LWW)**: Whoever synced most recently wins. Simpler to implement. Loses data if both parties edit the same field offline and then sync.

**Per-trip owner with sequential edits**: One person owns the trip (the Organiser, Ant). Other viewers (Lorena, kids) cannot edit the itinerary structure. They can add journal entries and photos, but those are append-only, not overwriting shared state. Conflicts are structurally impossible.

### What actually applies to Kite

Kite's data model is: one Organiser per trip who controls the itinerary; family members add journal entries and photos but do not restructure the plan. This is not Google Docs — it is closer to "one person's logbook that others can append to."

In this model:
- Structural edits (stop details, order, booking refs) → Organiser only → no concurrent edit conflict
- Journal entries → append-only, each entry has a unique ID and author → LWW is fine, you're not editing someone else's entry
- Photos → also append-only → no conflict

CRDT complexity is entirely unwarranted here. It would add 40KB+ of JS runtime overhead (Yjs), significant implementation complexity, and solve a problem that the product model eliminates by design.

Source: [Beyond Offline-First: CRDTs — Medium](https://medium.com/@engin.bolat/beyond-offline-first-the-nightmare-of-data-synchronization-crdts-c69501a96c8d) confirms LWW is sufficient for ~95% of apps; Kite's per-owner structure pushes it even further into "CRDT is overkill" territory.

### Recommendation

**Per-trip owner model with last-write-wins for append-only content**.

Implementation: every record (stop, journal entry, photo) carries `updated_at` and `author_id`. On sync, the server wins for Organiser-owned records (stops, itinerary structure), and append-only semantics handle journal/photo conflicts. Use the `Storage` interface already established in the architecture (see `2026-04-20-backend-localstorage-then-supabase.md`) to swap the localStorage adapter for a Supabase adapter in v1.0 without rewriting screens.

For the SF test (localStorage-only): two phones cannot sync at all. That is acceptable — Ant manages the trip, Lorena views her own copy. Sync is a v1.0 concern.

---

## 6. Media Storage

### What needs storing

- **Trip photos** (from phone camera, added to journal entries): assume 50 photos/trip, 3MB average = **150MB/trip**
- **QR code images** (from booking emails or manual upload): ~50KB each, ~10 per trip = **0.5MB/trip**
- **Shareable album covers** (AI-generated, Phase 2): ~1MB each = negligible

### Cost model at scale

Storage only (photos, assuming no compression). In practice, compress to ~500KB on upload (50% quality JPEG at 1200px wide). Adjusted: **~30MB/trip compressed**.

| Scale | Raw storage | R2 cost (storage) | Supabase Storage cost |
|---|---|---|---|
| 10 trips | 300MB | Free (10GB free) | Free (1GB free on Pro, then $0.021/GB) |
| 100 trips | 3GB | **$0.045/month** | **$0.042/month** |
| 1,000 trips | 30GB | **$0.45/month** | **$0.42/month** + potential egress |
| 10,000 trips | 300GB | **$4.50/month** | **$4.20/month** storage + **$4.50/month egress** |

At 10,000 trips: **Supabase Storage total ~$8.70/month vs R2 $4.50/month**. The gap is the egress charge — Supabase (S3-backed) charges $0.09/GB; R2 charges zero.

At scale, R2 wins clearly. The practical saving at 1,000 trips is negligible. The architecture matters at 10,000 trips.

### CDN strategy

R2 can serve files through Cloudflare's global CDN (Workers route or a custom domain mapped to R2). Photos load from the nearest edge node, not the origin bucket. This is a significant performance win for photos on the trip — a family in Peru loading their Stop Card photos gets them from a PoP in Latin America, not a US data centre.

Supabase Storage's Smart CDN propagates changes globally within 60 seconds. For user-uploaded photos that rarely change, the performance delta between Supabase CDN and Cloudflare CDN is minimal.

### Recommendation

**Hybrid**: Supabase Storage for access-controlled documents (booking confirmation PDFs, private QR codes, anything requiring auth), **Cloudflare R2 for photos** (public-readable with signed URLs for private trips, global CDN, zero egress). This is a common production pattern — not premature complexity, just separating concerns.

For the SF test: photos stay compressed in localStorage (enforce <500KB client-side before store). When v1.0 ships Supabase, start with Supabase Storage for simplicity. Migrate photos to R2 at Phase 1 if operator volume demands it.

---

## 7. Build vs Buy Line

For each dependency: call, cost, and reasoning.

### Auth — **Buy: Supabase Auth**

Supabase Auth is bundled with the backend. Magic link (email → tap → logged in) is the right UX for Lorena — no password, no friction. Supports Row Level Security integration natively. Cost: $0.00325/MAU over 50,000 free. At 10,000 trip users with ~2 MAUs each = 20,000 MAU → **free tier**.

Clerk ($0.02/MAU) is the best alternative if Supabase is not used, but at Kite's scale the cost premium ($200/month at 10K users vs $0) is unjustifiable. Auth0 is enterprise pricing — out of scope. Build-your-own is a distraction.

### Email itinerary parsing — **Buy: LLM (Claude Haiku)**

As established in Section 4. No dedicated commercial API is available as a simple pay-per-call service for indie SaaS. LLM parsing at $0.001-0.002/email with a well-engineered prompt is flexible, cheap, and maintainable.

**The forwarding flow**: user forwards booking email to `parse@kite.red` → Postmark/Resend inbound hook → webhook to Supabase Edge Function → Haiku extraction → draft stop created, user reviews before committing. Postmark inbound costs $10/month for 10K inbound emails (10,000 booking forwards is a big v2 number). Source: [Postmark Pricing](https://postmarkapp.com/pricing).

### Maps / Places — **Buy: Mapbox**

**Decision criteria**: Kite's maps usage is not heavy — one map pin per stop (show location, open in Apple/Google Maps). No turn-by-turn navigation. Places search for adding a stop.

Google Places:
- Google eliminated the universal $200/month credit in February 2025. New subscription tiers: Starter $100/month, Essentials $275/month. Pay-as-you-go: Place Details at $2.50/1,000 requests. Source: [Google Maps Pricing 2026](https://www.boundev.com/blog/google-maps-api-pricing-guide).
- For Kite at 1,000 trips with ~10 place lookups each = 10,000 Place Details calls = **$25/month at PAYG**.

Mapbox:
- Free tier: 50,000 mobile MAUs/month, 100,000 map loads/month.
- Geocoding: $0.75/1,000 requests vs Google's $5/1,000. Source: [Radar Maps Comparison 2026](https://radar.com/blog/mapbox-vs-google-maps-api).
- At 10,000 place searches: **$7.50** vs Google's **$50**.

Leaflet + OpenStreetMap (OSM):
- Completely free. Good enough for rendering a location pin and opening in native Maps.
- OSM data quality varies by region — for boutique travel in Peru/Japan/Africa, the data may be incomplete. Restaurant names, boutique lodges, private guides often not in OSM.
- No search API (you'd need Nominatim, which has rate limits, or a paid geocoder).

**Recommendation: Mapbox for Places search and geocoding. Leaflet + OSM for map rendering (pin display only)**. This splits the cost: Mapbox handles the search and geocoding (which needs quality data), OSM renders the pin on a map (which just needs tiles). Most trips are below Mapbox's free tier indefinitely.

For Phase 1 white-label: each operator's trips are likely in a handful of destinations. 50 operators × 200 trips × 10 place lookups = 100,000 searches = **$75/month at Mapbox**. Manageable. If Google-quality data is non-negotiable in specific regions, add a Google Places fallback for those regions only (conditional on tour operator's primary geography).

### Instagram Share Extension — **Buy: Expo Share Extension plugin**

This feature requires Expo React Native (native app). The `expo-share-extension` library (open-source, maintained) enables a custom iOS Share Extension that appears in Instagram's share sheet. Source: [GitHub — expo-share-extension](https://github.com/MaxAst/expo-share-extension).

For a PWA, this is impossible — iOS does not expose the Share Sheet to websites. This is one of the two reasons Expo is recommended for Phase 1 (the other being App Store distribution).

**For the SF test (PWA)**: skip the Instagram share feature. Users add Inspirations manually (paste a URL or upload an image). It works; it's just not the elegant Lorena flow. Ship this properly in Phase 1 Expo.

### Payments — **Buy: Stripe**

No meaningful alternative for a UK-founded product targeting UK/EU/US families. Paddle is the only credible alternative (handles VAT and EU digital services tax automatically, which Stripe does not — Stripe requires you to manage tax compliance separately via Stripe Tax at 0.5% per transaction). 

For a subscription product (£5-8/month tier), Stripe Billing adds 0.7% on top of 2.9% + $0.30. On a £6/month sub: £0.47 in Stripe fees = effective take rate of ~7.8%. Paddle's base rate is 5% + $0.50 which at £6/month = £0.80 = 13.3% — worse for this price point.

**Recommendation: Stripe** with Stripe Tax enabled for EU VAT compliance. The 0.7% billing fee is offset by not needing a separate VAT management layer.

### Booking deep-links (Affiliates) — **Build shallow, buy SDKs**

Affiliate links for Booking.com, Airbnb, Viator, and OpenTable are not "buy vs build" — they are free affiliate programme registrations. Booking.com and Airbnb provide deep-link URL formats (you construct a URL with your affiliate tag). Viator has a proper affiliate SDK. This is not a dependency purchase — it is a commercial relationship. Build the link construction logic; it is ~50 lines of code.

---

## 8. Security and Privacy

### What data Kite holds

- Family personal data: names, email addresses, potentially passport info (if Ant adds it to stop notes), children's names (ages 15-16, close to but not under child consent threshold)
- Booking references, QR codes, confirmation emails (potentially containing credit card last 4, flight seats, room types)
- GPS/location trail (if GPS tracking is ever added — deferred to v1.1 at earliest)
- Photos from the trip including family members and minors

### Threat model — worst case

**Most likely threat**: data breach via weak auth or misconfigured database RLS policies exposes all trip data including booking references. A booking reference + name is enough to modify or cancel a booking with some airlines and hotels. Real financial harm.

**Second worst**: photos including minors exposed to public access due to a misconfigured storage bucket. PR catastrophe for a family travel product.

**Third**: GDPR breach notification required due to a data incident. UK ICO fines up to 4% of global turnover or £17.5M.

**Less likely**: targeted attack on a specific family's trip data. Kite is not holding financial account credentials. Booking refs without login credentials have limited exploit surface.

### Children's data

Kite's primary user is Ant (the Organiser, adult). Children's data appears as names in trip records, potentially photos. Under UK GDPR and EU GDPR, children 15-16 are at or above the age of consent for digital services in most EU member states (the age is set by each member state between 13-16; UK is 13 post-Brexit with the Data (Use and Access) Act 2025). Kite is not a "service directed at children" — it is a family planner operated by adults. Standard adult GDPR consent at account creation is sufficient.

**However**: photos containing children require explicit consent for any sharing. The sharing features (album share URL, community in Phase 2) must default to private and require explicit opt-in. The privacy default is "visible only to trip members," not "visible to the community." Source: [ICO — Children and UK GDPR](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/children-and-the-uk-gdpr/).

### Data residency for UK/EU families

Supabase's hosted platform defaults to AWS US East (N. Virginia). For UK/EU families, this triggers GDPR data transfer requirements. Supabase offers EU-hosted projects (AWS eu-west-2 for London, eu-central-1 for Frankfurt). **Set the project region to eu-west-2 (London) at project creation.** This keeps data within the UK jurisdiction, satisfies the adequacy decision, and avoids trans-Atlantic transfer complexity. There is no cost difference between regions.

### Encryption at rest

Supabase encrypts all data at rest by default (AES-256). Photos stored in R2 are also encrypted at rest by default. No additional action needed — but confirm this when selecting a Supabase plan. Source: [Supabase Security Docs](https://supabase.com/docs/guides/platform/security).

**What also needs application-level encryption**: booking references and QR code images should not be stored as plain searchable strings if a data breach occurs. Consider encrypting the `booking_ref` column at the application layer before writing to Postgres. The overhead is trivial; the protection against a DB dump being immediately exploitable is real.

### GDPR posture

Required actions before Phase 1 launch:
1. Privacy policy covering data types, processing purpose, retention, and DSAR rights
2. Retention policy: trips deleted 3 years after last access (or on account deletion, whichever first)
3. Data export endpoint: Supabase's storage access provides a natural path for this
4. Consent at signup for photo sharing features (opt-in, not opt-out)
5. Cookie banner if analytics cookies are used (PostHog's JS SDK can be configured to avoid cookies and use localStorage instead, bypassing this requirement — use that config)

---

## 9. Observability and Ops

### Requirements for a small-team commissioned product

- Error tracking: know when something breaks in production before the user reports it
- Performance monitoring: know if the app is slow on real devices (especially on-trip with degraded connectivity)
- Product analytics: know which features are used, where users drop off, whether Lorena actually uses the journal

### Recommendation: PostHog (consolidated)

PostHog covers product analytics, error tracking, session replay, and feature flags in a single tool. Free tier: 1 million events/month, 5,000 session replays, 100,000 errors/month.

At Kite's scale, this free tier lasts well into the hundreds of active users. Source: [PostHog vs Sentry 2026](https://vemetric.com/blog/posthog-vs-sentry).

PostHog is GDPR-friendly: it can be configured without cookies (using localStorage), supports data residency in the EU (EU cloud), and has a self-hosting option if data residency requirements become strict.

**Add Sentry separately** only if error tracking granularity becomes critical at Phase 1 scale. PostHog's error tracking is good but not Sentry's depth. For a product where "enterprise quality" is the bar, having both is not overkill — but PostHog-only is fine for the SF test and Phase 1 development.

### Performance monitoring for offline-first

The most important thing to measure is **offline reliability**: what percentage of stop cards fully loaded before the user lost connectivity. This is not a standard analytics event — build a custom event: `stop_card_offline_ready` fired when a stop's data is fully written to IndexedDB/SQLite. If this event fires for fewer than 95% of stops before an offline session, there is a bug.

---

## 10. Risks and Unknowns — Ranked by Severity

### Critical (blocks Phase 1 GTM)

**1. iOS Share Extension requires Expo — currently on Next.js PWA**
The Instagram save feature (Lorena's core inspiration workflow) cannot be built on a PWA. If the Phase 1 white-label launch plan includes this feature, the Expo migration must happen before Phase 1, not after. Estimate: 4–6 weeks of rebuild. If this feature is deferred to Phase 2 B2C, the PWA path has more runway. **Decision needed from Ant.**

**2. App Store presence for white-label tour operators**
Tour operators like Pura Aventura hand clients a "Kite-branded experience." A PWA served at `pura-aventura.kite.red` is technically possible but clients download it via "Add to Home Screen" in Safari — not the App Store. Most operator clients expect an App Store link. This is a GTM risk for Phase 1 specifically. Source: [PWA vs Native App 2026](https://progressier.com/pwa-vs-native-app-comparison-table).

### High (architectural decisions with rework cost if deferred)

**3. Multi-tenant white-label schema design**
The database schema must support `organisation_id` partitioning from day one. Adding it later to a live product is a migration with data risk. Decision needed before v1.0 build starts: shared schema with RLS (recommended), or separate Supabase projects per operator (more expensive, simpler operationally at small operator counts).

**4. Photo storage and compression strategy**
localStorage photo storage for the SF test will hit size limits at ~5-10 photos. Before Phase 1, the R2/Supabase Storage decision needs to be implemented. Delaying this means users lose photos — not recoverable. This is a v1.0 blocker, not a later concern.

**5. Booking confirmation email parsing reliability**
LLM-based parsing is flexible but not 100% accurate. A bad extraction (wrong booking ref, wrong date) that is silently committed to a trip creates real-world friction — Ant shows the wrong QR code at a venue. The "review before commit" UX flow must be mandatory, not optional. If it is skippable, some users will skip it and face consequences. Source: [TripIt's 99.3% accuracy](https://lifetips.alibaba.com/tech-efficiency/tripit-organizes-your-travel-itinerary-automatically-vi) — Kite's LLM approach will be lower. Design around that gap.

### Medium (affects quality but recoverable post-launch)

**6. Offline data loss on iOS PWA** (if PWA is kept)
iOS Safari clears PWA IndexedDB after ~7 days of inactivity. A user who builds their Peru trip in March and opens the app in July (Peru departure) will find empty data. This is a product-killing failure that is invisible during development (always active) but guaranteed in production. Mitigation: add a "Your data is stored locally. Download a backup." warning, and prioritise backend sync before the first real trip.

**7. Album print quality (Phase 2)**
The printable album is Lorena's primary desired output. It has not been tested on a real printer. react-pdf and CSS print stylesheets behave differently across browsers and printer drivers. This needs a print QA pass before Phase 2 ships — test on a real home printer at A4/Letter.

**8. Mapbox data quality in boutique travel destinations**
Mapbox's base tiles are OpenStreetMap-derived. In rural Peru, the Sacred Valley, and specific Japanese towns, POI data may be sparse or outdated. A search for "Macaw Clay Lick lodge" may return nothing. Mitigation: allow manual coordinate entry as a fallback; do not hard-depend on Places search for stop creation.

### Low (solvable when they arise)

**9. Stripe VAT compliance for EU subscribers**
Stripe Tax ($0.005% per transaction) or Paddle handles EU digital services VAT. Not complex; just requires setup before the first EU subscriber converts.

**10. Community feature gaming (Phase 2)**
Lorena's concern about influencers gaming the community is valid but deferred. The album-first model (share as byproduct of making your keepsake) is the structural mitigation. No architectural decision needed now.

---

## 11. Open Questions for Ant

These are decisions that only Ant can resolve — they involve trade-offs between cost, timeline, and GTM strategy.

### Q1: When does Expo React Native need to happen?

The iOS Share Extension (Lorena's Instagram save) and App Store distribution (Phase 1 white-label) both require native Expo. The question is timing:
- **Option A**: Build SF test on PWA (now), migrate to Expo immediately after SF test passes, before Phase 1 launch. Costs 4–6 weeks. Phase 1 launches with full native capability.
- **Option B**: Launch Phase 1 white-label as PWA, add native as Phase 2. Faster Phase 1 launch but tour operator clients get a "save to home screen" experience instead of an App Store app. Instagram save deferred to Phase 2.

*What Ant needs to decide*: Is App Store distribution a requirement for the Phase 1 white-label GTM, or is a well-crafted PWA acceptable for the first 1-3 operator pilots?

### Q2: Phase 1 white-label pricing and per-operator isolation model

The multi-tenant architecture decision (shared schema with RLS vs separate projects per operator) depends on what operators are paying and what isolation they expect:
- **Shared schema + RLS**: ~$25/month total regardless of operator count. Operators share infrastructure. Data is logically separated but physically co-located. Suitable for most white-label SaaS.
- **Separate Supabase project per operator**: $25/month per operator. Operators are completely isolated. Enterprise/compliance buyers may require this. Also means per-operator Vercel deployments (custom domain per operator).

*What Ant needs to decide*: Is the Phase 1 target operators (Pura Aventura tier) likely to ask about data isolation or compliance? If yes, build isolated. If no, shared schema is fine and much simpler.

### Q3: Cost tolerance for AI features

The AI costs in this document are small at current scale. At 10,000 active trips, total AI costs are estimated at ~$50-100/month across all tasks. But some features could drive higher costs:
- Album narrative generation (Haiku, ~$0.005 per album) — trivial
- A "daily AI briefing" feature (push notification with that day's stops summarised by AI) — could be $0.001/trip/day = $300/month at 10,000 trips

*What Ant needs to decide*: Is there an AI feature cost ceiling per subscriber that determines what's viable? At £6/month subscription, if AI costs per user are above £0.50/month, the unit economics get tight. This number sets the constraint for what AI features can be "always-on" vs "premium tier only."

### Q4: Launch timeline — SF test first, or parallel Phase 1 prep?

Current plan: SF test (late April 2026) → evaluate → Phase 1 white-label. If the Expo migration is needed before Phase 1, and Phase 1 has a target timeline (e.g., "announce at NY May 2026 pitch"), the migration needs to start before SF test results are in.

*What Ant needs to decide*: Is the Phase 1 launch timeline fixed (tied to BlackOps NY pitch)? If yes, the Expo migration starts now in parallel. If Phase 1 has flexibility, the SF test can inform the decision.

---

## Appendix: Verified Pricing Sources (April 2026)

- Supabase pricing: https://supabase.com/pricing — Pro $25/month, $0.021/GB storage overage, $0.09/GB egress overage, $0.00325/MAU overage
- Cloudflare R2: https://developers.cloudflare.com/r2/pricing/ — $0.015/GB/month, $4.50/M Class A ops, $0.36/M Class B ops, zero egress
- Cloudflare D1: https://developers.cloudflare.com/d1/platform/pricing/ — $0.001/M reads, $1.00/M writes
- Claude API: https://platform.claude.com/docs/en/about-claude/pricing — Haiku 4.5: $1/$5 per M tokens; Sonnet 4.6: $3/$15; Opus 4.7: $5/$25
- Gemini API: https://ai.google.dev/gemini-api/docs/pricing — Flash-Lite: $0.10/$0.40 per M tokens; Flash 2.5: $0.30/$2.50
- Mapbox: https://www.mapbox.com/pricing — 50K free mobile MAUs/month; geocoding $0.75/1,000
- Google Maps: https://developers.google.com/maps/billing-and-pricing/pricing — Place Details from $2.50/1,000; no universal $200 credit from Feb 2025
- Stripe: https://stripe.com/pricing — 2.9% + $0.30/transaction; 0.7% additional for Billing
- Clerk: $0.02/MAU after 10K free
- Supabase Auth: $0.00325/MAU after 50K free
- PostHog: 1M events/month free, generous paid tiers
- Sentry: 5K errors/month on free tier

*Note: prices verified via web search April 2026. Infrastructure pricing changes frequently — re-verify before committing to multi-year architectural decisions.*
