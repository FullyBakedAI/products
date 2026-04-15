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

function ToastDemo({ brand, bgCard, border, textP, textM }) {
  const [toasts, setToasts] = useState([]);
  function fire(type) {
    const id = Date.now();
    const config = {
      success: { label: 'Swap confirmed',     sub: '0.5 ETH → 921.25 USDC', color: 'var(--bk-success)' },
      pending: { label: 'Transaction pending', sub: 'Waiting for confirmation…', color: brand },
      error:   { label: 'Transaction failed',  sub: 'Slippage too high',       color: 'var(--bk-error)' },
    }[type];
    setToasts(prev => [...prev, { id, ...config }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['success', 'pending', 'error'].map(t => (
          <button key={t} className="ds-ex-btn ds-ex-btn-secondary" onClick={() => fire(t)}
            style={{ borderColor: border, color: textP, fontSize: 12, padding: '6px 12px' }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 42, left: 0, width: '100%', zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.16 }}
              style={{ background: bgCard, border: `1px solid rgba(0,0,0,0.2)`, borderLeft: `3px solid ${t.color}`, borderRadius: 8, padding: '9px 13px' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: textP }}>{t.label}</div>
              <div style={{ fontSize: 10, color: textM, marginTop: 1 }}>{t.sub}</div>
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

function SkeletonDemo({ border }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!loaded) { const t = setTimeout(() => setLoaded(true), 1800); return () => clearTimeout(t); }
  }, [loaded]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 220 }}>
      <button className="ds-ex-btn ds-ex-btn-secondary" onClick={() => setLoaded(false)}
        style={{ fontSize: 10, borderColor: border, color: 'var(--bk-text-muted)', padding: '3px 9px', alignSelf: 'flex-start', marginBottom: 4, borderRadius: 6 }}>
        Replay
      </button>
      <AnimatePresence mode="wait">
        {!loaded ? (
          <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[80, 130, 60].map((w, i) => (
              <div key={i} className="ds-skeleton" style={{ width: w, height: 11, borderRadius: 5 }} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--bk-text-primary)' }}>$12,891.44</div>
            <div style={{ fontSize: 12, color: 'var(--bk-success)' }}>+$412.30 today (+3.3%)</div>
            <div style={{ fontSize: 10, color: 'var(--bk-text-muted)' }}>4 assets across 3 chains</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SwapFlipDemo({ brand, border, bgCard }) {
  const [flipped, setFlipped] = useState(false);
  const pairs = flipped ? ['USDC', 'ETH'] : ['ETH', 'USDC'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center' }}>
      <div style={{ fontSize: 12, padding: '5px 12px', background: bgCard, borderRadius: 7, border: `1px solid ${border}`, color: 'var(--bk-text-primary)', fontWeight: 600 }}>{pairs[0]}</div>
      <motion.button
        onClick={() => setFlipped(v => !v)}
        style={{ width: 30, height: 30, borderRadius: '50%', background: `${brand}20`, border: `1px solid ${brand}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.span animate={{ rotate: flipped ? 180 : 0 }} transition={{ type: 'spring', damping: 18, stiffness: 300 }} style={{ display: 'flex' }}>
          <LucideIcons.ArrowUpDown size={13} color={brand} strokeWidth={2} />
        </motion.span>
      </motion.button>
      <div style={{ fontSize: 12, padding: '5px 12px', background: bgCard, borderRadius: 7, border: `1px solid ${border}`, color: 'var(--bk-text-primary)', fontWeight: 600 }}>{pairs[1]}</div>
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

    case 'toast':
      return <ToastDemo brand={brand} bgCard={bgCard} border={border} textP={textP} textM={textM} />;

    case 'bottom-sheet':
      return <BottomSheetDemo brand={brand} bgCard={bgCard} border={border} textP={textP} textM={textM} />;

    case 'skeleton':
      return <SkeletonDemo border={border} />;

    case 'badge': {
      const colMap = { Confirmed: success, Pending: brand, Failed: error };
      return (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.entries(colMap).map(([label, c]) => (
            <span key={label} style={{ background: `${c}18`, color: c, borderColor: `${c}30`, fontSize: 12, padding: '4px 12px', borderRadius: 6, border: '1px solid', fontWeight: 600 }}>
              {label}
            </span>
          ))}
        </div>
      );
    }

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

    case 'pct-pills':
      return (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['25%', '50%', '75%', 'Max'].map((label, i) => (
            <button key={label} className="ds-ex-pct-pill" style={{ background: i === 1 ? brand : `${brand}15`, color: i === 1 ? '#fff' : brand, borderColor: `${brand}30` }}>
              {label}
            </button>
          ))}
        </div>
      );

    case 'token-card': {
      const tok = controls.token || 'ETH';
      const up = (controls.trend || 'up') === 'up';
      const data_ = { ETH: ['1.1421', '$4,412.82'], BTC: ['0.0421', '$2,800.50'], USDC: ['921.25', '$921.25'], SOL: ['12.40', '$1,240.00'] };
      const names = { ETH: 'Ethereum', BTC: 'Bitcoin', USDC: 'USD Coin', SOL: 'Solana' };
      const chg = up ? ['+4.38%', '+1.82%', '+0.01%', '+6.14%'] : ['−2.11%', '−3.44%', '−0.01%', '−4.22%'];
      const idx = ['ETH','BTC','USDC','SOL'].indexOf(tok);
      const [bal, val] = data_[tok] || data_.ETH;
      return (
        <div className="ds-ex-card" style={{ background: bgCard, borderColor: border, width: '100%', maxWidth: 280 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: brand, opacity: 0.2, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textP }}>{names[tok]}</div>
              <div style={{ fontSize: 11, color: textM, marginTop: 2 }}>{bal} {tok}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: textP }}>{val}</div>
            <div style={{ fontSize: 11, color: up ? success : error, marginTop: 2 }}>{chg[idx]}</div>
          </div>
        </div>
      );
    }

    case 'swap-card':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', maxWidth: 280 }}>
          {[{ label: 'You pay', token: 'ETH', amount: '0.5', usd: '$921.25' }, { label: 'You receive', token: 'USDC', amount: '921.25', usd: '≈ $921.25' }].map(({ label, token, amount, usd }) => (
            <div key={label} className="ds-ex-swap-card" style={{ background: bgCard, borderColor: border }}>
              <div style={{ fontSize: 10, color: textM, marginBottom: 5 }}>{label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: textP }}>{amount}</span>
                <div className="ds-ex-token-pill" style={{ background: `${brand}18`, borderColor: `${brand}30` }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: brand, opacity: 0.7 }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: textP }}>{token}</span>
                </div>
              </div>
              <div style={{ fontSize: 10, color: textM, marginTop: 3 }}>{usd}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SwapFlipDemo brand={brand} border={border} bgCard={bgCard} />
          </div>
        </div>
      );

    case 'bottom-nav': {
      const active = controls.active || 'Home';
      const navItems = [
        { l: 'Home',     I: getIcon('nav-home'),     fab: false },
        { l: 'Markets',  I: getIcon('nav-markets'),  fab: false },
        { l: '',         I: getIcon('nav-fab'),       fab: true  },
        { l: 'Activity', I: getIcon('nav-activity'), fab: false },
        { l: 'Funds',    I: getIcon('nav-funds'),    fab: false },
      ];
      return (
        <div className="ds-ex-bottom-nav" style={{ background: bgCard, borderColor: border }}>
          {navItems.map(({ l, I, fab }, i) => fab ? (
            <div key="fab" className="ds-ex-nav-item ds-ex-nav-fab" style={{ background: brand, color: '#fff', borderRadius: 12, padding: '6px 10px' }}>
              <I size={18} color="#fff" strokeWidth={2} />
            </div>
          ) : (
            <div key={l || i} className="ds-ex-nav-item" style={{ color: l === active ? brand : textM }}>
              <I size={18} color={l === active ? brand : textM} strokeWidth={l === active ? 2 : 1.5} />
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

    case 'tx-row': {
      const type = controls.type || 'sent';
      const rows = {
        sent:     { icon: 'ArrowUpRight',  label: 'Sent ETH',      sub: 'to 0x4a3f…c12d',   amount: '−0.5 ETH', usd: '$921.25', color: error },
        received: { icon: 'ArrowDownLeft', label: 'Received USDC', sub: 'from 0x8b2c…a44e', amount: '+921.25',  usd: 'USDC',    color: success },
        swapped:  { icon: 'ArrowUpDown',   label: 'Swapped',       sub: 'ETH → USDC',        amount: '−0.5 ETH', usd: '$921.25', color: brand },
      };
      const r = rows[type];
      const Ic = LucideIcons[r.icon] ?? LucideIcons.Circle;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: bgCard, borderRadius: 10, border: `1px solid ${border}`, width: '100%', maxWidth: 300 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${r.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Ic size={14} color={r.color} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: textP }}>{r.label}</div>
            <div style={{ fontSize: 10, color: textM, marginTop: 1 }}>{r.sub}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: type === 'received' ? success : textP }}>{r.amount}</div>
            <div style={{ fontSize: 10, color: textM }}>{r.usd}</div>
          </div>
        </div>
      );
    }

    case 'step-progress': {
      const activeStep = controls.step || 'Approve';
      const steps = ['Review', 'Approve', 'Confirm'];
      const activeIdx = steps.indexOf(activeStep);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 240 }}>
          {steps.map((label, i) => {
            const done = i < activeIdx;
            const active = i === activeIdx;
            return (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: done ? success : active ? brand : 'transparent', border: `2px solid ${done ? success : active ? brand : border}`, fontSize: 10, fontWeight: 700, color: i > activeIdx ? textM : '#fff' }}>
                    {done ? <LucideIcons.Check size={11} strokeWidth={3} /> : i + 1}
                  </div>
                  {i < steps.length - 1 && <div style={{ width: 2, height: 14, background: border, marginTop: 2 }} />}
                </div>
                <div style={{ paddingTop: 2 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: i > activeIdx ? textM : textP }}>{label}</div>
                  <div style={{ fontSize: 10, color: textM, marginTop: 1 }}>{['ETH → USDC at 1,842.50', 'Waiting for signature…', 'Est. 15–30 sec'][i]}</div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    case 'confirm-summary':
      return (
        <div style={{ background: bgCard, borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden', width: '100%', maxWidth: 280 }}>
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: textP }}>Confirm swap</span>
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${brand}18`, color: brand }}>Preview</span>
          </div>
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[{ label: 'You pay', token: 'ETH', amount: '0.5000', usd: '$921.25', i: 0 }, { label: 'You receive', token: 'USDC', amount: '921.25', usd: '≈ $921.25', i: 1 }].map(({ label, token, amount, usd, i }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 9px', background: i === 0 ? 'rgba(255,255,255,0.03)' : `${success}08`, borderRadius: 7, border: `1px solid ${i === 0 ? border : `${success}20`}` }}>
                <div>
                  <div style={{ fontSize: 10, color: textM }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: i === 1 ? success : textP, marginTop: 1 }}>{amount} {token}</div>
                </div>
                <div style={{ fontSize: 10, color: textM }}>{usd}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 2px' }}>
              <span style={{ fontSize: 10, color: textM }}>Network fee</span>
              <span style={{ fontSize: 10, color: textP, fontWeight: 600 }}>~$2.40</span>
            </div>
          </div>
          <div style={{ padding: '0 12px 12px' }}>
            <button style={{ width: '100%', padding: '9px', borderRadius: 9, background: brand, border: 'none', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              Confirm swap
            </button>
          </div>
        </div>
      );

    case 'portfolio-metric':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 260 }}>
          <div style={{ background: bgCard, borderRadius: 12, border: `1px solid ${border}`, padding: '16px' }}>
            <div style={{ fontSize: 10, color: textM, marginBottom: 3 }}>Total portfolio</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: textP }}>$12,891.44</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
              <LucideIcons.TrendingUp size={11} color={success} strokeWidth={2} />
              <span style={{ fontSize: 11, color: success, fontWeight: 600 }}>+$412.30</span>
              <span style={{ fontSize: 11, color: textM }}>today (+3.3%)</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {[{ label: 'Assets', value: '4' }, { label: 'Chains', value: '3' }].map(({ label, value }) => (
              <div key={label} style={{ background: bgCard, borderRadius: 8, border: `1px solid ${border}`, padding: '10px 12px' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: brand }}>{value}</div>
                <div style={{ fontSize: 10, color: textM }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'wallet-chip':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', maxWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', background: bgCard, borderRadius: 8, border: `1px solid ${border}` }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: `linear-gradient(135deg, ${brand}, ${success})`, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: textP, fontFamily: 'monospace', flex: 1 }}>0x4a3f…c12d</span>
            <LucideIcons.Copy size={12} color={textM} strokeWidth={1.5} style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {[{ label: 'Ethereum', color: '#627EEA' }, { label: 'Polygon', color: '#8247E5' }, { label: 'Arbitrum', color: '#28A0F0' }, { label: 'Base', color: '#0052FF' }].map(({ label, color }) => (
              <span key={label} style={{ fontSize: 10, padding: '3px 7px', borderRadius: 4, background: `${color}18`, color, border: `1px solid ${color}30`, fontWeight: 600 }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      );

    case 'action-row':
      return (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '8px 0' }}>
          {[{ icon: 'ArrowUpDown', label: 'Swap' }, { icon: 'TrendingUp', label: 'Trade' }, { icon: 'ArrowUpRight', label: 'Send' }, { icon: 'ArrowDownLeft', label: 'Receive' }].map(({ icon, label }) => {
            const I = LucideIcons[icon];
            return (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: bgCard, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <I size={18} color={brand} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 10, color: textM }}>{label}</span>
              </div>
            );
          })}
        </div>
      );

    case 'fab':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${brand}, color-mix(in srgb, ${brand} 80%, #fff))`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${brand}40` }}>
            <LucideIcons.Plus size={22} color="#fff" strokeWidth={2.5} />
          </div>
        </div>
      );

    case 'icon-btn':
      return (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {[{ icon: 'Settings', label: 'Settings' }, { icon: 'Bell', label: 'Notifications' }, { icon: 'ArrowLeft', label: 'Back' }, { icon: 'X', label: 'Close' }, { icon: 'Share2', label: 'Share' }].map(({ icon, label }) => {
            const I = LucideIcons[icon];
            return (
              <div key={label} style={{ width: 36, height: 36, borderRadius: 10, background: bgCard, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title={label}>
                <I size={16} color={textM} strokeWidth={1.5} />
              </div>
            );
          })}
        </div>
      );

    case 'undo-toast':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: bgCard, borderRadius: 12, border: `1px solid ${border}`, width: '100%', maxWidth: 280 }}>
          <LucideIcons.Check size={14} color={success} strokeWidth={2} />
          <span style={{ fontSize: 12, fontWeight: 600, color: textP, flex: 1 }}>Optimise deployed</span>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'transparent', border: `2px solid ${brand}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: brand }}>3</span>
          </div>
          <button style={{ fontSize: 12, fontWeight: 700, color: brand, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Undo</button>
        </div>
      );

    case 'drag-handle':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: border }} />
          <span style={{ fontSize: 10, color: textM, marginTop: 8 }}>Drag indicator for bottom sheets</span>
        </div>
      );

    case 'empty-state':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16 }}>
          <LucideIcons.Inbox size={28} color={textM} strokeWidth={1.2} />
          <div style={{ fontSize: 14, fontWeight: 600, color: textP }}>No transactions yet</div>
          <div style={{ fontSize: 12, color: textM, textAlign: 'center' }}>Your activity will appear here once you make your first swap.</div>
          <button style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: brand, border: 'none', borderRadius: 8, padding: '8px 20px', marginTop: 4, cursor: 'pointer', fontFamily: 'inherit' }}>Start swapping</button>
        </div>
      );

    case 'financial-input-card':
      return (
        <div style={{ background: bgCard, borderRadius: 14, border: `1px solid ${border}`, padding: '10px 14px', width: '100%', maxWidth: 280 }}>
          <div style={{ fontSize: 10, color: textM, marginBottom: 6 }}>You pay</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: textP }}>0.5</span>
            <div className="ds-ex-token-pill" style={{ background: `${brand}18`, borderColor: `${brand}30` }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: brand, opacity: 0.7 }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: textP }}>ETH</span>
              <LucideIcons.ChevronDown size={10} color={textM} strokeWidth={2} />
            </div>
          </div>
          <div style={{ fontSize: 10, color: textM, marginTop: 4 }}>≈ $921.25</div>
        </div>
      );

    case 'search-input':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', background: bgCard, borderRadius: 10, border: `1px solid ${border}`, width: '100%', maxWidth: 260 }}>
          <LucideIcons.Search size={14} color={textM} strokeWidth={1.8} />
          <span style={{ fontSize: 13, color: textM, flex: 1 }}>Search tokens...</span>
          <LucideIcons.X size={12} color={textM} strokeWidth={1.5} style={{ opacity: 0.4 }} />
        </div>
      );

    case 'toggle-switch':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 220 }}>
          {[{ label: 'Notifications', on: true }, { label: 'Dark mode', on: true }, { label: 'Biometrics', on: false }].map(({ label, on }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: textP }}>{label}</span>
              <div style={{ width: 36, height: 20, borderRadius: 10, background: on ? success : textM, position: 'relative', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', left: on ? 18 : 2, top: 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
              </div>
            </div>
          ))}
        </div>
      );

    case 'risk-selector': {
      const level = controls.level || 'balanced';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 280 }}>
          {[{ id: 'conservative', label: 'Conservative', desc: 'Stablecoins, low APY, minimal risk' }, { id: 'balanced', label: 'Balanced', desc: 'Mix of yield and stability' }, { id: 'aggressive', label: 'Aggressive', desc: 'Maximum yield, higher volatility' }].map(o => (
            <div key={o.id} style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${level === o.id ? brand : border}`, background: level === o.id ? `${brand}10` : bgCard, cursor: 'pointer' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: level === o.id ? brand : textP }}>{o.label}</div>
              <div style={{ fontSize: 11, color: textM, marginTop: 2 }}>{o.desc}</div>
            </div>
          ))}
        </div>
      );
    }

    case 'asset-row':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: 300, borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}` }}>
          {[{ name: 'Ethereum', sym: 'ETH', chain: 'Mainnet', bal: '1.24 ETH', usd: '$4,412' }, { name: 'Solana', sym: 'SOL', chain: 'Solana', bal: '12.40 SOL', usd: '$1,240' }, { name: 'USD Coin', sym: 'USDC', chain: 'Arbitrum', bal: '921.25', usd: '$921' }].map((t, i) => (
            <div key={t.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: bgCard, borderTop: i > 0 ? `1px solid ${border}` : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${brand}20`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: brand }}>{t.sym[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: textP }}>{t.name}</div>
                <div style={{ fontSize: 10, color: textM }}>{t.chain} · {t.bal}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textP }}>{t.usd}</div>
              <LucideIcons.ChevronRight size={14} color={textM} strokeWidth={1.5} />
            </div>
          ))}
        </div>
      );

    case 'settings-row':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: 300, borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}` }}>
          {[{ icon: 'Shield', label: 'Security', desc: 'Biometrics, PIN' }, { icon: 'Palette', label: 'Appearance', desc: 'Theme, display' }, { icon: 'Bell', label: 'Notifications', desc: 'Alerts, updates' }].map((r, i) => {
            const I = LucideIcons[r.icon];
            return (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: bgCard, borderTop: i > 0 ? `1px solid ${border}` : 'none', cursor: 'pointer' }}>
                <I size={18} color={textM} strokeWidth={1.5} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: textP }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: textM }}>{r.desc}</div>
                </div>
                <LucideIcons.ChevronRight size={14} color={textM} strokeWidth={1.5} />
              </div>
            );
          })}
        </div>
      );

    case 'screen-header':
      return (
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', width: '100%', maxWidth: 300, background: bgCard, borderRadius: 10, border: `1px solid ${border}` }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <LucideIcons.ArrowLeft size={18} color={textP} strokeWidth={1.8} />
          </div>
          <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600, color: textP }}>Send ETH</span>
          <div style={{ width: 32 }} />
        </div>
      );

    case 'chain-selector':
      return (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[{ label: 'All', active: true }, { label: 'Ethereum' }, { label: 'Arbitrum' }, { label: 'Base' }, { label: 'Solana' }].map(c => (
            <span key={c.label} style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 20, background: c.active ? brand : `${brand}12`, color: c.active ? '#fff' : textM, border: `1px solid ${c.active ? brand : border}`, cursor: 'pointer' }}>{c.label}</span>
          ))}
        </div>
      );

    case 'notifications-panel':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', maxWidth: 280, borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}` }}>
          {[{ icon: 'TrendingUp', title: 'ETH up 4.3% today', time: '2m ago', color: success }, { icon: 'ArrowDownLeft', title: 'Received 500 USDC', time: '1h ago', color: brand }, { icon: 'AlertTriangle', title: 'Health factor low', time: '3h ago', color: error }].map((n, i) => {
            const I = LucideIcons[n.icon];
            return (
              <div key={n.title} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: bgCard, borderTop: i > 0 ? `1px solid ${border}` : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${n.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <I size={13} color={n.color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: textP }}>{n.title}</div>
                </div>
                <span style={{ fontSize: 10, color: textM }}>{n.time}</span>
              </div>
            );
          })}
        </div>
      );

    case 'status-card': {
      const st = controls.status || 'success';
      const stMap = { success: { icon: 'CheckCircle', color: success, title: 'Swap Complete', sub: '0.5 ETH → 921.25 USDC' }, pending: { icon: 'Clock', color: brand, title: 'Confirming...', sub: 'Waiting for block confirmation' }, error: { icon: 'XCircle', color: error, title: 'Transaction Failed', sub: 'Insufficient gas — try again' } };
      const s = stMap[st];
      const I = LucideIcons[s.icon];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 16, background: bgCard, borderRadius: 14, border: `1px solid ${border}`, width: '100%', maxWidth: 260 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <I size={20} color={s.color} strokeWidth={1.8} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: textP }}>{s.title}</div>
          <div style={{ fontSize: 12, color: textM }}>{s.sub}</div>
        </div>
      );
    }

    case 'ltv-bar': {
      const pct = parseInt(controls.current || '42');
      const barColor = pct >= 85 ? error : pct >= 75 ? '#F5A623' : success;
      return (
        <div style={{ width: '100%', maxWidth: 280, padding: '12px 16px', background: bgCard, borderRadius: 12, border: `1px solid ${border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: textM }}>Loan-to-Value</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: barColor }}>{pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: `${border}40`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: barColor, transition: 'width 0.3s' }} />
            <div style={{ position: 'absolute', left: '75%', top: 0, width: 1, height: '100%', background: '#F5A623' }} />
            <div style={{ position: 'absolute', left: '85%', top: 0, width: 1, height: '100%', background: error }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: textM }}>$8,400 borrowed</span>
            <span style={{ fontSize: 10, color: textM }}>$20,000 collateral</span>
          </div>
        </div>
      );
    }

    case 'audit-badge':
      return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[{ firm: 'CertiK', year: 2024 }, { firm: 'OpenZeppelin', year: 2023 }, { firm: 'ChainSecurity', year: 2024 }].map(a => (
            <span key={a.firm} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: success, background: `${success}12`, border: `1px solid ${success}25`, borderRadius: 6, padding: '3px 8px' }}>
              <LucideIcons.ShieldCheck size={10} strokeWidth={2} /> {a.firm} {a.year}
            </span>
          ))}
        </div>
      );

    case 'fee-breakdown':
      return (
        <div style={{ width: '100%', maxWidth: 260, background: bgCard, borderRadius: 10, border: `1px solid ${border}`, padding: '10px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: textM }}>Total fee</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: textP }}>$3.28</span>
          </div>
          {[{ label: 'Network gas', amount: '$2.40' }, { label: 'Protocol fee', amount: '$0.88' }].map(f => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ fontSize: 11, color: textM }}>{f.label}</span>
              <span style={{ fontSize: 11, color: textP }}>{f.amount}</span>
            </div>
          ))}
        </div>
      );

    case 'tx-path':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ label: 'ETH', sub: 'Ethereum', color: '#627EEA' }, null, { label: 'Stargate', sub: 'Bridge', color: brand }, null, { label: 'ETH', sub: 'Arbitrum', color: '#28A0F0' }].map((step, i) =>
            step === null ? <LucideIcons.ArrowRight key={`a${i}`} size={12} color={textM} strokeWidth={1.5} /> : (
              <div key={step.label + i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${step.color}18`, border: `1.5px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, fontWeight: 700, color: step.color }}>{step.label[0]}</span>
                </div>
                <span style={{ fontSize: 9, color: textM }}>{step.sub}</span>
              </div>
            )
          )}
        </div>
      );

    case 'price-impact-warning':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, background: `#F5A62315`, border: '1px solid #F5A62330' }}>
            <LucideIcons.AlertTriangle size={12} color="#F5A623" strokeWidth={2} />
            <span style={{ fontSize: 11, fontWeight: 600, color: '#F5A623' }}>Price impact: −1.2%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, background: `${error}12`, border: `1px solid ${error}30` }}>
            <LucideIcons.AlertTriangle size={12} color={error} strokeWidth={2} />
            <span style={{ fontSize: 11, fontWeight: 600, color: error }}>Price impact: −4.8%</span>
          </div>
        </div>
      );

    case 'qr-code':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 16, background: bgCard, borderRadius: 14, border: `1px solid ${border}`, width: '100%', maxWidth: 200 }}>
          <div style={{ width: 100, height: 100, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 80, background: `repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50%/10px 10px`, borderRadius: 4 }} />
          </div>
          <span style={{ fontSize: 11, color: textM, fontFamily: 'monospace' }}>0x4a3f…c12d</span>
        </div>
      );

    case 'exchange-list':
      return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Coinbase', 'Binance', 'Kraken', 'Gemini'].map(name => (
            <span key={name} style={{ fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 8, background: bgCard, border: `1px solid ${border}`, color: textP, cursor: 'pointer' }}>{name}</span>
          ))}
        </div>
      );

    case 'tab-switcher':
      return (
        <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: `1px solid ${border}`, width: '100%', maxWidth: 260 }}>
          {['Tokens', 'NFTs', 'Positions'].map((label, i) => (
            <button key={label} style={{ flex: 1, padding: '8px 0', fontSize: 12, fontWeight: i === 0 ? 600 : 500, color: i === 0 ? brand : textM, background: i === 0 ? `${brand}12` : bgCard, border: 'none', borderRight: i < 2 ? `1px solid ${border}` : 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{label}</button>
          ))}
        </div>
      );

    default: {
      const tokens = comp.tokens || [];
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', padding: '8px 0' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${brand}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LucideIcons.Component size={16} color={brand} strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: textP }}>{comp.name}</div>
          <div style={{ fontSize: 10, color: textM, textAlign: 'center', maxWidth: 200 }}>{comp.description?.slice(0, 80)}…</div>
          {tokens.length > 0 && (
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center', marginTop: 2 }}>
              {tokens.slice(0, 3).map(t => (
                <span key={t} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: `${brand}10`, color: brand, border: `1px solid ${brand}20` }}>{t.replace('--bk-', '')}</span>
              ))}
            </div>
          )}
        </div>
      );
    }
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
              <div className="ds-comp-overlay-group">{comp.group}</div>
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

  return (
    <div className="ds-comp-stack">
      {COMP_GROUPS.map(group => {
        const items = COMPONENT_REGISTRY.filter(c => c.group === group);
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
                    <span className="ds-comp-stack-name" style={{ color: textP }}>{comp.name}</span>
                    <span className="ds-comp-stack-action" style={{ color: isSelected ? brand : textM }}>
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
      })}
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
            Every component is accessible (WCAG 2.1 AA) and wired to your brand tokens.
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
