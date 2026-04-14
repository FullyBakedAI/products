/**
 * PrototypeTab — live app in a CSS phone frame + right-side BuildPanel.
 * Phone renders at 88% scale. BuildPanel sends feature updates to the
 * iframe via BroadcastChannel('modulo-updates').
 */
import { useRef, useState, useCallback } from 'react';
import { defaultFeatures } from '../config/features';
import './PrototypeTab.css';

// ── BroadcastChannel (singleton outside component so it isn't recreated) ──
const BC = typeof BroadcastChannel !== 'undefined'
  ? new BroadcastChannel('modulo-updates')
  : null;

// ── Preset configs ────────────────────────────────────────────────────────
const PRESETS = {
  MVP: {
    nav:     { home: true, explore: false, activity: false, autopilot: false, fab: true },
    home:    { portfolioChart: true, liveYield: true, smartNudges: false, autopilotCard: false, optimisePromo: false, assetLimit: 3 },
    actions: { swap: true, trade: false, lend: false, deposit: true },
    defi:    { priceImpact: false, slippageWarning: false, healthFactor: false, tokenApproval: false, transactionDeadline: false },
    notifications: false, walletConnection: true, undoToast: false,
  },
  Phase2: {
    nav:     { home: true, explore: true, activity: true, autopilot: false, fab: true },
    home:    { portfolioChart: true, liveYield: true, smartNudges: true, autopilotCard: false, optimisePromo: true, assetLimit: null },
    actions: { swap: true, trade: true, lend: true, deposit: true },
    defi:    { priceImpact: true, slippageWarning: true, healthFactor: false, tokenApproval: false, transactionDeadline: false },
    notifications: true, walletConnection: true, undoToast: true,
  },
  Full: defaultFeatures,
};

// ── Toggle row component ──────────────────────────────────────────────────
function Toggle({ label, checked, onChange }) {
  return (
    <div className="bp-toggle-row">
      <span className="bp-toggle-label">{label}</span>
      <label className="bp-toggle">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="bp-toggle-track" />
        <span className="bp-toggle-thumb" />
      </label>
    </div>
  );
}

// ── Deep merge helper ─────────────────────────────────────────────────────
function deepMerge(base, patch) {
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    if (patch[k] !== null && typeof patch[k] === 'object' && !Array.isArray(patch[k])) {
      out[k] = { ...(base[k] || {}), ...patch[k] };
    } else {
      out[k] = patch[k];
    }
  }
  return out;
}

