/**
 * ActionsScreen — tabbed action hub
 *
 * Design language: SwapScreen header pattern, home.css tabs, swap.css cards/CTAs.
 * Swap tab embeds the actual SwapScreen UI (SwapContext) — not a redirect.
 *
 * Route: /actions  (modal slide-up)
 * Tabs: Swap | Trade | Lend & Borrow | Deposit
 */

import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import StatusBar from './StatusBar';
import { X, Delete, ChevronDown, AlertCircle } from 'lucide-react';
import { useSwap } from './SwapContext';
import { useIconOverride } from './IconOverrideContext';
import './actions.css';

import iconSettings    from './assets/icon-settings.svg';
import iconActionRecv  from './assets/icon-action-receive.svg';
import iconActionSend  from './assets/icon-action-send.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenUsdc from './assets/token-usdc.svg';

// ── Shared sub-components from SwapScreen ───────────────────────────────

function TokenPill({ token, side }) {
  const navigate = useNavigate();
  return (
    <Button
      className="token-pill-btn"
      aria-label={`${side === 'pay' ? 'Pay' : 'Receive'} token: ${token.symbol}`}
      onPress={() => navigate(`/swap/select/${side}`)}
    >
      <span className="token-icon"><img src={token.icon} alt="" width="22" height="22" /></span>
      <span className="token-name">{token.symbol}</span>
      <ChevronDown size={13} color="var(--bk-text-muted)" strokeWidth={1.5} className="token-chevron" aria-hidden="true" />
    </Button>
  );
}

function SelectTokenButton({ side }) {
  const navigate = useNavigate();
  return (
    <Button className="select-token-cta-btn" onPress={() => navigate(`/swap/select/${side}`)}>
      Select token
    </Button>
  );
}

function Numpad({ onKey }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
  return (
    <div className="numpad" role="group" aria-label="Number input">
      {keys.map(key => (
        <Button key={key} className="numpad-key-btn" aria-label={key === 'del' ? 'Delete' : key} onPress={() => onKey(key)}>
          {key === 'del'
            ? <Delete size={18} color="var(--bk-text-secondary)" strokeWidth={1.5} aria-hidden="true" />
            : key
          }
        </Button>
      ))}
    </div>
  );
}

// ── Swap tab — uses real SwapContext ─────────────────────────────────────

