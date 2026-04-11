/**
 * ReviewScreen — universal review + confirm
 *
 * Design language: shared.css drag-handle + primary-btn, swap.css swap-card chrome.
 * Slides up as a bottom sheet.
 *
 * Route: /review (sheet entry)
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
const IconArrowDown = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 5V15M10 15L6 11M10 15L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconAlertTriangle = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L17.5 16H2.5L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="14.5" r="0.75" fill="currentColor"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
import './review.css';

import tokenEth  from './assets/token-eth.svg';
import tokenUsdc from './assets/token-usdc.svg';

const DEFAULT_STATE = {
  action: 'swap',
  from: { icon: tokenEth,  symbol: 'ETH',  amount: '0.1',    usd: 386.40 },
  to:   { icon: tokenUsdc, symbol: 'USDC', amount: '324.10', usd: 324.10 },
  fee:  { network: '$2.40', protocol: '$0.88', total: '$3.28' },
  rate: '1 ETH = 3,241 USDC',
  warning: null,
};

const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ReviewScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const s = state || DEFAULT_STATE;
  const { action, from, to, fee, rate, warning } = s;
  const isEarnOnly = !to || action === 'stake' || action === 'lend';
  const [feesOpen, setFeesOpen] = useState(false);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Review ${action}`}
      className="review-sheet"
      initial={{ y: '100%' }}
      animate={{ y: 0, transition: m.sheet.enter }}
      exit={{ y: '100%', transition: m.sheet.exit }}
    >
      {/* drag-handle from shared.css */}
      <div className="drag-handle"><div className="drag-handle-pill" /></div>

      <h1 className="swap-title" style={{ textAlign: 'center', padding: '4px 20px 16px' }}>
        Review {capitalize(action)}
      </h1>

      {/* Summary — card chrome for visual weight on confirmation step */}
      <div className="swap-cards" style={{ paddingBottom: 12 }}>
        <div className="swap-card">
          {/* You give */}
          <div className="review-asset-row">
            <div className="review-asset-left">
              <img src={from.icon} alt="" width="40" height="40" style={{ borderRadius: '50%', flexShrink: 0, display: 'block' }} />
              <div>
                <div className="card-label" style={{ margin: 0 }}>You give</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--bk-text-primary)', marginTop: 1 }}>
                  {from.amount} {from.symbol}
                </div>
              </div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--bk-text-secondary)' }}>{fmt(from.usd)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <IconArrowDown />
          </div>

          {isEarnOnly ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0 8px' }}>
              <span className="card-label" style={{ margin: 0 }}>Earning</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--bk-brand-primary)' }}>{rate}</span>
            </div>
          ) : (
            <div className="review-asset-row">
              <div className="review-asset-left">
                <img src={to.icon} alt="" width="40" height="40" style={{ borderRadius: '50%', flexShrink: 0, display: 'block' }} />
                <div>
                  <div className="card-label" style={{ margin: 0 }}>You receive</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--bk-text-primary)', marginTop: 1 }}>
                    {to.amount} {to.symbol}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--bk-success)' }}>{fmt(to.usd)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Fee breakdown — clean list, no card chrome */}
      <div className="review-fees-section">
        {/* Rate row */}
        <div className="card-bottom" style={{ padding: '10px 0', margin: 0 }}>
          <span className="card-label" style={{ margin: 0 }}>Rate</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--bk-text-secondary)' }}>{rate}</span>
        </div>

        {/* Collapsible fee section */}
        <Button
          className="review-fee-toggle"
          onPress={() => setFeesOpen(v => !v)}
          aria-expanded={feesOpen}
          aria-controls="fee-breakdown"
        >
          <span className="card-label" style={{ margin: 0 }}>Total fees</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--bk-text-primary)' }}>{fee.total}</span>
            <motion.span
              animate={{ rotate: feesOpen ? 180 : 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 280 }}
              style={{ display: 'flex' }}
            >
              <IconChevronDown />
            </motion.span>
          </div>
        </Button>

        <AnimatePresence initial={false}>
          {feesOpen && (
            <motion.div
              id="fee-breakdown"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
              exit={{ height: 0, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
              style={{ overflow: 'hidden' }}
            >
              {[
                { label: 'Network fee',  value: fee.network  },
                { label: 'Protocol fee', value: fee.protocol },
              ].map(({ label, value }) => (
                <div key={label} className="card-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '9px 0', margin: 0 }}>
                  <span className="card-label" style={{ margin: 0, paddingLeft: 10 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--bk-text-muted)' }}>{value}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Warning */}
      {warning && (
        <div className="review-warning" style={{ margin: '0 16px 12px' }}>
          <IconAlertTriangle />
          <span>{warning}</span>
        </div>
      )}

      {/* Confirm — primary-btn from shared.css */}
      <Button
        className="primary-btn"
        aria-label={`Confirm ${action}`}
        onPress={() => navigate('/success', { state: {
          action,
          summary: `${from.amount} ${from.symbol}${to ? ` for ${to.amount} ${to.symbol}` : ''}`,
        }})}
      >
        Confirm {capitalize(action)}
      </Button>

      <Button className="review-cancel" onPress={() => navigate('/')} aria-label="Cancel">
        Cancel
      </Button>
    </motion.div>
  );
}
