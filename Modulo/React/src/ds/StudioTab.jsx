/**
 * StudioTab — interactive design playground.
 * Layout: phone preview (centre) + sidebar (right, desktop only).
 * Sidebar: theme presets, 8 key token tweaks, component gallery.
 * Component gallery: click a card → overlay sheet with demo + spec.
 */
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { COMPONENT_REGISTRY, COMP_CONTROLS, COMP_GROUPS } from './component-registry';
import { TOKEN_DEFINITIONS, BUILTIN_THEMES, useTokenOverride } from '../TokenOverrideContext';
import { useIconOverride } from '../IconOverrideContext';
import { Switch, Tabs, TabList, Tab, TabPanel, Dialog } from 'react-aria-components';
import {
  ScreenHeader, AppButton, BottomSheet, TokenPill,
  FinancialInputCard, StatusCard, AssetRow,
  TransactionPath, FeeBreakdown, LTVBar, AuditBadge,
} from '../components';

// ─────────────────────────────────────────────────────────────────────────────
// Key tokens shown in sidebar (8 most impactful)
// ─────────────────────────────────────────────────────────────────────────────

const SIDEBAR_TOKENS = [
  '--bk-brand-primary',
  '--bk-bg-base',
  '--bk-bg-card',
  '--bk-text-primary',
  '--bk-text-muted',
  '--bk-border-subtle',
  '--bk-success',
  '--bk-error',
];

