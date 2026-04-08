/**
 * SwapContext — global state for the swap flow.
 *
 * Holds selected tokens and amount so SwapScreen and SwapSelectScreen
 * share state without prop drilling or URL params.
 */

import { createContext, useContext, useState } from 'react';
import { SWAP_TOKENS } from './tokens-data';

const SwapContext = createContext(null);

export function SwapProvider({ children }) {
  const [payKey,     setPayKey]     = useState('ETH');
  const [receiveKey, setReceiveKey] = useState(null);
  const [payAmount,  setPayAmount]  = useState('');
  const [activePct,  setActivePct]  = useState(null);

  const payToken     = SWAP_TOKENS[payKey];
  const receiveToken = receiveKey ? SWAP_TOKENS[receiveKey] : null;

  // USD value of the pay amount
  const payUSD = payAmount && payToken
    ? (parseFloat(payAmount) * payToken.price).toLocaleString('en-US', {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
      })
    : '0.00';

  // Computed receive amount based on relative prices
  const receiveAmount = payAmount && payToken && receiveToken
    ? ((parseFloat(payAmount) * payToken.price) / receiveToken.price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: receiveToken.price > 1000 ? 6 : 2,
      })
    : '';

  // Rate label for receive card footer
  const rateLabel = payToken && receiveToken
    ? `1 ${payToken.symbol} ≈ ${(payToken.price / receiveToken.price).toLocaleString('en-US', {
        maximumFractionDigits: receiveToken.price > 1000 ? 6 : 2,
      })} ${receiveToken.symbol}`
    : '';

  // Select a token for pay or receive side. Prevents same token on both sides.
  function selectToken(side, key) {
    if (side === 'pay') {
      if (key === receiveKey) setReceiveKey(payKey); // swap the other side
      setPayKey(key);
    } else {
      if (key === payKey) setPayKey(receiveKey);    // swap the other side
      setReceiveKey(key);
    }
    setPayAmount('');
    setActivePct(null);
  }

  // Swap the pay and receive tokens (arrow button)
  function swapDirections() {
    if (!receiveKey) return; // nothing to swap if no receive token
    const prev = payKey;
    setPayKey(receiveKey);
    setReceiveKey(prev);
    setPayAmount('');
    setActivePct(null);
  }

  return (
    <SwapContext.Provider value={{
      payToken, receiveToken,
      payKey, receiveKey,
      payAmount, setPayAmount,
      activePct, setActivePct,
      payUSD, receiveAmount, rateLabel,
      selectToken, swapDirections,
    }}>
      {children}
    </SwapContext.Provider>
  );
}

export function useSwap() {
  const ctx = useContext(SwapContext);
  if (!ctx) throw new Error('useSwap must be within SwapProvider');
  return ctx;
}
