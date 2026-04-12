# Preset scopes

These files define named product scopes for the Modulo prototype. Each preset is a JSON file that controls which features are active in the prototype — no code changes required.

## How presets work

- Each preset file contains a `features` object that overrides the app's `defaultFeatures`
- `"features": null` means all features are on (uses `defaultFeatures` as-is — the Full Product state)
- Partial objects are deep-merged: you only need to specify what differs from the default

## The presets

| File | What it shows |
|------|--------------|
| `mvp.json` | Core product — 1 asset (Bitcoin), swap only, no portfolio chart, no autopilot |
| `phase-2.json` | Adds lending, autopilot tab, live yield counter, 5-asset portfolio |
| `full-product.json` | Everything on — the complete product vision |

## Using presets in the prototype

The MVP Builder panel (⚡ Build button, bottom-right of the prototype) loads these presets by name. Switch between them instantly to show different product scopes during demos.

You can also create custom presets from the Build panel and download them as JSON — commit them here.

## Version-controlling scope decisions

**Commit these files.** Your git history becomes a timestamped record of product scope decisions:

- When did the client agree to include lending? Check the commit that updated `phase-2.json`.
- What was the MVP scope at sign-off? Check the git blame on `mvp.json`.

This is the "Progressive Feature Disclosure" pattern from the Fully Baked methodology: ship a scoped MVP, expand via presets, and version-control every scope change. The preset files are the contract between design and development at each phase.

## Adding a new preset

1. Use "Save preset" in the Build panel to download a JSON file
2. Rename it sensibly (e.g. `phase-3.json`)
3. Commit it to this folder with a message explaining the scope change
4. Share the URL with the team — they can load it by importing into `FeaturePanel.jsx`
