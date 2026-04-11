/**
 * SimulateScreen — "What if?" simulator (Feature 5)
 * Route: /simulate (modal slide-up)
 * Tab 1: BTC price slider → live-updating portfolio projections
 * Tab 2: Staking comparison → animated bar chart
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';

const MotionButton = motion.create(Button);
const IconChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconTrendingUp = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

import tokenUsdc from './assets/token-usdc.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenUsdt from './assets/token-usdt.svg';
import './simulate.css';

const MIN_BTC = 50_000;
const MAX_BTC = 200_000;
const BASE_BTC_PRICE = 97_900;

const TOKENS_DATA = [
  { id: 'usdc', icon: tokenUsdc, name: 'USDC', value: 5342.98, btcBeta: 0,    baseYield: 256 },
  { id: 'btc',  icon: tokenBtc,  name: 'BTC',  value: 5616.88, btcBeta: 1.0,  baseYield: 101 },
  { id: 'eth',  icon: tokenEth,  name: 'ETH',  value: 4412.82, btcBeta: 0.75, baseYield: 168 },
  { id: 'sol',  icon: tokenSol,  name: 'SOL',  value: 4228.38, btcBeta: 0.85, baseYield: 288 },
  { id: 'usdt', icon: tokenUsdt, name: 'USDT', value: 3398.75, btcBeta: 0,    baseYield: 156 },
];

const TOTAL_BASE      = TOKENS_DATA.reduce((s, t) => s + t.value, 0);
const CURRENT_YIELD   = 969;
const OPTIMISED_YIELD = 1247;

function fmt(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export default function SimulateScreen() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState('price');
  const [btcPrice, setBtcPrice] = useState(100_000);

  const priceRatio = btcPrice / BASE_BTC_PRICE;

  function projected(token) {
    return token.value * (1 + (priceRatio - 1) * token.btcBeta);
  }

  const totalProjected = TOKENS_DATA.reduce((s, t) => s + projected(t), 0);
  const totalDiff      = totalProjected - TOTAL_BASE;
  const sliderPct      = ((btcPrice - MIN_BTC) / (MAX_BTC - MIN_BTC) * 100).toFixed(1);

  return (
    <motion.main
      role="main"
      aria-label="What-if simulator"
      className="simulate-screen"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <header className="simulate-header">
        <Button className="icon-btn" aria-label="Go back" onPress={() => navigate('/')}>
          <IconChevronLeft />
        </Button>
        <h1 className="simulate-title">What if?</h1>
        <div aria-hidden="true" style={{ width: 20 }} />
      </header>

      {/* Tab bar */}
      <div className="simulate-tabs" role="tablist" aria-label="Simulator mode">
        <MotionButton
          className={`simulate-tab${tab === 'price' ? ' active' : ''}`}
          role="tab"
          aria-selected={tab === 'price'}
          aria-controls="panel-price"
          id="tab-price"
          whileTap={{ scale: 0.95 }}
          onPress={() => setTab('price')}
        >
          Price change
        </MotionButton>
        <MotionButton
          className={`simulate-tab${tab === 'stake' ? ' active' : ''}`}
          role="tab"
          aria-selected={tab === 'stake'}
          aria-controls="panel-stake"
          id="tab-stake"
          whileTap={{ scale: 0.95 }}
          onPress={() => setTab('stake')}
        >
          If I staked everything
        </MotionButton>
      </div>

      <div className="scroll-content">
        <AnimatePresence mode="wait" initial={false}>
          {tab === 'price' ? (
            <motion.div
              key="price"
              id="panel-price"
              role="tabpanel"
              aria-labelledby="tab-price"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: m.fade.enter }}
              exit={{ opacity: 0, transition: m.fade.exit }}
            >
              {/* Slider */}
              <div className="simulate-slider-section">
                <div className="simulate-slider-label">
                  <span>If BTC hits…</span>
                  <span className="simulate-slider-value">
                    ${(btcPrice / 1000).toFixed(0)}k
                  </span>
                </div>
                <input
                  type="range"
                  className="simulate-slider"
                  min={MIN_BTC}
                  max={MAX_BTC}
                  step={1000}
                  value={btcPrice}
                  style={{ '--slider-progress': `${sliderPct}%` }}
                  onChange={e => setBtcPrice(Number(e.target.value))}
                  aria-label="BTC price target"
                  aria-valuemin={MIN_BTC}
                  aria-valuemax={MAX_BTC}
                  aria-valuenow={btcPrice}
                  aria-valuetext={`$${(btcPrice / 1000).toFixed(0)}k`}
                />
                <div className="simulate-slider-range" aria-hidden="true">
                  <span>$50k</span>
                  <span>$200k</span>
                </div>
              </div>

              {/* Summary */}
              <div className="simulate-summary-card" aria-label="Portfolio summary">
                <div className="simulate-summary-row">
                  <span className="simulate-summary-label">Portfolio now</span>
                  <span className="simulate-summary-val">${fmt(TOTAL_BASE)}</span>
                </div>
                <div className="simulate-summary-row">
                  <span className="simulate-summary-label">Projected value</span>
                  <motion.span
                    className={`simulate-summary-val ${totalProjected >= TOTAL_BASE ? 'positive' : 'negative'}`}
                    key={Math.round(totalProjected)}
                    animate={{ opacity: [0.5, 1] }}
                    transition={m.valueUpdate}
                  >
                    ${fmt(totalProjected)}
                  </motion.span>
                </div>
                <div className="simulate-summary-row">
                  <span className="simulate-summary-label">Change</span>
                  <motion.span
                    className={`simulate-summary-val ${totalDiff >= 0 ? 'positive' : 'negative'}`}
                    key={Math.round(totalDiff)}
                    animate={{ opacity: [0.5, 1] }}
                    transition={m.valueUpdate}
                  >
                    {totalDiff >= 0 ? '+' : ''}${fmt(Math.abs(totalDiff))}
                    {' '}({((totalProjected / TOTAL_BASE - 1) * 100).toFixed(1)}%)
                  </motion.span>
                </div>
              </div>

              {/* Per-token projections */}
              <div className="simulate-token-list" role="list" aria-label="Token projections">
                {TOKENS_DATA.map((token, i) => {
                  const proj = projected(token);
                  const diff = proj - token.value;
                  return (
                    <motion.div
                      key={token.id}
                      className="simulate-token-row"
                      role="listitem"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.04 + i * 0.04 } }}
                    >
                      <img className="simulate-token-icon" src={token.icon} alt={token.name} />
                      <div className="simulate-token-info">
                        <div className="simulate-token-name">{token.name}</div>
                        <div className="simulate-token-current">${fmt(token.value)}</div>
                      </div>
                      <div className="simulate-token-right">
                        <motion.div
                          className={`simulate-token-proj ${diff >= 0 ? 'positive' : 'negative'}`}
                          key={Math.round(proj)}
                          animate={{ opacity: [0.55, 1] }}
                          transition={m.valueUpdate}
                        >
                          ${fmt(proj)}
                        </motion.div>
                        <motion.div
                          className={`simulate-token-diff ${diff >= 0 ? 'positive' : 'negative'}`}
                          key={`d${Math.round(diff)}`}
                          animate={{ opacity: [0.55, 1] }}
                          transition={m.valueUpdate}
                        >
                          {diff >= 0 ? '+' : ''}${fmt(Math.abs(diff))}
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stake"
              id="panel-stake"
              role="tabpanel"
              aria-labelledby="tab-stake"
              className="simulate-stake-tab"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: m.fade.enter }}
              exit={{ opacity: 0, transition: m.fade.exit }}
            >
              {/* Intro */}
              <div className="simulate-stake-intro">
                <IconTrendingUp />
                <p>
                  See how much more you'd earn if all assets were staked at optimal rates.
                </p>
              </div>

              {/* Bar chart */}
              <div className="simulate-bar-chart" aria-label="Yield comparison" role="img">
                <div className="simulate-bar-item">
                  <div className="simulate-bar-label">Current yield</div>
                  <motion.div
                    className="simulate-bar current"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: CURRENT_YIELD / OPTIMISED_YIELD }}
                    transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
                    style={{ transformOrigin: 'left' }}
                  />
                  <div className="simulate-bar-value">${CURRENT_YIELD}/yr</div>
                </div>
                <div className="simulate-bar-item">
                  <div className="simulate-bar-label">Optimised yield</div>
                  <motion.div
                    className="simulate-bar optimised"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.65, ease: 'easeOut', delay: 0.22 }}
                    style={{ transformOrigin: 'left' }}
                  />
                  <div className="simulate-bar-value simulate-bar-value-highlight">
                    ${OPTIMISED_YIELD}/yr
                  </div>
                </div>
              </div>

              {/* Per-token staking yield */}
              <div className="simulate-stake-tokens" role="list" aria-label="Per-token staking yield">
                {TOKENS_DATA.map((token, i) => (
                  <motion.div
                    key={token.id}
                    className="simulate-stake-row"
                    role="listitem"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.08 + i * 0.04 } }}
                  >
                    <img className="simulate-token-icon" src={token.icon} alt={token.name} />
                    <div className="simulate-token-info">
                      <div className="simulate-token-name">{token.name}</div>
                      <div className="simulate-token-current">${fmt(token.value)}</div>
                    </div>
                    <div className="simulate-token-right">
                      <div className="simulate-token-proj positive">+${token.baseYield}/yr</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <Button
                className="primary-btn"
                aria-label="Go to Put It All To Work"
                onPress={() => navigate('/optimise')}
              >
                Put It All To Work
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
}
