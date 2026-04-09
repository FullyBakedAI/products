import { createContext, useCallback, useContext, useState } from 'react';

const ActionsContext = createContext(null);

export function ActionsProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, tab: 'swap', asset: null });

  const openActions = useCallback(({ tab = 'swap', asset = null } = {}) => {
    setState({ isOpen: true, tab, asset });
  }, []);

  const closeActions = useCallback(() => {
    setState(s => ({ ...s, isOpen: false }));
  }, []);

  return (
    <ActionsContext.Provider value={{ ...state, openActions, closeActions }}>
      {children}
    </ActionsContext.Provider>
  );
}

export const useActions = () => useContext(ActionsContext);
