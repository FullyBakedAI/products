import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SwapProvider }           from './SwapContext';
import { motion as m }            from './motion-tokens';
import './shared.css';
import HomeScreen         from './HomeScreen';
import ExploreScreen      from './ExploreScreen';
import SwapScreen         from './SwapScreen';
import SwapSelectScreen   from './SwapSelectScreen';
import SendScreen         from './SendScreen';
import ReceiveScreen      from './ReceiveScreen';

// ── Motion variants (driven by motion-tokens.js) ──────────────────────────
const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: m.fade.enter },
  exit:    { opacity: 0, transition: m.fade.exit  },
};

const modalVariants = {
  initial: { y: m.modal.offsetEnter, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: m.modal.enter },
  exit:    { y: m.modal.offsetExit,  opacity: 0, transition: m.modal.exit },
};

const sheetVariants = {
  initial: { y: '100%' },
  animate: { y: 0,      transition: m.sheet.enter },
  exit:    { y: '100%', transition: m.sheet.exit  },
};

const MODAL_PATHS = ['/swap', '/send', '/receive'];
const SHEET_PATHS = ['/swap/select'];

function getVariants(pathname) {
  if (SHEET_PATHS.some(p => pathname.startsWith(p))) return sheetVariants;
  if (MODAL_PATHS.includes(pathname))                return modalVariants;
  return fadeVariants;
}

// ── App routes (inside phone frame) ──────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation();
  const variants = getVariants(location.pathname);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="screen-wrapper"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/"                    element={<HomeScreen />} />
          <Route path="/explore"             element={<ExploreScreen />} />
          <Route path="/swap"                element={<SwapScreen />} />
          <Route path="/swap/select/:side"   element={<SwapSelectScreen />} />
          <Route path="/send"                element={<SendScreen />} />
          <Route path="/receive"             element={<ReceiveScreen />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <SwapProvider>
      <div className="phone">
        <AnimatedRoutes />
      </div>
    </SwapProvider>
  );
}
