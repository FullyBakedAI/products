# Batch G — DeFi Transaction Flow (ReviewScreen + token approval)
**Source:** QA Sprint QA-001, Wave 1  
**Files:** ReviewScreen.jsx, ActionsScreen.jsx  
**Instruction:** Implement token approval step and transaction deadline UI. Read files first. Build must pass.

---

## MOD-012 — Missing token approval step in swap flow (P1 - L ticket)

**File:** `src/ReviewScreen.jsx`

### Context
In a real DEX, the first swap of any non-native token requires an ERC-20 `approve()` transaction before the swap executes. Currently ReviewScreen goes straight to Confirm. This is a critical DeFi accuracy issue.

### Implementation

Add state:
```jsx
const isNativeToken = from?.symbol === 'ETH' || from?.symbol === 'BNB'; // native tokens
const [approvalStatus, setApprovalStatus] = useState('idle'); // 'idle' | 'pending' | 'approved'
const needsApproval = !isNativeToken && approvalStatus !== 'approved';
```

When `needsApproval` is true, show an "Approve [TOKEN]" step above the Confirm button:

```jsx
{needsApproval && (
  <div className="approval-step">
    <div className="approval-step-header">
      <span className="step-number">1</span>
      <span className="step-title">Approve {from?.symbol}</span>
      <span className="step-status">{approvalStatus === 'pending' ? 'Pending...' : 'Required'}</span>
    </div>
    <p className="approval-step-desc">
      Allow Modulo to use your {from?.symbol}. One-time permission for this token.
    </p>
    {approvalStatus === 'idle' && (
      <Button 
        className="primary-btn"
        onPress={() => {
          setApprovalStatus('pending');
          setTimeout(() => setApprovalStatus('approved'), 1500);
        }}
      >
        Approve {from?.symbol}
      </Button>
    )}
    {approvalStatus === 'pending' && (
      <div className="approval-pending">Awaiting approval transaction...</div>
    )}
    {approvalStatus === 'approved' && (
      <div className="approval-confirmed">✓ {from?.symbol} approved</div>
    )}
  </div>
)}

{/* Existing Confirm button — disabled until approval done */}
<Button 
  className="primary-btn"
  isDisabled={needsApproval}
  onPress={handleConfirm}
>
  {needsApproval ? 'Confirm (approve first)' : 'Confirm swap'}
</Button>
```

Add approval step CSS to `review.css`:
```css
.approval-step { 
  background: var(--bk-bg-card); 
  border: 1px solid var(--bk-border-card); 
  border-radius: 12px; 
  padding: 16px; 
  margin-bottom: 12px; 
}
.approval-step-header { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  margin-bottom: 8px; 
}
.step-number { 
  width: 20px; height: 20px; 
  border-radius: 50%; 
  background: var(--bk-brand-primary); 
  color: #fff; 
  font-size: 11px; font-weight: 700; 
  display: flex; align-items: center; justify-content: center; 
}
.step-title { font-weight: 600; flex: 1; }
.step-status { font-size: 12px; color: var(--bk-text-muted); }
.approval-step-desc { font-size: 13px; color: var(--bk-text-muted); margin-bottom: 12px; }
.approval-pending { font-size: 13px; color: var(--bk-text-muted); font-style: italic; }
.approval-confirmed { font-size: 13px; color: var(--bk-success); font-weight: 600; }
```

---

## MOD-013 — No wallet connection flow (P1 - XL ticket)

**File:** `src/App.jsx`

Add a wallet connection gate before the main app:

```jsx
const [walletConnected, setWalletConnected] = useState(
  () => localStorage.getItem('walletConnected') === 'true'
);

if (!walletConnected) {
  return <ConnectWalletScreen onConnect={() => {
    localStorage.setItem('walletConnected', 'true');
    setWalletConnected(true);
  }} />;
}
```

**Create `src/ConnectWalletScreen.jsx`:**

```jsx
import { Button } from 'react-aria-components';
import { motion } from 'framer-motion';
import './connect-wallet.css';

const WALLETS = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '💙' },
];

export default function ConnectWalletScreen({ onConnect }) {
  const [connecting, setConnecting] = useState(null);

  const handleConnect = (walletId) => {
    setConnecting(walletId);
    setTimeout(onConnect, 1200); // simulate connection delay
  };

  return (
    <div className="connect-wallet-screen">
      <div className="connect-wallet-content">
        <div className="connect-wallet-logo">
          {/* Logo placeholder */}
          <div className="logo-mark" />
        </div>
        <h1 className="connect-wallet-title">Connect your wallet</h1>
        <p className="connect-wallet-subtitle">Choose your wallet to get started</p>
        
        <div className="wallet-list" role="list">
          {WALLETS.map(wallet => (
            <Button
              key={wallet.id}
              className="wallet-option"
              role="listitem"
              onPress={() => handleConnect(wallet.id)}
              isDisabled={!!connecting}
            >
              <span className="wallet-icon" aria-hidden="true">{wallet.icon}</span>
              <span className="wallet-name">{wallet.name}</span>
              {connecting === wallet.id && <span className="connecting-dot" aria-label="Connecting..." />}
            </Button>
          ))}
        </div>
        
        <p className="connect-wallet-disclaimer">
          By connecting, you agree to Modulo's terms. Your keys, your crypto.
        </p>
      </div>
    </div>
  );
}
```

**Create `src/connect-wallet.css`:**
```css
.connect-wallet-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bk-bg-primary);
  padding: 24px;
}
.connect-wallet-content { width: 100%; max-width: 360px; text-align: center; }
.connect-wallet-logo { margin-bottom: 32px; }
.logo-mark { width: 64px; height: 64px; background: var(--bk-brand-primary); border-radius: 16px; margin: 0 auto; }
.connect-wallet-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; color: var(--bk-text-primary); }
.connect-wallet-subtitle { font-size: 15px; color: var(--bk-text-muted); margin-bottom: 32px; }
.wallet-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.wallet-option {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 20px;
  background: var(--bk-bg-card);
  border: 1px solid var(--bk-border-card);
  border-radius: 14px;
  width: 100%;
  font-size: 16px; font-weight: 500;
  color: var(--bk-text-primary);
  cursor: pointer;
  text-align: left;
}
.wallet-option[data-pressed] { transform: scale(0.98); }
.wallet-icon { font-size: 24px; width: 32px; flex-shrink: 0; }
.wallet-name { flex: 1; }
.connecting-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--bk-brand-primary);
  animation: pulse 0.8s ease-in-out infinite;
}
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
.connect-wallet-disclaimer { font-size: 12px; color: var(--bk-text-muted); line-height: 1.5; }
```

---

After all changes: run `npm run build` to confirm zero errors.
