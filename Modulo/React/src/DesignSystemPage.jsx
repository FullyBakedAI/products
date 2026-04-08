/**
 * DesignSystemPage — Agentic Design System for Modulo / BakeKit.
 *
 * An agentic design system is structured for three consumers:
 *   1. Human designers & developers (visual reference)
 *   2. Engineers implementing the product (specs & tokens)
 *   3. AI agents generating UI on demand (agent brief & constraints)
 *
 * Sections:
 *   Brand      — logo, colours in context, voice & tone
 *   Tokens     — live CSS token editor (colour + motion)
 *   Components — BakeKit component showcase with states
 *   Principles — design philosophy & UX standards
 *   Agent Brief — machine-readable context for AI agents
 *
 * Route: rendered when hash === #/ds (outside HashRouter)
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'react-aria-components';
import { SwapProvider } from './SwapContext';
import { TOKEN_DEFINITIONS, TOKEN_GROUPS, BUILTIN_THEMES, useTokenOverride } from './TokenOverrideContext';
import { ICON_SLOTS, useIconOverride } from './IconOverrideContext';
import * as LucideIcons from 'lucide-react';
import HomeScreen from './HomeScreen';
import SwapScreen from './SwapScreen';
import SwapSelectScreen from './SwapSelectScreen';
import ExploreScreen from './ExploreScreen';
import SendScreen from './SendScreen';
import ReceiveScreen from './ReceiveScreen';
import HomeScreenV1 from './v1/HomeScreenV1';
import SwapScreenV1 from './v1/SwapScreenV1';
import ExploreScreenV1 from './v1/ExploreScreenV1';
import SendScreenV1 from './v1/SendScreenV1';
import ReceiveScreenV1 from './v1/ReceiveScreenV1';
import logoModulo from './assets/logo-modulo.svg';
import './design-system-page.css';

// ─────────────────────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'brand',  label: 'Brand',  icon: '◈' },
  { id: 'studio', label: 'Studio', icon: '⬡' },
  { id: 'rules',  label: 'Rules',  icon: '◎' },
  { id: 'brief',  label: 'Brief',  icon: '⟡' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Token Editors (Tokens section)
// ─────────────────────────────────────────────────────────────────────────────

function ColourToken({ token }) {
  const { getToken, setToken, resetTokenDraft, isOverridden, isUnsaved } = useTokenOverride();
  const value    = getToken(token.key);
  const modified = isOverridden(token.key);
  const unsaved  = isUnsaved(token.key);

  return (
    <div className={`ds-token-row${modified ? ' modified' : ''}${unsaved ? ' unsaved' : ''}`}>
      <div className="ds-token-swatch" style={{ background: value }} />
      <div className="ds-token-info">
        <div className="ds-token-label">{token.label}</div>
        <div className="ds-token-key">{token.key}</div>
      </div>
      <div className="ds-token-controls">
        <input
          type="color"
          className="ds-colour-picker"
          value={value.startsWith('#') ? value : '#584BEB'}
          onChange={e => setToken(token.key, e.target.value)}
          title={`Edit ${token.label}`}
        />
        <input
          type="text"
          className="ds-hex-input"
          value={value}
          onChange={e => setToken(token.key, e.target.value)}
          spellCheck={false}
        />
        {modified && (
          <button className="ds-reset-btn" onClick={() => resetTokenDraft(token.key)} title="Reset to default">↺</button>
        )}
      </div>
    </div>
  );
}

function DurationToken({ token }) {
  const { getToken, setToken, resetTokenDraft, isOverridden, isUnsaved } = useTokenOverride();
  const value    = getToken(token.key);
  const ms       = parseInt(value) || token.min;
  const modified = isOverridden(token.key);
  const unsaved  = isUnsaved(token.key);

  return (
    <div className={`ds-token-row${modified ? ' modified' : ''}${unsaved ? ' unsaved' : ''}`}>
      <div className="ds-token-info">
        <div className="ds-token-label">{token.label}</div>
        <div className="ds-token-key">{token.key}</div>
      </div>
      <div className="ds-token-controls ds-duration-controls">
        <input
          type="range"
          className="ds-slider"
          min={token.min}
          max={token.max}
          value={ms}
          onChange={e => setToken(token.key, `${e.target.value}ms`)}
        />
        <span className="ds-duration-value">{ms}ms</span>
        {modified && (
          <button className="ds-reset-btn" onClick={() => resetTokenDraft(token.key)} title="Reset to default">↺</button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Phone Preview (used in Tokens section)
// ─────────────────────────────────────────────────────────────────────────────

const PREVIEW_ROUTES = [
  { path: '/',                  element: <SwapProvider><HomeScreen /></SwapProvider> },
  { path: '/swap',              element: <SwapProvider><SwapScreen /></SwapProvider> },
  { path: '/swap/select/:side', element: <SwapProvider><SwapSelectScreen /></SwapProvider> },
  { path: '/explore',           element: <SwapProvider><ExploreScreen /></SwapProvider> },
  { path: '/send',              element: <SwapProvider><SendScreen /></SwapProvider> },
  { path: '/receive',           element: <SwapProvider><ReceiveScreen /></SwapProvider> },
];

const PREVIEW_ROUTES_V1 = [
  { path: '/',                  element: <SwapProvider><HomeScreenV1 /></SwapProvider> },
  { path: '/swap',              element: <SwapProvider><SwapScreenV1 /></SwapProvider> },
  { path: '/swap/select/:side', element: <SwapProvider><SwapSelectScreen /></SwapProvider> },
  { path: '/explore',           element: <SwapProvider><ExploreScreenV1 /></SwapProvider> },
  { path: '/send',              element: <SwapProvider><SendScreenV1 /></SwapProvider> },
  { path: '/receive',           element: <SwapProvider><ReceiveScreenV1 /></SwapProvider> },
];

const PREVIEW_SCREENS = [
  { label: 'Home',    path: '/' },
  { label: 'Swap',    path: '/swap' },
  { label: 'Explore', path: '/explore' },
  { label: 'Send',    path: '/send' },
  { label: 'Receive', path: '/receive' },
];

function PhonePreview({ screen, routes = PREVIEW_ROUTES, theme = 'dark' }) {
  const router = useMemo(
    () => createMemoryRouter(routes, { initialEntries: [screen] }),
    [screen, routes] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return (
    <div className={`ds-phone-outer${theme === 'light' ? ' theme-light' : ''}`}>
      <div className="phone ds-phone-frame">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Brand
// ─────────────────────────────────────────────────────────────────────────────

const VOICE_TRAITS = [
  { trait: 'Clear',       opposite: 'not jargon-heavy',    desc: 'DeFi is complex. We make it legible.' },
  { trait: 'Confident',   opposite: 'not arrogant',         desc: 'We know what we\'re doing. So does our user.' },
  { trait: 'Precise',     opposite: 'not vague',            desc: 'Exact numbers, exact actions, exact feedback.' },
  { trait: 'Calm',        opposite: 'not alarming',         desc: 'Finance is stressful. We\'re the steady hand.' },
];

const TYPOGRAPHY_SAMPLES = [
  { label: 'Display',    weight: 700, size: '28px', sample: 'One vault, every chain.' },
  { label: 'Heading',    weight: 600, size: '18px', sample: 'Your portfolio, unified.' },
  { label: 'Body',       weight: 400, size: '15px', sample: 'Swap tokens across chains with zero friction.' },
  { label: 'Label',      weight: 500, size: '13px', sample: 'You pay · ETH · Ethereum' },
  { label: 'Caption',    weight: 400, size: '11px', sample: '--bk-font-size-caption · Inter 400' },
];

function BrandSection() {
  const { getToken } = useTokenOverride();

  const palette = [
    { label: 'Brand',    token: '--bk-brand-primary',  role: 'CTAs, active states' },
    { label: 'Base',     token: '--bk-bg-base',         role: 'App background' },
    { label: 'Card',     token: '--bk-bg-card',         role: 'Surface' },
    { label: 'Nav',      token: '--bk-bg-nav',          role: 'Navigation' },
    { label: 'Text',     token: '--bk-text-primary',    role: 'Headlines' },
    { label: 'Body',     token: '--bk-text-secondary',  role: 'Body text' },
    { label: 'Muted',    token: '--bk-text-muted',      role: 'Captions' },
    { label: 'Success',  token: '--bk-success',         role: 'Positive' },
    { label: 'Error',    token: '--bk-error',           role: 'Negative' },
  ];

  return (
    <div className="ds-brand-editorial">

      {/* ─── Hero ─── */}
      <div className="ds-brand-hero">
        <div className="ds-brand-hero-inner">
          <img src={logoModulo} alt="Modulo" className="ds-brand-hero-logo" />
          <h1 className="ds-brand-hero-tagline">One vault,<br />every chain.</h1>
          <p className="ds-brand-hero-meta">Design System · v1.0 · Built with BakedUX</p>
        </div>
      </div>

      {/* ─── Colour ─── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">01 — Colour</div>
        <div className="ds-colour-row">
          {palette.map(({ label, token, role }) => (
            <div key={token} className="ds-colour-block" style={{ background: getToken(token) }}>
              <div className="ds-colour-block-info">
                <span className="ds-colour-block-name">{label}</span>
                <span className="ds-colour-block-hex">{getToken(token)}</span>
                <span className="ds-colour-block-role">{role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Typography ─── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">02 — Typography</div>
        <div className="ds-type-editorial">
          <div className="ds-type-hero-display">One vault,<br />every chain.</div>
          <div className="ds-type-scale-rows">
            {TYPOGRAPHY_SAMPLES.map(({ label, weight, size, sample }) => (
              <div key={label} className="ds-type-scale-row">
                <span className="ds-type-scale-meta">Inter {weight} / {size}</span>
                <span className="ds-type-scale-label">{label}</span>
                <span className="ds-type-scale-sample" style={{ fontWeight: weight, fontSize: size }}>
                  {sample}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Voice & Tone ─── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">03 — Voice & Tone</div>
        <div className="ds-voice-editorial">
          {VOICE_TRAITS.map(({ trait, opposite, desc }) => (
            <div key={trait} className="ds-voice-editorial-row">
              <div className="ds-voice-trait-word">{trait}</div>
              <div className="ds-voice-not">{opposite}</div>
              <div className="ds-voice-description">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Tagline ─── */}
      <div className="ds-editorial-block ds-tagline-editorial">
        <div className="ds-editorial-label">04 — Tagline</div>
        <blockquote className="ds-tagline-quote">"One vault, every chain."</blockquote>
        <div className="ds-tagline-rules">
          <span>Use in full</span>
          <span>·</span>
          <span>Never truncate</span>
          <span>·</span>
          <span>Sentence case only</span>
        </div>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Motion Demos (live in the Motion tab)
