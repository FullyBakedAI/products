import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ActionsContext = createContext(null);

export function ActionsProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, tab: 'swap', asset: null });

  const openActions = useCallback(({ tab = 'swap', asset = null } = {}) => {
    setState({ isOpen: true, tab, asset });
  }, []);

  const closeActions = useCallback(() => {
    setState(s => ({ ...s, isOpen: false }));
  }, []);

  const value = useMemo(
    () => ({ ...state, openActions, closeActions }),
    [state, openActions, closeActions]
  );

  return (
    <ActionsContext.Provider value={value}>
      {children}
    </ActionsContext.Provider>
  );
}

export const useActions = () => useContext(ActionsContext);
