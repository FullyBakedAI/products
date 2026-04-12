/**
 * SwapScreen — React ARIA component
 *
 * Matches the HTML prototype at ../Prototype/swap-screen.html.
 * All interactivity via react-aria-components Button.
 * All colours via --bk-* CSS custom properties — no hardcoded hex.
 * Token state shared via SwapContext so SwapSelectScreen can update it.
 *
 * Animations:
 *   Screen entry — modal slide-up via motion-tokens.modal (y: 48 → 0, opacity 0 → 1)
 *   Swap arrow   — rotate 180° on direction flip (motion-tokens.spring)
 *   CTA label    — crossfade on text change (motion-tokens.cta, AnimatePresence mode="wait")
 *
 * Spec: SPEC-swap-aria.md + ../Spec/swap-screen-spec.md
 */

import { useState, useRef } from 'react';
import { Button } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as m } from './motion-tokens';

const MotionButton = motion.create(Button);
import { useSwap } from './SwapContext';
const IconDelete = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M7 4H17V16H7L3 10L7 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 8L14 12M14 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
import iconSettings from './assets/icon-settings.svg';
import { useIconOverride } from './IconOverrideContext';
import { ScreenHeader, TokenPill } from './components';
import './swap.css';

// ── Sub-components ────────────────────────────────────────────────────────

function SwapTokenPill({ token, side, appear }) {
  const navigate = useNavigate();
  return (
    <TokenPill
      token={{ id: token.id, name: token.symbol, icon: token.icon }}
      onPress={() => navigate(`/swap/select/${side}`)}
      appear={appear}
    />
  );
}

function SelectTokenButton({ side }) {
  const navigate = useNavigate();
  return (
    <Button
      className="select-token-cta-btn"
      aria-label="Select receive token"
      onPress={() => navigate(`/swap/select/${side}`)}
    >
      Select token
    </Button>
  );
}

function PayCard({ payAmount, payUSD, payToken }) {
  return (
    <div className="swap-card pay-card" role="region" aria-label="You pay">
      <div className="card-label">You pay</div>
      <div className="card-middle">
        <div
          className="swap-amount"
          role="textbox"
          aria-readonly="true"
          aria-label="Pay amount"
          aria-live="polite"
        >
          <span className="amount-text">{payAmount || '0'}</span>
          <span className="amount-cursor" aria-hidden="true" />
        </div>
        <SwapTokenPill token={payToken} side="pay" />
      </div>
      <div className="card-bottom">
        <span>≈ ${payUSD}</span>
        <span>{payToken.balanceLabel}</span>
      </div>
    </div>
  );
}

function ReceiveCard({ receiveAmount, receiveToken, rateLabel, flash }) {
  return (
    <div className="swap-card receive-card" role="region" aria-label="You receive">
      <div className="card-label">You receive</div>
      <div className="card-middle">
        <div
          className={`swap-amount${receiveToken ? '' : ' dimmed'}${flash ? ' receive-flash' : ''}`}
          role="textbox"
          aria-readonly="true"
          aria-label="Receive amount"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="amount-text">{receiveAmount || '0'}</span>
        </div>
        {receiveToken
          ? <SwapTokenPill token={receiveToken} side="receive" />
          : <SelectTokenButton side="receive" />
        }
      </div>
      {receiveToken && (
        <div className="card-bottom">
          <span>&nbsp;</span>
          <span>{rateLabel}</span>
        </div>
      )}
    </div>
  );
}

function SwapDirectionButton({ swapped, onPress, disabled }) {
  const { getIcon } = useIconOverride();
  const DirIcon = getIcon('swap-direction');
  return (
    <div className="swap-direction-row">
      <Button
        className={`swap-direction${disabled ? ' disabled' : ''}`}
        aria-label="Swap pay and receive tokens"
        onPress={onPress}
        isDisabled={disabled}
      >
        <motion.span
          animate={{ rotate: swapped ? 180 : 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 300 }}
          style={{ display: 'flex' }}
        >
          <DirIcon size={18} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
        </motion.span>
      </Button>
    </div>
  );
}

function PercentagePills({ activePct, payToken, onPress }) {
  const pills = [
    { label: '25%', pct: 25 },
    { label: '50%', pct: 50 },
    { label: '75%', pct: 75 },
    { label: 'Max', pct: 100 },
  ];
  return (
    <div className="pct-row" role="group" aria-label="Amount presets">
      {pills.map(({ label, pct }) => (
        <MotionButton
          key={pct}
          className={`pct-pill-btn${activePct === pct ? ' active' : ''}`}
          aria-label={`Set amount to ${label}`}
          aria-pressed={activePct === pct}
          whileTap={{ scale: 0.88 }}
          onPress={() => onPress(pct)}
        >
          {label}
        </MotionButton>
      ))}
    </div>
  );
}

