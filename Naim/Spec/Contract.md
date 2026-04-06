# Naim — Behavioural Contract / Spec

**Date:** 2026-04-02
**Phase:** Definition (Fully Baked Product Construction Pipeline)
**Status:** V1 — ready for build
**Inputs:** Discovery document, Technical Approach, Value Proposition

---

## Product Identity

| Field | Value |
|-------|-------|
| Name | Naim |
| One-liner | Check whether a name is truly yours to take — everywhere |
| Type | Web application (PWA) |
| Design system | BakeKit |
| Architecture | Config-driven, white-label ready |
| Backend | Python/Flask |
| AI | Local LLM (Ollama) for name generation and scoring |
| Cost model | Zero-cost core (free APIs + local AI) |

---

## Data Shape

### Search Input
```json
{
  "name": "brightpath",
  "context": "sustainable consulting firm",  // optional — for AI features
  "jurisdiction": "uk"                        // optional — for company/trademark
}
```

### Check Result
```json
{
  "name": "brightpath",
  "timestamp": "2026-04-02T00:30:00Z",
  "score": 8.2,
  "verdict": "Strong candidate — clear on domains and most social platforms. One potential trademark similarity in education sector.",
  "layers": {
    "domains": {
      "results": [
        { "tld": ".com", "status": "available", "confidence": "confirmed" },
        { "tld": ".co.uk", "status": "taken", "confidence": "confirmed" },
        { "tld": ".io", "status": "available", "confidence": "confirmed" },
        { "tld": ".ai", "status": "taken", "confidence": "confirmed" },
        { "tld": ".co", "status": "available", "confidence": "confirmed" },
        { "tld": ".app", "status": "available", "confidence": "confirmed" },
        { "tld": ".dev", "status": "available", "confidence": "confirmed" }
      ],
      "summary": "5 of 7 TLDs available including .com"
    },
    "social": {
      "results": [
        { "platform": "instagram", "handle": "brightpath", "status": "taken", "confidence": "high", "note": "Last post 2021 — possibly dormant" },
        { "platform": "tiktok", "handle": "brightpath", "status": "available", "confidence": "high" },
        { "platform": "x", "handle": "brightpath", "status": "available", "confidence": "high" },
        { "platform": "youtube", "handle": "brightpath", "status": "taken", "confidence": "high" },
        { "platform": "linkedin", "handle": "brightpath", "status": "available", "confidence": "high" },
        { "platform": "github", "handle": "brightpath", "status": "available", "confidence": "confirmed" },
        { "platform": "reddit", "handle": "brightpath", "status": "available", "confidence": "confirmed" },
        { "platform": "threads", "handle": "brightpath", "status": "available", "confidence": "high" },
        { "platform": "bluesky", "handle": "brightpath", "status": "available", "confidence": "high" },
        { "platform": "pinterest", "handle": "brightpath", "status": "taken", "confidence": "high" }
      ],
      "summary": "7 of 10 core platforms available"
    },
    "company": {
      "results": [
        { "jurisdiction": "uk", "status": "taken", "confidence": "confirmed", "detail": "BRIGHTPATH LTD — Active, incorporated 2019, SIC: 70229 (Management consultancy)" },
        { "jurisdiction": "us-de", "status": "not_checked", "confidence": "not_checked" }
      ],
      "summary": "Taken in UK (active company in consultancy)"
    },
    "trademark": {
      "results": [
        { "database": "uspto", "matches": 2, "closest": "BRIGHTPATH LEARNING", "class": "41 (Education)", "status": "live", "risk": "low", "note": "Different category — education vs consulting" }
      ],
      "summary": "Similar marks exist but in different categories — low risk"
    },
    "appstore": {
      "results": [
        { "store": "apple", "status": "taken", "detail": "BrightPath — education app" },
        { "store": "google", "status": "taken", "detail": "BrightPath Kids — education app" }
      ],
      "summary": "Name in use in app stores (education category)"
    }
  }
}
```

### Saved Name (Portfolio)
```json
{
  "name": "brightpath",
  "saved_at": "2026-04-02T00:35:00Z",
  "score": 8.2,
  "notes": "Team favourite — Instagram issue is minor",
  "last_checked": "2026-04-02T00:30:00Z",
  "result": { /* full check result */ }
}
```

