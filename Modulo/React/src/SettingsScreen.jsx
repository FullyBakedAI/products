/**
 * SettingsScreen — app settings with inline sub-panels
 * Context: Reviewing — low stakes, user is configuring.
 * Route: /settings
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';
import { Button, Switch } from 'react-aria-components';

const MotionButton = motion.create(Button);
import {
  ChevronLeft, ChevronRight, Shield, Bell, Globe, Palette,
  Info, HelpCircle, LogOut, Copy, ExternalLink, Edit3,
} from 'lucide-react';
import './settings.css';

import walletAvatar from './assets/wallet-avatar.svg';
import moduloBadge  from './assets/icon-modulo-badge.svg';
import tokenEth  from './assets/token-eth.svg';
import tokenSol  from './assets/token-sol.svg';
import tokenBtc  from './assets/token-btc.svg';
import tokenUsdc from './assets/token-usdc.svg';
import tokenUsdt from './assets/token-usdt.svg';

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
      { id: 'about',         icon: Info,         label: 'About Modulo',          sub: 'v3.0' },
    ],
  },
];

const NETWORKS = [
  { id: 'ethereum',  name: 'Ethereum',  icon: tokenEth,  defaultOn: true  },
  { id: 'solana',    name: 'Solana',    icon: tokenSol,  defaultOn: true  },
  { id: 'polygon',   name: 'Polygon',   icon: tokenUsdc, defaultOn: true  },
  { id: 'arbitrum',  name: 'Arbitrum',  icon: tokenBtc,  defaultOn: true  },
  { id: 'base',      name: 'Base',      icon: tokenUsdt, defaultOn: false },
  { id: 'optimism',  name: 'Optimism',  icon: tokenEth,  defaultOn: false },
];

const panelTransition = {
  enter: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 320, mass: 0.75 } },
  exit:  { x: 80, opacity: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
};

/* ── Sub-panel wrapper ── */
function PanelShell({ title, onBack, children }) {
  return (
    <motion.div
      className="settings-panel"
      initial={{ x: 80, opacity: 0 }}
      animate={panelTransition.enter}
      exit={panelTransition.exit}
    >
      <div className="settings-header">
        <Button className="icon-btn" aria-label="Back" onPress={onBack}>
          <ChevronLeft size={20} color="var(--bk-text-primary)" strokeWidth={1.5} />
        </Button>
        <span className="settings-title">{title}</span>
        <div aria-hidden="true" style={{ width: 20 }} />
      </div>
      <div className="scroll-content">{children}</div>
    </motion.div>
  );
}

/* ── Toggle row helper ── */
function ToggleRow({ label, value, onChange }) {
  return (
    <div className="settings-toggle-row">
      <span className="settings-row-label">{label}</span>
      <Switch isSelected={value} onChange={onChange} aria-label={label} className="sp-switch">
        <div className="sp-switch-indicator" aria-hidden="true">
          <div className="sp-switch-thumb" />
        </div>
      </Switch>
    </div>
  );
}

/* ── Pill group helper ── */
function PillGroup({ options, value, onChange, ariaLabel }) {
  return (
    <div className="settings-pill-group" role="group" aria-label={ariaLabel}>
      {options.map(opt => (
        <Button
          key={opt}
          className={`settings-pill${value === opt ? ' active' : ''}`}
          aria-pressed={value === opt}
          onPress={() => onChange(opt)}
        >
          {opt}
        </Button>
      ))}
    </div>
  );
}

/* ── Security panel ── */
function SecurityPanel({ onBack }) {
  const [biometric, setBiometric] = useState(true);
  const [txSigning, setTxSigning] = useState(true);
  const [autoLock, setAutoLock]   = useState('5min');

  return (
    <PanelShell title="Security & Privacy" onBack={onBack}>
      <div className="settings-section">
        <ToggleRow label="Biometric unlock" value={biometric} onChange={setBiometric} />
        <ToggleRow label="Transaction signing" value={txSigning} onChange={setTxSigning} />
      </div>
      <div className="settings-section">
        <div className="settings-section-label">Auto-lock timeout</div>
        <PillGroup
          options={['1min', '5min', '15min', '30min']}
          value={autoLock}
          onChange={setAutoLock}
          ariaLabel="Auto-lock timeout"
        />
      </div>
      <div className="settings-section">
        <Button className="settings-row" aria-label="Connected apps">
          <Globe size={18} color="var(--bk-text-secondary)" strokeWidth={1.5} />
          <div className="settings-row-text">
            <span className="settings-row-label">Connected apps</span>
            <span className="settings-row-sub">3 apps</span>
          </div>
          <ChevronRight size={14} color="var(--bk-text-muted)" strokeWidth={1.5} />
        </Button>
      </div>
    </PanelShell>
  );
}

