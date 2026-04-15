/**
 * StakeTab — staking interface inside ActionsScreen
 * Shows stakeable tokens; platform list driven by selected asset.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from '../motion-tokens';
import { Button } from 'react-aria-components';
import { useActions } from '../ActionsContext';
import { SWAP_TOKENS } from '../tokens-data';
import {
  useFlowNavigate,
  AssetHeader,
  Numpad,
  ASSET_ID_TO_TOKEN,
} from './actions-shared';

import tokenEth  from '../assets/token-eth.svg';
import tokenSol  from '../assets/token-sol.svg';
import tokenBtc  from '../assets/token-btc.svg';

const STAKING_PLATFORMS = {
  eth: [
    { name: 'Lido',           apy: 4.2, tvl: '$34B',  apyType: 'APY' },
    { name: 'Rocket Pool',    apy: 3.9, tvl: '$4.1B', apyType: 'APY' },
    { name: 'Coinbase cbETH', apy: 3.5, tvl: '$2.8B', apyType: 'APY' },
  ],
  sol: [
    { name: 'Marinade',    apy: 7.1, tvl: '$1.2B', apyType: 'APY' },
    { name: 'Jito',        apy: 8.2, tvl: '$2.4B', apyType: 'APY' },
    { name: 'Lido (wSOL)', apy: 6.9, tvl: '$890M', apyType: 'APY' },
  ],
  btc: [
    { name: 'Native staking', apy: 1.8, tvl: '$8.4B', apyType: 'APY' },
    { name: 'Babylon',        apy: 2.4, tvl: '$1.2B', apyType: 'APY' },
  ],
  dot: [
    { name: 'Polkadot native', apy: 12.0, tvl: '$3.2B', apyType: 'APY' },
  ],
  atom: [
    { name: 'Cosmos Hub', apy: 18.0, tvl: '$1.8B', apyType: 'APY' },
  ],
  ada: [
    { name: 'Cardano native', apy: 3.8, tvl: '$4.4B', apyType: 'APY' },
  ],
};

// Tokens that have staking options, shown in selector when no asset passed
const STAKEABLE = [
  { id: 'eth',  tokenKey: 'ETH',  icon: tokenEth,  label: 'ETH',  bestApy: 4.2 },
  { id: 'sol',  tokenKey: 'SOL',  icon: tokenSol,  label: 'SOL',  bestApy: 8.2 },
  { id: 'btc',  tokenKey: 'BTC',  icon: tokenBtc,  label: 'BTC',  bestApy: 2.4 },
];

const DEFAULT_ASSET = 'eth';

export default function StakeTab() {
  const navigate   = useFlowNavigate();
  const { asset }  = useActions();

  // If an asset is passed in and it's stakeable, use it; otherwise default to ETH
  const initialAsset = (asset && STAKING_PLATFORMS[asset]) ? asset : DEFAULT_ASSET;
  const [selectedAsset, setSelectedAsset] = useState(initialAsset);

  const tokenKey   = ASSET_ID_TO_TOKEN[selectedAsset] || 'ETH';
  const tok        = SWAP_TOKENS[tokenKey];
  const platforms  = STAKING_PLATFORMS[selectedAsset] || STAKING_PLATFORMS[DEFAULT_ASSET];

  const [platform, setPlatform]   = useState(platforms[0]);
  const [amount, setAmount]       = useState('');
  const [isQuoting, setIsQuoting] = useState(false);

  // Reset platform when asset changes
  function selectAsset(id) {
    setSelectedAsset(id);
    setPlatform(STAKING_PLATFORMS[id][0]);
    setAmount('');
  }

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
      <div className="actions-tab-scroll">
      <AssetHeader tok={tok} tokenKey={tokenKey} />

      {/* Token selector — only shown when no specific asset was passed */}
      {!asset && (
        <div className="stake-token-selector" role="group" aria-label="Select asset to stake">
          {STAKEABLE.map(s => (
            <Button
              key={s.id}
              className={`stake-token-pill${selectedAsset === s.id ? ' active' : ''}`}
              aria-pressed={selectedAsset === s.id}
              onPress={() => selectAsset(s.id)}
            >
              <img src={s.icon} alt="" width="20" height="20" />
              <span>{s.label}</span>
              <span className="stake-token-apy">up to {s.bestApy}%</span>
            </Button>
          ))}
        </div>
      )}

      {/* Validator / protocol selector */}
      <div className="portfolio-label">Select validator</div>
      <div className="asset-opp-list">
        {platforms.map((p, i) => (
          <Button
            key={p.name}
            className={`asset-opp-row${i === 0 ? ' first' : i === platforms.length - 1 ? ' last' : ''}`}
            onPress={() => setPlatform(p)}
            data-selected={p.name === platform.name}
            aria-pressed={p.name === platform.name}
          >
            <div className="asset-opp-info">
              <div className="token-name-text">{p.name}</div>
              <div className="token-amount">TVL {p.tvl}</div>
            </div>
            <span className="asset-opp-apy">{p.apy}%</span>
            <span className="asset-opp-apy-label">{p.apyType}</span>
          </Button>
        ))}
      </div>

      {/* Amount input */}
      <div className="swap-card pay-card">
        <div className="card-label">Amount to stake</div>
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
      </div>{/* end actions-tab-scroll */}

      <Numpad onKey={handleKey} />

      <Button
        className={`bottom-cta-btn ${ctaReady && !isQuoting ? 'cta-ready' : 'cta-disabled'}`}
        isDisabled={isQuoting || !ctaReady}
        aria-label="Review stake"
        onPress={() => {
          if (!ctaReady) return;
          setIsQuoting(true);
          setTimeout(() => {
            navigate('/review', {
              state: {
                action: 'stake',
                from: {
                  icon: tok.icon,
                  symbol: tok.symbol,
                  amount,
                  usd: parseFloat(amount || 0) * tok.price,
                },
                to: null,
                fee: { network: '$1.80', protocol: '$0.40', total: '$2.20' },
                rate: `${platform.apy}% ${platform.apyType} on ${platform.name}`,
                warning: null,
              },
            });
          }, 600);
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isQuoting ? 'quoting' : 'ready'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: m.cta.enter }}
            exit={{ opacity: 0, y: -6, transition: m.cta.exit }}
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
            {isQuoting ? 'Fetching best rate...' : 'Review Stake'}
          </motion.span>
        </AnimatePresence>
      </Button>
    </div>
  );
}
