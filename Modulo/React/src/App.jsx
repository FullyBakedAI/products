import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BrandConfigProvider }    from './theme/BrandConfig';
import { FeatureConfigProvider, useFeatures } from './theme/FeatureConfig';
import FeaturePanel               from './theme/FeaturePanel';
import { SwapProvider }           from './SwapContext';
import { IconOverrideProvider }   from './IconOverrideContext';
import { UndoToastProvider }      from './UndoToastContext';
import { ActionsProvider, useActions } from './ActionsContext';
import { motion as m }            from './motion-tokens';
import { useIsDesktop }           from './hooks/useIsDesktop';
import DesktopLayout              from './DesktopLayout';
import ConnectWalletScreen        from './ConnectWalletScreen';
import './shared.css';
import HomeScreen         from './HomeScreen';
import ExploreScreen      from './ExploreScreen';
import SwapScreen         from './SwapScreen';
import SwapSelectScreen   from './SwapSelectScreen';
import SendScreen         from './SendScreen';
import ReceiveScreen      from './ReceiveScreen';
import AssetScreen        from './AssetScreen';
import ActionsScreen      from './ActionsScreen';
import ReviewScreen       from './ReviewScreen';
import SuccessScreen      from './SuccessScreen';
import ActivityScreen     from './ActivityScreen';
import OptimiseScreen     from './OptimiseScreen';
import AutopilotScreen    from './AutopilotScreen';
import SimulateScreen     from './SimulateScreen';
import AchievementsScreen from './AchievementsScreen';
import SendAmountScreen   from './SendAmountScreen';
import SettingsScreen     from './SettingsScreen';
import ManageScreen       from './ManageScreen';
import UndoToast          from './UndoToast';

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

const MODAL_PATHS = [
  '/swap', '/send', '/receive', '/asset', '/success', '/activity',
  '/optimise', '/autopilot', '/simulate', '/achievements', '/send/amount', '/settings',
];
const SHEET_PATHS = ['/swap/select', '/review'];

function getVariants(pathname) {
  if (SHEET_PATHS.some(p => pathname.startsWith(p))) return sheetVariants;
  if (MODAL_PATHS.some(p => pathname.startsWith(p))) return modalVariants;
  return fadeVariants;
}

// ── Actions overlay (sits on top of whatever screen is active) ───────────
function ActionsOverlay() {
  const { isOpen } = useActions();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="screen-wrapper"
          style={{ zIndex: 10 }}
          variants={sheetVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <ActionsScreen />
        </motion.div>
      )}
    </AnimatePresence>
  );
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
          <Route path="/asset/:id"           element={<AssetScreen />} />
          <Route path="/review"              element={<ReviewScreen />} />
          <Route path="/success"             element={<SuccessScreen />} />
          <Route path="/activity"            element={<ActivityScreen />} />
          <Route path="/optimise"            element={<OptimiseScreen />} />
          <Route path="/autopilot"           element={<AutopilotScreen />} />
          <Route path="/simulate"            element={<SimulateScreen />} />
          <Route path="/achievements"        element={<AchievementsScreen />} />
          <Route path="/send/amount"         element={<SendAmountScreen />} />
          <Route path="/settings"            element={<SettingsScreen />} />
          <Route path="/manage"              element={<ManageScreen />} />
        </Routes>

      </motion.div>
    </AnimatePresence>
  );
}

// ── AppInner — inside FeatureConfigProvider, handles wallet gate ──────────
function AppInner() {
  const f = useFeatures();
  const isDesktop = useIsDesktop();
  const [walletConnected, setWalletConnected] = useState(
    () => !f.walletConnection || localStorage.getItem('walletConnected') === 'true'
  );

  if (!walletConnected) {
    return (
      <ConnectWalletScreen onConnect={() => {
        localStorage.setItem('walletConnected', 'true');
        setWalletConnected(true);
      }} />
    );
  }

  return (
    <ActionsProvider>
      <IconOverrideProvider>
        <SwapProvider>
          <UndoToastProvider>
            {isDesktop ? (
              <DesktopLayout>
                <AnimatedRoutes />
              </DesktopLayout>
            ) : (
              <div className="phone">
                <AnimatedRoutes />
                <ActionsOverlay />
                <UndoToast />
              </div>
            )}
            <FeaturePanel />
          </UndoToastProvider>
        </SwapProvider>
      </IconOverrideProvider>
    </ActionsProvider>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrandConfigProvider>
      <FeatureConfigProvider>
        <AppInner />
      </FeatureConfigProvider>
    </BrandConfigProvider>
  );
}
