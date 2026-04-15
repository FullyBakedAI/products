import { useQuery } from '@tanstack/react-query';
import { usePrices } from './usePrices';

const SWAP_GAS_UNITS = 150_000;
const PROTOCOL_FEE_BPS = 5; // 0.05%

export function useGasEstimate(chainId = 1, swapAmountUSD = 0) {
  const { data: livePrices } = usePrices(['ETH']);
  const ethPrice = livePrices?.ETH ?? null;

  return useQuery({
    queryKey: ['gasEstimate', chainId, ethPrice, swapAmountUSD],
    queryFn: async () => {
      if (!ethPrice) return null;
      const res = await fetch('https://cloudflare-eth.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_gasPrice', params: [], id: 1 }),
      });
      if (!res.ok) throw new Error(`Gas RPC ${res.status}`);
      const { result } = await res.json();
      const gasPriceGwei = parseInt(result, 16) / 1e9;
      const gasCostUSD = (gasPriceGwei * SWAP_GAS_UNITS * ethPrice) / 1e9;
      const protocolFee = swapAmountUSD * PROTOCOL_FEE_BPS / 10_000;
      return {
        network: `$${gasCostUSD.toFixed(2)}`,
        protocol: `$${protocolFee.toFixed(2)}`,
        total: `$${(gasCostUSD + protocolFee).toFixed(2)}`,
      };
    },
    enabled: ethPrice != null,
    staleTime: 15_000,
    retry: 2,
  });
}
