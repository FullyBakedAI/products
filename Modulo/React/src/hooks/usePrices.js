import { useQuery } from '@tanstack/react-query';

const COINGECKO_IDS = {
  ETH:  'ethereum',
  WBTC: 'wrapped-bitcoin',
  USDC: 'usd-coin',
  USDT: 'tether',
  SOL:  'solana',
};

export function usePrices(symbols = []) {
  const ids = symbols.map(s => COINGECKO_IDS[s]).filter(Boolean).join(',');
  return useQuery({
    queryKey: ['prices', ids],
    queryFn: async () => {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      if (!res.ok) throw new Error('Price fetch failed');
      const data = await res.json();
      // Invert to symbol → price map
      return Object.entries(COINGECKO_IDS).reduce((acc, [sym, id]) => {
        if (data[id]) acc[sym] = data[id].usd;
        return acc;
      }, {});
    },
    staleTime: 30_000,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
