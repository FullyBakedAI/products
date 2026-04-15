/**
 * TokenOverrideContext — runtime CSS token editor with draft/save model.
 *
 * Model:
 *   draft    = current working edits (applied to CSS vars immediately for live preview)
 *   saved    = last explicitly saved state (persisted to localStorage)
 *   defaults = CSS values from TOKEN_DEFINITIONS
 *
 * Changes preview instantly but don't persist until saveOverrides() is called.
 * Discard reverts draft to saved state and reapplies CSS vars.
 * Themes are named snapshots of a full token set, saved separately.
 */

import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';

const STORAGE_KEY = 'bk-token-overrides';
const THEMES_KEY  = 'bk-themes';

export const TOKEN_DEFINITIONS = [
  // Brand
  { key: '--bk-brand-primary',  label: 'Brand Colour',  default: '#584BEB', group: 'Brand',    type: 'color' },

  // Surfaces
  { key: '--bk-bg-base',        label: 'Base',           default: '#0D0E17', group: 'Surfaces', type: 'color' },
  { key: '--bk-bg-card',        label: 'Card',           default: '#1A1A29', group: 'Surfaces', type: 'color' },
  { key: '--bk-bg-card-alt',    label: 'Card Alt',       default: '#1F1F33', group: 'Surfaces', type: 'color' },
  { key: '--bk-bg-nav',         label: 'Nav',            default: '#13141F', group: 'Surfaces', type: 'color' },
  { key: '--bk-bg-elevated',    label: 'Elevated',       default: '#13141F', group: 'Surfaces', type: 'color' },

  // Borders
  { key: '--bk-border-subtle',  label: 'Border Subtle',  default: '#1E1F2E', group: 'Borders',  type: 'color' },

  // Text
  { key: '--bk-text-primary',   label: 'Primary',        default: '#F5F5F6', group: 'Text',     type: 'color' },
  { key: '--bk-text-secondary', label: 'Secondary',      default: '#B3B2B8', group: 'Text',     type: 'color' },
  { key: '--bk-text-muted',     label: 'Muted',          default: '#87878C', group: 'Text',     type: 'color' },

  // Semantic
  { key: '--bk-success',        label: 'Success',        default: '#22C55E', group: 'Semantic', type: 'color' },
  { key: '--bk-error',          label: 'Error',          default: '#F04348', group: 'Semantic', type: 'color' },

  // Motion
  { key: '--bk-motion-fast',     label: 'Fast',          default: '150ms',   group: 'Motion',   type: 'duration', min: 50,  max: 600 },
  { key: '--bk-motion-standard', label: 'Standard',      default: '220ms',   group: 'Motion',   type: 'duration', min: 100, max: 800 },
  { key: '--bk-motion-slow',     label: 'Slow',          default: '350ms',   group: 'Motion',   type: 'duration', min: 150, max: 1200 },
];

export const TOKEN_GROUPS = [...new Set(TOKEN_DEFINITIONS.map(t => t.group))];

// Built-in preset themes — non-deletable, always available
export const BUILTIN_THEMES = {
  Dark: {},  // empty = all defaults (the dark theme)
  Light: {
    '--bk-bg-base':        '#F5F5FA',
    '--bk-bg-card':        '#FFFFFF',
    '--bk-bg-card-alt':    '#F0F0F8',
    '--bk-bg-nav':         '#FFFFFF',
    '--bk-bg-elevated':    '#FFFFFF',
    '--bk-border-subtle':  '#E2E3EC',
    '--bk-text-primary':   '#0D0E17',
    '--bk-text-secondary': '#4A4A58',
    '--bk-text-muted':     '#87878C',
    '--bk-success':        '#16A34A',
    '--bk-error':          '#DC2626',
  },
};

const TokenOverrideContext = createContext(null);

function applyToDOM(overrides) {
  TOKEN_DEFINITIONS.forEach(t => {
    if (overrides[t.key]) {
      document.documentElement.style.setProperty(t.key, overrides[t.key]);
    } else {
      document.documentElement.style.removeProperty(t.key);
    }
  });
}

export function TokenOverrideProvider({ children }) {
  // saved = persisted, draft = current working state
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  });
  const [draft, setDraft] = useState(saved);

  const [themes, setThemes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(THEMES_KEY)) || {}; }
    catch { return {}; }
  });

  // Apply saved overrides on mount
  useEffect(() => { applyToDOM(saved); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasDraft = useMemo(
    () => {
      const draftKeys = Object.keys(draft);
      const savedKeys = Object.keys(saved);
      if (draftKeys.length !== savedKeys.length) return true;
      return draftKeys.some(k => draft[k] !== saved[k]);
    },
    [draft, saved]
  );

  const setToken = useCallback((key, value) => {
    document.documentElement.style.setProperty(key, value);
    setDraft(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetTokenDraft = useCallback((key) => {
    const restoredValue = saved[key] ?? null;
    if (restoredValue) {
      document.documentElement.style.setProperty(key, restoredValue);
    } else {
      document.documentElement.style.removeProperty(key);
    }
    setDraft(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, [saved]);

  const saveOverrides = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setSaved(draft);
  }, [draft]);

  const discardChanges = useCallback(() => {
    applyToDOM(saved);
    setDraft(saved);
  }, [saved]);

  const resetToDefaults = useCallback(() => {
    TOKEN_DEFINITIONS.forEach(t => document.documentElement.style.removeProperty(t.key));
    localStorage.removeItem(STORAGE_KEY);
    setSaved({});
    setDraft({});
  }, []);

  const saveTheme = useCallback((name) => {
    const next = { ...themes, [name]: draft };
    localStorage.setItem(THEMES_KEY, JSON.stringify(next));
    setThemes(next);
  }, [themes, draft]);

  const loadTheme = useCallback((name) => {
    const theme = themes[name];
    if (!theme) return;
    applyToDOM(theme);
    setDraft(theme);
  }, [themes]);

  const loadBuiltinTheme = useCallback((name) => {
    const theme = BUILTIN_THEMES[name];
    if (!theme) return;
    applyToDOM(theme);
    setDraft(theme);
  }, []);

  const deleteTheme = useCallback((name) => {
    const next = { ...themes };
    delete next[name];
    localStorage.setItem(THEMES_KEY, JSON.stringify(next));
    setThemes(next);
  }, [themes]);

  const getToken = useCallback((key) => {
    return draft[key] ?? TOKEN_DEFINITIONS.find(t => t.key === key)?.default ?? '';
  }, [draft]);

  const isUnsaved = useCallback((key) => {
    return draft[key] !== saved[key];
  }, [draft, saved]);

  const isOverridden = useCallback((key) => {
    return key in draft;
  }, [draft]);

  const value = useMemo(() => ({
    draft, saved, hasDraft, themes,
    setToken, resetTokenDraft,
    saveOverrides, discardChanges, resetToDefaults,
    saveTheme, loadTheme, loadBuiltinTheme, deleteTheme,
    getToken, isOverridden, isUnsaved,
    overrides: draft,
    resetAll: resetToDefaults,
    resetToken: resetTokenDraft,
  }), [
    draft, saved, hasDraft, themes,
    setToken, resetTokenDraft,
    saveOverrides, discardChanges, resetToDefaults,
    saveTheme, loadTheme, loadBuiltinTheme, deleteTheme,
    getToken, isOverridden, isUnsaved,
  ]);

  return (
    <TokenOverrideContext.Provider value={value}>
      {children}
    </TokenOverrideContext.Provider>
  );
}

export function useTokenOverride() {
  return useContext(TokenOverrideContext);
}
