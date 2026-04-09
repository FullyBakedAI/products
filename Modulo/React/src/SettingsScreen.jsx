/**
 * SettingsScreen — app settings
 * Context: Reviewing — low stakes, user is configuring.
 * Route: /settings
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { ChevronLeft, ChevronRight, Shield, Bell, Globe, Palette, Info, HelpCircle, LogOut, Check } from 'lucide-react';
import StatusBar from './StatusBar';
import './settings.css';

import walletAvatar from './assets/wallet-avatar.svg';
import moduloBadge  from './assets/icon-modulo-badge.svg';

const SETTINGS_SECTIONS = [
  {
    label: 'Account',
    items: [
      { id: 'security',      icon: Shield,      label: 'Security & Privacy',    sub: 'Biometrics, 2FA, approvals' },
      { id: 'notifications', icon: Bell,        label: 'Notifications',         sub: 'Price alerts, transactions' },
      { id: 'networks',      icon: Globe,        label: 'Networks',              sub: 'Manage chains & RPCs' },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { id: 'appearance',    icon: Palette,     label: 'Appearance',            sub: 'Dark mode, currency, language' },
    ],
  },
  {
    label: 'About',
    items: [
      { id: 'help',          icon: HelpCircle,  label: 'Help & Support',        sub: null },
      { id: 'about',         icon: Info,         label: 'About Modulo',          sub: 'v1.0.0' },
    ],
  },
];

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [tappedRow, setTappedRow] = useState(null);

  function handleRowTap(id) {
    setTappedRow(id);
    setTimeout(() => setTappedRow(null), 1500);
  }

  return (
    <motion.main
      className="settings-screen"
      role="main"
      aria-label="Settings"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <StatusBar />

      {/* Header */}
      <div className="settings-header">
        <Button className="icon-btn" aria-label="Go back" onPress={() => navigate(-1)}>
          <ChevronLeft size={20} color="var(--bk-text-primary)" strokeWidth={1.5} />
        </Button>
        <span className="settings-title">Settings</span>
        <div aria-hidden="true" style={{ width: 20 }} />
      </div>

      <div className="scroll-content">

        {/* Wallet card */}
        <button className="settings-wallet-card" onClick={() => handleRowTap('wallet')} aria-label="Wallet details">
          <div className="settings-wallet-left">
            <div className="avatar-wrap">
              <img className="avatar" src={walletAvatar} alt="" />
              <img className="modulo-badge" src={moduloBadge} alt="Modulo" />
            </div>
            <div>
              <div className="settings-wallet-name">modulo.eth</div>
              <div className="settings-wallet-addr">0x7f3e...9A14</div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--bk-text-muted)" strokeWidth={1.5} />
        </button>

        {/* Setting sections */}
        {SETTINGS_SECTIONS.map(section => (
          <div key={section.label} className="settings-section">
            <div className="settings-section-label">{section.label}</div>
            {section.items.map(item => (
              <button key={item.id} className="settings-row" aria-label={item.label} onClick={() => handleRowTap(item.id)}>
                <item.icon size={18} color="var(--bk-text-secondary)" strokeWidth={1.5} />
                <div className="settings-row-text">
                  <span className="settings-row-label">{item.label}</span>
                  {item.sub && <span className="settings-row-sub">{tappedRow === item.id ? 'Coming soon' : item.sub}</span>}
                  {!item.sub && tappedRow === item.id && <span className="settings-row-sub">Coming soon</span>}
                </div>
                {tappedRow === item.id
                  ? <Check size={14} color="var(--bk-brand-primary)" strokeWidth={2} />
                  : <ChevronRight size={14} color="var(--bk-text-muted)" strokeWidth={1.5} />
                }
              </button>
            ))}
          </div>
        ))}

        {/* Sign out */}
        <div className="settings-section">
          <button className="settings-row settings-signout" aria-label="Sign out" onClick={() => navigate('/')}>
            <LogOut size={18} color="var(--bk-error)" strokeWidth={1.5} />
            <div className="settings-row-text">
              <span className="settings-row-label" style={{ color: 'var(--bk-error)' }}>Sign Out</span>
            </div>
          </button>
        </div>

      </div>
    </motion.main>
  );
}