function Numpad({ onKey }) {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
  return (
    <div className="numpad" role="group" aria-label="Number input">
      {keys.map((key) => (
        <MotionButton
          key={key}
          className="numpad-key-btn"
          aria-label={key === 'del' ? 'Delete last digit' : key}
          whileTap={{ scale: 0.82 }}
          onPress={() => onKey(key)}
        >
          {key === 'del'
            ? <IconDelete size={18} />
            : key
          }
        </MotionButton>
      ))}
    </div>
  );
}

// ── Main SwapScreen ───────────────────────────────────────────────────────

export default function SwapScreen() {
  const {
    payToken, receiveToken,
    payAmount, setPayAmount,
    activePct, setActivePct,
    payUSD, receiveAmount, rateLabel,
    swapDirections,
  } = useSwap();

  const flashTimer   = useRef(null);
  const prevReceive  = useRef('');
  const [swappedVisual, setSwappedVisual] = useState(false);

  // ── Derived CTA state ────────────────────────────────────────────────
  const hasAmount = payAmount && parseFloat(payAmount) > 0;
  const ctaReady  = !!(receiveToken && hasAmount);
  const ctaLabel  = !receiveToken
    ? 'Select a token'
    : !hasAmount
    ? 'Enter an amount'
    : 'Swap';

  // ── Receive flash ────────────────────────────────────────────────────
  function triggerFlash() {
    if (flashTimer.current) clearTimeout(flashTimer.current);
    prevReceive.current = receiveAmount;
    flashTimer.current = setTimeout(() => { prevReceive.current = ''; }, 300);
  }

  // ── Numpad ───────────────────────────────────────────────────────────
  function handleKey(key) {
    setActivePct(null);
    setPayAmount((prev) => {
      if (key === 'del') return prev.slice(0, -1);
      if (key === '.') {
        if (prev.includes('.')) return prev;
        return prev.length === 0 ? '0.' : prev + '.';
      }
      if (prev === '0' && key !== '.') return key;
      return prev + key;
    });
    triggerFlash();
  }

  // ── Percentage pills ─────────────────────────────────────────────────
  function handlePct(pct) {
    setActivePct(pct);
    const amount = payToken.balance * pct / 100;
    setPayAmount(amount % 1 === 0 ? amount.toString() : amount.toFixed(4));
    triggerFlash();
  }

  // ── Swap direction ───────────────────────────────────────────────────
  function handleSwapDirection() {
    setSwappedVisual(v => !v);
    swapDirections();
  }

  const navigate = useNavigate();

  return (
    <motion.div
      role="main"
      aria-label="Modulo swap screen"
      className="swap-screen-inner"
      initial={{ opacity: 0, y: m.modal.offsetEnter }}
      animate={{ opacity: 1, y: 0, transition: m.modal.enter }}
      exit={{ opacity: 0, y: m.modal.offsetExit, transition: m.modal.exit }}
    >
      <ScreenHeader
        title="Swap"
        onClose={() => navigate('/')}
        rightSlot={
          <Button
            className="settings-btn"
            aria-label="Swap settings"
            onPress={() => navigate('/settings')}
          >
            <img src={iconSettings} width="20" height="20" aria-hidden="true" />
          </Button>
        }
      />

      <div className="swap-cards" data-bk-component="swap-card">
        <PayCard payAmount={payAmount} payUSD={payUSD} payToken={payToken} />
        <SwapDirectionButton
          swapped={swappedVisual}
          onPress={handleSwapDirection}
          disabled={!receiveToken}
        />
        <ReceiveCard
          receiveAmount={receiveAmount}
          receiveToken={receiveToken}
          rateLabel={rateLabel}
          flash={false}
        />
      </div>

      <PercentagePills activePct={activePct} payToken={payToken} onPress={handlePct} />

      <Numpad onKey={handleKey} />

      <Button
        className={`bottom-cta-btn ${ctaReady ? 'cta-ready' : 'cta-disabled'}`}
        data-bk-component="button"
        aria-label={ctaLabel}
        isDisabled={!ctaReady && !!receiveToken}
        onPress={() => {
          if (!receiveToken) { navigate('/swap/select/receive'); return; }
          if (ctaReady) {
            navigate('/review', { state: {
              action: 'swap',
              from: { icon: payToken.icon, symbol: payToken.symbol, amount: payAmount, usd: parseFloat(payAmount || 0) * payToken.price },
              to:   { icon: receiveToken.icon, symbol: receiveToken.symbol, amount: receiveAmount, usd: parseFloat(receiveAmount || 0) * receiveToken.price },
              fee: { network: '$2.40', protocol: '$0.88', total: '$3.28' },
              rate: rateLabel,
              warning: null,
            }});
          }
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={ctaLabel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: m.cta.enter }}
            exit={{    opacity: 0, y: -6, transition: m.cta.exit  }}
          >
            {ctaLabel}
          </motion.span>
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
