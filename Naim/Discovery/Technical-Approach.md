# Naim — Technical Approach

**Date:** 2026-04-02
**Status:** Discovery output — bridges into Contract/Spec
**Purpose:** How we make full-stack brand identity checking robust, accurate, and trustworthy

---

## The Five Layers of Brand Identity

Naim checks whether a name is truly yours to take across five layers. Each layer has different data sources, reliability characteristics, and technical challenges.

---

### Layer 1: Domain Availability

**Difficulty: Low — Solved problem**

#### Data Sources (All Free)
| Method | What It Tells Us | Speed | Reliability |
|--------|-----------------|-------|-------------|
| DNS lookup | Whether the domain resolves to an IP | <100ms | High — definitive for active domains |
| WHOIS lookup | Registration status, expiry date, registrar | 200-500ms | High — authoritative registry data |
| RDAP (Registration Data Access Protocol) | Structured WHOIS replacement, increasingly standard | 200-500ms | High — the modern standard |

#### TLDs to Check
**Priority 1 (Always check):** .com, .co.uk, .io, .co, .ai, .app, .dev
**Priority 2 (Check on request):** .net, .org, .xyz, .tech, .design, country codes
**Priority 3 (Expandable):** New gTLDs relevant to the user's industry

#### Extra Value We Can Extract
- **Expiry date** — "This .com expires in 63 days. Want to be notified?"
- **Parking detection** — Is the domain registered but just sitting on a parking page? (HTTP check for common parking templates)
- **Price estimation** — For aftermarket domains, can we estimate resale price from comparable sales?
- **DNS history** — Has this domain been used before? (Archive.org API is free)

#### Zero-Cost: Yes — DNS and WHOIS are free, no API keys needed

---

### Layer 2: Social Handle Availability

**Difficulty: Medium-High — The accuracy problem**

This is where every existing tool fails. Platforms actively discourage automated checking. Our approach must be smarter than brute-force scraping.

#### Strategy: Tiered Checking

**Tier A: HTTP Profile Check (Primary method)**
Most platforms use predictable profile URL patterns:
- Instagram: `https://instagram.com/{username}`
- TikTok: `https://tiktok.com/@{username}`
- X/Twitter: `https://x.com/{username}`
- YouTube: `https://youtube.com/@{username}`
- GitHub: `https://github.com/{username}`
- LinkedIn: `https://linkedin.com/company/{name}` (for company pages)

An HTTP HEAD request returns:
- **200** → taken
- **404** → available
- **Rate limited / blocked** → unknown (be honest)

**Tier B: Platform APIs (Where available)**
Some platforms offer legitimate lookup endpoints:
- GitHub API — free, generous rate limits
- Reddit API — free tier available
- YouTube Data API — free quota

