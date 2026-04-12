# client-config

This folder contains client-specific configuration for the Modulo prototype.

Files here are overrides — they let you customise the app's brand and feature set without touching any of the core codebase. If you need to hand the prototype to a new client or adjust what's visible in a demo, this is the only folder you need to touch.

## What goes here

- **Brand config** — logo, brand name, and identity details. See `brand.example.js`.
- **Feature flags** — turn screens and features on or off. See `features.example.js`.

## How to use these files

1. Copy the relevant example file to the location shown in its header comment.
2. Edit the values to match your requirements.
3. Run `npm run dev` — the changes take effect immediately.

Changes to these files do not affect the core application code. They are safe to modify and share with clients.

## Presets — version-controlled product scopes

The `presets/` folder contains named product scopes as JSON files. Each preset defines which features are active, making it easy to show a scoped MVP, a Phase 2 build, or the full product vision in a demo.

See `presets/README.md` for the full version-control pattern.

The **⚡ Build** button in the prototype loads these presets by name. You can also create custom presets from the Build panel and commit the downloaded JSON here — your git history becomes a record of product scope decisions over time.
