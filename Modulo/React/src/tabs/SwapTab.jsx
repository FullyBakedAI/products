/**
 * SwapTab — token swap interface inside ActionsScreen
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m, tap } from '../motion-tokens';
import { Button } from 'react-aria-components';
import { useSwap } from '../SwapContext';
import { useFeatures } from '../theme/FeatureConfig';
import { useIconOverride } from '../IconOverrideContext';
import { useActions } from '../ActionsContext';
import { SWAP_TOKENS } from '../tokens-data';
import {
  MotionButton,
  useFlowNavigate,
  AssetHeader,
  TokenPill,
  SelectTokenButton,
  Numpad,
  ASSET_ID_TO_TOKEN,
} from './actions-shared';
import { FeeBreakdown } from '../components/FeeBreakdown';
import { TransactionPath } from '../components/TransactionPath';
import { getPathForTokens } from '../config/transaction-paths';

// MOD-036 — chain-aware gas fees (only used by SwapTab)
const GAS_FEES = {
  ethereum: { network: '$14.20', protocol: '$0.88' },
  arbitrum: { network: '$0.08',  protocol: '$0.22' },
  base:     { network: '$0.04',  protocol: '$0.18' },
  polygon:  { network: '$0.02',  protocol: '$0.15' },
  optimism: { network: '$0.05',  protocol: '$0.19' },
};

export default function SwapTab() {
  const f = useFeatures();
  const navigate = useFlowNavigate();
  const { asset } = useActions();
  const {
    payToken, receiveToken,
    payAmount, setPayAmount,
    activePct, setActivePct,
    payUSD, receiveAmount, rateLabel,
    swapDirections, selectToken,
  } = useSwap();

  // Pre-select the asset as pay token when opened from an asset overview
  useEffect(() => {
    if (asset) {
      const key = ASSET_ID_TO_TOKEN[asset];
      if (key) selectToken('pay', key);
    }
  }, [asset]); // eslint-disable-line
  const { getIcon } = useIconOverride();
  const DirIcon = getIcon('swap-direction');
  const [swappedVisual, setSwappedVisual]           = useState(false);
  const [slippagePct, setSlippagePct]               = useState(0.5);
  const [showSlippage, setShowSlippage]             = useState(false);
  const [activeChain, setActiveChain]               = useState('ethereum'); // MOD-036
  const { deadline }                                 = useSwap(); // MOD-011: minutes
  const [isQuoting, setIsQuoting]                   = useState(false);       // MOD-022
  const [slippageAcknowledged, setSlippageAcknowledged] = useState(false);   // MOD-043

  const hasAmount = payAmount && parseFloat(payAmount) > 0;

  // MOD-038 — dynamic price impact
  const priceImpact = Math.min(15, Math.max(0.01, (parseFloat(payAmount) || 0) / 1000000 * 100));
  const impactLevel = priceImpact < 1 ? 'low' : priceImpact < 3 ? 'medium' : 'high';
  const impactLabel = priceImpact < 1 ? 'Low' : priceImpact < 3 ? 'Medium' : 'High impact';

  // MOD-043 — CTA disabled if very high impact and not acknowledged
  const ctaReady  = !!(receiveToken && hasAmount && (priceImpact <= 10 || slippageAcknowledged));
  const ctaLabel  = isQuoting ? 'Fetching best rate...' : !receiveToken ? 'Select a token' : !hasAmount ? 'Enter an amount' : 'Review Swap';

  function handleKey(key) {
    setActivePct(null);
    setPayAmount(prev => {
      if (key === 'del') return prev.slice(0, -1);
      if (key === '.') { if (prev.includes('.')) return prev; return prev.length === 0 ? '0.' : prev + '.'; }
      if (prev.includes('.') && prev.split('.')[1].length >= 8) return prev;
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

  // Find the SWAP_TOKENS key for the current payToken so AssetHeader can look up change data
  const payTokenKey = Object.keys(SWAP_TOKENS).find(k => SWAP_TOKENS[k].symbol === payToken.symbol) || 'ETH';

  return (
    <div className="actions-tab-stack">
      {/* Scrollable upper section — TransactionPath/FeeBreakdown grow into this area,
          never pushing the Numpad or CTA below the visible sheet boundary. */}
      <div className="actions-tab-scroll">
      <div style={{flex:1}} />
      <AssetHeader tok={payToken} tokenKey={payTokenKey} />
      <div className="swap-cards">
        <div className="swap-card pay-card" role="region" aria-label="You pay">
          <div className="card-label">You pay</div>
          <div className="card-middle">
            <div className="swap-amount" role="status" aria-live="polite" aria-label="Pay amount">
              <span className="amount-text">{payAmount || '0'}</span>
              <span className="amount-cursor" aria-hidden="true" />
              {/* Desktop: invisible input layer for keyboard entry */}
              <input
                className="swap-amount-keyboard-input"
                type="text"
                inputMode="decimal"
                value={payAmount}
                aria-label="Enter pay amount"
                onChange={e => {
                  const val = e.target.value;
                  if (/^[0-9]*\.?[0-9]*$/.test(val)) {
                    setActivePct(null);
                    setPayAmount(val === '' ? '' : val.startsWith('0') && val.length > 1 && !val.startsWith('0.') ? val.slice(1) : val);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Backspace') { e.preventDefault(); handleKey('del'); }
                }}
              />
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
            <div className={`swap-amount${receiveToken ? '' : ' dimmed'}`} role="status" aria-live="polite">
              <span className="amount-text">{receiveAmount || '0'}</span>
            </div>
            {receiveToken ? <TokenPill token={receiveToken} side="receive" /> : <SelectTokenButton side="receive" />}
          </div>
          {receiveToken && <div className="card-bottom"><span>&nbsp;</span><span>{rateLabel}</span></div>}
        </div>
      </div>

      <div className="pct-row" role="group" aria-label="Amount presets">
        {[{ label: '25%', pct: 25 }, { label: '50%', pct: 50 }, { label: '75%', pct: 75 }, { label: 'Max', pct: 100 }].map(({ label, pct }) => (
          <MotionButton
            key={pct}
            className={`pct-pill-btn${activePct === pct ? ' active' : ''}`}
            aria-label={`Set amount to ${label}`}
            aria-pressed={activePct === pct}
            onPress={() => handlePct(pct)}
            whileTap={{ scale: tap.default }}
          >{label}</MotionButton>
        ))}
      </div>

      <div className="slippage-row">
        <Button className="slippage-toggle" onPress={() => setShowSlippage(v => !v)}
          aria-expanded={showSlippage} aria-label="Slippage tolerance settings">
          <span className="slippage-icon" aria-hidden="true">⚙</span>
          <span>Slippage: {slippagePct}%</span>
          <span className={`slippage-chevron${showSlippage ? ' open' : ''}`} aria-hidden="true">›</span>
        </Button>
        <AnimatePresence>
          {showSlippage && (
            <motion.div className="slippage-presets"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto', transition: m.springTight }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.14 } }}
            >
              {[0.1, 0.5, 1].map(p => (
                <Button key={p}
                  className={`pct-pill-btn${slippagePct === p ? ' active' : ''}`}
                  aria-label={`Set slippage to ${p}%`}
                  aria-pressed={slippagePct === p}
                  onPress={() => { setSlippagePct(p); setShowSlippage(false); }}
                >{p}%</Button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MOD-011: Transaction deadline */}
      <div className="swap-deadline-row">
        <span className="card-label" style={{ margin: 0 }}>Expires in</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--bk-text-secondary)' }}>{deadline} min</span>
      </div>

      {receiveToken && hasAmount && (
        <>
          {f.defi.priceImpact && (
          <div className="swap-impact-row">
            <span className="swap-impact-label">
              Price impact:
              <span className="swap-impact-value" data-level={impactLevel}> {priceImpact.toFixed(2)}% — {impactLabel}</span>
            </span>
            <span className="swap-route-label">
              Route: {payToken.symbol} → {receiveToken.symbol} via Arbitrum
            </span>
          </div>
          )}
          {f.defi.priceImpact && priceImpact > 3 && priceImpact <= 10 && (
            <div className="swap-warning swap-warning-amber" role="alert">
              ⚠ High price impact — you may receive significantly less than shown.
            </div>
          )}
          {f.defi.slippageWarning && priceImpact > 10 && (
            <div className="swap-warning swap-warning-red" role="alert">
              <div>⚠ Very high price impact ({priceImpact.toFixed(1)}%) — this trade may be unfavourable.</div>
              <label className="swap-ack-label">
                <input
                  type="checkbox"
                  checked={slippageAcknowledged}
                  onChange={e => setSlippageAcknowledged(e.target.checked)}
                />
                I understand the risk
              </label>
            </div>
          )}

          {/* Sprint 005: Transaction path visualiser */}
          <TransactionPath
            {...getPathForTokens(payToken.symbol, receiveToken.symbol)}
          />

          {/* Sprint 005: Fee breakdown */}
          {(() => {
            const fees = GAS_FEES[activeChain] || GAS_FEES.ethereum;
            const net = parseFloat(fees.network.replace('$', ''));
            const pro = parseFloat(fees.protocol.replace('$', ''));
            const feeTotal = `$${(net + pro).toFixed(2)}`;
            return (
              <FeeBreakdown
                total={feeTotal}
                items={[
                  { label: `Network gas (${activeChain.charAt(0).toUpperCase() + activeChain.slice(1)})`, amount: fees.network },
                  { label: `Bridge fee (Stargate)`, amount: '$0.00' },
                  { label: `Protocol fee`, amount: fees.protocol },
                ]}
              />
            );
          })()}
        </>
      )}
      </div>{/* end actions-tab-scroll */}

      <Numpad onKey={handleKey} />

      <Button
        className={`bottom-cta-btn ${ctaReady ? 'cta-ready' : 'cta-disabled'}`}
        aria-label={ctaLabel}
        isDisabled={isQuoting || (!ctaReady && !!receiveToken)}
        onPress={() => {
          if (!receiveToken) { navigate('/swap/select/receive'); return; }
          if (!ctaReady) return;
          setIsQuoting(true);
          const fees = GAS_FEES[activeChain] || GAS_FEES.ethereum;
          const net = parseFloat(fees.network.replace('$', ''));
          const pro = parseFloat(fees.protocol.replace('$', ''));
          const feeTotal = `$${(net + pro).toFixed(2)}`;
          setTimeout(() => {
            navigate('/review', { state: {
              action: 'swap',
              from: { icon: payToken.icon, symbol: payToken.symbol, amount: payAmount, usd: parseFloat(payAmount || 0) * payToken.price },
              to:   { icon: receiveToken.icon, symbol: receiveToken.symbol, amount: receiveAmount, usd: parseFloat(receiveAmount || 0) * receiveToken.price },
              fee: { network: fees.network, protocol: fees.protocol, total: feeTotal },
              rate: rateLabel, warning: null,
            }});
          }, 600);
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={isQuoting ? 'quoting' : ctaLabel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: m.cta.enter }}
            exit={{    opacity: 0, y: -6, transition: m.cta.exit }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
          >
            {isQuoting && (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', lineHeight: 1 }}
                aria-hidden="true"
              >⟳</motion.span>
            )}
            {ctaLabel}
          </motion.span>
        </AnimatePresence>
      </Button>
    </div>
  );
}
