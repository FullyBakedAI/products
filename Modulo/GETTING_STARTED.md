# Getting Started — Modulo Prototype

Welcome to the Modulo prototype. This is a working React application that demonstrates the full Modulo DeFi experience: portfolio overview, cross-chain swaps, markets browser, activity feed, and automated strategy (Autopilot). It's built to feel like a real product, not a mockup.

This guide will get you up and running in minutes.

---

## Quick start in 3 steps

**1. Install dependencies**
```
npm install
```

**2. Start the app**
```
npm run dev
```

**3. Open your browser**

Visit `http://localhost:5173`. The app loads in a mobile frame by default. Resize your browser to see the desktop layout.

That's it. No environment variables, no API keys, no backend required.

---

## What this prototype is

The Modulo prototype is a high-fidelity, interactive front-end built to explore and validate the product experience. All data is simulated — there is no live blockchain connection. This is intentional: the goal is to focus on UX flows and product decisions, not infrastructure.

The prototype covers:

- **Home** — portfolio overview with cross-chain balances and performance summary
- **Markets** — rates browser across protocols and chains
- **Swap** — cross-chain token swap with live rate preview and review flow
- **Send / Receive** — token transfer flows
- **Activity** — transaction history
- **Autopilot** — automated strategy screen (risk tolerance, notifications, pause/resume)
- **Manage** — fund management and position controls
- **Settings** — app preferences
- **Desktop layout** — a full two-panel layout that activates automatically on wider screens

---

## Configuring the prototype

Two files control everything you'd want to change without touching the core code.

### Brand configuration — `src/theme/BrandConfig.jsx`

This file controls the logo and brand name shown throughout the app. To white-label the prototype:

1. Add your logo file to `src/assets/`
2. Edit `src/theme/BrandConfig.jsx` and update the `defaultConfig` object:

```js
const defaultConfig = {
  logoSrc: logoModulo,     // import your logo file here
  logoAlt: 'Your Brand',  // alt text for the logo image
  logoWidth: 93,           // logo display width in pixels
  logoHeight: 18,          // logo display height in pixels
  brandName: 'Your Brand', // brand name used in text throughout the app
};
```

See `client-config/brand.example.js` for a ready-to-use template.

### Feature flags — `src/config/features.js`

This file (once created — see `client-config/features.example.js`) lets you toggle sections of the app on or off without editing any screen code. Use it to scope the demo to the features most relevant to your team.

See `client-config/features.example.js` for the full list of available flags with plain-English explanations.

---

## Deploying to Vercel

The app deploys to Vercel in one command. Make sure you have the [Vercel CLI](https://vercel.com/docs/cli) installed (`npm i -g vercel`), then from the `React/` folder:

```
vercel
```

Vercel will detect the Vite configuration automatically. Accept the defaults. Your prototype will be live at a `vercel.app` URL within a minute or two.

To redeploy after changes:

```
vercel --prod
```

---

## Project structure (for reference)

```
React/
  src/
    theme/
      BrandConfig.jsx     ← brand / white-label config
    config/
      features.js         ← feature flags (create from client-config/features.example.js)
    assets/               ← logo and image assets
    tokens.css            ← BakeKit design tokens (colours, spacing, typography)
    shared.css            ← global styles
    App.jsx               ← app entry point and routing
```

---

## Questions?

Reach us at **hello@bakedux.com** — we're happy to walk through the prototype with your team, answer questions, or scope next steps.
