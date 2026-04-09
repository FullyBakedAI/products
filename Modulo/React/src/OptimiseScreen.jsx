/**
 * OptimiseScreen — "Put It All To Work" detail (Feature 1)
 * Route: /optimise (modal slide-up)
 * Shows per-token protocol recommendations with APY + estimated yield/yr.
 * Confirm & Deploy → /success + triggers UndoToast.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { ChevronLeft } from 'lucide-react';
import { useUndoToast } from './UndoToastContext';

import logoModulo from './assets/logo-modulo.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenUsdt from './assets/token-usdt.svg';
import './optimise.css';

const RECOMMENDATIONS = [
  { id: 'usdc', icon: tokenUsdc, name: 'USDC', protocol: 'Aave',           apy: 4.8, yieldNum: 256 },
  { id: 'btc',  icon: tokenBtc,  name: 'BTC',  protocol: 'Native staking', apy: 1.8, yieldNum: 101 },
  { id: 'eth',  icon: tokenEth,  name: 'ETH',  protocol: 'Lido',           apy: 3.8, yieldNum: 168 },
  { id: 'sol',  icon: tokenSol,  name: 'SOL',  protocol: 'Marinade',       apy: 6.8, yieldNum: 288 },
  { id: 'usdt', icon: tokenUsdt, name: 'USDT', protocol: 'Compound',       apy: 4.6, yieldNum: 156 },
];

export default function OptimiseScreen() {
  const navigate = useNavigate();
  const { showUndo } = useUndoToast();
  const [selected, setSelected] = useState(new Set(RECOMMENDATIONS.map(r => r.id)));

  const selectedCount = selected.size;
  const total = RECOMMENDATIONS.reduce((sum, r) => selected.has(r.id) ? sum + r.yieldNum : sum, 0);

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
      <header className="optimise-header">
        <Button className="icon-btn" aria-label="Go back" onPress={() => navigate('/')}>
          <ChevronLeft size={20} color="var(--bk-text-primary)" strokeWidth={1.5} />
        </Button>
        <div aria-hidden="true" style={{ width: 20 }} />
      </header>

      <div className="scroll-content">
        {/* Hero */}
        <div className="optimise-hero">
          <img src={logoModulo} alt="Modulo" height="24" aria-hidden="true" />
          <p className="optimise-hero-sub">
            Deploy all assets to the highest-yield protocols. One tap, fully optimised.
          </p>
          <div className="optimise-yield-hero" role="status" aria-live="polite" aria-label={`Estimated annual yield: $${total}`}>
            <span className="optimise-yield-amount">+${total.toLocaleString()}</span>
            <span className="optimise-yield-period">/yr estimated</span>
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
                animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.06 + i * 0.05 } }}
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
        <div className="optimise-total-row" aria-label={`Total estimated yield: $${total} per year`} role="status" aria-live="polite">
          <span className="optimise-total-label">Total estimated yield</span>
          <span className="optimise-total-value">+${total} / yr</span>
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
