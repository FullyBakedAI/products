/**
 * ActionsScreen — bottom sheet action hub
 *
 * Rendered as an overlay from ActionsContext (not a route).
 * Previous screen stays mounted and visible behind the backdrop.
 *
 * Tabs: Swap | Trade | Lend & Borrow | Deposit
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { Delete, ChevronDown, X, AlertCircle } from 'lucide-react';
import { useSwap } from './SwapContext';
import { useIconOverride } from './IconOverrideContext';
import { useActions } from './ActionsContext';
import './actions.css';

import tokenEth  from './assets/token-eth.svg';
import tokenUsdc from './assets/token-usdc.svg';
import iconActionRecv from './assets/icon-action-receive.svg';
import iconActionSend from './assets/icon-action-send.svg';

// ── Hook: navigate AND close the drawer so the next screen appears on top ──

function useFlowNavigate() {
  const navigate = useNavigate();
  const { closeActions } = useActions();
  return (path, opts) => { closeActions(); navigate(path, opts); };
}

// ── Shared sub-components ────────────────────────────────────────────────────

function TokenPill({ token, side }) {
  const navigate = useFlowNavigate();
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
  const navigate = useFlowNavigate();
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

// ── Swap tab ─────────────────────────────────────────────────────────────────

function SwapTab() {
  const navigate = useFlowNavigate();
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
    <div className="actions-tab-stack">
      <div className="swap-cards">
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

      {receiveToken && hasAmount && (
        <div className="swap-impact-row">
          <span className="swap-impact-label">
            Price impact:
            <span className="swap-impact-value" data-level="low"> 0.12%</span>
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
            rate: rateLabel, warning: null,
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
    </div>
  );
}

// ── Trade tab — Robinhood / Coinbase order ticket ────────────────────────────

const ETH_PRICE = 3864.20;

function TradeTab() {
  const navigate = useFlowNavigate();
  const [orderType, setOrderType]   = useState('market');
  const [direction, setDirection]   = useState('buy');
  const [amount, setAmount]         = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [activeInput, setActiveInput] = useState('amount');

  function handleKey(key) {
    const setter = activeInput === 'limit' ? setLimitPrice : setAmount;
    setter(prev => {
      if (key === 'del') return prev.slice(0, -1);
      if (key === '.') { if (prev.includes('.')) return prev; return prev.length === 0 ? '0.' : prev + '.'; }
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  }

  const dollarVal  = parseFloat(amount || 0);
  const ethAmount  = dollarVal > 0 ? (dollarVal / ETH_PRICE).toFixed(6) : '0';
  const ctaReady   = dollarVal > 0 && (orderType === 'market' || parseFloat(limitPrice || 0) > 0);
  const ctaClass   = ctaReady ? (direction === 'buy' ? 'trade-cta-buy' : 'trade-cta-sell') : 'cta-disabled';
  const ctaLabel   = ctaReady
    ? `${direction === 'buy' ? 'Buy' : 'Sell'} ${ethAmount} ETH`
    : 'Enter an amount';

  return (
    <div className="actions-tab-stack">

      {/* Asset header */}
      <button
        className="trade-asset-header"
        aria-label="Change asset — currently Ethereum"
        onClick={() => navigate('/swap/select/pay')}
      >
        <img src={tokenEth} alt="" width="36" height="36" className="trade-asset-icon" />
        <div className="trade-asset-info">
          <div className="trade-asset-name">Ethereum</div>
          <div className="trade-asset-meta">
            <span className="trade-asset-price">$3,864.20</span>
            <span className="trade-asset-chg positive">+4.38%</span>
          </div>
        </div>
        <div className="trade-change-chip" aria-hidden="true">
          Change <ChevronDown size={12} strokeWidth={2} />
        </div>
      </button>

      {/* Buy / Sell toggle */}
      <div className="trade-direction-tabs" role="group" aria-label="Buy or sell">
        <button
          className={`trade-dir-tab${direction === 'buy' ? ' dir-buy-active' : ''}`}
          onClick={() => setDirection('buy')}
          aria-pressed={direction === 'buy'}
        >Buy</button>
        <button
          className={`trade-dir-tab${direction === 'sell' ? ' dir-sell-active' : ''}`}
          onClick={() => setDirection('sell')}
          aria-pressed={direction === 'sell'}
        >Sell</button>
      </div>

      {/* Order type pills */}
      <div className="trade-order-type-row" role="group" aria-label="Order type">
        {['market', 'limit'].map(t => (
          <button
            key={t}
            className={`trade-order-pill${orderType === t ? ' active' : ''}`}
            onClick={() => { setOrderType(t); setActiveInput('amount'); }}
            aria-pressed={orderType === t}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Limit price row */}
      {orderType === 'limit' && (
        <button
          className={`trade-limit-row${activeInput === 'limit' ? ' focused' : ''}`}
          onClick={() => setActiveInput('limit')}
          aria-label={`Limit price: ${limitPrice ? '$' + limitPrice : 'not set'}`}
        >
          <span className="trade-limit-label">Limit price</span>
          <div className="trade-limit-right">
            <span className="trade-limit-value">{limitPrice ? `$${limitPrice}` : 'Set price'}</span>
            {activeInput === 'limit' && <span className="amount-cursor" aria-hidden="true" />}
          </div>
        </button>
      )}

      {/* Amount display */}
      <button
        className={`trade-amount-display${activeInput === 'amount' || orderType === 'market' ? ' focused' : ''}`}
        onClick={() => setActiveInput('amount')}
        aria-label={`Amount: $${amount || '0'}`}
      >
        <div className="trade-amount-value">
          <span className="trade-amount-currency">$</span>
          <span className="trade-amount-number">{amount || '0'}</span>
          {(activeInput === 'amount' || orderType === 'market') && (
            <span className="amount-cursor" aria-hidden="true" />
          )}
        </div>
        <div className="trade-amount-sub">≈ {ethAmount} ETH</div>
      </button>

      {ctaReady && (
        <div className="trade-summary-row" aria-live="polite">
          <span>Est. fee $2.10</span>
          <span className="trade-summary-dot">·</span>
          <span>{direction === 'buy' ? 'Available $5,342 USDC' : 'Available 1.1421 ETH'}</span>
        </div>
      )}

      <Numpad onKey={handleKey} />

      <Button
        className={`bottom-cta-btn ${ctaClass}`}
        isDisabled={!ctaReady}
        aria-label={ctaLabel}
        onPress={() => navigate('/review', { state: {
          action: 'trade',
          from: { icon: tokenUsdc, symbol: 'USDC', amount: `$${dollarVal.toLocaleString()}`, usd: dollarVal },
          to:   { icon: tokenEth,  symbol: 'ETH',  amount: ethAmount, usd: dollarVal },
          fee: { network: '$2.10', protocol: '$0.60', total: '$2.70' },
          rate: `1 ETH = $${ETH_PRICE.toLocaleString()} USDC`, warning: null,
        }})}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={ctaLabel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: m.cta.enter }}
            exit={{    opacity: 0, y: -6, transition: m.cta.exit }}
          >{ctaLabel}</motion.span>
        </AnimatePresence>
      </Button>
    </div>
  );
}

