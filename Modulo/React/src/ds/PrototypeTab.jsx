/**
 * PrototypeTab — phone-frame prototype viewer + build controls side panel.
 * Layout: phone frame (left) | build panel (right).
 * Build panel sends postMessage + localStorage to sync feature presets with iframe.
 */
import { useRef, useState, useCallback } from 'react';
import { Button, Switch, TextField, TextArea } from 'react-aria-components';
import { defaultFeatures } from '../config/features';
import mvpJson    from '../../../client-config/presets/mvp.json';
import phase2Json from '../../../client-config/presets/phase-2.json';
import fullJson   from '../../../client-config/presets/full-product.json';
import './PrototypeTab.css';

const LS_FEATURES = 'modulo_build_features';
const LS_CUSTOM   = 'modulo_custom_presets';

const BUILTIN_PRESETS = [
  { id: 'mvp',          name: 'MVP',          desc: 'Bitcoin only · Swap only', features: mvpJson.features ?? defaultFeatures },
  { id: 'phase-2',      name: 'Phase 2',      desc: 'Lending · 5 assets',       features: phase2Json.features ?? defaultFeatures },
  { id: 'full-product', name: 'Full Product', desc: 'All features on',           features: fullJson.features ?? defaultFeatures },
];

function loadCustomPresets() {
  try { return JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]'); } catch { return []; }
}

// ── Build panel ───────────────────────────────────────────────────────────────

