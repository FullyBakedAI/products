# Layla.ai Design System

**Layla.ai** is an AI travel planner — a Berlin-based startup that turns a natural-language conversation into a bookable, day-by-day itinerary with flights, hotels, activities, car rentals, and experiences. The product is anchored by a first-person AI persona called **Layla** who speaks like a travel-savvy friend: warm, confident, decisive, and slightly playful.

> Tagline: **"Your trip. Planned in minutes."**
> Mission: "From chat to checkout."

## At a glance

- **Category:** Consumer AI / Travel
- **Audience:** Leisure travelers — families, couples, solo travelers, road-trippers, bleisure. Value-seekers more than luxury-seekers.
- **Pricing:** Free core planning; **Layla Prime $49/yr** unlocks full premium features.
- **Scale:** Ships in 16 languages; claims 1.1M+ trips planned, 4.9★ average rating.
- **Partners:** Booking.com, Skyscanner, GetYourGuide (bookings flow through these).
- **Origin:** Built by the team behind Beautiful Destinations (Jeremy Jauncey) and ex-Flink (Saad Saeed). Backed by firstminute capital.
- **Location:** Berlin (footer reads "Made with 🩵 in Berlin").

## Products / surfaces

This design system covers **two surfaces**:

1. **Marketing site** (`layla.ai`) — homepage, about, blog, itinerary landing pages, FAQ. Conversion-oriented, rich with imagery and social proof.
2. **Planning app** — the conversational trip-builder. A chat-forward interface where Layla and the user co-author an itinerary that renders inline as cards (flights, hotels, days, activities), editable in real time.

A sister product, **Roam Around**, was rolled into Layla as the day-by-day itinerary engine — it's not a separate surface, just a feature.

## Sources consulted

- `https://layla.ai/` — marketing homepage (hero copy, features, FAQ, footer)
- `https://layla.ai/about` — persona voice, product description, traveler archetypes
- `https://layla.ai/roamaround` — tone sample, acquisition copy
- `https://layla.ai/blog/news-and-tips/best-ai-travel-apps-comparison` — long-form blog tone
- `https://www.trustpilot.com/review/layla.ai` — customer/support voice samples
- TechCrunch coverage (Nov 2023) — founder context, product intent
- Brand logo: `https://layla.ai/theme/layla/new-layla-logo.svg` (wordmark, 1054×391)

> ⚠️ No codebase, Figma, or production screenshots were provided. Visual foundations below are inferred from the live site's public copy, the official wordmark, and product positioning. Anything marked **[assumption]** is a reasoned guess — please correct or share the real source of truth so the system can be locked down.

---

## Index — what's in this folder

| Path | Purpose |
|---|---|
| `README.md` | This file |
| `SKILL.md` | Makes this folder portable as an Agent Skill |
| `colors_and_type.css` | CSS variables for color + type + semantic elements |
| `fonts/` | Webfonts (see **Typography** — uses Google Fonts substitute) |
| `assets/` | Logos, marks, icons, placeholder photography |
| `preview/` | Design-system preview cards (shown in the Design System tab) |
| `ui_kits/marketing/` | Recreation of the marketing site (homepage etc.) |
| `ui_kits/app/` | Recreation of the Layla planning app (chat + itinerary) |

---

## Content fundamentals

Layla's voice is the single most distinctive thing about the brand. It is **first-person, always** — "I", "me", "my", not "we", "Layla", or "the product". Layla refers to herself as "your AI travel agent and trip planner" and speaks directly to the reader as "you".

### Voice traits
- **Warm and personal.** Addresses the reader like a friend, not a prospect. Opens conversations with "Hello!" and closes with affectionate nudges ("Try Layla now", "Plan my trip").
- **Confident and decisive.** Makes recommendations, doesn't hedge. Phrases like *"I instantly build a day-by-day plan."*, *"I design romantic getaways…"*, *"Definitely. I specialize in multi-city itineraries…"*.
- **Aspirational.** Leans into travel's emotional promise — "dreamy destinations", "unforgettable memories", "hidden gems", "off-the-beaten-path", "breathtaking landscapes".
- **Practical-warm.** Mentions logistics (live pricing, schedules, budgets) wrapped in reassurance ("no unpleasant surprises", "stress-free experience").
- **Lightly playful on owned surfaces** (blog, support replies): emoji (✈️, 🌍, 🙌, 💙, 🧳), rhetorical questions, exclamations. More restrained on conversion pages.