// ─────────────────────────────────────────────────────────────────────────────

const MOTION_DEMOS = [
  { key: '--bk-motion-fast',     label: 'Fast',     desc: 'Micro-transitions, hover, selection' },
  { key: '--bk-motion-standard', label: 'Standard', desc: 'Screen transitions, appearing elements' },
  { key: '--bk-motion-slow',     label: 'Slow',     desc: 'Complex layouts, reveals' },
];

const SPRING_PRESETS = [
  { label: 'Default spring',  config: { type: 'spring', damping: 18, stiffness: 260, mass: 0.6 } },
  { label: 'Tight spring',    config: { type: 'spring', damping: 22, stiffness: 340, mass: 0.5 } },
  { label: 'Bouncy spring',   config: { type: 'spring', damping: 10, stiffness: 200, mass: 0.8 } },
  { label: 'Slow spring',     config: { type: 'spring', damping: 30, stiffness: 120, mass: 1.2 } },
];

function MotionDemoRow({ tokenKey, label, desc }) {
  const { getToken } = useTokenOverride();
  const [playing, setPlaying] = useState(false);
  const ms = parseInt(getToken(tokenKey)) || 220;

  function play() {
    setPlaying(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
    setTimeout(() => setPlaying(false), ms * 2 + 100);
  }

  return (
    <div className="ds-motion-row">
      <div className="ds-motion-info">
        <div className="ds-motion-label">{label}</div>
        <div className="ds-motion-desc">{desc}</div>
      </div>
      <div className="ds-motion-stage">
        <motion.div
          className="ds-motion-ball"
          animate={{ x: playing ? 80 : 0 }}
          transition={{ duration: ms / 1000, ease: 'easeInOut' }}
        />
      </div>
      <button className="ds-motion-play-btn" onClick={play} title="Play">▶</button>
    </div>
  );
}

function SpringDemoRow({ label, config }) {
  const { getToken } = useTokenOverride();
  const brand = getToken('--bk-brand-primary');
  const [playing, setPlaying] = useState(false);

  function play() {
    setPlaying(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
    setTimeout(() => setPlaying(false), 1200);
  }

  return (
    <div className="ds-motion-row">
      <div className="ds-motion-info">
        <div className="ds-motion-label">{label}</div>
        <div className="ds-motion-desc" style={{ fontFamily: 'monospace', fontSize: 10 }}>
          d:{config.damping} k:{config.stiffness} m:{config.mass}
        </div>
      </div>
      <div className="ds-motion-stage">
        <motion.div
          className="ds-motion-ball"
          style={{ background: brand }}
          animate={{ x: playing ? 80 : 0 }}
          transition={config}
        />
      </div>
      <button className="ds-motion-play-btn" onClick={play} title="Play">▶</button>
    </div>
  );
}

function MotionDemos() {
  return (
    <div className="ds-motion-demos">
      <div className="ds-motion-section-label">Duration previews — click ▶ to play</div>
      {MOTION_DEMOS.map(d => (
        <MotionDemoRow key={d.key} tokenKey={d.key} label={d.label} desc={d.desc} />
      ))}
      <div className="ds-motion-section-label" style={{ marginTop: 16 }}>Spring physics presets</div>
      {SPRING_PRESETS.map(s => (
        <SpringDemoRow key={s.label} label={s.label} config={s.config} />
      ))}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Component Registry — the product kit
// ─────────────────────────────────────────────────────────────────────────────

const COMP_GROUPS = ['Actions', 'Feedback', 'Forms', 'Cards', 'Navigation', 'DeFi'];

const COMPONENT_REGISTRY = [
  {
    id: 'button', group: 'Actions', name: 'Button',
    description: 'The primary interactive element across the product. Built on React ARIA Button for full keyboard navigation, focus management, and screen reader support. Supports four visual variants and three interactive states.',
    usage: 'One primary button per screen. Ghost and secondary variants for supporting actions. Destructive variant requires a confirmation step before executing.',
    notes: 'Minimum 44px touch target enforced via CSS. Always label with an imperative verb (Swap, Send, Confirm). Never disable a button without communicating why.',
  },
  {
    id: 'toast', group: 'Feedback', name: 'Toast',
    description: 'Non-blocking status messages that appear at the top of the screen. Three types: success (transaction confirmed), pending (waiting for chain), error (transaction failed or rejected).',
    usage: 'Fire after any async operation completes. Auto-dismiss after 3.2 seconds. Stack if multiple fire simultaneously.',
    notes: 'Copy must be specific — say what happened. Never use for warnings requiring action; use a modal instead.',
  },
  {
    id: 'bottom-sheet', group: 'Feedback', name: 'Bottom sheet',
    description: 'Modal overlay that slides up from the bottom using a spring animation. Used for token selection, contextual detail panels, and lightweight confirmations.',
    usage: 'Token selection, contextual detail panels, lightweight confirmations.',
    notes: 'Maximum 60% viewport height on mobile. Always include a close affordance. Tapping the backdrop dismisses.',
  },
  {
    id: 'skeleton', group: 'Feedback', name: 'Skeleton loader',
    description: 'Structure-preserving placeholder shown while data loads. Shimmer animation signals active loading state. Prevents layout shift when content arrives.',
    usage: 'Use instead of spinners. Match the skeleton shape to the content it stands in for.',
    notes: 'Escalate to an error state if data has not arrived after 3 seconds. Never show a skeleton indefinitely.',
  },
  {
    id: 'badge', group: 'Feedback', name: 'Status badge',
    description: 'Inline status indicator for transaction and portfolio states. Colour-coded: success green, brand purple for pending, error red.',
    usage: 'Transaction lists, confirmation screens, activity feeds.',
    notes: 'Text should be a noun (Confirmed, Pending, Failed), not a verb. Never use for navigation or actions.',
  },
  {
    id: 'input', group: 'Forms', name: 'Input field',
    description: 'Text input with focus, error, and disabled states. Border colour and box shadow communicate state without relying on colour alone.',
    usage: 'Wallet addresses, search fields, name inputs. Use token pill for amount inputs.',
    notes: 'Always pair with a visible label. Inline validation only after first blur — not on every keystroke.',
  },
  {
    id: 'token-pill', group: 'Forms', name: 'Token pill',
    description: 'Token selector chip showing icon, symbol, and a chevron dropdown affordance. Used inside swap cards and amount inputs to let users select which token they are working with.',
    usage: 'Anywhere the user selects a specific token. Tapping opens a bottom sheet with the full token list.',
    notes: 'Token icon from official source — never approximate with Lucide icons. Always show symbol, never full name.',
  },
  {
    id: 'pct-pills', group: 'Forms', name: 'Percentage pills',
    description: 'Preset amount selectors (25%, 50%, 75%, Max). Allow quick entry without using the keyboard. Active pill highlighted in brand colour.',
    usage: 'Below amount inputs in Swap and Send screens only.',
    notes: 'Max must calculate from available balance in real time. Never hardcode a value.',
  },
  {
    id: 'token-card', group: 'Cards', name: 'Token card',
    description: 'Portfolio row showing token icon, name, balance, current USD value, and 24h change. The primary data unit of the portfolio list.',
    usage: 'Home screen portfolio list. Tapping drills into token detail.',
    notes: 'Positive change in success green. Negative in error red. Zero or undefined in muted text.',
  },
  {
    id: 'swap-card', group: 'Cards', name: 'Swap card',
    description: 'The pay/receive surface in the swap flow. Shows amount (large numeral), selected token (pill), and fiat equivalent. Two instances stack with the direction toggle between them.',
    usage: 'Swap screen only. Always appear as a pair.',
    notes: 'Amount accepts numeric input only. USD equivalent updates on every keystroke. Never round the displayed amount.',
  },
  {
    id: 'bottom-nav', group: 'Navigation', name: 'Bottom nav',
    description: 'Four-item navigation bar anchored to the bottom of the viewport. Active item in brand colour with filled icon weight. Icons configurable via Icon Slots in the Tokens panel.',
    usage: 'Persistent on all primary screens. Hidden on modal sheets and linear confirmation flows.',
    notes: 'Labels always visible — no label-on-active-only patterns. 44px tap targets. Four items maximum.',
  },
  {
    id: 'tab-bar', group: 'Navigation', name: 'Tab bar',
    description: 'Horizontal tab switcher for content views within a single screen. Active tab indicated by brand-colour underline.',
    usage: 'Within-screen content switching. Explore screen uses this for category filtering.',
    notes: 'Not a substitute for bottom nav. Should switch content, not navigate to new screens. Four tabs maximum.',
  },
  {
    id: 'tx-row', group: 'DeFi', name: 'Transaction row',
    description: 'Activity list item showing type (sent/received/swapped), counterparty address, token amounts, and fiat values. Icon and colour encode the transaction direction.',
    usage: 'Activity feed, portfolio detail, transaction history.',
    notes: 'Timestamp in relative format for <7 days, absolute thereafter. Never truncate or round amounts.',
  },
  {
    id: 'step-progress', group: 'DeFi', name: 'Step progress',
    description: 'Three-step linear indicator for transaction flows: Review → Approve → Confirm on-chain. Steps render as done (filled), active (brand), or pending (outline).',
    usage: 'Swap confirmation flow. Send confirmation flow.',
    notes: 'Never skip steps or show all as done simultaneously. Be honest about the current on-chain state.',
  },
  {
    id: 'confirm-summary', group: 'DeFi', name: 'Confirmation summary',
    description: 'Pre-execution summary card showing the complete transaction: token pair, amounts, exchange rate, network fee, and the final CTA. Last check before on-chain submission.',
    usage: 'Swap confirmation. Send confirmation.',
    notes: 'Exchange rate must refresh if stale >15s. Show slippage tolerance. Never round amounts on this surface.',
  },
  {
    id: 'portfolio-metric', group: 'DeFi', name: 'Portfolio metric',
    description: 'Hero value block for total portfolio value with 24h change. Large numeral hierarchy establishes the dominant visual weight on the Home screen.',
    usage: 'Home screen hero area. Portfolio detail header.',
    notes: 'Locale-formatted currency. Animated count-up on first load. Change indicator always includes sign (+ or −).',
  },
  {
    id: 'wallet-chip', group: 'DeFi', name: 'Wallet address chip',
    description: 'Compact address display with identicon, truncated address, copy action, and optional network badges.',
    usage: 'Receive screen, transaction detail, address confirmation flows.',
    notes: 'Always truncate to 0x4a3f…c12d format — never show full address in a chip. Copy to clipboard with confirmation feedback.',
  },
];

// Per-component control definitions
const COMP_CONTROLS = {
  button:          [{ id: 'variant', label: 'Variant',      options: ['primary','secondary','ghost','destructive'], def: 'primary' }],
  toast:           [{ id: 'type',    label: 'Type',         options: ['success','pending','error'],                 def: 'success' }],
  badge:           [{ id: 'type',    label: 'Status',       options: ['Confirmed','Pending','Failed'],              def: 'Confirmed' }],
  input:           [{ id: 'state',   label: 'State',        options: ['default','focused','error','disabled'],      def: 'default' }],
  'token-card':    [{ id: 'token',   label: 'Token',        options: ['ETH','BTC','USDC','SOL'],                    def: 'ETH' },
                   { id: 'trend',    label: 'Trend',        options: ['up','down'],                                 def: 'up' }],
  'bottom-nav':    [{ id: 'active',  label: 'Active tab',   options: ['Home','Explore','Activity','Swap'],          def: 'Home' }],
  'tx-row':        [{ id: 'type',    label: 'Type',         options: ['sent','received','swapped'],                 def: 'sent' }],
  'step-progress': [{ id: 'step',    label: 'Current step', options: ['Review','Approve','Confirm'],                def: 'Approve' }],
};

// ────────────────────────────────────────────────────────────────────────────
// ICON LIBRARY — browsable reference (used in Tokens > Icons accordion)
// ────────────────────────────────────────────────────────────────────────────

const ICON_ALL = Object.keys(LucideIcons)
  .filter(k => {
    const v = LucideIcons[k];
    return typeof v === 'function' && k !== 'createLucideIcon' && !k.startsWith('_');
  })
  .sort();

function IconMiniPicker({ onSelect, brand, border, bgCard, textP, textM }) {
  const [q, setQ] = useState('');
  const hits = q ? ICON_ALL.filter(n => n.toLowerCase().includes(q.toLowerCase())).slice(0, 48) : ICON_ALL.slice(0, 48);
  return (
    <div className="ds-icon-mini-picker" style={{ background: bgCard, borderColor: border }}>
      <input
        className="ds-icon-mini-search"
        type="text"
        placeholder="Search icons…"
        value={q}
        onChange={e => setQ(e.target.value)}
        autoFocus
        style={{ borderColor: border, color: textP, background: 'rgba(255,255,255,0.04)' }}
      />
      <div className="ds-icon-mini-grid">
        {hits.map(name => {
          const Ic = LucideIcons[name];
          return (
            <button
              key={name}
              className="ds-icon-mini-btn"
              onClick={() => onSelect(name)}
              title={name}
              style={{ borderColor: 'transparent', color: textM }}
            >
              <Ic size={16} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IconsAccordionGroup({ isOpen, onToggle }) {
  const { getIconName, setIconOverride, resetIconOverride, overrides } = useIconOverride();
  const { getToken } = useTokenOverride();
  const brand  = getToken('--bk-brand-primary');
  const bgCard = getToken('--bk-bg-card');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textM  = getToken('--bk-text-muted');

  const [pickerSlot, setPickerSlot] = useState(null);
  const overrideCount = Object.keys(overrides).length;

  return (
    <div className="ds-accordion-group">
      <button className="ds-accordion-header" onClick={onToggle} style={{ borderBottomColor: border }}>
        <span className="ds-accordion-label" style={{ color: textP }}>Icon Slots</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          {overrideCount > 0 && (
            <span className="ds-accordion-badge" style={{ background: `${brand}20`, color: brand }}>
              {overrideCount}
            </span>
          )}
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ display: 'flex', color: textM }}>
            <LucideIcons.ChevronDown size={14} strokeWidth={2} />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '10px 12px 8px' }}>
              {/* Thumbnail grid */}
              <div className="ds-icon-slot-grid">
                {ICON_SLOTS.map(({ slot, label, default: defaultName }) => {
                  const currentName = getIconName(slot);
                  const CurrentIcon = LucideIcons[currentName] ?? LucideIcons.Circle;
                  const isOverridden = currentName !== defaultName;
                  const isActive = pickerSlot === slot;
                  return (
                    <button
                      key={slot}
                      className={`ds-icon-slot-thumb${isActive ? ' active' : ''}`}
                      onClick={() => setPickerSlot(isActive ? null : slot)}
                      title={label}
                      style={{
                        borderColor: isActive ? brand : (isOverridden ? `${brand}50` : border),
                        background: isActive ? `${brand}15` : 'transparent',
                        color: isActive ? brand : (isOverridden ? brand : textM),
                      }}
                    >
                      <CurrentIcon size={18} strokeWidth={1.5} />
                      <span className="ds-icon-slot-thumb-label">{label.split(' — ')[1] || label}</span>
                      {isOverridden && (
                        <span
                          className="ds-icon-slot-thumb-reset"
                          onClick={e => { e.stopPropagation(); resetIconOverride(slot); if (pickerSlot === slot) setPickerSlot(null); }}
                          title="Reset"
                        >×</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Picker for active slot */}
              <AnimatePresence>
                {pickerSlot && (
                  <motion.div
                    key={pickerSlot}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ marginTop: 8 }}
                  >
                    <div style={{ fontSize: 10, color: textM, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {ICON_SLOTS.find(s => s.slot === pickerSlot)?.label}
                    </div>
                    <IconMiniPicker
                      onSelect={name => { setIconOverride(pickerSlot, name); setPickerSlot(null); }}
                      brand={brand} border={border} bgCard={bgCard} textP={textP} textM={textM}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Studio — Component List (left panel selector)
// ─────────────────────────────────────────────────────────────────────────────

function ComponentList({ selected, onSelect, openPanel, setOpenPanel, brand, border, textP, textM }) {
  const grouped = COMP_GROUPS.map(g => ({
    group: g,
    items: COMPONENT_REGISTRY.filter(c => c.group === g),
  }));

  return (
    <div className="ds-comp-list">
      {grouped.map(({ group, items }) => {
        const panelKey = `comp-${group}`;
        const isOpen = openPanel === panelKey;
        return (
          <div key={group} className="ds-comp-list-group">
            <button
              className={`ds-comp-list-group-header${isOpen ? ' open' : ''}`}
              onClick={() => setOpenPanel(isOpen ? null : panelKey)}
              style={{ color: isOpen ? textP : textM }}
            >
              <span>{group}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="ds-comp-list-count">{items.length}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', opacity: 0.5 }}
                >
                  <LucideIcons.ChevronDown size={12} strokeWidth={2} />
                </motion.span>
              </div>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  {items.map(comp => (
                    <button
                      key={comp.id}
                      className={`ds-comp-list-item${selected === comp.id ? ' active' : ''}`}
                      onClick={() => onSelect(selected === comp.id ? null : comp.id)}
                      style={{
                        color: selected === comp.id ? brand : textP,
                        background: selected === comp.id ? `${brand}10` : 'transparent',
                        borderLeftColor: selected === comp.id ? brand : 'transparent',
                      }}
                    >
                      {comp.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Studio — Description Panel (editable context per component)
// ─────────────────────────────────────────────────────────────────────────────

function DescriptionPanel({ comp, brand, border, bgBase, textP, textM }) {
  function load() {
    try { return JSON.parse(localStorage.getItem(`modulo-ds-desc-${comp.id}`)) || null; }
    catch { return null; }
  }
  const [data, setData] = useState(() => load() || { description: comp.description, usage: comp.usage, notes: comp.notes });
  const [editing, setEditing] = useState(false);

  // Reset when component changes
  useEffect(() => {
    setData(load() || { description: comp.description, usage: comp.usage, notes: comp.notes });
    setEditing(false);
  }, [comp.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function save(field, value) {
    const next = { ...data, [field]: value };
    setData(next);
    localStorage.setItem(`modulo-ds-desc-${comp.id}`, JSON.stringify(next));
  }

  const FIELDS = [
    { key: 'description', label: 'Description' },
    { key: 'usage',       label: 'Usage' },
    { key: 'notes',       label: 'Notes' },
  ];

  return (
    <div className="ds-kit-panel ds-desc-panel" style={{ borderColor: border }}>
      <div className="ds-kit-panel-header" style={{ borderBottomColor: border }}>
        <span className="ds-kit-panel-title" style={{ color: textM }}>Context</span>
        <button
          className="ds-kit-panel-action"
          onClick={() => setEditing(v => !v)}
          style={{ color: editing ? brand : textM }}
        >
          {editing ? 'Done' : 'Edit'}
        </button>
      </div>
      {FIELDS.map(({ key, label }) => (
        <div key={key} className="ds-kit-field" style={{ borderBottomColor: border }}>
          <div className="ds-kit-field-label" style={{ color: textM }}>{label}</div>
          {editing ? (
            <textarea
              className="ds-kit-textarea"
              value={data[key] || ''}
              onChange={e => save(key, e.target.value)}
              style={{ color: textP, background: bgBase, borderColor: border }}
            />
          ) : (
            <p className="ds-kit-field-text" style={{ color: textP }}>{data[key]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Studio — Component Controls Panel (per-component property toggles)
// ─────────────────────────────────────────────────────────────────────────────

function ComponentControlPanel({ compId, values, onChange, brand, border, textM }) {
  const controls = COMP_CONTROLS[compId] || [];
  if (controls.length === 0) return null;

  return (
    <div className="ds-kit-panel ds-controls-panel" style={{ borderColor: border }}>
      <div className="ds-kit-panel-header" style={{ borderBottomColor: border }}>
        <span className="ds-kit-panel-title" style={{ color: textM }}>Controls</span>
      </div>
      {controls.map(ctrl => (
        <div key={ctrl.id} className="ds-kit-field" style={{ borderBottomColor: border }}>
          <div className="ds-kit-field-label" style={{ color: textM }}>{ctrl.label}</div>
          <div className="ds-kit-control-options">
            {ctrl.options.map(opt => (
              <button
                key={opt}
                className={`ds-kit-option${values[ctrl.id] === opt ? ' active' : ''}`}
                onClick={() => onChange(ctrl.id, opt)}
                style={{
                  border: `1px solid ${values[ctrl.id] === opt ? brand : border}`,
                  background: values[ctrl.id] === opt ? `${brand}18` : 'transparent',
                  color: values[ctrl.id] === opt ? brand : textM,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Studio — Component Demo Stage (renders the right demo by ID + control state)
// ─────────────────────────────────────────────────────────────────────────────

function ComponentDemoStage({ comp, controls, tokens }) {
  const { brand, border, bgCard, bgBase, textP, textM, success, error } = tokens;
  const { getIcon } = useIconOverride();

  switch (comp.id) {

    case 'button': {
      const v = controls.variant || 'primary';
      const styles = {
        primary:     { background: brand, color: '#fff', border: 'none' },
        secondary:   { background: 'transparent', color: textP, border: `1px solid ${border}` },
        ghost:       { background: 'transparent', color: brand, border: 'none' },
        destructive: { background: `${error}20`, color: error, border: `1px solid ${error}40` },
      }[v];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <LoadingButton brand={brand} textM={textM} border={border} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="ds-ex-btn" style={{ ...styles, padding: '9px 20px', borderRadius: 8, fontFamily: 'inherit', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          </div>
        </div>
      );
    }

    case 'toast':
      return <ToastDemo brand={brand} bgCard={bgCard} border={border} textP={textP} textM={textM} />;

    case 'bottom-sheet':
      return <BottomSheetDemo brand={brand} bgCard={bgCard} border={border} textP={textP} textM={textM} />;

    case 'skeleton':
      return <SkeletonDemo bgCard={bgCard} border={border} />;

    case 'badge': {
      const t = controls.type || 'Confirmed';
      const colMap = { Confirmed: success, Pending: brand, Failed: error };
      const col = colMap[t] || brand;
      return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.entries(colMap).map(([label, c]) => (
            <span key={label} className="ds-ex-badge" style={{ background: `${c}18`, color: c, borderColor: `${c}30`, fontSize: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid', fontWeight: 600 }}>
              {label}
            </span>
          ))}
        </div>
      );
    }

    case 'input':
      return <InputStatesDemo brand={brand} border={border} bgCard={bgCard} textP={textP} textM={textM} error={error} />;

    case 'token-pill': {
      const tokens_ = ['ETH','BTC','USDC','SOL'];
      return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {tokens_.map(sym => (
            <div key={sym} className="ds-ex-token-pill" style={{ background: `${brand}18`, borderColor: `${brand}30` }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: brand, opacity: 0.7 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: textP }}>{sym}</span>
              <LucideIcons.ChevronDown size={11} color={textM} strokeWidth={2} />
            </div>
          ))}
        </div>
      );
    }

    case 'pct-pills':
      return (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['25%','50%','75%','Max'].map((label, i) => (
            <button key={label} className="ds-ex-pct-pill" style={{ background: i === 1 ? brand : `${brand}15`, color: i === 1 ? '#fff' : brand, borderColor: `${brand}30` }}>
              {label}
            </button>
          ))}
        </div>
      );

    case 'token-card': {
      const tok = controls.token || 'ETH';
      const up = (controls.trend || 'up') === 'up';
      const data_ = { ETH: ['1.1421', '$4,412.82', up ? '+4.38%' : '−2.11%'], BTC: ['0.0421', '$2,800.50', up ? '+1.82%' : '−3.44%'], USDC: ['921.25', '$921.25', up ? '+0.01%' : '−0.01%'], SOL: ['12.40', '$1,240.00', up ? '+6.14%' : '−4.22%'] };
      const [bal, val, chg] = data_[tok] || data_.ETH;
      return (
        <div className="ds-ex-card" style={{ background: bgCard, borderColor: border, width: '100%', maxWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: brand, opacity: 0.2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textP }}>{tok === 'USDC' ? 'USD Coin' : tok === 'SOL' ? 'Solana' : tok === 'BTC' ? 'Bitcoin' : 'Ethereum'}</div>
              <div style={{ fontSize: 11, color: textM, marginTop: 2 }}>{bal} {tok}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: textP }}>{val}</div>
            <div style={{ fontSize: 11, color: up ? success : error, marginTop: 2 }}>{chg}</div>
          </div>
        </div>
      );
    }

    case 'swap-card':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', maxWidth: 280 }}>
          {[{ label: 'You pay', token: 'ETH', amount: '0.5', usd: '$921.25' }, { label: 'You receive', token: 'USDC', amount: '921.25', usd: '≈ $921.25' }].map(({ label, token, amount, usd }, i) => (
            <div key={label} className="ds-ex-swap-card" style={{ background: bgCard, borderColor: border }}>
              <div style={{ fontSize: 11, color: textM, marginBottom: 6 }}>{label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: textP }}>{amount}</span>
                <div className="ds-ex-token-pill" style={{ background: `${brand}18`, borderColor: `${brand}30` }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: brand, opacity: 0.7 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: textP }}>{token}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: textM, marginTop: 4 }}>{usd}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: -4 }}>
            <SwapFlipDemo brand={brand} border={border} bgCard={bgCard} textM={textM} />
          </div>
        </div>
      );

    case 'bottom-nav': {
      const active = controls.active || 'Home';
      const navItems = [
        { l: 'Home',     I: getIcon('nav-home'),     slot: 'nav-home' },
        { l: 'Explore',  I: getIcon('nav-explore'),  slot: 'nav-explore' },
        { l: 'Activity', I: getIcon('nav-activity'), slot: 'nav-activity' },
        { l: 'Swap',     I: getIcon('nav-swap'),     slot: 'nav-swap' },
      ];
      return (
        <div className="ds-ex-bottom-nav" style={{ background: bgCard, borderColor: border, width: '100%', maxWidth: 300 }}>
          {navItems.map(({ l, I }) => (
            <div key={l} className="ds-ex-nav-item" style={{ color: l === active ? brand : textM }}>
              <I size={18} color={l === active ? brand : textM} strokeWidth={l === active ? 2 : 1.5} />
              <span style={{ fontSize: 10 }}>{l}</span>
            </div>
          ))}
        </div>
      );
    }

    case 'tab-bar':
      return (
        <div className="ds-ex-tabs" style={{ background: bgCard, borderColor: border, width: '100%', maxWidth: 280 }}>
          {['Tokens','NFTs','Activity'].map((label, i) => (
            <button key={label} className="ds-ex-tab" style={{ color: i === 0 ? textP : textM, borderBottom: `2px solid ${i === 0 ? brand : 'transparent'}` }}>
              {label}
            </button>
          ))}
        </div>
      );

    case 'tx-row': {
      const type = controls.type || 'sent';
      const rows = {
        sent:     { icon: 'ArrowUpRight',   label: 'Sent ETH',        sub: 'to 0x4a3f…c12d',    amount: '−0.5 ETH',  usd: '$921.25', color: error },
        received: { icon: 'ArrowDownLeft',  label: 'Received USDC',   sub: 'from 0x8b2c…a44e',  amount: '+921.25',   usd: 'USDC',    color: success },
        swapped:  { icon: 'ArrowUpDown',    label: 'Swapped',          sub: 'ETH → USDC',         amount: '−0.5 ETH',  usd: '$921.25', color: brand },
      };
      const r = rows[type];
      const Ic = LucideIcons[r.icon] ?? LucideIcons.Circle;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: bgCard, borderRadius: 10, border: `1px solid ${border}`, width: '100%', maxWidth: 300 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${r.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Ic size={15} color={r.color} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: textP }}>{r.label}</div>
            <div style={{ fontSize: 11, color: textM, marginTop: 1 }}>{r.sub}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: type === 'received' ? success : textP }}>{r.amount}</div>
            <div style={{ fontSize: 11, color: textM }}>{r.usd}</div>
          </div>
        </div>
      );
    }

    case 'step-progress': {
      const activeStep = controls.step || 'Approve';
      const steps = ['Review', 'Approve', 'Confirm'];
      const activeIdx = steps.indexOf(activeStep);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 260 }}>
          {steps.map((label, i) => {
            const done   = i < activeIdx;
            const active = i === activeIdx;
            const pending = i > activeIdx;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: done ? success : active ? brand : 'transparent', border: `2px solid ${done ? success : active ? brand : border}`, fontSize: 11, fontWeight: 700, color: pending ? textM : '#fff' }}>
                    {done ? <LucideIcons.Check size={12} strokeWidth={3} /> : i + 1}
                  </div>
                  {i < steps.length - 1 && <div style={{ width: 2, height: 16, background: border, marginTop: 2 }} />}
                </div>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: pending ? textM : textP }}>{label}</div>
                  <div style={{ fontSize: 11, color: textM, marginTop: 1 }}>{['ETH → USDC at 1,842.50', 'Waiting for signature…', 'Est. 15–30 sec'][i]}</div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    case 'confirm-summary':
      return (
        <div style={{ background: bgCard, borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden', width: '100%', maxWidth: 300 }}>
          <div style={{ padding: '12px 14px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: textP }}>Confirm swap</span>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: `${brand}18`, color: brand }}>Preview</span>
          </div>
          <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[{ label: 'You pay', token: 'ETH', amount: '0.5000', usd: '$921.25', i: 0 }, { label: 'You receive', token: 'USDC', amount: '921.25', usd: '≈ $921.25', i: 1 }].map(({ label, token, amount, usd, i }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: i === 0 ? 'rgba(255,255,255,0.03)' : success + '08', borderRadius: 7, border: '1px solid ' + (i === 0 ? border : success + '20') }}>
                <div>
                  <div style={{ fontSize: 10, color: textM }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: i === 1 ? success : textP, marginTop: 1 }}>{amount} {token}</div>
                </div>
                <div style={{ fontSize: 11, color: textM }}>{usd}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 2px' }}>
              <span style={{ fontSize: 11, color: textM }}>Network fee</span>
              <span style={{ fontSize: 11, color: textP, fontWeight: 600 }}>~$2.40</span>
            </div>
          </div>
          <div style={{ padding: '0 14px 14px' }}>
            <button style={{ width: '100%', padding: '10px', borderRadius: 10, background: brand, border: 'none', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
              Confirm swap
            </button>
          </div>
        </div>
      );

    case 'portfolio-metric':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
          <div style={{ background: bgCard, borderRadius: 12, border: `1px solid ${border}`, padding: '18px' }}>
            <div style={{ fontSize: 11, color: textM, marginBottom: 4 }}>Total portfolio</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: textP }}>$12,891.44</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
              <LucideIcons.TrendingUp size={12} color={success} strokeWidth={2} />
              <span style={{ fontSize: 12, color: success, fontWeight: 600 }}>+$412.30</span>
              <span style={{ fontSize: 12, color: textM }}>today (+3.3%)</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[{ label: 'Assets', value: '4' }, { label: 'Chains', value: '3' }].map(({ label, value }) => (
              <div key={label} style={{ background: bgCard, borderRadius: 8, border: `1px solid ${border}`, padding: '12px 14px' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: brand }}>{value}</div>
                <div style={{ fontSize: 11, color: textM }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'wallet-chip':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: bgCard, borderRadius: 8, border: `1px solid ${border}` }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${brand}, ${success})`, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: textP, fontFamily: 'monospace', flex: 1 }}>0x4a3f…c12d</span>
            <LucideIcons.Copy size={13} color={textM} strokeWidth={1.5} style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[{ label: 'Ethereum', color: '#627EEA' }, { label: 'Polygon', color: '#8247E5' }, { label: 'Arbitrum', color: '#28A0F0' }, { label: 'Base', color: '#0052FF' }].map(({ label, color }) => (
              <span key={label} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: `${color}18`, color, border: `1px solid ${color}30`, fontWeight: 600 }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      );

    default:
      return <div style={{ color: textM, fontSize: 13 }}>Demo coming soon</div>;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Studio — Component Inspector
// ─────────────────────────────────────────────────────────────────────────────

function ComponentInspector({ comp, onClose }) {
  const { getToken } = useTokenOverride();
  const brand   = getToken('--bk-brand-primary');
  const border  = getToken('--bk-border-subtle');
  const bgCard  = getToken('--bk-bg-card');
  const bgBase  = getToken('--bk-bg-base');
  const textP   = getToken('--bk-text-primary');
  const textM   = getToken('--bk-text-muted');
  const success = getToken('--bk-success');
  const error   = getToken('--bk-error');

  const defaultControls = (COMP_CONTROLS[comp.id] || []).reduce((acc, c) => ({ ...acc, [c.id]: c.def }), {});
  const [ctrlValues, setCtrlValues] = useState(defaultControls);

  // Reset controls when component changes
  useEffect(() => {
    setCtrlValues((COMP_CONTROLS[comp.id] || []).reduce((acc, c) => ({ ...acc, [c.id]: c.def }), {}));
  }, [comp.id]);

  const tokens = { brand, border, bgCard, bgBase, textP, textM, success, error };

  return (
    <motion.div
      className="ds-comp-inspector"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {/* Inspector header */}
      <div className="ds-inspector-header" style={{ borderBottomColor: border }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="ds-inspector-group" style={{ color: textM }}>{comp.group}</span>
          <span style={{ color: border }}>·</span>
          <span className="ds-inspector-name" style={{ color: textP }}>{comp.name}</span>
        </div>
        <button
          className="ds-inspector-close"
          onClick={onClose}
          style={{ color: textM, borderColor: border }}
          title="Back to preview"
        >
          <LucideIcons.X size={13} strokeWidth={2} />
          <span>Preview</span>
        </button>
      </div>

      {/* Inspector body */}
      <div className="ds-inspector-body">
        {/* Demo stage */}
        <div className="ds-comp-stage" style={{ borderColor: border }}>
          <ComponentDemoStage comp={comp} controls={ctrlValues} tokens={tokens} />
        </div>

        {/* Right panel — controls + description */}
        <div className="ds-inspector-right">
          <ComponentControlPanel
            compId={comp.id}
            values={ctrlValues}
            onChange={(id, val) => setCtrlValues(prev => ({ ...prev, [id]: val }))}
            brand={brand} border={border} textM={textM}
          />
          <DescriptionPanel
            comp={comp}
            brand={brand} border={border} bgBase={bgBase} textP={textP} textM={textM}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Tokens
// ─────────────────────────────────────────────────────────────────────────────

function ThemesPanel() {
  const { themes, saveTheme, loadTheme, loadBuiltinTheme, deleteTheme, hasDraft, getToken } = useTokenOverride();
  const [newName, setNewName] = useState('');
  const brand  = getToken('--bk-brand-primary');
  const bgCard = getToken('--bk-bg-card');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textM  = getToken('--bk-text-muted');
  const success = getToken('--bk-success');

  const themeList = Object.keys(themes);

  function handleSave() {
    const name = newName.trim();
    if (!name) return;
    saveTheme(name);
    setNewName('');
  }

  return (
    <div className="ds-themes-panel" style={{ borderColor: border }}>
      <div className="ds-themes-title" style={{ color: textM }}>Built-in</div>
      <div className="ds-theme-list">
        {Object.keys(BUILTIN_THEMES).map(name => (
          <div key={name} className="ds-theme-row" style={{ borderColor: border }}>
            <span className="ds-theme-name" style={{ color: textP }}>
              {name === 'Dark' && <LucideIcons.Moon size={11} strokeWidth={2} style={{ marginRight: 5, opacity: 0.6 }} />}
              {name === 'Light' && <LucideIcons.Sun size={11} strokeWidth={2} style={{ marginRight: 5, opacity: 0.6 }} />}
              {name}
            </span>
            <button className="ds-theme-load" onClick={() => loadBuiltinTheme(name)} style={{ color: brand, borderColor: `${brand}30` }}>
              Load
            </button>
          </div>
        ))}
      </div>
      <div className="ds-themes-title" style={{ color: textM, marginTop: 12 }}>Saved themes</div>
      {themeList.length === 0 && (
        <div className="ds-themes-empty" style={{ color: textM }}>No themes saved yet</div>
      )}
      {themeList.map(name => (
        <div key={name} className="ds-theme-row" style={{ borderColor: border }}>
          <div className="ds-theme-swatch" style={{ background: themes[name]['--bk-brand-primary'] || brand }} />
          <span className="ds-theme-name" style={{ color: textP }}>{name}</span>
          <button className="ds-theme-btn ds-theme-load" onClick={() => loadTheme(name)} style={{ color: brand, borderColor: `${brand}30` }}>
            Load
          </button>
          <button className="ds-theme-btn ds-theme-del" onClick={() => deleteTheme(name)} style={{ color: textM, borderColor: border }}>
            ✕
          </button>
        </div>
      ))}
      <div className="ds-theme-save-row">
        <input
          className="ds-theme-input"
          placeholder="Theme name…"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          style={{ background: bgCard, borderColor: border, color: textP }}
        />
        <button
          className="ds-theme-save-btn"
          onClick={handleSave}
          disabled={!newName.trim()}
          style={{ background: brand, opacity: newName.trim() ? 1 : 0.4 }}
        >
          Save theme
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Accordion group component (used in TokensSection)
// ─────────────────────────────────────────────────────────────────────────────

function AccordionGroup({ group, isOpen, onToggle }) {
  const { getToken } = useTokenOverride();
  const groupTokens  = TOKEN_DEFINITIONS.filter(t => t.group === group);
  const colorTokens  = groupTokens.filter(t => t.type === 'color');
  const modifiedCount = groupTokens.filter(t =>
    getToken(t.key) !== t.default
  ).length;

  return (
    <div className={`ds-accordion-group${isOpen ? ' open' : ''}`}>
      <button className="ds-accordion-header" onClick={onToggle}>
        <span className="ds-accordion-label">{group}</span>

        {/* Colour preview dots — visible when collapsed */}
        {colorTokens.length > 0 && !isOpen && (
          <div className="ds-accordion-dots">
            {colorTokens.slice(0, 6).map(t => (
              <span key={t.key} className="ds-accordion-dot" style={{ background: getToken(t.key) }} />
            ))}
          </div>
        )}

        {modifiedCount > 0 && (
          <span className="ds-accordion-badge">{modifiedCount}</span>
        )}

        <motion.span
          className="ds-accordion-chevron"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="ds-accordion-body"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {groupTokens.map(token => token.type === 'color'
              ? <ColourToken key={token.key} token={token} />
              : <DurationToken key={token.key} token={token} />
            )}
            {group === 'Motion' && <MotionDemos />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function StudioSection() {
  const { resetToDefaults, getToken } = useTokenOverride();
  const [openPanel,    setOpenPanel]    = useState('Brand');
  const [activeScreen, setActiveScreen] = useState('/');
  const [showThemes,   setShowThemes]   = useState(false);
  const [fullscreen,   setFullscreen]   = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);
  const [versionMode,  setVersionMode]  = useState('v2'); // 'v1' | 'v2' | 'compare'
  const [phoneTheme,   setPhoneTheme]   = useState('dark'); // 'dark' | 'light'

  const brand  = getToken('--bk-brand-primary');
  const bgBase = getToken('--bk-bg-base');
  const border = getToken('--bk-border-subtle');
  const textM  = getToken('--bk-text-muted');

  // ESC exits fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    function onKey(e) { if (e.key === 'Escape') setFullscreen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen]);

  const VERSION_TABS = [
    { id: 'v1',      label: 'V1' },
    { id: 'v2',      label: 'V2' },
    { id: 'compare', label: 'Compare' },
  ];

  const activeRoutes = versionMode === 'v1' ? PREVIEW_ROUTES_V1 : PREVIEW_ROUTES;

  const showcaseContent = (
    <>
      <div className="ds-showcase-glow" />

      <div className="ds-showcase-topbar">
        {/* Screen tabs — hidden in compare mode (shown per-phone instead) */}
        {versionMode !== 'compare' && (
          <div className="ds-screen-tabs ds-screen-tabs-showcase">
            {PREVIEW_SCREENS.map(s => (
              <button
                key={s.path}
                className={`ds-screen-tab${activeScreen === s.path ? ' active' : ''}`}
                onClick={() => setActiveScreen(s.path)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Version toggle */}
        <div className="ds-version-toggle">
          {VERSION_TABS.map(v => (
            <button
              key={v.id}
              className={`ds-version-tab${versionMode === v.id ? ' active' : ''}`}
              onClick={() => setVersionMode(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="ds-showcase-actions">
          {/* Phone theme toggle */}
          <div className="ds-phone-theme-toggle">
            <button
              className={`ds-phone-theme-btn${phoneTheme === 'dark' ? ' active' : ''}`}
              onClick={() => setPhoneTheme('dark')}
              title="Dark"
              style={{ borderColor: border, color: phoneTheme === 'dark' ? brand : textM }}
            >
              <LucideIcons.Moon size={12} strokeWidth={2} />
            </button>
            <button
              className={`ds-phone-theme-btn${phoneTheme === 'light' ? ' active' : ''}`}
              onClick={() => setPhoneTheme('light')}
              title="Light"
              style={{ borderColor: border, color: phoneTheme === 'light' ? brand : textM }}
            >
              <LucideIcons.Sun size={12} strokeWidth={2} />
            </button>
          </div>
          {/* Fullscreen button */}
          <button
            className="ds-showcase-action-btn ds-showcase-fullscreen-btn"
            onClick={() => setFullscreen(v => !v)}
            title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
            style={{ borderColor: border, color: textM, background: 'transparent' }}
          >
            {fullscreen
              ? <LucideIcons.Minimize2 size={13} strokeWidth={2} />
              : <LucideIcons.Maximize2 size={13} strokeWidth={2} />
            }
          </button>
        </div>
      </div>

      {versionMode === 'compare' ? (
        /* ── Compare: two phones side by side ── */
        <div className="ds-compare-stage">
          {/* Screen tabs shared for compare mode */}
          <div className="ds-screen-tabs ds-screen-tabs-showcase ds-compare-screen-tabs">
            {PREVIEW_SCREENS.map(s => (
              <button
                key={s.path}
                className={`ds-screen-tab${activeScreen === s.path ? ' active' : ''}`}
                onClick={() => setActiveScreen(s.path)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="ds-compare-phones-row">
            <div className="ds-compare-phone">
              <PhonePreview screen={activeScreen} routes={PREVIEW_ROUTES_V1} theme={phoneTheme} />
              <div className="ds-compare-label">V1</div>
            </div>
            <div className="ds-compare-phone">
              <PhonePreview screen={activeScreen} routes={PREVIEW_ROUTES} theme={phoneTheme} />
              <div className="ds-compare-label">V2</div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Single phone ── */
        <div className="ds-showcase-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeScreen}-${versionMode}`}
              className="ds-showcase-phone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.18 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <PhonePreview screen={activeScreen} routes={activeRoutes} theme={phoneTheme} />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </>
  );

  return (
    <div className="ds-tokens-studio">

      <div className="ds-tokens-studio-body">

        {/* ── Left: Styling panel ── */}
        <div className="ds-tokens-panel">
          <div className="ds-token-accordion">
            {TOKEN_GROUPS.map(group => (
              <AccordionGroup
                key={group}
                group={group}
                isOpen={openPanel === group}
                onToggle={() => setOpenPanel(openPanel === group ? null : group)}
              />
            ))}
            <IconsAccordionGroup
              isOpen={openPanel === 'iconslots'}
              onToggle={() => setOpenPanel(openPanel === 'iconslots' ? null : 'iconslots')}
            />
          </div>

          <div className="ds-token-footer">
            <button
              className="ds-footer-btn ds-themes-toggle"
              onClick={() => setShowThemes(v => !v)}
              style={{ color: brand, borderColor: `${brand}30` }}
            >
              {showThemes ? 'Hide themes' : '⊕ Themes'}
            </button>
            <button className="ds-footer-btn ds-reset-defaults-btn" onClick={resetToDefaults}>
              Reset to defaults
            </button>
          </div>
          {showThemes && <ThemesPanel />}
        </div>

        {/* ── Centre: phone showcase or component inspector ── */}
        <div className="ds-tokens-showcase">
          <AnimatePresence mode="wait">
            {selectedComp ? (
              <ComponentInspector
                key={selectedComp}
                comp={COMPONENT_REGISTRY.find(c => c.id === selectedComp)}
                onClose={() => setSelectedComp(null)}
              />
            ) : (
              <motion.div
                key="showcase"
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 12 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {showcaseContent}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Component selector ── */}
        <div className="ds-comp-panel">
          <div className="ds-comp-panel-header" style={{ borderBottomColor: border }}>
            <span className="ds-comp-panel-title" style={{ color: textM }}>Components</span>
            <span className="ds-comp-list-count" style={{ color: textM }}>{COMPONENT_REGISTRY.length}</span>
          </div>
          {selectedComp ? (
            <button
              className="ds-comp-panel-back"
              onClick={() => setSelectedComp(null)}
              style={{ color: brand, borderBottomColor: border }}
            >
              <LucideIcons.ArrowLeft size={12} strokeWidth={2.5} />
              Back to preview
            </button>
          ) : null}
          <ComponentList
            selected={selectedComp}
            onSelect={id => setSelectedComp(id)}
            openPanel={openPanel}
            setOpenPanel={setOpenPanel}
            brand={brand} border={border} textP={getToken('--bk-text-primary')} textM={textM}
          />
        </div>

      </div>

      {/* ── Fullscreen overlay ── */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="ds-proto-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ background: bgBase }}
          >
            <div className="ds-proto-fullscreen-inner">
              {showcaseContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive demo subcomponents (used by ComponentDemoStage)
// ─────────────────────────────────────────────────────────────────────────────
function LoadingButton({ brand, textM, border }) {
  const [state, setState] = useState('idle'); // idle | loading | done
  function trigger() {
    if (state !== 'idle') return;
    setState('loading');
    setTimeout(() => { setState('done'); setTimeout(() => setState('idle'), 1400); }, 1600);
  }
  return (
    <button
      className={`ds-ex-btn ds-ex-btn-primary ds-ex-btn-interactive${state !== 'idle' ? ` ds-ex-btn-${state}` : ''}`}
      onClick={trigger}
      style={{ background: state === 'done' ? '#22c55e' : brand, minWidth: 120 }}
    >
      {state === 'loading' && (
        <svg width="14" height="14" viewBox="0 0 14 14" className="ds-ai-spin" style={{ marginRight: 6 }}>
          <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" />
          <circle cx="7" cy="7" r="5" stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="16 16" />
        </svg>
      )}
      {state === 'idle' && 'Confirm swap'}
      {state === 'loading' && 'Processing…'}
      {state === 'done' && '✓ Swapped'}
    </button>
  );
}

function ToastDemo({ brand, bgCard, border, textP, textM }) {
  const [toasts, setToasts] = useState([]);
  function fire(type) {
    const id = Date.now();
    const config = {
      success: { label: 'Swap confirmed', sub: '0.5 ETH → 921.25 USDC', color: '#22c55e' },
      pending: { label: 'Transaction pending', sub: 'Waiting for confirmation…', color: brand },
      error:   { label: 'Transaction failed', sub: 'Slippage too high', color: '#ef4444' },
    }[type];
    setToasts(prev => [...prev, { id, ...config }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['success','pending','error'].map(t => (
          <button key={t} className="ds-ex-btn ds-ex-btn-secondary" onClick={() => fire(t)}
            style={{ borderColor: border, color: textP, fontSize: 12, padding: '6px 12px' }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 38, left: 0, width: '100%', zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              style={{ background: bgCard, border: `1px solid ${t.color}30`, borderLeft: `3px solid ${t.color}`, borderRadius: 8, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: textP }}>{t.label}</span>
              <span style={{ fontSize: 11, color: textM }}>{t.sub}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BottomSheetDemo({ brand, bgCard, border, textP, textM }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 80, borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: `1px solid ${border}` }}>
      <button className="ds-ex-btn ds-ex-btn-secondary" onClick={() => setOpen(true)}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderColor: border, color: textP, fontSize: 12, padding: '6px 14px' }}>
        Select token
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: bgCard, borderTop: `1px solid ${border}`, borderRadius: '10px 10px 0 0', padding: '12px 16px', zIndex: 5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: textP }}>Select token</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: textM, cursor: 'pointer', fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
            </div>
            {[['ETH','Ethereum'], ['BTC','Bitcoin'], ['USDC','USD Coin']].map(([sym, name]) => (
              <div key={sym} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: brand, opacity: 0.3 }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: textP }}>{sym}</div>
                  <div style={{ fontSize: 10, color: textM }}>{name}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SkeletonDemo({ bgCard, border }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!loaded) { const t = setTimeout(() => setLoaded(true), 1800); return () => clearTimeout(t); }
  }, [loaded]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <button className="ds-ex-btn ds-ex-btn-secondary" onClick={() => setLoaded(false)}
        style={{ fontSize: 11, borderColor: border, color: '#888', padding: '4px 10px', alignSelf: 'flex-start', marginBottom: 2 }}>
        replay
      </button>
      <AnimatePresence mode="wait">
        {!loaded ? (
          <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[80, 120, 60].map((w, i) => (
              <div key={i} className="ds-skeleton" style={{ width: w, height: 12, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>$12,891.44</div>
            <div style={{ fontSize: 11, color: '#22c55e' }}>+$412.30 today (+3.3%)</div>
            <div style={{ fontSize: 10, color: '#666' }}>4 assets across 3 chains</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SwapFlipDemo({ brand, border, bgCard, textM }) {
  const [flipped, setFlipped] = useState(false);
  const pairs = flipped ? ['USDC', 'ETH'] : ['ETH', 'USDC'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <div style={{ fontSize: 12, padding: '6px 14px', background: bgCard, borderRadius: 8, border: `1px solid ${border}`, color: '#fff', fontWeight: 600 }}>{pairs[0]}</div>
      <motion.button
        onClick={() => setFlipped(v => !v)}
        style={{ width: 32, height: 32, borderRadius: '50%', background: `${brand}20`, border: `1px solid ${brand}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.span animate={{ rotate: flipped ? 180 : 0 }} transition={{ type: 'spring', damping: 18, stiffness: 300 }} style={{ display: 'flex' }}>
          <LucideIcons.ArrowUpDown size={14} color={brand} strokeWidth={2} />
        </motion.span>
      </motion.button>
      <div style={{ fontSize: 12, padding: '6px 14px', background: bgCard, borderRadius: 8, border: `1px solid ${border}`, color: '#fff', fontWeight: 600 }}>{pairs[1]}</div>
    </div>
  );
}

function InputStatesDemo({ brand, border, bgCard, textP, textM, error }) {
  const [val, setVal] = useState('');
  const [focused, setFocused] = useState(false);
  const isError = val.length > 0 && val.length < 8;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="0x wallet address"
          style={{
            width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${isError ? error : focused ? brand : border}`,
            background: bgCard, color: textP, fontSize: 12, outline: 'none', boxSizing: 'border-box',
            boxShadow: focused && !isError ? `0 0 0 3px ${brand}20` : isError ? `0 0 0 3px ${error}15` : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        />
      </div>
      {isError && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 11, color: error, display: 'flex', alignItems: 'center', gap: 4 }}>
          <LucideIcons.AlertCircle size={11} color={error} /> Address too short
        </motion.div>
      )}
      {!val && <div style={{ fontSize: 11, color: textM }}>Focus the input to see states</div>}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// Section: Principles
// ─────────────────────────────────────────────────────────────────────────────

const DESIGN_PRINCIPLES = [
  {
    number: '01',
    title: 'Trust through transparency',
    body: 'Every number is real, every action is reversible, every state is visible. We never hide complexity — we make it legible.',
    examples: ['Show exact exchange rates', 'Confirm before destructive actions', 'Surface fees before confirmation'],
  },
  {
    number: '02',
    title: 'Speed is a feature',
    body: 'DeFi moves fast. Our UI keeps up. Interactions feel instant, transitions are purposeful, and we never make users wait for feedback.',
    examples: ['Optimistic UI updates', 'Sub-200ms perceived latency', 'Motion that informs, not decorates'],
  },
  {
    number: '03',
    title: 'One action per screen',
    body: 'Complexity lives in the system, not the interface. Each screen has one primary action. The user always knows what to do next.',
    examples: ['Single CTA per screen', 'Progressive disclosure', 'Context, not configuration'],
  },
  {
    number: '04',
    title: 'Mobile-first, always',
    body: 'Most crypto decisions happen on mobile. We design for thumbs, small screens, and intermittent attention. Desktop is an enhancement.',
    examples: ['44px minimum touch targets', 'Bottom-anchored CTAs', 'Readable at arm\'s length'],
  },
];

const ACCESSIBILITY_STANDARDS = [
  { standard: 'WCAG 2.1 AA', detail: 'Minimum contrast 4.5:1 for text, 3:1 for UI components' },
  { standard: 'React ARIA', detail: 'All interactive elements use accessible components from react-aria' },
  { standard: 'Keyboard nav', detail: 'Full keyboard navigation with visible focus indicators' },
  { standard: 'Screen readers', detail: 'Semantic HTML, ARIA labels, live regions for dynamic content' },
  { standard: '44px touch', detail: 'Minimum 44×44px touch targets on all interactive elements' },
];

function PrinciplesSection() {
  const { getToken } = useTokenOverride();
  const brand  = getToken('--bk-brand-primary');
  const bgCard = getToken('--bk-bg-card');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textS  = getToken('--bk-text-secondary');
  const textM  = getToken('--bk-text-muted');
  const success = getToken('--bk-success');

  return (
    <div className="ds-brand-editorial">
      <div className="ds-section-intro">
        <div className="ds-editorial-label">03 — Rules</div>
        <h2 className="ds-section-intro-title">Not guidelines.<br />Constraints.</h2>
        <p className="ds-section-intro-desc">
          Four rules that govern every decision at Modulo — from icon sizing to information architecture.
        </p>
      </div>

      {DESIGN_PRINCIPLES.map(({ number, title, body, examples }) => (
        <div key={number} className="ds-editorial-block ds-principle-row">
          <div className="ds-principle-row-number">{number}</div>
          <div className="ds-principle-row-content">
            <h3 className="ds-principle-row-title" style={{ color: textP }}>{title}</h3>
            <p className="ds-principle-row-body" style={{ color: textS }}>{body}</p>
            <div className="ds-principle-row-examples">
              {examples.map(ex => (
                <span key={ex} className="ds-principle-example-tag" style={{ color: brand, background: `${brand}10`, borderColor: `${brand}25` }}>
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="ds-editorial-block">
        <div className="ds-editorial-label">Accessibility Standards</div>
        <div className="ds-access-list">
          {ACCESSIBILITY_STANDARDS.map(({ standard, detail }) => (
            <div key={standard} className="ds-access-row" style={{ borderColor: `rgba(255,255,255,0.06)` }}>
              <div className="ds-access-check" style={{ color: success }}>✓</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: textP }}>{standard}</div>
                <div style={{ fontSize: 13, color: textM, marginTop: 3 }}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ds-editorial-block">
        <div className="ds-editorial-label">UX Standards</div>
        <div className="ds-standards-grid">
          {[
            { label: 'Loading states',      desc: 'Skeleton screens, not spinners. Always show structure.' },
            { label: 'Empty states',        desc: 'Every empty state has a clear next action.' },
            { label: 'Error messages',      desc: 'Human language. Say what happened. Say what to do.' },
            { label: 'Success feedback',    desc: 'Confirm completion. Name the action that succeeded.' },
            { label: 'Destructive actions', desc: 'Always require confirmation. Never undo without warning.' },
            { label: 'Numerical display',   desc: 'Significant figures appropriate to context. Never truncate values.' },
          ].map(({ label, desc }) => (
            <div key={label} className="ds-standard-chip" style={{ background: bgCard, borderColor: border }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: brand, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: textM, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section: Agent Brief
// ─────────────────────────────────────────────────────────────────────────────

function CopyBlock({ label, content }) {
  const [copied, setCopied] = useState(false);
  const { getToken } = useTokenOverride();
  const brand  = getToken('--bk-brand-primary');
  const bgCard = getToken('--bk-bg-card');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textM  = getToken('--bk-text-muted');

  function copy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="ds-copy-block" style={{ background: bgCard, borderColor: border }}>
      <div className="ds-copy-block-header">
        <span style={{ fontSize: 12, fontWeight: 600, color: textM }}>{label}</span>
        <button className="ds-copy-btn" onClick={copy} style={{ color: copied ? getToken('--bk-success') : brand }}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="ds-copy-pre" style={{ color: textP }}>{content}</pre>
    </div>
  );
}

function AgentBriefSection() {
  const { getToken, overrides } = useTokenOverride();
  const brand  = getToken('--bk-brand-primary');
  const bgBase = getToken('--bk-bg-base');
  const bgCard = getToken('--bk-bg-card');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textS  = getToken('--bk-text-secondary');
  const textM  = getToken('--bk-text-muted');

  // Build token manifest from current values
  const tokenManifest = TOKEN_DEFINITIONS.reduce((acc, t) => {
    acc[t.key] = getToken(t.key);
    return acc;
  }, {});

  const systemPrompt = `You are a UI builder for Modulo, a cross-chain DeFi platform.
Brand: "One vault, every chain."
Voice: Clear, confident, precise, calm. Never use jargon without explanation.

Design constraints:
- Dark-first UI using CSS custom properties (--bk-* tokens)
- Mobile-first, 390px viewport, WCAG 2.1 AA minimum
- All interactive elements must use React ARIA components
- Primary CTA colour: ${brand}
- App background: ${getToken('--bk-bg-base')}
- Text primary: ${getToken('--bk-text-primary')}
- Never hardcode hex values — always use --bk-* token variables
- One primary action per screen
- 44px minimum touch targets

Component stack: react-aria-components → BakeKit tokens → product components
Typography: Inter, weights 400/500/600/700

Screens available: Home, Swap, SwapSelect, Explore, Send, Receive
Navigation: React Router v7 HashRouter, bottom navigation bar

When building a new screen:
1. Import tokens via CSS custom properties
2. Use Button from react-aria-components for all interactive elements
3. Include StatusBar and BottomNav components
4. Follow the pattern in existing screens (HomeScreen.jsx, SwapScreen.jsx)`;

  const tokenJSON = JSON.stringify(tokenManifest, null, 2);

  const componentInventory = `// Modulo / BakeKit Component Inventory
// All components are React ARIA-based and token-driven.

// Screens
HomeScreen       — portfolio overview, token list, action row
SwapScreen       — token swap interface with numpad
SwapSelectScreen — token selection sheet
ExploreScreen    — market discovery
SendScreen       — send tokens with address input
ReceiveScreen    — QR code + wallet address

// Shared
StatusBar        — iOS-style status bar (time, signal, battery)
BottomNav        — 4-item bottom navigation (Home, Explore, Activity, Swap)

// Atoms (BakeKit)
Button           — react-aria Button, variants: primary / secondary / ghost / destructive
TokenPill        — token selector chip (icon + symbol + chevron)
PercentagePill   — amount preset button (25% / 50% / 75% / Max)
NumpadKey        — single numpad key
SwapCard         — pay/receive card surface
PortfolioCard    — portfolio value display with chart
TokenRow         — token list item (icon, name, amount, value, change)`;

  return (
    <div className="ds-brand-editorial">
      <div className="ds-section-intro">
        <div className="ds-editorial-label">04 — Brief</div>
        <h2 className="ds-section-intro-title">Design without<br />a designer.</h2>
        <p className="ds-section-intro-desc">
          Context blocks any AI agent needs to build compliant Modulo UI on demand — no designer required,
          no brand drift at scale.
        </p>
      </div>

      <div className="ds-editorial-block">
        <div className="ds-agent-callout-row">
          {[
            { title: 'Brand-safe generation',  body: 'Any agent building Modulo UI uses these tokens and constraints. Zero brand drift at scale.' },
            { title: 'No designer bottleneck', body: 'Teams ship new screens without waiting for design review — the system enforces standards.' },
            { title: 'Consistent everywhere',  body: 'From prototype to production, every surface uses the same token system. One change, everywhere.' },
            { title: 'Shareable brand spec',   body: 'Send the system prompt to any agency, contractor, or AI tool. They start on-brand immediately.' },
          ].map(({ title, body }) => (
            <div key={title} className="ds-agent-callout">
              <div className="ds-agent-callout-title" style={{ color: textP }}>{title}</div>
              <div className="ds-agent-callout-body" style={{ color: textM }}>{body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ds-editorial-block">
        <div className="ds-editorial-label">Context blocks</div>
        <div className="ds-copy-blocks">
          <CopyBlock
            label="SYSTEM PROMPT — paste into any AI agent, Cursor, or Claude"
            content={systemPrompt}
          />
          <CopyBlock
            label="TOKEN MANIFEST — current token values as JSON"
            content={tokenJSON}
          />
          <CopyBlock
            label="COMPONENT INVENTORY — available components and their roles"
            content={componentInventory}
          />
        </div>
      </div>

      <div className="ds-editorial-block">
        <div className="ds-editorial-label">About Modulo</div>
        <div className="ds-company-block" style={{ background: bgCard, borderColor: border }}>
          <div className="ds-company-logo-row">
            <img src={logoModulo} alt="Modulo" height="18" />
            <span className="ds-company-tag" style={{ background: `${brand}15`, color: brand }}>DeFi · Cross-chain</span>
          </div>
          <p className="ds-company-desc" style={{ color: textS }}>
            Modulo is a cross-chain DeFi platform that unifies token management across every major chain.
            One vault, one interface — swap, send, receive, and earn across Ethereum, Solana, and beyond.
          </p>
          <div className="ds-company-props">
            <div className="ds-company-prop" style={{ borderColor: border }}>
              <div style={{ fontSize: 11, color: textM, marginBottom: 3 }}>Value proposition</div>
              <div style={{ fontSize: 13, color: textP }}>Eliminate multi-wallet friction for DeFi users</div>
            </div>
            <div className="ds-company-prop" style={{ borderColor: border }}>
              <div style={{ fontSize: 11, color: textM, marginBottom: 3 }}>Primary audience</div>
              <div style={{ fontSize: 13, color: textP }}>DeFi-intermediate users managing 3+ tokens</div>
            </div>
            <div className="ds-company-prop" style={{ borderColor: border }}>
              <div style={{ fontSize: 11, color: textM, marginBottom: 3 }}>Design partner</div>
              <div style={{ fontSize: 13, color: textP }}>Built with BakedUX / Fully Baked methodology</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

export default function DesignSystemPage({ onBack }) {
  const { overrides, hasDraft, draft, saveOverrides, discardChanges, getToken } = useTokenOverride();
  const [activeSection, setActiveSection] = useState('brand');
  const overrideCount = Object.keys(overrides).length;
  const draftCount    = Object.keys(draft).length;
  const brand         = getToken('--bk-brand-primary');

  // Override viewport so DS page isn't locked to 390px phone width
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    const original = meta?.getAttribute('content');
    if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1.0');
    return () => { if (meta && original) meta.setAttribute('content', original); };
  }, []);

  const sections = {
    brand:  <BrandSection />,
    studio: <StudioSection />,
    rules:  <PrinciplesSection />,
    brief:  <AgentBriefSection />,
  };

  return (
    <div className="ds-page">
      <header className="ds-header">
        <div className="ds-header-left">
          <button className="ds-back-btn" onClick={onBack}>← App</button>
          <img src={logoModulo} alt="Modulo" height="15" style={{ opacity: 0.55 }} />
        </div>
        <div className="ds-header-right">
          {/* Save bar — only when there are unsaved token changes */}
          <AnimatePresence>
            {hasDraft && (
              <motion.div
                className="ds-save-bar-inline"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
              >
                <span className="ds-save-bar-inline-label">
                  {draftCount} unsaved
                </span>
                <button className="ds-discard-btn" onClick={discardChanges}>Discard</button>
                <button className="ds-save-btn" onClick={saveOverrides} style={{ background: brand }}>Save</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <nav className="ds-tab-bar">
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            className={`ds-tab-item${activeSection === id ? ' active' : ''}`}
            onClick={() => setActiveSection(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="ds-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="ds-content-inner"
          >
            {sections[activeSection]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
