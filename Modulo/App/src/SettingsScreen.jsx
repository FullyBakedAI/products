/**
 * SettingsScreen — app settings
 * Context: Reviewing — low stakes, user is configuring.
 * Route: /settings
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button } from 'react-aria-components';
import { X, ChevronRight, Shield, Bell, Globe, Palette, Info, HelpCircle, LogOut } from 'lucide-react';
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
        <span className="settings-title">Settings</span>
        <Button className="close-btn-shared" aria-label="Close" onPress={() => navigate('/')}>
          <X size={20} color="var(--bk-text-muted)" strokeWidth={1.5} />
        </Button>
      </div>

      <div className="scroll-content">

        {/* Wallet card */}
        <div className="settings-wallet-card">
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
        </div>

        {/* Setting sections */}
        {SETTINGS_SECTIONS.map(section => (
          <div key={section.label} className="settings-section">
            <div className="settings-section-label">{section.label}</div>
            {section.items.map(item => (
              <button key={item.id} className="settings-row" aria-label={item.label}>
                <item.icon size={18} color="var(--bk-text-secondary)" strokeWidth={1.5} />
                <div className="settings-row-text">
                  <span className="settings-row-label">{item.label}</span>
                  {item.sub && <span className="settings-row-sub">{item.sub}</span>}
                </div>
                <ChevronRight size={14} color="var(--bk-text-muted)" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        ))}

        {/* Sign out */}
        <div className="settings-section">
          <button className="settings-row settings-signout" aria-label="Sign out">
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
