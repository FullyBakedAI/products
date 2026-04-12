/**
 * BakeKit Motion Tokens — JS equivalent of --bk-motion-* CSS custom properties.
 *
 * These feed directly into Framer Motion. Override this file per product
 * to change the motion personality (snappy, calm, playful, etc.)
 *
 * CSS transitions (hover states, colour changes) use --bk-motion-* from tokens.css.
 * Framer Motion animations use these JS tokens.
 *
 * To theme: import and spread-override, or replace this file entirely.
 *
 * ── Usage map ────────────────────────────────────────────────────────────────
 *
 *   motion.fade    → HomeScreen (main + stagger), ExploreScreen (main + stagger)
 *   motion.modal   → SwapScreen, SendScreen, ReceiveScreen (full-screen modal entry)
 *   motion.sheet   → bottom sheet overlays (token select, confirm sheets)
 *   motion.spring  → swap arrow rotate, toggles, reversible state changes
 *   motion.springTight → token pill appear, ReceiveScreen QR pop-in
 *   motion.cta     → SwapScreen CTA label crossfade (AnimatePresence mode="wait")
 *   motion.valueUpdate → portfolio value count-up, receive amount flash
 *
 * ── Pattern ──────────────────────────────────────────────────────────────────
 *
 *   Screen entry (fade):
 *     initial={{ opacity: 0, y: 12 }}
 *     animate={{ opacity: 1, y: 0, transition: m.fade.enter }}
 *
 *   Screen entry (modal):
 *     initial={{ opacity: 0, y: m.modal.offsetEnter }}
 *     animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
 *     exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
 *
 *   Staggered children (add delay offset per index):
 *     animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.06 + i * 0.05 } }}
 */

export const motion = {

  // ── Screen transitions ───────────────────────────────────────────────
  // Fade — tab screens (Home, Explore)
  fade: {
    enter: { duration: 0.18, ease: 'easeOut' },
    exit:  { duration: 0.12, ease: 'easeIn'  },
  },

  // Modal — full-screen overlays (Swap, Send, Receive) slide up
  // Spring physics match native iOS modal presentation feel
  modal: {
    enter: { type: 'spring', damping: 28, stiffness: 320, mass: 0.75 },
    exit:  { duration: 0.18, ease: [0.4, 0, 1, 1] },
    offsetEnter: 64, // px Y offset for enter
    offsetExit:  24, // px Y offset for exit
  },

  // Sheet — bottom sheet (token select) spring
  sheet: {
    enter: { type: 'spring', damping: 30, stiffness: 280, mass: 0.8 },
    exit:  { duration: 0.18, ease: [0.4, 0.0, 1, 1] },
  },

  // ── Component springs ────────────────────────────────────────────────
  // Standard spring — swap arrow, toggles
  spring: {
    type: 'spring', damping: 18, stiffness: 260, mass: 0.6,
  },

  // Tight spring — token pill appear, small element pops
  springTight: {
    type: 'spring', damping: 22, stiffness: 340, mass: 0.5,
  },

  // ── Micro-interactions ───────────────────────────────────────────────
  // CTA label crossfade
  cta: {
    enter: { duration: 0.14, ease: 'easeOut' },
    exit:  { duration: 0.10, ease: 'easeIn'  },
  },

  // Value update flash (receive amount, portfolio value)
  valueUpdate: {
    duration: 0.16, ease: 'easeOut',
  },

  // Token pill appear (when token selected in swap)
  tokenAppear: {
    type: 'spring', damping: 20, stiffness: 300, mass: 0.5,
  },
};

// ── Tap scale tokens ────────────────────────────────────────────────────────
// Use these for whileTap={{ scale: tap.X }} to keep press feedback consistent.
export const tap = {
  default: 0.96,  // standard buttons, pills, tabs
  card:    0.97,  // card-level rows, token rows, swipeable rows
  heavy:   0.90,  // large CTAs, action tiles, action bars
  numpad:  0.82,  // numpad keys
};

// ── Stagger delay tokens ─────────────────────────────────────────────────────
// Use: delay: stagger.base + i * stagger.perItem
export const stagger = {
  base:    0.06,
  perItem: 0.05,
};

// ── Toast animation token ────────────────────────────────────────────────────
// For UndoToast and any top-of-screen notification toasts.
export const toast = {
  initial: { y: -56, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { y: -56, opacity: 0, transition: { duration: 0.16 } },
};
