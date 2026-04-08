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
 */

export const motion = {

  // ── Screen transitions ───────────────────────────────────────────────
  // Fade — tab screens (Home, Explore)
  fade: {
    enter: { duration: 0.18, ease: 'easeOut' },
    exit:  { duration: 0.12, ease: 'easeIn'  },
  },

  // Modal — full-screen overlays (Swap, Send, Receive) slide up
  modal: {
    enter: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] },
    exit:  { duration: 0.15, ease: 'easeIn' },
    offsetEnter: 48, // px Y offset for enter
    offsetExit:  32, // px Y offset for exit
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
