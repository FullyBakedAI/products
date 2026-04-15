/**
 * ActionsScreen — bottom sheet action hub
 *
 * Rendered as an overlay from ActionsContext (not a route).
 * Previous screen stays mounted and visible behind the backdrop.
 *
 * Tabs: Swap | Trade | Lend & Borrow | Stake
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'react-aria-components';
import { useActions } from './ActionsContext';
import { useFeatures } from './theme/FeatureConfig';
import SwapTab       from './tabs/SwapTab';
import TradeTab      from './tabs/TradeTab';
import LendBorrowTab from './tabs/LendBorrowTab';
import StakeTab      from './tabs/StakeTab';
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
  { id: 'stake',   label: 'Stake' },
];

export default function ActionsScreen({ variant }) {
  const f = useFeatures();
  const isPanel = variant === 'panel';
  const { closeActions, tab: initialTab, isOpen } = useActions();
  // MOD-130: wrap in useMemo to avoid recomputing on every render
  const visibleTabs = useMemo(() => TABS.filter(t => f.actions[t.id]), [f.actions]);
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

      {/* Sheet — full screen on mobile, static panel on desktop */}
      <motion.div className="actions-sheet">


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
          {active === 'stake'   && <StakeTab />}
        </div>
      </motion.div>
    </div>
  );
}
