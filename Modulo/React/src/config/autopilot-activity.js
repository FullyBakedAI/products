/**
 * autopilot-activity.js — Mock current autopilot actions
 * Used by HomeScreen autopilot card
 */

export const AUTOPILOT_ACTIONS = [
  {
    id: 'ap-001',
    action: 'Moving 0.5 ETH to Aave on Arbitrum',
    reason: '+0.8% APY vs current position',
    path: {
      steps: [
        { type: 'token', symbol: 'ETH', chain: 'Ethereum' },
        { type: 'bridge', name: 'Stargate' },
        { type: 'token', symbol: 'ETH', chain: 'Arbitrum' },
        { type: 'protocol', name: 'Aave v3' },
        { type: 'token', symbol: 'aETH', chain: 'Arbitrum' },
      ],
      estimatedTime: '~45 sec',
    },
  },
  {
    id: 'ap-002',
    action: 'Rebalancing 1,200 USDC to Spark',
    reason: '+0.9% APY vs Compound',
    path: {
      steps: [
        { type: 'token', symbol: 'USDC', chain: 'Ethereum' },
        { type: 'protocol', name: 'Spark' },
        { type: 'token', symbol: 'sDAI', chain: 'Ethereum' },
      ],
      estimatedTime: '~15 sec',
    },
  },
  {
    id: 'ap-003',
    action: 'Compounding SOL staking rewards',
    reason: 'Auto-restake to maximise yield',
    path: {
      steps: [
        { type: 'token', symbol: 'SOL', chain: 'Solana' },
        { type: 'protocol', name: 'Jito' },
        { type: 'token', symbol: 'jitoSOL', chain: 'Solana' },
      ],
      estimatedTime: '~10 sec',
    },
  },
];

/** Returns the current active action (cycles on a timer in-app) */
export const CURRENT_AUTOPILOT_ACTION = AUTOPILOT_ACTIONS[0];
