/**
 * LTVBar — Loan-to-Value health bar
 *
 * Visual bar showing current LTV vs warning and liquidation thresholds.
 * Tapping the [?] opens an explanation bottom sheet.
 *
 * Props:
 * - current: number — current LTV % (0–100)
 * - warning: number — warning threshold % (default: 75)
 * - liquidation: number — liquidation threshold % (default: 85)
 * - borrowAmount: string — e.g. "$8,400"
 * - collateralAmount: string — e.g. "$20,000"
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'react-aria-components';
import { BottomSheet } from '../BottomSheet';
import './styles.css';

function getLTVColor(current, warning, liquidation) {
  if (current >= liquidation * 0.9) return 'var(--bk-error, #EF4444)';
  if (current >= warning) return 'var(--bk-warning, #F59E0B)';
  return 'var(--bk-success, #22C55E)';
}

function getLTVStatus(current, warning, liquidation) {
  if (current >= liquidation) return 'At risk';
  if (current >= warning) return 'Warning';
  return 'Safe';
}

const IconHelp = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 14v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 11c0-1.5 2.5-2 2.5-3.5A2.5 2.5 0 0 0 7.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export function LTVBar({
  current = 42,
  warning = 75,
  liquidation = 85,
  borrowAmount,
  collateralAmount,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const barColor = getLTVColor(current, warning, liquidation);
  const status   = getLTVStatus(current, warning, liquidation);
  const fillPct  = Math.min(100, current);

  // Marker positions as % of bar width
  const warningPct     = (warning / 100) * 100;
  const liquidationPct = (liquidation / 100) * 100;

  return (
    <>
      <div className="ltv-bar-root" role="region" aria-label={`Loan-to-value: ${current}% — ${status}`}>
        <div className="ltv-bar-header">
          <span className="ltv-bar-title">Loan-to-Value</span>
          <Button
            className="ltv-bar-help-btn"
            aria-label="What is LTV? Open explanation"
            onPress={() => setSheetOpen(true)}
          >
            <IconHelp />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="ltv-bar-track" role="presentation">
          <motion.div
            className="ltv-bar-fill"
            style={{ background: barColor }}
            initial={{ width: '0%' }}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          />

          {/* Warning marker */}
          <div
            className="ltv-bar-marker ltv-bar-marker--warning"
            style={{ left: `${warningPct}%` }}
            aria-label={`Warning threshold: ${warning}%`}
          />

          {/* Liquidation marker */}
          <div
            className="ltv-bar-marker ltv-bar-marker--liquidation"
            style={{ left: `${liquidationPct}%` }}
            aria-label={`Liquidation threshold: ${liquidation}%`}
          />
        </div>

        {/* Labels row */}
        <div className="ltv-bar-labels" aria-hidden="true">
          <div className="ltv-bar-label-you" style={{ left: `${Math.min(fillPct, 95)}%` }}>
            <span className="ltv-bar-label-arrow">↑</span>
            <span className="ltv-bar-label-text ltv-bar-label-text--current" style={{ color: barColor }}>
              {current}%
            </span>
          </div>
          <div className="ltv-bar-label-fixed" style={{ left: `${warningPct}%` }}>
            <span className="ltv-bar-label-arrow">↑</span>
            <span className="ltv-bar-label-text">{warning}%</span>
          </div>
          <div className="ltv-bar-label-fixed" style={{ left: `${liquidationPct}%` }}>
            <span className="ltv-bar-label-arrow">↑</span>
            <span className="ltv-bar-label-text ltv-bar-label-text--liq">{liquidation}%</span>
          </div>
        </div>

        {/* Status summary */}
        <div className="ltv-bar-summary">
          <span className="ltv-bar-status" data-status={status.toLowerCase().replace(' ', '-')} style={{ color: barColor }}>
            {status}
          </span>
          {borrowAmount && collateralAmount && (
            <span className="ltv-bar-amounts">
              {borrowAmount} borrowed · {collateralAmount} collateral
            </span>
          )}
        </div>
      </div>

      {/* Explanation sheet */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div className="ltv-bar-sheet-content">
          <h2 className="ltv-bar-sheet-title">Loan-to-Value (LTV)</h2>
          <p className="ltv-bar-sheet-body">
            LTV measures how much you've borrowed relative to your collateral value.
          </p>
          <p className="ltv-bar-sheet-body">
            <strong>Your LTV: {current}%</strong> — you've borrowed {current}% of your collateral value.
          </p>
          <div className="ltv-bar-sheet-thresholds">
            <div className="ltv-bar-sheet-row">
              <span className="ltv-bar-sheet-dot ltv-bar-sheet-dot--warning" />
              <div>
                <div className="ltv-bar-sheet-row-label">Warning ({warning}%)</div>
                <div className="ltv-bar-sheet-row-desc">Consider repaying or adding collateral.</div>
              </div>
            </div>
            <div className="ltv-bar-sheet-row">
              <span className="ltv-bar-sheet-dot ltv-bar-sheet-dot--liquidation" />
              <div>
                <div className="ltv-bar-sheet-row-label">Liquidation ({liquidation}%)</div>
                <div className="ltv-bar-sheet-row-desc">Your position will be partially liquidated to cover the loan.</div>
              </div>
            </div>
          </div>
          <Button className="primary-btn" onPress={() => setSheetOpen(false)} aria-label="Close LTV explanation">
            Got it
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
