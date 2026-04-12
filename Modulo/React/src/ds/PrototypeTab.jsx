/**
 * PrototypeTab — live app embedded in a CSS phone frame.
 * Shows the running prototype via iframe pointing to /.
 * PasswordGate must use localStorage (not sessionStorage) so auth
 * persists inside the iframe.
 */
import { useRef } from 'react';
import './PrototypeTab.css';

export default function PrototypeTab() {
  const iframeRef = useRef(null);

  function handleFullScreen() {
    window.location.hash = '/';
  }

  function handleNewTab() {
    window.open(window.location.origin + window.location.pathname, '_blank');
  }

  return (
    <div className="proto-tab">
      {/* Top bar */}
      <div className="proto-top-bar">
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

      {/* Phone frame + iframe */}
      <div className="proto-stage">
        <div className="proto-frame">
          {/* Notch chrome */}
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

        {/* Hint */}
        <p className="proto-hint">
          Press <strong>⚡ Build</strong> in the app to open the MVP builder
        </p>
      </div>
    </div>
  );
}
