import { createContext, useContext, useState, useEffect } from 'react';
import { defaultFeatures } from '../config/features';

const LS_KEY = 'modulo_build_features';

const FeatureConfigContext = createContext(defaultFeatures);

export function FeatureConfigProvider({ config = defaultFeatures, children }) {
  const [liveFeatures, setLiveFeatures] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // Listen for postMessage from DS page (PrototypeTab build panel)
  useEffect(() => {
    function onMessage(e) {
      if (e.data?.type === 'SET_FEATURES' && e.data.features) {
        setLiveFeatures(e.data.features);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Also listen for localStorage changes (cross-frame, same origin)
  useEffect(() => {
    function onStorage(e) {
      if (e.key === LS_KEY && e.newValue) {
        try { setLiveFeatures(JSON.parse(e.newValue)); } catch {}
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Deep merge: client overrides only what they specify
  const base = liveFeatures ?? config;
  const resolved = {
    nav:     { ...defaultFeatures.nav,     ...base.nav },
    home:    { ...defaultFeatures.home,    ...base.home },
    actions: { ...defaultFeatures.actions, ...base.actions },
    defi:    { ...defaultFeatures.defi,    ...base.defi },
    notifications:    base.notifications    ?? defaultFeatures.notifications,
    walletConnection: base.walletConnection ?? defaultFeatures.walletConnection,
    undoToast:        base.undoToast        ?? defaultFeatures.undoToast,
  };

  return (
    <FeatureConfigContext.Provider value={{ ...resolved, setFeatures: setLiveFeatures }}>
      {children}
    </FeatureConfigContext.Provider>
  );
}

export function useFeatures() {
  return useContext(FeatureConfigContext);
}
