/**
 * BrandTab — read-only brand identity showcase.
 * Sections: Hero · Colour Palette · Typography Scale · Spacing & Radius
 * No interactivity. Pure visual reference.
 */
import { useTokenOverride } from '../TokenOverrideContext';
import logoModulo from '../assets/logo-modulo.svg';

// ── Colour palette definition ──────────────────────────────────────────

const PALETTE_GROUPS = [
  {
    label: 'Brand',
    swatches: [
      { name: 'Brand Primary', token: '--bk-brand-primary', role: 'CTAs, active states, links' },
    ],
  },
  {
    label: 'Backgrounds',
    swatches: [
      { name: 'Base',       token: '--bk-bg-base',      role: 'App background' },
      { name: 'Card',       token: '--bk-bg-card',      role: 'Card surfaces' },
      { name: 'Card Alt',   token: '--bk-bg-card-alt',  role: 'Alternate surface' },
      { name: 'Nav',        token: '--bk-bg-nav',       role: 'Bottom navigation' },
      { name: 'Elevated',   token: '--bk-bg-elevated',  role: 'Sheets, modals' },
    ],
  },
  {
    label: 'Text',
    swatches: [
      { name: 'Primary',   token: '--bk-text-primary',   role: 'Headlines, values' },
      { name: 'Secondary', token: '--bk-text-secondary', role: 'Body text' },
      { name: 'Muted',     token: '--bk-text-muted',     role: 'Captions, labels' },
    ],
  },
  {
    label: 'Borders',
    swatches: [
      { name: 'Subtle', token: '--bk-border-subtle', role: 'Card edges, dividers' },
    ],
  },
  {
    label: 'States',
    swatches: [
      { name: 'Success', token: '--bk-success', role: 'Positive changes, confirmed' },
      { name: 'Error',   token: '--bk-error',   role: 'Negative changes, failed' },
    ],
  },
];

// ── Typography scale ───────────────────────────────────────────────────

const TYPE_SCALE = [
  {
    label: 'Display',
    sample: 'One vault, every chain.',
    size: '28px',
    weight: 700,
    lineHeight: '1.1',
    letterSpacing: '-0.04em',
    usage: 'Marketing headlines, hero taglines',
  },
  {
    label: 'Heading',
    sample: 'Your portfolio, unified.',
    size: '20px',
    weight: 600,
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    usage: 'Screen titles, section headers',
  },
  {
    label: 'Subheading',
    sample: 'Swap tokens across chains.',
    size: '17px',
    weight: 600,
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    usage: 'Card titles, subsection labels',
  },
  {
    label: 'Body',
    sample: 'Connecting wallets, chains, and protocols into one unified interface.',
    size: '15px',
    weight: 400,
    lineHeight: '1.6',
    letterSpacing: '0',
    usage: 'Descriptions, informational text',
  },
  {
    label: 'Label',
    sample: 'You pay · ETH · Ethereum · $921.25',
    size: '13px',
    weight: 500,
    lineHeight: '1.4',
    letterSpacing: '0',
    usage: 'Form labels, data fields, UI labels',
  },
  {
    label: 'Caption',
    sample: '--bk-text-muted · Inter 400 · 11px',
    size: '11px',
    weight: 400,
    lineHeight: '1.4',
    letterSpacing: '0.01em',
    usage: 'Metadata, timestamps, footnotes',
  },
];

// ── Spacing scale ──────────────────────────────────────────────────────

const SPACING_SCALE = [
  { label: '4px',  value: 4 },
  { label: '8px',  value: 8 },
  { label: '12px', value: 12 },
  { label: '16px', value: 16 },
  { label: '20px', value: 20 },
  { label: '24px', value: 24 },
  { label: '32px', value: 32 },
  { label: '48px', value: 48 },
];

const RADIUS_SCALE = [
  { label: '4px',  value: 4,  usage: 'Badges, tags' },
  { label: '8px',  value: 8,  usage: 'Buttons, inputs' },
  { label: '12px', value: 12, usage: 'Cards' },
  { label: '16px', value: 16, usage: 'Large cards' },
  { label: '20px', value: 20, usage: 'Sheets, overlays' },
  { label: '44px', value: 44, usage: 'Phone frame' },
];

// ── Brand voice ───────────────────────────────────────────────────────

const VOICE_PRINCIPLES = [
  { title: 'Clear over clever', desc: 'Say what you mean in as few words as possible. No jargon without context, no marketing speak in functional UI.' },
  { title: 'Confident, not aggressive', desc: 'State facts directly. "Swap confirmed" not "Your swap has been successfully processed!" Calm authority.' },
  { title: 'Precise with numbers', desc: 'Never round token amounts. Show exact values with full decimal precision. $4,412.82 not ~$4.4k.' },
  { title: 'Action-first labels', desc: 'Buttons use imperative verbs: Swap, Send, Confirm, Review. Never "Click here" or "Submit".' },
];

