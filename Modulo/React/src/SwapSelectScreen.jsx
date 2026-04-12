/**
 * SwapSelectScreen — select token for swap
 * Route: /swap/select/:side (side = 'pay' | 'receive')
 * Matches HTML prototype at ../Prototype/swap-select-screen.html
 * All colours via --bk-* tokens. All data mocked.
 */

import { Button } from 'react-aria-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useSwap } from './SwapContext';
import { useActions } from './ActionsContext';
import { SWAP_TOKENS, TOKEN_ORDER } from './tokens-data';
import './swap-select.css';

import iconSearch from './assets/icon-search.svg';

export default function SwapSelectScreen() {
  const navigate = useNavigate();
  const { side }  = useParams();
  const { selectToken, payKey, receiveKey } = useSwap();
  const { openActions } = useActions();

  function handleSelect(symbol) {
    selectToken(side, symbol);
    openActions({ tab: 'swap' });
    navigate('/');
  }

  return (
    <main role="main" aria-label="Modulo select token screen" className="swap-select-screen">
      <div className="drag-handle" aria-hidden="true">
        <div className="drag-handle-pill" />
      </div>

      <div className="select-header">
        <span className="select-title">Select token</span>
        <Button className="close-btn-shared" aria-label="Close" onPress={() => { openActions({ tab: 'swap' }); navigate('/'); }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M16.5 5.5L5.5 16.5" stroke="var(--bk-text-muted)" strokeWidth="1.667" strokeLinecap="round" />
            <path d="M5.5 5.5L16.5 16.5" stroke="var(--bk-text-muted)" strokeWidth="1.667" strokeLinecap="round" />
          </svg>
        </Button>
      </div>

      <div className="search-field select-search" role="search" aria-label="Search tokens">
        <img src={iconSearch} alt="" />
        <span>Token name or address</span>
      </div>

      <div className="select-token-list" role="list" aria-label="Available tokens">
        {TOKEN_ORDER.map((key) => {
          const t       = SWAP_TOKENS[key];
          const isActive = key === (side === 'pay' ? payKey : receiveKey);
          return (
            <Button
              key={key}
              className={`select-token-row${isActive ? ' selected' : ''}`}
              role="listitem"
              aria-label={`${t.symbol} — ${t.balanceLabel}`}
              aria-pressed={isActive}
              onPress={() => handleSelect(key)}
            >
              <img className="select-token-icon" src={t.icon} alt="" />
              <div className="select-token-info">
                <div className="select-token-name">{t.symbol}</div>
                <div className="select-token-balance">{t.balanceLabel}</div>
              </div>
              {isActive && (
                <svg className="select-token-check" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="9" cy="9" r="8.5" stroke="var(--bk-brand-primary)" />
                  <path d="M5 9L7.5 11.5L13 6" stroke="var(--bk-brand-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </Button>
          );
        })}
      </div>
    </main>
  );
}
