/**
 * Modulo token definitions — shared between SwapScreen, SwapSelectScreen.
 * All prices and balances are mock data matching the HTML prototype.
 */

import ethIcon  from './assets/token-eth.svg';
import usdcIcon from './assets/token-usdc.svg';
import btcIcon  from './assets/token-btc.svg';
import solIcon  from './assets/token-sol.svg';
import usdtIcon from './assets/token-usdt.svg';

export const SWAP_TOKENS = {
  ETH:  { symbol: 'ETH',  name: 'Ethereum',        icon: ethIcon,  price: 1842.50,  /* fallback — overridden by usePrices() in SwapContext */ balance: 1.1421,   balanceLabel: '1.1421 ETH',    maxDecimals: 18 },
  USDC: { symbol: 'USDC', name: 'USD Coin',         icon: usdcIcon, price: 1.00,     /* fallback — overridden by usePrices() in SwapContext */ balance: 5342.98,  balanceLabel: '5,342.98 USDC', maxDecimals: 6  },
  WBTC: { symbol: 'WBTC', name: 'Wrapped Bitcoin',  icon: btcIcon,  price: 97840.00, /* fallback — overridden by usePrices() in SwapContext */ balance: 0.0574,   balanceLabel: '0.0574 WBTC',   maxDecimals: 8  },
  SOL:  { symbol: 'SOL',  name: 'Solana',           icon: solIcon,  price: 165.42,   /* fallback — overridden by usePrices() in SwapContext */ balance: 17.4352,  balanceLabel: '17.4352 SOL',   maxDecimals: 8  },
  USDT: { symbol: 'USDT', name: 'Tether',           icon: usdtIcon, price: 1.00,     /* fallback — overridden by usePrices() in SwapContext */ balance: 3398.75,  balanceLabel: '3,398.75 USDT', maxDecimals: 6  },
};

export const TOKEN_ORDER = ['ETH', 'USDC', 'WBTC', 'SOL', 'USDT'];
