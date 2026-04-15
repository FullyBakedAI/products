/**
 * SwapContext unit tests — Sprint 1
 *
 * Covers:
 *  - receiveAmountRaw has no locale commas (safe for parseFloat downstream)
 *  - selectToken('pay', key) when key === receiveKey swaps both sides
 *  - swapDirections() swaps pay and receive keys
 *  - payUSD returns '0.00' when payAmount is empty
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SwapProvider, useSwap } from '../SwapContext';

// SVG assets are not resolvable in jsdom — stub them out.
vi.mock('../assets/token-eth.svg',  () => ({ default: 'token-eth.svg'  }));
vi.mock('../assets/token-usdc.svg', () => ({ default: 'token-usdc.svg' }));
vi.mock('../assets/token-btc.svg',  () => ({ default: 'token-btc.svg'  }));
vi.mock('../assets/token-sol.svg',  () => ({ default: 'token-sol.svg'  }));
vi.mock('../assets/token-usdt.svg', () => ({ default: 'token-usdt.svg' }));

// usePrices hits CoinGecko — stub for offline-safe, deterministic tests.
vi.mock('../hooks/usePrices', () => ({
  usePrices: () => ({ data: null, isLoading: false, isError: false }),
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <SwapProvider>{children}</SwapProvider>
  </QueryClientProvider>
);

describe('SwapContext', () => {
  it('receiveAmountRaw is a plain numeric string with no commas', () => {
    const { result } = renderHook(() => useSwap(), { wrapper });

    act(() => {
      result.current.selectToken('receive', 'USDC');
    });
    act(() => {
      result.current.setPayAmount('10');
    });

    const raw = result.current.receiveAmountRaw;
    expect(raw).not.toBe('');
    // Must not contain commas (locale-safe for parseFloat)
    expect(raw).not.toContain(',');
    // Must be a finite number
    expect(Number.isFinite(parseFloat(raw))).toBe(true);
  });

  it('selectToken("pay", key) when key === receiveKey swaps both sides', () => {
    const { result } = renderHook(() => useSwap(), { wrapper });

    // Set up: pay=ETH, receive=USDC
    act(() => {
      result.current.selectToken('receive', 'USDC');
    });
    expect(result.current.payKey).toBe('ETH');
    expect(result.current.receiveKey).toBe('USDC');

    // Now select USDC on the pay side — should swap: pay=USDC, receive=ETH
    act(() => {
      result.current.selectToken('pay', 'USDC');
    });
    expect(result.current.payKey).toBe('USDC');
    expect(result.current.receiveKey).toBe('ETH');
  });

  it('swapDirections() swaps pay and receive keys', () => {
    const { result } = renderHook(() => useSwap(), { wrapper });

    act(() => {
      result.current.selectToken('receive', 'SOL');
    });
    expect(result.current.payKey).toBe('ETH');
    expect(result.current.receiveKey).toBe('SOL');

    act(() => {
      result.current.swapDirections();
    });
    expect(result.current.payKey).toBe('SOL');
    expect(result.current.receiveKey).toBe('ETH');
  });

  it('payUSD returns "0.00" when payAmount is empty', () => {
    const { result } = renderHook(() => useSwap(), { wrapper });

    // Default state: payAmount is ''
    expect(result.current.payAmount).toBe('');
    expect(result.current.payUSD).toBe('0.00');
  });
});