---

## Interaction Logic

### Primary Flow: Search
1. User types a name into the command bar
2. On submit, all five layers check simultaneously
3. Results stream in progressively (domains first, then social, then company/trademark/app store)
4. The Verdict appears at top — single score + natural language summary
5. Detailed breakdown below, organised by layer
6. User can save the name to their portfolio

### Secondary Flow: AI Generate
1. User describes their business/product in natural language
2. AI generates name suggestions (using local Ollama)
3. Each suggestion is shown with a quick availability indicator
4. User can tap any suggestion to run the full five-layer check

### Portfolio Flow
1. User views saved names as a list with scores
2. Can compare names side-by-side
3. Can re-check any saved name (availability may have changed)
4. Can remove names from portfolio

---

## States

### App States
| State | What's Happening | What the User Sees |
|-------|-----------------|-------------------|
| `idle` | No search yet | Command bar with placeholder, empty results area |
| `checking` | Search in progress | Command bar shows name, results stream in layer by layer |
| `results` | Check complete | Full results with verdict, score, and layer breakdown |
| `generating` | AI generating names | Loading state with progress message |
| `suggestions` | AI names ready | List of suggested names with quick scores |
| `portfolio` | Viewing saved names | List view of saved names with scores and actions |
| `error` | Something went wrong | Error message with retry option |

### Per-Check Confidence States
| State | Visual | Meaning |
|-------|--------|---------|
| `confirmed` | Solid green/red | Verified from authoritative source |
| `high` | Green/red with slight opacity | Strong signal, high confidence |
| `unconfirmed` | Grey with "?" icon | Couldn't verify — tried but blocked/timeout |
| `not_checked` | Dim with "—" | Not in coverage — transparent about gaps |

---

## UI Structure (BakeKit Components)

```
┌──────────────────────────────────────────┐
│  Header: Logo + "Naim" + mode toggle     │
├──────────────────────────────────────────┤
│                                          │
│  <bk-command-bar>                        │
│   "Check a name..."                      │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  <bk-results-panel>                      │
│                                          │
│   ┌─ The Verdict ──────────────────────┐ │
│   │ brightpath — 8.2/10               │ │
│   │ Strong candidate. .com available.  │ │
│   │ [Save to portfolio]               │ │
│   └────────────────────────────────────┘ │
│                                          │
│   <bk-section label="DOMAINS">           │
│     <bk-action-item> .com ✓            │ │
│     <bk-action-item> .io ✓             │ │
│     <bk-action-item> .co.uk ✗          │ │
│   </bk-section>                          │
│                                          │
│   <bk-section label="SOCIAL">            │
│     <bk-action-item> Instagram ✗       │ │
│     <bk-action-item> TikTok ✓          │ │
│     <bk-action-item> X ✓               │ │
│   </bk-section>                          │
│                                          │
│   <bk-section label="COMPANY">           │
│     <bk-action-item> UK — taken        │ │
│   </bk-section>                          │
│                                          │
│   <bk-section label="TRADEMARK">         │
│     <bk-action-item> Low risk          │ │
│   </bk-section>                          │
│                                          │
│   <bk-section label="APP STORES">        │
│     <bk-action-item> Apple — taken     │ │
│     <bk-action-item> Google — taken    │ │
│   </bk-section>                          │
│                                          │
│  </bk-results-panel>                     │
│                                          │
├──────────────────────────────────────────┤
│  Footer: Portfolio (3) | Generate | Help │
└──────────────────────────────────────────┘
```

### Component Mapping
| UI Element | BakeKit Component | Notes |
|-----------|------------------|-------|
| Search bar | `<bk-command-bar>` | Primary input, status dot shows checking state |
| Results container | `<bk-results-panel>` | Streams results as they arrive |
| Layer sections | `<bk-section>` | One per checking layer |
| Individual results | `<bk-action-item>` | Platform/TLD name + status icon |
| Portfolio modal | `<bk-modal>` | Saved names list |

---

## Behavioural Rules

