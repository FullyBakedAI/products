import { StrictMode, Component, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import DesignSystemPage from './DesignSystemPage.jsx';
import { TokenOverrideProvider } from './TokenOverrideContext.jsx';
import { IconOverrideProvider } from './IconOverrideContext.jsx';
import { DevModeProvider } from './DevModeContext.jsx';
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
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const isDS = hash === '#/ds' || hash.startsWith('#/ds/');

  return (
    <TokenOverrideProvider>
    <IconOverrideProvider>
    <DevModeProvider>
      {isDS
        ? <DesignSystemPage onBack={() => { window.location.hash = '/'; }} />
        : (
          <HashRouter>
            <App />
          </HashRouter>
        )
      }
    </DevModeProvider>
    </IconOverrideProvider>
    </TokenOverrideProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </StrictMode>
);
