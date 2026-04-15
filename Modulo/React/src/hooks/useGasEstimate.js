import { useQuery } from '@tanstack/react-query';

export function useGasEstimate(chainId = 1) {
  return useQuery({
    queryKey: ['gasEstimate', chainId],
    queryFn: async () => {
      try {
        // Use public Cloudflare Ethereum gateway — no API key needed
        const res = await fetch('https://cloudflare-eth.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 }),
        });
        const { result } = await res.json();
        const gasPriceGwei = parseInt(result, 16) / 1e9;
        const swapGasUnits = 150_000; // typical Uniswap V3 swap
        const ethPrice = 3500; // TODO: replace with live ETH price from usePrices
        const gasCostUSD = (gasPriceGwei * swapGasUnits * ethPrice) / 1e9;
        return {
          network: `$${gasCostUSD.toFixed(2)}`,
          protocol: '$0.05', // 0.05% protocol fee placeholder
          total: `$${(gasCostUSD + 0.05 * /* amount */ 100 / 100).toFixed(2)}`,
        };
      } catch {
        return null; // falls back to "Estimating..." in ReviewScreen
      }
    },
    staleTime: 15_000,
    retry: 2,
  });
}
