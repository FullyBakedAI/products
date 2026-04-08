/**
 * ExploreScreen — market discovery
 * Matches HTML prototype at ../Prototype/explore-screen.html
 * All colours via --bk-* tokens. All data mocked.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import StatusBar from './StatusBar';
import BottomNav from './BottomNav';
import './explore.css';

import { Search, MoreHorizontal } from 'lucide-react';
import tokenEth from './assets/token-eth.svg';
import tokenBtc from './assets/token-btc.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenUsdt from './assets/token-usdt.svg';
import tokenSol from './assets/token-sol.svg';
import sparklineEth from './assets/explore-sparkline-eth.svg';
import sparklineBtc from './assets/explore-sparkline-btc.svg';

const CHAINS = ['All', 'Ethereum', 'Arbitrum', 'Base', 'Optimism'];

const TOP_TOKENS = [
  { rank: 1, icon: tokenUsdc, name: 'USD Coin',       volume: '$514M Vol', price: '$1.00',       change: '-0.38%', negative: true  },
  { rank: 2, icon: tokenEth,  name: 'Ethereum',       volume: '$480M Vol', price: '$2,450.78',   change: '+4.42%', negative: false },
  { rank: 3, icon: tokenUsdt, name: 'Tether',         volume: '$398M Vol', price: '$1.00',       change: '+0.01%', negative: false },
  { rank: 4, icon: tokenBtc,  name: 'Wrapped Bitcoin',volume: '$244M Vol', price: '$88,421.33',  change: '+2.14%', negative: false },
  { rank: 5, icon: tokenSol,  name: 'Solana',         volume: '$220M Vol', price: '$165.42',     change: '-1.82%', negative: true  },
];

export default function ExploreScreen() {
  const [activeChain, setActiveChain] = useState('All');

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
            <MoreHorizontal size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>

        <div className="fav-cards" role="group" aria-label="Favourite tokens">
          {/* ETH Card */}
          <div className="fav-card" role="button" aria-label="ETH — $2,450.78 +4.42%" tabIndex={0}>
            <div className="fav-card-top">
              <img src={tokenEth} alt="" />
              <span>ETH</span>
            </div>
            <div className="fav-sparkline" aria-hidden="true">
              <img src={sparklineEth} alt="" />
            </div>
            <div className="fav-card-bottom">
              <span className="fav-price">$2,450.78</span>
              <span className="fav-change positive">+4.42%</span>
            </div>
          </div>

          {/* BTC Card */}
          <div className="fav-card" role="button" aria-label="BTC — $88,421 +2.14%" tabIndex={0}>
            <div className="fav-card-top">
              <img src={tokenBtc} alt="" />
              <span>BTC</span>
            </div>
            <div className="fav-sparkline" aria-hidden="true">
              <img src={sparklineBtc} alt="" />
            </div>
            <div className="fav-card-bottom">
              <span className="fav-price">$88,421</span>
              <span className="fav-change positive">+2.14%</span>
            </div>
          </div>
        </div>

        {/* Top Tokens Header */}
        <div className="top-header">
          <span className="top-label">Top tokens</span>
          <span className="volume-dropdown">Volume &#9662;</span>
        </div>

        {/* Chain Filters */}
        <div className="chain-filters" data-bk-component="chain-filter" role="group" aria-label="Chain filter">
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
          {TOP_TOKENS.map((t) => (
            <div
              key={t.rank}
              className="token-row-explore"
              role="listitem"
              aria-label={`${t.name}: ${t.price}, ${t.change}`}
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
            </div>
          ))}
        </div>

      </div>{/* /.scroll-content */}

      <BottomNav />
    </motion.main>
  );
}
