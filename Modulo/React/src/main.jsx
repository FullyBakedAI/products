import { StrictMode, Component, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import DesignSystemPage from './DesignSystemPage.jsx';
import PasswordGate from './PasswordGate.jsx';
import { TokenOverrideProvider } from './TokenOverrideContext.jsx';
import { IconOverrideProvider } from './IconOverrideContext.jsx';
import { DevModeProvider } from './DevModeContext.jsx';
import { BrandProvider } from './theme/ThemeProvider.jsx';
import moduloTheme from './theme/modulo-theme.js';
import './tokens.css';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ position:'fixed', inset:0, background:'#0D0E17', color:'#F04348', padding:'32px', fontFamily:'monospace', fontSize:'13px', lineHeight:1.6, overflow:'auto', zIndex:9999 }}>
          <strong>Render Error</strong><br /><br />
          {this.state.error.message}<br /><br />
          <pre style={{ whiteSpace:'pre-wrap', color:'#B3B2B8' }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Top-level router split — DS page lives outside HashRouter so it can own
// its own router context for the phone preview. Everything else uses HashRouter.
function Root() {
  // Restore last route on PWA launch (start_url always resets to /modulo/).
  // On browser refresh the hash is already in the URL — this is a no-op.
  const [hash, setHash] = useState(() => {
    const current = window.location.hash;
    // Only redirect to DS when we're the top-level page, not inside an iframe
    const isTopFrame = window.self === window.top;
    if (isTopFrame && (!current || current === '#' || current === '#/')) {
      window.location.hash = '/ds';
      return '#/ds';
    }
    return current;
  });

  useEffect(() => {
    const handler = () => {
      const h = window.location.hash;
      setHash(h);
      if (!h.startsWith('#/ds')) localStorage.setItem('modulo_route', h);
    };
    window.addEventListener('hashchange', handler);
    // Save current route on mount too
    if (window.location.hash && !window.location.hash.startsWith('#/ds')) localStorage.setItem('modulo_route', window.location.hash);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const isDS = hash === '#/ds' || hash.startsWith('#/ds/');

  return (
    <BrandProvider theme={moduloTheme}>
      <TokenOverrideProvider>
      <IconOverrideProvider>
      <DevModeProvider>
        {isDS
          ? <PasswordGate><DesignSystemPage onBack={() => { window.location.hash = '/'; }} /></PasswordGate>
          : (
            <HashRouter>
              <App />
            </HashRouter>
          )
        }
      </DevModeProvider>
      </IconOverrideProvider>
      </TokenOverrideProvider>
    </BrandProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </StrictMode>
);
