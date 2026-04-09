/**
 * HomeScreen — Modulo home dashboard
 * All colours via --bk-* tokens. All data mocked.
 */

import { useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import StatusBar from './StatusBar';
import BottomNav from './BottomNav';
import './home.css';

import { TrendingUp, Zap, Landmark, SlidersHorizontal } from 'lucide-react';
import { useIconOverride } from './IconOverrideContext';

import logoModulo      from './assets/logo-modulo.svg';
import chartLine       from './assets/chart-line.svg';
import iconNotif       from './assets/icon-notification.svg';
import iconSettings    from './assets/icon-settings.svg';
import iconGainArrow   from './assets/icon-gain-arrow.svg';
import iconActionSwap  from './assets/icon-action-swap.svg';
import iconActionBuy   from './assets/icon-action-buy.svg';
import iconActionSend  from './assets/icon-action-send.svg';
import iconActionRecv  from './assets/icon-action-receive.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenUsdt from './assets/token-usdt.svg';

const TIME_PERIODS = ['1D', '1W', '1M', '1Y', 'ALL'];

// Chain badge: colour-coded dot (bottom-right of token icon) — Crypto.com pattern
const CHAIN_BADGE = {
  usdc: { color: '#2D374B', title: 'Arbitrum' },  // primary chain
  btc:  { color: '#F7931A', title: 'Bitcoin'  },
  eth:  { color: '#0052FF', title: 'Base'     },
  sol:  { color: '#9945FF', title: 'Solana'   },
  usdt: { color: '#627EEA', title: 'Ethereum' },
};

// 7-day sparkline data (normalised 0–1) — pre-computed, consistent across renders
// Encodes the 7-day story: ETH up, SOL down, BTC V-shaped, stables flat
const SPARKLINES = {
  usdc: [0.50, 0.50, 0.51, 0.49, 0.50, 0.50, 0.50, 0.51, 0.50],
  btc:  [0.62, 0.55, 0.48, 0.42, 0.46, 0.54, 0.61, 0.66, 0.70],
  eth:  [0.32, 0.38, 0.44, 0.50, 0.56, 0.63, 0.70, 0.74, 0.78],
  sol:  [0.72, 0.68, 0.63, 0.57, 0.52, 0.48, 0.44, 0.42, 0.40],
  usdt: [0.50, 0.50, 0.50, 0.51, 0.50, 0.50, 0.49, 0.50, 0.50],
};

// Mini sparkline SVG — TradingView/Revolut inline trend signal
function MiniSparkline({ id, negative }) {
  const vals = SPARKLINES[id] || SPARKLINES.usdc;
  const W = 52, H = 22, pad = 1;
  const points = vals
    .map((v, i) => `${pad + (i / (vals.length - 1)) * (W - pad * 2)},${pad + (1 - v) * (H - pad * 2)}`)
    .join(' ');
  const color = negative ? 'var(--bk-error)' : 'var(--bk-success)';
  return (
    <svg width={W} height={H} aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TOKENS = [
  { id: 'usdc', icon: tokenUsdc, name: 'USD Coin', amount: '5,342.9824 USDC', usd: '$5,342.98', change: '+0.00%', negative: false, yield: 0.048, yieldUsd: '$256.46', pnl: '+$0.00 (0.0%)',    pnlNegative: false },
  { id: 'btc',  icon: tokenBtc,  name: 'Bitcoin',  amount: '0.0574 BTC',      usd: '$5,616.88', change: '+2.14%', negative: false, yield: 0.018, yieldUsd: '$101.10', pnl: '+$312.80 (+5.9%)', pnlNegative: false },
  { id: 'eth',  icon: tokenEth,  name: 'Ethereum', amount: '1.1421 ETH',      usd: '$4,412.82', change: '+4.38%', negative: false, yield: 0.038, yieldUsd: '$167.69', pnl: '+$412.50 (+10.3%)', pnlNegative: false },
  { id: 'sol',  icon: tokenSol,  name: 'Solana',   amount: '17.4352 SOL',     usd: '$4,228.38', change: '-1.82%', negative: true,  yield: 0.068, yieldUsd: '$287.53', pnl: '-$88.22 (-2.0%)',  pnlNegative: true  },
  { id: 'usdt', icon: tokenUsdt, name: 'Tether',   amount: '3,398.7553 USDT', usd: '$3,398.75', change: '+0.00%', negative: false, yield: 0.046, yieldUsd: '$156.34', pnl: '+$0.00 (0.0%)',    pnlNegative: false },
];

const MAX_YIELD   = Math.max(...TOKENS.map(t => t.yield));
const ACTION_W    = 300; // 5 actions × 60px

// Order: left → right in the revealed panel. Rightmost = first visible on partial swipe (iOS convention).
const SWIPE_ACTIONS = [
  { id: 'lend',  label: 'Stake',   Icon: Zap,               cls: 'swipe-stake' },
  { id: 'trade', label: 'Trade',   Icon: TrendingUp,        cls: 'swipe-trade' },
  { id: 'lend',  label: 'Lending', Icon: Landmark,          cls: 'swipe-lending' },
  { id: 'swap',    label: 'Swap',    Icon: null, svgSrc: iconActionSwap, cls: 'swipe-swap' },
  { id: 'manage',  label: 'Manage',  Icon: SlidersHorizontal, cls: 'swipe-manage' },
];

function TokenRow({ t, index }) {
  const x = useMotionValue(0);
  const navigate = useNavigate();

  function snap(open) {
    animate(x, open ? -ACTION_W : 0, { type: 'spring', stiffness: 260, damping: 26, mass: 0.7 });
  }

  function handleDragEnd(_, info) {
    const open = info.velocity.x < -300 || info.offset.x < -(ACTION_W / 2);
    snap(open);
  }

  function handleTap() {
    if (Math.abs(x.get()) > 5) {
      snap(false);
    } else {
      navigate(`/asset/${t.id}`);
    }
  }

  return (
    <motion.div
      className="token-row-outer"
      data-bk-component="token-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.12 + index * 0.05 } }}
    >
      {/* ── Asset icon + chain badge — anchored outside the sliding row ── */}
      <div className="token-icon-anchor" aria-hidden="true">
        <img className="token-icon-lg" src={t.icon} alt="" />
        {CHAIN_BADGE[t.id] && (
          <span
            className="token-chain-badge"
            style={{ background: CHAIN_BADGE[t.id].color }}
            title={CHAIN_BADGE[t.id].title}
          />
        )}
      </div>

      {/* ── Actions revealed on swipe ── */}
      <div className="token-swipe-actions">
        {SWIPE_ACTIONS.map(({ id, label, Icon, svgSrc, cls }) => (
          <button
            key={id}
            className={`swipe-action ${cls}`}
            aria-label={`${label} ${t.name}`}
            onClick={(e) => {
              e.stopPropagation();
              snap(false);
              setTimeout(() => {
                if (id === 'swap')        navigate('/swap');
                else if (id === 'manage') navigate(`/asset/${t.id}`);
                else                      navigate(`/actions?tab=${id}&asset=${t.id}`);
              }, 280);
            }}
          >
            {svgSrc
              ? <img src={svgSrc} width="18" height="18" aria-hidden="true" />
              : <Icon size={18} strokeWidth={1.5} />
            }
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Draggable foreground ── */}
      <motion.div
        className="token-row"
        style={{ x, touchAction: 'pan-y', position: 'relative', zIndex: 1 }}
        drag="x"
        dragConstraints={{ left: -ACTION_W, right: 0 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        aria-label={`${t.name}: ${t.usd}, ${t.change}, ${(t.yield * 100).toFixed(1)}% APY`}
      >
        {/* Main row */}
        <div className="token-row-main">
          {/* Spacer matches anchored icon dimensions so layout is identical */}
          <div className="token-icon-spacer" aria-hidden="true" />
          <div className="token-info">
            <div className="token-name-row">
              <span className="token-name-text">{t.name}</span>
              <span className={`token-change${t.negative ? ' negative' : ''}`}>{t.change}</span>
            </div>
            <div className="token-amount">{t.amount}</div>
            <div className={`token-pnl${t.pnlNegative ? ' negative' : ''}`}>{t.pnl}</div>
          </div>
          <div className="token-values">
            {/* Sparkline — TradingView/Revolut inline 7-day trend */}
            <MiniSparkline id={t.id} negative={t.negative} />
            <div className="token-usd">{t.usd}</div>
            <div className={`token-change${t.negative ? ' negative' : ''}`} style={{ fontSize: 11, textAlign: 'right' }}>
              {t.change}
            </div>
          </div>
        </div>

        {/* Full-width yield bar */}
        <div className="token-yield-bar-row">
          <div className="token-yield-track">
            <motion.div
              className="token-yield-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: t.yield / MAX_YIELD }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.22 + index * 0.06 }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
          <span className="token-yield-label">{(t.yield * 100).toFixed(1)}% APY</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('1D');
  const { getIcon } = useIconOverride(); // kept for DS page icon slot overrides

  return (
    <motion.main
      role="main"
      aria-label="Modulo home screen"
      className="home-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: m.fade.enter }}
      exit={{ opacity: 0, transition: m.fade.exit }}
    >
      <StatusBar />

      {/* Header */}
      <header className="home-header">
        <div className="header-logo">
          <img src={logoModulo} alt="Modulo" width="93" height="18" />
        </div>
        <div className="home-header-actions">
          <Button className="icon-btn" aria-label="Notifications" onPress={() => navigate('/activity')}>
            <img src={iconNotif} alt="" width="16" height="16" aria-hidden="true" />
          </Button>
          <Button className="icon-btn" aria-label="Settings" onPress={() => navigate('/settings')}>
            <img src={iconSettings} alt="" width="16" height="16" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="scroll-content">

        {/* Portfolio Card */}
        <motion.section
          className="portfolio-card"
          data-bk-component="portfolio-metric"
          aria-labelledby="portfolio-heading"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.04 } }}
        >
          <div className="portfolio-chart" aria-hidden="true">
            <img src={chartLine} alt="" />
          </div>
          <div className="portfolio-header">
            <span className="portfolio-label" id="portfolio-heading">Portfolio</span>
            <div className="time-periods" role="group" aria-label="Time period selector">
              {TIME_PERIODS.map((p) => (
                <Button
                  key={p}
                  className={`time-btn${activePeriod === p ? ' active' : ''}`}
                  aria-pressed={activePeriod === p}
                  onPress={() => setActivePeriod(p)}
                >{p}</Button>
              ))}
            </div>
          </div>
          <div className="portfolio-value" aria-label="Portfolio total value: $12,847.53">
            <span className="portfolio-dollars" aria-hidden="true">$12,847</span>
            <span className="portfolio-cents" aria-hidden="true">.53</span>
          </div>
          <div className="portfolio-gain" aria-label="Today's gain: $623.11 (5.08%)">
            <img src={iconGainArrow} alt="" width="8" height="8" aria-hidden="true" />
            <span className="gain-text">$623.11 (5.08%)</span>
          </div>
          <div className="portfolio-alltime" aria-label="All-time gain: +$2,341.18 (22.3%)">
            <span className="alltime-text">+$2,341.18 all time (22.3%)</span>
          </div>
        </motion.section>

        {/* Action Buttons */}
        <motion.div
          className="action-row"
          data-bk-component="action-row"
          role="group"
          aria-label="Quick actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.08 } }}
        >
          <Button className="action-btn" aria-label="Swap tokens" onPress={() => navigate('/swap')}>
            <img src={iconActionSwap} alt="" width="20" height="20" aria-hidden="true" />
            <span className="action-label">Swap</span>
          </Button>
          <Button className="action-btn" aria-label="Buy tokens" onPress={() => {}}>
            <img src={iconActionBuy} alt="" width="20" height="20" aria-hidden="true" />
            <span className="action-label">Buy</span>
          </Button>
          <Button className="action-btn" aria-label="Send tokens" onPress={() => navigate('/send')}>
            <img src={iconActionSend} alt="" width="20" height="20" aria-hidden="true" />
            <span className="action-label">Send</span>
          </Button>
          <Button className="action-btn" aria-label="Receive tokens" onPress={() => navigate('/receive')}>
            <img src={iconActionRecv} alt="" width="20" height="20" aria-hidden="true" />
            <span className="action-label">Receive</span>
          </Button>
        </motion.div>

        {/* AI Suggestion Strip */}
        <motion.div
          className="suggestion-strip"
          aria-label="Suggestions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.09 } }}
        >
          <button className="suggestion-pill" aria-label="SOL is down 1.8% — tap to buy">
            <TrendingUp size={13} strokeWidth={1.5} aria-hidden="true" />
            SOL down 1.8% — buy the dip?
          </button>
          <button className="suggestion-pill" aria-label="5,342 USDC idle — tap to put it to work">
            <Zap size={13} strokeWidth={1.5} aria-hidden="true" />
            $5,342 USDC idle — earn 4.8%?
          </button>
          <button className="suggestion-pill" aria-label="ETH up 4.4% — tap to take profit">
            <img src={iconActionSwap} width="13" height="13" aria-hidden="true" />
            ETH +4.4% today — take profit?
          </button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="tabs"
          role="tablist"
          data-bk-component="tab-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.10 } }}
        >
          <button className="tab active" role="tab" aria-selected="true" aria-controls="token-panel" id="tab-tokens">Tokens</button>
          <button className="tab" role="tab" aria-selected="false" id="tab-nfts">NFTs</button>
        </motion.div>

        {/* Token List */}
        <div className="token-list" role="tabpanel" id="token-panel" aria-labelledby="tab-tokens">
          {TOKENS.map((t, i) => (
            <TokenRow key={t.name} t={t} index={i} />
          ))}
        </div>

        {/* Earn Card */}
        <motion.div
          className="earn-card"
          data-bk-component="earn-card"
          role="region"
          aria-label="Earn — Annual Yield Accrual"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.46 } }}
        >
          <div>
            <div className="earn-label">3 assets earning · 2 idle</div>
            <div className="earn-value-row">
              <span className="earn-value">0.97</span>
              <span className="earn-unit">/ yr</span>
            </div>
          </div>
          <Button className="earn-btn" aria-label="Earn All" onPress={() => navigate('/actions?tab=lend')}>
            Earn All
          </Button>
        </motion.div>

      </div>

      <BottomNav />
    </motion.main>
  );
}
