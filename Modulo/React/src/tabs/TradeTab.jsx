/**
 * TradeTab — market/limit order ticket inside ActionsScreen
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from '../motion-tokens';
import { Button } from 'react-aria-components';
import { useActions } from '../ActionsContext';
import { SWAP_TOKENS } from '../tokens-data';
import tokenUsdc from '../assets/token-usdc.svg';
import {
  useFlowNavigate,
  AssetHeader,
  Numpad,
  ASSET_ID_TO_TOKEN,
} from './actions-shared';

export default function TradeTab() {
  const navigate = useFlowNavigate();
  const { asset } = useActions();
  const tokenKey = (asset && ASSET_ID_TO_TOKEN[asset]) || 'ETH';
  const tok      = SWAP_TOKENS[tokenKey];

  const [orderType, setOrderType]   = useState('market');
  const [direction, setDirection]   = useState('buy');
  const [amount, setAmount]         = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [activeInput, setActiveInput] = useState('amount');
  const [isQuoting, setIsQuoting]   = useState(false); // MOD-022

  function handleKey(key) {
    const setter = activeInput === 'limit' ? setLimitPrice : setAmount;
    setter(prev => {
      if (key === 'del') return prev.slice(0, -1);
      if (key === '.') { if (prev.includes('.')) return prev; return prev.length === 0 ? '0.' : prev + '.'; }
      if (prev.includes('.') && prev.split('.')[1].length >= 8) return prev;
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
  }

  const dollarVal  = parseFloat(amount || 0);
  const tokenAmt   = dollarVal > 0 ? (dollarVal / tok.price).toFixed(6) : '0';
  const ctaReady   = dollarVal > 0 && (orderType === 'market' || parseFloat(limitPrice || 0) > 0);
  const ctaClass   = ctaReady ? (direction === 'buy' ? 'trade-cta-buy' : 'trade-cta-sell') : 'cta-disabled';
  const ctaLabel   = isQuoting ? 'Fetching best rate...' : ctaReady ? 'Review Trade' : 'Enter an amount';

  return (
    <div className="actions-tab-stack">
      <div className="actions-tab-scroll">

      <AssetHeader tok={tok} tokenKey={tokenKey} />

      {/* Buy / Sell toggle */}
      <div className="trade-direction-tabs" role="group" aria-label="Buy or sell">
        <Button
          className={`trade-dir-tab${direction === 'buy' ? ' dir-buy-active' : ''}`}
          role="switch"
          onPress={() => setDirection('buy')}
          aria-pressed={direction === 'buy'}
        >Buy</Button>
        <Button
          className={`trade-dir-tab${direction === 'sell' ? ' dir-sell-active' : ''}`}
          role="switch"
          onPress={() => setDirection('sell')}
          aria-pressed={direction === 'sell'}
        >Sell</Button>
      </div>

      {/* Order type pills */}
      <div className="trade-order-type-row" role="group" aria-label="Order type">
        {['market', 'limit'].map(t => (
          <Button
            key={t}
            className={`trade-order-pill${orderType === t ? ' active' : ''}`}
            onPress={() => { setOrderType(t); setActiveInput('amount'); }}
            aria-pressed={orderType === t}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>

      {/* Limit price row */}
      {orderType === 'limit' && (
        <Button
          className={`trade-limit-row${activeInput === 'limit' ? ' focused' : ''}`}
          onPress={() => setActiveInput('limit')}
          aria-label={`Limit price: ${limitPrice ? '$' + limitPrice : 'not set'}`}
        >
          <span className="trade-limit-label">Limit price</span>
          <div className="trade-limit-right">
            <span className="trade-limit-value">{limitPrice ? `$${limitPrice}` : 'Set price'}</span>
            {activeInput === 'limit' && <span className="amount-cursor" aria-hidden="true" />}
          </div>
        </Button>
      )}

      {/* Amount display */}
      <Button
        className={`trade-amount-display${activeInput === 'amount' || orderType === 'market' ? ' focused' : ''}`}
        onPress={() => setActiveInput('amount')}
        aria-label={`Amount: $${amount || '0'}`}
      >
        <div className="trade-amount-value">
          <span className="trade-amount-currency">$</span>
          <span className="trade-amount-number">{amount || '0'}</span>
          {(activeInput === 'amount' || orderType === 'market') && (
            <span className="amount-cursor" aria-hidden="true" />
          )}
        </div>
        <div className="trade-amount-sub">≈ {tokenAmt} {tok.symbol}</div>
      </Button>

      {ctaReady && (
        <div className="trade-summary-row" aria-live="polite">
          <span>Est. fee $2.10</span>
          <span className="trade-summary-dot">·</span>
          <span>{direction === 'buy' ? 'Available $5,342 USDC' : `Available ${tok.balanceLabel}`}</span>
        </div>
      )}
      </div>{/* end actions-tab-scroll */}

      <Numpad onKey={handleKey} />

      <Button
        className={`bottom-cta-btn ${ctaClass}`}
        isDisabled={isQuoting || !ctaReady}
        aria-label={ctaLabel}
        onPress={() => {
          if (!ctaReady) return;
          setIsQuoting(true);
          setTimeout(() => {
            navigate('/review', { state: {
              action: 'trade',
              from: { icon: tokenUsdc, symbol: 'USDC', amount: `$${dollarVal.toLocaleString()}`, usd: dollarVal },
              to:   { icon: tok.icon,  symbol: tok.symbol,  amount: tokenAmt, usd: dollarVal },
              fee: { network: '$2.10', protocol: '$0.60', total: '$2.70' },
              rate: `1 ${tok.symbol} = $${tok.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} USDC`, warning: null,
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