function BuildPanel({ iframeRef, onRestart }) {
  const [activePreset, setActivePreset]   = useState(null);
  const [features, setFeaturesLocal]      = useState(defaultFeatures);
  const [customPresets, setCustomPresets] = useState(loadCustomPresets);
  const [saveMsg, setSaveMsg]             = useState(null);

  const allPresets = [...BUILTIN_PRESETS, ...customPresets];

  function sendToIframe(feats) {
    try { localStorage.setItem(LS_FEATURES, JSON.stringify(feats)); } catch {}
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'SET_FEATURES', features: feats },
        window.location.origin
      );
    } catch {}
  }

  function applyPreset(preset) {
    setActivePreset(preset.id);
    setFeaturesLocal(preset.features ?? defaultFeatures);
    sendToIframe(preset.features ?? defaultFeatures);
  }

  function toggleFeature(section, key, value) {
    setActivePreset(null);
    const next = section
      ? { ...features, [section]: { ...features[section], [key]: value } }
      : { ...features, [key]: value };
    setFeaturesLocal(next);
    sendToIframe(next);
  }

  function savePreset() {
    // If a preset is active, offer to overwrite it (custom presets only) or save as new
    const activeCustom = customPresets.find(p => p.id === activePreset);
    if (activeCustom) {
      const updated = customPresets.map(p =>
        p.id === activePreset ? { ...p, features } : p
      );
      setCustomPresets(updated);
      localStorage.setItem(LS_CUSTOM, JSON.stringify(updated));
      flash(`Saved "${activeCustom.name}"`);
      return;
    }

    const name = window.prompt('Name this preset:');
    if (!name?.trim()) return;
    const newPreset = { id: `custom-${Date.now()}`, name: name.trim(), desc: 'Custom', features };
    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    localStorage.setItem(LS_CUSTOM, JSON.stringify(updated));
    setActivePreset(newPreset.id);
    flash(`Saved "${newPreset.name}"`);
  }

  function deleteCustomPreset(id, e) {
    e.stopPropagation();
    const updated = customPresets.filter(p => p.id !== id);
    setCustomPresets(updated);
    localStorage.setItem(LS_CUSTOM, JSON.stringify(updated));
    if (activePreset === id) setActivePreset(null);
  }

  function flash(msg) {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(null), 2000);
  }

  const f = features;
  const activeIsCustom = customPresets.some(p => p.id === activePreset);

  return (
    <div className="proto-build-panel">
      <div className="proto-build-header">
        <span className="proto-build-title">Build</span>
        <span className="proto-build-sub">Configure the prototype</span>
      </div>

      <div className="proto-build-scrollable">

        {/* Presets */}
        <div className="proto-build-section">
          <div className="proto-build-section-label">Presets</div>
          <div className="proto-presets">
            {allPresets.map(p => {
              const isActive = activePreset === p.id;
              const isCustom = customPresets.some(c => c.id === p.id);
              return (
                <Button
                  key={p.id}
                  className={`proto-preset-btn${isActive ? ' is-active' : ''}`}
                  onPress={() => applyPreset(p)}
                >
                  <div className="proto-preset-left">
                    <div className="proto-preset-check" aria-hidden="true">
                      {isActive && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className="proto-preset-name">{p.name}</span>
                      <span className="proto-preset-desc">{p.desc}</span>
                    </div>
                  </div>
                  {isCustom && (
                    <Button
                      className="proto-preset-delete"
                      onPress={e => deleteCustomPreset(p.id, e)}
                      aria-label={`Delete ${p.name}`}
                    >×</Button>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="proto-build-section">
          <div className="proto-build-section-label">Navigation</div>
          {[
            ['Home',      'nav', 'home'],
            ['Explore',   'nav', 'explore'],
            ['Activity',  'nav', 'activity'],
            ['Autopilot', 'nav', 'autopilot'],
          ].map(([label, section, key]) => (
            <ProtoToggle key={key} label={label} checked={f[section]?.[key] ?? false}
              onChange={v => toggleFeature(section, key, v)} />
          ))}
        </div>

        {/* Home screen */}
        <div className="proto-build-section">
          <div className="proto-build-section-label">Home screen</div>
          {[
            ['Portfolio chart', 'home', 'portfolioChart'],
            ['Live yield',      'home', 'liveYield'],
            ['Smart nudges',    'home', 'smartNudges'],
            ['Autopilot card',  'home', 'autopilotCard'],
          ].map(([label, section, key]) => (
            <ProtoToggle key={key} label={label} checked={f[section]?.[key] ?? false}
              onChange={v => toggleFeature(section, key, v)} />
          ))}
        </div>

        {/* DeFi actions */}
        <div className="proto-build-section">
          <div className="proto-build-section-label">DeFi actions</div>
          {[
            ['Swap',    'actions', 'swap'],
            ['Trade',   'actions', 'trade'],
            ['Lend',    'actions', 'lend'],
            ['Deposit', 'actions', 'deposit'],
          ].map(([label, section, key]) => (
            <ProtoToggle key={key} label={label} checked={f[section]?.[key] ?? false}
              onChange={v => toggleFeature(section, key, v)} />
          ))}
        </div>

        {/* App */}
        <div className="proto-build-section" style={{ borderBottom: 'none' }}>
          <div className="proto-build-section-label">App</div>
          <ProtoToggle label="Wallet gate"   checked={f.walletConnection ?? false} onChange={v => toggleFeature(null, 'walletConnection', v)} />
          <ProtoToggle label="Notifications" checked={f.notifications ?? false}    onChange={v => toggleFeature(null, 'notifications', v)} />
          <ProtoToggle label="Undo toast"    checked={f.undoToast ?? false}        onChange={v => toggleFeature(null, 'undoToast', v)} />
        </div>

      </div>

      {/* Footer — save */}
      <div className="proto-build-footer">
        {saveMsg ? (
          <span className="proto-save-msg">{saveMsg}</span>
        ) : (
          <Button className="proto-save-btn" onPress={savePreset}>
            {activeIsCustom ? `Save changes to "${customPresets.find(p => p.id === activePreset)?.name}"` : 'Save as preset…'}
          </Button>
        )}
      </div>
    </div>
  );
}

function ProtoToggle({ label, checked, onChange }) {
  return (
    <Switch
      isSelected={checked}
      onChange={onChange}
      className="proto-toggle-row"
    >
      <span className="proto-toggle-label">{label}</span>
      <div className={`proto-toggle-track${checked ? ' is-on' : ''}`} aria-hidden="true">
        <div className="proto-toggle-thumb" />
      </div>
    </Switch>
  );
}

// ── AI helper ────────────────────────────────────────────────────────────────

const AI_SYSTEM_PROMPT = `You are Modulo's AI design assistant. You help business owners explore and refine their DeFi app prototype.

You can suggest and apply feature changes by returning a JSON block. The feature structure is:
{
  "nav": { "home": bool, "explore": bool, "activity": bool, "autopilot": bool },
  "home": { "portfolioChart": bool, "liveYield": bool, "smartNudges": bool, "autopilotCard": bool },
  "actions": { "swap": bool, "trade": bool, "lend": bool, "stake": bool },
  "walletConnection": bool, "notifications": bool, "undoToast": bool
}

When suggesting feature changes, wrap the new feature config in a \`\`\`features JSON block like:
\`\`\`features
{ "nav": { ... }, ... }
\`\`\`

Keep responses concise (2-4 sentences max). Focus on what changed and why it suits their needs.
If the user asks something that doesn't map to feature toggles, give product advice or UX recommendations.`;

async function callClaude(messages) {
  const endpoint = import.meta.env.DEV ? '/api/claude' : '/api/claude';
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: AI_SYSTEM_PROMPT,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error ${res.status}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

function parseFeatures(text) {
  const match = text.match(/```features\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

function stripFeaturesBlock(text) {
  return text.replace(/```features\s*\n[\s\S]*?\n```/g, '').trim();
}

// ── AI Prompt Panel ──────────────────────────────────────────────────────────

function AIPromptPanel({ onApplyFeatures }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  async function handleSubmit() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = history.map(m => ({ role: m.role, content: m.content }));
      const reply = await callClaude(apiMessages);
      const features = parseFeatures(reply);
      const displayText = stripFeaturesBlock(reply);

      const assistantMsg = { role: 'assistant', content: reply, displayText, features };
      setMessages(prev => [...prev, assistantMsg]);

      if (features && onApplyFeatures) {
        onApplyFeatures(features);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: err.message, displayText: `Error: ${err.message}`, isError: true }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 50);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="proto-ai-panel">
      <div className="proto-ai-header">
        <span className="proto-ai-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z" fill="currentColor"/>
          </svg>
        </span>
        <span className="proto-ai-title">AI Assistant</span>
        <span className="proto-ai-sub">Describe what you'd like to explore</span>
      </div>

      <div className="proto-ai-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="proto-ai-empty">
            Try: "Show me an MVP with just swap" or "What would a lending-focused app look like?"
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`proto-ai-msg proto-ai-msg-${m.role}${m.isError ? ' proto-ai-msg-error' : ''}`}>
            <div className="proto-ai-msg-text">{m.displayText || m.content}</div>
            {m.features && (
              <div className="proto-ai-msg-applied">Applied to prototype</div>
            )}
          </div>
        ))}
        {loading && (
          <div className="proto-ai-msg proto-ai-msg-assistant">
            <div className="proto-ai-typing"><span /><span /><span /></div>
          </div>
        )}
      </div>

      <div className="proto-ai-input-row">
        <textarea
          className="proto-ai-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a feature idea or change…"
          rows={1}
          disabled={loading}
        />
        <Button
          className="proto-ai-send"
          onPress={handleSubmit}
          isDisabled={!input.trim() || loading}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M12.5 1.5L6 8M12.5 1.5L8.5 12.5L6 8M12.5 1.5L1.5 5.5L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}

// ── Main tab ──────────────────────────────────────────────────────────────────

export default function PrototypeTab() {
  const iframeRef   = useRef(null);
  const [iframeKey, setIframeKey] = useState(0);
  const buildPanelRef = useRef(null);

  function handleFullScreen() { window.location.hash = '/'; }
  function handleRestart() {
    try { localStorage.removeItem('modulo_build_features'); } catch {}
    setIframeKey(k => k + 1);
  }

  const handleAIFeatures = useCallback((features) => {
    const merged = { ...defaultFeatures };
    for (const [k, v] of Object.entries(features)) {
      if (typeof v === 'object' && v !== null) {
        merged[k] = { ...(merged[k] || {}), ...v };
      } else {
        merged[k] = v;
      }
    }
    try { localStorage.setItem(LS_FEATURES, JSON.stringify(merged)); } catch {}
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'SET_FEATURES', features: merged },
        window.location.origin
      );
    } catch {}
  }, []);

  return (
    <div className="proto-tab">
      <div className="proto-main">

        {/* Left: phone frame + AI prompt */}
        <div className="proto-phone-col">
          <div className="proto-top-bar">
            <Button className="proto-btn" onPress={handleFullScreen}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1.5 5V1.5H5M9 1.5h3.5V5M12.5 9v3.5H9M5 12.5H1.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Full screen
            </Button>
            <Button className="proto-btn proto-btn-ghost" onPress={handleRestart}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1.5 7A5.5 5.5 0 1 0 3.5 3M1.5 1v2.5H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Restart
            </Button>
          </div>

          <div className="proto-phone-and-ai">
            <div className="proto-frame">
              <div className="proto-notch" aria-hidden="true">
                <div className="proto-notch-pill" />
              </div>
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={window.location.origin + window.location.pathname}
                title="Modulo prototype"
                allow="same-origin"
                loading="eager"
              />
            </div>

            <AIPromptPanel onApplyFeatures={handleAIFeatures} />
          </div>
        </div>

        {/* Right: build panel */}
        <BuildPanel iframeRef={iframeRef} />

      </div>
    </div>
  );
}
