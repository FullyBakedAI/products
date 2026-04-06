# Products

Product construction repo for FullyBakedAI. Shared across machines via git — used by both human sessions (MacBook) and Frank (Mac Studio).

## Structure

Each product gets its own top-level folder (e.g. `Modulo/`). Inside each:
- `Kickoff/` — initial briefs and kickoff docs
- `Personas/` — user personas
- `Discovery/` — research and findings
- `ProductBrief/` — the product brief
- `Prototype/` — HTML prototypes
- Design system docs, context files, etc.

## Workflow

- Push when you're done working, pull when you start
- No auto-sync hooks — manual git only
- This repo is NOT the OpenClaw workspace — never symlink or merge them

## For Frank

Product files live at `~/products` on the Mac Studio. Reference them read-only — don't commit from agent sessions.
