/**
 * ExploreScreen — Markets & Yield Discovery
 * Yield-first: top rates shown prominently, token rows include APY.
 * Replaces the old tile-based favourites/new-listings layout.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m, tap, stagger } from './motion-tokens';
import { Button, TextField, Input } from 'react-aria-components';
import { useActions } from './ActionsContext';
import { useBrandConfig } from './theme/BrandConfig';
import BottomNav from './BottomNav';
import { TabSwitcher } from './components';
import './explore.css';

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="9" cy="9" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M15.5 15.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconTrendingUp = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
import tokenEth from './assets/token-eth.svg';
import tokenBtc from './assets/token-btc.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenUsdt from './assets/token-usdt.svg';
import tokenSol from './assets/token-sol.svg';
import sparklineEth from './assets/explore-sparkline-eth.svg';
import sparklineBtc from './assets/explore-sparkline-btc.svg';

const CHAINS = ['All', 'Ethereum', 'Arbitrum', 'Base', 'Optimism'];

const TABS = ['All', 'Staking', 'Lending', 'Top'];
const SORT_OPTIONS = ['Volume', 'Price', '% Change', 'APY'];

// Top yield opportunities — shown prominently at the top
const TOP_YIELDS = [
  { asset: 'ETH',  icon: tokenEth,  protocol: 'Lido',     apy: 4.2, type: 'stake', tab: 'lend', apyType: 'APY' },
  { asset: 'USDC', icon: tokenUsdc, protocol: 'Aave v3',  apy: 5.8, type: 'lend',  tab: 'lend', apyType: 'APY' },
  { asset: 'SOL',  icon: tokenSol,  protocol: 'Marinade', apy: 7.1, type: 'stake', tab: 'lend', apyType: 'APY' },
];

const CG = 'https://assets.coingecko.com/coins/images';

const ALL_TOKENS = [
  // ── Major L1s ────────────────────────────────────────────────────────
  { id: 'usdc', rank:  1, icon: tokenUsdc,                                          name: 'USD Coin',        symbol: 'USDC',  volume: '$514M Vol',  price: '$1.00',        change: '-0.38%', changeRaw: -0.38, negative: true,  priceRaw:     1.00, sparkline: null,         apy: 5.8, apyType: 'lend'  },
  { id: 'eth',  rank:  2, icon: tokenEth,                                           name: 'Ethereum',        symbol: 'ETH',   volume: '$480M Vol',  price: '$1,612.44',    change: '+2.17%', changeRaw:  2.17, negative: false, priceRaw:  1612.44, sparkline: sparklineEth, apy: 4.2, apyType: 'stake' },
  { id: 'usdt', rank:  3, icon: tokenUsdt,                                          name: 'Tether',          symbol: 'USDT',  volume: '$398M Vol',  price: '$1.00',        change: '+0.01%', changeRaw:  0.01, negative: false, priceRaw:     1.00, sparkline: null,         apy: 4.9, apyType: 'lend'  },
  { id: 'btc',  rank:  4, icon: tokenBtc,                                           name: 'Bitcoin',         symbol: 'WBTC',  volume: '$244M Vol',  price: '$84,920.00',   change: '+1.38%', changeRaw:  1.38, negative: false, priceRaw: 84920.00, sparkline: sparklineBtc, apy: 1.8, apyType: 'stake' },
  { id: 'sol',  rank:  5, icon: tokenSol,                                           name: 'Solana',          symbol: 'SOL',   volume: '$220M Vol',  price: '$122.80',      change: '-2.44%', changeRaw: -2.44, negative: true,  priceRaw:   122.80, sparkline: null,         apy: 7.1, apyType: 'stake' },
  { id: 'avax', rank:  6, icon: `${CG}/12559/small/Avalanche_Circle_RedWhite_Trans.png`, name: 'Avalanche', symbol: 'AVAX',  volume: '$88M Vol',   price: '$18.42',       change: '-1.22%', changeRaw: -1.22, negative: true,  priceRaw:    18.42, sparkline: null,         apy: 5.5, apyType: 'stake' },
  { id: 'ada',  rank:  7, icon: `${CG}/975/small/cardano.png`,                      name: 'Cardano',         symbol: 'ADA',   volume: '$74M Vol',   price: '$0.62',        change: '+0.88%', changeRaw:  0.88, negative: false, priceRaw:     0.62, sparkline: null,         apy: 3.8, apyType: 'stake' },
  { id: 'dot',  rank:  8, icon: `${CG}/12171/small/polkadot.png`,                   name: 'Polkadot',        symbol: 'DOT',   volume: '$51M Vol',   price: '$4.18',        change: '-0.65%', changeRaw: -0.65, negative: true,  priceRaw:     4.18, sparkline: null,         apy: 12.0, apyType: 'stake' },
  { id: 'atom', rank:  9, icon: `${CG}/1481/small/cosmos_hub.png`,                  name: 'Cosmos Hub',      symbol: 'ATOM',  volume: '$44M Vol',   price: '$4.72',        change: '+1.55%', changeRaw:  1.55, negative: false, priceRaw:     4.72, sparkline: null,         apy: 18.0, apyType: 'stake' },
  { id: 'near', rank: 10, icon: `${CG}/10365/small/near.jpg`,                       name: 'NEAR Protocol',   symbol: 'NEAR',  volume: '$38M Vol',   price: '$2.14',        change: '+3.21%', changeRaw:  3.21, negative: false, priceRaw:     2.14, sparkline: null,         apy: 9.5, apyType: 'stake' },
  { id: 'apt',  rank: 11, icon: `${CG}/26455/small/aptos_round.png`,                name: 'Aptos',           symbol: 'APT',   volume: '$35M Vol',   price: '$4.96',        change: '-3.10%', changeRaw: -3.10, negative: true,  priceRaw:     4.96, sparkline: null,         apy: 7.0, apyType: 'stake' },
  { id: 'sui',  rank: 12, icon: `${CG}/26375/small/sui_asset.jpeg`,                 name: 'Sui',             symbol: 'SUI',   volume: '$30M Vol',   price: '$2.08',        change: '+5.44%', changeRaw:  5.44, negative: false, priceRaw:     2.08, sparkline: null,         apy: 4.8, apyType: 'stake' },

  // ── L2s / ETH Ecosystem ───────────────────────────────────────────────
  { id: 'arb',   rank: 13, icon: `${CG}/16547/small/photo_2023-03-29_18.09.39.jpeg`, name: 'Arbitrum',       symbol: 'ARB',   volume: '$62M Vol',   price: '$0.34',        change: '-0.90%', changeRaw: -0.90, negative: true,  priceRaw:     0.34, sparkline: null,         apy: 3.2, apyType: 'lend'  },
  { id: 'op',    rank: 14, icon: `${CG}/25244/small/Optimism.png`,                   name: 'Optimism',        symbol: 'OP',    volume: '$48M Vol',   price: '$0.72',        change: '+1.03%', changeRaw:  1.03, negative: false, priceRaw:     0.72, sparkline: null,         apy: 2.9, apyType: 'lend'  },
  { id: 'matic', rank: 15, icon: `${CG}/4713/small/matic-token-icon.png`,            name: 'Polygon',         symbol: 'MATIC', volume: '$41M Vol',   price: '$0.18',        change: '-1.74%', changeRaw: -1.74, negative: true,  priceRaw:     0.18, sparkline: null,         apy: 4.4, apyType: 'stake' },
  { id: 'linea', rank: 16, icon: `${CG}/33761/small/linea-logo.png`,                 name: 'Linea',           symbol: 'LINEA', volume: '$12M Vol',   price: '$0.08',        change: '+2.60%', changeRaw:  2.60, negative: false, priceRaw:     0.08, sparkline: null,         apy: 2.1, apyType: 'lend'  },

  // ── DeFi ──────────────────────────────────────────────────────────────
  { id: 'uni',   rank: 17, icon: `${CG}/12504/small/uni.jpg`,                        name: 'Uniswap',         symbol: 'UNI',   volume: '$55M Vol',   price: '$5.28',        change: '+0.42%', changeRaw:  0.42, negative: false, priceRaw:     5.28, sparkline: null,         apy: 3.6, apyType: 'lend'  },
  { id: 'aave',  rank: 18, icon: `${CG}/12645/small/AAVE.png`,                       name: 'Aave',            symbol: 'AAVE',  volume: '$47M Vol',   price: '$138.50',      change: '+1.88%', changeRaw:  1.88, negative: false, priceRaw:   138.50, sparkline: null,         apy: 6.2, apyType: 'lend'  },
  { id: 'comp',  rank: 19, icon: `${CG}/10775/small/COMP.png`,                       name: 'Compound',        symbol: 'COMP',  volume: '$18M Vol',   price: '$38.20',       change: '-2.34%', changeRaw: -2.34, negative: true,  priceRaw:    38.20, sparkline: null,         apy: 5.1, apyType: 'lend'  },
  { id: 'mkr',   rank: 20, icon: `${CG}/1364/small/Mark_Maker.png`,                  name: 'Maker',           symbol: 'MKR',   volume: '$22M Vol',   price: '$1,142.00',    change: '+0.77%', changeRaw:  0.77, negative: false, priceRaw:  1142.00, sparkline: null,         apy: 8.0, apyType: 'lend'  },
  { id: 'snx',   rank: 21, icon: `${CG}/3406/small/SNX.png`,                         name: 'Synthetix',       symbol: 'SNX',   volume: '$14M Vol',   price: '$0.82',        change: '-4.11%', changeRaw: -4.11, negative: true,  priceRaw:     0.82, sparkline: null,         apy: 15.0, apyType: 'stake' },
  { id: 'crv',   rank: 22, icon: `${CG}/12124/small/Curve.png`,                      name: 'Curve DAO',       symbol: 'CRV',   volume: '$28M Vol',   price: '$0.48',        change: '+0.22%', changeRaw:  0.22, negative: false, priceRaw:     0.48, sparkline: null,         apy: 9.4, apyType: 'lend'  },
  { id: 'bal',   rank: 23, icon: `${CG}/11683/small/Balancer.png`,                   name: 'Balancer',        symbol: 'BAL',   volume: '$9M Vol',    price: '$1.62',        change: '-1.05%', changeRaw: -1.05, negative: true,  priceRaw:     1.62, sparkline: null,         apy: 7.8, apyType: 'lend'  },
  { id: 'sushi', rank: 24, icon: `${CG}/12271/small/512x512_Logo_No_chop.png`,       name: 'SushiSwap',       symbol: 'SUSHI', volume: '$11M Vol',   price: '$0.74',        change: '+2.88%', changeRaw:  2.88, negative: false, priceRaw:     0.74, sparkline: null,         apy: 11.2, apyType: 'lend' },
  { id: '1inch', rank: 25, icon: `${CG}/13469/small/1inch-token.png`,                name: '1inch',           symbol: '1INCH', volume: '$8M Vol',    price: '$0.22',        change: '-0.54%', changeRaw: -0.54, negative: true,  priceRaw:     0.22, sparkline: null,         apy: 4.0, apyType: 'lend'  },
  { id: 'yfi',   rank: 26, icon: `${CG}/11849/small/yearn-finance-yfi.png`,          name: 'yearn.finance',   symbol: 'YFI',   volume: '$6M Vol',    price: '$4,820.00',    change: '+1.44%', changeRaw:  1.44, negative: false, priceRaw:  4820.00, sparkline: null,         apy: 6.5, apyType: 'lend'  },
  { id: 'gmx',   rank: 27, icon: `${CG}/18323/small/arbit_logo.png`,                 name: 'GMX',             symbol: 'GMX',   volume: '$18M Vol',   price: '$14.60',       change: '+3.22%', changeRaw:  3.22, negative: false, priceRaw:    14.60, sparkline: null,         apy: 13.8, apyType: 'lend' },
  { id: 'dydx',  rank: 28, icon: `${CG}/11636/small/dYdX.png`,                       name: 'dYdX',            symbol: 'DYDX',  volume: '$15M Vol',   price: '$0.58',        change: '-2.00%', changeRaw: -2.00, negative: true,  priceRaw:     0.58, sparkline: null,         apy: 5.6, apyType: 'stake' },
  { id: 'ldo',   rank: 29, icon: `${CG}/13573/small/Lido_DAO.png`,                   name: 'Lido DAO',        symbol: 'LDO',   volume: '$20M Vol',   price: '$0.72',        change: '+0.95%', changeRaw:  0.95, negative: false, priceRaw:     0.72, sparkline: null,         apy: 4.2, apyType: 'stake' },
  { id: 'rpl',   rank: 30, icon: `${CG}/18900/small/rocketpool.png`,                 name: 'Rocket Pool',     symbol: 'RPL',   volume: '$8M Vol',    price: '$6.40',        change: '-1.30%', changeRaw: -1.30, negative: true,  priceRaw:     6.40, sparkline: null,         apy: 4.8, apyType: 'stake' },

  // ── Stablecoins ───────────────────────────────────────────────────────
  { id: 'dai',   rank: 31, icon: `${CG}/9956/small/Badge_Dai.png`,                   name: 'Dai',             symbol: 'DAI',   volume: '$88M Vol',   price: '$1.00',        change: '+0.00%', changeRaw:  0.00, negative: false, priceRaw:     1.00, sparkline: null,         apy: 5.4, apyType: 'lend'  },
  { id: 'frax',  rank: 32, icon: `${CG}/13422/small/frax_logo.png`,                  name: 'Frax',            symbol: 'FRAX',  volume: '$24M Vol',   price: '$1.00',        change: '-0.02%', changeRaw: -0.02, negative: true,  priceRaw:     1.00, sparkline: null,         apy: 5.2, apyType: 'lend'  },
  { id: 'lusd',  rank: 33, icon: `${CG}/14666/small/Group_3.png`,                    name: 'Liquity USD',     symbol: 'LUSD',  volume: '$9M Vol',    price: '$1.01',        change: '+0.05%', changeRaw:  0.05, negative: false, priceRaw:     1.01, sparkline: null,         apy: 4.6, apyType: 'lend'  },

  // ── Infrastructure / Other ────────────────────────────────────────────
  { id: 'link',  rank: 34, icon: `${CG}/877/small/chainlink-new-logo.png`,           name: 'Chainlink',       symbol: 'LINK',  volume: '$92M Vol',   price: '$11.40',       change: '+1.66%', changeRaw:  1.66, negative: false, priceRaw:    11.40, sparkline: null,         apy: 2.4, apyType: 'lend'  },
  { id: 'grt',   rank: 35, icon: `${CG}/13397/small/Graph_Token.png`,                name: 'The Graph',       symbol: 'GRT',   volume: '$22M Vol',   price: '$0.10',        change: '-1.20%', changeRaw: -1.20, negative: true,  priceRaw:     0.10, sparkline: null,         apy: 8.2, apyType: 'stake' },
  { id: 'fil',   rank: 36, icon: `${CG}/12817/small/filecoin.png`,                   name: 'Filecoin',        symbol: 'FIL',   volume: '$28M Vol',   price: '$2.80',        change: '+0.72%', changeRaw:  0.72, negative: false, priceRaw:     2.80, sparkline: null,         apy: 3.0, apyType: 'stake' },
  { id: 'icp',   rank: 37, icon: `${CG}/14495/small/Internet_Computer_logo.png`,     name: 'Internet Computer', symbol: 'ICP', volume: '$18M Vol',   price: '$4.62',        change: '-0.48%', changeRaw: -0.48, negative: true,  priceRaw:     4.62, sparkline: null,         apy: 6.8, apyType: 'stake' },
  { id: 'flow',  rank: 38, icon: `${CG}/13446/small/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png`, name: 'Flow', symbol: 'FLOW', volume: '$10M Vol',  price: '$0.44',        change: '+1.14%', changeRaw:  1.14, negative: false, priceRaw:     0.44, sparkline: null,         apy: 5.0, apyType: 'stake' },
  { id: 'mana',  rank: 39, icon: `${CG}/878/small/decentraland-mana.png`,            name: 'Decentraland',    symbol: 'MANA',  volume: '$14M Vol',   price: '$0.24',        change: '-2.88%', changeRaw: -2.88, negative: true,  priceRaw:     0.24, sparkline: null,         apy: 0.0, apyType: 'lend'  },
  { id: 'sand',  rank: 40, icon: `${CG}/12129/small/sandbox_logo.jpg`,               name: 'The Sandbox',     symbol: 'SAND',  volume: '$12M Vol',   price: '$0.18',        change: '+0.55%', changeRaw:  0.55, negative: false, priceRaw:     0.18, sparkline: null,         apy: 0.0, apyType: 'lend'  },
  { id: 'axs',   rank: 41, icon: `${CG}/13029/small/axie_infinity_logo.png`,         name: 'Axie Infinity',   symbol: 'AXS',   volume: '$9M Vol',    price: '$2.88',        change: '-1.60%', changeRaw: -1.60, negative: true,  priceRaw:     2.88, sparkline: null,         apy: 0.0, apyType: 'stake' },
  { id: 'inj',   rank: 42, icon: `${CG}/12882/small/Secondary_Symbol.png`,           name: 'Injective',       symbol: 'INJ',   volume: '$30M Vol',   price: '$8.74',        change: '+4.88%', changeRaw:  4.88, negative: false, priceRaw:     8.74, sparkline: null,         apy: 14.0, apyType: 'stake' },
  { id: 'sei',   rank: 43, icon: `${CG}/28205/small/Sei_Logo_-_Transparent.png`,     name: 'Sei',             symbol: 'SEI',   volume: '$18M Vol',   price: '$0.18',        change: '+6.22%', changeRaw:  6.22, negative: false, priceRaw:     0.18, sparkline: null,         apy: 7.0, apyType: 'stake' },
  { id: 'tia',   rank: 44, icon: `${CG}/31967/small/tia.jpg`,                        name: 'Celestia',        symbol: 'TIA',   volume: '$22M Vol',   price: '$2.42',        change: '-3.44%', changeRaw: -3.44, negative: true,  priceRaw:     2.42, sparkline: null,         apy: 16.0, apyType: 'stake' },
  { id: 'pyth',  rank: 45, icon: `${CG}/31924/small/pyth.png`,                       name: 'Pyth Network',    symbol: 'PYTH',  volume: '$14M Vol',   price: '$0.08',        change: '+2.10%', changeRaw:  2.10, negative: false, priceRaw:     0.08, sparkline: null,         apy: 0.0, apyType: 'lend'  },
];

const PORTFOLIO_ASSETS = ['ETH', 'USDC', 'BTC'];

export default function ExploreScreen() {
  const navigate = useNavigate();
  const { openActions } = useActions();
  const { brandName } = useBrandConfig();
  const [activeChain, setActiveChain] = useState('All');
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('Volume');
  const [yieldFilter, setYieldFilter] = useState('all'); // MOD-024: 'all' | 'mine'
  const [apyTooltipOpen, setApyTooltipOpen] = useState(false); // MOD-023
  const [searchQuery, setSearchQuery] = useState('');

  const filteredYields = yieldFilter === 'mine'
    ? TOP_YIELDS.filter(y => PORTFOLIO_ASSETS.includes(y.asset))
    : TOP_YIELDS;

  const cycleSort = () => {
    const next = SORT_OPTIONS[(SORT_OPTIONS.indexOf(sortBy) + 1) % SORT_OPTIONS.length];
    setSortBy(next);
  };

  const tabFiltered = ALL_TOKENS.filter(t => {
    if (activeTab === 'Staking') return t.apyType === 'stake';
    if (activeTab === 'Lending') return t.apyType === 'lend';
    if (activeTab === 'Top')     return t.rank <= 5;
    return true;
  });

  const sortedTokens = [...tabFiltered].sort((a, b) => {
    if (sortBy === 'Price')     return b.priceRaw - a.priceRaw;
    if (sortBy === '% Change')  return b.changeRaw - a.changeRaw;
    if (sortBy === 'APY')       return b.apy - a.apy;
    return a.rank - b.rank;
  });

  return (
    <motion.main
      role="main"
      aria-label={`${brandName} markets screen`}
      className="explore-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: m.fade.enter }}
      exit={{ opacity: 0, transition: m.fade.exit }}
    >
      <div className="scroll-content explore-scroll">

        {/* Search */}
        <TextField aria-label="Search tokens" value={searchQuery} onChange={setSearchQuery} className="search-field explore-search">
          <IconSearch />
          <Input className="explore-search-input" placeholder="Search tokens..." />
        </TextField>

        {/* Top Yields — compact list, not tiles */}
        <div className="yield-section">
          <div className="yield-header">
            <IconTrendingUp />
            <span className="yield-title">Top rates right now</span>
            {/* MOD-024: Your assets filter */}
            <div className="yield-filter-tabs" role="group" aria-label="Filter rates">
              <Button
                className={`yield-filter-pill${yieldFilter === 'all' ? ' active' : ''}`}
                aria-pressed={yieldFilter === 'all'}
                onPress={() => setYieldFilter('all')}
              >All rates</Button>
              <Button
                className={`yield-filter-pill${yieldFilter === 'mine' ? ' active' : ''}`}
                aria-pressed={yieldFilter === 'mine'}
                onPress={() => setYieldFilter('mine')}
              >Your assets</Button>
            </div>
          </div>
          {filteredYields.map((y, i) => (
            <motion.div
              key={y.asset + y.protocol}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...m.fade.enter, delay: stagger.base + i * stagger.perItem }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                className="yield-row"
                aria-label={`${y.asset} ${y.apy}% ${y.apyType} on ${y.protocol}`}
                onPress={() => openActions({ tab: y.tab, asset: y.asset.toLowerCase() })}
              >
                <img src={y.icon} alt="" width="28" height="28" className="yield-icon" />
                <div className="yield-info">
                  <span className="yield-asset">{y.asset}</span>
                  <span className="yield-protocol">{y.protocol} · {y.type === 'stake' ? 'Stake' : 'Lend'}</span>
                </div>
                <span className="yield-apy">{y.apy}%</span>
                <span className="yield-apy-label">{y.apyType}</span>
                {/* MOD-023: APY info tooltip on first yield only */}
                {i === 0 && (
                  <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <Button className="apy-info-btn" aria-label="What is APY?" onPress={() => setApyTooltipOpen(v => !v)}>ⓘ</Button>
                    {apyTooltipOpen && (
                      <div className="apy-tooltip" role="tooltip">
                        <p>APY = Annual Percentage Yield. Rates are variable and may change daily.</p>
                        <Button onPress={() => setApyTooltipOpen(false)}>Got it</Button>
                      </div>
                    )}
                  </span>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Market Tabs */}
        <TabSwitcher
          tabs={TABS.map(t => ({ id: t, label: t }))}
          activeTab={activeTab}
          onChange={setActiveTab}
          aria-label="Market filter"
        />

        {/* Sort + Chain Filters */}
        <div className="top-header">
          <span className="top-label" />
          <Button className="sort-btn" onPress={cycleSort} aria-label={`Sort by ${sortBy}`}>
            {sortBy} &#9662;
          </Button>
        </div>

        <div className="chain-filters" data-bk-component="tab-bar" role="group" aria-label="Chain filter">
          {CHAINS.map(c => (
            <Button
              key={c}
              className={`chain-pill${activeChain === c ? ' active' : ''}`}
              aria-pressed={activeChain === c}
              onPress={() => setActiveChain(c)}
            >{c}</Button>
          ))}
        </div>

        {/* Token List — with APY column */}
        <div className="token-list-explore" role="list" aria-label="Markets">
          {sortedTokens.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-message">No tokens match this filter.</p>
            </div>
          ) : sortedTokens.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...m.fade.enter, delay: stagger.base + i * stagger.perItem }}
              whileTap={{ scale: tap.card }}
            >
              <Button
                className="token-row-explore"
                role="listitem"
                aria-label={`${t.name}: ${t.price}, ${t.change}, ${t.apy}% APY`}
                onPress={() => navigate(`/asset/${t.id}`)}
              >
                <span className="token-rank">{i + 1}</span>

                <img src={t.icon} alt="" width="32" height="32" className="explore-token-icon" />
                <div className="token-col-name">
                  <span className="token-name-text">{t.name}</span>
                  <span className="token-amount">{t.symbol}</span>
                </div>
                <div className="token-col-price">
                  <span className="token-price-text">{t.price}</span>
                  <span className={`token-change-text${t.negative ? ' negative' : ' positive'}`}>{t.change}</span>
                </div>
                <div className="token-col-apy">
                  <span className="token-apy-value">{t.apy}%</span>
                  <span className="token-apy-label">{t.apyType === 'borrow' ? 'APR' : 'APY'}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNav />
    </motion.main>
  );
}
