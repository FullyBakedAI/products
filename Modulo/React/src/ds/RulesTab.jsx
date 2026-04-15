/**
 * RulesTab — design principles as a visual card grid.
 * 8 principles + accessibility standards. No walls of text.
 */
import { useTokenOverride } from '../TokenOverrideContext';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Dark-first design',
    desc: 'Built for crypto users who work at night. The dark palette reduces eye strain and makes colour-coded data (green/red) pop with maximum contrast.',
    tags: ['--bk-bg-base is the source of truth', 'Light mode is an inversion layer'],
  },
  {
    number: '02',
    title: 'Token-driven — no hardcoded values',
    desc: 'Every colour, spacing unit, and motion duration is a CSS custom property. Change a token once and every surface updates. Zero drift, zero exceptions.',
    tags: ['--bk-* for all values', 'Never hardcode hex in product code'],
  },
  {
    number: '03',
    title: 'Accessible — WCAG 2.1 AA minimum',
    desc: 'Contrast, touch targets, keyboard navigation, and screen reader support are non-negotiable. Accessibility is a constraint, not a feature flag.',
    tags: ['4.5:1 text contrast', '44px touch targets', 'React ARIA throughout'],
  },
  {
    number: '04',
    title: 'Mobile-first responsive',
    desc: 'Most DeFi decisions happen on a phone. We design for thumbs and 390px viewports. Desktop is an enhancement, not the baseline.',
    tags: ['390px primary viewport', 'Bottom-anchored CTAs', 'Touch-optimised inputs'],
  },
  {
    number: '05',
    title: 'Motion with purpose',
    desc: 'Animation communicates state change, hierarchy, and causality. Every transition serves a function. If you can remove it and lose no meaning, remove it.',
    tags: ['--bk-motion-* controls duration', 'Spring physics for natural feel', 'No looping decorative animation'],
  },
  {
    number: '06',
    title: 'Icon consistency — real assets only',
    desc: 'All product icons come from Figma. Never approximate with placeholder SVGs or wrong-size Lucide icons. Icon slots let agents swap icons without breaking layout.',
    tags: ['Lucide for UI chrome', 'Figma for product icons', 'Icon slots for overrides'],
  },
  {
    number: '07',
    title: 'Information hierarchy — biggest = most important',
    desc: 'Portfolio value is larger than token name. Token name is larger than wallet address. Visual weight maps directly to decision importance.',
    tags: ['One primary CTA per screen', 'Progressive disclosure', 'Exact numbers, no rounding'],
  },
  {
    number: '08',
    title: 'Every transaction has a review step',
    desc: 'No DeFi action is irreversible without a confirmation screen. Swap, stake, lend, borrow — all pass through /review with fee breakdown and a clear confirm CTA. Trust is built one confirmation at a time.',
    tags: ['openActions → /review → /success', 'Fee breakdown always visible', 'Undo toast on completion'],
  },
];

const A11Y_STANDARDS = [
  { standard: 'WCAG 2.1 AA', detail: 'Minimum contrast 4.5:1 for text, 3:1 for UI components' },
  { standard: 'React ARIA',  detail: 'All interactive elements use accessible components from react-aria-components' },
  { standard: 'Keyboard nav', detail: 'Full keyboard navigation with visible focus indicators on all interactive elements' },
  { standard: 'Screen readers', detail: 'Semantic HTML, ARIA labels, live regions for dynamic content updates' },
  { standard: '44px touch',  detail: 'Minimum 44×44px touch targets on all interactive elements (buttons, tabs, nav items)' },
];

export default function RulesTab() {
  const { getToken } = useTokenOverride();
  const brand   = getToken('--bk-brand-primary');
  const border  = getToken('--bk-border-subtle');
  const success = getToken('--bk-success');

  return (
    <div className="ds-rules-page">

      {/* Intro */}
      <div className="ds-rules-intro">
        <span className="ds-rules-intro-eyebrow">03 — Rules</span>
        <h2 className="ds-rules-intro-title">Not guidelines.<br />Constraints.</h2>
        <p className="ds-rules-intro-desc">
          Eight rules that govern every design and engineering decision at Modulo.
          These are enforced by the token system and component API — not documentation.
        </p>
      </div>

      {/* Principle cards grid */}
      <div className="ds-rules-grid">
        {PRINCIPLES.map(({ number, title, desc, tags }) => (
          <div key={number} className="ds-rule-card">
            <div className="ds-rule-card-number" style={{ color: brand }}>{number}</div>
            <h3 className="ds-rule-card-title">{title}</h3>
            <p className="ds-rule-card-desc">{desc}</p>
            <div className="ds-rule-card-example">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="ds-rule-example-tag"
                  style={{ color: brand, background: `${brand}10`, borderColor: `${brand}25` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Accessibility standards */}
      <div className="ds-a11y-section">
        <div className="ds-a11y-title">Accessibility standards</div>
        <div className="ds-a11y-list">
          {A11Y_STANDARDS.map(({ standard, detail }) => (
            <div key={standard} className="ds-a11y-row">
              <div className="ds-a11y-check" style={{ color: success }}>✓</div>
              <div className="ds-a11y-standard">{standard}</div>
              <div className="ds-a11y-detail">{detail}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
