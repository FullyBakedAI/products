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
  ETH:  { symbol: 'ETH',  name: 'Ethereum',        icon: ethIcon,  price: 1842.50,  balance: 1.1421,   balanceLabel: '1.1421 ETH'    },
  USDC: { symbol: 'USDC', name: 'USD Coin',         icon: usdcIcon, price: 1.00,     balance: 5342.98,  balanceLabel: '5,342.98 USDC'  },
  WBTC: { symbol: 'WBTC', name: 'Wrapped Bitcoin',  icon: btcIcon,  price: 97840.00, balance: 0.0574,   balanceLabel: '0.0574 WBTC'   },
  SOL:  { symbol: 'SOL',  name: 'Solana',           icon: solIcon,  price: 165.42,   balance: 17.4352,  balanceLabel: '17.4352 SOL'   },
  USDT: { symbol: 'USDT', name: 'Tether',           icon: usdtIcon, price: 1.00,     balance: 3398.75,  balanceLabel: '3,398.75 USDT' },
};

export const TOKEN_ORDER = ['ETH', 'USDC', 'WBTC', 'SOL', 'USDT'];
