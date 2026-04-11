/**
 * AssetScreen — asset command centre
 *
 * Chart improvements (TradingView-inspired):
 *   - Trend-direction fill: green gradient when positive, red when negative
 *   - Floating crosshair price label: follows the cursor/touch, shows price at point
 *   - Live period switch: updates series data without recreating the chart
 *
 * Earn prominence (Ledger Live-inspired):
 *   - APY + projected earn displayed as prominently as the current price
 *
 * Route: /asset/:id  (modal slide-up)
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useActions } from './ActionsContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconArrowUp = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 15V5M10 5L6 9M10 5L14 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconArrowDown = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 5V15M10 15L6 11M10 15L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconZap = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M11 3L4 11H10L9 17L16 9H10L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const IconLandmark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 16H17M3 8H17M10 4L3 8M10 4L17 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8V16M10 8V16M14 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconTrendingUp = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconExternalLink = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M9 5H5C4.45 5 4 5.45 4 6V15C4 15.55 4.45 16 5 16H14C14.55 16 15 15.55 15 15V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 4H16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
import { createChart, AreaSeries } from 'lightweight-charts';
import './asset.css';

import iconSettings   from './assets/icon-settings.svg';
import iconActionSend from './assets/icon-action-send.svg';
import iconActionRecv from './assets/icon-action-receive.svg';
import iconActionSwap from './assets/icon-action-swap.svg';

import tokenUsdc from './assets/token-usdc.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenUsdt from './assets/token-usdt.svg';

// ─── Token data ───────────────────────────────────────────────────────────────

const TOKEN_MAP = {
  usdc: {
    icon: tokenUsdc, name: 'USD Coin', symbol: 'USDC',
    amount: '5,342.9824', usd: 5342.98, change24h: 0.00, negative: false,
    yield: 0.048, yieldUsd: 256.46,
    priceRange: [0.999, 1.001], chainPrice: '$1.00',
    chains: [{ name: 'Ethereum', amount: '3,000', usd: '$3,000' }, { name: 'Arbitrum', amount: '2,342.98', usd: '$2,342.98' }],
    activePositions: [
      { type: 'lend', protocol: 'Aave v3', chain: 'Ethereum', amount: '3,000 USDC', apy: 3.8, earnPerYear: '$114/yr' },
    ],
    about: 'USD Coin is a fully-reserved stablecoin pegged 1:1 to the US dollar. Issued by Circle, each USDC is backed by cash and short-duration US Treasuries held in regulated US financial institutions.',
    news: [
      { title: 'Circle files for US IPO, valuing firm at $5B', source: 'Bloomberg', age: '2h', sentiment: 'positive' },
      { title: 'USDC supply hits all-time high of $43B on-chain', source: 'The Block', age: '8h', sentiment: 'positive' },
      { title: 'Aave v3 USDC lending rates rise amid surge in borrowing demand', source: 'DeFiLlama', age: '1d', sentiment: 'neutral' },
    ],
  },
  btc: {
    icon: tokenBtc, name: 'Bitcoin', symbol: 'BTC',
    amount: '0.0574', usd: 5616.88, change24h: 2.14, negative: false,
    yield: 0.018, yieldUsd: 101.10,
    priceRange: [90000, 105000], chainPrice: '$97,855',
    chains: [{ name: 'Bitcoin', amount: '0.0574', usd: '$5,616.88' }],
    activePositions: [],
    about: 'Bitcoin is the original decentralised cryptocurrency, secured by proof-of-work mining. With a fixed supply of 21 million coins, it is widely held as a long-term store of value and a hedge against inflation.',
    news: [
      { title: 'BlackRock Bitcoin ETF records $480M single-day inflow', source: 'CoinDesk', age: '3h', sentiment: 'positive' },
      { title: 'BTC breaks $100K resistance for third time this month', source: 'CryptoSlate', age: '6h', sentiment: 'positive' },
      { title: 'US spot Bitcoin ETFs see combined AUM top $60B', source: 'Bloomberg', age: '1d', sentiment: 'neutral' },
    ],
  },
  eth: {
    icon: tokenEth, name: 'Ethereum', symbol: 'ETH',
    amount: '1.1421', usd: 4412.82, change24h: 4.38, negative: false,
    yield: 0.038, yieldUsd: 167.69,
    priceRange: [3600, 4600], chainPrice: '$3,864',
    chains: [{ name: 'Ethereum', amount: '0.6421', usd: '$2,481' }, { name: 'Base', amount: '0.5', usd: '$1,932' }],
    activePositions: [
      { type: 'stake', protocol: 'Lido', chain: 'Ethereum', amount: '1.0 ETH', apy: 4.2, earnPerYear: '$167/yr' },
    ],
    about: 'Ethereum is the leading smart contract platform, powering DeFi, NFTs, and thousands of decentralised applications. Its proof-of-stake consensus burns ETH with each transaction, making it a deflationary asset over time.',
    news: [
      { title: 'Ethereum Pectra upgrade confirmed for May — staking limit raised to 2048 ETH', source: 'Decrypt', age: '4h', sentiment: 'positive' },
      { title: 'Layer 2 TVL crosses $50B for first time, led by Base and Arbitrum', source: 'L2Beat', age: '12h', sentiment: 'positive' },
      { title: 'Lido staking share dips below 28% as solo staking grows', source: 'Blockworks', age: '2d', sentiment: 'neutral' },
    ],
  },
  sol: {
    icon: tokenSol, name: 'Solana', symbol: 'SOL',
    amount: '17.4352', usd: 4228.38, change24h: -1.82, negative: true,
    yield: 0.068, yieldUsd: 287.53,
    priceRange: [220, 280], chainPrice: '$242',
    chains: [{ name: 'Solana', amount: '17.4352', usd: '$4,228.38' }],
    activePositions: [],
    about: 'Solana is a high-performance blockchain capable of 65,000 transactions per second with sub-cent fees. Its combination of proof-of-stake and proof-of-history makes it a leading platform for consumer apps, DeFi, and memecoins.',
    news: [
      { title: 'Solana network congestion causes delays during memecoin surge', source: 'CoinTelegraph', age: '5h', sentiment: 'negative' },
      { title: 'Firedancer validator client goes live on mainnet', source: 'The Block', age: '1d', sentiment: 'positive' },
      { title: 'Solana DEX volume overtakes Ethereum for second consecutive week', source: 'DeFiLlama', age: '2d', sentiment: 'positive' },
    ],
  },
  usdt: {
    icon: tokenUsdt, name: 'Tether', symbol: 'USDT',
    amount: '3,398.7553', usd: 3398.75, change24h: 0.00, negative: false,
    yield: 0.046, yieldUsd: 156.34,
    priceRange: [0.999, 1.001], chainPrice: '$1.00',
    chains: [{ name: 'Ethereum', amount: '3,398.7553', usd: '$3,398.75' }],
    activePositions: [],
    about: 'Tether (USDT) is the world\'s largest stablecoin by market cap, pegged to the US dollar. It operates across 15+ blockchains and accounts for the majority of global crypto trading volume.',
    news: [
      { title: 'Tether reports $4.5B profit in Q1 2026, backed by US Treasury holdings', source: 'Reuters', age: '1d', sentiment: 'positive' },
      { title: 'USDT market cap surpasses $110B as demand grows in emerging markets', source: 'CoinDesk', age: '2d', sentiment: 'positive' },
      { title: 'EU MiCA enforcement puts pressure on USDT issuance in Europe', source: 'Blockworks', age: '3d', sentiment: 'negative' },
    ],
  },
};

// ─── Chart data ───────────────────────────────────────────────────────────────

function generateChartData(symbol, period) {
  const token = TOKEN_MAP[symbol];
  if (!token) return [];
  const [lo, hi] = token.priceRange;
  const mid = (lo + hi) / 2;
  const now = Math.floor(Date.now() / 1000);
  const configs = {
    '1D':  { points: 48, step: 1800    },
    '1W':  { points: 84, step: 7200    },
    '1M':  { points: 60, step: 43200   },
    '1Y':  { points: 52, step: 604800  },
    'ALL': { points: 60, step: 2592000 },
  };
  const { points, step } = configs[period] || configs['1D'];
  let price = mid;
  return Array.from({ length: points + 1 }, (_, i) => {
    const time = now - (points - i) * step;
    const drift = (mid - price) * 0.08;
    const noise = (Math.random() - 0.5) * (hi - lo) * 0.06;
    price = Math.max(lo, Math.min(hi, price + drift + noise));
    const decimals = (symbol === 'usdc' || symbol === 'usdt') ? 4 : 2;
    return { time, value: parseFloat(price.toFixed(decimals)) };
  });
}

// ─── Price chart — live period switch, crosshair float label ─────────────────

function PriceChart({ symbol, period, negative, onCrosshairPrice }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const seriesRef    = useRef(null);

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const chart = createChart(el, {
      width:  el.clientWidth,
      height: 130,
      layout: {
        background:  { type: 'solid', color: 'transparent' },
        textColor:   'rgba(135,135,140,0)',  // hide axis labels for clean look
        fontSize:    10,
        fontFamily:  "'Inter', sans-serif",
      },
      grid:            { vertLines: { visible: false }, horzLines: { visible: false } },
      crosshair:       { mode: 1 },
      rightPriceScale: { visible: false },  // hide price axis — we show floating label
      timeScale:       { visible: false },  // hide time axis — clean chart
      handleScroll:    false,
      handleScale:     false,
    });

    const lineColor = negative ? '#F04348' : '#584BEB';
    const topColor  = negative ? 'rgba(240,67,72,0.25)' : 'rgba(88,75,235,0.25)';

    const series = chart.addSeries(AreaSeries, {
      lineColor,
      topColor,
      bottomColor:                    'rgba(0,0,0,0)',
      lineWidth:                      2,
      priceLineVisible:               false,
      lastValueVisible:               false,
      crosshairMarkerVisible:         true,
      crosshairMarkerRadius:          5,
      crosshairMarkerBorderColor:     lineColor,
      crosshairMarkerBackgroundColor: lineColor,
    });

    const data = generateChartData(symbol, period);
    series.setData(data);
    chart.timeScale().fitContent();

    // Floating price label on crosshair move
    chart.subscribeCrosshairMove(param => {
      if (param.point && param.seriesData.size > 0) {
        const entry = param.seriesData.get(series);
        if (entry) onCrosshairPrice(entry.value, param.point.x / el.clientWidth);
      } else {
        onCrosshairPrice(null, null);
      }
    });

    chartRef.current  = chart;
    seriesRef.current = series;

    const ro = new ResizeObserver(() => { chart.applyOptions({ width: el.clientWidth }); });
    ro.observe(el);
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; };
  }, [symbol, negative]); // recreate only when asset changes

  // Live period switch — update data without recreating chart
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;
    const data = generateChartData(symbol, period);
    seriesRef.current.setData(data);
    chartRef.current.timeScale().fitContent();
  }, [period]); // eslint-disable-line

  return <div ref={containerRef} className="asset-chart-canvas" aria-hidden="true" />;
}

// ─── Main screen ──────────────────────────────────────────────────────────────

const PERIODS  = ['1D', '1W', '1M', '1Y', 'ALL'];
const MAX_YIELD = 0.068;
const fmt = (n) => n >= 10000
  ? `$${(n / 1000).toFixed(1)}k`
  : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AssetScreen() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { openActions } = useActions();
  const [period, setPeriod]             = useState('1D');
  const [crosshairPrice, setCrosshair]  = useState(null);  // floating label value
  const [crosshairX, setCrosshairX]     = useState(null);  // 0–1 normalized
  const t = TOKEN_MAP[id];

  const handleCrosshair = useCallback((price, x) => {
    setCrosshair(price);
    setCrosshairX(x);
  }, []);

  if (!t) {
    return (
      <motion.div className="swap-screen-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--bk-text-muted)' }}>Asset not found.</div>
      </motion.div>
    );
  }

  const changeSign  = t.change24h > 0 ? '+' : '';
  const changeColor = t.negative ? 'var(--bk-error)' : 'var(--bk-success)';
  const lineColor   = t.negative ? '#F04348' : '#584BEB';

  // Price shown: crosshair override when scrubbing, else current price
  const displayPrice = crosshairPrice
    ? (crosshairPrice >= 1000
        ? `$${crosshairPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
        : `$${crosshairPrice.toFixed(crosshairPrice < 2 ? 4 : 2)}`)
    : t.chainPrice;

  return (
    <motion.div
      role="main"
      aria-label={`${t.name} detail`}
      className="swap-screen-inner asset-screen"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      {/* StatusBar removed — modal screen, real device draws its own */}

      {/* ── Header — SwapScreen pattern ── */}
      <div className="swap-header">
        <div className="header-left">
          <Button className="close-btn" aria-label="Back" onPress={() => navigate('/')}>
            <IconX />
          </Button>
          <div className="asset-header-title">
            <img src={t.icon} alt="" width="20" height="20" style={{ borderRadius: '50%', display: 'block' }} />
            <h1 className="swap-title">{t.name}</h1>
          </div>
        </div>
        <Button className="settings-btn" aria-label="More options" onPress={() => navigate('/settings')}>
          <img src={iconSettings} width="20" height="20" aria-hidden="true" />
        </Button>
      </div>

      <div className="scroll-content asset-scroll">

        {/* ── Price + chart ── */}
        <div className="asset-price-section">
          {/* Price row — large, light weight (Coinbase) */}
          <div className="asset-price-row">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={displayPrice}
                className="swap-amount asset-price-value"
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.6 }}
                transition={{ duration: 0.1 }}
              >
                <span className="amount-text">{displayPrice}</span>
              </motion.span>
            </AnimatePresence>
            {!crosshairPrice && (
              <span className="asset-change-badge" style={{ color: changeColor }}>
                {t.negative
                  ? <IconArrowDown size={12} />
                  : <IconArrowUp   size={12} />
                }
                {changeSign}{Math.abs(t.change24h).toFixed(2)}% today
              </span>
            )}
          </div>

          {/* Earn metric — Ledger Live: as prominent as the price */}
          <div className="asset-earn-row">
            <div className="asset-earn-metric">
              <span className="asset-earn-apy" style={{ color: lineColor }}>
                {(t.yield * 100).toFixed(1)}% APY
              </span>
              <span className="asset-earn-projected">
                {fmt(t.yieldUsd)} projected / year
              </span>
            </div>
          </div>

          {/* Chart — trend-direction fill, crosshair float label */}
          <motion.div
            className="asset-chart-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...m.fade.enter, delay: 0.18 }}
          >
            <PriceChart
              symbol={id}
              period={period}
              negative={t.negative}
              onCrosshairPrice={handleCrosshair}
            />
          </motion.div>

          {/* Period pills — home.css .time-btn */}
          <div className="time-periods asset-period-tabs" role="group" aria-label="Chart period">
            {PERIODS.map(p => (
              <Button
                key={p}
                className={`time-btn${period === p ? ' active' : ''}`}
                aria-pressed={period === p}
                onPress={() => setPeriod(p)}
              >{p}</Button>
            ))}
          </div>
        </div>

        {/* ── Position ── */}
        <div className="asset-position-wrap">
          <div className="asset-position-card">
            <div className="card-label">Your position</div>
            <div className="asset-pos-row">
              <div className="asset-pos-left">
                <img src={t.icon} alt={t.name} width="36" height="36" className="asset-token-img" />
                <div>
                  <div className="asset-pos-amount">{t.amount} {t.symbol}</div>
                </div>
              </div>
              <div className="asset-pos-right">
                <div className="asset-pos-usd">{fmt(t.usd)}</div>
                <div className="asset-pos-change" style={{ color: changeColor }}>
                  {changeSign}{Math.abs(t.change24h).toFixed(2)}% today
                </div>
              </div>
            </div>

            {/* Yield bar */}
            <div className="token-yield-bar-row token-yield-bar-row-top">
              <div className="token-yield-track">
                <motion.div
                  className="token-yield-fill"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: t.yield / MAX_YIELD }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                  style={{ transformOrigin: 'left' }}
                />
              </div>
            </div>

            {/* Chain pills */}
            {t.chains.length > 1 && (
              <div className="asset-chain-pills">
                {t.chains.map(c => (
                  <span key={c.name} className="chain-pill">{c.name} · {c.amount}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Put it to work — swap-card list ── */}
        <div className="asset-section">
          <div className="portfolio-label">Put it to work</div>
          <div className="asset-opp-list">
            {[
              { Icon: IconZap,        label: 'Stake',         sub: `Up to 6.8% APY · Flexible or locked`,   tab: 'lend'   },
              { Icon: IconLandmark,   label: 'Lend & Borrow', sub: 'Earn on idle assets · Use as collateral', tab: 'lend'  },
              { Icon: IconTrendingUp, label: 'Trade',          sub: 'Market & limit orders',                  tab: 'trade' },
            ].map(({ Icon, label, sub, tab }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...m.fade.enter, delay: 0.12 + i * 0.06 }}
                whileTap={{ scale: 0.98 }}
              >
              <Button
                className={`asset-opp-row${i === 0 ? ' first' : i === 2 ? ' last' : ''}`}
                onPress={() => openActions({ tab, asset: id })}
                aria-label={label}
                style={{ width: '100%' }}>
                <Icon size={20} strokeWidth={1.5} color="var(--bk-brand-primary)" aria-hidden="true" />
                <div className="asset-opp-text">
                  <span className="asset-opp-label">{label}</span>
                  <span className="card-label">{sub}</span>
                </div>
                <span className="asset-opp-chevron">›</span>
              </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Active positions ── */}
        {t.activePositions.length > 0 && (
          <div className="asset-section-top">
            <div className="portfolio-label">Active positions</div>
            {t.activePositions.map((pos, i) => {
              const PosIcon = pos.type === 'stake' ? IconZap : IconLandmark;
              return (
                <div key={i} className="asset-active-card">
                  <div className="asset-pos-row asset-pos-row-wrap">
                    <div className="asset-pos-left">
                      <PosIcon size={18} strokeWidth={1.5} color="var(--bk-brand-primary)" aria-hidden="true" />
                      <div>
                        <div className="token-name-text">{pos.protocol}</div>
                        <div className="token-amount">{pos.chain}</div>
                      </div>
                    </div>
                    <span className="asset-active-badge">Active</span>
                  </div>
                  <div className="asset-pos-stats">
                    {[['Position', pos.amount, false], ['APY', `${pos.apy}%`, true], ['Earning', pos.earnPerYear, true]].map(([lbl, val, green]) => (
                      <div key={lbl} className="asset-pos-stat">
                        <div className="card-label">{lbl}</div>
                        <div className={`asset-pos-stat-value${green ? ' positive' : ''}`}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="bottom-cta-btn cta-disabled asset-manage-btn"
                    aria-label={`Manage ${pos.protocol}`}
                    onPress={() => openActions({ tab: 'lend', asset: id })}>
                    Manage position →
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── About ── */}
        <div className="asset-section-top">
          <div className="portfolio-label">About {t.name}</div>
          <p className="asset-about-text">{t.about}</p>
        </div>

        {/* ── News ── */}
        <div className="asset-section-top">
          <div className="portfolio-label">News</div>
          <div className="asset-news-list">
            {t.news.map((item, i) => (
              <div key={i} className="asset-news-row">
                <div className="asset-news-body">
                  <span className="asset-news-title">{item.title}</span>
                  <div className="asset-news-meta">
                    <span className="asset-news-source">{item.source}</span>
                    <span className="asset-news-dot">·</span>
                    <span className="asset-news-age">{item.age}</span>
                  </div>
                </div>
                {item.sentiment !== 'neutral' && (
                  <span className={`asset-news-sentiment asset-news-sentiment--${item.sentiment}`}>
                    {item.sentiment === 'positive' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contract */}
        <div className="asset-contract-row">
          <span className="card-label">Contract</span>
          <Button className="asset-contract-btn" aria-label="View on explorer" onPress={() => navigate('/activity')}>
            0x2260…1d1e <IconExternalLink />
          </Button>
        </div>

      </div>

      {/* ── Sticky bottom action bar ── */}
      <nav className="asset-bottom-bar" aria-label="Quick actions">
        {[
          { label: 'Send',    src: iconActionSend, action: () => navigate('/send')                 },
          { label: 'Receive', src: iconActionRecv, action: () => navigate('/receive')              },
          { label: 'Swap',    src: iconActionSwap, action: () => navigate('/swap')                 },
          { label: 'Actions', Icon: IconZap,        action: () => openActions({ asset: id }) },
        ].map(({ label, src, Icon, action }) => (
          <motion.div key={label} whileTap={{ scale: 0.88 }}>
            <Button className="asset-bar-btn" aria-label={label} onPress={action}>
              {src
                ? <img src={src} width="20" height="20" aria-hidden="true" />
                : <Icon size={20} color="var(--bk-brand-primary)" strokeWidth={1.5} aria-hidden="true" />
              }
              <span className="asset-bar-label">{label}</span>
            </Button>
          </motion.div>
        ))}
      </nav>
    </motion.div>
  );
}
