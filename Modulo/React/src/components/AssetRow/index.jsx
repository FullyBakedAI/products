/**
 * AssetRow — White-Label Component
 *
 * A row displaying a token/asset with icon, name, chain, amount, and USD value.
 * Tappable when onPress is provided (wraps in React ARIA Button), otherwise plain div.
 *
 * Props:
 * - icon: ReactNode — Token icon element (e.g. <img src="..." alt="" />)
 * - name: string — Token name (e.g. "Ethereum")
 * - chain: string — Chain name (e.g. "Mainnet")
 * - amount: string — Token amount (e.g. "1.24 ETH")
 * - usdValue: string — USD value (e.g. "$3,200")
 * - onPress: function (optional) — Press handler; makes the row tappable
 *
 * React ARIA: Button with onPress when interactive, semantic div when display-only
 */

import { Button } from 'react-aria-components';
import './styles.css';

const IconChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function AssetRow({ icon, name, chain, amount, usdValue, onPress }) {
  const content = (
    <>
      <span className="asset-row-icon">{icon}</span>
      <span className="asset-row-info">
        <span className="asset-row-name">{name}</span>
        {chain && <span className="asset-row-chain">{chain}</span>}
      </span>
      <span className="asset-row-values">
        <span className="asset-row-amount">{amount}</span>
        {usdValue && <span className="asset-row-usd">{usdValue}</span>}
      </span>
      {onPress && (
        <span className="asset-row-chevron">
          <IconChevronRight />
        </span>
      )}
    </>
  );

  if (onPress) {
    return (
      <Button
        className="asset-row asset-row-tappable"
        onPress={onPress}
        aria-label={`${name}${chain ? `, ${chain}` : ''}, ${amount}${usdValue ? `, ${usdValue}` : ''}`}
      >
        {content}
      </Button>
    );
  }

  return <div className="asset-row">{content}</div>;
}
