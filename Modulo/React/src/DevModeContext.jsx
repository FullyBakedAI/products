import { createContext, useContext, useMemo, useState } from 'react';

const DevModeContext = createContext(false);

export function DevModeProvider({ children }) {
  const [devMode, setDevMode] = useState(false);
  const value = useMemo(() => ({ devMode, setDevMode }), [devMode]);
  return (
    <DevModeContext.Provider value={value}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  return useContext(DevModeContext);
}