**Tier C: Graceful Degradation**
When we can't verify, we say so. Three states, not two:
- **Available** (confirmed 404)
- **Taken** (confirmed 200 / profile exists)
- **Unconfirmed** (couldn't verify — rate limited, platform blocking, etc.)

#### Platforms to Check (Curated, Not Exhaustive)

**Must-check (Core 10):**
| Platform | Why It Matters | Check Method |
|----------|---------------|-------------|
| Instagram | Visual brand presence, 2B+ users | HTTP profile check |
| TikTok | Fastest-growing platform, creator essential | HTTP profile check |
| X (Twitter) | Public discourse, brand voice | HTTP profile check |
| YouTube | Video content, long-form brand | HTTP profile + API |
| LinkedIn | B2B presence, company pages | HTTP profile check |
| GitHub | Tech brands, open source presence | API (free, reliable) |
| Reddit | Community presence | API |
| Threads | Growing Meta platform | HTTP profile check |
| Bluesky | Emerging decentralized social | HTTP profile check |
| Pinterest | Visual/lifestyle brands | HTTP profile check |

**Should-check (Extended):**
Facebook, Twitch, Discord, Mastodon, Medium, Substack

**The principle:** Check the platforms that matter for brand identity, not 100+ platforms for a vanity number. 10 reliable checks > 100 unreliable checks.

#### Rate Limiting Strategy
- Stagger requests across platforms (don't fire 10 simultaneously from one IP)
- Cache results for short periods (5-10 minutes) — name availability doesn't change by the second
- Rotate user agents and respect robots.txt
- If a platform blocks us, degrade gracefully rather than returning false data

#### Zero-Cost: Yes — HTTP requests are free, API free tiers are sufficient for launch

---

### Layer 3: Company Name Registration

**Difficulty: High — Fragmented by jurisdiction**

#### Available APIs and Data Sources

| Jurisdiction | Source | API Available? | Cost |
|-------------|--------|---------------|------|
| **UK** | Companies House | Yes — excellent free API | Free |
| **US - Delaware** | Division of Corporations | Searchable web interface, no official API | Free (scrape or manual) |
| **US - California** | CA Secretary of State | Searchable web interface | Free |
| **EU** | European Business Register | Partial, varies by country | Varies |
| **Ireland** | CRO (Companies Registration Office) | Searchable web interface | Free |
| **Australia** | ASIC | ABN Lookup API available | Free |
| **Canada** | Corporations Canada | Searchable database | Free |

#### Our Approach: Start Narrow, Expand Honestly
1. **V1:** UK Companies House (excellent API) + US Delaware (most popular incorporation state)
2. **V2:** Add California, Ireland, Australia, Canada
3. **V3:** EU expansion based on user demand
4. **Always:** Be transparent about coverage — "Checked in: UK, Delaware. Not yet available: [other jurisdictions]"

#### Extra Value
- **Similar name detection** — Companies House API supports fuzzy search. "ACME Corp" is taken, but so is "Acme Solutions Ltd" — flag both
- **Company status** — Active, dissolved, dormant. A dissolved company name may be reclaimable
- **Industry classification** — SIC codes tell us what sector the existing company operates in. Same name, different sector might be fine

#### Zero-Cost: Yes — Companies House API is free, web scraping for others

---

### Layer 4: Trademark Clearance

**Difficulty: Medium — Free data, needs AI interpretation**

#### Data Sources

| Source | Coverage | API? | Cost |
|--------|----------|------|------|
| **USPTO TESS** | US trademarks | Free searchable database (no official API, but structured data available) | Free |
| **WIPO Global Brand Database** | International trademarks | Free searchable database | Free |
| **EUIPO eSearch** | EU trademarks | Free searchable database | Free |
| **UK IPO** | UK trademarks | Free searchable database | Free |

#### Our Approach: AI-Powered Similarity, Not Legal Advice

**What we check:**
1. **Exact match** — is this exact name registered as a trademark?
2. **Phonetic similarity** — names that sound alike (AI can do this well)
3. **Visual similarity** — names that look alike when written
4. **Category overlap** — trademark classes (Nice Classification). Same name in a different class may not conflict
5. **Status** — live, dead, pending, cancelled. A dead mark is different from a live one

**What we show:**
> "We found 3 potentially similar trademarks in relevant categories. This is not legal advice — consult a trademark attorney before filing. [View details]"

**Critical UX decision:** Present this as a **risk signal**, not a legal opinion. Traffic light system:
- **Green** — no similar marks found in relevant categories
- **Amber** — similar marks exist but in different categories, or marks are dead/cancelled
- **Red** — similar or identical marks exist in the same or related categories

#### Zero-Cost: Yes — all databases are free to search

---

### Layer 5: App Store Availability

**Difficulty: Low**

#### Data Sources

| Store | Method | Cost |
|-------|--------|------|
| **Apple App Store** | iTunes Search API | Free |
| **Google Play Store** | Unofficial search (no official API, but well-documented scraping patterns) | Free |

#### What We Check
- Is there an app with this exact name?
- Are there apps with very similar names? (helps gauge crowding)
- What categories are they in?

#### Zero-Cost: Yes

---

## The Confidence Model

This is what makes Naim trustworthy. Every result carries a confidence indicator.

### Per-Check Confidence
| Level | Meaning | When to Use |
|-------|---------|------------|
| **Confirmed** | We verified this directly from an authoritative source | DNS lookup succeeded, API returned definitive answer, official database matched |
| **High confidence** | Strong signal from a reliable method | HTTP profile check returned clear 200 or 404 |
| **Unconfirmed** | We tried but couldn't verify | Rate limited, platform blocked us, timeout |
| **Not checked** | This jurisdiction/platform isn't in our coverage | Transparent about what we don't cover |

### Overall Brand Readiness Score
A composite score that synthesises all five layers:

```
Brand Readiness = weighted average of:
  - Domain availability    (30%) — .com availability weighted highest
  - Social handle coverage (25%) — % of core platforms clear
  - Company name clear     (20%) — key jurisdictions
  - Trademark risk         (15%) — inverse of risk signals found
  - App store clear        (10%) — if relevant to user's category
```

Weights are adjustable based on the user's context (e.g., if they're not building an app, app store weight redistributes to other layers).

**The score is the hook.** It's the single number that makes Naim more valuable than a wall of green/red ticks.

---

## Architecture Principles

### 1. Parallel Checking
All five layers check simultaneously. The user sees results stream in as they complete — domains first (fastest), then social, then company/trademark/app store. Progressive disclosure, not a loading spinner.

### 2. Honest Uncertainty
Never fake confidence. "Unconfirmed" is always better than a wrong answer. This is our competitive advantage — users learn to trust Naim because we don't lie.

### 3. Cache Intelligently
- Domain WHOIS: cache for 1 hour (registrations don't change by the minute)
- Social handles: cache for 10 minutes (accounts can be created quickly)
- Company registration: cache for 24 hours (registrations take days to process)
- Trademarks: cache for 24 hours (filings take months)

### 4. Zero-Cost Core
The entire checking engine runs on free APIs and HTTP requests. No paid API dependency for core functionality. AI features (scoring, alternatives, analysis) are the only cost centre — and they're gated behind the paid tier.

### 5. Respect Platforms
Don't abuse rate limits. Don't scrape aggressively. Use official APIs where they exist. Be a good citizen. Sustainable access is more important than speed.

---

## Technical Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Social platform blocks automated checks | Reduced accuracy on that platform | Medium | Graceful degradation, "unconfirmed" status, rotate methods |
| USPTO TESS access changes | Lose trademark checking | Low | WIPO as backup, structured data downloads available |
| Companies House API rate limits | Slower company name checks | Low | Caching, queue management |
| AI costs exceed revenue per user | Negative unit economics | Medium | Gate AI features behind paid tier, optimise prompt costs |
| False positive trademark flags cause user alarm | Trust erosion | Medium | Clear "not legal advice" framing, confidence levels, explain reasoning |
| Platform URL patterns change | False results for that platform | Medium | Monitoring + quick fix. Each platform check is modular and independently updatable |
