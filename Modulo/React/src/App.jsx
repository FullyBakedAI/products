import { useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './wagmi.config';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import SplashScreen from './SplashScreen';
import { BrandConfigProvider }    from './theme/BrandConfig';
import { FeatureConfigProvider, useFeatures } from './theme/FeatureConfig';
import FeaturePanel               from './theme/FeaturePanel';
import { SwapProvider }           from './SwapContext';
import { IconOverrideProvider }   from './IconOverrideContext';
import { UndoToastProvider }      from './UndoToastContext';
import { ActionsProvider, useActions } from './ActionsContext';
import { AutopilotProvider }          from './AutopilotContext';
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

const queryClient = new QueryClient();

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

// ── Route metadata — add new routes here, getVariants picks up automatically ───
// Keys are path prefixes; longer (more-specific) prefixes are listed first so
// /swap/select wins over /swap in the startsWith lookup.
const ROUTE_TRANSITIONS = {
  '/swap/select': 'sheet',
  '/review':      'sheet',
  '/swap':        'modal',
  '/send/amount': 'modal',
  '/send':        'modal',
  '/receive':     'modal',
  '/asset':       'modal',
  '/success':     'modal',
  '/activity':    'modal',
  '/optimise':    'modal',
  '/autopilot':   'modal',
  '/simulate':    'modal',
  '/achievements': 'modal',
  '/settings':    'modal',
};

const VARIANT_MAP = {
  sheet:   sheetVariants,
  modal:   modalVariants,
  default: fadeVariants,
};

function getVariants(pathname) {
  const match = Object.keys(ROUTE_TRANSITIONS).find(prefix => pathname.startsWith(prefix));
  const type = match ? ROUTE_TRANSITIONS[match] : 'default';
  return VARIANT_MAP[type];
}

// ── Error fallback — uses token-system colours so it's never unstyled ────
function AppError({ error, resetErrorBoundary }) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '32px 24px',
        background: 'var(--bk-bg-base)',
        color: 'var(--bk-text-primary)',
        textAlign: 'center',
        gap: 16,
      }}
    >
      <svg width="40" height="40" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 3L17.5 16H2.5L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="10" cy="14.5" r="0.75" fill="currentColor"/>
      </svg>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Something went wrong</p>
      {error?.message && (
        <p style={{ margin: 0, fontSize: 13, color: 'var(--bk-text-secondary)', maxWidth: 280 }}>
          {error.message}
        </p>
      )}
      <button
        onClick={resetErrorBoundary}
        style={{
          marginTop: 8,
          padding: '10px 24px',
          borderRadius: 12,
          border: 'none',
          background: 'var(--bk-brand-primary)',
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Reload
      </button>
    </div>
  );
}

// ── Actions overlay (sits on top of whatever screen is active) ───────────
// The screen-wrapper mounts/unmounts with no y-transform so it never moves
// the background. The slide animation lives on actions-sheet inside ActionsScreen.
function ActionsOverlay() {
  const { isOpen } = useActions();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="screen-wrapper"
          style={{ zIndex: 10 }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 1, transition: { duration: 0.22 } }}
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
  // Respects prefers-reduced-motion OS setting (WCAG 2.3.3)
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : getVariants(location.pathname);

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
  const { isConnected } = useAccount();
  const [demoMode, setDemoMode] = useState(false);
  const walletConnected = !f.walletConnection || isConnected || demoMode;

  if (!walletConnected) {
    return <ConnectWalletScreen onDemoConnect={() => setDemoMode(true)} />;
  }

  return (
    <AutopilotProvider>
    <ActionsProvider>
      <IconOverrideProvider>
        <SwapProvider>
          <UndoToastProvider>
            {isDesktop ? (
              // MOD-121: DesktopLayout already renders ActionsScreen as a panel — no separate overlay needed
              // but ActionsOverlay must still be available for openActions() to work if ever called outside DesktopLayout
              <DesktopLayout>
                <ErrorBoundary FallbackComponent={AppError}>
                  <AnimatedRoutes />
                </ErrorBoundary>
              </DesktopLayout>
            ) : (
              <div className="phone">
                <ErrorBoundary FallbackComponent={AppError}>
                  <AnimatedRoutes />
                </ErrorBoundary>
                <ActionsOverlay />
                <UndoToast />
              </div>
            )}
            <FeaturePanel />
          </UndoToastProvider>
        </SwapProvider>
      </IconOverrideProvider>
    </ActionsProvider>
    </AutopilotProvider>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BrandConfigProvider>
          <FeatureConfigProvider>
            <AnimatePresence mode="wait">
              {!splashDone ? (
                <SplashScreen key="splash" onDone={handleSplashDone} />
              ) : (
                <motion.div
                  key="app"
                  style={{ position: 'relative', width: '100%', height: '100%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <AppInner />
                </motion.div>
              )}
            </AnimatePresence>
          </FeatureConfigProvider>
        </BrandConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
