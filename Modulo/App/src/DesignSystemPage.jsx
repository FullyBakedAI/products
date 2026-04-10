/**
 * DesignSystemPage — shell with tab navigation.
 * Tabs: Brand | Studio | Rules | Agentic Guide
 * Route: rendered when hash === #/ds (outside HashRouter)
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTokenOverride } from './TokenOverrideContext';
import BrandTab        from './ds/BrandTab';
import StudioTab       from './ds/StudioTab';
import RulesTab        from './ds/RulesTab';
import AgenticGuideTab from './ds/AgenticGuideTab';
import logoModulo      from './assets/logo-modulo.svg';
import './ds/ds-page.css';

const NAV_ITEMS = [
  { id: 'brand',  label: 'Brand' },
  { id: 'studio', label: 'Studio' },
  { id: 'rules',  label: 'Rules' },
  { id: 'brief',  label: 'Agentic Guide' },
];

export default function DesignSystemPage() {
  const { hasDraft, draft, saveOverrides, discardChanges, getToken } = useTokenOverride();
  const [activeSection, setActiveSection] = useState('brand');
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
    brand:  <BrandTab />,
    studio: <StudioTab />,
    rules:  <RulesTab />,
    brief:  <AgenticGuideTab />,
  };

  // Studio tab has its own full-height layout — don't overflow-scroll on that tab
  const studioActive = activeSection === 'studio';

  return (
    <div className="ds-page">

      {/* ── Header ── */}
      <header className="ds-header">
        <div className="ds-header-left">
          <img src={logoModulo} alt="Modulo" height="14" style={{ opacity: 0.55 }} />
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--bk-brand-primary)', opacity: 0.7, marginLeft: 8 }}>v3.0</span>
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
                <button className="ds-discard-btn" onClick={discardChanges}>Discard</button>
                <button className="ds-save-btn" onClick={saveOverrides} style={{ background: brand }}>
                  Save
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <nav className="ds-tab-bar">
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            className={`ds-tab-item${activeSection === id ? ' active' : ''}`}
            onClick={() => setActiveSection(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <main
        className="ds-content"
        style={studioActive ? { overflow: 'hidden' } : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="ds-content-inner"
          >
            {SECTIONS[activeSection]}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
