/**
 * transaction-paths.js — Mock transaction route data
 * Used by TransactionPath component in SwapTab, ReviewScreen, HomeScreen
 */

export const TRANSACTION_PATHS = {
  ETH_USDC: {
    steps: [
      { type: 'token', symbol: 'ETH', chain: 'Ethereum' },
      { type: 'protocol', name: 'Uniswap v3' },
      { type: 'token', symbol: 'USDC', chain: 'Ethereum' },
    ],
    estimatedTime: '~15 sec',
  },
  ETH_USDC_ARBITRUM: {
    steps: [
      { type: 'token', symbol: 'ETH', chain: 'Ethereum' },
      { type: 'bridge', name: 'Stargate' },
      { type: 'token', symbol: 'ETH', chain: 'Arbitrum' },
      { type: 'protocol', name: 'Uniswap v3' },
      { type: 'token', symbol: 'USDC', chain: 'Arbitrum' },
    ],
    estimatedTime: '~45 sec',
  },
  BTC_ETH: {
    steps: [
      { type: 'token', symbol: 'BTC', chain: 'Bitcoin' },
      { type: 'bridge', name: 'THORChain' },
      { type: 'token', symbol: 'ETH', chain: 'Ethereum' },
    ],
    estimatedTime: '~2 min',
  },
  ETH_AAVE: {
    steps: [
      { type: 'token', symbol: 'ETH', chain: 'Ethereum' },
      { type: 'bridge', name: 'Stargate' },
      { type: 'token', symbol: 'ETH', chain: 'Arbitrum' },
      { type: 'protocol', name: 'Aave v3' },
      { type: 'token', symbol: 'aETH', chain: 'Arbitrum' },
    ],
    estimatedTime: '~45 sec',
  },
  USDC_SOL: {
    steps: [
      { type: 'token', symbol: 'USDC', chain: 'Ethereum' },
      { type: 'bridge', name: 'Wormhole' },
      { type: 'token', symbol: 'USDC', chain: 'Solana' },
    ],
    estimatedTime: '~30 sec',
  },
  ETH_SOL: {
    steps: [
      { type: 'token', symbol: 'ETH', chain: 'Ethereum' },
      { type: 'bridge', name: 'Wormhole' },
      { type: 'token', symbol: 'ETH', chain: 'Solana' },
      { type: 'protocol', name: 'Jupiter' },
      { type: 'token', symbol: 'SOL', chain: 'Solana' },
    ],
    estimatedTime: '~1 min',
  },
};

/**
 * Get the best matching path for two token symbols.
 * Falls back to a simple same-chain path if no match found.
 */
export function getPathForTokens(fromSymbol, toSymbol) {
  const key = `${fromSymbol}_${toSymbol}`.toUpperCase();
  if (TRANSACTION_PATHS[key]) return TRANSACTION_PATHS[key];

  // Generic fallback
  return {
    steps: [
      { type: 'token', symbol: fromSymbol, chain: 'Ethereum' },
      { type: 'protocol', name: 'Best route' },
      { type: 'token', symbol: toSymbol, chain: 'Ethereum' },
    ],
    estimatedTime: '~20 sec',
  };
}
