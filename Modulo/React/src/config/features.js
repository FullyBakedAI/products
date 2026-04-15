/**
 * Modulo Feature Configuration
 * ─────────────────────────────
 * Toggle features on/off for your build. Change these values to customise
 * what appears in the app. No code changes required — just edit this file.
 *
 * White-label clients: copy this file to client-config/features.js and
 * import from there instead.
 */
export const defaultFeatures = {
  // ── Navigation ──────────────────────────────────────────────────────
  nav: {
    home:       true,
    explore:    true,
    activity:   true,
    autopilot:  true,
    fab:        true,   // floating action button (+ in nav bar)
    manage:     true,   // MOD-097: Funds tab in bottom nav
  },

  // ── Home screen sections ─────────────────────────────────────────────
  home: {
    portfolioChart:   true,   // chart + time period selector
    liveYield:        true,   // pulsing live yield counter on balance
    smartNudges:      true,   // horizontal nudge card scroll
    autopilotCard:    true,   // inline autopilot toggle card
    optimisePromo:    true,   // "put it all to work" promo card
    assetLimit:       null,   // null = all, or number (e.g. 5) = cap list
  },

  // ── Features ──────────────────────────────────────────────────────────
  notifications:    true,
  walletConnection: false,  // skip wallet gate — show swap screen directly
  undoToast:        true,   // undo toast after transactions

  // ── Actions sheet tabs ────────────────────────────────────────────────
  actions: {
    swap:    true,
    trade:   true,
    lend:    true,
    stake:   true,
  },

  // ── DeFi features ────────────────────────────────────────────────────
  defi: {
    priceImpact:     true,   // dynamic price impact warning
    slippageWarning: true,   // high-impact trade acknowledgement
    healthFactor:    true,   // health factor tooltip in borrow tab
    tokenApproval:   true,   // ERC-20 approval step in ReviewScreen
    transactionDeadline: true, // "expires in X min" on ReviewScreen
  },
};
