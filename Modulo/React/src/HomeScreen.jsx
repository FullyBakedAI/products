/**
 * HomeScreen — Modulo home dashboard
 * v3 additions:
 *   F1 — "Put It All To Work" promo card
 *   F2 — Live yield counter on portfolio balance
 *   F3 — Autopilot inline toggle card
 *   F4 — SmartNudges horizontal scroll
 *
 * All colours via --bk-* tokens. All data mocked.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { motion as m, tap, stagger } from './motion-tokens';
import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { useActions } from './ActionsContext';
import { useIsDesktop } from './hooks/useIsDesktop';
import BottomNav from './BottomNav';
import NotificationsPanel from './NotificationsPanel';
import './home.css';

const IconTrendingUp = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconZap = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M11 3L4 11H10L9 17L16 9H10L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconLandmark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 16H17M3 8H17M10 4L3 8M10 4L17 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8V16M10 8V16M14 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconSlidersHorizontal = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="13" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IconChevronRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconRepeat2 = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 7H16M16 7L13 4M16 7L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H4M4 13L7 16M4 13L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconArrowUpRight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M6 14L14 6M14 6H8M14 6V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
import { useIconOverride } from './IconOverrideContext';
import { useBrandConfig } from './theme/BrandConfig';

import SmartNudges       from './SmartNudges';
import iconBrandBadge    from './assets/icon-modulo-badge.svg';
import chartLine       from './assets/chart-line.svg';
import iconNotif       from './assets/icon-notification.svg';
import iconSettings    from './assets/icon-settings.svg';
import iconGainArrow   from './assets/icon-gain-arrow.svg';
import iconActionSend  from './assets/icon-action-send.svg';
import iconActionRecv  from './assets/icon-action-receive.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenUsdt from './assets/token-usdt.svg';

const TIME_PERIODS = ['1D', '1W', '1M', '1Y', 'ALL'];

// Chart uses the original chart-line.svg for all periods (same visual style)

// Chain badge: colour-coded dot (bottom-right of token icon)
const CHAIN_BADGE = {
  usdc: { color: '#2D374B', title: 'Arbitrum' },
  btc:  { color: '#F7931A', title: 'Bitcoin'  },
  eth:  { color: '#0052FF', title: 'Base'     },
  sol:  { color: '#9945FF', title: 'Solana'   },
  usdt: { color: '#627EEA', title: 'Ethereum' },
};

// 7-day sparkline data (normalised 0–1)
const SPARKLINES = {
  usdc: [0.50, 0.50, 0.51, 0.49, 0.50, 0.50, 0.50, 0.51, 0.50],
  btc:  [0.62, 0.55, 0.48, 0.42, 0.46, 0.54, 0.61, 0.66, 0.70],
  eth:  [0.32, 0.38, 0.44, 0.50, 0.56, 0.63, 0.70, 0.74, 0.78],
  sol:  [0.72, 0.68, 0.63, 0.57, 0.52, 0.48, 0.44, 0.42, 0.40],
  usdt: [0.50, 0.50, 0.50, 0.51, 0.50, 0.50, 0.49, 0.50, 0.50],
};

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

const MAX_YIELD  = Math.max(...TOKENS.map(t => t.yield));
const ACTION_W   = 240;

const SWIPE_ACTIONS = [
  { id: 'trade',  label: 'Trade',  Icon: IconTrendingUp, cls: 'swipe-trade' },
  { id: 'lend',   label: 'Lend',   Icon: IconLandmark,   cls: 'swipe-lend'  },
  { id: 'swap',   label: 'Swap',   Icon: IconRepeat2,    cls: 'swipe-swap'  },
];

// ── Feature 2: Live yield counter ──────────────────────────────────────
// $969/yr at 100x display speed so the tick is visible in the prototype.
// Per 300ms: 969 / 35, 365 / 24 / 3600 / 1000 * 300 * 100 ≈ 0.00922
const YIELD_TICK_MS    = 300;
const YIELD_PER_TICK   = (969 / 31_536_000) * YIELD_TICK_MS / 1000 * 100;
const BASE_BALANCE     = 22_999.83;

function useLiveBalance(active) {
  const [balance, setBalance] = useState(BASE_BALANCE);
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setBalance(prev => prev + YIELD_PER_TICK);
      setGlowing(true);
      setTimeout(() => setGlowing(false), 300);
    }, YIELD_TICK_MS);
    return () => clearInterval(id);
  }, [active]);

  return { balance, glowing };
}


// ── TokenRow ─────────────────────────────────────────────────────────────────
function TokenRow({ t, index, showApyInfo, apyTooltipOpen, setApyTooltipOpen }) {
  const x = useMotionValue(0);
  const navigate = useNavigate();
  const { openActions } = useActions();
  const isDesktop = useIsD
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const hasDragged = useRef(false);
  const buttonReveal = useTransform(x, [-ACTION_W, -30], [1, 0]);

  function snap(open) {
    setIsSwipeOpen(open);
    animate(x, open ? -ACTION_W : 0, { type: 'spring', stiffness: 340, damping: 30, mass: 0.6 });
  }

  function handleDragStart() {
    hasDragged.current = true;
  }

  function handleDragEnd(_, info) {
    const open = info.velocity.x < -500 || info.offset.x < -(ACTION_W * 0.35);
    snap(open);
    // Clear drag flag after spring settles so tap doesn't fire navigate
    setTimeout(() => { hasDragged.current = false; }, 350);
  }

  function handleTap() {
    if (hasDragged.current || Math.abs(x.get()) > 8) {
      snap(false);
    } else if (isDesktop) {
      openActions({ asset: t.id });
    } else {
      navigate(`/asset/${t.id}`);
    }
  }

  return (
    <motion.div
      className="token-row-outer"
      data-bk-component="token-card"
      role="listitem"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: stagger.base + index * stagger.perItem } }}
      style={{ zIndex: isSwipeOpen ? 2 : 'auto' }}
    >
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

      <div className="token-swipe-actions">
        {SWIPE_ACTIONS.map(({ id, label, Icon, cls }) => (
          <motion.div key={id} style={{ flex: 1, display: 'flex', opacity: buttonReveal, scale: buttonReveal }}>
            <Button
              className={`swipe-action ${cls}`}
              aria-label={`${label} ${t.name}`}
              onPress={() => {
                snap(false);
                setTimeout(() => {
                  if (id === 'swap')  openActions({ tab: 'swap',  asset: t.id });
                  else if (id === 'lend')  openActions({ tab: 'lend',  asset: t.id });
                  else                     openActions({ tab: 'trade', asset: t.id });
                }, 260);
              }}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span>{label}</span>
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="token-row"
        style={{ x, touchAction: 'pan-y', position: 'relative', zIndex: 1 }}
        drag="x"
        dragConstraints={{ left: -ACTION_W, right: 0 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        whileTap={isSwipeOpen ? {} : { scale: tap.card }}
        tabIndex={0}
        aria-label={`${t.name}: ${t.usd}, ${t.change}, ${(t.yield * 100).toFixed(1)}% APY — press Space or Arrow Left to reveal actions`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === ' ') {
            e.preventDefault();
            snap(true);
          }
          if (e.key === 'Escape') {
            snap(false);
          }
        }}
      >
        <div className="token-row-main">
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
            <MiniSparkline id={t.id} negative={t.negative} />
            <div className="token-usd">{t.usd}</div>
            <div className={`token-change${t.negative ? ' negative' : ''}`} style={{ fontSize: 11, textAlign: 'right' }}>
              {t.change}
            </div>
          </div>
        </div>

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
          {showApyInfo && (
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
              <button
                className="apy-info-btn"
                aria-label="What is APY?"
                onClick={(e) => { e.stopPropagation(); setApyTooltipOpen(v => !v); }}
              >ⓘ</button>
              {apyTooltipOpen && (
                <div className="apy-tooltip" role="tooltip">
                  <p>APY = Annual Percentage Yield. Rates are variable and may change daily.</p>
                  <button onClick={() => setApyTooltipOpen(false)}>Got it</button>
                </div>
              )}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── HomeScreen ────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const navigate = useNavigate();
  const { openActions } = useActions();
  const { logoSrc, logoAlt, logoWidth, logoHeight } = useBrandConfig();
  const [activePeriod, setActivePeriod] = useState('1D');
  const [yieldActive] = useState(true); // F2: yield counter always on in demo
  const [activeAssetTab, setActiveAssetTab] = useState('tokens');
  const [sortBy, setSortBy] = useState('size'); // 'size' | 'performance'
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeChain, setActiveChain] = useState('Arbitrum');
  const [apyTooltipOpen, setApyTooltipOpen] = useState(false);
  const [chainMenuOpen, setChainMenuOpen] = useState(false);

  const CHAINS = ['Ethereum', 'Arbitrum', 'Base', 'Optimism'];
  const scrollRef = useRef(null);
  useIconOverride();

  function handleScroll() {
    setHeaderScrolled((scrollRef.current?.scrollTop ?? 0) > 70);
  }

  const sortedTokens = [...TOKENS].sort((a, b) => {
    if (sortBy === 'performance') {
      const aVal = parseFloat(a.change.replace('%', '').replace('+', ''));
      const bVal = parseFloat(b.change.replace('%', '').replace('+', ''));
      return bVal - aVal;
    }
    // size — by USD value
    return parseFloat(b.usd.replace(/[$,]/g, '')) - parseFloat(a.usd.replace(/[$,]/g, ''));
  });

  // F2: Live balance
  const { balance, glowing } = useLiveBalance(yieldActive);

  const totalPortfolioValue = TOKENS.reduce((sum, t) => sum + parseFloat(t.usd.replace(/[$,]/g, '')), 0);

  // Portfolio count-up on mount (0 → BASE_BALANCE over 600ms)
  const [countedUp, setCountedUp]       = useState(false);
  const [mountBalance, setMountBalance] = useState(0);
  useEffect(() => {
    const ctrl = animate(0, BASE_BALANCE, {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setMountBalance(v),
      onComplete: () => setCountedUp(true),
    });
    return ctrl.stop;
  }, []);

  const activeBalance  = countedUp ? balance : mountBalance;
  const balanceDollars = Math.floor(activeBalance).toLocaleString('en-US');
  const balanceCents   = (activeBalance % 1).toFixed(4).slice(1); // ".8312"


  return (
    <motion.main
      role="main"
      aria-label={`${brandName} home screen`}
      className="home-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: m.fade.enter }}
      exit={{ opacity: 0, transition: m.fade.exit }}
    >
      {/* Header — collapses on scroll */}
      <header className={`home-header${headerScrolled ? ' home-header--scrolled' : ''}`}>
        <div className="header-logo">
          <img src={logoSrc} alt={logoAlt} width={logoWidth} height={logoHeight} />
        </div>
        <div className="home-header-actions">
          {/* Network selector */}
          <div className="network-pill-wrap" style={{ position: 'relative' }}>
            <Button
              className="network-pill"
              aria-label={`Network: ${activeChain}. Tap to switch.`}
              aria-haspopup="listbox"
              aria-expanded={chainMenuOpen}
              onPress={() => setChainMenuOpen(v => !v)}
            >
              <span className="network-dot" aria-hidden="true" />
              <span className="network-label">{activeChain}</span>
              <span className={`network-chevron${chainMenuOpen ? ' open' : ''}`} aria-hidden="true">›</span>
            </Button>
            <AnimatePresence>
              {chainMenuOpen && (
                <motion.div
                  className="network-menu"
                  role="listbox"
                  aria-label="Select network"
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: m.springTight }}
                  exit={{ opacity: 0, y: -4, scale: 0.96, transition: { duration: 0.12 } }}
                >
                  {CHAINS.map(chain => (
                    <Button key={chain}
                      className={`network-menu-item${chain === activeChain ? ' active' : ''}`}
                      role="option"
                      aria-selected={chain === activeChain}
                      onPress={() => { setActiveChain(chain); setChainMenuOpen(false); }}
                    >
                      <span className="network-dot" aria-hidden="true" />
                      {chain}
                    </Button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button className="icon-btn notif-btn" aria-label="Notifications, new activity available" onPress={() => setNotifOpen(pre => { setNotifOpen(true); return pre; })}>
            <img src={iconNotif} alt="" width="16" height="16" aria-hidden="true" />
            <span className="notif-dot" aria-hidden="true" />
          </Button>
          <Button className="icon-btn" aria-label="Settings" onPress={() => navigate('/settings')}>
            <img src={iconSettings} alt="" width="16" height="16" aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="scroll-content" ref={scrollRef} onScroll={handleScroll}>

        {/* Portfolio Card — F2: live yield counter */}
        <motion.section
          className="portfolio-card"
          data-bk-component="portfolio-metric"
          aria-labelledby="portfolio-heading"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.04 } }}
        >
          <div className="portfolio-chart" role="img" aria-label="Portfolio performance chart">
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

          {/* F2: animated balance + green pulse dot */}
          <div
            className="portfolio-value"
            aria="label"
            aria-label={`Portfolio total value: $${balanceDollars}${balanceCents}`}
          >
            <span
              className={`portfolio-dollars${glowing ? ' portfolio-live-glow' : ''}`}
              aria-hidden="true"
            >
              ${balanceDollars}
            </span>
            <span className="portfolio-cents" aria-hidden="true">{balanceCents}</span>
            {yieldActive && (
              <span className="portfolio-yield-pulse" aria-label="Yield active">
                <span className="portfolio-yield-pulse-dot" />
              </span>
            )}
          </div>

          {/* Gain row */}
          <div className="portfolio-gain-row" aria-label="Today's gain: $623.11 (5.08%)">
            <div className="portfolio-gain">
              <img src={iconGainArrow} alt="" width="8" height="8" aria-hidden="true" />
              <span className="gain-text">$623.11 (5.08%)</span>
            </div>
            {/* Simulator — coming in v2 */}
          </div>

          <div className="portfolio-alltime" aria-label="All-time gain: +$2,341.18 (22.3%)">
            <span className="alltime-text">+$2,341.18 all time (22.3%)</span>
          </div>
        </motion.section>

        {/* Action buttons — Swap / Buy / Send / Receive */}
        <motion.div
          className="action-row"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.08 } }}
        >
          <button className="action-btn" aria-label="Swap" onClick={() => openActions({ tab: 'swap' })}>
            <IconRepeat2 />
            <span className="action-label">Swap</span>
          </button>
          <button className="action-btn" aria-label="Trade" onClick={() => openActions({ tab: 'trade' })}>
            <IconArrowUpRight />
            <span className="action-label">Trade</span>
          </button>
          <button className="action-btn" aria-label="Send" onClick={() => navigate('/send')}>
            <img src={iconActionSend} alt="" width="20" height="20" aria-hidden="true" />
            <span className="action-label">Send</span>
          </button>
          <button className="action-btn" aria-label="Receive" onClick={() => navigate('/receive')}>
            <img src={iconActionRecv} alt="" width="20" height="20" aria-hidden="true" />
            <span className="action-label">Receive</span>
          </button>
        </motion.div>

        {/* F1: "Put It All To Work" promo card — spring scale entrance */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...m.spring, delay: 0.16 }}
        >
          <motion.div className="optimise-promo-card" whileTap={{ scale: tap.card }}>
          <Button aria-label="Put it all to work — optimise all assets" onPress={() => navigate('/optimise')} style={{ all: 'unset', display: 'contents', cursor: 'pointer' }}>
            <div className="optimise-promo-text">
              <div className="optimise-promo-headline">Put it all to work</div>
              <div className="optimise-promo-sub">Estimated +$969/yr · 4.2% avg APY across 4 protocols</div>
            </div>
            <span className="optimise-promo-btn" aria-hidden="true">Optimise</span>
          </Button>
          </motion.div>
        </motion.div>

        {/* F4: SmartNudges horizontal scroll */}
        <SmartNudges />

        {/* Positions header + sort */}
        <motion.div
          className="positions-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.14 } }}
        >
          <span className="positions-title">
            Positions <span className="positions-count">{TOKENS.length}</span>
          </span>
          <div className="positions-sort-group" role="group" aria-label="Sort positions">
            <Button
              className={`positions-sort-opt${sortBy === 'size' ? ' active' : ''}`}
              aria-pressed={sortBy === 'size'}
              onPress={() => setSortBy('size')}
            >Size</Button>
            <Button
              className={`positions-sort-opt${sortBy === 'performance' ? ' active' : ''}`}
              aria-pressed={sortBy === 'performance'}
              onPress={() => setSortBy('performance')}
            >Performance</Button>
          </div>
        </motion.div>

        {activeAssetTab === 'tokens' ? (
          <>
            {/* MOD-020: Onboarding card for empty wallet */}
            {totalPortfolioValue === 0 && (
              <div className="onboarding-card">
                <h3>Welcome to Modulo</h3>
                <p>Deposit to get started — see your portfolio grow across every chain.</p>
                <Button className="primary-btn" onPress={() => openActions({ tab: 'deposit' })}>
                  Deposit
                </Button>
              </div>
            )}
            {/* Token List */}
            <div className="token-list" role="list" id="token-panel">
              {sortedTokens.map((t, i) => (
                <TokenRow
                  key={t.name} t={t} index={i}
                  showApyInfo={i === 0}
                  apyTooltipOpen={apyTooltipOpen}
                  setApyTooltipOpen={setApyTooltipOpen}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.div
            role="tabpanel"
            id="nft-panel"
            aria-labelledby="tab-nfts"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: m.fade.enter }}
            style={{ padding: '40px 20px', textAlign: 'center' }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>🖼️</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--bk-text-primary)', marginBottom: 6 }}>No NFTs yet</div>
            <div style={{ fontSize: 13, color: 'var(--bk-text-muted)', lineHeight: 1.5 }}>
              NFTs you receive will appear here. Explore collections on your favourite marketplace.
            </div>
          </motion.div>
        )}

      </div>

      <BottomNav />

      <AnimatePresence>
        {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
      </AnimatePresence>
    </motion.main>
  );
}