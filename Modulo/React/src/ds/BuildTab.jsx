/**
 * BuildTab — client MVP scoping and version control interface.
 * Preset cards, feature toggles, version history, JSON downloads.
 */
import { useState } from 'react';
import { useFeatures } from '../theme/FeatureConfig';
import { defaultFeatures } from '../config/features';

const BC = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('modulo-updates') : null;
import mvpJson       from '../config/presets/mvp.json';
import phase2Json    from '../config/presets/phase-2.json';
import fullJson      from '../config/presets/full-product.json';
import './BuildTab.css';

// ── Preset definitions ────────────────────────────────────────────────────────

const PRESETS = [
  {
    id: 'mvp',
    name: 'MVP',
    tagline: 'Bitcoin only · Swap only · 1 asset',
    bullets: ['Single asset (BTC)', 'Swap only', 'Minimal nav', 'No DeFi depth'],
    json: mvpJson,
  },
  {
    id: 'phase-2',
    name: 'Phase 2',
    tagline: 'Lending · Autopilot · 5 assets',
    bullets: ['5 assets', 'Lending + Deposit', 'Autopilot nav tab', 'Portfolio chart'],
    json: phase2Json,
  },
  {
    id: 'full-product',
    name: 'Full Product',
    tagline: 'Everything on · All chains · All features',
    bullets: ['All assets', 'All actions', 'Full DeFi suite', 'Smart nudges'],
    json: fullJson,
  },
];

// ── Toggle switch ─────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label }) {
  return (
    <label className="bt-toggle" aria-label={label}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span className="bt-toggle-track">
        <span className="bt-toggle-thumb" />
      </span>
    </label>
  );
}

// ── Feature row ───────────────────────────────────────────────────────────────

