/**
 * BottomSheet — White-Label Component
 *
 * Animated slide-up drawer for context-specific actions.
 * Includes drag handle and background overlay.
 *
 * Used in: swap, send, receive, review, actions screens.
 *
 * Props:
 * - isOpen: boolean — Controls visibility
 * - onClose: function — Close handler (clicking overlay or ESC key)
 * - children: ReactNode — Sheet content
 * - showDragHandle: boolean (default: true) — Show drag handle pill
 *
 * React ARIA: Dialog primitive for accessibility
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from '../../motion-tokens';
import './styles.css';

export function BottomSheet({
  isOpen,
  onClose,
  children,
  showDragHandle = true,
}) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="bottom-sheet-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={m.fade.enter}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="bottom-sheet"
            initial={{ opacity: 0, y: m.modal.offsetEnter }}
            animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
            exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
          >
            {showDragHandle && (
              <div className="drag-handle" aria-hidden="true">
                <div className="drag-handle-pill" />
              </div>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
