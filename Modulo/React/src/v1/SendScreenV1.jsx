/**
 * SendScreenV1 — Frozen snapshot of SendScreen at modulo-v1 tag.
 * Do NOT edit logic. Import paths adjusted for v1/ subdirectory.
 */

import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../StatusBar';
import '../send.css';

import { Search, Share2, X } from 'lucide-react';
import walletAvatar from '../assets/wallet-avatar.svg';
import moduloBadge from '../assets/icon-modulo-badge.svg';

const CONTACTS = [
  {
    id: 1,
    variant: 'variant-1',
    name: '0x4248...EF33',
    sub: null,
    hasBadge: false,
    ariaLabel: '0x4248...EF33',
  },
  {
    id: 2,
    variant: '',
    name: 'modulo.eth',
    sub: '0x540e...7262',
    hasBadge: true,
    ariaLabel: 'modulo.eth — 0x540e...7262',
  },
  {
    id: 3,
    variant: 'variant-3',
    name: '0xb5A9...Db3a',
    sub: null,
    hasBadge: false,
    ariaLabel: '0xb5A9...Db3a',
  },
];

export default function SendScreenV1() {
  const navigate = useNavigate();

  return (
    <main role="main" aria-label="Modulo send screen" className="send-screen">
      <StatusBar />

      {/* Drag Handle */}
      <div className="drag-handle" aria-hidden="true">
        <div className="drag-handle-pill" />
      </div>

      {/* Header */}
      <div className="send-header">
        <span className="send-title">Select recipient</span>
        <Button
          className="close-btn-shared"
          aria-label="Close"
          onPress={() => navigate('/')}
        >
          <X size={20} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>

      {/* Search Field */}
      <div className="search-field send-search" role="search" aria-label="Search recipients">
        <Search size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        <span className="placeholder">Address, ENS, or username</span>
        <Button className="scan-btn" aria-label="Scan QR code" onPress={() => {}}>
          <Share2 size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>

      {/* Recent label */}
      <div className="recent-label">Recent</div>

      {/* Contact List */}
      <div className="contact-list" role="list" aria-label="Recent contacts">
        {CONTACTS.map((c) => (
          <Button
            key={c.id}
            className={`contact-row${c.variant ? ` avatar-${c.variant}` : ''}`}
            role="listitem"
            aria-label={c.ariaLabel}
            onPress={() => navigate(-1)}
          >
            <div className="avatar-wrap">
              <img className="avatar" src={walletAvatar} alt="" />
              {c.hasBadge && (
                <img className="modulo-badge" src={moduloBadge} alt="Modulo" />
              )}
            </div>
            <div className="contact-text">
              <div className="contact-name">{c.name}</div>
              {c.sub && <div className="contact-sub">{c.sub}</div>}
            </div>
          </Button>
        ))}
      </div>
    </main>
  );
}
