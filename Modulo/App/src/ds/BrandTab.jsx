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

      {/* ── 4. Spacing & Radius ── */}
      <div className="ds-editorial-block">
        <div className="ds-editorial-label">03 — Spacing & Radius</div>

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
