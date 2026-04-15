/**
 * ReviewScreen — universal review + confirm
 *
 * Design language: shared.css drag-handle + primary-btn, swap.css swap-card chrome.
 * Slides up as a bottom sheet.
 *
 * Route: /review (sheet entry)
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button, Dialog } from 'react-aria-components';
const IconArrowDown = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 5V15M10 15L6 11M10 15L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconAlertTriangle = () => (
  <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L17.5 16H2.5L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="14.5" r="0.75" fill="currentColor"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
import { useFeatures } from './theme/FeatureConfig';
import { useSwap } from './SwapContext';
import { TransactionPath } from './components/TransactionPath';
import { getPathForTokens } from './config/transaction-paths';
import { formatUSD, capitalize } from './utils/formatters';
import './review.css';

export default function ReviewScreen() {
  const f = useFeatures();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  // MOD-118: No DEFAULT_STATE — if no real route state, redirect to root
  const hasRealState = !!(state && state.from && state.from.usd);
  const { action, from, to, fee, rate, warning } = state || {};
  const isEarnOnly = !to || action === 'stake' || action === 'lend';
  const [feesOpen, setFeesOpen] = useState(false);
  const { deadline } = useSwap(); // MOD-011: minutes, swap transactions expire — sourced from context

  // MOD-012: Token approval gate — non-native ERC-20 tokens require approve() before swap
  const isNativeToken = from?.symbol === 'ETH' || from?.symbol === 'BNB';
  const [approvalStatus, setApprovalStatus] = useState('idle'); // 'idle' | 'pending' | 'approved'
  const needsApproval = f.defi.tokenApproval && !isNativeToken && approvalStatus !== 'approved';

  // MOD-118 / MOD-041 / MOD-096: Guard against missing or zero-amount state — redirect, never render
  useEffect(() => {
    if (!hasRealState || parseFloat(from?.usd) <= 0) {
      navigate('/');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // MOD-119: Reset approval status whenever the source token changes
  useEffect(() => {
    setApprovalStatus('idle');
  }, [from?.symbol]);

  const handleConfirm = () => navigate('/success', { state: {
    action,
    summary: `${from.amount} ${from.symbol}${to ? ` for ${to.amount} ${to.symbol}` : ''}`,
    from, to, fee, rate,
  }});

  if (!hasRealState || parseFloat(from?.usd) <= 0) {
    return null;
  }

  return (
    <motion.div
      aria-modal="true"
      className="review-sheet"
      initial={{ y: '100%' }}
      animate={{ y: 0, transition: m.sheet.enter }}
      exit={{ y: '100%', transition: m.sheet.exit }}
    >
      <Dialog aria-label={`Review ${action}`} style={{ outline: 'none', display: 'contents' }}>
      {/* review-body: scrollable container — Confirm button is outside in review-footer */}
      <div className="review-body">
      {/* drag-handle from shared.css */}
      <div className="drag-handle"><div className="drag-handle-pill" /></div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 20px 10px' }}>
        <div aria-hidden="true" style={{ width: 32 }} />
        <h1 className="swap-title" style={{ textAlign: 'center', flex: 1 }}>
          Review {capitalize(action)}
        </h1>
        <Button className="close-btn-shared" aria-label="Close" onPress={() => navigate('/')}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </Button>
      </div>

      {/* Summary — card chrome for visual weight on confirmation step */}
      <div className="swap-cards" style={{ paddingBottom: 8 }}>
        <div className="swap-card">
          {/* You give */}
          <div className="review-asset-row">
            <div className="review-asset-left">
              <img src={from.icon} alt="" width="36" height="36" style={{ borderRadius: '50%', flexShrink: 0, display: 'block' }} />
              <div>
                <div className="card-label" style={{ margin: 0 }}>You pay</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--bk-text-primary)', marginTop: 1 }}>
                  {from.amount} {from.symbol}
                </div>
              </div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--bk-text-secondary)' }}>{formatUSD(from.usd)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
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
                <img src={to.icon} alt="" width="36" height="36" style={{ borderRadius: '50%', flexShrink: 0, display: 'block' }} />
                <div>
                  {/* MOD-128: borrow uses neutral label; swap/trade gets "You receive" */}
                  <div className="card-label" style={{ margin: 0 }}>
                    {action === 'borrow' ? 'You borrow' : 'You receive'}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--bk-text-primary)', marginTop: 1 }}>
                    {to.amount} {to.symbol}
                  </div>
                </div>
              </div>
              {/* MOD-128: green success color only for swap/trade receive, neutral for borrow */}
              <span style={{ fontSize: 16, fontWeight: 600, color: action === 'borrow' ? 'var(--bk-text-secondary)' : 'var(--bk-success)' }}>{formatUSD(to.usd)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sprint 005: Transaction path — swap only */}
      {action === 'swap' && from?.symbol && to?.symbol && (
        <div style={{ margin: '0 0 12px' }}>
          <TransactionPath
            {...getPathForTokens(from.symbol, to.symbol)}
          />
        </div>
      )}

      {/* Fee breakdown — clean list, no card chrome */}
      <div className="review-fees-section">
        {/* Rate row */}
        <div className="card-bottom" style={{ padding: '8px 0', margin: 0 }}>
          <span className="card-label" style={{ margin: 0 }}>Rate</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--bk-text-secondary)' }}>{rate}</span>
        </div>

        {/* MOD-011: Deadline row — swap only */}
        {f.defi.transactionDeadline && action === 'swap' && (
          <div className="card-bottom" style={{ padding: '8px 0', margin: 0 }}>
            <span className="card-label" style={{ margin: 0 }}>Expires in</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--bk-text-secondary)' }}>{deadline} min</span>
          </div>
        )}

        {/* Collapsible fee section */}
        <Button
          className="review-fee-toggle"
          onPress={() => setFeesOpen(v => !v)}
          aria-expanded={feesOpen}
          aria-controls="fee-breakdown"
        >
          <span className="card-label" style={{ margin: 0 }}>Total fees</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: fee.total ? 'var(--bk-text-primary)' : 'var(--bk-text-muted)' }}>
              {fee.total ?? 'Estimating...'}
            </span>
            <motion.span
              animate={{ rotate: feesOpen ? 180 : 0 }}
              transition={{ type: 'spring', damping: 18, stiffness: 260, mass: 0.6 }}
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
                <div key={label} className="card-bottom" style={{ borderTop: '1px solid var(--bk-white-05)', padding: '9px 0', margin: 0 }}>
                  <span className="card-label" style={{ margin: 0, paddingLeft: 10 }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--bk-text-muted)' }}>{value ?? 'Estimating...'}</span>
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

      {/* MOD-012: Approval step — shown for non-native tokens before confirm */}
      {f.defi.tokenApproval && needsApproval && (
        <div className="approval-step">
          <div className="approval-step-header">
            <span className="step-number">1</span>
            <span className="step-title">Approve {from?.symbol}</span>
            <span className="step-status">{approvalStatus === 'pending' ? 'Pending...' : 'Required'}</span>
          </div>
          <p className="approval-step-desc">
            Allow Modulo to use your {from?.symbol}. One-time permission for this token.
          </p>
          {approvalStatus === 'idle' && (
            <Button
              className="primary-btn"
              onPress={() => {
                setApprovalStatus('pending');
                setTimeout(() => setApprovalStatus('approved'), 1500);
              }}
            >
              Approve {from?.symbol}
            </Button>
          )}
          {approvalStatus === 'pending' && (
            <div className="approval-pending">Awaiting approval transaction...</div>
          )}
          {approvalStatus === 'approved' && (
            <div className="approval-confirmed">✓ {from?.symbol} approved</div>
          )}
        </div>
      )}

      {/* end review-body */}
      </div>
      </Dialog>
      <div className="review-footer">
        <Button
          className="primary-btn"
          aria-label={`Confirm ${action}`}
          isDisabled={needsApproval}
          onPress={handleConfirm}
        >
          {needsApproval ? `Confirm (approve first)` : `Confirm ${capitalize(action)}`}
        </Button>
        <Button className="review-cancel" onPress={() => navigate('/')} aria-label="Cancel">
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}