/**
 * DataOverrideContext — flat key-value store for AI-injectable prototype data.
 * Any screen can call useData(key, defaultValue) to get an overrideable value.
 * AI writes via localStorage 'modulo_data_overrides' + BroadcastChannel SET_DATA.
 */
import { createContext, useContext, useState, useEffect } from 'react';

const LS_KEY = 'modulo_data_overrides';
const BC = new BroadcastChannel('modulo-updates');

const DataOverrideContext = createContext({});

function loadOverrides() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}

export function DataOverrideProvider({ children }) {
  const [overrides, setOverrides] = useState(loadOverrides);

  useEffect(() => {
    const handler = e => {
      if (e.data?.type === 'SET_DATA') {
        const next = { ...loadOverrides(), ...e.data.data };
        try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
        setOverrides(next);
      }
    };
    BC.addEventListener('message', handler);
    return () => BC.removeEventListener('message', handler);
  }, []);

  return (
    <DataOverrideContext.Provider value={overrides}>
      {children}
    </DataOverrideContext.Provider>
  );
}

/** Get an overrideable value. Returns override if set, else defaultValue. */
export function useData(key, defaultValue) {
  const overrides = useContext(DataOverrideContext);
  return key in overrides ? overrides[key] : defaultValue;
}