// ── Lend & Borrow tab ────────────────────────────────────────────────────────

const PLATFORMS = [
  { name: 'Aave v3',  apy: 3.8, tvl: '$2.1B' },
  { name: 'Compound', apy: 3.2, tvl: '$890M'  },
  { name: 'Spark',    apy: 4.1, tvl: '$1.4B'  },
];

function LendBorrowTab() {
  const navigate = useFlowNavigate();
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

      {/* Lend / Borrow toggle — matches Buy/Sell style */}
      <div className="trade-direction-tabs" role="group" aria-label="Lend or borrow">
        <button
          className={`trade-dir-tab${sub === 'lend' ? ' dir-buy-active' : ''}`}
          onClick={() => setSub('lend')}
          aria-pressed={sub === 'lend'}
        >Lend</button>
        <button
          className={`trade-dir-tab${sub === 'borrow' ? ' dir-sell-active' : ''}`}
          onClick={() => setSub('borrow')}
          aria-pressed={sub === 'borrow'}
        >Borrow</button>
      </div>

      {sub === 'lend' ? (
        <>
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
          <div className="actions-collateral-section">
            <div className="card-label" style={{ margin: '0 0 8px' }}>Your collateral</div>
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
            <div className="card-bottom card-bottom-mt" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, marginTop: 8 }}>
              <span>Health factor</span>
              <span className="text-success-bold">2.4 — Safe</span>
            </div>
          </div>

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

// ── Deposit tab ──────────────────────────────────────────────────────────────

function DepositTab() {
  const navigate = useFlowNavigate();
  return (
    <div className="actions-tab-stack">
      <div className="actions-deposit-grid">
        {[
          { label: 'Deposit',  sub: 'Add funds via crypto or bank transfer',    src: iconActionRecv, action: () => navigate('/receive') },
          { label: 'Withdraw', sub: 'Move funds to an external wallet or bank',  src: iconActionSend, action: () => navigate('/send') },
        ].map(({ label, sub, src, action }) => (
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

// ── Main screen ──────────────────────────────────────────────────────────────

const TABS = [
  { id: 'swap',    label: 'Swap' },
  { id: 'trade',   label: 'Trade' },
  { id: 'lend',    label: 'Lend' },
  { id: 'deposit', label: 'Deposit' },
];

export default function ActionsScreen() {
  const { closeActions, tab: initialTab } = useActions();
  const [activeIdx, setActiveIdx] = useState(() => {
    const i = TABS.findIndex(t => t.id === initialTab);
    return i >= 0 ? i : 0;
  });

  const active = TABS[activeIdx].id;

  function next() { setActiveIdx(i => (i + 1) % TABS.length); }

  return (
    <div className="actions-overlay" role="dialog" aria-modal="true" aria-label="Actions">

      {/* Dark backdrop — tap to dismiss */}
      <button
        className="actions-backdrop"
        aria-label="Close actions"
        onClick={closeActions}
      />

      {/* Sheet with drag-to-dismiss */}
      <motion.div
        className="actions-sheet"
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0, bottom: 0.3 }}
        onDragEnd={(_, info) => { if (info.offset.y > 80) closeActions(); }}
      >
        {/* Drag handle */}
        <div className="drag-handle" aria-hidden="true">
          <div className="drag-handle-pill" />
        </div>

        {/* Cycle button + close */}
        <div className="actions-header-row">
          <button
            className="actions-cycle-btn"
            onClick={next}
            aria-label={`Current: ${TABS[activeIdx].label}. Tap to cycle.`}
            aria-live="polite"
          >
            {TABS[activeIdx].label}
          </button>
          <Button
            className="close-btn-shared"
            aria-label="Close"
            onPress={closeActions}
          >
            <X size={16} color="var(--bk-text-muted)" strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>

        {/* Tab content — no scroll */}
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
