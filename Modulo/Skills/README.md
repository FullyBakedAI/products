# Modulo Agentic Design System

Structured for designers, developers, and AI agents alike.

> Focus on creating the foundations, constraints, and contexts that enable good experiences
> to emerge, rather than crafting every detail yourself.

## Files — Load when

Scan this table before loading any file. Only load what's relevant to the current task.

| File | Load when |
|------|-----------|
| `agent-context.md` | Starting any Modulo build session — entry point, references everything else |
| `tokens.md` | Writing CSS, checking colour/spacing/motion values, visual QA, token compliance review |
| `components.md` | Building a screen, extracting components, reviewing screen structure, React ARIA or motion work |
| `constraints.md` | Making design/interaction decisions, reviewing output for compliance, checking what's permitted |
| `contexts.md` | Building a specific screen type, writing agent prompts, making layout/density decisions |
| `foundations.md` | Typography/spacing decisions, dark-first baseline, reviewing visual consistency |
| `qa-checklist.md` | Before any submit, commit, or handoff |

## How to use

**Starting a new build session:**
Read `agent-context.md` — it's the assembled entry point.

**Building a specific screen:**
Load `components.md` for structure + `contexts.md` for the screen's user context.

**Checking a design decision:**
Load `constraints.md` first. Add `contexts.md` if the decision is screen-specific.

**Before submitting:**
Run through every item in `qa-checklist.md`.

## The Goal

Everything feeds into a **reusable React ARIA component library**. Every screen is an opportunity to extract shared patterns. Don't just build screens — build the system.

## See also

- [[Platform/Modulo/STATUS]] — current Modulo build status
- [[bakekit|BakeKit]] — the design system this skills set is based on
- [[005b-component-primitives-react-aria]] — React ARIA ADR
