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
import { ChevronDown } from 'lucide-react';
import './styles.css';

const MotionButton = motion.create(Button);

export function TokenPill({ token, onPress, appear = false }) {
  return (
    <MotionButton
      className={`token-pill${appear ? ' appear' : ''}`}
      aria-label={`Selected token: ${token.name}, tap to change`}
      whileTap={{ scale: 0.93 }}
      onPress={onPress}
    >
      <span className="token-pill-icon">
        <img src={token.icon} alt="" width="22" height="22" />
      </span>
      <span className="token-pill-name">{token.name}</span>
      <ChevronDown
        size={13}
        color="var(--bk-text-muted)"
        strokeWidth={1.5}
        className="token-pill-chevron"
        aria-hidden="true"
      />
    </MotionButton>
  );
}
