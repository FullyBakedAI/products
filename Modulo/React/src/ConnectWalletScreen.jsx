import { useState } from 'react';
import { Button } from 'react-aria-components';
import logoModulo from './assets/logo-modulo.svg';
import './connect-wallet.css';

const WALLETS = [
  { id: 'metamask',      name: 'MetaMask',        icon: '🦊' },
  { id: 'walletconnect', name: 'WalletConnect',   icon: '🔗' },
  { id: 'coinbase',      name: 'Coinbase Wallet', icon: '💙' },
];

export default function ConnectWalletScreen({ onConnect }) {
  const [connecting, setConnecting] = useState(null);

  const handleConnect = (walletId) => {
    setConnecting(walletId);
    setTimeout(onConnect, 1200);
  };

  return (
    <div className="connect-wallet-screen">
      <div className="connect-wallet-content">
        <div className="connect-wallet-logo">
          <img src={logoModulo} alt="Modulo" className="logo-wordmark" />
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
              {connecting === wallet.id && (
                <span className="connecting-dot" aria-label="Connecting..." />
              )}
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