// ── Iconography ───────────────────────────────────────────────────────

const ICON_RULES = [
  { category: 'UI Chrome', source: 'Lucide', examples: 'Navigation arrows, settings gear, close/back, chevrons, search', rule: 'Consistent 1.5px stroke weight at 20px. Never filled.' },
  { category: 'Product Icons', source: 'Figma assets', examples: 'Token logos (ETH, BTC, USDC), protocol logos, chain badges', rule: 'Always from official brand kits. Never approximate with generic shapes.' },
  { category: 'Status Icons', source: 'Lucide', examples: 'Check (success), X (error), Clock (pending), AlertTriangle (warning)', rule: 'Colour-coded by state. Always paired with text label for accessibility.' },
];

// ── Logo usage ────────────────────────────────────────────────────────

const LOGO_RULES = [
  { rule: 'Minimum clear space', detail: 'The % symbol height on all sides. Never crowd the mark.' },
  { rule: 'Minimum size', detail: '24px height on screen, 10mm in print. Below this, use the mark only.' },
  { rule: 'Dark backgrounds only', detail: 'The wordmark is white. Never place on light backgrounds without inverting.' },
  { rule: 'No modifications', detail: 'No rotation, colour changes, shadows, outlines, or stretching. Use as provided.' },
];

// ── Do / Don't ────────────────────────────────────────────────────────

const DOS_DONTS = [
  { do: 'Use token variables for all colours', dont: 'Hardcode hex values in components' },
  { do: 'Show exact token amounts (0.5421 ETH)', dont: 'Round or approximate (~0.5 ETH)' },
  { do: 'Use Inter for all text', dont: 'Mix font families or use system fonts' },
  { do: 'Maintain 44px minimum touch targets', dont: 'Shrink buttons below accessible size' },
  { do: 'Keep one primary CTA per screen', dont: 'Compete with multiple brand-colour buttons' },
  { do: 'Use motion to communicate state change', dont: 'Add decorative animation that loops' },
];

// ── Motion tokens ─────────────────────────────────────────────────────

const MOTION_TOKENS = [
  { name: '--bk-motion-instant', value: '80ms', usage: 'Hover states, focus rings, micro-interactions' },
  { name: '--bk-motion-fast', value: '150ms', usage: 'Toggle switches, pill selections, tab switches' },
  { name: '--bk-motion-standard', value: '250ms', usage: 'Card reveals, panel slides, route transitions' },
  { name: '--bk-motion-slow', value: '400ms', usage: 'Full-screen transitions, splash animation' },
  { name: 'Spring (tight)', value: 'stiffness: 400, damping: 30', usage: 'Swap flip, bottom sheet snap, numpad press' },
  { name: 'Spring (gentle)', value: 'stiffness: 200, damping: 25', usage: 'Page transitions, overlay entrance' },
];

// ── Components ─────────────────────────────────────────────────────────

