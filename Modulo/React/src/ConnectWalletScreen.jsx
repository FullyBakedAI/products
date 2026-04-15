import { useConnect, useConnectors } from 'wagmi';
import { Button } from 'react-aria-components';
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
          <svg width="48" height="58" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Modulo">
            <path fillRule="evenodd" clipRule="evenodd" d="M3.2286 8.13149C1.4049 8.13149 0.0478516 6.76953 0.0478516 4.87246C0.0478516 2.98133 1.38682 1.62524 3.2286 1.62524C5.0469 1.62524 6.39128 2.98193 6.39128 4.87246C6.39128 6.75622 5.03569 8.13149 3.2286 8.13149ZM2.20163 6.08797C2.43418 6.35627 2.77771 6.51512 3.2286 6.51512C3.67254 6.51512 4.0096 6.35697 4.23783 6.08937C4.46862 5.81874 4.60953 5.41075 4.60953 4.87246C4.60953 4.33097 4.46852 3.92495 4.23832 3.65688C4.01061 3.39169 3.67366 3.2357 3.2286 3.2357C2.77384 3.2357 2.43057 3.39367 2.19924 3.66005C1.96567 3.92901 1.8236 4.33475 1.8236 4.87246C1.8236 5.40961 1.9669 5.81716 2.20163 6.08797Z" fill="#584BEB"/>
            <path d="M12.9032 6.70808C14.5326 5.36662 14.6124 3.90133 13.6695 2.6295L13.1287 1.90015L11.5595 3.19192L11.8158 3.53755C12.2401 4.10988 12.0456 4.5466 11.2612 5.19248L1.94007 12.8664C0.310655 14.2079 0.230851 15.6731 1.17385 16.945L1.71461 17.6743L3.28368 16.3825L3.02741 16.0369C2.60307 15.4646 2.79759 15.0279 3.58212 14.382L12.9032 6.70808Z" fill="#584BEB"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M11.6324 17.9493C9.8087 17.9493 8.45166 16.5874 8.45166 14.6903C8.45166 12.7992 9.79062 11.4431 11.6324 11.4431C13.4507 11.4431 14.7951 12.7998 14.7951 14.6903C14.7951 16.574 13.4395 17.9493 11.6324 17.9493ZM10.6054 15.9059C10.838 16.1741 11.1815 16.3329 11.6324 16.3329C12.0764 16.3329 12.4134 16.1749 12.6417 15.9072C12.8724 15.6366 13.0134 15.2286 13.0134 14.6903C13.0134 14.1489 12.8723 13.7428 12.6421 13.4748C12.4144 13.2095 12.0775 13.0536 11.6324 13.0536C11.1776 13.0536 10.8344 13.2115 10.603 13.4779C10.3695 13.7469 10.2274 14.1526 10.2274 14.6903C10.2274 15.2275 10.3707 15.635 10.6054 15.9059Z" fill="#584BEB"/>
          </svg>
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
