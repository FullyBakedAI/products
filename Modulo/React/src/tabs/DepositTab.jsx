/**
 * DepositTab — deposit/withdraw entry points inside ActionsScreen
 */

import { Button } from 'react-aria-components';
import iconActionRecv from '../assets/icon-action-receive.svg';
import iconActionSend from '../assets/icon-action-send.svg';
import { useFlowNavigate } from './actions-shared';

const IconAlertCircle = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 7V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="13.5" r="0.75" fill="currentColor"/>
  </svg>
);

export default function DepositTab() {
  const navigate = useFlowNavigate();
  return (
    <div className="actions-tab-stack">
      <div className="actions-deposit-grid">
        {[
          { label: 'Deposit',  sub: 'Add funds via crypto or bank transfer',    src: iconActionRecv, action: () => navigate('/receive') },
          { label: 'Withdraw', sub: 'Move funds to an external wallet or bank',  src: iconActionSend, action: () => navigate('/send') },
        ].map(({ label, sub, src, action }) => (
          <Button key={label} className="swap-card actions-deposit-card" onPress={action} aria-label={label}>
            <img src={src} width="28" height="28" className="deposit-card-img" aria-hidden="true" />
            <div className="deposit-card-title">{label}</div>
            <div className="card-label">{sub}</div>
          </Button>
        ))}
      </div>
      <div className="actions-notice">
        <IconAlertCircle size={13} />
        Bank transfers may take 1–3 business days to settle.
      </div>
    </div>
  );
}