// ─────────────────────────────────────────────────────────────────────────────
// Component demo subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function LoadingButton({ brand }) {
  const [state, setState] = useState('idle');
  function trigger() {
    if (state !== 'idle') return;
    setState('loading');
    setTimeout(() => { setState('done'); setTimeout(() => setState('idle'), 1400); }, 1600);
  }
  return (
    <button
      onClick={trigger}
      style={{
        background: state === 'done' ? 'var(--bk-success)' : brand,
        color: '#fff',
        border: 'none',
        borderRadius: 10,
        padding: '9px 20px',
        fontFamily: 'inherit',
        fontWeight: 600,
        fontSize: 13,
        cursor: 'pointer',
        minWidth: 130,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      {state === 'loading' && (
        <svg width="13" height="13" viewBox="0 0 14 14" className="ds-ai-spin">
          <circle cx="7" cy="7" r="5" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
          <circle cx="7" cy="7" r="5" stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="16 16" />
        </svg>
      )}
      {state === 'idle' && 'Confirm swap'}
      {state === 'loading' && 'Processing…'}
      {state === 'done' && '✓ Swapped'}
    </button>
  );
}

function BottomSheetDemo({ brand, bgCard, border, textP, textM }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 76, borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: `1px solid ${border}`, width: '100%', maxWidth: 280 }}>
      <button className="ds-ex-btn ds-ex-btn-secondary" onClick={() => setOpen(true)}
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', borderColor: border, color: textP, fontSize: 12, padding: '6px 14px' }}>
        Select token
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: bgCard, borderTop: `1px solid ${border}`, borderRadius: '10px 10px 0 0', padding: '10px 14px', zIndex: 5 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: textP }}>Select token</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: textM, cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
            </div>
            {[['ETH','Ethereum'], ['BTC','Bitcoin'], ['USDC','USD Coin']].map(([sym, name]) => (
              <div key={sym} onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 0', cursor: 'pointer' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: brand, opacity: 0.3 }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: textP }}>{sym}</div>
                <div style={{ fontSize: 10, color: textM }}>{name}</div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputStatesDemo({ brand, border, bgCard, textP, textM }) {
  const [val, setVal] = useState('');
  const [focused, setFocused] = useState(false);
  const isError = val.length > 0 && val.length < 8;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: '100%', maxWidth: 260 }}>
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="0x wallet address"
        style={{
          width: '100%', padding: '8px 12px', borderRadius: 8,
          border: `1px solid ${isError ? 'var(--bk-error)' : focused ? brand : border}`,
          background: bgCard, color: textP, fontSize: 12, outline: 'none', boxSizing: 'border-box',
          boxShadow: focused && !isError ? `0 0 0 3px ${brand}20` : isError ? `0 0 0 3px rgba(240,67,72,0.12)` : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      />
      {isError && (
        <motion.div initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 11, color: 'var(--bk-error)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <LucideIcons.AlertCircle size={11} /> Address too short
        </motion.div>
      )}
      {!val && <div style={{ fontSize: 11, color: textM }}>Focus the input to see states</div>}
    </div>
  );
}

// ── Motion demos (shown for motion tokens) ──────────────────────────────────

const MOTION_DEMOS = [
  { key: '--bk-motion-fast',     label: 'Fast',     desc: 'Hover, selection, micro-transitions' },
  { key: '--bk-motion-standard', label: 'Standard', desc: 'Screen transitions, appearing elements' },
  { key: '--bk-motion-slow',     label: 'Slow',     desc: 'Complex layouts, reveals' },
];

const SPRING_PRESETS = [
  { label: 'Default spring', config: { type: 'spring', damping: 18, stiffness: 260, mass: 0.6 } },
  { label: 'Tight spring',   config: { type: 'spring', damping: 22, stiffness: 340, mass: 0.5 } },
  { label: 'Bouncy spring',  config: { type: 'spring', damping: 10, stiffness: 200, mass: 0.8 } },
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
        <motion.div className="ds-motion-ball" animate={{ x: playing ? 80 : 0 }} transition={{ duration: ms / 1000, ease: 'easeInOut' }} />
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
        <div className="ds-motion-desc" style={{ fontFamily: 'monospace', fontSize: 9 }}>
          d:{config.damping} k:{config.stiffness}
        </div>
      </div>
      <div className="ds-motion-stage">
        <motion.div className="ds-motion-ball" style={{ background: brand }} animate={{ x: playing ? 80 : 0 }} transition={config} />
      </div>
      <button className="ds-motion-play-btn" onClick={play} title="Play">▶</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ComponentDemoStage — renders a live demo by component ID + control values
// ─────────────────────────────────────────────────────────────────────────────

function ComponentDemoStage({ comp, controls }) {
  const { getToken } = useTokenOverride();
  const { getIcon } = useIconOverride();

  const brand   = getToken('--bk-brand-primary');
  const border  = getToken('--bk-border-subtle');
  const bgCard  = getToken('--bk-bg-card');
  const bgBase  = getToken('--bk-bg-base');
  const textP   = getToken('--bk-text-primary');
  const textM   = getToken('--bk-text-muted');
  const success = getToken('--bk-success');
  const error   = getToken('--bk-error');

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
          <LoadingButton brand={brand} />
          <button style={{ ...styles, padding: '9px 20px', borderRadius: 8, fontFamily: 'inherit', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        </div>
      );
    }

    case 'bottom-sheet':
      return <BottomSheetDemo brand={brand} bgCard={bgCard} border={border} textP={textP} textM={textM} />;

    case 'input':
      return <InputStatesDemo brand={brand} border={border} bgCard={bgCard} textP={textP} textM={textM} />;

    case 'token-pill': {
      const syms = ['ETH', 'BTC', 'USDC', 'SOL'];
      return (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {syms.map(sym => (
            <div key={sym} className="ds-ex-token-pill" style={{ background: `${brand}18`, borderColor: `${brand}30` }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: brand, opacity: 0.7 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: textP }}>{sym}</span>
              <LucideIcons.ChevronDown size={10} color={textM} strokeWidth={2} />
            </div>
          ))}
        </div>
      );
    }

    case 'bottom-nav': {
      const active = controls.active || 'Home';
      // Inline SVGs matching BottomNav.jsx exactly
      const IconHome    = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 9.5L10 3L17 9.5V17H13V13H7V17H3V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
      const IconMarkets = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 16V10M8 16V6M12 16V12M16 16V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
      const IconZap     = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M11 3L4 11H10L9 17L16 9H10L11 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>;
      const IconClock   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M10 7V10.5L12.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
      const IconFunds   = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>;
      const tabs = [
        { l: 'Home',     Icon: IconHome },
        { l: 'Markets',  Icon: IconMarkets },
        { l: null,       Icon: IconZap },
        { l: 'Activity', Icon: IconClock },
        { l: 'Funds',    Icon: IconFunds },
      ];
      return (
        <div className="ds-ex-bottom-nav" style={{ background: bgCard, borderColor: border }}>
          {tabs.map(({ l, Icon }, i) => l === null ? (
            <div key="fab" className="ds-ex-nav-item">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Icon />
              </div>
            </div>
          ) : (
            <div key={l} className="ds-ex-nav-item" style={{ color: l === active ? brand : textM }}>
              <Icon />
              <span style={{ fontSize: 10 }}>{l}</span>
            </div>
          ))}
        </div>
      );
    }

    case 'tab-bar':
      return (
        <div className="ds-ex-tabs" style={{ background: bgCard, borderColor: border, width: '100%', maxWidth: 260 }}>
          {['Tokens', 'NFTs', 'Activity'].map((label, i) => (
            <button key={label} className="ds-ex-tab" style={{ color: i === 0 ? textP : textM, borderBottom: `2px solid ${i === 0 ? brand : 'transparent'}`, flex: 1 }}>
              {label}
            </button>
          ))}
        </div>
      );

    case 'financial-input': {
      const [amt, setAmt] = useState('0.5');
      return (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <FinancialInputCard
            label="You pay"
            amount={amt}
            onAmountChange={setAmt}
            token={{ symbol: 'ETH' }}
            onTokenSelect={() => {}}
            usdValue={`≈ $${(parseFloat(amt || 0) * 1842.5).toFixed(2)}`}
          />
        </div>
      );
    }

    case 'asset-row': {
      return (
        <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AssetRow
            icon={<div style={{ width: 32, height: 32, borderRadius: '50%', background: '#627EEA' }} />}
            name="Ethereum" chain="Mainnet" amount="1.14 ETH" usdValue="$3,200"
            onPress={() => {}}
          />
          <AssetRow
            icon={<div style={{ width: 32, height: 32, borderRadius: '50%', background: brand }} />}
            name="USDC" chain="Arbitrum" amount="921.25 USDC" usdValue="$921"
          />
        </div>
      );
    }

    case 'status-card': {
      const s = controls.status || 'success';
      return (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <StatusCard
            status={s}
            title={s === 'success' ? 'Swap complete' : s === 'pending' ? 'Transaction pending' : 'Transaction failed'}
            subtitle={s === 'success' ? '0.5 ETH → 921.25 USDC' : s === 'pending' ? 'Waiting for confirmation…' : 'Slippage too high'}
            details={s === 'success' ? [{ label: 'Fee', value: '$2.40' }, { label: 'Time', value: '~12 sec' }] : []}
          />
        </div>
      );
    }

    case 'screen-header':
      return (
        <div style={{ width: '100%', maxWidth: 300, border: `1px solid ${border}`, borderRadius: 10, overflow: 'hidden' }}>
          <ScreenHeader
            title="Send"
            onBack={() => {}}
            rightSlot={<LucideIcons.Settings size={18} color={textM} />}
          />
          <div style={{ padding: '12px 16px', fontSize: 12, color: textM }}>Screen content below header…</div>
        </div>
      );

    case 'audit-badge':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
          <AuditBadge protocolName="Aave v3" firm="CertiK" year={2024} tvl="$12.4B" />
          <AuditBadge protocolName="Compound" firm="OpenZeppelin" year={2023} tvl="$2.1B" inline />
        </div>
      );

    case 'fee-breakdown':
      return (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <FeeBreakdown
            total="$3.28"
            items={[
              { label: 'Network fee', amount: '$2.40' },
              { label: 'Protocol fee', amount: '$0.88' },
            ]}
          />
        </div>
      );

    case 'ltv-bar': {
      const ltv = parseInt(controls.current || '42', 10);
      return (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <LTVBar
            current={ltv}
            warning={75}
            liquidation={85}
            borrowAmount="$8,400"
            collateralAmount="$20,000"
          />
        </div>
      );
    }

    case 'tx-path':
      return (
        <div style={{ width: '100%', maxWidth: 300 }}>
          <TransactionPath
            steps={[
              { type: 'token',    symbol: 'ETH',  chain: 'Ethereum' },
              { type: 'bridge',   name: 'Stargate' },
              { type: 'token',    symbol: 'ETH',  chain: 'Arbitrum' },
            ]}
            estimatedTime="~45 sec"
          />
        </div>
      );

    case 'aria-switch': {
      const [on, setOn] = useState(true);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['Autopilot', on, setOn], ['Notifications', false, () => {}], ['Dark mode', true, () => {}]].map(([label, val, setter], i) => (
            <Switch
              key={label}
              isSelected={i === 0 ? on : val}
              onChange={i === 0 ? setter : undefined}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: textP, fontFamily: 'inherit' }}
            >
              <div style={{ width: 36, height: 20, borderRadius: 10, background: (i === 0 ? on : val) ? brand : border, transition: 'background 0.2s', position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: (i === 0 ? on : val) ? 19 : 3, transition: 'left 0.2s' }} />
              </div>
              {label}
            </Switch>
          ))}
        </div>
      );
    }

    case 'aria-tabs': {
      const [t, setT] = useState('a');
      return (
        <Tabs selectedKey={t} onSelectionChange={setT} style={{ width: '100%', maxWidth: 280 }}>
          <TabList style={{ display: 'flex', gap: 4, marginBottom: 10, borderBottom: `1px solid ${border}`, paddingBottom: 6 }}>
            {['All', 'Staking', 'Lending'].map(id => (
              <Tab key={id} id={id} style={({ isSelected }) => ({ padding: '4px 10px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none', background: isSelected ? `${brand}18` : 'transparent', color: isSelected ? brand : textM, cursor: 'pointer', fontFamily: 'inherit' })}>
                {id}
              </Tab>
            ))}
          </TabList>
          {['All', 'Staking', 'Lending'].map(id => (
            <TabPanel key={id} id={id}>
              <div style={{ fontSize: 12, color: textM, padding: '4px 2px' }}>{id} tab content — arrow keys switch tabs</div>
            </TabPanel>
          ))}
        </Tabs>
      );
    }

    case 'aria-dialog': {
      const [open, setOpen] = useState(false);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setOpen(true)}
            style={{ background: brand, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Open dialog
          </button>
          {open && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 9999 }} onClick={() => setOpen(false)}>
              <div style={{ background: bgCard, borderRadius: '16px 16px 0 0', padding: 24, width: '100%', maxWidth: 390 }} onClick={e => e.stopPropagation()}>
                <Dialog aria-label="Demo dialog" style={{ outline: 'none' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: textP, marginBottom: 8 }}>Dialog demo</div>
                  <div style={{ fontSize: 13, color: textM, marginBottom: 16 }}>Focus is trapped here. Tab cycles within the dialog. ESC or the button below closes it.</div>
                  <button onClick={() => setOpen(false)} style={{ background: brand, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Close</button>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      );
    }

    case 'feature-config':
    case 'feature-panel':
    case 'brand-config':
      return (
        <div style={{ fontSize: 12, color: textM, textAlign: 'center', padding: '8px 0', lineHeight: 1.6 }}>
          Context provider — no visual output.<br />
          <span style={{ color: brand }}>See JSX example below.</span>
        </div>
      );

    default:
      return <div style={{ color: 'var(--bk-text-muted)', fontSize: 12 }}>Demo coming soon</div>;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component overlay (modal sheet — replaces the old 3-column inspector panel)
// ─────────────────────────────────────────────────────────────────────────────

function ComponentOverlay({ comp, onClose }) {
  const { getToken } = useTokenOverride();
  const brand   = getToken('--bk-brand-primary');
  const border  = getToken('--bk-border-subtle');
  const textP   = getToken('--bk-text-primary');
  const textM   = getToken('--bk-text-muted');

  const defaultControls = (COMP_CONTROLS[comp.id] || []).reduce((acc, c) => ({ ...acc, [c.id]: c.def }), {});
  const [ctrlValues, setCtrlValues] = useState(defaultControls);
  const [copiedJsx, setCopiedJsx] = useState(false);

  function copyJsx() {
    navigator.clipboard.writeText(comp.jsx);
    setCopiedJsx(true);
    setTimeout(() => setCopiedJsx(false), 1600);
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const controls = COMP_CONTROLS[comp.id] || [];

  return (
    <AnimatePresence>
      <motion.div
        className="ds-comp-overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="ds-comp-overlay"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320, mass: 0.7 }}
        >
          {/* Header */}
          <div className="ds-comp-overlay-header">
            <div>
              <div className="ds-comp-overlay-title">{comp.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span className="ds-comp-overlay-group">{comp.group}</span>
                {comp.kind && (
                  <span className={`ds-kind-badge ds-kind-${comp.kind}`}>
                    { comp.kind === 'component'  ? 'Component'
                    : comp.kind === 'standalone' ? 'Standalone'
                    : comp.kind === 'primitive'  ? 'ARIA Primitive'
                    : 'Pattern' }
                  </span>
                )}
              </div>
            </div>
            <button className="ds-comp-overlay-close" onClick={onClose} aria-label="Close">×</button>
          </div>

          {/* Body */}
          <div className="ds-comp-overlay-body">

            {/* Live demo stage */}
            <div className="ds-comp-overlay-stage">
              <ComponentDemoStage comp={comp} controls={ctrlValues} />
            </div>

            {/* Controls */}
            {controls.length > 0 && (
              <div className="ds-comp-overlay-controls">
                {controls.map(ctrl => (
                  <div key={ctrl.id} className="ds-comp-control-row">
                    <span className="ds-comp-control-label">{ctrl.label}</span>
                    <div className="ds-comp-control-options">
                      {ctrl.options.map(opt => (
                        <button
                          key={opt}
                          className="ds-comp-control-opt"
                          onClick={() => setCtrlValues(prev => ({ ...prev, [ctrl.id]: opt }))}
                          style={{
                            borderColor: ctrlValues[ctrl.id] === opt ? brand : border,
                            background: ctrlValues[ctrl.id] === opt ? `${brand}18` : 'transparent',
                            color: ctrlValues[ctrl.id] === opt ? brand : textM,
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description, usage, notes */}
            <div className="ds-comp-overlay-info">
              {[
                { label: 'Description', text: comp.description },
                { label: 'Usage',       text: comp.usage },
                { label: 'Notes',       text: comp.notes },
              ].map(({ label, text }) => text ? (
                <div key={label} className="ds-comp-info-field">
                  <span className="ds-comp-info-label">{label}</span>
                  <p className="ds-comp-info-text">{text}</p>
                </div>
              ) : null)}
            </div>

            {/* Token references */}
            {comp.tokens && comp.tokens.length > 0 && (
              <div>
                <div className="ds-comp-info-label" style={{ marginBottom: 8 }}>Tokens used</div>
                <div className="ds-comp-overlay-tokens">
                  {comp.tokens.map(key => {
                    const val = getToken(key);
                    const isColor = /^#|^rgb/.test(val);
                    return (
                      <button
                        key={key}
                        className="ds-comp-token-chip"
                        onClick={() => navigator.clipboard.writeText(key)}
                        title="Click to copy"
                      >
                        {isColor && <span className="ds-comp-token-dot" style={{ background: val }} />}
                        {key}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* JSX snippet */}
            {comp.jsx && (
              <div className="ds-comp-overlay-code">
                <div className="ds-comp-overlay-code-header">
                  <span className="ds-comp-overlay-code-label">JSX</span>
                  <button
                    className="ds-comp-overlay-code-copy"
                    onClick={copyJsx}
                    style={{ color: copiedJsx ? 'var(--bk-success)' : brand }}
                  >
                    {copiedJsx ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="ds-comp-overlay-pre">{comp.jsx}</pre>
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar: theme presets
// ─────────────────────────────────────────────────────────────────────────────

const THEME_PRESET_CONFIG = [
  {
    id: 'Dark',
    label: 'Dark',
    preview: { a: '#0D0E17', b: '#584BEB' },
  },
  {
    id: 'Light',
    label: 'Light',
    preview: { a: '#F5F5FA', b: '#584BEB' },
  },
];

function SidebarThemes() {
  const { loadBuiltinTheme, themes, loadTheme, saveTheme, deleteTheme, getToken } = useTokenOverride();
  const brand  = getToken('--bk-brand-primary');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textM  = getToken('--bk-text-muted');
  const bgCard = getToken('--bk-bg-card');

  const [newName, setNewName] = useState('');

  function handleSave() {
    const name = newName.trim();
    if (!name) return;
    saveTheme(name);
    setNewName('');
  }

  const savedThemeKeys = Object.keys(themes);

  return (
    <div>
      {/* Built-in presets */}
      <div className="ds-theme-presets" style={{ marginBottom: savedThemeKeys.length > 0 ? 12 : 0 }}>
        {THEME_PRESET_CONFIG.map(({ id, label, preview }) => (
          <button
            key={id}
            className="ds-theme-preset-card"
            onClick={() => loadBuiltinTheme(id)}
            style={{ borderColor: border, color: textM }}
          >
            <div className="ds-theme-preset-preview">
              <div className="ds-theme-preset-preview-half" style={{ background: preview.a }} />
              <div className="ds-theme-preset-preview-half" style={{ background: preview.b }} />
            </div>
            <span className="ds-theme-preset-label" style={{ color: textP }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Saved themes */}
      {savedThemeKeys.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          {savedThemeKeys.map(name => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', borderBottom: `1px solid ${border}` }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: themes[name]['--bk-brand-primary'] || brand, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: textP, flex: 1 }}>{name}</span>
              <button onClick={() => loadTheme(name)} style={{ fontSize: 11, fontWeight: 600, color: brand, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Load</button>
              <button onClick={() => deleteTheme(name)} style={{ fontSize: 11, color: textM, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Save current theme */}
      <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
        <input
          placeholder="Save as theme…"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          style={{ flex: 1, fontSize: 11, border: `1px solid ${border}`, borderRadius: 6, padding: '5px 8px', background: bgCard, color: textP, outline: 'none', fontFamily: 'inherit' }}
        />
        <button
          onClick={handleSave}
          disabled={!newName.trim()}
          style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: brand, border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', opacity: newName.trim() ? 1 : 0.4, fontFamily: 'inherit' }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar: token tweaks (8 key tokens)
// ─────────────────────────────────────────────────────────────────────────────

function SidebarTokenList() {
  const { getToken, setToken, resetTokenDraft, isOverridden, resetToDefaults } = useTokenOverride();
  const anyModified = SIDEBAR_TOKENS.some(k => isOverridden(k));

  const tokenDefs = SIDEBAR_TOKENS.map(key => {
    const def = TOKEN_DEFINITIONS.find(t => t.key === key);
    return { key, label: def?.label ?? key.replace('--bk-', '') };
  });

  return (
    <div>
      <div className="ds-sidebar-token-list">
        {tokenDefs.map(({ key, label }) => {
          const val = getToken(key);
          const modified = isOverridden(key);
          return (
            <div key={key} className={`ds-sidebar-token-row${modified ? ' modified' : ''}`}>
              <div className="ds-sidebar-token-swatch" style={{ background: val }} />
              <div className="ds-sidebar-token-info">
                <span className="ds-sidebar-token-label">{label}</span>
                <span className="ds-sidebar-token-key">{key}</span>
              </div>
              <input
                type="color"
                className="ds-sidebar-colour-picker"
                value={val.startsWith('#') ? val : '#584BEB'}
                onChange={e => setToken(key, e.target.value)}
                title={`Edit ${label}`}
              />
              {modified && (
                <button className="ds-sidebar-reset-btn" onClick={() => resetTokenDraft(key)} title="Reset">↺</button>
              )}
            </div>
          );
        })}
      </div>
      {anyModified && (
        <button className="ds-sidebar-reset-all" onClick={resetToDefaults}>
          Reset all to defaults
        </button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar: component gallery
// ─────────────────────────────────────────────────────────────────────────────
// Sidebar: component gallery
// ─────────────────────────────────────────────────────────────────────────────

const GROUP_COLORS = {
  Actions: '#584BEB',
  Feedback: '#F59E0B',
  Forms: '#22C55E',
  Cards: '#06B6D4',
  Navigation: '#A855F7',
  DeFi: '#F04348',
};

// ── ComponentStack — full-size stacked component list ─────────────────────────

function ComponentStack({ onSelect, selectedId }) {
  const { getToken } = useTokenOverride();
  const brand  = getToken('--bk-brand-primary');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textM  = getToken('--bk-text-muted');
  const bgEl   = getToken('--bk-bg-elevated') || 'rgba(255,255,255,0.06)';

  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const groups = COMP_GROUPS.map(group => {
    const items = COMPONENT_REGISTRY.filter(c => {
      if (c.group !== group) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        (c.usage || '').toLowerCase().includes(q) ||
        group.toLowerCase().includes(q)
      );
    });
    return { group, items };
  }).filter(g => g.items.length > 0);

  return (
    <div className="ds-comp-stack">
      {/* Search */}
      <div className="ds-comp-search-wrap">
        <svg className="ds-comp-search-icon" width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          className="ds-comp-search-input"
          type="text"
          placeholder="Search components…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search components"
          autoComplete="off"
        />
        {query && (
          <button
            className="ds-comp-search-clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >×</button>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="ds-comp-no-results">No components match "{query}"</div>
      ) : (
        groups.map(({ group, items }) => {
          const groupColor = GROUP_COLORS[group] || brand;
          return (
            <div key={group} className="ds-comp-stack-group">
              <div className="ds-comp-stack-group-label" style={{ color: groupColor }}>
                {group}
              </div>
              <div className="ds-comp-stack-items-grid">
                {items.map(comp => {
                  const defaultCtrls = (COMP_CONTROLS[comp.id] || []).reduce(
                    (acc, c) => ({ ...acc, [c.id]: c.def }), {}
                  );
                  const isSelected = selectedId === comp.id;
                  return (
                    <button
                      key={comp.id}
                      className={`ds-comp-stack-item${isSelected ? ' is-selected' : ''}`}
                      onClick={() => onSelect(isSelected ? null : comp.id)}
                      style={{ borderColor: isSelected ? brand : border }}
                    >
                      <div className="ds-comp-stack-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                          <span className="ds-comp-stack-name" style={{ color: textP }}>{comp.name}</span>
                          {comp.kind && comp.kind !== 'component' && (
                            <span className={`ds-kind-badge ds-kind-${comp.kind}`} style={{ flexShrink: 0 }}>
                              { comp.kind === 'standalone' ? 'standalone'
                              : comp.kind === 'primitive'  ? 'ARIA'
                              : 'pattern' }
                            </span>
                          )}
                        </div>
                        <span className="ds-comp-stack-action" style={{ color: isSelected ? brand : textM, flexShrink: 0 }}>
                          {isSelected ? 'Close spec ×' : 'View spec →'}
                        </span>
                      </div>
                      <div className="ds-comp-stack-demo">
                        <ComponentDemoStage comp={comp} controls={defaultCtrls} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ── ComponentSpecPanel — right-side spec panel (replaces overlay) ──────────────

function ComponentSpecPanel({ comp, onClose }) {
  const { getToken } = useTokenOverride();
  const brand  = getToken('--bk-brand-primary');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textM  = getToken('--bk-text-muted');

  const defaultControls = (COMP_CONTROLS[comp.id] || []).reduce(
    (acc, c) => ({ ...acc, [c.id]: c.def }), {}
  );
  const [ctrlValues, setCtrlValues] = useState(defaultControls);
  const [copiedJsx, setCopiedJsx] = useState(false);

  function copyJsx() {
    navigator.clipboard.writeText(comp.jsx);
    setCopiedJsx(true);
    setTimeout(() => setCopiedJsx(false), 1600);
  }

  const controls = COMP_CONTROLS[comp.id] || [];

  return (
    <motion.div
      className="ds-spec-panel-content"
      key={comp.id}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="ds-spec-panel-header">
        <div>
          <div className="ds-spec-panel-name" style={{ color: textP }}>{comp.name}</div>
          <div className="ds-spec-panel-group" style={{ color: GROUP_COLORS[comp.group] || brand }}>
            {comp.group}
          </div>
        </div>
        <button className="ds-spec-panel-close" onClick={onClose} aria-label="Close spec">×</button>
      </div>

      {/* Live demo */}
      <div className="ds-spec-panel-demo">
        <ComponentDemoStage comp={comp} controls={ctrlValues} />
      </div>

      {/* Controls */}
      {controls.length > 0 && (
        <div className="ds-spec-panel-controls">
          {controls.map(ctrl => (
            <div key={ctrl.id} className="ds-comp-control-row">
              <span className="ds-comp-control-label" style={{ color: textM }}>{ctrl.label}</span>
              <div className="ds-comp-control-options">
                {ctrl.options.map(opt => (
                  <button
                    key={opt}
                    className="ds-comp-control-opt"
                    onClick={() => setCtrlValues(prev => ({ ...prev, [ctrl.id]: opt }))}
                    style={{
                      borderColor: ctrlValues[ctrl.id] === opt ? brand : border,
                      background:  ctrlValues[ctrl.id] === opt ? `${brand}18` : 'transparent',
                      color:       ctrlValues[ctrl.id] === opt ? brand : textM,
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Spec fields */}
      <div className="ds-spec-panel-info">
        {[
          { label: 'Description', text: comp.description },
          { label: 'Usage',       text: comp.usage },
          { label: 'Notes',       text: comp.notes },
        ].map(({ label, text }) => text ? (
          <div key={label} className="ds-comp-info-field">
            <span className="ds-comp-info-label" style={{ color: textM }}>{label}</span>
            <p className="ds-comp-info-text" style={{ color: textP }}>{text}</p>
          </div>
        ) : null)}
      </div>

      {/* Tokens used */}
      {comp.tokens && comp.tokens.length > 0 && (
        <div className="ds-spec-panel-tokens">
          <div className="ds-comp-info-label" style={{ color: textM, marginBottom: 8 }}>Tokens used</div>
          <div className="ds-comp-overlay-tokens">
            {comp.tokens.map(key => {
              const val = getToken(key);
              const isColor = /^#|^rgb/.test(val);
              return (
                <button
                  key={key}
                  className="ds-comp-token-btn"
                  onClick={() => navigator.clipboard.writeText(key)}
                  style={{ borderColor: border, color: textP }}
                  title={`${key}: ${val}`}
                >
                  {isColor && <span className="ds-comp-token-dot" style={{ background: val }} />}
                  <span>{key.replace('--bk-', '')}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* JSX snippet */}
      {comp.jsx && (
        <div className="ds-spec-panel-jsx">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span className="ds-comp-info-label" style={{ color: textM }}>JSX</span>
            <button
              className="ds-comp-copy-jsx"
              onClick={copyJsx}
              style={{ color: copiedJsx ? 'var(--bk-success)' : brand }}
            >
              {copiedJsx ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <pre className="ds-comp-jsx-pre">{comp.jsx}</pre>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// StudioTab — main export
// ─────────────────────────────────────────────────────────────────────────────

export default function StudioTab() {
  const { getToken } = useTokenOverride();
  const [selectedComp, setSelectedComp] = useState(null);

  const brand  = getToken('--bk-brand-primary');
  const border = getToken('--bk-border-subtle');
  const textM  = getToken('--bk-text-muted');

  const handleSelectComp = useCallback((id) => setSelectedComp(id), []);
  const handleCloseComp  = useCallback(() => setSelectedComp(null), []);

  const selectedCompDef = selectedComp ? COMPONENT_REGISTRY.find(c => c.id === selectedComp) : null;

  function downloadInventory() {
    const inventory = COMPONENT_REGISTRY.map(c => ({
      id: c.id, name: c.name, group: c.group, description: c.description, tokens: c.tokens,
    }));
    const md = [
      '# Modulo Component Inventory',
      `Generated ${new Date().toISOString().slice(0,10)}`,
      '',
      ...COMP_GROUPS.map(group => {
        const items = inventory.filter(c => c.group === group);
        return [
          `## ${group}`,
          ...items.map(c => [
            `### ${c.name}`,
            c.description,
            c.tokens.length ? `**Tokens:** ${c.tokens.join(', ')}` : '',
            '',
          ].filter(Boolean).join('\n')),
        ].join('\n');
      }),
    ].join('\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modulo-component-inventory.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="ds-studio-layout">

      {/* ── Leave-behind header ── */}
      <div className="ds-studio-leave-behind">
        <div className="ds-slb-content">
          <p className="ds-slb-text">
            This design system is your deliverable. Every component is white-label ready,
            accessible (WCAG 2.1 AA), and wired to BakeKit tokens.
          </p>
          <button className="ds-slb-download" onClick={downloadInventory} type="button">
            Download component inventory ↓
          </button>
        </div>
      </div>

      {/* ── Body: stacked list + spec panel ── */}
      <div className="ds-studio-body">

        {/* Left: scrollable component stack */}
        <div className="ds-comp-list">
          <ComponentStack onSelect={handleSelectComp} selectedId={selectedComp} />
        </div>

        {/* Right: spec panel (always visible, content swaps) */}
        <aside className="ds-studio-right-panel">
          <AnimatePresence mode="wait">
            {selectedCompDef ? (
              <ComponentSpecPanel
                key={selectedCompDef.id}
                comp={selectedCompDef}
                onClose={handleCloseComp}
              />
            ) : (
              <motion.div
                key="default"
                className="ds-spec-default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="ds-sidebar-section">
                  <div className="ds-sidebar-section-title">Themes</div>
                  <SidebarThemes />
                </div>
                <div className="ds-sidebar-section" style={{ borderBottom: 'none' }}>
                  <div className="ds-sidebar-section-title">Tokens</div>
                  <SidebarTokenList />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

      </div>

    </div>
  );
}
