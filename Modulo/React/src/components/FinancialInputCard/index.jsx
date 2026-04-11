/**
 * FinancialInputCard — White-Label Component
 *
 * Card containing a token selector + numeric input + USD value display.
 * Consolidates the amount-entry pattern used in swap, send, lend flows.
 * Uses React ARIA TextField + Input for the numeric field.
 * Token selector is a Button — does NOT open a picker internally.
 *
 * Props:
 * - label: string — card label (e.g. "You pay")
 * - amount: string — controlled input value
 * - onAmountChange: (value: string) => void — called on input change
 * - token: { icon?: string, symbol: string, name?: string } — selected token
 * - onTokenSelect: () => void — called when token button is pressed
 * - usdValue: string (optional) — fiat equivalent (e.g. "≈ $1,234.56")
 *
 * React ARIA: TextField + Input for amount, Button (onPress) for token selector
 * Token deps: --bk-bg-card, --bk-border-card, --bk-text-primary, --bk-text-muted,
 *             --bk-text-placeholder, --bk-pill-bg, --bk-border-pill, --bk-font
 */

import { TextField, Input, Button } from 'react-aria-components';
import './styles.css';

export function FinancialInputCard({
  label,
  amount,
  onAmountChange,
  token,
  onTokenSelect,
  usdValue,
}) {
  const tokenLabel = token?.name || token?.symbol || 'Select token';

  return (
    <div className="financial-input-card">
      <div className="financial-input-label">{label}</div>
      <div className="financial-input-middle">
        <TextField
          className="financial-input-field"
          value={amount}
          onChange={onAmountChange}
          aria-label={`${label} amount`}
        >
          <Input
            className="financial-input-amount"
            inputMode="decimal"
            placeholder="0"
            autoComplete="off"
          />
        </TextField>
        <Button
          className="financial-input-token-btn"
          onPress={onTokenSelect}
          aria-label={`Selected token: ${tokenLabel}, tap to change`}
        >
          {token?.icon && (
            <span className="financial-input-token-icon">
              <img src={token.icon} alt="" width="22" height="22" />
            </span>
          )}
          <span className="financial-input-token-name">
            {token?.symbol || 'Select'}
          </span>
          <svg
            className="financial-input-chevron"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <polyline
              points="2,4 6,8 10,4"
              stroke="var(--bk-text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
      {usdValue && (
        <div className="financial-input-bottom">
          <span className="financial-input-usd">{usdValue}</span>
        </div>
      )}
    </div>
  );
}
