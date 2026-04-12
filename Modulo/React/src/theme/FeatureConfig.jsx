import { createContext, useContext } from 'react';
import { defaultFeatures } from '../config/features';

const FeatureConfigContext = createContext(defaultFeatures);

export function FeatureConfigProvider({ config = defaultFeatures, children }) {
  // Deep merge: client overrides only what they specify
  const merged = {
    nav:     { ...defaultFeatures.nav,     ...config.nav },
    home:    { ...defaultFeatures.home,    ...config.home },
    actions: { ...defaultFeatures.actions, ...config.actions },
    defi:    { ...defaultFeatures.defi,    ...config.defi },
    notifications:    config.notifications    ?? defaultFeatures.notifications,
    walletConnection: config.walletConnection ?? defaultFeatures.walletConnection,
    undoToast:        config.undoToast        ?? defaultFeatures.undoToast,
  };
  return (
    <FeatureConfigContext.Provider value={merged}>
      {children}
    </FeatureConfigContext.Provider>
  );
}

export function useFeatures() {
  return useContext(FeatureConfigContext);
}
