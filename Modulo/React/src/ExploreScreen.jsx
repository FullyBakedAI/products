/**
 * ExploreScreen — market discovery
 * Matches HTML prototype at ../Prototype/explore-screen.html
 * All colours via --bk-* tokens. All data mocked.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import StatusBar from './StatusBar';
import BottomNav from './BottomNav';
import './explore.css';
import './home.css';

import { Search, Star } from 'lucide-react';
import iconMore from './assets/icon-more.svg';
import tokenEth from './assets/token-eth.svg';
import tokenBtc from './assets/token-btc.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenUsdt from './assets/token-usdt.svg';
import tokenSol from './assets/token-sol.svg';
import sparklineEth from './assets/explore-sparkline-eth.svg';
import sparklineBtc from './assets/explore-sparkline-btc.svg';

const CHAINS = ['All', 'Ethereum', 'Arbitrum', 'Base', 'Optimism'];

const MARKET_TABS = ['Trending', 'Gainers', 'Losers', 'Top'];
const SORT_OPTIONS = ['Volume', 'Price', '% Change'];

const NEW_TOKENS = [
  { id: 'new1', icon: tokenUsdc, symbol: 'PYUSD',  change: '+12.4%', negative: false },
  { id: 'new2', icon: tokenEth,  symbol: 'EIGEN',  change: '+8.1%',  negative: false },
  { id: 'new3', icon: tokenSol,  symbol: 'JTO',    change: '-3.2%',  negative: true  },
];

const ALL_TOKENS = [
  { id: 'usdc', rank: 1, icon: tokenUsdc, name: 'USD Coin',       volume: '$514M Vol', price: '$1.00',       change: '-0.38%', changeRaw: -0.38, negative: true,  priceRaw: 1.00,      sparkline: null,         trending: false },
  { id: 'eth',  rank: 2, icon: tokenEth,  name: 'Ethereum',       volume: '$480M Vol', price: '$2,450.78',   change: '+4.42%', changeRaw:  4.42, negative: false, priceRaw: 2450.78,   sparkline: sparklineEth, trending: true  },
  { id: 'usdt', rank: 3, icon: tokenUsdt, name: 'Tether',         volume: '$398M Vol', price: '$1.00',       change: '+0.01%', changeRaw:  0.01, negative: false, priceRaw: 1.00,      sparkline: null,         trending: false },
  { id: 'btc',  rank: 4, icon: tokenBtc,  name: 'Bitcoin',        volume: '$244M Vol', price: '$88,421.33',  change: '+2.14%', changeRaw:  2.14, negative: false, priceRaw: 88421.33,  sparkline: sparklineBtc, trending: true  },
  { id: 'sol',  rank: 5, icon: tokenSol,  name: 'Solana',         volume: '$220M Vol', price: '$165.42',     change: '-1.82%', changeRaw: -1.82, negative: true,  priceRaw: 165.42,    sparkline: null,         trending: false },
];

export default function ExploreScreen() {
  const navigate = useNavigate();
  const [activeChain, setActiveChain] = useState('All');
  const [activeMarketTab, setActiveMarketTab] = useState('Trending');
  const [sortBy, setSortBy] = useState('Volume');
  const [favourites, setFavourites] = useState(new Set(['eth', 'btc']));

  const cycleSort = () => {
    const next = SORT_OPTIONS[(SORT_OPTIONS.indexOf(sortBy) + 1) % SORT_OPTIONS.length];
    setSortBy(next);
  };

  const toggleFav = (id) => setFavourites(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  // Filter by market tab first, then sort
  const tabFiltered = ALL_TOKENS.filter(t => {
    if (activeMarketTab === 'Trending') return t.trending;
    if (activeMarketTab === 'Gainers')  return t.changeRaw > 0;
    if (activeMarketTab === 'Losers')   return t.changeRaw < 0;
    return true; // Top — all
  });

  const sortedTokens = [...tabFiltered].sort((a, b) => {
    if (sortBy === 'Price')     return b.priceRaw - a.priceRaw;
    if (sortBy === '% Change')  return b.changeRaw - a.changeRaw;
    return a.rank - b.rank; // Volume — original order
  });

  // Favourites cards — driven by state, not hardcoded
  const favTokens = ALL_TOKENS.filter(t => favourites.has(t.id));

  return (
    <motion.main
      role="main"
      aria-label="Modulo explore screen"
      className="explore-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: m.fade.enter }}
      exit={{ opacity: 0, transition: m.fade.exit }}
    >
      <StatusBar />

      <div className="scroll-content explore-scroll">

        {/* Search Field */}
        <div className="search-field explore-search" role="search" aria-label="Search tokens">
          <Search size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
          <span>Token name or address</span>
        </div>

        {/* Favourites */}
        <div className="fav-header">
          <span className="fav-label">Favourites</span>
          <Button className="icon-btn-sm" aria-label="More options" onPress={() => {}}>
            <img src={iconMore} width="16" height="16" aria-hidden="true" />
          </Button>
        </div>

        <div className="fav-cards" role="group" aria-label="Favourite tokens">
          {favTokens.length === 0 ? (
            <div style={{ padding: '12px 16px', fontSize: 12, color: 'var(--bk-text-muted)' }}>
              Star a token below to add it here.
            </div>
          ) : favTokens.map(t => (
            <button
              key={t.id}
              className="fav-card"
              aria-label={`${t.id.toUpperCase()} — ${t.price} ${t.change}`}
              onClick={() => navigate(`/asset/${t.id}`)}
            >
              <div className="fav-card-top">
                <img src={t.icon} alt="" />
                <span>{t.id.toUpperCase()}</span>
              </div>
              <div className="fav-sparkline" aria-hidden="true">
                {t.sparkline
                  ? <img src={t.sparkline} alt="" />
                  : <div style={{ height: 32 }} />
                }
              </div>
              <div className="fav-card-bottom">
                <span className="fav-price">{t.price}</span>
                <span className={`fav-change${t.negative ? ' negative' : ' positive'}`}>{t.change}</span>
              </div>
            </button>
          ))}
        </div>

        {/* New on Modulo rail */}
        <div className="new-listings-section">
          <div className="section-header-row">
            <span className="fav-label">New on Modulo</span>
          </div>
          <div className="new-listings-rail">
            {NEW_TOKENS.map(t => (
              <div key={t.id} className="new-listing-card">
                <img src={t.icon} alt="" width="28" height="28" />
                <span className="new-listing-symbol">{t.symbol}</span>
                <span className={`new-listing-change${t.negative ? ' negative' : ''}`}>{t.change}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Tabs */}
        <div className="tabs" role="tablist" data-bk-component="tab-bar">
          {MARKET_TABS.map(tab => (
            <button
              key={tab}
              className={`tab${activeMarketTab === tab ? ' active' : ''}`}
              role="tab"
              aria-selected={activeMarketTab === tab}
              onClick={() => setActiveMarketTab(tab)}
            >{tab}</button>
          ))}
        </div>

        {/* Sort + Chain Filters row */}
        <div className="top-header">
          <span className="top-label" />
          <button className="sort-btn" onClick={cycleSort} aria-label={`Sort by ${sortBy}`}>
            {sortBy} &#9662;
          </button>
        </div>

        {/* Chain Filters */}
        <div className="chain-filters" data-bk-component="tab-bar" role="group" aria-label="Chain filter">
          {CHAINS.map((c) => (
            <Button
              key={c}
              className={`chain-pill${activeChain === c ? ' active' : ''}`}
              aria-pressed={activeChain === c}
              onPress={() => setActiveChain(c)}
            >
              {c}
            </Button>
          ))}
        </div>

        {/* Token List */}
        <div className="token-list-explore" role="list" aria-label="Top tokens by volume">
          {sortedTokens.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 13, color: 'var(--bk-text-muted)' }}>
              No tokens match this filter.
            </div>
          ) : sortedTokens.map((t) => (
            <button
              key={t.id}
              className="token-row-explore"
              role="listitem"
              aria-label={`${t.name}: ${t.price}, ${t.change}`}
              onClick={() => navigate(`/asset/${t.id}`)}
            >
              <span className="token-rank">{t.rank}</span>
              <img className="token-icon-sm" src={t.icon} alt={t.name} />
              <div className="token-info-explore">
                <div className="token-name-sm">{t.name}</div>
                <div className="token-volume">{t.volume}</div>
              </div>
              <div className="token-values-explore">
                <div className="token-price">{t.price}</div>
                <div className={`token-change-explore${t.negative ? ' negative' : ' positive'}`}>{t.change}</div>
              </div>
              <button
                className={`fav-star-btn${favourites.has(t.id) ? ' active' : ''}`}
                aria-label={`${favourites.has(t.id) ? 'Remove from' : 'Add to'} favourites`}
                onClick={(e) => { e.stopPropagation(); toggleFav(t.id); }}
              >
                <Star size={14} strokeWidth={1.5} />
              </button>
            </button>
          ))}
        </div>

      </div>{/* /.scroll-content */}

      <BottomNav />
    </motion.main>
  );
}