### Checking
1. All five layers check in parallel — never sequential
2. Results display as they arrive — don't wait for all layers
3. Domain checks complete first (~100ms), social next (~500ms), company/trademark/app store last (~1-3s)
4. Score calculates progressively — updates as each layer completes
5. Cache results: domains 1hr, social 10min, company 24hr, trademark 24hr

### Confidence
1. Never show "available" unless we have positive confirmation
2. "Unconfirmed" is always preferable to a wrong answer
3. Show confidence level on every individual result
4. The score factors in confidence — unconfirmed results lower the score slightly

### AI Features
1. Name generation uses local Ollama — no external API cost
2. AI verdict/scoring can be done locally or via API (configurable)
3. AI alternatives are only generated on user request (not automatic) — cost control
4. Generated names are immediately checked across all layers before being shown

### Portfolio
1. Saved names persist to local JSON (v1) — database later
2. Portfolio is per-user (v1 is single-user, multi-user later)
3. Re-checking updates the stored result and score

### White-Label
1. All colours come from BakeKit tokens — never hardcoded
2. Product name, logo, and branding come from config.json
3. Switching theme changes everything — no code changes needed

---

## Config Schema

```json
{
  "meta": {
    "name": "Naim",
    "icon": "🔍",
    "version": "2.0.0",
    "description": "Check whether a name is truly yours to take — everywhere",
    "tagline": "One name. Every channel. Full picture."
  },
  "checking": {
    "domains": {
      "enabled": true,
      "tlds": [".com", ".co.uk", ".io", ".ai", ".co", ".app", ".dev"]
    },
    "social": {
      "enabled": true,
      "platforms": ["instagram", "tiktok", "x", "youtube", "linkedin", "github", "reddit", "threads", "bluesky", "pinterest"]
    },
    "company": {
      "enabled": true,
      "jurisdictions": ["uk"]
    },
    "trademark": {
      "enabled": true,
      "databases": ["uspto"]
    },
    "appstore": {
      "enabled": true,
      "stores": ["apple", "google"]
    }
  },
  "ai": {
    "enabled": true,
    "provider": "ollama",
    "model": "llama3.2:3b",
    "endpoint": "http://localhost:11434/api/generate"
  },
  "scoring": {
    "weights": {
      "domains": 0.30,
      "social": 0.25,
      "company": 0.20,
      "trademark": 0.15,
      "appstore": 0.10
    }
  }
}
```

---

## API Endpoints

| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/` | GET | Serve the app | — | HTML |
| `/check` | POST | Run full five-layer check | `{ name, context?, jurisdiction? }` | Check Result (streamed) |
| `/generate` | POST | AI name generation | `{ description, seeds?, count? }` | `{ names: [{ name, quickScore }] }` |
| `/portfolio` | GET | Get saved names | — | `{ names: [Saved Name] }` |
| `/portfolio` | POST | Save a name | `{ name, result, notes? }` | `{ saved: true }` |
| `/portfolio/:name` | DELETE | Remove a name | — | `{ removed: true }` |
| `/config` | GET | Get product config | — | Config JSON |

---

## Build Priorities (MVP)

### Must Have (v2.0)
- [ ] BakeKit integration (tokens, components, config-driven)
- [ ] Command bar search interface
- [ ] Domain checking (7 TLDs)
- [ ] Social handle checking (10 platforms)
- [ ] Companies House check (UK)
- [ ] Brand Readiness Score (composite)
- [ ] The Verdict (AI summary)
- [ ] Save to portfolio
- [ ] Progressive result streaming
- [ ] Confidence indicators on all results
- [ ] Dark/light mode via BakeKit

### Should Have (v2.1)
- [ ] AI name generation (Ollama)
- [ ] AI alternatives engine
- [ ] Trademark checking (USPTO)
- [ ] App store checking
- [ ] Portfolio comparison view
- [ ] PDF report export

### Could Have (v2.2)
- [ ] Availability monitoring (alerts)
- [ ] Team collaboration
- [ ] Additional jurisdictions (Delaware, California)
- [ ] White-label configuration

### Won't Have (v2 scope)
- Payment processing
- User authentication (single-user for now)
- Real-time collaborative editing
