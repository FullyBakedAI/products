# Modulo Agentic Design System

Structured for designers, developers, and AI agents alike.

> Focus on creating the foundations, constraints, and contexts that enable good experiences
> to emerge, rather than crafting every detail yourself.

## Files

### For building (read these first)
| File | Purpose |
|------|---------|
| `tokens.md` | Every `--bk-*` token with values — the source of truth |
| `components.md` | Screen structure, shared components, extraction targets, React ARIA, motion, accessibility |
| `qa-checklist.md` | Pre-submit verification checklist |

### For design decisions
| File | Purpose |
|------|---------|
| `foundations.md` | Typography, spacing, dark-first principles |
| `constraints.md` | Hard rules and strong defaults — what's allowed and not |
| `contexts.md` | User situations that drive design decisions (reviewing, deciding, confirming, etc.) |

### For AI agents
| File | Purpose |
|------|---------|
| `agent-context.md` | Assembled prompt block — paste into any AI tool to start a build session |

## How to use

**Starting a new build session:**
Read `agent-context.md` for the full system prompt, then read the files it references.

**Building a specific screen:**
Check `components.md` for the screen structure template and shared components. Add the relevant context from `contexts.md`.

**Checking a design decision:**
Check `constraints.md` first, then `contexts.md` for the appropriate pattern.

**Before submitting:**
Run through every item in `qa-checklist.md`.

## The Goal

Everything feeds into a **reusable React ARIA component library**. Every screen is an opportunity to extract shared patterns. Don't just build screens — build the system.
