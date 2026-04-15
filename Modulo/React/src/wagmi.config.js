import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum, base, optimism } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

// WalletConnect omitted until VITE_WALLETCONNECT_PROJECT_ID is set — 'demo' throws on init.
const connectors = [
  injected(),
  coinbaseWallet({ appName: 'Modulo' }),
];

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, arbitrum, base, optimism],
  connectors,
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_RPC_MAINNET || undefined),
    [polygon.id]: http(import.meta.env.VITE_RPC_POLYGON || undefined),
    [arbitrum.id]: http(import.meta.env.VITE_RPC_ARBITRUM || undefined),
    [base.id]: http(import.meta.env.VITE_RPC_BASE || undefined),
    [optimism.id]: http(import.meta.env.VITE_RPC_OPTIMISM || undefined),
  },
});
