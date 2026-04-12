import { createContext, useContext, useState } from 'react';
import { defaultFeatures } from '../config/features';

const FeatureConfigContext = createContext(defaultFeatures);

export function FeatureConfigProvider({ config = defaultFeatures, children }) {
  const [liveFeatures, setLiveFeatures] = useState(null);

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