/* ── Notifications panel ── */
function NotificationsPanel({ onBack }) {
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [txConfirm, setTxConfirm]    = useState(true);
  const [yieldOpps, setYieldOpps]    = useState(true);
  const [marketing, setMarketing]    = useState(false);

  return (
    <PanelShell title="Notifications" onBack={onBack}>
      <div className="settings-section">
        <ToggleRow label="Price alerts" value={priceAlerts} onChange={setPriceAlerts} />
        <ToggleRow label="Transaction confirmations" value={txConfirm} onChange={setTxConfirm} />
        <ToggleRow label="Yield opportunities" value={yieldOpps} onChange={setYieldOpps} />
        <ToggleRow label="Marketing" value={marketing} onChange={setMarketing} />
      </div>
    </PanelShell>
  );
}

/* ── Networks panel ── */
function NetworksPanel({ onBack }) {
  const [enabled, setEnabled] = useState(() => {
    const init = {};
    NETWORKS.forEach(n => { init[n.id] = n.defaultOn; });
    return init;
  });

  return (
    <PanelShell title="Networks" onBack={onBack}>
      <div className="settings-section">
        {NETWORKS.map(net => (
          <div key={net.id} className="settings-network-row">
            <img src={net.icon} width="28" height="28" alt="" className="settings-network-icon" />
            <span className="settings-row-label">{net.name}</span>
            <Switch
              isSelected={enabled[net.id]}
              onChange={val => setEnabled(prev => ({ ...prev, [net.id]: val }))}
              aria-label={`Toggle ${net.name}`}
              className="sp-switch"
            >
              <div className="sp-switch-indicator" aria-hidden="true">
                <div className="sp-switch-thumb" />
              </div>
            </Switch>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}

/* ── Appearance panel ── */
function AppearancePanel({ onBack }) {
  const [theme, setTheme]       = useState('Dark');
  const [currency, setCurrency] = useState('USD');

  return (
    <PanelShell title="Appearance" onBack={onBack}>
      <div className="settings-section">
        <div className="settings-section-label">Theme</div>
        <PillGroup options={['Dark', 'Light', 'System']} value={theme} onChange={setTheme} ariaLabel="Theme" />
      </div>
      <div className="settings-section">
        <div className="settings-section-label">Currency</div>
        <PillGroup options={['USD', 'EUR', 'GBP']} value={currency} onChange={setCurrency} ariaLabel="Currency" />
      </div>
      <div className="settings-section">
        <div className="settings-section-label">Language</div>
        <PillGroup options={['English']} value="English" onChange={() => {}} ariaLabel="Language" />
      </div>
    </PanelShell>
  );
}

/* ── Help panel ── */
function HelpPanel({ onBack }) {
  return (
    <PanelShell title="Help & Support" onBack={onBack}>
      <div className="settings-section">
        {['FAQ', 'Contact Support', 'Report a Bug'].map(label => (
          <Button key={label} className="settings-row" aria-label={label}>
            <div className="settings-row-text">
              <span className="settings-row-label">{label}</span>
            </div>
            <ExternalLink size={14} color="var(--bk-text-muted)" strokeWidth={1.5} />
          </Button>
        ))}
      </div>
      <div className="settings-version-footer">Modulo v3.0</div>
    </PanelShell>
  );
}

/* ── About panel ── */
function AboutPanel({ onBack }) {
  return (
    <PanelShell title="About Modulo" onBack={onBack}>
      <div className="settings-about-content">
        <img src={moduloBadge} width="56" height="56" alt="Modulo" className="settings-about-logo" />
        <div className="settings-about-version">v3.0</div>
        <div className="settings-about-tagline">One vault, every chain.</div>
        <div className="settings-about-badge">Built with BakedUX</div>
      </div>
      <div className="settings-section">
        {['Terms', 'Privacy', 'Licenses'].map(label => (
          <Button key={label} className="settings-row" aria-label={label}>
            <div className="settings-row-text">
              <span className="settings-row-label">{label}</span>
            </div>
            <ExternalLink size={14} color="var(--bk-text-muted)" strokeWidth={1.5} />
          </Button>
        ))}
      </div>
    </PanelShell>
  );
}

/* ── Wallet detail panel ── */
function WalletPanel({ onBack }) {
  const [copied, setCopied] = useState(false);
  const fullAddr = '0x7f3e4a2b8c1d9e6f0a5b3c7d2e8f1a4b6c9d0e9A14';

  function handleCopy() {
    navigator.clipboard?.writeText(fullAddr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PanelShell title="Wallet" onBack={onBack}>
      <div className="settings-wallet-detail">
        <div className="avatar-wrap" style={{ margin: '0 auto 16px' }}>
          <img className="avatar" src={walletAvatar} alt="" />
          <img className="modulo-badge" src={moduloBadge} alt="Modulo" />
        </div>
        <div className="settings-wallet-name" style={{ textAlign: 'center' }}>modulo.eth</div>
        <div className="settings-wallet-full-addr">{fullAddr}</div>
      </div>
      <div className="settings-section">
        <Button className="settings-row" aria-label="Copy address" onPress={handleCopy}>
          <Copy size={18} color="var(--bk-text-secondary)" strokeWidth={1.5} />
          <div className="settings-row-text">
            <span className="settings-row-label">{copied ? 'Copied!' : 'Copy address'}</span>
          </div>
        </Button>
        <Button className="settings-row" aria-label="View on explorer">
          <ExternalLink size={18} color="var(--bk-text-secondary)" strokeWidth={1.5} />
          <div className="settings-row-text">
            <span className="settings-row-label">View on explorer</span>
          </div>
        </Button>
        <Button className="settings-row" aria-label="Rename wallet">
          <Edit3 size={18} color="var(--bk-text-secondary)" strokeWidth={1.5} />
          <div className="settings-row-text">
            <span className="settings-row-label">Rename wallet</span>
          </div>
        </Button>
      </div>
    </PanelShell>
  );
}

/* ── Panel map ── */
const PANELS = {
  security:      SecurityPanel,
  notifications: NotificationsPanel,
  networks:      NetworksPanel,
  appearance:    AppearancePanel,
  help:          HelpPanel,
  about:         AboutPanel,
  wallet:        WalletPanel,
};

/* ═══════════════════════════════════════════════════════════════════════
   Main settings screen
   ═══════════════════════════════════════════════════════════════════════ */

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null);

  const PanelComponent = activePanel ? PANELS[activePanel] : null;

  return (
    <motion.main
      className="settings-screen"
      role="main"
      aria-label="Settings"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <AnimatePresence mode="wait">
        {activePanel && PanelComponent ? (
          <PanelComponent key={activePanel} onBack={() => setActivePanel(null)} />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 1 }}
            exit={{ x: -40, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }}
          >
            {/* Header */}
            <div className="settings-header">
              <Button className="icon-btn" aria-label="Go back" onPress={() => navigate('/')}>
                <ChevronLeft size={20} color="var(--bk-text-primary)" strokeWidth={1.5} />
              </Button>
              <span className="settings-title">Settings</span>
              <div aria-hidden="true" style={{ width: 20 }} />
            </div>

            <div className="scroll-content">
              {/* Wallet card */}
              <MotionButton className="settings-wallet-card" onPress={() => setActivePanel('wallet')} aria-label="Wallet details" whileTap={{ scale: 0.98 }}>
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
              </MotionButton>

              {/* Setting sections */}
              {SETTINGS_SECTIONS.map(section => (
                <div key={section.label} className="settings-section">
                  <div className="settings-section-label">{section.label}</div>
                  {section.items.map(item => (
                    <MotionButton key={item.id} className="settings-row" aria-label={item.label} onPress={() => setActivePanel(item.id)} whileTap={{ scale: 0.98 }}>
                      <item.icon size={18} color="var(--bk-text-secondary)" strokeWidth={1.5} />
                      <div className="settings-row-text">
                        <span className="settings-row-label">{item.label}</span>
                        {item.sub && <span className="settings-row-sub">{item.sub}</span>}
                      </div>
                      <ChevronRight size={14} color="var(--bk-text-muted)" strokeWidth={1.5} />
                    </MotionButton>
                  ))}
                </div>
              ))}

              {/* Sign out */}
              <div className="settings-section">
                <Button className="settings-row settings-signout" aria-label="Sign out" onPress={() => navigate('/')}>
                  <LogOut size={18} color="var(--bk-error)" strokeWidth={1.5} />
                  <div className="settings-row-text">
                    <span className="settings-row-label" style={{ color: 'var(--bk-error)' }}>Sign Out</span>
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
