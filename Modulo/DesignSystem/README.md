# Modulo Design System

An agentic design system — structured for designers, developers, and AI agents alike.

## Philosophy

> Focus on creating the foundations, constraints, and contexts that enable good experiences
> to emerge, rather than crafting every detail yourself.

This is not a style guide. It's a constraint system. The goal is that anyone — human or agent — given these files produces on-brand, high-quality Modulo UI without needing design review of every decision.

## Files

| File | Purpose |
|------|---------|
| `foundations.md` | Token system, typography, spacing — the raw materials |
| `constraints.md` | Hard rules and strong defaults — what's allowed and not |
| `contexts.md` | User situations that drive design decisions |
| `agent-context.md` | Assembled prompt blocks — paste into any AI tool |

## How to use

**Starting a new build session:**
Paste the full system prompt from `agent-context.md` into your AI tool or Cursor session.

**Building a specific screen type:**
Add the relevant context block (Reviewing, Deciding, Confirming, Discovering) from `agent-context.md`.

**Checking a design decision:**
If unsure, check `constraints.md` first, then `contexts.md` for the appropriate pattern.

**Adding a new token:**
Update `foundations.md` first, then the CSS in `src/tokens.css`, then `agent-context.md`.

## Live Design System

The interactive design system (token editor, component showcase, agent brief) runs at:
`[tunnel-url]/modulo/#/ds`

It reads from the same `--bk-*` token system defined here.
