/**
 * ReceiveScreen — receive crypto (full-screen modal)
 * Matches HTML prototype at ../Prototype/receive-screen.html
 * All colours via --bk-* tokens. All data mocked.
 */

import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import StatusBar from './StatusBar';
import './receive.css';

import walletAvatar from './assets/wallet-avatar.svg';
import moduloBadge from './assets/icon-modulo-badge.svg';
import { Copy, Share2 } from 'lucide-react';
import qrCode from './assets/qr-code.svg';
import networkEthereum from './assets/network-ethereum.svg';
import networkArbitrum from './assets/network-arbitrum.svg';
import networkBase from './assets/network-base.svg';
import networkOptimism from './assets/network-optimism.svg';
import networkPolygon from './assets/network-polygon.svg';

const NETWORKS = [
  { icon: networkEthereum, label: 'Ethereum' },
  { icon: networkArbitrum, label: 'Arbitrum' },
  { icon: networkBase,     label: 'Base' },
  { icon: networkOptimism, label: 'Optimism' },
  { icon: networkPolygon,  label: 'Polygon' },
];

const EXCHANGES = ['Coinbase', 'Binance', 'Kraken', 'Another wallet'];

export default function ReceiveScreen() {
  const navigate = useNavigate();

  return (
    <main role="main" aria-label="Modulo receive screen" className="receive-screen">
      <StatusBar />

      {/* Drag Handle */}
      <div className="drag-handle" aria-hidden="true">
        <div className="drag-handle-pill" />
      </div>

      {/* Scrollable Content */}
      <div className="scroll-content">

        {/* Header */}
        <div className="receive-header">
          <h1 className="receive-title">Receive crypto</h1>
          <p className="receive-subtitle">Share your address or QR code to receive crypto</p>
        </div>

        {/* Address Card */}
        <div className="address-card" role="region" aria-label="Wallet address">
          <div className="address-left">
            <div className="avatar-wrap">
              <img className="avatar" src={walletAvatar} alt="Wallet avatar" />
              <img className="modulo-badge" src={moduloBadge} alt="Modulo" />
            </div>
            <div className="address-text">
              <div className="address-name">modulo.eth</div>
              <div className="address-hash">0x7f3e...9A14</div>
            </div>
          </div>
          <div className="address-actions">
            <Button className="address-action-btn" aria-label="Copy address" onPress={() => {}}>
              <Copy size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
            </Button>
            <Button className="address-action-btn" aria-label="Share address" onPress={() => {}}>
              <Share2 size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* QR Code */}
        <div className="qr-container" role="img" aria-label="QR code for wallet address">
          <div className="qr-box">
            <img src={qrCode} alt="QR code" />
          </div>
        </div>

        {/* Supported Networks */}
        <div className="networks-section">
          <div className="section-label">Supported networks</div>
          <div className="network-pills" role="list" aria-label="Supported networks">
            {NETWORKS.map((n) => (
              <div key={n.label} className="pill" role="listitem">
                <img src={n.icon} alt="" />
                <span>{n.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fund from Exchange */}
        <div className="exchange-section">
          <div className="section-label">Fund from an exchange</div>
          <div className="exchange-list">
            {EXCHANGES.map((ex) => (
              <Button
                key={ex}
                className="exchange-btn"
                aria-label={`Fund from ${ex}`}
                onPress={() => {}}
              >
                {ex}
              </Button>
            ))}
          </div>
        </div>

      </div>{/* /.scroll-content */}

      {/* Done Button */}
      <Button
        className="primary-btn"
        aria-label="Done"
        onPress={() => navigate('/')}
      >
        Done
      </Button>
    </main>
  );
}
