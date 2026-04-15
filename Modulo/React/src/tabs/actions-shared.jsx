/**
 * actions-shared.jsx — shared sub-components, icons, hooks and data
 * used by two or more ActionsScreen tab components.
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tap } from '../motion-tokens';
import { Button } from 'react-aria-components';
import { useActions } from '../ActionsContext';
import { useIconOverride } from '../IconOverrideContext';

export const MotionButton = motion.create(Button);

// ── Inline icons ─────────────────────────────────────────────────────────────

export const IconDelete = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7 4H17V16H7L3 10L7 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 8L14 12M14 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const IconChevronDown = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Shared data ───────────────────────────────────────────────────────────────

// Map AssetScreen lowercase IDs → SWAP_TOKENS keys
export const ASSET_ID_TO_TOKEN = {
  eth:  'ETH',
  usdc: 'USDC',
  btc:  'WBTC',
  sol:  'SOL',
  usdt: 'USDT',
};

export const ASSET_CHANGES = {
  ETH:  { label: '+4.38%', positive: true  },
  WBTC: { label: '+2.14%', positive: true  },
  SOL:  { label: '-1.82%', positive: false },
  USDC: { label: '0.00%',  positive: true  },
  USDT: { label: '0.00%',  positive: true  },
};

// ── Hook: navigate AND close the drawer so the next screen appears on top ─────

export function useFlowNavigate() {
  const navigate = useNavigate();
  const { closeActions } = useActions();
  return (path, opts) => { closeActions(); navigate(path, opts); };
}

// ── Shared sub-components ─────────────────────────────────────────────────────

export function AssetHeader({ tok, tokenKey }) {
  const navigate = useFlowNavigate();
  const chg = ASSET_CHANGES[tokenKey] || { label: '0.00%', positive: true };
  return (
    <Button
      className="trade-asset-header"
      aria-label={`Change asset — currently ${tok.name}`}
      aria-haspopup="listbox"
      aria-expanded={false}
      onPress={() => navigate('/swap/select/pay')}
    >
      <img src={tok.icon} alt="" width="36" height="36" className="trade-asset-icon" />
      <div className="trade-asset-info">
        <div className="trade-asset-name">{tok.name}</div>
        <div className="trade-asset-meta">
          <span className="trade-asset-price">${tok.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={`trade-asset-chg${chg.positive ? ' positive' : ' negative'}`}>{chg.label}</span>
        </div>
      </div>
      <div className="trade-change-chip" aria-hidden="true">
        Change <IconChevronDown size={12} />
      </div>
    </Button>
  );
}

export function TokenPill({ token, side }) {
  const navigate = useFlowNavigate();
  return (
    <Button
      className="token-pill-btn"
      aria-label={`${side === 'pay' ? 'Pay' : 'Receive'} token: ${token.symbol}`}
      onPress={() => navigate(`/swap/select/${side}`)}
    >
      <span className="token-icon"><img src={token.icon} alt="" width="22" height="22" /></span>
      <span className="token-name">{token.symbol}</span>
      <IconChevronDown size={13} className="token-chevron" />
    </Button>
  );
}

export function SelectTokenButton({ side }) {
  const navigate = useFlowNavigate();
  return (
    <Button className="select-token-cta-btn" onPress={() => navigate(`/swap/select/${side}`)}>
      Select token
    </Button>
  );
}

export function Numpad({ onKey }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
  return (
    <div className="numpad" role="group" aria-label="Number input">
      {keys.map(key => (
        <MotionButton key={key} className="numpad-key-btn" aria-label={key === 'del' ? 'Delete' : key} onPress={() => onKey(key)}
          whileTap={{ scale: tap.numpad }} transition={{ type: 'spring', damping: 18, stiffness: 400 }}>
          {key === 'del'
            ? <IconDelete size={18} />
            : key
          }
        </MotionButton>
      ))}
    </div>
  );
}
