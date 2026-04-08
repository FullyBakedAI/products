/**
 * HomeScreenV1 — Frozen snapshot of HomeScreen at modulo-v1 tag.
 * Do NOT edit logic. Import paths adjusted for v1/ subdirectory.
 */

import { useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { motion as m } from '../motion-tokens';
import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../StatusBar';
import BottomNav from '../BottomNav';
import '../home.css';

import {
  Bell, Settings, TrendingUp, ArrowRightLeft,
  Send, Download, Zap,
} from 'lucide-react';
import { useIconOverride } from '../IconOverrideContext';

import logoModulo from '../assets/logo-modulo.svg';
import chartLine from '../assets/chart-line.svg';
import tokenUsdc from '../assets/token-usdc.svg';
import tokenBtc from '../assets/token-btc.svg';
import tokenEth from '../assets/token-eth.svg';
import tokenSol from '../assets/token-sol.svg';
import tokenUsdt from '../assets/token-usdt.svg';

const TIME_PERIODS = ['1D', '1W', '1M', '1Y', 'ALL'];

const TOKENS = [
  { icon: tokenUsdc, name: 'USD Coin', amount: '5,342.9824 USDC', usd: '$5,342.98', change: '+0.00%', negative: false, yield: 0.048, yieldUsd: '$256.46' },
  { icon: tokenBtc,  name: 'Bitcoin',  amount: '0.0574 BTC',      usd: '$5,616.88', change: '+2.14%', negative: false, yield: 0.018, yieldUsd: '$101.10' },
  { icon: tokenEth,  name: 'Ethereum', amount: '1.1421 ETH',      usd: '$4,412.82', change: '+4.38%', negative: false, yield: 0.038, yieldUsd: '$167.69' },
  { icon: tokenSol,  name: 'Solana',   amount: '17.4352 SOL',     usd: '$4,228.38', change: '-1.82%', negative: true,  yield: 0.068, yieldUsd: '$287.53' },
  { icon: tokenUsdt, name: 'Tether',   amount: '3,398.7553 USDT', usd: '$3,398.75', change: '+0.00%', negative: false, yield: 0.046, yieldUsd: '$156.34' },
];

const MAX_YIELD   = Math.max(...TOKENS.map(t => t.yield));
const ACTION_W    = 180; // 3 actions × 60px

const SWIPE_ACTIONS = [
  { id: 'earn', label: 'Earn',  Icon: Zap,              cls: 'swipe-earn' },
  { id: 'send', label: 'Send',  Icon: Send,             cls: 'swipe-send' },
  { id: 'swap', label: 'Swap',  Icon: ArrowRightLeft,   cls: 'swipe-swap' },
];

function TokenRow({ t, index }) {
  const x = useMotionValue(0);

  function snap(open) {
    animate(x, open ? -ACTION_W : 0, { type: 'spring', stiffness: 260, damping: 26, mass: 0.7 });
  }

  function handleDragEnd(_, info) {
    const open = info.velocity.x < -300 || info.offset.x < -(ACTION_W / 2);
    snap(open);
  }

  return (
    <motion.div
      className="token-row-outer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.12 + index * 0.05 } }}
    >
      {/* ── Actions revealed on swipe ── */}
      <div className="token-swipe-actions">
        {SWIPE_ACTIONS.map(({ id, label, Icon, cls }) => (
          <button
            key={id}
            className={`swipe-action ${cls}`}
            onClick={() => snap(false)}
            aria-label={`${label} ${t.name}`}
          >
            <Icon size={18} strokeWidth={1.5} />
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
        aria-label={`${t.name}: ${t.usd}, ${t.change}, ${(t.yield * 100).toFixed(1)}% APY`}
      >
        {/* Main row */}
        <div className="token-row-main">
          <img className="token-icon-lg" src={t.icon} alt={t.name} />
          <div className="token-info">
            <div className="token-name-row">
              <span className="token-name-text">{t.name}</span>
              <span className={`token-change${t.negative ? ' negative' : ''}`}>{t.change}</span>
            </div>
            <div className="token-amount">{t.amount}</div>
          </div>
          <div className="token-values">
            <div className="token-usd">{t.usd}</div>
            <div className="token-yield-usd">
              {t.yieldUsd}<span className="token-yield-usd-label">/yr</span>
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

export default function HomeScreenV1() {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('1D');
  const { getIcon } = useIconOverride();
  const BuyIcon     = getIcon('action-buy');
  const SendIcon    = getIcon('action-send');
  const ReceiveIcon = getIcon('action-receive');

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
          <Button className="icon-btn" aria-label="Notifications" onPress={() => {}}>
            <Bell size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <Button className="icon-btn" aria-label="Settings" onPress={() => {}}>
            <Settings size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="scroll-content">

        {/* Portfolio Card */}
        <motion.section
          className="portfolio-card"
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
            <TrendingUp size={14} color="var(--bk-success)" strokeWidth={2} aria-hidden="true" />
            <span className="gain-text">$623.11 (5.08%)</span>
          </div>
        </motion.section>

        {/* Action Buttons */}
        <motion.div
          className="action-row"
          role="group"
          aria-label="Quick actions"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.08 } }}
        >
          <Button className="action-btn" aria-label="Swap tokens" onPress={() => navigate('/swap')}>
            <ArrowRightLeft size={20} color="var(--bk-brand-primary)" strokeWidth={1.5} aria-hidden="true" />
            <span className="action-label">Swap</span>
          </Button>
          <Button className="action-btn" aria-label="Buy tokens" onPress={() => {}}>
            <BuyIcon size={20} color="var(--bk-brand-primary)" strokeWidth={1.5} aria-hidden="true" />
            <span className="action-label">Buy</span>
          </Button>
          <Button className="action-btn" aria-label="Send tokens" onPress={() => navigate('/send')}>
            <SendIcon size={20} color="var(--bk-brand-primary)" strokeWidth={1.5} aria-hidden="true" />
            <span className="action-label">Send</span>
          </Button>
          <Button className="action-btn" aria-label="Receive tokens" onPress={() => navigate('/receive')}>
            <ReceiveIcon size={20} color="var(--bk-brand-primary)" strokeWidth={1.5} aria-hidden="true" />
            <span className="action-label">Receive</span>
          </Button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="tabs"
          role="tablist"
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
          role="region"
          aria-label="Earn — Annual Yield Accrual"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.46 } }}
        >
          <div>
            <div className="earn-label">Annual Yield Accrual</div>
            <div className="earn-value-row">
              <span className="earn-value">0.97</span>
              <span className="earn-unit">k USD</span>
            </div>
          </div>
          <Button className="earn-btn" aria-label="Go to Earn" onPress={() => {}}>
            Earn →
          </Button>
        </motion.div>

      </div>

      <BottomNav />
    </motion.main>
  );
}
