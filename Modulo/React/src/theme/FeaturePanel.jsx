import { useState, useEffect } from 'react';
import { useFeatures } from './FeatureConfig';
import { defaultFeatures } from '../config/features';
import './FeaturePanel.css';

// ── Built-in presets ────────────────────────────────────────────────────────
const BUILTIN_PRESETS = [
  {
    id: 'mvp',
    name: 'MVP',
    features: {
      nav: { home: true, explore: false, activity: true, autopilot: false, fab: true },
      home: {
        portfolioChart: false,
        liveYield: false,
        smartNudges: false,
        autopilotCard: false,
        optimisePromo: false,
        assetLimit: 1,
      },
      actions: { swap: true, trade: false, lend: false, deposit: false },
      defi: {
        priceImpact: true,
        slippageWarning: true,
        healthFactor: false,
        tokenApproval: false,
        transactionDeadline: false,
      },
      walletConnection: true,
      notifications: false,
      undoToast: false,
    },
  },
  {
    id: 'phase-2',
    name: 'Phase 2',
    features: {
      nav: { home: true, explore: true, activity: true, autopilot: true, fab: true },
      home: {
        portfolioChart: true,
        liveYield: true,
        smartNudges: true,
        autopilotCard: true,
        optimisePromo: false,
        assetLimit: 5,
      },
      actions: { swap: true, trade: false, lend: true, deposit: true },
      defi: {
        priceImpact: true,
        slippageWarning: true,
        healthFactor: true,
        tokenApproval: true,
        transactionDeadline: true,
      },
      walletConnection: true,
      notifications: true,
      undoToast: true,
    },
  },
  {
    id: 'full-product',
    name: 'Full Product',
    features: null,
  },
];

// ── Toggle switch component ─────────────────────────────────────────────────
function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className="bk-toggle-row">
      <span className="bk-toggle-label">{label}</span>
      <label className="bk-toggle-switch" aria-label={label}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="bk-toggle-track" />
      </label>
    </div>
  );
}

