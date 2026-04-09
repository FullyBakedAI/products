/**
 * SendAmountScreen — enter amount to send after selecting recipient
 * Context: Sending — high stakes, wrong amount = lost funds.
 * Route: /send/amount
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { X, ArrowRight } from 'lucide-react';
import StatusBar from './StatusBar';
import './send-amount.css';

import tokenEth  from './assets/token-eth.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenUsdt from './assets/token-usdt.svg';

const TOKENS = [
  { key: 'usdc', icon: tokenUsdc, symbol: 'USDC', balance: 5342.98,  price: 1.00,     decimals: 2 },
  { key: 'eth',  icon: tokenEth,  symbol: 'ETH',  balance: 1.1421,   price: 2450.78,  decimals: 4 },
  { key: 'btc',  icon: tokenBtc,  symbol: 'BTC',  balance: 0.0574,   price: 88421.33, decimals: 6 },
  { key: 'sol',  icon: tokenSol,  symbol: 'SOL',  balance: 17.4352,  price: 165.42,   decimals: 4 },
  { key: 'usdt', icon: tokenUsdt, symbol: 'USDT', balance: 3398.75,  price: 1.00,     decimals: 2 },
];

export default function SendAmountScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const recipient = location.state?.recipient || { name: '0x4248...EF33' };

  const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
  const [amount, setAmount] = useState('');
  const [showTokenPicker, setShowTokenPicker] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const usdValue = numAmount * selectedToken.price;
  const hasAmount = numAmount > 0;
  const overBalance = numAmount > selectedToken.balance;

  function handleKey(k) {
    setAmount(prev => {
      if (k === 'del') return prev.slice(0, -1);
      if (k === '.' && prev.includes('.')) return prev;
      if (k === '.' && !prev) return '0.';
      if (prev === '0' && k !== '.') return k;
      return prev + k;
    });
  }

  function handleMax() {
    setAmount(selectedToken.balance.toString());
  }

  function handleReview() {
    if (!hasAmount || overBalance) return;
    navigate('/review', {
      state: {
        action: 'send',
        from: {
          icon: selectedToken.icon,
          symbol: selectedToken.symbol,
          amount: amount,
          usd: usdValue,
        },
        to: {
          icon: null,
          symbol: recipient.name,
          amount: amount + ' ' + selectedToken.symbol,
          usd: usdValue,
        },
        fee: { network: '$2.40', protocol: '$0.00', total: '$2.40' },
        rate: `Sending to ${recipient.name}`,
        warning: null,
      }
    });
  }

  return (
    <motion.main
      className="send-amount-screen"
      role="main"
      aria-label="Send amount"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <StatusBar />

      {/* Header */}
      <div className="sa-header">
        <Button className="close-btn-shared" aria-label="Close" onPress={() => navigate('/')}>
          <X size={20} color="var(--bk-text-muted)" strokeWidth={1.5} />
        </Button>
        <span className="sa-title">Send to {recipient.name}</span>
        <div style={{ width: 20 }} />
      </div>

      {/* Amount display */}
      <div className="sa-amount-display">
        <div className="sa-amount-row">
          <span className={`sa-amount-value${!hasAmount ? ' dimmed' : ''}${overBalance ? ' error' : ''}`}>
            {amount || '0'}
          </span>
          <button className="sa-token-pill" onClick={() => setShowTokenPicker(!showTokenPicker)}>
            <img src={selectedToken.icon} width="22" height="22" alt="" />
            <span>{selectedToken.symbol}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2,4 6,8 10,4" stroke="var(--bk-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div className="sa-usd-row">
          <span className="sa-usd">
            {hasAmount ? `≈ $${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '\u00A0'}
          </span>
        </div>
        <div className="sa-balance-row">
          <span className="sa-balance">Balance: {selectedToken.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {selectedToken.symbol}</span>
          <button className="sa-max-btn" onClick={handleMax}>MAX</button>
        </div>
        {overBalance && (
          <div className="sa-error">Insufficient balance</div>
        )}
      </div>

      {/* Token picker dropdown */}
      {showTokenPicker && (
        <div className="sa-token-dropdown">
          {TOKENS.map(t => (
            <button
              key={t.key}
              className={`sa-token-option${t.key === selectedToken.key ? ' active' : ''}`}
              onClick={() => { setSelectedToken(t); setShowTokenPicker(false); setAmount(''); }}
            >
              <img src={t.icon} width="28" height="28" alt="" />
              <div className="sa-token-option-info">
                <span className="sa-token-option-symbol">{t.symbol}</span>
                <span className="sa-token-option-bal">{t.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Numpad */}
      <div className="sa-numpad">
        {['1','2','3','4','5','6','7','8','9','.','0','del'].map(k => (
          <button key={k} className="sa-numpad-key" onClick={() => handleKey(k)} aria-label={k === 'del' ? 'Delete' : k}>
            {k === 'del' ? (
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M8 1L1 8L8 15" stroke="var(--bk-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 8H21" stroke="var(--bk-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : k}
          </button>
        ))}
      </div>

      {/* CTA */}
      <Button
        className={`primary-btn sa-cta${(!hasAmount || overBalance) ? ' disabled' : ''}`}
        aria-label="Review send"
        onPress={handleReview}
        isDisabled={!hasAmount || overBalance}
      >
        Review
        <ArrowRight size={18} strokeWidth={1.5} style={{ marginLeft: 6 }} />
      </Button>
    </motion.main>
  );
}
