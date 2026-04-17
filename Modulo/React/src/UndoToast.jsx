/**
 * UndoToast — top toast with SVG countdown ring (Feature 7)
 * Slides down from top after any transaction. Depletes over 30s.
 * Tapping "Undo" reverses the action and shows "Reversed ✓".
 */

import { useEffect, useState, useRef } from 'react';
import { Button } from 'react-aria-components';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m, toast as toastAnim } from './motion-tokens';
import { useUndoToast } from './UndoToastContext';
import { useFeatures } from './theme/FeatureConfig';
import './undo-toast.css';

const COUNTDOWN_SECS = 30;
const RING_R = 13;
const RING_CIRC = 2 * Math.PI * RING_R;

export default function UndoToast() {
  const f = useFeatures();
  const { toast, dismiss } = useUndoToast();
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECS);
  const [undone, setUndone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!toast) return;
    setTimeLeft(COUNTDOWN_SECS);
    setUndone(false);

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          dismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [toast?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleUndo() {
    clearInterval(intervalRef.current);
    toast?.onUndo?.();
    setUndone(true);
    setTimeout(dismiss, 1600);
  }

  const dashOffset = RING_CIRC * (1 - timeLeft / COUNTDOWN_SECS);

  return f.undoToast ? (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="undo-toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          aria-label={undone ? 'Action reversed' : toast.message}
          initial={toastAnim.initial}
          animate={toastAnim.animate}
          exit={toastAnim.exit}
        >
          <span className="undo-message">
            {undone ? 'Reversed ✓' : toast.message}
          </span>

          {!undone && (
            <Button
              className="undo-ring-btn"
              onPress={handleUndo}
              aria-label={`Undo — ${timeLeft} seconds remaining`}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                aria-hidden="true"
              >
                {/* Track */}
                <circle
                  cx="20" cy="20" r={RING_R}
                  fill="none"
                  stroke="var(--bk-white-12)"
                  strokeWidth="2.5"
                />
                {/* Depleting progress ring */}
                <circle
                  cx="20" cy="20" r={RING_R}
                  fill="none"
                  stroke="var(--bk-brand-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRC}
                  strokeDashoffset={dashOffset}
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%',
                    transition: 'stroke-dashoffset 1s linear',
                  }}
                />
                <text
                  x="20" y="24"
                  textAnchor="middle"
                  fill="var(--bk-text-primary)"
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="Inter, sans-serif"
                >
                  Undo
                </text>
              </svg>
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  ) : null;
}
