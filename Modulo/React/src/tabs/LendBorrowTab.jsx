/**
 * LendBorrowTab — lending, borrowing and staking inside ActionsScreen
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from '../motion-tokens';
import { Button, Switch } from 'react-aria-components';
import { useActions } from '../ActionsContext';
import { useFeatures } from '../theme/FeatureConfig';
import { SWAP_TOKENS } from '../tokens-data';
import tokenEth  from '../assets/token-eth.svg';
import tokenUsdc from '../assets/token-usdc.svg';
import {
  useFlowNavigate,
  AssetHeader,
  Numpad,
  ASSET_ID_TO_TOKEN,
} from './actions-shared';
import { AuditBadge } from '../components/AuditBadge';
import { getAuditForProtocol } from '../config/protocol-audits';
import { LTVBar } from '../components/LTVBar';

// Only used by LendBorrowTab
const LENDING_PLATFORMS = [
  { name: 'Aave v3',  apy: 3.8, tvl: '$2.1B', apyType: 'APY', audit: 'CertiK',        verified: true },
  { name: 'Compound', apy: 3.2, tvl: '$890M',  apyType: 'APY', audit: 'OpenZeppelin',  verified: true },
  { name: 'Spark',    apy: 4.1, tvl: '$1.4B',  apyType: 'APY', audit: 'ChainSecurity', verified: true },
];

const STAKING_PLATFORMS = {
  eth: [
    { name: 'Lido',             apy: 4.2, tvl: '$34B',  apyType: 'APY' },
    { name: 'Rocket Pool',      apy: 3.9, tvl: '$4.1B', apyType: 'APY' },
    { name: 'Coinbase cbETH',   apy: 3.5, tvl: '$2.8B', apyType: 'APY' },
  ],
  sol: [
    { name: 'Marinade',         apy: 7.1, tvl: '$1.2B', apyType: 'APY' },
    { name: 'Jito',             apy: 8.2, tvl: '$2.4B', apyType: 'APY' },
    { name: 'Lido (wSOL)',      apy: 6.9, tvl: '$890M', apyType: 'APY' },
  ],
  dot: [
    { name: 'Polkadot native',  apy: 12.0, tvl: '$3.2B', apyType: 'APY' },
  ],
  atom: [
    { name: 'Cosmos Hub',       apy: 18.0, tvl: '$1.8B', apyType: 'APY' },
  ],
  ada: [
    { name: 'Cardano native',   apy: 3.8, tvl: '$4.4B', apyType: 'APY' },
  ],
};

export default function LendBorrowTab() {
  const f = useFeatures();
  const navigate = useFlowNavigate();
  const { asset } = useActions();
  const tokenKey = (asset && ASSET_ID_TO_TOKEN[asset]) || 'USDC';
  const tok      = SWAP_TOKENS[tokenKey];

  const platforms  = STAKING_PLATFORMS[asset] || LENDING_PLATFORMS;
  const isStaking  = !!STAKING_PLATFORMS[asset];

  const [sub, setSub]               = useState('lend');
  const [lendAmount, setLendAmount] = useState('');   // MOD-132: separate state
  const [borrowAmount, setBorrowAmount] = useState(''); // MOD-132: separate state
  const amount = sub === 'lend' ? lendAmount : borrowAmount;
  const setAmount = sub === 'lend' ? setLendAmount : setBorrowAmount;
  const [platform, setPlatform]     = useState(platforms[0]);
  const [collateralEnabled, setCollateralEnabled] = useState(true);
  const [healthFactorOpen, setHealthFactorOpen]   = useState(false); // MOD-040
  const [isQuoting, setIsQuoting]                 = useState(false); // MOD-022
  const quotingTimerRef                           = useRef(null);    // MOD-104

  // MOD-104 — cleanup quoting timer on unmount
  useEffect(() => {
    return () => { if (quotingTimerRef.current) clearTimeout(quotingTimerRef.current); };
  }, []);

  // MOD-040 — close health factor panel on Escape
  useEffect(() => {
    if (!healthFactorOpen) return;
    const handler = (e) => { if (e.key === 'Escape') setHealthFactorOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [healthFactorOpen]);

  function handleKey(key) {
    setAmount(prev => {
      if (key === 'del') return prev.slice(0, -1);
      if (key === '.') { if (prev.includes('.')) return prev; return prev.length === 0 ? '0.' : prev + '.'; }
      if (prev.includes('.') && prev.split('.')[1].length >= 8) return prev;
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  }

  const ctaReady = amount && parseFloat(amount) > 0;

  return (
    <div className="actions-tab-stack">
      <AssetHeader tok={tok} tokenKey={tokenKey} returnTab="lend" />

      {/* Lend / Borrow toggle — matches Buy/Sell style */}
      <div className="trade-direction-tabs" role="group" aria-label="Lend or borrow">
        <Button
          className={`trade-dir-tab${sub === 'lend' ? ' dir-buy-active' : ''}`}
          role="switch"
          onPress={() => setSub('lend')}
          aria-pressed={sub === 'lend'}
        >Lend</Button>
        <Button
          className={`trade-dir-tab${sub === 'borrow' ? ' dir-sell-active' : ''}`}
          role="switch"
          onPress={() => setSub('borrow')}
          aria-pressed={sub === 'borrow'}
        >Borrow</Button>
      </div>

      {sub === 'lend' ? (
        <>
          <div className="actions-tab-scroll">
          <div className="portfolio-label">{isStaking ? 'Select validator' : 'Select protocol'}</div>
          <div className="asset-opp-list">
            {platforms.map((p, i) => (
              <Button key={p.name}
                className={`asset-opp-row${i === 0 ? ' first' : i === platforms.length - 1 ? ' last' : ''}`}
                onPress={() => setPlatform(p)}
                data-selected={p.name === platform.name}
                aria-pressed={p.name === platform.name}
              >
                <div className="asset-opp-info">
                  <div className="token-name-text">
                    {p.name}
                  </div>
                  <div className="token-amount">TVL {p.tvl}</div>
                  {p.verified && (() => {
                    const audit = getAuditForProtocol(p.name);
                    return audit ? (
                      <AuditBadge
                        protocolName={p.name}
                        firm={audit.firm}
                        year={audit.year}
                        tvl={audit.tvl}
                        reportUrl={audit.reportUrl}
                        summary={audit.summary}
                        inline
                      />
                    ) : (
                      <span className="audit-badge">✓ {p.audit}</span>
                    );
                  })()}
                </div>
                <span className="asset-opp-apy">{p.apy}%</span>
                <span className="asset-opp-apy-label">{p.apyType}</span>
              </Button>
            ))}
          </div>

          </div>{/* end actions-tab-scroll */}

          {/* Amount input — outside scroll, always visible above numpad */}
          <div className="swap-card pay-card">
            <div className="card-label">{isStaking ? 'Amount to stake' : 'Amount to lend'}</div>
            <div className="card-middle">
              <div className="swap-amount" role="status" aria-live="polite">
                <span className="amount-text">{amount || '0'}</span>
                <span className="amount-cursor" aria-hidden="true" />
              </div>
              <Button className="token-pill-btn token-pill-flat" isDisabled aria-label={`Asset: ${tok.symbol} (fixed)`}>
                <span className="token-icon"><img src={tok.icon} alt="" width="22" height="22" /></span>
                <span className="token-name">{tok.symbol}</span>
              </Button>
            </div>
            <div className="card-bottom">
              <span>≈ ${(parseFloat(amount || 0) * tok.price).toFixed(2)}</span>
              <span>{tok.balanceLabel}</span>
            </div>
          </div>

          <Numpad onKey={handleKey} />

          <Button className={`bottom-cta-btn ${ctaReady && !isQuoting ? 'cta-ready' : 'cta-disabled'}`}
            isDisabled={isQuoting || !ctaReady} aria-label={isStaking ? 'Review stake' : 'Review lend'}
            onPress={() => {
              if (!ctaReady) return;
              setIsQuoting(true);
              quotingTimerRef.current = setTimeout(() => {
                navigate('/review', { state: {
                  action: isStaking ? 'stake' : 'lend',
                  from: { icon: tok.icon, symbol: tok.symbol, amount, usd: parseFloat(amount || 0) * tok.price },
                  to: null,
                  fee: { network: '$1.80', protocol: '$0.40', total: '$2.20' },
                  rate: `${platform.apy}% ${platform.apyType} on ${platform.name}`, warning: null,
                }});
              }, 600);
            }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={isQuoting ? 'quoting' : 'ready'}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: m.cta.enter }}
                exit={{ opacity: 0, y: -6, transition: m.cta.exit }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
              >
                {isQuoting && (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', lineHeight: 1 }} aria-hidden="true">⟳</motion.span>
                )}
                {isQuoting ? 'Fetching best rate...' : (isStaking ? 'Review Stake' : 'Review Lend')}
              </motion.span>
            </AnimatePresence>
          </Button>
        </>
      ) : (
        <>
          <div className="actions-tab-scroll">
          <div className="actions-collateral-section">
            <div className="card-label" style={{ margin: '0 0 8px' }}>Your collateral</div>
            <div className="collateral-row">
              <img src={tokenEth} alt="" className="collateral-img" />
              <div className="collateral-info">
                <div className="token-name-text">Ethereum</div>
                <div className="token-amount">$4,412 available</div>
              </div>
              <div className="collateral-status-wrap">
                <span className="collateral-status">{collateralEnabled ? 'Active' : 'Inactive'}</span>
                <Switch
                  aria-label="Enable as collateral"
                  isSelected={collateralEnabled}
                  onChange={setCollateralEnabled}
                  className={`collateral-toggle${collateralEnabled ? ' enabled' : ''}`}
                >
                  <div className="collateral-toggle-knob" />
                </Switch>
              </div>
            </div>
            <div className="card-bottom card-bottom-mt" style={{ borderTop: '1px solid var(--bk-white-05, rgba(255,255,255,0.05))', paddingTop: 10, marginTop: 8 }}>
              {f.defi.healthFactor && (
              <>
              <Button
                className="health-factor-btn"
                aria-label="Health factor details"
                onPress={() => setHealthFactorOpen(v => !v)}
                style={{ display: 'contents' }}
              >
                <span>Health factor</span>
                <span className="text-success-bold">2.4 — Safe</span>
              </Button>
              <AnimatePresence>
                {healthFactorOpen && (
                  <motion.div
                    className="health-factor-card"
                    role="status"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto', transition: m.springTight }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.14 } }}
                    style={{ overflow: 'hidden', width: '100%', marginTop: 8, fontSize: 12, color: 'var(--bk-text-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}
                  >
                    <div>Liquidation occurs below 1.0x.</div>
                    <div>Current ratio: 2.4x — Safe</div>
                    <div>You could borrow approx. ${Math.max(0, 3300 - parseFloat(amount || 0)).toFixed(0)} more before risk.</div>
                  </motion.div>
                )}
              </AnimatePresence>
              </>
              )}
            </div>
          </div>

          {/* Sprint 005: LTV health bar */}
          {f.defi.healthFactor && (
            <LTVBar
              current={Math.min(85, Math.round(42 + (parseFloat(amount || 0) / 3300) * 43))}
              warning={75}
              liquidation={85}
              borrowAmount={amount ? `$${parseFloat(amount).toLocaleString()}` : '$1,854'}
              collateralAmount="$4,412"
            />
          )}

          </div>{/* end actions-tab-scroll */}

          {/* Borrow amount — outside scroll, always visible above numpad */}
          <div className="swap-card pay-card">
            <div className="card-label">Borrow amount</div>
            <div className="card-middle">
              <div className="swap-amount" role="status" aria-live="polite">
                <span className="amount-text">{amount || '0'}</span>
                <span className="amount-cursor" aria-hidden="true" />
              </div>
              <Button className="token-pill-btn token-pill-flat" isDisabled aria-label="Asset: USDC (fixed)">
                <span className="token-icon"><img src={tokenUsdc} alt="" width="22" height="22" /></span>
                <span className="token-name">USDC</span>
              </Button>
            </div>
            <div className="card-bottom"><span>Variable 4.8% APR</span><span>Max: $3,300</span></div>
          </div>

          <Numpad onKey={handleKey} />

          <Button className={`bottom-cta-btn ${ctaReady && !isQuoting ? 'cta-ready' : 'cta-disabled'}`}
            isDisabled={isQuoting || !ctaReady} aria-label="Review borrow"
            onPress={() => {
              if (!ctaReady) return;
              setIsQuoting(true);
              quotingTimerRef.current = setTimeout(() => {
                navigate('/review', { state: {
                  action: 'borrow',
                  from: { icon: tokenEth, symbol: 'ETH (collateral)', amount: '1.1421 ETH', usd: 4412 },
                  to:   { icon: tokenUsdc, symbol: 'USDC', amount, usd: parseFloat(amount || 0) },
                  fee: { network: '$1.20', protocol: '$0.30', total: '$1.50' },
                  rate: '4.8% variable APR',
                  warning: parseFloat(amount || 0) > 3000 ? 'Health factor will drop to 2.1 — reduce borrow amount.' : null,
                }});
              }, 600);
            }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={isQuoting ? 'quoting' : 'ready'}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0, transition: m.cta.enter }}
                exit={{ opacity: 0, y: -6, transition: m.cta.exit }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}
              >
                {isQuoting && (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block', lineHeight: 1 }} aria-hidden="true">⟳</motion.span>
                )}
                {isQuoting ? 'Fetching best rate...' : 'Review Borrow'}
              </motion.span>
            </AnimatePresence>
          </Button>
        </>
      )}
    </div>
  );
}
