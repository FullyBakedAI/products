/**
 * ExploreScreen — Markets & Yield Discovery
 * Yield-first: top rates shown prominently, token rows include APY.
 * Replaces the old tile-based favourites/new-listings layout.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { useActions } from './ActionsContext';
import StatusBar from './StatusBar';
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
  { asset: 'ETH',  icon: tokenEth,  protocol: 'Lido',     apy: 4.2, type: 'stake', tab: 'lend' },
  { asset: 'USDC', icon: tokenUsdc, protocol: 'Aave v3',  apy: 5.8, type: 'lend',  tab: 'lend' },
  { asset: 'SOL',  icon: tokenSol,  protocol: 'Marinade', apy: 7.1, type: 'stake', tab: 'lend' },
];

const ALL_TOKENS = [
  { id: 'usdc', rank: 1, icon: tokenUsdc, name: 'USD Coin',  symbol: 'USDC', volume: '$514M Vol', price: '$1.00',      change: '-0.38%', changeRaw: -0.38, negative: true,  priceRaw: 1.00,     sparkline: null,         apy: 5.8, apyType: 'lend' },
  { id: 'eth',  rank: 2, icon: tokenEth,  name: 'Ethereum',  symbol: 'ETH',  volume: '$480M Vol', price: '$2,450.78',  change: '+4.42%', changeRaw:  4.42, negative: false, priceRaw: 2450.78,  sparkline: sparklineEth, apy: 4.2, apyType: 'stake' },
  { id: 'usdt', rank: 3, icon: tokenUsdt, name: 'Tether',    symbol: 'USDT', volume: '$398M Vol', price: '$1.00',      change: '+0.01%', changeRaw:  0.01, negative: false, priceRaw: 1.00,     sparkline: null,         apy: 4.9, apyType: 'lend' },
  { id: 'btc',  rank: 4, icon: tokenBtc,  name: 'Bitcoin',   symbol: 'BTC',  volume: '$244M Vol', price: '$88,421.33', change: '+2.14%', changeRaw:  2.14, negative: false, priceRaw: 88421.33, sparkline: sparklineBtc, apy: 1.8, apyType: 'stake' },
  { id: 'sol',  rank: 5, icon: tokenSol,  name: 'Solana',    symbol: 'SOL',  volume: '$220M Vol', price: '$165.42',    change: '-1.82%', changeRaw: -1.82, negative: true,  priceRaw: 165.42,   sparkline: null,         apy: 7.1, apyType: 'stake' },
];

export default function ExploreScreen() {
  const navigate = useNavigate();
  const { openActions } = useActions();
  const [activeChain, setActiveChain] = useState('All');
  const [activeTab, setActiveTab] = useState('All');
  const [sortBy, setSortBy] = useState('Volume');

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
      aria-label="Modulo markets screen"
      className="explore-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: m.fade.enter }}
      exit={{ opacity: 0, transition: m.fade.exit }}
    >
      <StatusBar />

      <div className="scroll-content explore-scroll">

        {/* Search */}
        <Button className="search-field explore-search" role="search" aria-label="Search tokens">
          <IconSearch />
          <span>Token name or address</span>
        </Button>

        {/* Top Yields — compact list, not tiles */}
        <div className="yield-section">
          <div className="yield-header">
            <IconTrendingUp />
            <span className="yield-title">Top rates right now</span>
          </div>
          {TOP_YIELDS.map((y, i) => (
            <motion.div
              key={y.asset + y.protocol}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...m.fade.enter, delay: 0.06 + i * 0.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                className="yield-row"
                aria-label={`${y.asset} ${y.apy}% APY on ${y.protocol}`}
                onPress={() => openActions({ tab: y.tab, asset: y.asset.toLowerCase() })}
              >
                <img src={y.icon} alt="" width="28" height="28" className="yield-icon" />
                <div className="yield-info">
                  <span className="yield-asset">{y.asset}</span>
                  <span className="yield-protocol">{y.protocol} · {y.type === 'stake' ? 'Stake' : 'Lend'}</span>
                </div>
                <span className="yield-apy">{y.apy}%</span>
                <span className="yield-apy-label">APY</span>
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
            <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 13, color: 'var(--bk-text-muted)' }}>
              No tokens match this filter.
            </div>
          ) : sortedTokens.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...m.fade.enter, delay: 0.04 + i * 0.05 }}
              whileTap={{ scale: 0.985 }}
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
                  <span className="token-apy-label">APY</span>
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