// ── Format timestamp ──────────────────────────────────────────────────────
function fmtTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── BuildPanel ────────────────────────────────────────────────────────────
function BuildPanel({ features, onFeaturesChange }) {
  const [activePreset, setActivePreset] = useState(null);
  const [versions, setVersions] = useState([]);
  const [currentVersionIdx, setCurrentVersionIdx] = useState(null);

  function applyPreset(name) {
    setActivePreset(name);
    const next = deepMerge(defaultFeatures, PRESETS[name]);
    onFeaturesChange(next);
  }

  function setNavFlag(key, val) {
    setActivePreset(null);
    onFeaturesChange(deepMerge(features, { nav: { ...features.nav, [key]: val } }));
  }

  function setHomeFlag(key, val) {
    setActivePreset(null);
    onFeaturesChange(deepMerge(features, { home: { ...features.home, [key]: val } }));
  }

  function setActionsFlag(key, val) {
    setActivePreset(null);
    onFeaturesChange(deepMerge(features, { actions: { ...features.actions, [key]: val } }));
  }

  function setDefiFlag(key, val) {
    setActivePreset(null);
    onFeaturesChange(deepMerge(features, { defi: { ...features.defi, [key]: val } }));
  }

  function setAppFlag(key, val) {
    setActivePreset(null);
    onFeaturesChange(deepMerge(features, { [key]: val }));
  }

  function saveVersion() {
    const label = activePreset
      ? `${activePreset} preset`
      : `Version ${versions.length + 1}`;
    const snap = { label, features: JSON.parse(JSON.stringify(features)), ts: Date.now() };
    setVersions(prev => [snap, ...prev].slice(0, 12));
    setCurrentVersionIdx(0);
  }

  function restoreVersion(idx) {
    setCurrentVersionIdx(idx);
    onFeaturesChange(JSON.parse(JSON.stringify(versions[idx].features)));
    setActivePreset(null);
  }

  function undo() {
    if (versions.length < 2) return;
    const nextIdx = (currentVersionIdx ?? 0) + 1;
    if (nextIdx < versions.length) restoreVersion(nextIdx);
  }

  return (
    <aside className="build-panel">
      {/* Presets */}
      <div className="bp-section">
        <p className="bp-section-title">Presets</p>
        <div className="bp-presets">
          {Object.keys(PRESETS).map(name => (
            <button
              key={name}
              className={`bp-preset-btn${activePreset === name ? ' active' : ''}`}
              onClick={() => applyPreset(name)}
              type="button"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="bp-section">
        <p className="bp-section-title">Navigation</p>
        <div className="bp-toggles">
          <Toggle label="Explore"   checked={!!features.nav?.explore}   onChange={v => setNavFlag('explore', v)} />
          <Toggle label="Activity"  checked={!!features.nav?.activity}  onChange={v => setNavFlag('activity', v)} />
          <Toggle label="Autopilot" checked={!!features.nav?.autopilot} onChange={v => setNavFlag('autopilot', v)} />
          <Toggle label="FAB (+)"   checked={!!features.nav?.fab}       onChange={v => setNavFlag('fab', v)} />
        </div>
      </div>

      {/* Home */}
      <div className="bp-section">
        <p className="bp-section-title">Home Screen</p>
        <div className="bp-toggles">
          <Toggle label="Portfolio chart"  checked={!!features.home?.portfolioChart}  onChange={v => setHomeFlag('portfolioChart', v)} />
          <Toggle label="Live yield"       checked={!!features.home?.liveYield}       onChange={v => setHomeFlag('liveYield', v)} />
          <Toggle label="Smart nudges"     checked={!!features.home?.smartNudges}     onChange={v => setHomeFlag('smartNudges', v)} />
          <Toggle label="Autopilot card"   checked={!!features.home?.autopilotCard}   onChange={v => setHomeFlag('autopilotCard', v)} />
          <Toggle label="Optimise promo"   checked={!!features.home?.optimisePromo}   onChange={v => setHomeFlag('optimisePromo', v)} />
        </div>
      </div>

      {/* Actions */}
      <div className="bp-section">
        <p className="bp-section-title">Actions</p>
        <div className="bp-toggles">
          <Toggle label="Swap"    checked={!!features.actions?.swap}    onChange={v => setActionsFlag('swap', v)} />
          <Toggle label="Trade"   checked={!!features.actions?.trade}   onChange={v => setActionsFlag('trade', v)} />
          <Toggle label="Lend"    checked={!!features.actions?.lend}    onChange={v => setActionsFlag('lend', v)} />
          <Toggle label="Deposit" checked={!!features.actions?.deposit} onChange={v => setActionsFlag('deposit', v)} />
        </div>
      </div>

      {/* DeFi */}
      <div className="bp-section">
        <p className="bp-section-title">DeFi</p>
        <div className="bp-toggles">
          <Toggle label="Price impact"    checked={!!features.defi?.priceImpact}     onChange={v => setDefiFlag('priceImpact', v)} />
          <Toggle label="Slippage warn"   checked={!!features.defi?.slippageWarning} onChange={v => setDefiFlag('slippageWarning', v)} />
          <Toggle label="Health factor"   checked={!!features.defi?.healthFactor}    onChange={v => setDefiFlag('healthFactor', v)} />
          <Toggle label="Token approval"  checked={!!features.defi?.tokenApproval}   onChange={v => setDefiFlag('tokenApproval', v)} />
          <Toggle label="Tx deadline"     checked={!!features.defi?.transactionDeadline} onChange={v => setDefiFlag('transactionDeadline', v)} />
        </div>
      </div>

      {/* App */}
      <div className="bp-section">
        <p className="bp-section-title">App</p>
        <div className="bp-toggles">
          <Toggle label="Notifications"    checked={!!features.notifications}    onChange={v => setAppFlag('notifications', v)} />
          <Toggle label="Wallet connect"   checked={!!features.walletConnection} onChange={v => setAppFlag('walletConnection', v)} />
          <Toggle label="Undo toast"       checked={!!features.undoToast}        onChange={v => setAppFlag('undoToast', v)} />
        </div>
      </div>

      {/* Versions */}
      <div className="bp-section">
        <p className="bp-section-title">Versions</p>
        <div className="bp-version-bar">
          <button className="bp-save-btn" onClick={saveVersion} type="button">
            Save version
          </button>
          <button
            className="bp-undo-btn"
            onClick={undo}
            disabled={versions.length < 2}
            type="button"
            title="Revert to previous version"
          >
            Undo
          </button>
        </div>
        {versions.length > 0 && (
          <div className="bp-version-list">
            {versions.map((v, i) => (
              <button
                key={v.ts}
                className={`bp-version-item${i === currentVersionIdx ? ' current' : ''}`}
                onClick={() => restoreVersion(i)}
                type="button"
              >
                <span className="bp-version-dot" />
                <span className="bp-version-label">{v.label}</span>
                <span className="bp-version-time">{fmtTime(v.ts)}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

// ── PrototypeTab ──────────────────────────────────────────────────────────
export default function PrototypeTab() {
  const iframeRef = useRef(null);
  const [features, setFeatures] = useState(() => JSON.parse(JSON.stringify(defaultFeatures)));

  const handleFeaturesChange = useCallback((next) => {
    setFeatures(next);
    BC?.postMessage({ type: 'SET_FEATURES', features: next });
  }, []);

  function handleFullScreen() {
    window.location.hash = '/';
  }

  function handleNewTab() {
    window.open(window.location.origin + window.location.pathname, '_blank');
  }

  return (
    <div className="proto-tab">
      {/* Left: phone frame */}
      <div className="proto-left">
        {/* Top bar */}
        <div className="proto-top-bar" style={{ marginBottom: 16 }}>
          <button className="proto-btn" onClick={handleFullScreen} type="button">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1.5 5V1.5H5M9 1.5h3.5V5M12.5 9v3.5H9M5 12.5H1.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Full screen
          </button>
          <button className="proto-btn proto-btn-ghost" onClick={handleNewTab} type="button">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M6 2H2v10h10V8M8 2h4m0 0v4M12 2 6 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Open in new tab
          </button>
        </div>

        {/* Phone frame */}
        <div className="proto-stage">
          <div className="proto-frame">
            <div className="proto-notch" aria-hidden="true">
              <div className="proto-notch-pill" />
            </div>
            <iframe
              ref={iframeRef}
              src={window.location.origin + window.location.pathname}
              title="Modulo prototype"
              allow="same-origin"
              loading="eager"
            />
          </div>
          <p className="proto-hint">
            Use the panel to configure features
          </p>
        </div>
      </div>

      {/* Right: build panel */}
      <BuildPanel features={features} onFeaturesChange={handleFeaturesChange} />
    </div>
  );
}