// ── Asset limit segmented control ───────────────────────────────────────────
function AssetLimitControl({ value, onChange }) {
  const OPTIONS = [
    { label: '1', value: 1 },
    { label: '5', value: 5 },
    { label: 'All', value: null },
  ];
  return (
    <div className="bk-toggle-row">
      <span className="bk-toggle-label">Asset limit</span>
      <div className="bk-segment-control">
        {OPTIONS.map(opt => (
          <button
            key={String(opt.value)}
            className={`bk-segment-btn${value === opt.value ? ' is-active' : ''}`}
            onClick={() => onChange(opt.value)}
            type="button"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main FeaturePanel ───────────────────────────────────────────────────────
export default function FeaturePanel() {
  const [open, setOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState(null);
  const [customPresets, setCustomPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('modulo-presets') || '[]');
    } catch {
      return [];
    }
  });

  const context = useFeatures();
  const { setFeatures } = context;

  // Don't render on design system page
  if (window.location.hash === '#/ds') return null;

  // Current resolved features (without setFeatures)
  const f = {
    nav: context.nav,
    home: context.home,
    actions: context.actions,
    defi: context.defi,
    notifications: context.notifications,
    walletConnection: context.walletConnection,
    undoToast: context.undoToast,
  };

  // ── Partial update helpers ───────────────────────────────────────────────
  function updateSection(section, key, value) {
    setActivePresetId(null);
    setFeatures({
      ...f,
      [section]: { ...f[section], [key]: value },
    });
  }

  function updateTop(key, value) {
    setActivePresetId(null);
    setFeatures({ ...f, [key]: value });
  }

  // ── Preset selection ─────────────────────────────────────────────────────
  function applyPreset(preset) {
    setActivePresetId(preset.id);
    setFeatures(preset.features ?? null);
  }

  // ── Save preset ──────────────────────────────────────────────────────────
  function savePreset() {
    const name = window.prompt('Preset name:');
    if (!name) return;

    const newPreset = { id: `custom-${Date.now()}`, name, features: f };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem('modulo-presets', JSON.stringify(updated));

    // Download JSON
    const blob = new Blob([JSON.stringify(newPreset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-preset.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Export config ────────────────────────────────────────────────────────
  function exportConfig() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const blob = new Blob([JSON.stringify(f, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${timestamp}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const allPresets = [...BUILTIN_PRESETS, ...customPresets];

  return (
    <>
      {/* Floating trigger */}
      <button
        className="bk-builder-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open MVP builder"
        type="button"
      >
        ⚡ Build
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="bk-builder-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={`bk-builder-panel${open ? ' is-open' : ''}`}
        data-builder-panel
        role="dialog"
        aria-label="MVP Builder"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bk-builder-header">
          <h2>MVP Builder</h2>
          <button
            className="bk-builder-close"
            onClick={() => setOpen(false)}
            aria-label="Close MVP builder"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="bk-builder-content">

          {/* Presets */}
          <div className="bk-builder-presets">
            <div className="bk-builder-presets-label">Presets</div>
            <div className="bk-builder-preset-pills">
              {allPresets.map(preset => (
                <button
                  key={preset.id}
                  className={`bk-preset-pill${activePresetId === preset.id ? ' is-active' : ''}`}
                  onClick={() => applyPreset(preset)}
                  type="button"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Nav toggles */}
          <div className="bk-builder-section">
            <div className="bk-builder-section-label">Nav</div>
            <ToggleSwitch label="Home" checked={f.nav.home} onChange={v => updateSection('nav', 'home', v)} />
            <ToggleSwitch label="Explore" checked={f.nav.explore} onChange={v => updateSection('nav', 'explore', v)} />
            <ToggleSwitch label="Activity" checked={f.nav.activity} onChange={v => updateSection('nav', 'activity', v)} />
            <ToggleSwitch label="Autopilot" checked={f.nav.autopilot} onChange={v => updateSection('nav', 'autopilot', v)} />
            <ToggleSwitch label="FAB" checked={f.nav.fab} onChange={v => updateSection('nav', 'fab', v)} />
          </div>

          {/* Home toggles */}
          <div className="bk-builder-section">
            <div className="bk-builder-section-label">Home</div>
            <ToggleSwitch label="Portfolio Chart" checked={f.home.portfolioChart} onChange={v => updateSection('home', 'portfolioChart', v)} />
            <ToggleSwitch label="Live Yield" checked={f.home.liveYield} onChange={v => updateSection('home', 'liveYield', v)} />
            <ToggleSwitch label="Smart Nudges" checked={f.home.smartNudges} onChange={v => updateSection('home', 'smartNudges', v)} />
            <ToggleSwitch label="Autopilot Card" checked={f.home.autopilotCard} onChange={v => updateSection('home', 'autopilotCard', v)} />
            <ToggleSwitch label="Optimise Promo" checked={f.home.optimisePromo} onChange={v => updateSection('home', 'optimisePromo', v)} />
            <AssetLimitControl
              value={f.home.assetLimit}
              onChange={v => updateSection('home', 'assetLimit', v)}
            />
          </div>

          {/* DeFi tabs */}
          <div className="bk-builder-section">
            <div className="bk-builder-section-label">DeFi tabs</div>
            <ToggleSwitch label="Swap" checked={f.actions.swap} onChange={v => updateSection('actions', 'swap', v)} />
            <ToggleSwitch label="Lending" checked={f.actions.lend} onChange={v => updateSection('actions', 'lend', v)} />
            <ToggleSwitch label="Deposit" checked={f.actions.deposit} onChange={v => updateSection('actions', 'deposit', v)} />
            <ToggleSwitch label="Trade" checked={f.actions.trade} onChange={v => updateSection('actions', 'trade', v)} />
          </div>

          {/* App toggles */}
          <div className="bk-builder-section">
            <div className="bk-builder-section-label">App</div>
            <ToggleSwitch label="Wallet Connection Gate" checked={f.walletConnection} onChange={v => updateTop('walletConnection', v)} />
            <ToggleSwitch label="Notifications" checked={f.notifications} onChange={v => updateTop('notifications', v)} />
            <ToggleSwitch label="Undo Toast" checked={f.undoToast} onChange={v => updateTop('undoToast', v)} />
          </div>

        </div>

        {/* Footer */}
        <div className="bk-builder-footer">
          <button className="bk-builder-btn is-primary" onClick={savePreset} type="button">
            Save preset
          </button>
          <button className="bk-builder-btn" onClick={exportConfig} type="button">
            Export config
          </button>
        </div>
      </div>
    </>
  );
}