export default function BrandTab() {
  const { getToken } = useTokenOverride();

  return (
    <div className="ds-brand-editorial">

      {/* ── 1. Hero ── */}
      <div className="ds-brand-hero">
        <div className="ds-brand-hero-inner">
          <img src={logoModulo} alt="Modulo" className="ds-brand-hero-logo" />
          <h1 className="ds-brand-hero-tagline">One vault,<br />every chain.</h1>
          <p className="ds-brand-hero-meta">Design System · v1.0 · Built with BakedUX</p>
        </div>
      </div>

      {/* ── 2. Colour Palette ── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">01 — Colour</div>
        {PALETTE_GROUPS.map(({ label, swatches }) => (
          <div key={label} className="ds-brand-palette-group">
            <div className="ds-brand-palette-group-label">{label}</div>
            <div className="ds-brand-palette-grid">
              {swatches.map(({ name, token, role }) => {
                const val = getToken(token);
                return (
                  <div key={token} className="ds-brand-swatch-card">
                    <div className="ds-brand-swatch-fill" style={{ background: val }} />
                    <div className="ds-brand-swatch-meta">
                      <span className="ds-brand-swatch-name">{name}</span>
                      <span className="ds-brand-swatch-token">{token}</span>
                      <span className="ds-brand-swatch-hex">{val}</span>
                      <span className="ds-brand-swatch-role">{role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Typography Scale ── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">02 — Typography</div>
        <div className="ds-brand-type-scale">
          {TYPE_SCALE.map(({ label, sample, size, weight, lineHeight, letterSpacing, usage }) => (
            <div key={label} className="ds-brand-type-row">
              <span
                className="ds-brand-type-sample"
                style={{ fontSize: size, fontWeight: weight, lineHeight, letterSpacing }}
              >
                {sample}
              </span>
              <div className="ds-brand-type-meta">
                <span className="ds-brand-type-label">{label}</span>
                <span className="ds-brand-type-meta-item">Inter {weight}</span>
                <span className="ds-brand-type-meta-item">{size}</span>
                <span className="ds-brand-type-meta-item">lh {lineHeight}</span>
                {letterSpacing !== '0' && (
                  <span className="ds-brand-type-meta-item">ls {letterSpacing}</span>
                )}
                <span className="ds-brand-type-meta-item" style={{ color: 'rgba(255,255,255,0.3)' }}>{usage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Brand Voice ── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">03 — Voice</div>
        <div className="ds-brand-voice-grid">
          {VOICE_PRINCIPLES.map(({ title, desc }) => (
            <div key={title} className="ds-brand-voice-card" style={{ background: 'var(--bk-bg-card)', border: '1px solid var(--bk-border-subtle)', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--bk-text-primary)', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, lineHeight: 1.55, color: 'var(--bk-text-muted)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. Iconography ── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">04 — Iconography</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ICON_RULES.map(({ category, source, examples, rule }) => (
            <div key={category} style={{ background: 'var(--bk-bg-card)', border: '1px solid var(--bk-border-subtle)', borderRadius: 12, padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--bk-text-primary)' }}>{category}</span>
                <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: `${getToken('--bk-brand-primary')}15`, color: getToken('--bk-brand-primary') }}>{source}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--bk-text-secondary)', marginBottom: 4 }}>{examples}</div>
              <div style={{ fontSize: 11, color: 'var(--bk-text-muted)', fontStyle: 'italic' }}>{rule}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 6. Logo Usage ── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">05 — Logo Usage</div>
        <div style={{ background: 'var(--bk-bg-card)', border: '1px solid var(--bk-border-subtle)', borderRadius: 14, padding: '20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--bk-border-subtle)' }}>
            <img src={logoModulo} alt="Modulo" style={{ height: 20 }} />
            <span style={{ fontSize: 11, color: 'var(--bk-text-muted)' }}>Primary wordmark — white on dark</span>
          </div>
          {LOGO_RULES.map(({ rule, detail }) => (
            <div key={rule} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bk-text-primary)', minWidth: 130, flexShrink: 0 }}>{rule}</span>
              <span style={{ fontSize: 12, color: 'var(--bk-text-muted)' }}>{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. Motion ── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">06 — Motion</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bk-border-subtle)' }}>
          {MOTION_TOKENS.map(({ name, value, usage }, i) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', background: i % 2 === 0 ? 'var(--bk-bg-card)' : 'var(--bk-bg-card-alt)' }}>
              <code style={{ fontSize: 11, fontWeight: 600, color: getToken('--bk-brand-primary'), minWidth: 170, flexShrink: 0 }}>{name}</code>
              <span style={{ fontSize: 12, color: 'var(--bk-text-primary)', minWidth: 120, flexShrink: 0 }}>{value}</span>
              <span style={{ fontSize: 11, color: 'var(--bk-text-muted)' }}>{usage}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. Do / Don't ── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">07 — Do / Don't</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bk-success)', marginBottom: 10 }}>✓ Do</div>
            {DOS_DONTS.map(({ do: d }) => (
              <div key={d} style={{ fontSize: 12, color: 'var(--bk-text-secondary)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{d}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bk-error)', marginBottom: 10 }}>✗ Don't</div>
            {DOS_DONTS.map(({ dont }) => (
              <div key={dont} style={{ fontSize: 12, color: 'var(--bk-text-muted)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{dont}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 9. Spacing & Radius ── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">08 — Spacing & Radius</div>

        <div style={{ marginBottom: 48 }}>
          <div className="ds-brand-palette-group-label">Spacing scale</div>
          <div className="ds-brand-space-grid">
            {SPACING_SCALE.map(({ label, value }) => (
              <div key={label} className="ds-brand-space-item">
                <div
                  className="ds-brand-space-box"
                  style={{ width: value, height: value }}
                />
                <span className="ds-brand-space-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="ds-brand-palette-group-label">Border radius</div>
          <div className="ds-brand-radius-grid">
            {RADIUS_SCALE.map(({ label, value, usage }) => (
              <div key={label} className="ds-brand-radius-item">
                <div
                  className="ds-brand-radius-box"
                  style={{ borderRadius: value }}
                />
                <span className="ds-brand-radius-label">{label}</span>
                <span className="ds-brand-space-label" style={{ marginTop: 0 }}>{usage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
