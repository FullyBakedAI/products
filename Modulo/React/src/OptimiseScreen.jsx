/**
 * OptimiseScreen — "Put It All To Work" detail (Feature 1)
 * Route: /optimise (modal slide-up)
 * Shows per-token protocol recommendations with APY + estimated yield/yr.
 * Confirm & Deploy → /success + triggers UndoToast.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, animate } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
const IconChevronLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
import { useUndoToast } from './UndoToastContext';

import logoModulo from './assets/logo-modulo.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenUsdt from './assets/token-usdt.svg';
import './optimise.css';

const RECOMMENDATIONS = [
  { id: 'usdc', icon: tokenUsdc, name: 'USDC', protocol: 'Aave',           apy: 4.8, yieldNum: 256, value: 5343 },
  { id: 'btc',  icon: tokenBtc,  name: 'BTC',  protocol: 'Native staking', apy: 1.8, yieldNum: 101, value: 5617 },
  { id: 'eth',  icon: tokenEth,  name: 'ETH',  protocol: 'Lido',           apy: 3.8, yieldNum: 168, value: 4413 },
  { id: 'sol',  icon: tokenSol,  name: 'SOL',  protocol: 'Marinade',       apy: 6.8, yieldNum: 288, value: 4228 },
  { id: 'usdt', icon: tokenUsdt, name: 'USDT', protocol: 'Compound',       apy: 4.6, yieldNum: 156, value: 3399 },
];

export default function OptimiseScreen() {
  const navigate = useNavigate();
  const { showUndo } = useUndoToast();
  const [selected, setSelected] = useState(new Set(RECOMMENDATIONS.map(r => r.id)));

  // Hero yield count-up on mount
  const [countedUp, setCountedUp]     = useState(false);
  const [mountYield, setMountYield]   = useState(0);
  useEffect(() => {
    const ctrl = animate(0, 969, {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setMountYield(Math.round(v)),
      onComplete: () => setCountedUp(true),
    });
    return ctrl.stop;
  }, []);

  const selectedRecs   = RECOMMENDATIONS.filter(r => selected.has(r.id));
  const selectedCount  = selected.size;
  const totalYield     = selectedRecs.reduce((s, r) => s + r.yieldNum, 0);
  const totalValue     = selectedRecs.reduce((s, r) => s + r.value, 0);
  const weightedApy    = totalValue > 0
    ? selectedRecs.reduce((s, r) => s + r.apy * r.value, 0) / totalValue
    : 0;

  function toggleItem(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDeploy() {
    navigate('/success', {
      state: { action: 'optimise', summary: `${selectedCount} assets across ${selectedCount} protocols` },
    });
    setTimeout(() => {
      showUndo(`Deployed across ${selectedCount} protocols`, () => {});
    }, 600);
  }

  return (
    <motion.main
      role="main"
      aria-label="Optimise — Put It All To Work"
      className="optimise-screen"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      {/* Back button — full-width tap target */}
      <Button className="optimise-back-btn" aria-label="Go back" onPress={() => navigate('/')}>
        <IconChevronLeft size={18} />
        Back
      </Button>

      <div className="scroll-content">
        {/* Hero */}
        <div className="optimise-hero">
          <img src={logoModulo} alt="Modulo" height="24" aria-hidden="true" />
          <p className="optimise-hero-sub">
            Deploy all assets to the highest-yield protocols. One tap, fully optimised.
          </p>
          <div className="optimise-yield-hero" role="status" aria-live="polite" aria-label={`Estimated annual yield: $${totalYield}`}>
            <motion.span
              className="optimise-yield-amount"
              key={countedUp ? totalYield : 'mount'}
              animate={{ opacity: [0.6, 1] }}
              transition={m.valueUpdate}
            >
              +${countedUp ? totalYield.toLocaleString() : mountYield}
            </motion.span>
            <span className="optimise-yield-period">/yr estimated</span>
          </div>
        </div>

        {/* Summary stats */}
        <div className="optimise-stats-row">
          <div className="optimise-stat">
            <span className="optimise-stat-value">{weightedApy.toFixed(1)}%</span>
            <span className="optimise-stat-label">avg APY</span>
          </div>
          <div className="optimise-stat-divider" />
          <div className="optimise-stat">
            <span className="optimise-stat-value">${totalValue.toLocaleString()}</span>
            <span className="optimise-stat-label">total deployed</span>
          </div>
        </div>

        {/* Per-token recommendations */}
        <div className="optimise-list" role="list" aria-label="Token recommendations">
          {RECOMMENDATIONS.map((rec, i) => {
            const isOn = selected.has(rec.id);
            return (
              <motion.div
                key={rec.id}
                className={`optimise-row${isOn ? '' : ' optimise-row--off'}`}
                role="listitem"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isOn ? 1 : 0.45, y: 0 }}
                transition={{
                  opacity: m.valueUpdate,
                  y: { ...m.fade.enter, delay: 0.06 + i * 0.05 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="optimise-row-btn"
                  aria-label={`${isOn ? 'Deselect' : 'Select'} ${rec.name}`}
                  onPress={() => toggleItem(rec.id)}
                >
                  <img className="optimise-token-icon" src={rec.icon} alt={rec.name} />
                  <div className="optimise-row-info">
                    <div className="optimise-row-token">{rec.name}</div>
                    <div className="optimise-row-protocol">{rec.protocol}</div>
                  </div>
                  <div className="optimise-row-right">
                    <div className="optimise-row-apy">{rec.apy}% APY</div>
                    <div className="optimise-row-yield">+${rec.yieldNum}/yr</div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Total */}
        <div className="optimise-total-row" aria-label={`Total estimated yield: $${totalYield} per year`} role="status" aria-live="polite">
          <span className="optimise-total-label">Total estimated yield</span>
          <motion.span
            className="optimise-total-value"
            key={totalYield}
            animate={{ opacity: [0.5, 1] }}
            transition={m.valueUpdate}
          >+${totalYield} / yr</motion.span>
        </div>
      </div>

      <Button
        className="primary-btn"
        aria-label={selectedCount > 0 ? `Deploy ${selectedCount} of ${RECOMMENDATIONS.length} assets` : 'No assets selected'}
        isDisabled={selectedCount === 0}
        onPress={handleDeploy}
      >
        {selectedCount > 0 ? `Deploy ${selectedCount} of ${RECOMMENDATIONS.length} assets` : 'Select assets to deploy'}
      </Button>
    </motion.main>
  );
}
