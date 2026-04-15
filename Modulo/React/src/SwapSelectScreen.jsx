/**
 * SwapSelectScreen — select token for swap
 * Route: /swap/select/:side (side = 'pay' | 'receive')
 * Search field auto-focuses on mount and filters by symbol/name.
 */

import { useState, useRef, useEffect } from 'react';
import { Button, TextField, Input } from 'react-aria-components';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSwap } from './SwapContext';
import { useActions } from './ActionsContext';
import { useBrandConfig } from './theme/BrandConfig';
import { SWAP_TOKENS, TOKEN_ORDER } from './tokens-data';
import './swap-select.css';

import iconSearch from './assets/icon-search.svg';

export default function SwapSelectScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { side }  = useParams();
  const { selectToken, payKey, receiveKey } = useSwap();
  const { openActions } = useActions();
  const { brandName } = useBrandConfig();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  // Auto-focus the search field on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const q = query.trim().toLowerCase();
  const filteredKeys = TOKEN_ORDER.filter(key => {
    if (!q) return true;
    const t = SWAP_TOKENS[key];
    return t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q);
  });

  function handleSelect(symbol) {
    selectToken(side, symbol);
    if (location.state?.from === 'swap') {
      navigate('/swap');
    } else {
      openActions({ tab: 'swap' });
      navigate('/');
    }
  }

  return (
    <main role="main" aria-label={`${brandName} select token screen`} className="swap-select-screen">
      <div className="drag-handle" aria-hidden="true">
        <div className="drag-handle-pill" />
      </div>

      <div className="select-header">
        <span className="select-title">Select token</span>
        <Button className="close-btn-shared" aria-label="Close" onPress={() => { if (location.state?.from === 'swap') { navigate('/swap'); } else { openActions({ tab: 'swap' }); navigate('/'); } }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <path d="M16.5 5.5L5.5 16.5" stroke="var(--bk-text-muted)" strokeWidth="1.667" strokeLinecap="round" />
            <path d="M5.5 5.5L16.5 16.5" stroke="var(--bk-text-muted)" strokeWidth="1.667" strokeLinecap="round" />
          </svg>
        </Button>
      </div>

      <TextField
        className="select-search"
        value={query}
        onChange={setQuery}
        aria-label="Search tokens"
      >
        <div className="select-search-wrap">
          <img src={iconSearch} alt="" aria-hidden="true" className="select-search-icon" />
          <Input
            ref={inputRef}
            className="select-search-input"
            placeholder="Token name or address"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck="false"
          />
        </div>
      </TextField>

      <div className="select-token-list" role="list" aria-label="Available tokens">
        {filteredKeys.length === 0 ? (
          <div className="select-no-results">No tokens match "{query}"</div>
        ) : (
          filteredKeys.map((key) => {
            const t = SWAP_TOKENS[key];
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
          })
        )}
      </div>
    </main>
  );
}
