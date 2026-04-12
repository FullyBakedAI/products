// ── Modulo Feature Flags ──────────────────────────────────────────────────────
// Copy this file to src/config/features.js to activate it.
//
// Turn features on (true) or off (false) to customise your build.
// No code changes required — just edit these values and save.
//
// Changes take effect immediately in development (npm run dev).

export const defaultFeatures = {

  // ── Navigation ─────────────────────────────────────────────────────────────
  // Controls which items appear in the bottom navigation bar.

  nav: {
    home:      true,   // Main portfolio screen — always recommended
    explore:   true,   // Markets browser — rates and yields across protocols
    activity:  true,   // Transaction history
    autopilot: true,   // Automated strategy screen — set false if not demoing this
    fab:       true,   // The + action button in the centre of the nav bar
  },

  // ── Home screen ────────────────────────────────────────────────────────────

  home: {
    portfolioChart:   true,   // Balance trend line on the home screen
    smartNudges:      true,   // Contextual prompts (e.g. "Rates are up — consider rebalancing")
    chainBreakdown:   true,   // Per-chain balance pills below the total
    performanceBadge: true,   // 24h performance indicator on the portfolio card
  },

  // ── Swap flow ──────────────────────────────────────────────────────────────

  swap: {
    enabled:       true,   // The swap screen itself — turn off to hide the flow entirely
    crossChain:    true,   // Cross-chain swap option (source and destination on different chains)
    rateComparison: true,  // "Best rate" comparison row on the swap screen
    review:        true,   // Confirmation / review screen before executing
  },

  // ── Autopilot ──────────────────────────────────────────────────────────────
  // Automated strategy feature — turn this whole section off if demoing
  // a simpler scope that doesn't include automation.

  autopilot: {
    enabled:          true,   // Autopilot screen and entry points
    riskSelector:     true,   // Risk tolerance slider (Conservative / Balanced / Aggressive)
    activityFeed:     true,   // Recent autopilot actions feed
    notifications:    true,   // Notification preferences toggle
    simulate:         true,   // "Simulate strategy" screen — shows projected outcomes
    achievements:     true,   // Milestone badges and achievements
  },

  // ── Explore / Markets ──────────────────────────────────────────────────────

  explore: {
    enabled:      true,   // Markets browser screen
    yieldRates:   true,   // APY / yield rate column in the markets table
    chainFilter:  true,   // Chain filter pills at the top of the markets list
    protocolBadge: true,  // Protocol logo badges on each row
  },

  // ── Activity ───────────────────────────────────────────────────────────────

  activity: {
    enabled:     true,   // Transaction history screen
    filterTabs:  true,   // Filter by type (All / Swaps / Sends / Autopilot)
    statusBadge: true,   // Pending / confirmed / failed status on each row
  },

  // ── Manage / Funds ─────────────────────────────────────────────────────────

  manage: {
    enabled:     true,   // Manage funds screen
    optimise:    true,   // "Optimise" flow — rebalance suggestions
    undoToast:   true,   // Undo toast notification after destructive actions
  },

  // ── Settings ───────────────────────────────────────────────────────────────

  settings: {
    enabled:        true,   // Settings screen
    notifications:  true,   // Notification preferences section
    currency:       true,   // Display currency selector
    devMode:        false,  // Developer tools overlay — keep false for client demos
  },

};
