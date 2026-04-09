/**
 * ReceiveScreen — receive crypto (full-screen modal)
 * Matches HTML prototype at ../Prototype/receive-screen.html
 * All colours via --bk-* tokens. All data mocked.
 *
 * Animations:
 *   Screen entry — modal slide-up via motion-tokens.modal (y: 48 → 0, opacity 0 → 1)
 *   Stagger      — header, address card, QR, networks, exchanges stagger in sequence
 */

import { useState } from 'react';
import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import StatusBar from './StatusBar';
import './receive.css';

import walletAvatar from './assets/wallet-avatar.svg';
import moduloBadge from './assets/icon-modulo-badge.svg';
import { Check, AlertTriangle, ChevronRight } from 'lucide-react';
import iconCopy from './assets/icon-copy.svg';
import iconShare from './assets/icon-share.svg';
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

const RECEIVE_TOKENS = ['Any token', 'ETH', 'USDC', 'USDT'];

export default function ReceiveScreen() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [receiveToken, setReceiveToken] = useState('Any token');
  const [selectedExchange, setSelectedExchange] = useState(null);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.main
      role="main"
      aria-label="Modulo receive screen"
      className="receive-screen"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <StatusBar />

      {/* Drag Handle */}
      <div className="drag-handle" aria-hidden="true">
        <div className="drag-handle-pill" />
      </div>

      {/* Scrollable Content */}
      <div className="scroll-content">

        {/* Header */}
        <motion.div
          className="receive-header"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.06 } }}
        >
          <h1 className="receive-title">Receive crypto</h1>
          <p className="receive-subtitle">Share your address or QR code to receive crypto</p>
        </motion.div>

        {/* Address Card */}
        <motion.div
          className="address-card"
          role="region"
          aria-label="Wallet address"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.10 } }}
        >
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
            <Button
              className={`address-action-btn${copied ? ' copied' : ''}`}
              aria-label={copied ? 'Copied!' : 'Copy address'}
              onPress={handleCopy}
            >
              {copied
                ? <Check size={16} color="var(--bk-success)" strokeWidth={1.5} aria-hidden="true" />
                : <img src={iconCopy} width="16" height="16" aria-hidden="true" />
              }
            </Button>
            <Button className="address-action-btn" aria-label="Share address" onPress={() => { if (navigator.share) navigator.share({ title: 'Modulo Wallet', text: '0x7f3e...9A14' }).catch(() => {}); }}>
              <img src={iconShare} width="16" height="16" aria-hidden="true" />
            </Button>
          </div>
        </motion.div>

        {/* Token Selector */}
        <motion.div
          className="receive-token-selector"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.12 } }}
        >
          {RECEIVE_TOKENS.map(t => (
            <button
              key={t}
              className={`chain-pill${receiveToken === t ? ' active' : ''}`}
              onClick={() => setReceiveToken(t)}
              aria-pressed={receiveToken === t}
            >{t}</button>
          ))}
        </motion.div>

        {/* QR Code */}
        <motion.div
          className="qr-container"
          role="img"
          aria-label="QR code for wallet address"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1, transition: { ...m.springTight, delay: 0.14 } }}
        >
          <div className="qr-box">
            <img src={qrCode} alt="QR code" />
          </div>
        </motion.div>

        {/* Supported Networks */}
        <motion.div
          className="networks-section"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.20 } }}
        >
          <div className="section-label">Supported networks</div>
          <div className="network-pills" role="list" aria-label="Supported networks">
            {NETWORKS.map((n) => (
              <div key={n.label} className="pill" role="listitem">
                <img src={n.icon} alt="" />
                <span>{n.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Network Warning */}
        <motion.div
          className="receive-warning"
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.24 } }}
        >
          <AlertTriangle size={13} strokeWidth={1.5} aria-hidden="true" />
          <span>Only send assets on a supported network. Wrong network = permanent loss.</span>
        </motion.div>

        {/* Fund from Exchange */}
        <motion.div
          className="exchange-section"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.26 } }}
        >
          <div className="section-label">Fund from an exchange</div>
          <div className="exchange-list" role="list">
            {EXCHANGES.map((ex) => (
              <Button
                key={ex}
                className={`exchange-row-btn${selectedExchange === ex ? ' selected' : ''}`}
                aria-label={`Fund from ${ex}`}
                onPress={() => {
                  setSelectedExchange(ex);
                  setTimeout(() => setSelectedExchange(null), 2000);
                }}
                role="listitem"
              >
                <span>{selectedExchange === ex ? `Address copied for ${ex}` : ex}</span>
                {selectedExchange === ex
                  ? <Check size={14} color="var(--bk-success)" strokeWidth={2} />
                  : <ChevronRight size={14} color="var(--bk-text-muted)" strokeWidth={1.5} />
                }
              </Button>
            ))}
          </div>
        </motion.div>

      </div>{/* /.scroll-content */}

      {/* Done Button */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.30 } }}
      >
        <Button
          className="primary-btn"
          aria-label="Done"
          onPress={() => navigate('/')}
        >
          Done
        </Button>
      </motion.div>
    </motion.main>
  );
}
