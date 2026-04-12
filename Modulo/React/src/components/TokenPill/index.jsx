/**
 * TokenPill — White-Label Component
 *
 * Interactive button representing a cryptocurrency token.
 * Consolidates .token-pill-btn pattern used in swap, actions, send screens.
 *
 * Props:
 * - token: { id, name, icon } — Token data
 * - onPress: function — Press handler (e.g., navigate to token selector)
 * - appear: boolean (optional) — Play appear animation on mount
 *
 * React ARIA: Button with onPress, motion.create for tap animation
 */

import { Button } from 'react-aria-components';
import { motion } from 'framer-motion';
import { tap } from '../../motion-tokens';
import './styles.css';

const MotionButton = motion.create(Button);

const IconChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function TokenPill({ token, onPress, appear = false }) {
  return (
    <MotionButton
      className={`token-pill${appear ? ' appear' : ''}`}
      aria-label={`Selected token: ${token.name}, tap to change`}
      whileTap={{ scale: tap.default }}
      onPress={onPress}
    >
      <span className="token-pill-icon">
        <img src={token.icon} alt="" width="22" height="22" />
      </span>
      <span className="token-pill-name">{token.name}</span>
      <IconChevronDown />
    </MotionButton>
  );
}
