import { createContext, useContext, useState, useEffect } from 'react';
import { defaultFeatures } from '../config/features';

const FeatureConfigContext = createContext(defaultFeatures);

export function FeatureConfigProvider({ config = defaultFeatures, children }) {
  const [liveFeatures, setLiveFeatures] = useState(() => {
    try {
      const stored = localStorage.getItem('modulo_build_features');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // Listen for feature updates broadcast from the BuildPanel / BuildTab in the DS viewer
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const bc = new BroadcastChannel('modulo-updates');
    bc.onmessage = (e) => {
      if (e.data?.type === 'SET_FEATURES' && e.data.features) {
        setLiveFeatures(e.data.features);
      }
    };
    return () => bc.close();
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
