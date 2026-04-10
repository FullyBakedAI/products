/**
 * UndoToastContext — global toast trigger for one-tap undo (Feature 7)
 * Any screen can call showUndo(message, onUndoCallback) to surface the toast.
 */

import { createContext, useContext, useState, useCallback } from 'react';

const UndoToastContext = createContext(null);

export function UndoToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showUndo = useCallback((message, onUndo = () => {}) => {
    setToast({ message, onUndo, id: Date.now() });
  }, []);

  const dismiss = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <UndoToastContext.Provider value={{ showUndo, dismiss, toast }}>
      {children}
    </UndoToastContext.Provider>
  );
}

export function useUndoToast() {
  return useContext(UndoToastContext);
}
