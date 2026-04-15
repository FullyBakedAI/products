import { createContext, useContext, useMemo, useState } from 'react';

const AutopilotContext = createContext(null);

export function AutopilotProvider({ children }) {
  const [active, setActive] = useState(true);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return (
    <AutopilotContext.Provider value={value}>
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot() {
  const ctx = useContext(AutopilotContext);
  if (!ctx) throw new Error('useAutopilot must be inside AutopilotProvider');
  return ctx;
}