### Casing
- **Title Case** for page headers and section titles: *"Powered by trusted travel partners"*, *"Making headlines worldwide"*, *"Minds behind the Mission"*.
- **Sentence case** for buttons and CTAs: *"Create a new trip"*, *"Plan a road trip"*, *"Plan a last-minute escape"*, *"Try Layla now"*.
- Brand name always **Layla** or **Layla.ai** (never lowercase "layla" in prose). *Layla Prime* for the paid tier.

### Pronouns
- Product-as-I: **"I'll create a personalized itinerary…"**, **"Ask me anything"**, **"I'm the only AI travel planner you need."**
- Reader-as-you: **"You just share your travel dates…"**, **"When you're ready, book it all in one place."**
- Company voice (when distinct from Layla) uses "we" sparingly: *"We feel Jeremy and Saad are the perfect team…"*

### Emoji
- **Yes, liberally** — but mostly on owned/social surfaces (blog, Trustpilot replies, in-app chat). Travel-themed: ✈️ 🌍 🧳 🌴 🛎️ 🏖️ 🍝. Emotional: 🙌 💙 🩵 ✨ ❤️.
- The footer even signs off *"Made with 🩵 in Berlin"* — a light-blue heart that's become a brand tic.
- **Avoid** on serious conversion pages (pricing, hero CTAs) — keep those clean.

### Signature phrases (lift directly when matching tone)
- "From chat to checkout."
- "Your trip. Planned in minutes."
- "Your trip in minutes, not weeks."
- "No more juggling tabs and apps."
- "Think of me as your digital travel agent in your pocket."
- "Hidden gems and off-the-beaten-path destinations."
- "Dream to booking."

### Examples of headline/body split
- H1: **Your trip. Planned in minutes.** → Body: *Tell me your style and budget, and I'll design a trip for you.*
- H2: **I will be there for you in every step** → Body: *Curate, save and get notified about your trips on the go.*
- FAQ Q: *"What is Layla.ai?"* → A: *"I'm Layla, your **AI travel agent and trip planner**. I create complete, personalized itineraries…"* — note the **bolded phrase** mid-answer; Layla bolds the key value prop in every FAQ response.

---

## Visual foundations

### Colors
The brand core is built on a single distinctive dark purple pulled directly from the wordmark (`#2A182E`) — nearly black, with a plum undertone. Against that, Layla leans on a soft warm off-white background, a pastel "sky" blue accent (the 🩵 from the sign-off), and warm travel-photo imagery that carries most of the color. See `colors_and_type.css` for all tokens.

- **Ink / primary:** `#2A182E` — dark plum-black, used for logo, headlines, primary buttons
- **Bone / background:** `#FAF7F2` — warm off-white, the dominant surface color
- **Paper / card:** `#FFFFFF`
- **Sky / accent:** `#A8D8E8` — the soft light-blue of the heart emoji; used sparingly for highlights, trust badges, secondary CTAs
- **Coral / warm accent [assumption]:** `#F4A88A` — a travel-warm terracotta for destination chips, highlights
- **Sand / neutral:** `#E8DFD3`
- **Line / divider:** `#EDE7DD`
- **Muted ink:** `#6B5B6E`

### Typography
Layla's wordmark is a **custom rounded geometric sans with a noticeable juiciness to the bowls** (the *y* descender loop and *a* aperture are the tells). It's close to **Recoleta** or **Fraunces** in display treatment but more geometric — think a softer **Poppins/Nunito** with character. For body copy, site uses a clean humanist sans.