function SwapTab({ navigate }) {
  const {
    payToken, receiveToken,
    payAmount, setPayAmount,
    activePct, setActivePct,
    payUSD, receiveAmount, rateLabel,
    swapDirections,
  } = useSwap();
  const { getIcon } = useIconOverride();
  const DirIcon = getIcon('swap-direction');
  const [swappedVisual, setSwappedVisual] = useState(false);
  const flashTimer = useRef(null);

  const hasAmount = payAmount && parseFloat(payAmount) > 0;
  const ctaReady  = !!(receiveToken && hasAmount);
  const ctaLabel  = !receiveToken ? 'Select a token' : !hasAmount ? 'Enter an amount' : 'Swap';

  function handleKey(key) {
    setActivePct(null);
    setPayAmount(prev => {
      if (key === 'del') return prev.slice(0, -1);
      if (key === '.') { if (prev.includes('.')) return prev; return prev.length === 0 ? '0.' : prev + '.'; }
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  }

  function handlePct(pct) {
    setActivePct(pct);
    const amount = payToken.balance * pct / 100;
    setPayAmount(amount % 1 === 0 ? amount.toString() : amount.toFixed(4));
  }

  function handleSwap() { setSwappedVisual(v => !v); swapDirections(); }

  return (
    <>
      <div className="swap-cards">
        {/* Pay card */}
        <div className="swap-card pay-card" role="region" aria-label="You pay">
          <div className="card-label">You pay</div>
          <div className="card-middle">
            <div className="swap-amount" role="textbox" aria-readonly="true" aria-label="Pay amount">
              <span className="amount-text">{payAmount || '0'}</span>
              <span className="amount-cursor" aria-hidden="true" />
            </div>
            <TokenPill token={payToken} side="pay" />
          </div>
          <div className="card-bottom"><span>≈ ${payUSD}</span><span>{payToken.balanceLabel}</span></div>
        </div>

        {/* Direction button */}
        <div className="swap-direction-row">
          <Button
            className={`swap-direction${!receiveToken ? ' disabled' : ''}`}
            aria-label="Swap direction"
            onPress={handleSwap}
            isDisabled={!receiveToken}
          >
            <motion.span
              animate={{ rotate: swappedVisual ? 180 : 0 }}
              transition={{ type: 'spring', damping: 18, stiffness: 300 }}
              style={{ display: 'flex' }}
            >
              <DirIcon size={18} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
            </motion.span>
          </Button>
        </div>

        {/* Receive card */}
        <div className="swap-card receive-card" role="region" aria-label="You receive">
          <div className="card-label">You receive</div>
          <div className="card-middle">
            <div className={`swap-amount${receiveToken ? '' : ' dimmed'}`} role="textbox" aria-readonly="true">
              <span className="amount-text">{receiveAmount || '0'}</span>
            </div>
            {receiveToken ? <TokenPill token={receiveToken} side="receive" /> : <SelectTokenButton side="receive" />}
          </div>
          {receiveToken && <div className="card-bottom"><span>&nbsp;</span><span>{rateLabel}</span></div>}
        </div>
      </div>

      {/* % pills */}
      <div className="pct-row" role="group" aria-label="Amount presets">
        {[{ label: '25%', pct: 25 }, { label: '50%', pct: 50 }, { label: '75%', pct: 75 }, { label: 'Max', pct: 100 }].map(({ label, pct }) => (
          <Button
            key={pct}
            className={`pct-pill-btn${activePct === pct ? ' active' : ''}`}
            aria-label={`Set amount to ${label}`}
            aria-pressed={activePct === pct}
            onPress={() => handlePct(pct)}
          >{label}</Button>
        ))}
      </div>

      {/* Price impact + route — Uniswap pattern */}
      {receiveToken && hasAmount && (
        <div className="swap-impact-row">
          <span className="swap-impact-label">
            Price impact:
            <span className="swap-impact-value" data-level={
              0.12 < 0.5 ? 'low' : 0.12 < 1 ? 'medium' : 'high'
            }> 0.12%</span>
          </span>
          <span className="swap-route-label">
            Route: {payToken.symbol} → {receiveToken.symbol} via Arbitrum
          </span>
        </div>
      )}

      <Numpad onKey={handleKey} />

      <Button
        className={`bottom-cta-btn ${ctaReady ? 'cta-ready' : 'cta-disabled'}`}
        aria-label={ctaLabel}
        isDisabled={!ctaReady && !!receiveToken}
        onPress={() => {
          if (!receiveToken) { navigate('/swap/select/receive'); return; }
          navigate('/review', { state: {
            action: 'swap',
            from: { icon: payToken.icon, symbol: payToken.symbol, amount: payAmount, usd: parseFloat(payAmount || 0) * payToken.price },
            to:   { icon: receiveToken.icon, symbol: receiveToken.symbol, amount: receiveAmount, usd: parseFloat(receiveAmount || 0) * receiveToken.price },
            fee: { network: '$2.40', protocol: '$0.88', total: '$3.28' },
            rate: rateLabel,
            warning: null,
          }});
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={ctaLabel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: m.cta.enter }}
            exit={{    opacity: 0, y: -6, transition: m.cta.exit }}
          >{ctaLabel}</motion.span>
        </AnimatePresence>
      </Button>
    </>
  );
}

// ── Trade tab ────────────────────────────────────────────────────────────

function TradeTab({ navigate }) {
  const [orderType, setOrderType] = useState('market');
  const [direction, setDirection] = useState('buy');
  const [amount, setAmount]       = useState('');

  function handleKey(key) {
    setAmount(prev => {
      if (key === 'del') return prev.slice(0, -1);
      if (key === '.') { if (prev.includes('.')) return prev; return prev.length === 0 ? '0.' : prev + '.'; }
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  }

  const ctaReady = amount && parseFloat(amount) > 0;
  const usdValue = amount ? (parseFloat(amount) * 3864).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0.00';

  return (
    <div className="actions-tab-stack">
      {/* Order type */}
      <div className="actions-segment-row" role="group" aria-label="Order type">
        {['market', 'limit'].map(t => (
          <button key={t} className={`time-btn${orderType === t ? ' active' : ''}`}
            onClick={() => setOrderType(t)} aria-pressed={orderType === t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Asset selector */}
      <button className="swap-card actions-asset-select" aria-label="Select asset">
        <img src={tokenEth} alt="" width="24" height="24" className="collateral-img" />
        <span className="actions-asset-name">Ethereum</span>
        <span className="actions-asset-change">Change</span>
        <ChevronDown size={14} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
      </button>

      {/* Buy / Sell */}
      <div className="actions-direction-row" role="group" aria-label="Direction">
        {['buy', 'sell'].map(d => (
          <button key={d}
            className={`pct-pill-btn actions-dir-btn${direction === d ? ` dir-${d}` : ''}`}
            onClick={() => setDirection(d)} aria-pressed={direction === d}>
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Amount display */}
      <div className="swap-card pay-card">
        <div className="card-label">{direction === 'buy' ? 'You spend' : 'You sell'}</div>
        <div className="card-middle">
          <div className="swap-amount" role="textbox" aria-readonly="true">
            <span className="amount-text">{amount || '0'}</span>
            <span className="amount-cursor" aria-hidden="true" />
          </div>
          <button className="token-pill-btn token-pill-flat">
            <span className="token-icon"><img src={tokenEth} alt="" width="22" height="22" /></span>
            <span className="token-name">ETH</span>
          </button>
        </div>
        <div className="card-bottom"><span>≈ ${usdValue}</span><span>Balance: 1.1421</span></div>
      </div>

      <Numpad onKey={handleKey} />

      <Button
        className={`bottom-cta-btn ${ctaReady ? 'cta-ready' : 'cta-disabled'}`}
        isDisabled={!ctaReady}
        aria-label="Review trade"
        onPress={() => navigate('/review', { state: {
          action: 'trade',
          from: { icon: tokenUsdc, symbol: 'USDC', amount: usdValue, usd: parseFloat(usdValue.replace(/,/g, '')) },
          to:   { icon: tokenEth,  symbol: 'ETH',  amount,           usd: parseFloat(usdValue.replace(/,/g, '')) },
          fee: { network: '$2.10', protocol: '$0.60', total: '$2.70' },
          rate: '1 ETH = 3,864 USDC', warning: null,
        }})}
      >
        Review Order
      </Button>
    </div>
  );
}

// ── Lend & Borrow tab ────────────────────────────────────────────────────

const PLATFORMS = [
  { name: 'Aave v3',  apy: 3.8, tvl: '$2.1B' },
  { name: 'Compound', apy: 3.2, tvl: '$890M'  },
  { name: 'Spark',    apy: 4.1, tvl: '$1.4B'  },
];

function LendBorrowTab({ navigate }) {
  const [sub, setSub]           = useState('lend');
  const [amount, setAmount]     = useState('');
  const [platform, setPlatform] = useState(PLATFORMS[0]);

  function handleKey(key) {
    setAmount(prev => {
      if (key === 'del') return prev.slice(0, -1);
      if (key === '.') { if (prev.includes('.')) return prev; return prev.length === 0 ? '0.' : prev + '.'; }
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  }

  const ctaReady = amount && parseFloat(amount) > 0;

  return (
    <div className="actions-tab-stack">
      {/* Sub-tab */}
      <div className="actions-segment-row" role="group" aria-label="Lend or borrow">
        {['lend', 'borrow'].map(s => (
          <button key={s} className={`time-btn${sub === s ? ' active' : ''}`}
            onClick={() => setSub(s)} aria-pressed={sub === s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {sub === 'lend' ? (
        <>
          {/* Platform selection */}
          <div className="portfolio-label">Select platform</div>
          <div className="asset-opp-list">
            {PLATFORMS.map((p, i) => (
              <button key={p.name}
                className={`asset-opp-row${i === 0 ? ' first' : i === PLATFORMS.length - 1 ? ' last' : ''}`}
                onClick={() => setPlatform(p)}
                data-selected={p.name === platform.name}
                aria-pressed={p.name === platform.name}
              >
                <div className="asset-opp-info">
                  <div className="token-name-text">{p.name}</div>
                  <div className="token-amount">TVL {p.tvl}</div>
                </div>
                <span className="asset-opp-apy">{p.apy}%</span>
                <span className="asset-opp-apy-label">APY</span>
              </button>
            ))}
          </div>

          {/* Amount */}
          <div className="swap-card pay-card">
            <div className="card-label">Amount to lend</div>
            <div className="card-middle">
              <div className="swap-amount" role="textbox" aria-readonly="true">
                <span className="amount-text">{amount || '0'}</span>
                <span className="amount-cursor" aria-hidden="true" />
              </div>
              <button className="token-pill-btn token-pill-flat">
                <span className="token-icon"><img src={tokenUsdc} alt="" width="22" height="22" /></span>
                <span className="token-name">USDC</span>
              </button>
            </div>
            <div className="card-bottom"><span>≈ ${amount || '0'}</span><span>Balance: 5,342.98</span></div>
          </div>

          <Numpad onKey={handleKey} />

          <Button className={`bottom-cta-btn ${ctaReady ? 'cta-ready' : 'cta-disabled'}`}
            isDisabled={!ctaReady} aria-label="Review lend"
            onPress={() => navigate('/review', { state: {
              action: 'lend',
              from: { icon: tokenUsdc, symbol: 'USDC', amount, usd: parseFloat(amount || 0) },
              to: null,
              fee: { network: '$1.80', protocol: '$0.40', total: '$2.20' },
              rate: `${platform.apy}% APY on ${platform.name}`, warning: null,
            }})}>
            Lend on {platform.name}
          </Button>
        </>
      ) : (
        <>
          {/* Collateral */}
          <div className="swap-card">
            <div className="card-label">Your collateral</div>
            <div className="collateral-row">
              <img src={tokenEth} alt="" className="collateral-img" />
              <div className="collateral-info">
                <div className="token-name-text">Ethereum</div>
                <div className="token-amount">$4,412 available</div>
              </div>
              <div className="collateral-status-wrap">
                <span className="collateral-status">Active</span>
                <div className="collateral-toggle" aria-hidden="true">
                  <div className="collateral-toggle-knob" />
                </div>
              </div>
            </div>
            <div className="card-bottom card-bottom-mt">
              <span>Health factor</span>
              <span className="text-success-bold">2.4 — Safe</span>
            </div>
          </div>

          {/* Borrow amount */}
          <div className="swap-card pay-card">
            <div className="card-label">Borrow amount</div>
            <div className="card-middle">
              <div className="swap-amount" role="textbox" aria-readonly="true">
                <span className="amount-text">{amount || '0'}</span>
                <span className="amount-cursor" aria-hidden="true" />
              </div>
              <button className="token-pill-btn token-pill-flat">
                <span className="token-icon"><img src={tokenUsdc} alt="" width="22" height="22" /></span>
                <span className="token-name">USDC</span>
              </button>
            </div>
            <div className="card-bottom"><span>Variable 4.8% APR</span><span>Max: $3,300</span></div>
          </div>

          <Numpad onKey={handleKey} />

          <Button className={`bottom-cta-btn ${ctaReady ? 'cta-ready' : 'cta-disabled'}`}
            isDisabled={!ctaReady} aria-label="Review borrow"
            onPress={() => navigate('/review', { state: {
              action: 'borrow',
              from: { icon: tokenEth, symbol: 'ETH (collateral)', amount: '1.1421 ETH', usd: 4412 },
              to:   { icon: tokenUsdc, symbol: 'USDC', amount, usd: parseFloat(amount || 0) },
              fee: { network: '$1.20', protocol: '$0.30', total: '$1.50' },
              rate: '4.8% variable APR',
              warning: parseFloat(amount || 0) > 3000 ? 'Borrowing close to your limit — health factor will drop' : null,
            }})}>
            Review Borrow
          </Button>
        </>
      )}
    </div>
  );
}

// ── Deposit tab ──────────────────────────────────────────────────────────

function DepositTab({ navigate }) {
  return (
    <div className="actions-tab-stack">
      <div className="actions-deposit-grid">
        {[
          { label: 'Deposit',  sub: 'Add funds via crypto or bank transfer',   src: iconActionRecv, color: 'var(--bk-success)',       action: () => navigate('/receive') },
          { label: 'Withdraw', sub: 'Move funds to an external wallet or bank', src: iconActionSend, color: 'var(--bk-brand-primary)', action: () => navigate('/send') },
        ].map(({ label, sub, src, color, action }) => (
          <button key={label} className="swap-card actions-deposit-card" onClick={action} aria-label={label}>
            <img src={src} width="28" height="28" className="deposit-card-img" aria-hidden="true" />
            <div className="deposit-card-title">{label}</div>
            <div className="card-label">{sub}</div>
          </button>
        ))}
      </div>
      <div className="actions-notice">
        <AlertCircle size={13} strokeWidth={1.5} aria-hidden="true" />
        Bank transfers may take 1–3 business days to settle.
      </div>
    </div>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'swap',  label: 'Swap' },
  { id: 'trade', label: 'Trade' },
  { id: 'lend',  label: 'Lend & Borrow' },
  { id: 'deposit', label: 'Deposit' },
];

export default function ActionsScreen() {
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab     = searchParams.get('tab') || 'swap';
  const [active, setActive] = useState(TABS.find(t => t.id === defaultTab) ? defaultTab : 'swap');

  const tabContent = {
    swap:    <SwapTab navigate={navigate} />,
    trade:   <TradeTab navigate={navigate} />,
    lend:    <LendBorrowTab navigate={navigate} />,
    deposit: <DepositTab navigate={navigate} />,
  };

  return (
    <motion.div
      role="main"
      aria-label="Actions"
      className="swap-screen-inner"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <StatusBar />

      {/* Header — SwapScreen pattern */}
      <div className="swap-header">
        <div className="header-left">
          <Button className="close-btn" aria-label="Close" onPress={() => navigate('/')}>
            <X size={20} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <h1 className="swap-title">Actions</h1>
        </div>
        <Button className="settings-btn" aria-label="Settings">
          <img src={iconSettings} width="20" height="20" aria-hidden="true" />
        </Button>
      </div>

      {/* Tab bar — home.css .tabs pattern */}
      <div className="tabs actions-tabs" role="tablist" aria-label="Action type" data-bk-component="tab-bar">
        {TABS.map(t => (
          <button key={t.id}
            className={`tab${active === t.id ? ' active' : ''}`}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
          >{t.label}</button>
        ))}
      </div>

      {/* Tab content — each tab handles its own padding to match SwapScreen */}
      <div className="scroll-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            {tabContent[active]}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
