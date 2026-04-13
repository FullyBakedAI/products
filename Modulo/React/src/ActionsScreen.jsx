/**
 * ActionsScreen — bottom sheet action hub
 *
 * Rendered as an overlay from ActionsContext (not a route).
 * Previous screen stays mounted and visible behind the backdrop.
 *
 * Tabs: Swap | Trade | Lend & Borrow | Deposit
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { useActions } from './ActionsContext';
import { useFeatures } from './theme/FeatureConfig';
import SwapTab       from './tabs/SwapTab';
import TradeTab      from './tabs/TradeTab';
import LendBorrowTab from './tabs/LendBorrowTab';
import DepositTab    from './tabs/DepositTab';
import './actions.css';

const IconX = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TABS = [
  { id: 'swap',    label: 'Swap' },
  { id: 'trade',   label: 'Trade' },
  { id: 'lend',    label: 'Lend' },
  { id: 'deposit', label: 'Deposit' },
];

export default function ActionsScreen({ variant }) {
  const f = useFeatures();
  const isPanel = variant === 'panel';
  const { closeActions, tab: initialTab, isOpen } = useActions();
  const visibleTabs = TABS.filter(t => f.actions[t.id]);
  const [activeIdx, setActiveIdx] = useState(0);
  const closeButtonRef   = useRef(null);   // MOD-002
  const previousFocusRef = useRef(null);   // MOD-002

  // Sync tab whenever the sheet opens or the requested tab changes
  useEffect(() => {
    const i = visibleTabs.findIndex(t => t.id === initialTab);
    setActiveIdx(i >= 0 ? i : 0);
  }, [initialTab, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // MOD-002 — focus management on open/close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      closeButtonRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  const active = (visibleTabs[activeIdx] ?? visibleTabs[0])?.id;

  return (
    <div className={isPanel ? 'actions-panel-root' : 'actions-overlay'} role="dialog" aria-modal="true" aria-label="Actions">

      {/* Dark backdrop — tap to dismiss (mobile overlay only) */}
      {!isPanel && (
        <motion.div
          style={{ flex: 1, display: 'flex' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.18 } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
        >
          <Button
            className="actions-backdrop"
            aria-label="Close actions"
            onPress={closeActions}
          />
        </motion.div>
      )}

      {/* Sheet with drag-to-dismiss (mobile) or static panel (desktop) */}
      <motion.div
        className="actions-sheet"
        drag={isPanel ? false : 'y'}
        dragConstraints={isPanel ? undefined : { top: 0 }}
        dragElastic={isPanel ? undefined : { top: 0, bottom: 0.3 }}
        onDragEnd={isPanel ? undefined : ((_, info) => { if (info.offset.y > 80) closeActions(); })}
        initial={isPanel ? undefined : { y: '100%' }}
        animate={isPanel ? undefined : { y: 0, transition: m.sheet.enter }}
        exit={isPanel ? undefined : { y: '100%', transition: m.sheet.exit }}
      >
        {/* Drag handle (mobile only) */}
        {!isPanel && (
          <div className="drag-handle" aria-hidden="true">
            <div className="drag-handle-pill" />
          </div>
        )}

        {/* Header row — tabs + close button */}
        <div className="actions-header-row">
          <div className="actions-tab-strip" role="tablist" aria-label="Action type">
            {visibleTabs.map((t, i) => (
              <Button
                key={t.id}
                className={`actions-tab-pill${activeIdx === i ? ' active' : ''}`}
                role="tab"
                aria-selected={activeIdx === i}
                onPress={() => setActiveIdx(i)}
              >
                {t.label}
              </Button>
            ))}
          </div>
          <Button
            ref={closeButtonRef}
            className="close-btn-shared"
            aria-label="Close"
            onPress={closeActions}
          >
            <IconX size={16} />
          </Button>
        </div>

        {/* Tab content */}
        <div className="actions-scroll">
          {active === 'swap'    && <SwapTab />}
          {active === 'trade'   && <TradeTab />}
          {active === 'lend'    && <LendBorrowTab />}
          {active === 'deposit' && <DepositTab />}
        </div>
      </motion.div>
    </div>
  );
}
