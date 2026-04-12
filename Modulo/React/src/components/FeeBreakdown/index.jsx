/**
 * FeeBreakdown — Expandable fee breakdown
 *
 * Replaces single fee line with itemised breakdown.
 * Collapsed by default; tapping expands with smooth animation.
 *
 * Props:
 * - total: string — e.g. "$3.28"
 * - items: array of { label: string, amount: string }
 * - className: string (optional)
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from '../../motion-tokens';
import { Button } from 'react-aria-components';
import './styles.css';

const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function FeeBreakdown({ total, items = [], className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fee-breakdown-root ${className}`}>
      <Button
        className="fee-breakdown-toggle"
        onPress={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        aria-controls="fee-breakdown-items"
        aria-label={`Total fees: ${total}. ${isOpen ? 'Collapse' : 'Expand'} fee breakdown`}
      >
        <span className="fee-breakdown-label">Total fees</span>
        <div className="fee-breakdown-right">
          <span className="fee-breakdown-total">{total}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ type: 'spring', damping: 18, stiffness: 300 }}
            style={{ display: 'flex', color: 'var(--bk-text-muted)' }}
          >
            <IconChevron />
          </motion.span>
        </div>
      </Button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="fee-breakdown-items"
            className="fee-breakdown-items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
            style={{ overflow: 'hidden' }}
            role="list"
          >
            {items.map((item, i) => (
              <div
                key={i}
                className={`fee-breakdown-item${i === items.length - 1 ? ' fee-breakdown-item--last' : ''}`}
                role="listitem"
              >
                <span className="fee-breakdown-item-label">{item.label}</span>
                <span className="fee-breakdown-item-amount">{item.amount}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
