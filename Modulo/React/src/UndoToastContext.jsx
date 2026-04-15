/**
 * UndoToastContext — global toast trigger for one-tap undo (Feature 7)
 * Any screen can call showUndo(message, onUndoCallback) to surface the toast.
 */

import { createContext, useContext, useMemo, useRef, useState, useCallback } from 'react';

const UndoToastContext = createContext(null);

export function UndoToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const idRef = useRef(0);

  const showUndo = useCallback((message, onUndo = () => {}) => {
    setToast({ message, onUndo, id: ++idRef.current });
  }, []);

  const dismiss = useCallback(() => {
    setToast(null);
  }, []);

  const value = useMemo(
    () => ({ showUndo, dismiss, toast }),
    [showUndo, dismiss, toast]
  );

  return (
    <UndoToastContext.Provider value={value}>
      {children}
    </UndoToastContext.Provider>
  );
}

export function useUndoToast() {
  return useContext(UndoToastContext);
}
