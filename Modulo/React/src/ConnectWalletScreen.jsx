import { useConnect, useConnectors } from 'wagmi';
import { Button } from 'react-aria-components';
import logoModulo from './assets/logo-modulo.svg';
import './connect-wallet.css';

const CONNECTOR_DISPLAY = {
  injected:       { name: 'MetaMask',        label: 'MM'  },
  walletConnect:  { name: 'WalletConnect',   label: 'WC'  },
  coinbaseWallet: { name: 'Coinbase Wallet', label: 'CB'  },
};

function getDisplay(connector) {
  return CONNECTOR_DISPLAY[connector.id] ?? { name: connector.name, label: connector.name.slice(0, 2).toUpperCase() };
}

function isWalletConnectSafe() {
  try {
    const pid = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
    return pid && pid !== 'demo' && pid.length >= 10;
  } catch { return false; }
}

export default function ConnectWalletScreen({ onConnect, onDemoConnect }) {
  const connectors  = useConnectors();
  const { connect, isPending, variables } = useConnect({
    mutation: {
      onSuccess: () => {
        if (onConnect) onConnect();
      },
    },
  });

  // Detect whether the injected (MetaMask) provider is actually present
  const injectedConnector = connectors.find(c => c.id === 'injected');
  const hasInjected = injectedConnector && typeof window !== 'undefined' && !!window.ethereum;

  return (
    <div className="connect-wallet-screen">
      <div className="connect-wallet-content">
        <div className="connect-wallet-logo">
          <img src={logoModulo} alt="Modulo" className="logo-wordmark" />
        </div>
        <h1 className="connect-wallet-title">Connect your wallet</h1>
        <p className="connect-wallet-subtitle">Choose your wallet to get started</p>

        <div className="wallet-list" role="list">
          {connectors.map(connector => {
            const display = getDisplay(connector);
            const isConnectingThis = isPending && variables?.connector === connector;
            const isInjectedMissing = connector.id === 'injected' && !hasInjected;
            // MOD-090: WalletConnect with demo projectId crashes — show disabled placeholder instead
            if (connector.id === 'walletConnect' && !isWalletConnectSafe()) {
              return (
                <Button
                  key={connector.uid}
                  className="wallet-option"
                  role="listitem"
                  isDisabled
                >
                  <span className="wallet-icon" aria-hidden="true">WC</span>
                  <span className="wallet-name">WalletConnect — coming soon</span>
                </Button>
              );
            }

            return (
              <Button
                key={connector.uid}
                className="wallet-option"
                role="listitem"
                onPress={() => {
                  if (!isInjectedMissing) {
                    try { connect({ connector }); } catch {}
                  }
                }}
                isDisabled={isPending || isInjectedMissing}
              >
                <span className="wallet-icon" aria-hidden="true">{display.label}</span>
                <span className="wallet-name">
                  {isInjectedMissing ? 'Install MetaMask' : display.name}
                </span>
                {isConnectingThis && (
                  <span className="connecting-dot" aria-label="Connecting..." />
                )}
              </Button>
            );
          })}
        </div>

        <p className="connect-wallet-disclaimer">
          By connecting, you agree to Modulo's terms. Your keys, your crypto.
        </p>

        <Button className="demo-connect-btn" onPress={() => onDemoConnect?.()}>
          Continue in Demo Mode
        </Button>
      </div>
    </div>
  );
}
