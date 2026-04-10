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
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import StatusBar from './StatusBar';
import BottomNav from './BottomNav';
import {
  SlidersHorizontal, Loader, X, ExternalLink,
} from 'lucide-react';
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
      <Loader size={15} strokeWidth={1.5} className="tx-spinner" color="var(--bk-text-muted)" aria-hidden="true" />
    </div>
  );
  return <img src={icon1} alt="" width="36" height="36" className="tx-token-icon" />;
}

// ── Transaction detail sheet ───────────────────────────────────────────

function TxDetailSheet({ tx, onClose }) {

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
        <button
          className="icon-btn"
          onClick={onClose}
          aria-label="Close"
          style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bk-bg-elevated)' }}
        >
          <X size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {/* Amount focal point */}
      <div style={{ textAlign: 'center', padding: '8px 20px 20px' }}>
        <div className="tx-detail-focal">
          {tx.pending ? (
            <div className="tx-badge tx-badge-pending tx-badge-lg">
              <Loader size={24} strokeWidth={1.5} className="tx-spinner" color="var(--bk-text-muted)" aria-hidden="true" />
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
        <button className="tx-explorer-btn" aria-label="View on block explorer">
          <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
          View on block explorer
        </button>
      )}
    </motion.div>
  );
}

// ── Transaction row ────────────────────────────────────────────────────

function TxRow({ tx, delay, onTap }) {
  return (
    <motion.div
      className="tx-row"
      role="listitem"
      onClick={() => onTap(tx)}
      style={{ cursor: 'pointer' }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay } }}
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
        {tx.pending && (
          <div className="tx-pending-actions">
            <button className="tx-action-btn tx-action-speed" aria-label="Speed up transaction">
              Speed up
            </button>
            <button className="tx-action-btn tx-action-cancel" aria-label="Cancel transaction">
              Cancel
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Main screen ────────────────────────────────────────────────────────

export default function ActivityScreen() {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: m.fade.enter }}
      exit={{ opacity: 0, transition: m.fade.exit }}
    >
      <StatusBar />

      {/* Header — home-header pattern */}
      <header className="home-header">
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--bk-text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
          Activity
        </h1>
        <Button className="icon-btn" aria-label="Filter transactions" style={{ width: 24, height: 24 }}>
          <SlidersHorizontal size={18} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </header>

      {/* Filter chips — shared.css .chain-pill pattern */}
      <div className="activity-filter-row" role="group" aria-label="Filter">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`chain-pill${activeFilter === f ? ' active' : ''}`}
            onClick={() => setActiveFilter(f)}
            aria-pressed={activeFilter === f}
          >{f}</button>
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
            {pending.map((tx, i) => <TxRow key={tx.id} tx={tx} delay={i * 0.04} onTap={setSelectedTx} />)}
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
            <motion.div
              className="tx-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTx(null)}
            />
            <TxDetailSheet tx={selectedTx} onClose={() => setSelectedTx(null)} />
          </>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
