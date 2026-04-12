/**
 * ActivityScreen — transaction history
 *
 * Design language: home.css header/portfolio-label, shared.css chain-pill filters.
 * Grouped by date. Pending section at top.
 *
 * Route: /activity (fade transition)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m, tap } from './motion-tokens';
import { Button } from 'react-aria-components';

const MotionBackdrop = motion(Button);
import BottomNav from './BottomNav';
const IconLoader = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path d="M10 3C6.13 3 3 6.13 3 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconX = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconExternalLink = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M9 5H5C4.45 5 4 5.45 4 6V15C4 15.55 4.45 16 5 16H14C14.55 16 15 15.55 15 15V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 4H16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
import './activity.css';


import tokenEth  from './assets/token-eth.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenUsdt from './assets/token-usdt.svg';

// ── Data ──────────────────────────────────────────────────────────────

const FILTERS = ['All', 'Swaps', 'Trades', 'Staking', 'Lending', 'Transfers'];

const GROUP_TOTALS = {
  Today:     '+$204.85',
  Yesterday: '-$494.72',
  'Apr 7':   '+$4,616.88',
};

const TX = [
  { id: 'p1', group: 'Pending', type: 'swap',    pending: true,
    icon1: tokenEth,  icon2: tokenUsdc, label: 'Swap',
    detail: '0.05 ETH → USDC', status: 'Confirming on Ethereum',
    amount: null, time: '', chain: 'Ethereum', filter: 'Swaps' },

  { id: 't1', group: 'Today', type: 'swap',
    icon1: tokenEth,  icon2: tokenUsdc, label: 'Swap',
    detail: '0.1 ETH → 324.10 USDC', amount: '+324.10 USDC', positive: true,
    time: '2h ago', chain: 'Ethereum', filter: 'Swaps' },

  { id: 't2', group: 'Today', type: 'receive',
    icon1: tokenSol, label: 'Received', detail: '+0.5 SOL',
    amount: '+$121.25', positive: true, time: '5h ago', chain: 'Solana', filter: 'Transfers' },

  { id: 'y1', group: 'Yesterday', type: 'stake',
    icon1: tokenEth, label: 'Staking reward', detail: '+0.0012 ETH · Lido',
    amount: '+$5.28', positive: true, time: '18:04', chain: 'Ethereum', filter: 'Staking' },

  { id: 'y2', group: 'Yesterday', type: 'swap',
    icon1: tokenUsdc, icon2: tokenEth, label: 'Swap',
    detail: '500 USDC → 0.1534 ETH', amount: '-$500', positive: false,
    time: '14:22', chain: 'Ethereum', filter: 'Swaps' },

  { id: 'a1', group: 'Apr 7', type: 'send',
    icon1: tokenUsdc, label: 'Sent', detail: '-100 USDC · to 0x4248…EF33',
    amount: '-$100', positive: false, time: '11:05', chain: 'Ethereum', filter: 'Transfers' },

  { id: 'a2', group: 'Apr 7', type: 'lend',
    icon1: tokenUsdc, label: 'Lending deposit', detail: '3,000 USDC → Aave v3',
    amount: '-$3,000', positive: false, time: '09:33', chain: 'Ethereum', filter: 'Lending' },

  { id: 'a3', group: 'Apr 7', type: 'receive',
    icon1: tokenBtc, label: 'Received', detail: '+0.0574 BTC',
    amount: '+$5,616.88', positive: true, time: '08:14', chain: 'Bitcoin', filter: 'Transfers' },

  { id: 'a4', group: 'Apr 7', type: 'swap',
    icon1: tokenUsdt, icon2: tokenEth, label: 'Swap',
    detail: '1,000 USDT → 0.3082 ETH', amount: '-$1,000', positive: false,
    time: '07:51', chain: 'Ethereum', filter: 'Swaps' },
];

// ── Icon badge ─────────────────────────────────────────────────────────

function TxBadge({ icon1, pending }) {
  if (pending) return (
    <div className="tx-badge tx-badge-pending">
      <IconLoader size={15} className="tx-spinner" />
    </div>
  );
  return <img src={icon1} alt="" width="36" height="36" className="tx-token-icon" />;
}

// ── Transaction detail sheet ───────────────────────────────────────────

function TxDetailSheet({ tx, onClose }) {
  const [actionFeedback, setActionFeedback] = useState(null);
  const MOCK_HASH = '0x4a7f…e3b2';
  const MOCK_BLOCK = '19,284,751';

  return (
    <motion.div
      className="tx-detail-sheet"
      role="dialog"
      aria-modal="true"
      aria-label={`${tx.label} details`}
      initial={{ y: '100%' }}
      animate={{ y: 0, transition: m.sheet.enter }}
      exit={{ y: '100%', transition: m.sheet.exit }}
    >
      <div className="drag-handle"><div className="drag-handle-pill" /></div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 20px 16px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--bk-text-primary)', margin: 0 }}>{tx.label}</h2>
        <Button
          className="icon-btn"
          onPress={onClose}
          aria-label="Close"
          style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bk-bg-elevated)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <IconX size={16} />
        </Button>
      </div>

      {/* Amount focal point */}
      <div style={{ textAlign: 'center', padding: '8px 20px 20px' }}>
        <div className="tx-detail-focal">
          {tx.pending ? (
            <div className="tx-badge tx-badge-pending tx-badge-lg">
              <IconLoader size={24} className="tx-spinner" />
            </div>
          ) : (
            <div className="tx-detail-icons">
              <img src={tx.icon1} alt="" width="48" height="48" className="tx-token-icon" />
              {tx.icon2 && <img src={tx.icon2} alt="" width="48" height="48" className="tx-token-icon tx-detail-icon2" />}
            </div>
          )}
        </div>
        {tx.amount && (
          <div style={{
            fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em',
            color: tx.positive ? 'var(--bk-success)' : 'var(--bk-text-primary)',
            lineHeight: 1.2,
          }}>{tx.amount}</div>
        )}
        <div style={{ fontSize: 14, color: 'var(--bk-text-muted)', marginTop: 4 }}>{tx.detail}</div>
        {tx.pending && (
          <div style={{ fontSize: 12, color: 'var(--bk-brand-primary)', marginTop: 6 }}>{tx.status}</div>
        )}
      </div>

      {/* Swap legs — From / To rows for swap transactions */}
      {tx.type === 'swap' && tx.icon1 && (
        <div style={{ padding: '0 20px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="swap-leg-row">
            <img src={tx.icon1} alt="" width="20" height="20" style={{ borderRadius: '50%' }} />
            <span className="swap-leg-label">From</span>
            <span className="swap-leg-value">{tx.detail.split('→')[0].trim()}</span>
          </div>
          <div className="swap-leg-row">
            <img src={tx.icon2} alt="" width="20" height="20" style={{ borderRadius: '50%' }} />
            <span className="swap-leg-label">To</span>
            <span className="swap-leg-value swap-leg-positive">{tx.detail.split('→')[1].trim()}</span>
          </div>
        </div>
      )}

      {/* Detail rows */}
      <div className="tx-detail-rows">
        {[
          { label: 'Status',   value: tx.pending ? 'Pending' : 'Confirmed', highlight: !tx.pending },
          { label: 'Network',  value: tx.chain },
          { label: 'Fee paid', value: '$0.34' },
          tx.time && { label: 'Time',    value: tx.time },
          !tx.pending && { label: 'Block',   value: MOCK_BLOCK },
          !tx.pending && { label: 'Tx hash', value: MOCK_HASH  },
        ].filter(Boolean).map(({ label, value, highlight }) => (
          <div key={label} className="card-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '10px 0', margin: 0 }}>
            <span className="card-label" style={{ margin: 0 }}>{label}</span>
            <span style={{
              fontSize: 13, fontWeight: 500,
              color: highlight ? 'var(--bk-success)' : 'var(--bk-text-secondary)',
            }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Explorer link */}
      {!tx.pending && (
        <Button className="tx-explorer-btn" aria-label="View on block explorer" onPress={onClose}>
          <IconExternalLink />
          View on block explorer
        </Button>
      )}
    </motion.div>
  );
}

// ── Transaction row ────────────────────────────────────────────────────

function TxRow({ tx, delay, onTap, onAction }) {
  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay } }}
      whileTap={{ scale: tap.card }}
    >
      <Button
        className="tx-row activity-tx-row"
        onPress={() => onTap(tx)}
        style={{ cursor: 'pointer', width: '100%', textAlign: 'left' }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <TxBadge icon1={tx.icon1} pending={tx.pending} />
          {tx.icon2 && (
            <img src={tx.icon2} alt="" width="14" height="14" className="tx-secondary-icon" />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
            <span className="token-name-text">{tx.label}</span>
            {tx.amount && (
              <span style={{
                fontSize: 14, fontWeight: 600, flexShrink: 0,
                color: tx.positive ? 'var(--bk-success)' : 'var(--bk-text-secondary)',
              }}>{tx.amount}</span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span className="token-amount" style={{ opacity: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
              {tx.detail}
            </span>
            <div style={{ display: 'flex', gap: 5, flexShrink: 0, alignItems: 'center' }}>
              {tx.time && <span className="token-amount" style={{ opacity: 1 }}>{tx.time}</span>}
              <span className="chain-pill" style={{ height: 'auto', padding: '1px 7px', fontSize: 10 }}>{tx.chain}</span>
            </div>
          </div>
          {tx.pending && (
            <div style={{ fontSize: 11, color: 'var(--bk-brand-primary)', marginTop: 2 }}>{tx.status}</div>
          )}
        </div>
      </Button>
      {tx.pending && (
        <div className="tx-pending-actions">
          <Button className="tx-action-btn tx-action-speed" aria-label="Speed up transaction" onPress={() => { onAction && onAction('speed'); }}>
            Speed up
          </Button>
          <Button className="tx-action-btn tx-action-cancel" aria-label="Cancel transaction" onPress={() => { onAction && onAction('cancel'); }}>
            Cancel
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// ── Main screen ────────────────────────────────────────────────────────

export default function ActivityScreen() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTx, setSelectedTx] = useState(null);
  const pending  = TX.filter(t => t.pending);
  const filtered = TX.filter(t => !t.pending && (activeFilter === 'All' || t.filter === activeFilter));

  const groups = filtered.reduce((acc, tx) => {
    if (!acc[tx.group]) acc[tx.group] = [];
    acc[tx.group].push(tx);
    return acc;
  }, {});

  let delay = 0;

  return (
    <motion.main
      role="main"
      aria-label="Activity"
      className="home-screen"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      {/* Header */}
      <header className="home-header">
        <Button className="icon-btn" aria-label="Go back" onPress={() => navigate('/')}>
          <IconChevronLeft />
        </Button>
        <h1 style={{ fontSize: 17, fontWeight: 600, color: 'var(--bk-text-primary)', letterSpacing: '-0.01em', margin: 0 }}>
          Activity
        </h1>
        <div aria-hidden="true" style={{ width: 20 }} />
      </header>

      {/* Filter chips — shared.css .chain-pill pattern */}
      <div className="activity-filter-row" role="group" aria-label="Filter">
        {FILTERS.map(f => (
          <Button
            key={f}
            className={`chain-pill${activeFilter === f ? ' active' : ''}`}
            onPress={() => setActiveFilter(f)}
            aria-pressed={activeFilter === f}
          >{f}</Button>
        ))}
      </div>

      {/* List */}
      <div className="scroll-content" role="list" aria-label="Transaction history">

        {/* Pending */}
        {activeFilter === 'All' && pending.length > 0 && (
          <section>
            <div className="portfolio-label activity-group-header" style={{ paddingTop: 12 }}>
              <span>Pending</span>
            </div>
            {pending.map((tx, i) => <TxRow key={tx.id} tx={tx} delay={i * 0.04} onTap={setSelectedTx} onAction={() => setSelectedTx(tx)} />)}
          </section>
        )}

        {/* Date groups */}
        {Object.entries(groups).map(([group, txs]) => (
          <section key={group}>
            <div className="portfolio-label activity-group-header" style={{ paddingTop: 12 }}>
              <span>{group}</span>
              {GROUP_TOTALS[group] && (
                <span className={`activity-group-total${GROUP_TOTALS[group].startsWith('-') ? ' negative' : ''}`}>
                  {GROUP_TOTALS[group]}
                </span>
              )}
            </div>
            {txs.map(tx => {
              const d = (delay += 0.04);
              return <TxRow key={tx.id} tx={tx} delay={d} onTap={setSelectedTx} />;
            })}
          </section>
        ))}

        {filtered.length === 0 && pending.length === 0 && (
          <div style={{ padding: '48px 20px', textAlign: 'center', fontSize: 14, color: 'var(--bk-text-muted)' }}>
            No transactions found
          </div>
        )}
      </div>

      <BottomNav />

      {/* Transaction detail sheet */}
      <AnimatePresence>
        {selectedTx && (
          <>
            <MotionBackdrop
              className="tx-backdrop"
              aria-label="Close transaction details"
              onPress={() => setSelectedTx(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <TxDetailSheet tx={selectedTx} onClose={() => setSelectedTx(null)} />
          </>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
