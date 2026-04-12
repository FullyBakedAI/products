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
