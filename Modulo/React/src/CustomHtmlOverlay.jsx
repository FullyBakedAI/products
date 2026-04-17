/**
 * CustomHtmlOverlay — renders AI-generated HTML/CSS inside the prototype.
 *
 * Activated by:
 *   - postMessage: { type: 'SET_CUSTOM_HTML', html, css, position }
 *   - localStorage: 'modulo_custom_html' JSON with same shape
 *
 * Positions:
 *   'overlay'  — full-screen layer over everything (default)
 *   'banner'   — sticky strip at top of phone frame
 *   'screen'   — fills the phone frame like a screen
 */

import { useState, useEffect, useRef } from 'react';

const LS_KEY = 'modulo_custom_html';
const BC = new BroadcastChannel('modulo-updates');

function readStored() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; } catch { return null; }
}

export default function CustomHtmlOverlay() {
  const [state, setState] = useState(readStored);
  const styleRef = useRef(null);

  // Inject / update <style> when CSS changes
  useEffect(() => {
    if (!state?.css) {
      if (styleRef.current) { styleRef.current.remove(); styleRef.current = null; }
      return;
    }
    if (!styleRef.current) {
      const el = document.createElement('style');
      el.id = 'custom-html-overlay-css';
      document.head.appendChild(el);
      styleRef.current = el;
    }
    styleRef.current.textContent = state.css;
    return () => {
      if (styleRef.current) { styleRef.current.remove(); styleRef.current = null; }
    };
  }, [state?.css]);

  // Listen for BroadcastChannel messages from DS page
  useEffect(() => {
    function onMessage(e) {
      if (e.data?.type === 'SET_CUSTOM_HTML') {
        const next = e.data.payload ?? null;
        setState(next);
        if (next) {
          try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
        } else {
          try { localStorage.removeItem(LS_KEY); } catch {}
        }
      }
    }
    BC.addEventListener('message', onMessage);
    return () => BC.removeEventListener('message', onMessage);
  }, []);

  // Listen for localStorage changes (same-origin cross-frame)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === LS_KEY) {
        try { setState(e.newValue ? JSON.parse(e.newValue) : null); } catch {}
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function dismiss() {
    setState(null);
    try { localStorage.removeItem(LS_KEY); } catch {}
    try { window.parent.postMessage({ type: 'CUSTOM_HTML_DISMISSED' }, '*'); } catch {}
  }

  if (!state?.html) return null;

  const position = state.position ?? 'overlay';

  if (position === 'banner') {
    return (
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        background: 'var(--bk-bg-card)', borderBottom: '1px solid var(--bk-border-subtle)',
      }}>
        <button
          onClick={dismiss}
          style={{
            position: 'absolute', top: 4, right: 8, background: 'none', border: 'none',
            color: 'var(--bk-text-muted)', fontSize: 16, cursor: 'pointer', lineHeight: 1,
          }}
          aria-label="Dismiss"
        >×</button>
        <div dangerouslySetInnerHTML={{ __html: state.html }} />
      </div>
    );
  }

  // overlay / screen — full coverage
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 20,
      background: position === 'screen' ? 'var(--bk-bg-base)' : 'var(--bk-overlay, rgba(13,14,23,0.88))',
      backdropFilter: position === 'overlay' ? 'blur(4px)' : 'none',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Dismiss button */}
      <button
        onClick={dismiss}
        style={{
          position: 'absolute', top: 12, right: 16, zIndex: 1,
          background: 'var(--bk-white-12)', border: '1px solid var(--bk-white-15)',
          borderRadius: 20, color: 'var(--bk-text-primary)', fontSize: 13,
          padding: '4px 12px', cursor: 'pointer', fontFamily: 'var(--bk-font)',
        }}
        aria-label="Dismiss"
      >
        ✕ Close
      </button>

      {/* Content */}
      <div
        style={{ flex: 1, overflow: 'auto', padding: '48px 0 0' }}
        dangerouslySetInnerHTML={{ __html: state.html }}
      />
    </div>
  );
}
