/**
 * SendScreen — select recipient (full-screen modal)
 * Matches HTML prototype at ../Prototype/send-screen.html
 * All colours via --bk-* tokens. All data mocked.
 *
 * Animations:
 *   Screen entry — modal slide-up via motion-tokens.modal (y: 48 → 0, opacity 0 → 1)
 *   Stagger      — header, search, contact list fade/slide in sequence
 */

import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import StatusBar from './StatusBar';
import './send.css';

import { Search, Share2, X } from 'lucide-react';
import walletAvatar from './assets/wallet-avatar.svg';
import moduloBadge from './assets/icon-modulo-badge.svg';

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

export default function SendScreen() {
  const navigate = useNavigate();

  return (
    <motion.main
      role="main"
      aria-label="Modulo send screen"
      className="send-screen"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <StatusBar />

      {/* Drag Handle */}
      <div className="drag-handle" aria-hidden="true">
        <div className="drag-handle-pill" />
      </div>

      {/* Header */}
      <motion.div
        className="send-header"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.06 } }}
      >
        <span className="send-title">Select recipient</span>
        <Button
          className="close-btn-shared"
          aria-label="Close"
          onPress={() => navigate('/')}
        >
          <X size={20} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </motion.div>

      {/* Search Field */}
      <motion.div
        className="search-field send-search"
        role="search"
        aria-label="Search recipients"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.10 } }}
      >
        <Search size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        <span className="placeholder">Address, ENS, or username</span>
        <Button className="scan-btn" aria-label="Scan QR code" onPress={() => {}}>
          <Share2 size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </motion.div>

      {/* Recent label */}
      <motion.div
        className="recent-label"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.14 } }}
      >
        Recent
      </motion.div>

      {/* Contact List */}
      <div className="contact-list" role="list" aria-label="Recent contacts">
        {CONTACTS.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.16 + i * 0.05 } }}
          >
            <Button
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
          </motion.div>
        ))}
      </div>
    </motion.main>
  );
}
