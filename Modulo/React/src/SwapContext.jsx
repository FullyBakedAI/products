/**
 * SwapContext — global state for the swap flow.
 *
 * Holds selected tokens and amount so SwapScreen and SwapSelectScreen
 * share state without prop drilling or URL params.
 */

import { createContext, useContext, useState } from 'react';
import BigNumber from 'bignumber.js';
import { SWAP_TOKENS } from './tokens-data';
import { formatUSD } from './utils/formatters';
import { usePrices } from './hooks/usePrices';

const SwapContext = createContext(null);

// Display decimals for the receive card — capped at 6 for readability
// even when maxDecimals is 18 (ETH).
const DISPLAY_DECIMALS_CAP = 6;

function displayDecimals(token) {
  if (!token) return 2;
  return Math.min(token.maxDecimals, DISPLAY_DECIMALS_CAP);
}

export function SwapProvider({ children }) {
  const [payKey,     setPayKey]     = useState('ETH');
  const [receiveKey, setReceiveKey] = useState(null);
  const [payAmount,  setPayAmount]  = useState('');
  const [activePct,  setActivePct]  = useState(null);

  // Task 4: slippage (%) and deadline (minutes) settings
  const [slippage,  setSlippage]  = useState(0.5);
  const [deadline,  setDeadline]  = useState(20);

  const payToken     = SWAP_TOKENS[payKey];
  const receiveToken = receiveKey ? SWAP_TOKENS[receiveKey] : null;

  // Live prices from CoinGecko — fall back to mock prices while loading/offline
  const { data: livePrices, isLoading: pricesLoading, isError: pricesError } =
    usePrices(['ETH', 'WBTC', 'USDC', 'USDT', 'SOL']);

  const livePayPrice     = livePrices?.[payKey]     ?? payToken.price;
  const liveReceivePrice = receiveToken
    ? (livePrices?.[receiveKey] ?? receiveToken.price)
    : null;

  const decimals = displayDecimals(receiveToken);

  // USD value of the pay amount — BigNumber arithmetic, live price
  const payUSD = payAmount && payToken
    ? formatUSD(
        new BigNumber(payAmount).times(livePayPrice).toNumber()
      ).slice(1) // strip leading $ for display consistency
    : '0.00';

  // Computed receive amount — raw numeric string for calculations/navigation state
  // Uses receiveToken.maxDecimals (capped) instead of price heuristic
  const receiveAmountRaw = payAmount && payToken && receiveToken && liveReceivePrice
    ? new BigNumber(payAmount)
        .times(livePayPrice)
        .div(liveReceivePrice)
        .toFixed(decimals)
    : '';

  // Display-formatted — toLocaleString only at render time, never passed downstream
  const receiveAmount = receiveAmountRaw
    ? parseFloat(receiveAmountRaw).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals,
      })
    : '';

  // Rate label for receive card footer — BigNumber arithmetic, maxDecimals-aware
  const rateLabel = payToken && receiveToken && liveReceivePrice
    ? `1 ${payToken.symbol} ≈ ${new BigNumber(livePayPrice)
        .div(liveReceivePrice)
        .toNumber()
        .toLocaleString('en-US', {
          maximumFractionDigits: decimals,
        })} ${receiveToken.symbol}`
    : '';

  // Select a token for pay or receive side. Prevents same token on both sides.
  function selectToken(side, key) {
    if (side === 'pay') {
      if (key === receiveKey) setReceiveKey(payKey); // swap the other side
      setPayKey(key);
    } else {
      if (key === payKey) setPayKey(receiveKey ?? "ETH"); // swap the other side
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
      payUSD, receiveAmount, receiveAmountRaw, rateLabel,
      selectToken, swapDirections,
      slippage, setSlippage,
      deadline, setDeadline,
      livePayPrice, liveReceivePrice,
      pricesLoading, pricesError,
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
