/**
 * AIPanel — Claude Code-style AI panel for the Modulo prototype.
 * Props: { features, onFeaturesChange, onReload, onVersion, currentScreen }
 */
import { useRef, useState, useEffect } from 'react';
import './AIPanel.css';

const LS_THREADS  = 'modulo_ai_threads';
const LS_TOKENS   = 'bk-token-overrides';
const LS_FEATURES = 'modulo_build_features';
const LS_CUSTOM   = 'modulo_custom_html';

const BC = new BroadcastChannel('modulo-updates');

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadThreads() {
  try {
    const raw = localStorage.getItem(LS_THREADS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [makeThread()];
}

function saveThreads(threads) {
  try { localStorage.setItem(LS_THREADS, JSON.stringify(threads)); } catch {}
}

function makeThread() {
  return { id: `t-${Date.now()}`, name: 'New chat', messages: [], createdAt: Date.now() };
}

function currentTokens() {
  try { return JSON.parse(localStorage.getItem(LS_TOKENS) || '{}'); } catch { return {}; }
}

function currentNudges() {
  try {
    const raw = localStorage.getItem('modulo_nudge_data');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function msgId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Markdown renderer ─────────────────────────────────────────────────────────

function parseInline(text) {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    } else {
      parts.push(<code key={match.index} className="ai-md-code">{token.slice(1, -1)}</code>);
    }
    last = match.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function RenderMarkdown({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  const nodes = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('- ') || line.startsWith('• ')) {
      // Collect consecutive bullet lines
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('• '))) {
        items.push(lines[i].replace(/^[-•]\s/, ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="ai-md-list">
          {items.map((item, j) => <li key={j}>{parseInline(item)}</li>)}
        </ul>
      );
    } else {
      if (line.trim()) {
        nodes.push(<p key={i}>{parseInline(line)}</p>);
      } else if (nodes.length > 0) {
        // skip empty lines between blocks
      }
      i++;
    }
  }
  return <>{nodes}</>;
}

// ── Screen label ──────────────────────────────────────────────────────────────

const SCREEN_LABELS = {
  '/':            'Home',
  '/explore':     'Explore',
  '/activity':    'Activity',
  '/autopilot':   'Autopilot',
  '/swap':        'Swap',
  '/send':        'Send',
  '/send/amount': 'Send Amount',
  '/receive':     'Receive',
  '/review':      'Review',
  '/success':     'Success',
  '/optimise':    'Optimise',
  '/settings':    'Settings',
  '/manage':      'Manage',
  '/simulate':    'Simulate',
  '/achievements':'Achievements',
};

function screenLabel(path) {
  if (!path) return 'Home';
  if (path.startsWith('/asset/')) return 'Asset';
  if (path.startsWith('/swap/select/')) return 'Select Token';
  return SCREEN_LABELS[path] ?? path;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AIPanel({ features, onFeaturesChange, onReload, onVersion, currentScreen = '/' }) {
  const [threads, setThreads]   = useState(loadThreads);
  const [activeId, setActiveId] = useState(() => loadThreads()[0]?.id ?? null);
  const [input, setInput]       = useState('');
  const [images, setImages]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const fileInputRef   = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  const activeThread = threads.find(t => t.id === activeId) ?? threads[0] ?? null;

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages?.length, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, [input]);

  // ── Apply helpers ──────────────────────────────────────────────────

  function applyTokens(tokens) {
    if (!tokens || !Object.keys(tokens).length) return;
    const merged = { ...currentTokens(), ...tokens };
    try { localStorage.setItem(LS_TOKENS, JSON.stringify(merged)); } catch {}
    Object.entries(tokens).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    BC.postMessage({ type: 'SET_TOKENS', tokens: merged });
  }

  function applyFeatures(partial) {
    if (!partial || !Object.keys(partial).length) return;
    const merged = { ...features };
    for (const [k, v] of Object.entries(partial)) {
      merged[k] = (v && typeof v === 'object' && !Array.isArray(v))
        ? { ...(features[k] || {}), ...v }
        : v;
    }
    onFeaturesChange(merged);
    try { localStorage.setItem(LS_FEATURES, JSON.stringify(merged)); } catch {}
    BC.postMessage({ type: 'SET_FEATURES', features: merged });
  }

  function applyCustomHtml(payload) {
    try {
      if (payload) localStorage.setItem(LS_CUSTOM, JSON.stringify(payload));
      else localStorage.removeItem(LS_CUSTOM);
    } catch {}
    BC.postMessage({ type: 'SET_CUSTOM_HTML', payload });
  }

  function applyNudges(nudges) {
    if (!nudges) return;
    try { localStorage.setItem('modulo_nudge_data', JSON.stringify(nudges)); } catch {}
    BC.postMessage({ type: 'SET_NUDGES', nudges });
  }

  function applyData(data) {
    if (!data || !Object.keys(data).length) return;
    let existing = {};
    try { existing = JSON.parse(localStorage.getItem('modulo_data_overrides') || '{}'); } catch {}
    const merged = { ...existing, ...data };
    try { localStorage.setItem('modulo_data_overrides', JSON.stringify(merged)); } catch {}
    BC.postMessage({ type: 'SET_DATA', data });
  }

  // ── Thread CRUD ────────────────────────────────────────────────────

  function updateThreads(fn) {
    setThreads(prev => { const next = fn(prev); saveThreads(next); return next; });
  }

  function newThread() {
    const t = makeThread();
    updateThreads(prev => [t, ...prev]);
    setActiveId(t.id);
    setError(null);
  }

  function deleteThread(id, e) {
    e.stopPropagation();
    updateThreads(prev => {
      const next = prev.filter(t => t.id !== id);
      if (next.length === 0) { const fresh = makeThread(); setActiveId(fresh.id); return [fresh]; }
      if (activeId === id) setActiveId(next[0].id);
      return next;
    });
  }

  function addMessage(threadId, msg) {
    updateThreads(prev => prev.map(t => {
      if (t.id !== threadId) return t;
      const isFirst = t.messages.length === 0 && msg.role === 'user';
      const name = isFirst
        ? (typeof msg.content === 'string' ? msg.content : msg.content?.find?.(c => c.type === 'text')?.text ?? t.name).slice(0, 40)
        : t.name;
      return { ...t, name, messages: [...t.messages, msg] };
    }));
  }

  // ── Image handling ─────────────────────────────────────────────────

  function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file || images.length >= 4) return;
        const reader = new FileReader();
        reader.onload = ev => {
          const dataUrl = ev.target.result;
          const mediaType = dataUrl.match(/data:([^;]+);/)?.[1] ?? 'image/jpeg';
          setImages(prev => prev.length < 4 ? [...prev, { dataUrl, mediaType }] : prev);
        };
        reader.readAsDataURL(file);
        return;
      }
    }
  }

  function handleFileSelect(e) {
    const files = Array.from(e.target.files ?? []).slice(0, 4 - images.length);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        const dataUrl = ev.target.result;
        const mediaType = dataUrl.match(/data:([^;]+);/)?.[1] ?? 'image/jpeg';
        setImages(prev => prev.length < 4 ? [...prev, { dataUrl, mediaType }] : prev);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  // ── Build API messages ─────────────────────────────────────────────

  function buildApiMessages(thread, userText, userImages) {
    const history = (thread?.messages ?? []).slice(-20);
    const apiMsgs = history.map(m =>
      m.role === 'user'
        ? { role: 'user', content: m.content }
        : { role: 'assistant', content: m.content }
    );
    let userContent;
    if (userImages.length > 0) {
      userContent = [
        ...userImages.map(img => ({
          type: 'image',
          source: { type: 'base64', media_type: img.mediaType, data: img.dataUrl.split(',')[1] },
        })),
        { type: 'text', text: userText },
      ];
    } else {
      userContent = userText;
    }
    apiMsgs.push({ role: 'user', content: userContent });
    return apiMsgs;
  }

  // ── Submit ─────────────────────────────────────────────────────────

  async function submit() {
    const text = input.trim();
    if (!text || loading || !activeThread) return;

    const threadId   = activeThread.id;
    const snapImages = [...images];

    const userMsg = {
      id:      msgId(),
      role:    'user',
      content: snapImages.length > 0
        ? [
            ...snapImages.map(img => ({
              type: 'image',
              source: { type: 'base64', media_type: img.mediaType, data: img.dataUrl.split(',')[1] },
            })),
            { type: 'text', text },
          ]
        : text,
      images: snapImages.map(img => img.dataUrl),
    };
    addMessage(threadId, userMsg);
    setInput('');
    setImages([]);
    setLoading(true);
    setError(null);

    try {
      const apiMessages = buildApiMessages(activeThread, text, snapImages);
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages:        apiMessages,
          mode:            'build',
          currentFeatures: features,
          currentTokens:   currentTokens(),
          currentNudges:   currentNudges(),
          currentData:     (() => { try { return JSON.parse(localStorage.getItem('modulo_data_overrides') || '{}'); } catch { return {}; } })(),
          currentScreen,
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      let applied = false;

      if (data.features)           applyFeatures(data.features);
      if (data.tokens)             applyTokens(data.tokens);
      if (data.nudges)             applyNudges(data.nudges);
      if (data.data)               applyData(data.data);
      applyCustomHtml(data.custom ?? null);
      applied = !!(data.features || data.tokens || data.custom || data.nudges || data.data);

      if (applied) {
        const snapshotTokens = currentTokens();
        onVersion?.({
          id:        `v-${Date.now()}`,
          timestamp: Date.now(),
          label:     data.message || 'AI build',
          features,
          tokens:    snapshotTokens,
          customHtml: data.custom ?? null,
        });
        onReload();
      }

      addMessage(threadId, { id: msgId(), role: 'assistant', content: data.message || 'Done.', applied });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  }

  const screenName = screenLabel(currentScreen);
  const canSend = !loading && (!!input.trim() || images.length > 0);

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="ai-panel">

      {/* Header */}
      <div className="ai-panel-header">
        <div className="ai-panel-header-row">
          <span className="ai-panel-title">Modulo AI</span>
          <span className="ai-screen-pill">{screenName}</span>
        </div>
      </div>

      {/* Thread list */}
      <div className="ai-threads">
        {threads.map(t => (
          <div key={t.id} className="ai-thread-row">
            <button
              className={`ai-thread-item${t.id === activeId ? ' is-active' : ''}`}
              onClick={() => { setActiveId(t.id); setError(null); }}
              title={t.name}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="ai-thread-icon" aria-hidden="true">
                <path d="M1 1h9v7H6.5L4 9.5V8H1V1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
              </svg>
              {t.name}
            </button>
            <button className="ai-thread-delete" onClick={e => deleteThread(t.id, e)} aria-label="Delete thread">×</button>
          </div>
        ))}
        <button className="ai-new-thread-btn" onClick={newThread}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          New thread
        </button>
      </div>

      {/* Messages */}
      <div className="ai-messages">
        {(!activeThread || activeThread.messages.length === 0) && !loading && (
          <div className="ai-empty-state">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="ai-empty-icon" aria-hidden="true">
              <rect x="1" y="1" width="26" height="26" rx="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M7 10h14M7 14h10M7 18h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span>Describe a change to the {screenName} screen</span>
            <span className="ai-empty-hint">⌘ Enter to send</span>
          </div>
        )}

        {(activeThread?.messages ?? []).map(msg => (
          <div key={msg.id} className={`ai-msg ai-msg-${msg.role}`}>
            <div className="ai-msg-label">
              {msg.role === 'user' ? 'You' : 'Modulo AI'}
            </div>

            {msg.role === 'user' && msg.images?.length > 0 && (
              <div className="ai-msg-images">
                {msg.images.map((src, i) => (
                  <img key={i} src={src} alt="" className="ai-msg-thumb" />
                ))}
              </div>
            )}

            <div className="ai-msg-body">
              {msg.role === 'assistant'
                ? <RenderMarkdown text={typeof msg.content === 'string' ? msg.content : msg.content?.find?.(c => c.type === 'text')?.text ?? ''} />
                : (typeof msg.content === 'string' ? msg.content : msg.content?.find?.(c => c.type === 'text')?.text ?? '')
              }
            </div>

            {msg.role === 'assistant' && msg.applied && (
              <div className="ai-msg-applied">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                  <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Applied to prototype
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="ai-msg ai-msg-assistant">
            <div className="ai-msg-label">Modulo AI</div>
            <div className="ai-thinking">
              <span className="ai-thinking-text">Thinking</span>
              <span className="ai-thinking-dots"><span/><span/><span/></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && <div className="ai-error">{error}</div>}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="ai-image-previews">
          {images.map((img, i) => (
            <div key={i} className="ai-preview-wrap">
              <img src={img.dataUrl} alt="" className="ai-preview-thumb" />
              <button className="ai-preview-remove" onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} aria-label="Remove">×</button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="ai-input-area">
        <textarea
          ref={textareaRef}
          className="ai-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          onPaste={handlePaste}
          placeholder={`Ask anything about ${screenName}…`}
          rows={1}
          disabled={loading}
        />
        <div className="ai-input-row">
          <button
            className="ai-attach-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || images.length >= 4}
            aria-label="Attach image"
            title="Attach image"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 10.5L5 7.5L7 9.5L9.5 6.5L12 10.5H2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
              <circle cx="5" cy="4.5" r="1.2" stroke="currentColor" strokeWidth="1.3"/>
              <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" fill="none"/>
            </svg>
          </button>
          <span className="ai-shortcut-hint">⌘ Enter</span>
          <button
            className="ai-send-btn"
            onClick={submit}
            disabled={!canSend}
            aria-label="Send"
          >
            {loading
              ? <svg width="12" height="12" viewBox="0 0 12 12" className="ai-spin"><circle cx="6" cy="6" r="4" stroke="rgba(255,255,255,0.25)" strokeWidth="2" fill="none"/><circle cx="6" cy="6" r="4" stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="10 14" strokeLinecap="round"/></svg>
              : <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M1.5 6.5H11.5M11.5 6.5L7 2M11.5 6.5L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            }
          </button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFileSelect} />
    </div>
  );
}