function FeatureRow({ label, description, checked, onChange }) {
  return (
    <div className="bt-feature-row">
      <div className="bt-feature-info">
        <span className="bt-feature-name">{label}</span>
        {description && <span className="bt-feature-desc">{description}</span>}
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

// ── Inline JSON viewer ────────────────────────────────────────────────────────

function JsonViewer({ data, onClose }) {
  return (
    <div className="bt-json-viewer">
      <div className="bt-json-viewer-header">
        <span className="bt-json-viewer-title">JSON</span>
        <button className="bt-json-close" onClick={onClose} type="button" aria-label="Close">✕</button>
      </div>
      <pre className="bt-json-pre">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function BuildTab() {
  const context = useFeatures();
  const { setFeatures } = context;
  const [activePresetId, setActivePresetId] = useState(null);
  const [viewingJson, setViewingJson] = useState(null); // preset id or null

  const f = {
    nav: context.nav,
    home: context.home,
    actions: context.actions,
    defi: context.defi,
    notifications: context.notifications,
    walletConnection: context.walletConnection,
    undoToast: context.undoToast,
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  function persistFeatures(next) {
    setFeatures(next);
    BC?.postMessage({ type: 'SET_FEATURES', features: next });
    try { localStorage.setItem('modulo_build_features', JSON.stringify(next)); } catch {}
  }

  function updateSection(section, key, value) {
    setActivePresetId(null);
    persistFeatures({ ...f, [section]: { ...f[section], [key]: value } });
  }

  function updateTop(key, value) {
    setActivePresetId(null);
    persistFeatures({ ...f, [key]: value });
  }

  function applyPreset(preset) {
    setActivePresetId(preset.id);
    persistFeatures(preset.json.features ?? null);
  }

  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadCurrentConfig() {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    downloadJson(f, `modulo-config-${timestamp}.json`);
  }

  function savePreset() {
    const name = window.prompt('Preset name:');
    if (!name) return;
    const preset = { id: `custom-${Date.now()}`, name, features: f };
    downloadJson(preset, `${name.toLowerCase().replace(/\s+/g, '-')}-preset.json`);
  }

  const viewingPreset = viewingJson ? PRESETS.find(p => p.id === viewingJson) : null;

  return (
    <div className="bt-root">

      {/* ── 1. Preset cards ────────────────────────────────────────── */}
      <section className="bt-section">
        <h2 className="bt-section-title">Presets</h2>
        <p className="bt-section-desc">
          Activate a preset to scope the prototype. Changes apply live in the Prototype tab.
        </p>
        <div className="bt-preset-grid">
          {PRESETS.map(preset => (
            <div
              key={preset.id}
              className={`bt-preset-card${activePresetId === preset.id ? ' is-active' : ''}`}
            >
              <div className="bt-preset-card-header">
                <span className="bt-preset-name">{preset.name}</span>
                {activePresetId === preset.id && (
                  <span className="bt-preset-badge">Active</span>
                )}
              </div>
              <p className="bt-preset-tagline">{preset.tagline}</p>
              <ul className="bt-preset-bullets">
                {preset.bullets.map(b => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="bt-preset-actions">
                <button
                  className="bt-preset-activate"
                  onClick={() => applyPreset(preset)}
                  type="button"
                >
                  {activePresetId === preset.id ? 'Active' : 'Activate'}
                </button>
                <button
                  className="bt-preset-view-json"
                  onClick={() => setViewingJson(viewingJson === preset.id ? null : preset.id)}
                  type="button"
                >
                  {viewingJson === preset.id ? 'Hide JSON' : 'View JSON'}
                </button>
              </div>
              {viewingJson === preset.id && (
                <JsonViewer data={preset.json} onClose={() => setViewingJson(null)} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Feature toggles ─────────────────────────────────────── */}
      <section className="bt-section">
        <h2 className="bt-section-title">Feature toggles</h2>
        <p className="bt-section-desc">
          Fine-tune individual features. Activating toggles clears the active preset.
        </p>

        <div className="bt-toggle-grid">

          {/* Nav */}
          <div className="bt-toggle-group">
            <div className="bt-group-label">Navigation</div>
            <FeatureRow label="Home" checked={f.nav.home} onChange={v => updateSection('nav','home',v)} />
            <FeatureRow label="Explore" description="Market discovery" checked={f.nav.explore} onChange={v => updateSection('nav','explore',v)} />
            <FeatureRow label="Activity" description="Transaction history" checked={f.nav.activity} onChange={v => updateSection('nav','activity',v)} />
            <FeatureRow label="Autopilot" description="AI-managed yield" checked={f.nav.autopilot} onChange={v => updateSection('nav','autopilot',v)} />
            <FeatureRow label="FAB" description="Floating action button" checked={f.nav.fab} onChange={v => updateSection('nav','fab',v)} />
          </div>

          {/* Home */}
          <div className="bt-toggle-group">
            <div className="bt-group-label">Home screen</div>
            <FeatureRow label="Portfolio chart" description="Balance over time" checked={f.home.portfolioChart} onChange={v => updateSection('home','portfolioChart',v)} />
            <FeatureRow label="Live yield" description="Real-time earnings counter" checked={f.home.liveYield} onChange={v => updateSection('home','liveYield',v)} />
            <FeatureRow label="Smart nudges" description="Contextual action prompts" checked={f.home.smartNudges} onChange={v => updateSection('home','smartNudges',v)} />
            <FeatureRow label="Autopilot card" description="Inline optimisation toggle" checked={f.home.autopilotCard} onChange={v => updateSection('home','autopilotCard',v)} />
            <FeatureRow label="Optimise promo" description='"Put it all to work" banner' checked={f.home.optimisePromo} onChange={v => updateSection('home','optimisePromo',v)} />
          </div>

          {/* Actions */}
          <div className="bt-toggle-group">
            <div className="bt-group-label">DeFi actions</div>
            <FeatureRow label="Swap" checked={f.actions.swap} onChange={v => updateSection('actions','swap',v)} />
            <FeatureRow label="Trade" description="Advanced order types" checked={f.actions.trade} onChange={v => updateSection('actions','trade',v)} />
            <FeatureRow label="Lend" description="Collateral lending" checked={f.actions.lend} onChange={v => updateSection('actions','lend',v)} />
            <FeatureRow label="Deposit" description="Yield-bearing deposits" checked={f.actions.deposit} onChange={v => updateSection('actions','deposit',v)} />
          </div>

          {/* DeFi */}
          <div className="bt-toggle-group">
            <div className="bt-group-label">DeFi safety</div>
            <FeatureRow label="Price impact" description="Dynamic slippage warning" checked={f.defi.priceImpact} onChange={v => updateSection('defi','priceImpact',v)} />
            <FeatureRow label="Slippage warning" description="High-impact acknowledgement" checked={f.defi.slippageWarning} onChange={v => updateSection('defi','slippageWarning',v)} />
            <FeatureRow label="Health factor" description="Liquidation risk indicator" checked={f.defi.healthFactor} onChange={v => updateSection('defi','healthFactor',v)} />
            <FeatureRow label="Token approval" description="ERC-20 approval step" checked={f.defi.tokenApproval} onChange={v => updateSection('defi','tokenApproval',v)} />
            <FeatureRow label="Transaction deadline" description='"Expires in X min" on review' checked={f.defi.transactionDeadline} onChange={v => updateSection('defi','transactionDeadline',v)} />
          </div>

          {/* App-level */}
          <div className="bt-toggle-group">
            <div className="bt-group-label">App</div>
            <FeatureRow label="Wallet connection gate" description="Connect wallet on first launch" checked={f.walletConnection} onChange={v => updateTop('walletConnection',v)} />
            <FeatureRow label="Notifications" checked={f.notifications} onChange={v => updateTop('notifications',v)} />
            <FeatureRow label="Undo toast" description="Undo action after transactions" checked={f.undoToast} onChange={v => updateTop('undoToast',v)} />
          </div>

        </div>
      </section>

      {/* ── 3. Version history ─────────────────────────────────────── */}
      <section className="bt-section">
        <h2 className="bt-section-title">Version history</h2>
        <p className="bt-section-desc">
          Your presets are version-controlled. Every commit is a timestamped product scope decision.
        </p>
        <div className="bt-version-box">
          <div className="bt-version-steps">
            <div className="bt-version-step">
              <span className="bt-step-num">1</span>
              <span>Activate a preset or configure feature toggles above</span>
            </div>
            <div className="bt-version-step">
              <span className="bt-step-num">2</span>
              <span>Download the JSON config</span>
            </div>
            <div className="bt-version-step">
              <span className="bt-step-num">3</span>
              <span>Commit it to <code>client-config/presets/</code></span>
            </div>
            <div className="bt-version-step">
              <span className="bt-step-num">4</span>
              <span>Every commit = a timestamped product scope decision in your git history</span>
            </div>
          </div>
          <div className="bt-version-actions">
            <button className="bt-action-btn bt-action-primary" onClick={downloadCurrentConfig} type="button">
              Download current config as JSON
            </button>
            <button className="bt-action-btn" onClick={savePreset} type="button">
              Save current config as preset
            </button>
          </div>
          <div className="bt-preset-downloads">
            <span className="bt-preset-downloads-label">Preset files:</span>
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                className="bt-preset-dl-btn"
                onClick={() => downloadJson(preset.json, `${preset.id}.json`)}
                type="button"
              >
                {preset.id}.json ↓
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
