# Modulo — Engagement Kickoff
**Date:** 2026-04-04
**Prepared by:** Peggy (BakedUX engagement agent)
**Engagement lead:** Ant (Sawfinger / Anthony) — BakedUX

---

## What is Modulo?

Modulo (modulo.finance) is a cross-chain DeFi platform. Tagline: "One vault, every chain."

The product solves DeFi fragmentation — today, using assets like BTC or XRP in DeFi requires bridging, wrapping, swapping, acquiring gas tokens, and managing multiple wallets. Modulo collapses this into a single interface with native asset support, one-click borrowing against entire portfolios, and passkey-based authentication.

Current state: early stage, waitlist model, primarily interest-generation. The product needs significant design work — the team has been let down by developers multiple times.

**Founders:** Anthony Merriman (known from Talos). Ant is an investor and design advisor.

---

## Why BakedUX is here

Ant's role: give Modulo product direction and vision. This is not a visual polish pass — it's a product definition engagement.

**The deliverable:** A working frontend framework Modulo can build on. Not a spec document. Not a mockup. A live, maintainable, accessible UI layer they can extend.

**The pipeline:**
1. Discovery → Personas → Product testing
2. Product team (PM/Designer/Dev) defines what to build
3. Agentic design system extraction from Figma designs
4. Accessible component library (React Aria primitives)
5. Prototype → production-quality frontend
6. Documentation for all to use
7. Learnings feed back into Fully Baked framework

---

## What we have

- **Live site:** modulo.finance — early marketing/waitlist
- **Figma file:** "First steps" — 3 pages: Page 1 (desktop dashboard), Webapp, Mobile
  - Mobile page has 6 screens: Portfolio, Receive, Swap, Select Token, Select Recipient, Browse
  - Dark theme, purple accent (#6b5fff), mobile-first
- **Initial prototype:** Built quickly (skip — treat as reference sketch only)

---

## Target market hypothesis (to be validated)

Modulo targets **$2 trillion in sidelined crypto assets** — holders of BTC, XRP, DOGE, SOL who can't easily access DeFi. Three user types:
- **Crypto holders who've never used DeFi** — have assets, want yield, intimidated by complexity
- **Active DeFi users** — already in the ecosystem, want better cross-chain UX
- **Institutions** — need liquidity against native assets, professional tooling

---

## Per-agent responsibilities

### Persona Agents (run first)
- Read this brief
- Embody your persona fully
- Evaluate the existing modulo.finance site AND the mobile designs
- Report: what works, what confuses, what's missing, would you use this?
- Output to `Discovery/persona-findings-[name].md`

### Product Team Agents (run after persona findings)
- Read persona findings
- Define: what screens to build, in what order, with what content
- Output to `ProductBrief/product-brief.md`

### Design System Agent (run after product brief)
- Extract tokens, components, patterns from Figma + persona findings
- Output to `DesignSystem/system.md`

### Build Agent (run after design system)
- Implement accessible components (React Aria)
- Document everything
- Output working code to `Frontend/`

---

## Blockers

| Blocker | Owner | Status |
|---------|-------|--------|
| Figma MCP not configured on server | Ant | Pending — SSH/settings.json fix needed |
| SSH not enabled on server | Ant | Pending |

---

## Response required

Each agent must respond to this kickoff before proceeding with their phase. Response = file on disk in their output directory confirming they've read it and stating their first action.

## See also

- [[Platform/Modulo/STATUS]] — Modulo build status
- [[bakekit|BakeKit]] — design system Modulo is built on
- [[overview]] — Fully Baked methodology
