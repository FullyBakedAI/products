/**
 * TransactionPath — Asset route visualiser
 *
 * Shows how an asset moves through bridges and protocols.
 * Used in: SwapTab, ReviewScreen, HomeScreen autopilot card
 *
 * Props:
 * - steps: array of { type: 'token'|'bridge'|'protocol', symbol?, chain?, name? }
 * - estimatedTime: string — e.g. "~45 sec"
 * - compact: boolean — smaller layout for inline use (default: false)
 */

import './styles.css';

const CHAIN_INITIALS = {
  Ethereum: 'ETH',
  Arbitrum: 'ARB',
  Base: 'BASE',
  Optimism: 'OP',
  Polygon: 'POL',
  Solana: 'SOL',
  Bitcoin: 'BTC',
};

function ChainDot({ chain }) {
  const CHAIN_COLORS = {
    Ethereum: 'var(--bk-color-ethereum, #627EEA)',
    Arbitrum: 'var(--bk-color-arbitrum, #2D374B)',
    Base:     'var(--bk-color-base, #0052FF)',
    Optimism: 'var(--bk-color-optimism, #FF0420)',
    Polygon:  'var(--bk-color-polygon, #8247E5)',
    Solana:   'var(--bk-color-solana, #9945FF)',
    Bitcoin:  'var(--bk-color-bitcoin, #F7931A)',
  };
  return (
    <span
      className="tx-path-chain-dot"
      style={{ background: CHAIN_COLORS[chain] || 'var(--bk-text-muted)' }}
      aria-hidden="true"
    />
  );
}

function TokenStep({ symbol, chain }) {
  return (
    <div className="tx-path-token" aria-label={`${symbol} on ${chain}`}>
      <div className="tx-path-token-icon">
        <span className="tx-path-token-symbol">{symbol}</span>
        {chain && <ChainDot chain={chain} />}
      </div>
      {chain && <span className="tx-path-chain-label">{CHAIN_INITIALS[chain] || chain}</span>}
    </div>
  );
}

function ProtocolStep({ type, name }) {
  const isBridge = type === 'bridge';
  return (
    <div
      className={`tx-path-protocol-pill ${isBridge ? 'tx-path-bridge-pill' : 'tx-path-protocol-only-pill'}`}
      aria-label={`${isBridge ? 'Bridge' : 'Protocol'}: ${name}`}
    >
      {name}
    </div>
  );
}

function Arrow() {
  return (
    <span className="tx-path-arrow" aria-hidden="true">
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
        <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export function TransactionPath({ steps = [], estimatedTime, compact = false }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div
      className={`tx-path-root${compact ? ' tx-path-compact' : ''}`}
      role="region"
      aria-label="Transaction route"
    >
      <div className="tx-path-header">
        <span className="tx-path-label">Route</span>
        {estimatedTime && (
          <span className="tx-path-time">Est. {estimatedTime}</span>
        )}
      </div>
      <div className="tx-path-steps" role="list">
        {steps.map((step, i) => (
          <div key={i} className="tx-path-step-wrap" role="listitem">
            {i > 0 && <Arrow />}
            {step.type === 'token' && (
              <TokenStep symbol={step.symbol} chain={step.chain} />
            )}
            {(step.type === 'bridge' || step.type === 'protocol') && (
              <ProtocolStep type={step.type} name={step.name} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
