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
const IconChevronLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconChevronRight = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconShield = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3L4 5.5V10C4 13.5 6.5 16.5 10 17.5C13.5 16.5 16 13.5 16 10V5.5L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const IconBell = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3C7.24 3 5 5.24 5 8V13H15V8C15 5.24 12.76 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8.5 13V14C8.5 14.83 9.17 15.5 10 15.5C10.83 15.5 11.5 14.83 11.5 14V13" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IconGlobe = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 3C10 3 7.5 6 7.5 10C7.5 14 10 17 10 17" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 3C10 3 12.5 6 12.5 10C12.5 14 10 17 10 17" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 10H17" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);
const IconPalette = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M10 3C6.13 3 3 6.13 3 10C3 13.87 6.13 17 10 17C10.83 17 11.5 16.33 11.5 15.5C11.5 15.12 11.35 14.78 11.11 14.53C10.88 14.28 10.74 13.95 10.74 13.59C10.74 12.76 11.41 12.09 12.24 12.09H14C15.66 12.09 17 10.75 17 9.09C17 5.73 13.87 3 10 3Z" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="6.5" cy="11.5" r="1" fill="currentColor"/>
    <circle cx="8" cy="7.5" r="1" fill="currentColor"/>
    <circle cx="12" cy="7.5" r="1" fill="currentColor"/>
  </svg>
);
const IconInfo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="6.5" r="0.75" fill="currentColor"/>
  </svg>
);
const IconHelpCircle = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7.5 8C7.5 6.62 8.62 5.5 10 5.5C11.38 5.5 12.5 6.62 12.5 8C12.5 9.38 10 10.5 10 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="13" r="0.75" fill="currentColor"/>
  </svg>
);
const IconLogOut = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7 17H4C3.45 17 3 16.55 3 16V4C3 3.45 3.45 3 4 3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 14L17 10L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconCopy = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="8" y="8" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 8V5C12 4.45 11.55 4 11 4H3C2.45 4 2 4.45 2 5V13C2 13.55 2.45 14 3 14H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconExternalLink = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M9 5H5C4.45 5 4 5.45 4 6V15C4 15.55 4.45 16 5 16H14C14.55 16 15 15.55 15 15V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 4H16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconEdit3 = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 16H7L15.5 7.5L12.5 4.5L4 13V16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12.5 4.5L15.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
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
      { id: 'security',      icon: IconShield,     label: 'Security & Privacy',    sub: 'Biometrics, 2FA, approvals' },
      { id: 'notifications', icon: IconBell,       label: 'Notifications',         sub: 'Price alerts, transactions' },
      { id: 'networks',      icon: IconGlobe,      label: 'Networks',              sub: 'Manage chains & RPCs' },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { id: 'appearance',    icon: IconPalette,    label: 'Appearance',            sub: 'Dark mode, currency, language' },
    ],
  },
  {
    label: 'About',
    items: [
      { id: 'help',          icon: IconHelpCircle, label: 'Help & Support',        sub: null },
      { id: 'about',         icon: IconInfo,       label: 'About Modulo',          sub: 'v3.0' },
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
          <IconChevronLeft size={20} />
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
        <Button className="settings-row" aria-label="Connected apps" onPress={() => alert('Connected apps — coming soon')}>
          <IconGlobe size={18} />
          <div className="settings-row-text">
            <span className="settings-row-label">Connected apps</span>
            <span className="settings-row-sub">3 apps</span>
          </div>
          <IconChevronRight size={14} />
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
const HELP_LINKS = {
  'FAQ':             'https://help.modulo.app/faq',
  'Contact Support': 'https://help.modulo.app/support',
  'Report a Bug':    'https://github.com/modulo-app/feedback/issues/new',
};

function HelpPanel({ onBack }) {
  return (
    <PanelShell title="Help & Support" onBack={onBack}>
      <div className="settings-section">
        {Object.entries(HELP_LINKS).map(([label, url]) => (
          <Button
            key={label}
            className="settings-row"
            aria-label={label}
            onPress={() => window.open(url, '_blank', 'noopener,noreferrer')}
          >
            <div className="settings-row-text">
              <span className="settings-row-label">{label}</span>
            </div>
            <IconExternalLink size={14} />
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
        {[
          { label: 'Terms',    url: 'https://modulo.app/terms'   },
          { label: 'Privacy',  url: 'https://modulo.app/privacy' },
          { label: 'Licenses', url: 'https://modulo.app/oss'     },
        ].map(({ label, url }) => (
          <Button
            key={label}
            className="settings-row"
            aria-label={label}
            onPress={() => window.open(url, '_blank', 'noopener,noreferrer')}
          >
            <div className="settings-row-text">
              <span className="settings-row-label">{label}</span>
            </div>
            <IconExternalLink size={14} />
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
        <div className="settings-wallet-name" style={{ textAlign: 'center' }}>modulo</div>
        <div className="settings-wallet-full-addr">{fullAddr}</div>
      </div>
      <div className="settings-section">
        <Button className="settings-row" aria-label="Copy address" onPress={handleCopy}>
          <IconCopy size={18} />
          <div className="settings-row-text">
            <span className="settings-row-label">{copied ? 'Copied!' : 'Copy address'}</span>
          </div>
        </Button>
        <Button
          className="settings-row"
          aria-label="View on explorer"
          onPress={() => window.open(`https://etherscan.io/address/${fullAddr}`, '_blank', 'noopener,noreferrer')}
        >
          <IconExternalLink size={18} />
          <div className="settings-row-text">
            <span className="settings-row-label">View on explorer</span>
          </div>
        </Button>
        <Button
          className="settings-row"
          aria-label="Rename wallet"
          onPress={() => alert('Rename wallet — coming soon')}
        >
          <IconEdit3 size={18} />
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
                <IconChevronLeft size={20} />
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
                    <div className="settings-wallet-name">modulo</div>
                    <div className="settings-wallet-addr">0x7f3e...9A14</div>
                  </div>
                </div>
                <IconChevronRight size={16} />
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
                      <IconChevronRight size={14} />
                    </MotionButton>
                  ))}
                </div>
              ))}

              {/* Sign out */}
              <div className="settings-section">
                <Button className="settings-row settings-signout" aria-label="Sign out" onPress={() => navigate('/')}>
                  <IconLogOut size={18} />
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
