/**
 * OptimiseScreen — "Put It All To Work" detail (Feature 1)
 * Route: /optimise (modal slide-up)
 * Shows per-token protocol recommendations with APY + estimated yield/yr.
 * Confirm & Deploy → /success + triggers UndoToast.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import StatusBar from './StatusBar';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { useUndoToast } from './UndoToastContext';

import tokenUsdc from './assets/token-usdc.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenUsdt from './assets/token-usdt.svg';
import './optimise.css';

const RECOMMENDATIONS = [
  { id: 'usdc', icon: tokenUsdc, name: 'USDC', protocol: 'Aave',           apy: 4.8, yieldYr: '+$256/yr' },
  { id: 'btc',  icon: tokenBtc,  name: 'BTC',  protocol: 'Native staking', apy: 1.8, yieldYr: '+$101/yr' },
  { id: 'eth',  icon: tokenEth,  name: 'ETH',  protocol: 'Lido',           apy: 3.8, yieldYr: '+$168/yr' },
  { id: 'sol',  icon: tokenSol,  name: 'SOL',  protocol: 'Marinade',       apy: 6.8, yieldYr: '+$288/yr' },
  { id: 'usdt', icon: tokenUsdt, name: 'USDT', protocol: 'Compound',       apy: 4.6, yieldYr: '+$156/yr' },
];

export default function OptimiseScreen() {
  const navigate = useNavigate();
  const { showUndo } = useUndoToast();

  function handleDeploy() {
    navigate('/success', {
      state: { action: 'optimise', summary: 'all assets across 5 protocols' },
    });
    setTimeout(() => {
      showUndo('Deployed across 5 protocols', () => {});
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
      <StatusBar />

      <header className="optimise-header">
        <Button className="icon-btn" aria-label="Go back" onPress={() => navigate(-1)}>
          <ChevronLeft size={20} color="var(--bk-text-primary)" strokeWidth={1.5} />
        </Button>
        <h1 className="optimise-title">Put It All To Work</h1>
        <div aria-hidden="true" style={{ width: 20 }} />
      </header>

      <div className="scroll-content">
        {/* Hero */}
        <div className="optimise-hero">
          <div className="optimise-hero-icon" aria-hidden="true">
            <Sparkles size={28} color="var(--bk-brand-primary)" strokeWidth={1.5} />
          </div>
          <p className="optimise-hero-sub">
            Deploy all assets to the highest-yield protocols. One tap, fully optimised.
          </p>
          <div className="optimise-total-badge" aria-label="Estimated annual yield: $969">
            +$969/yr estimated
          </div>
        </div>

        {/* Per-token recommendations */}
        <div className="optimise-list" role="list" aria-label="Token recommendations">
          {RECOMMENDATIONS.map((rec, i) => (
            <motion.div
              key={rec.id}
              className="optimise-row"
              role="listitem"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.06 + i * 0.05 } }}
            >
              <img className="optimise-token-icon" src={rec.icon} alt={rec.name} />
              <div className="optimise-row-info">
                <div className="optimise-row-token">{rec.name}</div>
                <div className="optimise-row-protocol">{rec.protocol}</div>
              </div>
              <div className="optimise-row-right">
                <div className="optimise-row-apy">{rec.apy}% APY</div>
                <div className="optimise-row-yield">{rec.yieldYr}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="optimise-total-row" aria-label="Total estimated yield: $969 per year">
          <span className="optimise-total-label">Total estimated yield</span>
          <span className="optimise-total-value">+$969 / yr</span>
        </div>
      </div>

      <Button
        className="primary-btn"
        aria-label="Confirm and deploy all assets"
        onPress={handleDeploy}
      >
        Confirm &amp; Deploy
      </Button>
    </motion.main>
  );
}
