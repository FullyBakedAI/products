/**
 * AssetScreen — asset command centre
 *
 * Chart improvements (TradingView-inspired):
 *   - Trend-direction fill: green gradient when positive, red when negative
 *   - Floating crosshair price label: follows the cursor/touch, shows price at point
 *   - Live period switch: updates series data without recreating the chart
 *
 * Earn prominence (Ledger Live-inspired):
 *   - APY + projected earn displayed as prominently as the current price
 *
 * Route: /asset/:id  (modal slide-up)
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useActions } from './ActionsContext';
import { useIsDesktop } from './hooks/useIsDesktop';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m, tap } from './motion-tokens';
import { Button } from 'react-aria-components';
const IconX = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconArrowUp = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 15V5M10 5L6 9M10 5L14 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconArrowDown = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 5V15M10 15L6 11M10 15L14 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconZap = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M11 3L4 11H10L9 17L16 9H10L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const IconLandmark = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 16H17M3 8H17M10 4L3 8M10 4L17 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8V16M10 8V16M14 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconTrendingUp = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 14L8 9L11 12L17 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 6H17V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconStar = ({ size = 20, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 2.5l2.09 4.24 4.68.68-3.39 3.3.8 4.66L10 13.27l-4.18 2.11.8-4.66L3.23 7.42l4.68-.68L10 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill={filled ? 'currentColor' : 'none'}
    />
  </svg>
);
const IconBell = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 2a6 6 0 0 0-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 0 0-6-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8.5 17.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconExternalLink = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M9 5H5C4.45 5 4 5.45 4 6V15C4 15.55 4.45 16 5 16H14C14.55 16 15 15.55 15 15V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 4H16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
import { createChart, AreaSeries } from 'lightweight-charts';
import './asset.css';

import iconSettings   from './assets/icon-settings.svg';
import iconActionSend from './assets/icon-action-send.svg';
import iconActionRecv from './assets/icon-action-receive.svg';
import iconActionSwap from './assets/icon-action-swap.svg';

import tokenUsdc from './assets/token-usdc.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenUsdt from './assets/token-usdt.svg';

// ─── Token data ───────────────────────────────────────────────────────────────

const EXPLORER_URLS = {
  usdc: 'https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  btc:  'https://etherscan.io/token/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  eth:  'https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  sol:  'https://solscan.io/token/So11111111111111111111111111111111111111112',
  usdt: 'https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7',
};

const CONTRACT_DISPLAY = {
  usdc: '0xA0b8…eB48',
  btc:  '0x2260…C599',
  eth:  '0xC02a…756C',
  sol:  'So111…1112',
  usdt: '0xdAC1…ec7',
};

const CG = 'https://assets.coingecko.com/coins/images';

const TOKEN_MAP = {
  usdc: {
    icon: tokenUsdc, name: 'USD Coin', symbol: 'USDC',
    amount: '5,342.9824', usd: 5342.98, change24h: 0.00, negative: false,
    yield: 0.048, yieldUsd: 256.46,
    priceRange: [0.999, 1.001], chainPrice: '$1.00',
    chains: [{ name: 'Ethereum', amount: '3,000', usd: '$3,000' }, { name: 'Arbitrum', amount: '2,342.98', usd: '$2,342.98' }],
    activePositions: [
      { type: 'lend', protocol: 'Aave v3', chain: 'Ethereum', amount: '3,000 USDC', apy: 3.8, earnPerYear: '$114/yr' },
    ],
    about: 'USD Coin is a fully-reserved stablecoin pegged 1:1 to the US dollar. Issued by Circle, each USDC is backed by cash and short-duration US Treasuries held in regulated US financial institutions.',
    news: [
      { title: 'Circle files for US IPO, valuing firm at $5B', source: 'Bloomberg', age: '2h', sentiment: 'positive' },
      { title: 'USDC supply hits all-time high of $43B on-chain', source: 'The Block', age: '8h', sentiment: 'positive' },
      { title: 'Aave v3 USDC lending rates rise amid surge in borrowing demand', source: 'DeFiLlama', age: '1d', sentiment: 'neutral' },
    ],
  },
  btc: {
    icon: tokenBtc, name: 'Bitcoin', symbol: 'BTC',
    amount: '0.0574', usd: 5616.88, change24h: 2.14, negative: false,
    yield: 0.018, yieldUsd: 101.10,
    priceRange: [90000, 105000], chainPrice: '$97,855',
    chains: [{ name: 'Bitcoin', amount: '0.0574', usd: '$5,616.88' }],
    activePositions: [],
    about: 'Bitcoin is the original decentralised cryptocurrency, secured by proof-of-work mining. With a fixed supply of 21 million coins, it is widely held as a long-term store of value and a hedge against inflation.',
    news: [
      { title: 'BlackRock Bitcoin ETF records $480M single-day inflow', source: 'CoinDesk', age: '3h', sentiment: 'positive' },
      { title: 'BTC breaks $100K resistance for third time this month', source: 'CryptoSlate', age: '6h', sentiment: 'positive' },
      { title: 'US spot Bitcoin ETFs see combined AUM top $60B', source: 'Bloomberg', age: '1d', sentiment: 'neutral' },
    ],
  },
  eth: {
    icon: tokenEth, name: 'Ethereum', symbol: 'ETH',
    amount: '1.1421', usd: 4412.82, change24h: 4.38, negative: false,
    yield: 0.038, yieldUsd: 167.69,
    priceRange: [3600, 4600], chainPrice: '$3,864',
    chains: [{ name: 'Ethereum', amount: '0.6421', usd: '$2,481' }, { name: 'Base', amount: '0.5', usd: '$1,932' }],
    activePositions: [
      { type: 'stake', protocol: 'Lido', chain: 'Ethereum', amount: '1.0 ETH', apy: 4.2, earnPerYear: '$167/yr' },
    ],
    about: 'Ethereum is the leading smart contract platform, powering DeFi, NFTs, and thousands of decentralised applications. Its proof-of-stake consensus burns ETH with each transaction, making it a deflationary asset over time.',
    news: [
      { title: 'Ethereum Pectra upgrade confirmed for May — staking limit raised to 2048 ETH', source: 'Decrypt', age: '4h', sentiment: 'positive' },
      { title: 'Layer 2 TVL crosses $50B for first time, led by Base and Arbitrum', source: 'L2Beat', age: '12h', sentiment: 'positive' },
      { title: 'Lido staking share dips below 28% as solo staking grows', source: 'Blockworks', age: '2d', sentiment: 'neutral' },
    ],
  },
  sol: {
    icon: tokenSol, name: 'Solana', symbol: 'SOL',
    amount: '17.4352', usd: 4228.38, change24h: -1.82, negative: true,
    yield: 0.068, yieldUsd: 287.53,
    priceRange: [220, 280], chainPrice: '$242',
    chains: [{ name: 'Solana', amount: '17.4352', usd: '$4,228.38' }],
    activePositions: [],
    about: 'Solana is a high-performance blockchain capable of 65,000 transactions per second with sub-cent fees. Its combination of proof-of-stake and proof-of-history makes it a leading platform for consumer apps, DeFi, and memecoins.',
    news: [
      { title: 'Solana network congestion causes delays during memecoin surge', source: 'CoinTelegraph', age: '5h', sentiment: 'negative' },
      { title: 'Firedancer validator client goes live on mainnet', source: 'The Block', age: '1d', sentiment: 'positive' },
      { title: 'Solana DEX volume overtakes Ethereum for second consecutive week', source: 'DeFiLlama', age: '2d', sentiment: 'positive' },
    ],
  },
  usdt: {
    icon: tokenUsdt, name: 'Tether', symbol: 'USDT',
    amount: '3,398.7553', usd: 3398.75, change24h: 0.00, negative: false,
    yield: 0.046, yieldUsd: 156.34,
    priceRange: [0.999, 1.001], chainPrice: '$1.00',
    chains: [{ name: 'Ethereum', amount: '3,398.7553', usd: '$3,398.75' }],
    activePositions: [],
    about: 'Tether (USDT) is the world\'s largest stablecoin by market cap, pegged to the US dollar. It operates across 15+ blockchains and accounts for the majority of global crypto trading volume.',
    news: [
      { title: 'Tether reports $4.5B profit in Q1 2026, backed by US Treasury holdings', source: 'Reuters', age: '1d', sentiment: 'positive' },
      { title: 'USDT market cap surpasses $110B as demand grows in emerging markets', source: 'CoinDesk', age: '2d', sentiment: 'positive' },
      { title: 'EU MiCA enforcement puts pressure on USDT issuance in Europe', source: 'Blockworks', age: '3d', sentiment: 'negative' },
    ],
  },

  // ─── Extended tokens (from ExploreScreen) ────────────────────────────────────

  avax: {
    icon: `${CG}/12559/small/Avalanche_Circle_RedWhite_Trans.png`,
    name: 'Avalanche', symbol: 'AVAX',
    amount: '0', usd: 0, change24h: -1.22, negative: true,
    yield: 0.055, yieldUsd: 0,
    priceRange: [14, 24], chainPrice: '$18.42',
    chains: [{ name: 'Avalanche', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Avalanche is a high-throughput smart contract platform using a novel consensus protocol. Its C-Chain is EVM-compatible, enabling DeFi and NFT applications with sub-second finality.',
    news: [
      { title: 'Avalanche Foundation launches $50M DeFi incentive program', source: 'CoinDesk', age: '1d', sentiment: 'positive' },
      { title: 'AVAX staking participation reaches 65% of circulating supply', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'Avalanche subnet growth slows as competing L1s gain traction', source: 'The Block', age: '3d', sentiment: 'neutral' },
    ],
  },
  ada: {
    icon: `${CG}/975/small/cardano.png`,
    name: 'Cardano', symbol: 'ADA',
    amount: '0', usd: 0, change24h: 0.88, negative: false,
    yield: 0.038, yieldUsd: 0,
    priceRange: [0.46, 0.78], chainPrice: '$0.62',
    chains: [{ name: 'Cardano', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Cardano is a proof-of-stake blockchain built on peer-reviewed research and formal methods. Its Ouroboros consensus and Plutus smart contract platform aim to deliver secure, scalable decentralised applications.',
    news: [
      { title: 'Cardano Voltaire era governance upgrade passes community vote', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: 'ADA staking rewards redistributed as pool saturation tightens', source: 'CoinDesk', age: '2d', sentiment: 'neutral' },
      { title: 'Cardano DeFi TVL surpasses $500M for the first time', source: 'DeFiLlama', age: '4d', sentiment: 'positive' },
    ],
  },
  dot: {
    icon: `${CG}/12171/small/polkadot.png`,
    name: 'Polkadot', symbol: 'DOT',
    amount: '0', usd: 0, change24h: -0.65, negative: true,
    yield: 0.120, yieldUsd: 0,
    priceRange: [3.14, 5.22], chainPrice: '$4.18',
    chains: [{ name: 'Polkadot', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Polkadot is a sharded multi-chain network that connects specialised blockchains called parachains. Its shared security model and cross-chain messaging protocol (XCM) enable interoperability across the broader Web3 ecosystem.',
    news: [
      { title: 'Polkadot parachain auction slots fully subscribed ahead of deadline', source: 'Blockworks', age: '1d', sentiment: 'positive' },
      { title: 'DOT staking yield climbs to 12% as inflation schedule adjusts', source: 'CoinTelegraph', age: '2d', sentiment: 'positive' },
      { title: 'Polkadot 2.0 coretime sales model draws mixed reaction from parachains', source: 'The Block', age: '3d', sentiment: 'neutral' },
    ],
  },
  atom: {
    icon: `${CG}/1481/small/cosmos_hub.png`,
    name: 'Cosmos Hub', symbol: 'ATOM',
    amount: '0', usd: 0, change24h: 1.55, negative: false,
    yield: 0.180, yieldUsd: 0,
    priceRange: [3.54, 5.90], chainPrice: '$4.72',
    chains: [{ name: 'Cosmos', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Cosmos Hub is the flagship chain of the Cosmos ecosystem, which connects sovereign blockchains via the Inter-Blockchain Communication (IBC) protocol. ATOM is staked to secure the Hub and earns rewards from interchain security agreements.',
    news: [
      { title: 'Cosmos IBC transaction volume hits record 2M daily messages', source: 'Blockworks', age: '1d', sentiment: 'positive' },
      { title: 'ATOM staking yield rises to 18% following interchain security expansion', source: 'CoinDesk', age: '2d', sentiment: 'positive' },
      { title: 'Cosmos Hub governance passes proposal to reduce inflation rate', source: 'Decrypt', age: '4d', sentiment: 'neutral' },
    ],
  },
  near: {
    icon: `${CG}/10365/small/near.jpg`,
    name: 'NEAR Protocol', symbol: 'NEAR',
    amount: '0', usd: 0, change24h: 3.21, negative: false,
    yield: 0.095, yieldUsd: 0,
    priceRange: [1.60, 2.68], chainPrice: '$2.14',
    chains: [{ name: 'NEAR', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'NEAR Protocol is a sharded proof-of-stake layer-1 blockchain designed for developer and user simplicity. Its Nightshade sharding and account abstraction model lower barriers to onboarding and DApp deployment.',
    news: [
      { title: 'NEAR AI partnership announced with OpenAI-backed startup', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: 'NEAR chain abstraction framework adopted by three major DeFi protocols', source: 'CoinTelegraph', age: '2d', sentiment: 'positive' },
      { title: 'NEAR staking rewards drop slightly as validator set expands', source: 'Blockworks', age: '3d', sentiment: 'neutral' },
    ],
  },
  apt: {
    icon: `${CG}/26455/small/aptos_round.png`,
    name: 'Aptos', symbol: 'APT',
    amount: '0', usd: 0, change24h: -3.10, negative: true,
    yield: 0.070, yieldUsd: 0,
    priceRange: [3.72, 6.20], chainPrice: '$4.96',
    chains: [{ name: 'Aptos', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Aptos is a layer-1 blockchain developed by ex-Meta engineers, featuring the Move programming language for safer smart contract development. Its parallel execution engine (Block-STM) delivers high throughput with low latency.',
    news: [
      { title: 'Aptos DeFi TVL doubles in Q1 2026 driven by new DEX launches', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'Move language gains traction outside Aptos with new tooling support', source: 'The Block', age: '2d', sentiment: 'positive' },
      { title: 'Aptos validator set decentralisation questioned in community forum', source: 'Blockworks', age: '4d', sentiment: 'neutral' },
    ],
  },
  sui: {
    icon: `${CG}/26375/small/sui_asset.jpeg`,
    name: 'Sui', symbol: 'SUI',
    amount: '0', usd: 0, change24h: 5.44, negative: false,
    yield: 0.048, yieldUsd: 0,
    priceRange: [1.56, 2.60], chainPrice: '$2.08',
    chains: [{ name: 'Sui', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Sui is a layer-1 blockchain using the Move language and an object-centric data model that enables parallel transaction execution. Its zkLogin feature allows users to sign in with familiar web2 credentials while retaining self-custody.',
    news: [
      { title: 'Sui surpasses 10M daily transactions milestone', source: 'CoinDesk', age: '1d', sentiment: 'positive' },
      { title: 'Mysten Labs launches Walrus decentralised storage on Sui mainnet', source: 'Decrypt', age: '2d', sentiment: 'positive' },
      { title: 'SUI token unlock schedule draws attention from large holders', source: 'The Block', age: '3d', sentiment: 'neutral' },
    ],
  },
  arb: {
    icon: `${CG}/16547/small/photo_2023-03-29_18.09.39.jpeg`,
    name: 'Arbitrum', symbol: 'ARB',
    amount: '0', usd: 0, change24h: -0.90, negative: true,
    yield: 0.032, yieldUsd: 0,
    priceRange: [0.26, 0.42], chainPrice: '$0.34',
    chains: [{ name: 'Arbitrum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Arbitrum is the leading Ethereum optimistic rollup, offering EVM-compatible smart contracts with dramatically lower fees and faster confirmations. Its Nitro upgrade and Stylus VM support for multiple languages make it the dominant L2 by TVL.',
    news: [
      { title: 'Arbitrum TVL holds above $12B as gas fees stay near zero', source: 'L2Beat', age: '1d', sentiment: 'positive' },
      { title: 'ARB DAO approves $200M ecosystem development fund', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'Arbitrum One sequencer experiences 22-minute outage', source: 'CoinTelegraph', age: '3d', sentiment: 'negative' },
    ],
  },
  op: {
    icon: `${CG}/25244/small/Optimism.png`,
    name: 'Optimism', symbol: 'OP',
    amount: '0', usd: 0, change24h: 1.03, negative: false,
    yield: 0.029, yieldUsd: 0,
    priceRange: [0.54, 0.90], chainPrice: '$0.72',
    chains: [{ name: 'Optimism', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Optimism is an Ethereum optimistic rollup and the creator of the OP Stack, a modular framework for building L2 chains. The Superchain vision connects OP Stack chains via shared messaging, with Base and others already deployed on the stack.',
    news: [
      { title: 'Superchain total TVL crosses $8B across OP Stack networks', source: 'L2Beat', age: '1d', sentiment: 'positive' },
      { title: 'Optimism Fault Proofs go live, removing trusted proposer requirement', source: 'Decrypt', age: '2d', sentiment: 'positive' },
      { title: 'OP token distribution schedule questioned in governance forum', source: 'The Block', age: '4d', sentiment: 'neutral' },
    ],
  },
  matic: {
    icon: `${CG}/4713/small/matic-token-icon.png`,
    name: 'Polygon', symbol: 'MATIC',
    amount: '0', usd: 0, change24h: -1.74, negative: true,
    yield: 0.044, yieldUsd: 0,
    priceRange: [0.14, 0.22], chainPrice: '$0.18',
    chains: [{ name: 'Polygon', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Polygon (formerly Matic) is an Ethereum scaling solution offering a PoS sidechain and a suite of ZK-rollup technologies including zkEVM. Its AggLayer aims to unify liquidity across chains built on Polygon CDK.',
    news: [
      { title: 'Polygon AggLayer connects 12 new chains in Q1 2026', source: 'CoinDesk', age: '1d', sentiment: 'positive' },
      { title: 'MATIC to POL token migration completes with 94% participation', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'Polygon PoS bridge exploit patched; no funds lost', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
  linea: {
    icon: `${CG}/33761/small/linea-logo.png`,
    name: 'Linea', symbol: 'LINEA',
    amount: '0', usd: 0, change24h: 2.60, negative: false,
    yield: 0.021, yieldUsd: 0,
    priceRange: [0.06, 0.10], chainPrice: '$0.08',
    chains: [{ name: 'Linea', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Linea is a zkEVM rollup developed by Consensys, designed to bring Ethereum applications to a lower-cost environment while preserving full EVM equivalence. Its prover technology is built on lattice-based cryptography for post-quantum security.',
    news: [
      { title: 'Linea mainnet opens to all developers after alpha restrictions lifted', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: 'MetaMask integrates Linea as default network for new wallets', source: 'CoinDesk', age: '3d', sentiment: 'positive' },
      { title: 'Linea TVL climbs to $400M as incentive program continues', source: 'DeFiLlama', age: '5d', sentiment: 'neutral' },
    ],
  },
  uni: {
    icon: `${CG}/12504/small/uni.jpg`,
    name: 'Uniswap', symbol: 'UNI',
    amount: '0', usd: 0, change24h: 0.42, negative: false,
    yield: 0.036, yieldUsd: 0,
    priceRange: [3.96, 6.60], chainPrice: '$5.28',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Uniswap is the largest decentralised exchange by volume, pioneering the automated market maker (AMM) model. Its v4 hooks architecture allows developers to customise pool behaviour, making it a programmable liquidity layer for DeFi.',
    news: [
      { title: 'Uniswap v4 TVL reaches $4B in first month after launch', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'UNI fee switch governance proposal passes with 72% approval', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'SEC drops investigation into Uniswap Labs following court ruling', source: 'CoinDesk', age: '3d', sentiment: 'positive' },
    ],
  },
  aave: {
    icon: `${CG}/12645/small/AAVE.png`,
    name: 'Aave', symbol: 'AAVE',
    amount: '0', usd: 0, change24h: 1.88, negative: false,
    yield: 0.062, yieldUsd: 0,
    priceRange: [103.88, 173.12], chainPrice: '$138.50',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Aave is the leading decentralised lending protocol, enabling users to deposit assets to earn yield and borrow against collateral. Its v3 architecture introduces cross-chain portals and efficiency modes for capital-optimised borrowing.',
    news: [
      { title: 'Aave v3 surpasses $15B TVL across all deployed chains', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'Aave introduces GHO stablecoin yield boost for stkAAVE holders', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'Aave governance debates risk parameter tightening after oracle incident', source: 'The Block', age: '4d', sentiment: 'neutral' },
    ],
  },
  comp: {
    icon: `${CG}/10775/small/COMP.png`,
    name: 'Compound', symbol: 'COMP',
    amount: '0', usd: 0, change24h: -2.34, negative: true,
    yield: 0.051, yieldUsd: 0,
    priceRange: [28.65, 47.75], chainPrice: '$38.20',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Compound is one of the original DeFi lending protocols, allowing users to supply assets to earn algorithmically determined interest rates. Its money market model underpins billions in DeFi lending and served as the template for many successors.',
    news: [
      { title: 'Compound III launches on Base with native USDC markets', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'COMP governance votes to expand collateral types in v3 markets', source: 'Blockworks', age: '3d', sentiment: 'neutral' },
      { title: 'Compound TVL recovers to $2B following rate model improvements', source: 'CoinDesk', age: '5d', sentiment: 'positive' },
    ],
  },
  mkr: {
    icon: `${CG}/1364/small/Mark_Maker.png`,
    name: 'Maker', symbol: 'MKR',
    amount: '0', usd: 0, change24h: 0.77, negative: false,
    yield: 0.080, yieldUsd: 0,
    priceRange: [856.50, 1427.50], chainPrice: '$1,142.00',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Maker is the governance token of the MakerDAO protocol, which issues DAI — the most battle-tested decentralised stablecoin. MKR holders vote on risk parameters and protocol upgrades, while surplus MKR is burned using protocol revenues.',
    news: [
      { title: 'MakerDAO\'s Spark protocol surpasses $5B in DAI lending', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'MKR burn rate hits 18-month high as protocol revenue grows', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'Sky rebranding faces community pushback; MakerDAO name debated', source: 'Decrypt', age: '4d', sentiment: 'neutral' },
    ],
  },
  snx: {
    icon: `${CG}/3406/small/SNX.png`,
    name: 'Synthetix', symbol: 'SNX',
    amount: '0', usd: 0, change24h: -4.11, negative: true,
    yield: 0.150, yieldUsd: 0,
    priceRange: [0.62, 1.02], chainPrice: '$0.82',
    chains: [{ name: 'Optimism', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Synthetix is a decentralised liquidity layer enabling the creation of synthetic assets (Synths) tracking real-world prices. SNX stakers collateralise the system and earn fees from trading activity across protocols built on Synthetix liquidity.',
    news: [
      { title: 'Synthetix V3 migration completes with full liquidity portability', source: 'Blockworks', age: '1d', sentiment: 'positive' },
      { title: 'SNX staking APY climbs to 15% as perp trading volume rises', source: 'DeFiLlama', age: '2d', sentiment: 'positive' },
      { title: 'Synthetix debt pool volatility concerns raised by large stakers', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
  crv: {
    icon: `${CG}/12124/small/Curve.png`,
    name: 'Curve DAO', symbol: 'CRV',
    amount: '0', usd: 0, change24h: 0.22, negative: false,
    yield: 0.094, yieldUsd: 0,
    priceRange: [0.36, 0.60], chainPrice: '$0.48',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Curve Finance is a DEX optimised for stablecoin and like-asset swaps, offering minimal slippage through its invariant formula. The veCRV vote-escrowed governance model allows liquidity providers to boost rewards and direct emissions to pools.',
    news: [
      { title: 'Curve stablecoin crvUSD surpasses $500M in circulation', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'CRV emissions schedule halving approved by veHolder vote', source: 'Blockworks', age: '3d', sentiment: 'positive' },
      { title: 'Curve founder loan liquidation pressure eases as CRV price stabilises', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
  bal: {
    icon: `${CG}/11683/small/Balancer.png`,
    name: 'Balancer', symbol: 'BAL',
    amount: '0', usd: 0, change24h: -1.05, negative: true,
    yield: 0.078, yieldUsd: 0,
    priceRange: [1.22, 2.02], chainPrice: '$1.62',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Balancer is a programmable liquidity protocol enabling multi-token pools with custom weightings. Its veBAL governance model and boosted pools integration with Aave allow liquidity providers to optimise yields across DeFi strategies.',
    news: [
      { title: 'Balancer v3 launches with simplified pool architecture', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'BAL emissions redirected to protocol-owned liquidity', source: 'Blockworks', age: '3d', sentiment: 'neutral' },
      { title: 'Balancer boosted pools TVL grows 40% following Aave rate increase', source: 'The Block', age: '5d', sentiment: 'positive' },
    ],
  },
  sushi: {
    icon: `${CG}/12271/small/512x512_Logo_No_chop.png`,
    name: 'SushiSwap', symbol: 'SUSHI',
    amount: '0', usd: 0, change24h: 2.88, negative: false,
    yield: 0.112, yieldUsd: 0,
    priceRange: [0.56, 0.92], chainPrice: '$0.74',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'SushiSwap is a multi-chain DEX and DeFi suite offering automated market making, concentrated liquidity, a lending market, and a token launchpad. It operates across 30+ chains and is governed by xSUSHI stakers.',
    news: [
      { title: 'SushiSwap launches concentrated liquidity on 10 new chains', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'SUSHI staking rewards boosted as protocol buyback resumes', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'SushiSwap treasury management proposal sparks community debate', source: 'The Block', age: '4d', sentiment: 'neutral' },
    ],
  },
  '1inch': {
    icon: `${CG}/13469/small/1inch-token.png`,
    name: '1inch', symbol: '1INCH',
    amount: '0', usd: 0, change24h: -0.54, negative: true,
    yield: 0.040, yieldUsd: 0,
    priceRange: [0.16, 0.28], chainPrice: '$0.22',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: '1inch is a DEX aggregator that routes trades across hundreds of liquidity sources to find the best available price. Its Fusion mode enables gasless swaps via resolver auctions, significantly reducing costs for retail traders.',
    news: [
      { title: '1inch Fusion+ cross-chain swaps launch on 8 networks', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: '1INCH staking delegation model improves protocol fee distribution', source: 'Blockworks', age: '3d', sentiment: 'positive' },
      { title: '1inch aggregator volume flat as DEX competition intensifies', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
  yfi: {
    icon: `${CG}/11849/small/yearn-finance-yfi.png`,
    name: 'yearn.finance', symbol: 'YFI',
    amount: '0', usd: 0, change24h: 1.44, negative: false,
    yield: 0.065, yieldUsd: 0,
    priceRange: [3615, 6025], chainPrice: '$4,820.00',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'yearn.finance is a yield aggregator that automatically moves user funds between DeFi protocols to maximise returns. Its Vaults abstract strategy complexity, letting depositors earn optimised yields without active management.',
    news: [
      { title: 'Yearn Vaults v3 deployed across five chains simultaneously', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'YFI buyback programme resumes as treasury surplus grows', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'yearn.finance strategy underperforms benchmark during rate spike', source: 'The Block', age: '4d', sentiment: 'neutral' },
    ],
  },
  gmx: {
    icon: `${CG}/18323/small/arbit_logo.png`,
    name: 'GMX', symbol: 'GMX',
    amount: '0', usd: 0, change24h: 3.22, negative: false,
    yield: 0.138, yieldUsd: 0,
    priceRange: [10.95, 18.25], chainPrice: '$14.60',
    chains: [{ name: 'Arbitrum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'GMX is a decentralised perpetuals and spot exchange operating on Arbitrum and Avalanche. Liquidity providers earn a share of fees from leveraged trading activity via the GLP and GM pool mechanisms.',
    news: [
      { title: 'GMX V2 perp trading volume hits $500M in a single day', source: 'DeFiLlama', age: '1d', sentiment: 'positive' },
      { title: 'GMX expands to three new chains with Synthetics markets', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'GMX liquidity providers face short-term losses during BTC liquidation cascade', source: 'The Block', age: '4d', sentiment: 'neutral' },
    ],
  },
  dydx: {
    icon: `${CG}/11636/small/dYdX.png`,
    name: 'dYdX', symbol: 'DYDX',
    amount: '0', usd: 0, change24h: -2.00, negative: true,
    yield: 0.056, yieldUsd: 0,
    priceRange: [0.44, 0.72], chainPrice: '$0.58',
    chains: [{ name: 'dYdX Chain', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'dYdX is a decentralised perpetuals exchange that migrated from Ethereum to its own Cosmos-based appchain. Its order book model and deep liquidity pools offer professional-grade trading with self-custody guarantees.',
    news: [
      { title: 'dYdX Chain open interest surpasses $300M following volatility surge', source: 'Blockworks', age: '1d', sentiment: 'positive' },
      { title: 'DYDX stakers earn record $2.8M in fees over 30-day period', source: 'DeFiLlama', age: '2d', sentiment: 'positive' },
      { title: 'dYdX explorer finds front-running on validator level; team responds', source: 'The Block', age: '4d', sentiment: 'neutral' },
    ],
  },
  ldo: {
    icon: `${CG}/13573/small/Lido_DAO.png`,
    name: 'Lido DAO', symbol: 'LDO',
    amount: '0', usd: 0, change24h: 0.95, negative: false,
    yield: 0.042, yieldUsd: 0,
    priceRange: [0.54, 0.90], chainPrice: '$0.72',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Lido DAO governs the Lido liquid staking protocol, which issues stETH tokens representing staked Ethereum. With over 30% of all staked ETH, Lido is the dominant liquid staking provider, enabling stakers to use their staked assets in DeFi.',
    news: [
      { title: 'Lido stETH market share holds above 30% despite solo staking growth', source: 'Blockworks', age: '1d', sentiment: 'neutral' },
      { title: 'Lido introduces dual governance model to reduce LDO holder risk', source: 'Decrypt', age: '2d', sentiment: 'positive' },
      { title: 'stETH integration added to 15 new DeFi protocols in Q1 2026', source: 'DeFiLlama', age: '3d', sentiment: 'positive' },
    ],
  },
  rpl: {
    icon: `${CG}/18900/small/rocketpool.png`,
    name: 'Rocket Pool', symbol: 'RPL',
    amount: '0', usd: 0, change24h: -1.30, negative: true,
    yield: 0.048, yieldUsd: 0,
    priceRange: [4.80, 8.00], chainPrice: '$6.40',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Rocket Pool is a decentralised Ethereum liquid staking protocol that allows node operators to run validators with as little as 8 ETH. Its rETH token and RPL collateral system are designed to maximise decentralisation versus competing liquid staking solutions.',
    news: [
      { title: 'Rocket Pool node count exceeds 5,000 following Saturn upgrade', source: 'Blockworks', age: '1d', sentiment: 'positive' },
      { title: 'rETH adoption grows in money markets as collateral option', source: 'DeFiLlama', age: '3d', sentiment: 'positive' },
      { title: 'RPL price sensitive to ETH staking rate changes, analysts note', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
  dai: {
    icon: `${CG}/9956/small/Badge_Dai.png`,
    name: 'Dai', symbol: 'DAI',
    amount: '0', usd: 0, change24h: 0.00, negative: false,
    yield: 0.054, yieldUsd: 0,
    priceRange: [0.998, 1.002], chainPrice: '$1.00',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Dai is a decentralised stablecoin issued by MakerDAO, maintained at a $1 peg through over-collateralisation and algorithmic interest rates. It is widely used across DeFi as a base currency and is the most battle-tested decentralised stablecoin.',
    news: [
      { title: 'DAI supply grows to $8B as MakerDAO onboards more RWA collateral', source: 'Blockworks', age: '1d', sentiment: 'positive' },
      { title: 'Spark Protocol DAI savings rate draws $2B in new deposits', source: 'DeFiLlama', age: '2d', sentiment: 'positive' },
      { title: 'MakerDAO governance debates reducing USDC collateral exposure', source: 'The Block', age: '4d', sentiment: 'neutral' },
    ],
  },
  frax: {
    icon: `${CG}/13422/small/frax_logo.png`,
    name: 'Frax', symbol: 'FRAX',
    amount: '0', usd: 0, change24h: -0.02, negative: true,
    yield: 0.052, yieldUsd: 0,
    priceRange: [0.998, 1.002], chainPrice: '$1.00',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Frax is a fractional-algorithmic stablecoin protocol that maintains its dollar peg through a combination of collateral and algorithmic mechanisms. The Frax ecosystem includes frxETH liquid staking and the FPI inflation-pegged stablecoin.',
    news: [
      { title: 'Frax v3 fully collateralised model approved in governance vote', source: 'Blockworks', age: '1d', sentiment: 'positive' },
      { title: 'frxETH surpasses $1B TVL as liquid staking competition heats up', source: 'DeFiLlama', age: '3d', sentiment: 'positive' },
      { title: 'Frax AMO strategy performance reviewed amid shifting rate environment', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
  lusd: {
    icon: `${CG}/14666/small/Group_3.png`,
    name: 'Liquity USD', symbol: 'LUSD',
    amount: '0', usd: 0, change24h: 0.05, negative: false,
    yield: 0.046, yieldUsd: 0,
    priceRange: [0.998, 1.022], chainPrice: '$1.01',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'LUSD is the stablecoin issued by Liquity, a governance-free borrowing protocol that accepts only ETH as collateral at a minimum 110% collateralisation ratio. Its stability pool and redemption mechanism maintain the peg without admin keys.',
    news: [
      { title: 'Liquity V2 launch enables multi-collateral BOLD stablecoin borrowing', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: 'LUSD stability pool earns 4.6% APY as liquidations clear', source: 'DeFiLlama', age: '3d', sentiment: 'positive' },
      { title: 'Liquity protocol sees spike in redemptions during ETH price dip', source: 'Blockworks', age: '5d', sentiment: 'neutral' },
    ],
  },
  link: {
    icon: `${CG}/877/small/chainlink-new-logo.png`,
    name: 'Chainlink', symbol: 'LINK',
    amount: '0', usd: 0, change24h: 1.66, negative: false,
    yield: 0.024, yieldUsd: 0,
    priceRange: [8.55, 14.25], chainPrice: '$11.40',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Chainlink is the dominant decentralised oracle network, supplying tamper-proof price feeds and off-chain data to smart contracts across 1,000+ integrations. Its CCIP cross-chain protocol and Proof of Reserve service extend its role beyond price data.',
    news: [
      { title: 'Chainlink CCIP processes $1B in cross-chain transfers in Q1 2026', source: 'CoinDesk', age: '1d', sentiment: 'positive' },
      { title: 'LINK staking v0.2 opens with expanded capacity and higher rewards', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'Chainlink adds 50 new RWA price feeds for tokenised asset protocols', source: 'Decrypt', age: '3d', sentiment: 'positive' },
    ],
  },
  grt: {
    icon: `${CG}/13397/small/Graph_Token.png`,
    name: 'The Graph', symbol: 'GRT',
    amount: '0', usd: 0, change24h: -1.20, negative: true,
    yield: 0.082, yieldUsd: 0,
    priceRange: [0.075, 0.125], chainPrice: '$0.10',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'The Graph is a decentralised indexing protocol for querying blockchain data, used by thousands of DeFi and Web3 applications. Indexers stake GRT to process and serve subgraph queries, earning query fees and indexing rewards.',
    news: [
      { title: 'The Graph celebrates 100K subgraphs deployed across all networks', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: 'GRT delegation yields rise as query volume grows with DeFi activity', source: 'DeFiLlama', age: '3d', sentiment: 'positive' },
      { title: 'The Graph introduces Firehose streaming for real-time blockchain data', source: 'Blockworks', age: '5d', sentiment: 'neutral' },
    ],
  },
  fil: {
    icon: `${CG}/12817/small/filecoin.png`,
    name: 'Filecoin', symbol: 'FIL',
    amount: '0', usd: 0, change24h: 0.72, negative: false,
    yield: 0.030, yieldUsd: 0,
    priceRange: [2.10, 3.50], chainPrice: '$2.80',
    chains: [{ name: 'Filecoin', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Filecoin is a decentralised storage network that incentivises a global market of storage providers. Storage miners earn FIL for providing and proving data availability, creating a permissionless alternative to centralised cloud storage.',
    news: [
      { title: 'Filecoin network stores 2 exabytes of data for the first time', source: 'CoinDesk', age: '1d', sentiment: 'positive' },
      { title: 'FIL DeFi ecosystem grows as wrapped FIL gains traction on Ethereum', source: 'DeFiLlama', age: '3d', sentiment: 'positive' },
      { title: 'Filecoin storage deal retrieval speeds improve with CDN integration', source: 'Decrypt', age: '5d', sentiment: 'neutral' },
    ],
  },
  icp: {
    icon: `${CG}/14495/small/Internet_Computer_logo.png`,
    name: 'Internet Computer', symbol: 'ICP',
    amount: '0', usd: 0, change24h: -0.48, negative: true,
    yield: 0.068, yieldUsd: 0,
    priceRange: [3.47, 5.77], chainPrice: '$4.62',
    chains: [{ name: 'ICP', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Internet Computer (ICP) is a layer-1 blockchain built by DFINITY that aims to run the full web stack on-chain, including smart contracts, front-ends, and data storage. Its Chain Key cryptography enables direct integration with Bitcoin and Ethereum.',
    news: [
      { title: 'ICP Bitcoin integration enables 2-second BTC transactions without bridges', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: 'Internet Computer hits 1M canisters deployed milestone', source: 'CoinDesk', age: '3d', sentiment: 'positive' },
      { title: 'ICP neuron staking governance participation reaches 65%', source: 'Blockworks', age: '5d', sentiment: 'neutral' },
    ],
  },
  flow: {
    icon: `${CG}/13446/small/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png`,
    name: 'Flow', symbol: 'FLOW',
    amount: '0', usd: 0, change24h: 1.14, negative: false,
    yield: 0.050, yieldUsd: 0,
    priceRange: [0.33, 0.55], chainPrice: '$0.44',
    chains: [{ name: 'Flow', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Flow is a layer-1 blockchain designed for consumer applications, NFTs, and games, originally created by Dapper Labs. Its multi-role node architecture separates consensus, execution, verification, and collection for high throughput without sharding.',
    news: [
      { title: 'Flow blockchain gains EVM compatibility with Crescendo upgrade', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: 'NBA Top Shot resurgence drives FLOW transaction volume spike', source: 'CoinDesk', age: '3d', sentiment: 'positive' },
      { title: 'Flow developer activity grows as EVM migration lowers friction', source: 'Blockworks', age: '5d', sentiment: 'neutral' },
    ],
  },
  mana: {
    icon: `${CG}/878/small/decentraland-mana.png`,
    name: 'Decentraland', symbol: 'MANA',
    amount: '0', usd: 0, change24h: -2.88, negative: true,
    yield: 0.000, yieldUsd: 0,
    priceRange: [0.18, 0.30], chainPrice: '$0.24',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Decentraland is a decentralised virtual world on Ethereum where users can buy, develop, and monetise virtual land (LAND) using MANA. Its DAO governs the protocol, including content policies and smart contract upgrades.',
    news: [
      { title: 'Decentraland concurrent users hit 3-month high during music festival', source: 'CoinDesk', age: '1d', sentiment: 'positive' },
      { title: 'MANA burn rate increases as wearables marketplace activity grows', source: 'Blockworks', age: '3d', sentiment: 'positive' },
      { title: 'Metaverse land valuations remain subdued despite user growth', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
  sand: {
    icon: `${CG}/12129/small/sandbox_logo.jpg`,
    name: 'The Sandbox', symbol: 'SAND',
    amount: '0', usd: 0, change24h: 0.55, negative: false,
    yield: 0.000, yieldUsd: 0,
    priceRange: [0.29, 0.47], chainPrice: '$0.38',
    chains: [{ name: 'Ethereum', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'The Sandbox is a user-generated content metaverse where players can build, own, and monetise voxel-based gaming experiences. SAND is used to purchase LAND parcels and assets, and to participate in platform governance.',
    news: [
      { title: 'The Sandbox signs three major IP partnerships for branded experiences', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: 'SAND staking programme launches with 6% base APY', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'Sandbox LAND sale volumes remain below 2022 peak despite new content', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
  axs: {
    icon: `${CG}/13029/small/axie_infinity_logo.png`,
    name: 'Axie Infinity', symbol: 'AXS',
    amount: '0', usd: 0, change24h: -1.60, negative: true,
    yield: 0.000, yieldUsd: 0,
    priceRange: [2.40, 4.00], chainPrice: '$3.20',
    chains: [{ name: 'Ronin', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Axie Infinity is a blockchain-based game where players collect, breed, and battle creatures called Axies, earning AXS and SLP tokens. Its Ronin sidechain provides fast, low-cost transactions for in-game activity.',
    news: [
      { title: 'Axie Infinity Origins Season 8 draws 500K active players', source: 'Decrypt', age: '1d', sentiment: 'positive' },
      { title: 'Ronin chain introduces EVM equivalence enabling new DeFi integrations', source: 'Blockworks', age: '3d', sentiment: 'positive' },
      { title: 'AXS unlock schedule creates selling pressure through mid-2026', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
  inj: {
    icon: `${CG}/12882/small/Secondary_Symbol.png`,
    name: 'Injective', symbol: 'INJ',
    amount: '0', usd: 0, change24h: 4.88, negative: false,
    yield: 0.140, yieldUsd: 0,
    priceRange: [6.30, 10.50], chainPrice: '$8.40',
    chains: [{ name: 'Injective', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Injective is a Cosmos-based layer-1 blockchain purpose-built for finance, featuring an on-chain order book and a suite of native DeFi primitives. Its plug-and-play financial infrastructure allows developers to launch perps, spot markets, and options without smart contract complexity.',
    news: [
      { title: 'Injective DEX volume surpasses $1B in 24 hours during market rally', source: 'CoinDesk', age: '1d', sentiment: 'positive' },
      { title: 'INJ staking participation hits 70% of total supply', source: 'Blockworks', age: '2d', sentiment: 'positive' },
      { title: 'Injective launches RWA trading markets for tokenised US equities', source: 'Decrypt', age: '3d', sentiment: 'positive' },
    ],
  },
  sei: {
    icon: `${CG}/28205/small/Sei_Logo_-_Transparent.png`,
    name: 'Sei', symbol: 'SEI',
    amount: '0', usd: 0, change24h: 6.22, negative: false,
    yield: 0.070, yieldUsd: 0,
    priceRange: [0.14, 0.22], chainPrice: '$0.18',
    chains: [{ name: 'Sei', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Sei is a Cosmos-based layer-1 blockchain optimised for trading, featuring a built-in order book matching engine and twin-turbo consensus for 400ms block times. Its v2 upgrade introduced EVM compatibility, opening it to the Ethereum developer ecosystem.',
    news: [
      { title: 'Sei v2 EVM activity grows 300% in first month post-launch', source: 'Blockworks', age: '1d', sentiment: 'positive' },
      { title: 'SEI staking rewards rise as validator competition increases', source: 'DeFiLlama', age: '2d', sentiment: 'positive' },
      { title: 'Sei order book DEX volume trails Injective despite speed advantage', source: 'The Block', age: '4d', sentiment: 'neutral' },
    ],
  },
  tia: {
    icon: `${CG}/31967/small/tia.jpg`,
    name: 'Celestia', symbol: 'TIA',
    amount: '0', usd: 0, change24h: -3.44, negative: true,
    yield: 0.160, yieldUsd: 0,
    priceRange: [1.95, 3.25], chainPrice: '$2.60',
    chains: [{ name: 'Celestia', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Celestia is a modular data availability layer that allows rollups and appchains to publish transaction data without full execution. By separating data availability from consensus and execution, it reduces the cost of launching sovereign rollups significantly.',
    news: [
      { title: 'Celestia DA throughput doubles as rollup adoption accelerates', source: 'Blockworks', age: '1d', sentiment: 'positive' },
      { title: 'TIA staking yield hits 16% driven by high data availability demand', source: 'DeFiLlama', age: '2d', sentiment: 'positive' },
      { title: 'Competing DA layers launch, raising questions about Celestia fee pricing', source: 'The Block', age: '4d', sentiment: 'neutral' },
    ],
  },
  pyth: {
    icon: `${CG}/31924/small/pyth.png`,
    name: 'Pyth Network', symbol: 'PYTH',
    amount: '0', usd: 0, change24h: 2.10, negative: false,
    yield: 0.000, yieldUsd: 0,
    priceRange: [0.09, 0.15], chainPrice: '$0.12',
    chains: [{ name: 'Solana', amount: '0', usd: '$0' }],
    activePositions: [],
    about: 'Pyth Network is a high-frequency oracle that publishes real-time price data from institutional data providers directly on-chain. Its pull-based model allows DeFi protocols to access low-latency price updates across 40+ blockchain networks.',
    news: [
      { title: 'Pyth Network expands to 15 new blockchains in Q1 2026', source: 'CoinDesk', age: '1d', sentiment: 'positive' },
      { title: 'PYTH governance approves staking rewards programme for data publishers', source: 'Blockworks', age: '3d', sentiment: 'positive' },
      { title: 'Pyth price feed latency under scrutiny after brief oracle desync', source: 'The Block', age: '5d', sentiment: 'neutral' },
    ],
  },
};

// ─── Chart data ───────────────────────────────────────────────────────────────

function generateChartData(symbol, period) {
  const token = TOKEN_MAP[symbol];
  if (!token) return [];
  const [lo, hi] = token.priceRange;
  const mid = (lo + hi) / 2;
  const now = Math.floor(Date.now() / 1000);
  const configs = {
    '1D':  { points: 48, step: 1800    },
    '1W':  { points: 84, step: 7200    },
    '1M':  { points: 60, step: 43200   },
    '1Y':  { points: 52, step: 604800  },
    'ALL': { points: 60, step: 2592000 },
  };
  const { points, step } = configs[period] || configs['1D'];
  let price = mid;
  return Array.from({ length: points + 1 }, (_, i) => {
    const time = now - (points - i) * step;
    const drift = (mid - price) * 0.08;
    const noise = (Math.random() - 0.5) * (hi - lo) * 0.06;
    price = Math.max(lo, Math.min(hi, price + drift + noise));
    const decimals = (symbol === 'usdc' || symbol === 'usdt') ? 4 : 2;
    return { time, value: parseFloat(price.toFixed(decimals)) };
  });
}

// ─── Price chart — live period switch, crosshair float label ─────────────────

function PriceChart({ symbol, period, negative, onCrosshairPrice }) {
  const containerRef = useRef(null);
  const chartRef     = useRef(null);
  const seriesRef    = useRef(null);

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const chart = createChart(el, {
      width:  el.clientWidth,
      height: 130,
      layout: {
        background:  { type: 'solid', color: 'transparent' },
        textColor:   'rgba(135,135,140,0)',  // hide axis labels for clean look
        fontSize:    10,
        fontFamily:  "'Inter', sans-serif",
      },
      grid:            { vertLines: { visible: false }, horzLines: { visible: false } },
      crosshair:       { mode: 1 },
      rightPriceScale: { visible: false },  // hide price axis — we show floating label
      timeScale:       { visible: false },  // hide time axis — clean chart
      handleScroll:    false,
      handleScale:     false,
    });

    const lineColor = negative ? '#F04348' : '#584BEB';
    const topColor  = negative ? 'rgba(240,67,72,0.25)' : 'rgba(88,75,235,0.25)';

    const series = chart.addSeries(AreaSeries, {
      lineColor,
      topColor,
      bottomColor:                    'rgba(0,0,0,0)',
      lineWidth:                      2,
      priceLineVisible:               false,
      lastValueVisible:               false,
      crosshairMarkerVisible:         true,
      crosshairMarkerRadius:          5,
      crosshairMarkerBorderColor:     lineColor,
      crosshairMarkerBackgroundColor: lineColor,
    });

    const data = generateChartData(symbol, period);
    series.setData(data);
    chart.timeScale().fitContent();

    // Floating price label on crosshair move
    chart.subscribeCrosshairMove(param => {
      if (param.point && param.seriesData.size > 0) {
        const entry = param.seriesData.get(series);
        if (entry) onCrosshairPrice(entry.value, param.point.x / el.clientWidth);
      } else {
        onCrosshairPrice(null, null);
      }
    });

    chartRef.current  = chart;
    seriesRef.current = series;

    const ro = new ResizeObserver(() => { chart.applyOptions({ width: el.clientWidth }); });
    ro.observe(el);
    return () => { ro.disconnect(); chart.remove(); chartRef.current = null; };
  }, [symbol, negative]); // recreate only when asset changes

  // Live period switch — update data without recreating chart
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;
    const data = generateChartData(symbol, period);
    seriesRef.current.setData(data);
    chartRef.current.timeScale().fitContent();
  }, [period]); // eslint-disable-line

  return <div ref={containerRef} className="asset-chart-canvas" aria-hidden="true" />;
}

// ─── Main screen ──────────────────────────────────────────────────────────────

const PERIODS  = ['1D', '1W', '1M', '1Y', 'ALL'];
const MAX_YIELD = 0.068;

// MOD-025: Chain breakdown mock data
const CHAIN_BREAKDOWN = [
  { chain: 'Ethereum', balance: '$1,240', gas: '~$14 to transact', hasBalance: true },
  { chain: 'Arbitrum', balance: '$580',   gas: '~$0.08 to transact', hasBalance: true },
  { chain: 'Base',     balance: '$320',   gas: '~$0.04 to transact', hasBalance: true },
];
const fmt = (n) => n >= 10000
  ? `$${(n / 1000).toFixed(1)}k`
  : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AssetScreen() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { openActions } = useActions();
  const isDesktop = useIsDesktop();
  const [period, setPeriod]             = useState('1D');
  const [crosshairPrice, setCrosshair]  = useState(null);  // floating label value
  const [crosshairX, setCrosshairX]     = useState(null);  // 0–1 normalized
  const [apyTooltipOpen, setApyTooltipOpen] = useState(false); // MOD-023
  const [chainBreakdownOpen, setChainBreakdownOpen] = useState(false); // MOD-025
  const [isFavourite, setIsFavourite]   = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('modulo_favourites') || '[]');
      return saved.includes(id);
    } catch { return false; }
  });
  const t = TOKEN_MAP[id];

  function toggleFavourite() {
    try {
      const saved = JSON.parse(localStorage.getItem('modulo_favourites') || '[]');
      const next = isFavourite
        ? saved.filter(x => x !== id)
        : [...saved, id];
      localStorage.setItem('modulo_favourites', JSON.stringify(next));
    } catch {}
    setIsFavourite(f => !f);
  }

  const handleCrosshair = useCallback((price, x) => {
    setCrosshair(price);
    setCrosshairX(x);
  }, []);

  if (!t) {
    return (
      <motion.div className="swap-screen-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--bk-text-muted)' }}>Asset not found.</div>
      </motion.div>
    );
  }

  const changeSign  = t.change24h > 0 ? '+' : '';
  const changeColor = t.negative ? 'var(--bk-error)' : 'var(--bk-success)';
  const lineColor   = t.negative ? '#F04348' : '#584BEB';

  // Price shown: crosshair override when scrubbing, else current price
  const displayPrice = crosshairPrice
    ? (crosshairPrice >= 1000
        ? `$${crosshairPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
        : `$${crosshairPrice.toFixed(crosshairPrice < 2 ? 4 : 2)}`)
    : t.chainPrice;

  // ── Shared content blocks (used in both layouts) ─────────────────────

  const priceSection = (
    <div className="asset-price-section">
      {/* Price row — large, light weight (Coinbase) */}
      <div className="asset-price-row">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={displayPrice}
            className="swap-amount asset-price-value"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.6 }}
            transition={{ duration: 0.1 }}
          >
            <span className="amount-text">{displayPrice}</span>
          </motion.span>
        </AnimatePresence>
        {!crosshairPrice && (
          <span className="asset-change-badge" style={{ color: changeColor }}>
            {t.negative
              ? <IconArrowDown size={12} />
              : <IconArrowUp   size={12} />
            }
            {changeSign}{Math.abs(t.change24h).toFixed(2)}% today
          </span>
        )}
      </div>

      {/* Earn metric — Ledger Live: as prominent as the price */}
      <div className="asset-earn-row">
        <div className="asset-earn-metric">
          <span className="asset-earn-apy" style={{ color: lineColor }}>
            {(t.yield * 100).toFixed(1)}% APY
          </span>
          {/* MOD-023: APY info tooltip */}
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <Button className="apy-info-btn" aria-label="What is APY?" onPress={() => setApyTooltipOpen(v => !v)}>ⓘ</Button>
            {apyTooltipOpen && (
              <div className="apy-tooltip" role="tooltip">
                <p>APY = Annual Percentage Yield. Rates are variable and may change daily.</p>
                <Button onPress={() => setApyTooltipOpen(false)}>Got it</Button>
              </div>
            )}
          </span>
          <span className="asset-earn-projected">
            {fmt(t.yieldUsd)} projected / year
          </span>
        </div>
      </div>

      {/* Chart — trend-direction fill, crosshair float label */}
      <motion.div
        className="asset-chart-wrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...m.fade.enter, delay: 0.18 }}
      >
        <PriceChart
          symbol={id}
          period={period}
          negative={t.negative}
          onCrosshairPrice={handleCrosshair}
        />
      </motion.div>

      {/* Period pills — home.css .time-btn */}
      <div className="time-periods asset-period-tabs" role="group" aria-label="Chart period">
        {PERIODS.map(p => (
          <Button
            key={p}
            className={`time-btn${period === p ? ' active' : ''}`}
            aria-pressed={period === p}
            onPress={() => setPeriod(p)}
          >{p}</Button>
        ))}
      </div>
    </div>
  );

  const positionSection = (
    <div className="asset-position-wrap">
      <div className="asset-position-card">
        <div className="card-label">Your position</div>
        <div className="asset-pos-row">
          <div className="asset-pos-left">
            <img src={t.icon} alt={t.name} width="36" height="36" className="asset-token-img" />
            <div>
              <div className="asset-pos-amount">{t.amount} {t.symbol}</div>
            </div>
          </div>
          <div className="asset-pos-right">
            <div className="asset-pos-usd">{fmt(t.usd)}</div>
            <div className="asset-pos-change" style={{ color: changeColor }}>
              {changeSign}{Math.abs(t.change24h).toFixed(2)}% today
            </div>
          </div>
        </div>

        {/* Yield bar */}
        <div className="token-yield-bar-row token-yield-bar-row-top">
          <div className="token-yield-track">
            <motion.div
              className="token-yield-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: t.yield / MAX_YIELD }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </div>

        {/* Chain pills */}
        {t.chains.length > 1 && (
          <div className="asset-chain-pills">
            {t.chains.map(c => (
              <span key={c.name} className="chain-pill">{c.name} · {c.amount}</span>
            ))}
          </div>
        )}

        {/* MOD-025: Chain breakdown */}
        <div className="chain-breakdown">
          <Button
            className="chain-breakdown-toggle"
            aria-expanded={chainBreakdownOpen}
            aria-controls="chain-breakdown-panel"
            onPress={() => setChainBreakdownOpen(v => !v)}
          >
            Chain breakdown {chainBreakdownOpen ? '▲' : '▼'}
          </Button>
          <AnimatePresence initial={false}>
            {chainBreakdownOpen && (
              <motion.div
                id="chain-breakdown-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } }}
                exit={{ height: 0, opacity: 0, transition: { duration: 0.15 } }}
                style={{ overflow: 'hidden' }}
              >
                {CHAIN_BREAKDOWN.map(c => (
                  <div key={c.chain} className="chain-breakdown-row">
                    <div>
                      <div className="token-name-text">{c.chain}</div>
                      <div className="chain-breakdown-gas">{c.gas}</div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--bk-text-primary)' }}>{c.balance}</span>
                      <Button
                        className="chain-breakdown-bridge-btn"
                        aria-label={`Bridge from ${c.chain}`}
                        onPress={() => {}}
                      >Bridge</Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const putItToWorkSection = (
    <div className="asset-section">
      <div className="portfolio-label">Put it to work</div>
      <div className="asset-opp-list">
        {[
          { Icon: IconZap,        label: 'Stake',           sub: `Up to 6.8% APY · Flexible or locked`,    tab: 'lend'   },
          { Icon: IconLandmark,   label: 'Lend & Borrow',   sub: 'Earn on idle assets · Use as collateral', tab: 'lend'   },
          { Icon: IconTrendingUp, label: 'Trade',            sub: 'Market & limit orders',                   tab: 'trade'  },
          { Icon: IconBell,       label: 'Set price alert',  sub: 'Get notified when price hits a target',   tab: null     },
        ].map(({ Icon, label, sub, tab }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...m.fade.enter, delay: 0.12 + i * 0.06 }}
            whileTap={{ scale: tap.card }}
          >
          <Button
            className={`asset-opp-row${i === 0 ? ' first' : i === 3 ? ' last' : ''}`}
            onPress={() => tab ? openActions({ tab, asset: id }) : navigate('/settings', { state: { panel: 'notifications' } })}
            aria-label={label}
            style={{ width: '100%' }}>
            <Icon size={20} strokeWidth={1.5} color="var(--bk-brand-primary)" aria-hidden="true" />
            <div className="asset-opp-text">
              <span className="asset-opp-label">{label}</span>
              <span className="card-label">{sub}</span>
            </div>
            <span className="asset-opp-chevron">›</span>
          </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const activePositionsSection = t.activePositions.length > 0 ? (
    <div className="asset-section-top">
      <div className="portfolio-label">Active positions</div>
      {t.activePositions.map((pos, i) => {
        const PosIcon = pos.type === 'stake' ? IconZap : IconLandmark;
        return (
          <div key={i} className="asset-active-card">
            <div className="asset-pos-row asset-pos-row-wrap">
              <div className="asset-pos-left">
                <PosIcon size={18} strokeWidth={1.5} color="var(--bk-brand-primary)" aria-hidden="true" />
                <div>
                  <div className="token-name-text">{pos.protocol}</div>
                  <div className="token-amount">{pos.chain}</div>
                </div>
              </div>
              <span className="asset-active-badge">Active</span>
            </div>
            <div className="asset-pos-stats">
              {[['Position', pos.amount, false], ['APY', `${pos.apy}%`, true], ['Earning', pos.earnPerYear, true]].map(([lbl, val, green]) => (
                <div key={lbl} className="asset-pos-stat">
                  <div className="card-label">{lbl}</div>
                  <div className={`asset-pos-stat-value${green ? ' positive' : ''}`}>{val}</div>
                </div>
              ))}
            </div>
            <Button
              className="bottom-cta-btn cta-disabled asset-manage-btn"
              aria-label={`Manage ${pos.protocol}`}
              onPress={() => openActions({ tab: 'lend', asset: id })}>
              Manage position →
            </Button>
          </div>
        );
      })}
    </div>
  ) : null;

  const aboutSection = (
    <div className="asset-section-top">
      <div className="portfolio-label">About {t.name}</div>
      <p className="asset-about-text">{t.about}</p>
      {/* MOD-021: Risk profile */}
      <div className="risk-profile-row">
        <span className="risk-item">Volatility: <strong>High</strong></span>
        <span className="risk-item">Market cap: <strong>#2</strong></span>
        <span className="risk-item">Audit: <strong>CertiK ✓</strong></span>
      </div>
    </div>
  );

  const newsSection = (
    <div className="asset-section-top">
      <div className="portfolio-label">News</div>
      <div className="asset-news-list">
        {t.news.map((item, i) => (
          <Button
            key={i}
            className="asset-news-row"
            aria-label={`${item.title} — ${item.source}`}
            onPress={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(item.title)}`, '_blank', 'noopener,noreferrer')}
          >
            <div className="asset-news-body">
              <span className="asset-news-title">{item.title}</span>
              <div className="asset-news-meta">
                <span className="asset-news-source">{item.source}</span>
                <span className="asset-news-dot">·</span>
                <span className="asset-news-age">{item.age}</span>
              </div>
            </div>
            {item.sentiment !== 'neutral' && (
              <span className={`asset-news-sentiment asset-news-sentiment--${item.sentiment}`}>
                {item.sentiment === 'positive' ? '↑' : '↓'}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );

  const contractRow = (
    <div className="asset-contract-row">
      <span className="card-label">Contract</span>
      <Button
        className="asset-contract-btn"
        aria-label="View contract on block explorer"
        onPress={() => window.open(EXPLORER_URLS[id] || EXPLORER_URLS.eth, '_blank', 'noopener,noreferrer')}
      >
        {CONTRACT_DISPLAY[id] || '0x…'} <IconExternalLink />
      </Button>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <motion.div
      role="main"
      aria-label={`${t.name} detail`}
      className={`swap-screen-inner asset-screen${isDesktop ? ' asset-screen-desktop' : ''}`}
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      {/* StatusBar removed — modal screen, real device draws its own */}

      {/* ── Header — SwapScreen pattern ── */}
      <div className="swap-header">
        <div className="header-left">
          <Button className="close-btn" aria-label="Back" onPress={() => navigate('/')}>
            <IconX />
          </Button>
          <div className="asset-header-title">
            <img src={t.icon} alt="" width="20" height="20" style={{ borderRadius: '50%', display: 'block' }} />
            <h1 className="swap-title">{t.name}</h1>
          </div>
        </div>
        <div className="asset-header-right">
          <motion.div
            animate={{ scale: isFavourite ? [1, 1.35, 1] : 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Button
              className={`asset-fav-btn${isFavourite ? ' active' : ''}`}
              aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
              aria-pressed={isFavourite}
              onPress={toggleFavourite}
            >
              <IconStar size={20} filled={isFavourite} />
            </Button>
          </motion.div>
          <Button className="settings-btn" aria-label="More options" onPress={() => navigate('/settings')}>
            <img src={iconSettings} width="20" height="20" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {isDesktop ? (
        /* ── Desktop: two-column grid layout ── */
        <>
          {/* Column 1: chart + price header + put it to work */}
          <div className="asset-col-main">
            <div className="scroll-content asset-scroll">
              {priceSection}
              {positionSection}
              {putItToWorkSection}
            </div>
          </div>
          {/* Column 2: active positions + about + news */}
          <div className="asset-col-side">
            <div className="scroll-content asset-scroll">
              {activePositionsSection}
              {aboutSection}
              {newsSection}
              {contractRow}
            </div>
          </div>
        </>
      ) : (
        /* ── Mobile: single scroll column ── */
        <>
          <div className="scroll-content asset-scroll">
            {priceSection}
            {positionSection}
            {putItToWorkSection}
            {activePositionsSection}
            {aboutSection}
            {newsSection}
            {contractRow}
          </div>

          {/* ── Sticky bottom action bar ── */}
          <nav className="asset-bottom-bar" aria-label="Quick actions">
            {[
              { label: 'Send',    src: iconActionSend, action: () => navigate('/send')                 },
              { label: 'Receive', src: iconActionRecv, action: () => navigate('/receive')              },
              { label: 'Swap',    src: iconActionSwap, action: () => openActions({ tab: 'swap', asset: id }) },
              { label: 'Actions', Icon: IconZap,        action: () => openActions({ asset: id }) },
            ].map(({ label, src, Icon, action }) => (
              <motion.div key={label} whileTap={{ scale: tap.heavy }}>
                <Button className="asset-bar-btn" aria-label={label} onPress={action}>
                  {src
                    ? <img src={src} width="20" height="20" aria-hidden="true" />
                    : <Icon size={20} color="var(--bk-brand-primary)" strokeWidth={1.5} aria-hidden="true" />
                  }
                  <span className="asset-bar-label">{label}</span>
                </Button>
              </motion.div>
            ))}
          </nav>
        </>
      )}
    </motion.div>
  );
}