- **Display [substitute: DM Serif Display → update if you have the real face]** — used for big hero headlines, has a soft, warm, editorial feel matching the travel/lifestyle vibe
- **Body: Inter [assumption — the site's rendered body text reads as a neutral grotesque]** — UI and paragraphs
- **Avoid:** condensed, aggressive display faces. Layla is warm and rounded, never sharp.

> 🚨 **Font substitution flag:** The real wordmark appears custom. I've set up `colors_and_type.css` with Google Fonts (**DM Serif Display** + **Inter**) as placeholders. Please attach the real font files (`.ttf`/`.woff2`) or Figma style references so I can swap them in.

### Layout
- **Generous, calm spacing** — hero sections breathe; multiple scroll-stops per page.
- **Single-column centered** for most marketing sections, max-width ~1200px.
- **Card grids** for itineraries and destinations (3-up on desktop, stacked on mobile).
- **Rounded everything** — cards at `20–24px`, buttons at `pill (full)`, images at `16–20px`.
- Tight gutters inside cards (`24px` padding), generous gutters between sections (`96–160px`).

### Backgrounds and imagery
- **Dominant treatment: full-bleed travel photography** — warm, saturated, aspirational. Beaches, mountains, European old towns, drone shots. Images are the primary color source on the site.
- **Solid bone / cream backgrounds** between image sections to let content breathe.
- **No gradients as primary backgrounds.** No glassmorphism, no mesh gradients.
- **No hand-drawn illustrations** — this is a photography-first brand.
- Trust section uses grayscale press logos on bone background.

### Animation
- **Soft, short, purposeful.** Fade-up on scroll (8–16px, 300–500ms, ease-out). Subtle scale on card hover (`scale(1.02)` with 200ms ease).
- **No bounces, no springy overshoot.** The brand is polished, not playful-chaotic.
- Button hovers: background darkens slightly, no movement.
- Itinerary cards in the app likely animate in sequentially (staggered 60–80ms) — gives the "Layla is planning" feel.

### Hover / press states
- **Hover (buttons):** background darkens ~8%, or switches from ink→slightly-lighter plum. Cursor pointer.
- **Hover (cards):** subtle lift — `translateY(-2px)` + shadow deepens. Image inside does a slow `scale(1.03)` over 400ms.
- **Press:** `scale(0.98)` + shadow flattens. No color flash.
- **Focus:** 2px ring in `--accent-sky` with 2px offset — accessibility default.

### Borders, radii, shadows
- **Radii:** `6px` small / `12px` default / `20px` card / `28px` hero image / `9999px` pill.
- **Borders:** `1px solid var(--line)` on dividers; cards usually *shadow-only*, no border.
- **Shadow system:**
  - `shadow-sm`: `0 1px 2px rgba(42,24,46,.06)` — hairline, for inputs
  - `shadow-md`: `0 4px 16px rgba(42,24,46,.08)` — default card
  - `shadow-lg`: `0 12px 40px rgba(42,24,46,.12)` — hover / elevated
  - `shadow-hero`: `0 24px 64px rgba(42,24,46,.18)` — floating imagery
- **No inner shadows.**

### Transparency / blur
- **Sticky nav:** white at ~85% opacity with `backdrop-filter: blur(16px)` — keeps the bone background readable while floating.
- **Image overlays:** subtle dark gradient on photo cards to protect white caption text (bottom-anchored, 30% → 0%).
- **No heavy glass panels elsewhere.**

### Imagery tone
- **Warm, sun-kissed, saturated.** Golden hour light, turquoise water, European terracotta rooftops.
- **No grain, no B&W.** The brand is optimistic and vivid.
- **Rounded corners on every photo.** Square/sharp photo corners feel wrong on this brand.

### Cards
- White background, `20px` radius, `shadow-md`, `24px` padding.
- Photo at top if present, filling the top edge to the radius (no inner gap).
- Title (display font, 20–24px) then muted metadata row (14px, `--muted-ink`).
- Optional CTA link in bottom-right of the card in `--accent-sky` or ink.

### Layout rules / fixed elements
- **Sticky translucent nav** at top, 72px tall on desktop.
- **No sticky footer CTA** on marketing.
- **App:** chat composer docked at the bottom, itinerary panel can slide in from the right.

---

## Iconography

Based on the wordmark and overall restraint of the marketing site, Layla uses a **minimal, thin-stroke, rounded** icon system. Icons appear sparingly — mostly on feature-row sections, in-chat action chips, and the composer controls.

- **Style:** outline, 1.5–2px stroke, rounded joins and caps. Neutral — **not** emoji-style, not duotone.
- **Color:** inherits from text color (`currentColor`); usually `--ink` or `--muted-ink`.
- **Size:** 20px in-line with text, 24px as standalone, 32px+ in feature rows.

### No codebase was attached
I was not given the actual icon assets used on layla.ai, so I could not copy them. Instead, I've loaded **Lucide** via CDN in the UI kits — it's a friendly, thin-stroke, rounded library that matches Layla's aesthetic well.

> 🚨 **Icon substitution flag:** Using Lucide as a stand-in. If Layla uses a custom set (or a different library like Phosphor or Feather), please share the sprite/font/library name and I'll swap it in.

### Emoji as icons
Emoji show up in **two narrow contexts**:
1. **Chat / brand voice** — Layla's messages, social posts, Trustpilot replies ("✈️", "🙌", "🩵")
2. **Footer signature** — *"Made with 🩵 in Berlin"*

Do **not** use emoji in: feature icons, nav, buttons, pricing cards, FAQ. Those stay with Lucide SVGs.

### Unicode as icons
The star rating uses **★** (U+2605) inline with size-matched weight — e.g. "4.9★".

---

*Continued below — see VISUAL FOUNDATIONS above and the UI kit READMEs in `ui_kits/*/README.md` for product-specific patterns.*
