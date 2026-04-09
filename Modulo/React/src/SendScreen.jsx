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

import { ScanLine, X } from 'lucide-react';
import iconSearch from './assets/icon-search.svg';
import iconCopy from './assets/icon-copy.svg';
import walletAvatar from './assets/wallet-avatar.svg';
import moduloBadge from './assets/icon-modulo-badge.svg';

const CONTACTS = [
  { id: 1, section: 'Saved',  variant: '',         name: 'modulo.eth',    sub: '0x540e...7262', hasBadge: true,  lastSent: '2 days ago',   lastAmount: '$324', ariaLabel: 'modulo.eth — 0x540e...7262' },
  { id: 2, section: 'Recent', variant: 'variant-1', name: '0x4248...EF33', sub: null,            hasBadge: false, lastSent: '5 days ago',   lastAmount: '$100', ariaLabel: '0x4248...EF33' },
  { id: 3, section: 'Recent', variant: 'variant-3', name: '0xb5A9...Db3a', sub: null,            hasBadge: false, lastSent: '2 weeks ago',  lastAmount: '$50',  ariaLabel: '0xb5A9...Db3a' },
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
        <img src={iconSearch} width="16" height="16" aria-hidden="true" />
        <span className="placeholder">Address, ENS, or username</span>
        <Button className="scan-btn" aria-label="Scan QR code" onPress={() => {}}>
          <ScanLine size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        </Button>
        <Button className="scan-btn paste-btn" aria-label="Paste address from clipboard" onPress={() => {}}>
          <img src={iconCopy} width="16" height="16" aria-hidden="true" />
        </Button>
      </motion.div>

      {/* Destination network */}
      <motion.div
        className="send-network-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.12 } }}
      >
        <span className="send-network-label">Network</span>
        <button className="chain-pill active" aria-label="Change network: Ethereum">
          Ethereum &#9662;
        </button>
      </motion.div>

      {/* Contact List — Saved + Recent sections */}
      <div className="contact-list" role="list" aria-label="Contacts">
        {['Saved', 'Recent'].map(section => {
          const sectionContacts = CONTACTS.filter(c => c.section === section);
          if (!sectionContacts.length) return null;
          return (
            <div key={section}>
              <div className="recent-label">{section}</div>
              {sectionContacts.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.16 + i * 0.05 } }}
                >
                  <Button
                    className={`contact-row${c.variant ? ` avatar-${c.variant}` : ''}`}
                    role="listitem"
                    aria-label={c.ariaLabel}
                    onPress={() => navigate('/send/amount', { state: { recipient: { name: c.name, address: c.sub || c.name } } })}
                  >
                    <div className="avatar-wrap">
                      <img className="avatar" src={walletAvatar} alt="" />
                      {c.hasBadge && <img className="modulo-badge" src={moduloBadge} alt="Modulo" />}
                    </div>
                    <div className="contact-text">
                      <div className="contact-name">{c.name}</div>
                      {c.sub && <div className="contact-sub">{c.sub}</div>}
                      <div className="contact-last-sent">{c.lastSent} · {c.lastAmount}</div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>
    </motion.main>
  );
}
