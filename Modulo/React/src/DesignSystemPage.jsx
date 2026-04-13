/**
 * DesignSystemPage — client-facing deliverable shell.
 * Tabs: Prototype | Build | Brand | Components | Rules | Agentic Guide
 * Route: rendered when hash === #/ds (outside HashRouter)
 * Default tab: prototype
 */
import { useState, useEffect } from 'react';
import { Button } from 'react-aria-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTokenOverride } from './TokenOverrideContext';
import { FeatureConfigProvider } from './theme/FeatureConfig';
import PrototypeTab    from './ds/PrototypeTab';
import BuildTab        from './ds/BuildTab';
import BrandTab        from './ds/BrandTab';
import StudioTab       from './ds/StudioTab';
import RulesTab        from './ds/RulesTab';
import AgenticGuideTab from './ds/AgenticGuideTab';
import logoModulo      from './assets/logo-modulo.svg';
import './ds/ds-page.css';

const NAV_ITEMS = [
  { id: 'prototype', label: 'Prototype' },
  { id: 'build',     label: 'Build',          cta: true },
  { id: 'brand',     label: 'Brand' },
  { id: 'studio',    label: 'Components' },
  { id: 'rules',     label: 'Rules' },
  { id: 'brief',     label: 'Agentic Guide' },
];

const VALID_TABS = new Set(NAV_ITEMS.map(n => n.id));

function tabFromHash() {
  const part = window.location.hash.replace('#/ds', '').replace(/^\//, '');
  return VALID_TABS.has(part) ? part : 'prototype';
}

export default function DesignSystemPage() {
  const { hasDraft, draft, saveOverrides, discardChanges, getToken } = useTokenOverride();
  const [activeSection, setActiveSection] = useState(tabFromHash);

  // Keep tab in sync with browser back/forward
  useEffect(() => {
    const handler = () => setActiveSection(tabFromHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  function navigateTab(id) {
    setActiveSection(id);
    window.location.hash = id === 'prototype' ? '/ds' : `/ds/${id}`;
  }
  const draftCount = Object.keys(draft).length;
  const brand      = getToken('--bk-brand-primary');

  // Override viewport so DS page isn't locked to 390px phone width
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const original = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    return () => { if (meta && original) meta.setAttribute('content', original); };
  }, []);

  const SECTIONS = {
    prototype: <PrototypeTab />,
    build:     <BuildTab />,
    brand:     <BrandTab />,
    studio:    <StudioTab />,
    rules:     <RulesTab />,
    brief:     <AgenticGuideTab />,
  };

  // Prototype + Studio tabs have full-height layouts — suppress overflow-scroll
  const fullHeightTab = activeSection === 'studio' || activeSection === 'prototype';

  return (
    <FeatureConfigProvider>
    <div className="ds-page">

      {/* ── Header ── */}
      <header className="ds-header">
        <div className="ds-header-left">
          <img src={logoModulo} alt="Modulo" height="14" style={{ opacity: 0.55 }} />
          <span className="ds-header-title">Product Library</span>
        </div>
        <div className="ds-header-right">
          <AnimatePresence>
            {hasDraft && (
              <motion.div
                className="ds-save-bar-inline"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
              >
                <span className="ds-save-bar-inline-label">
                  {draftCount} unsaved
                </span>
                <Button className="ds-discard-btn" onPress={discardChanges}>Discard</Button>
                <Button className="ds-save-btn" onPress={saveOverrides} style={{ background: brand }}>
                  Save
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <nav className="ds-tab-bar">
        {NAV_ITEMS.map(({ id, label, cta }) => (
          <Button
            key={id}
            className={`ds-tab-item${activeSection === id ? ' active' : ''}${cta ? ' ds-tab-cta' : ''}`}
            onPress={() => navigateTab(id)}
          >
            {cta && (
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M11 3L4 11H10L9 17L16 9H10L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
              </svg>
            )}
            {label}
          </Button>
        ))}
      </nav>

      {/* ── Content ── */}
      <main
        className="ds-content"
        style={fullHeightTab ? { overflow: 'hidden' } : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="ds-content-inner"
            style={fullHeightTab ? { height: '100%' } : undefined}
          >
            {SECTIONS[activeSection]}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
    </FeatureConfigProvider>
  );
}
