/**
 * AgenticGuideTab — machine-readable brief for AI agents.
 * Sections: Agent Brief · Component Skills · Token Contract
 * All sections have copy-to-clipboard buttons.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { TOKEN_DEFINITIONS, useTokenOverride } from '../TokenOverrideContext';
import { COMPONENT_REGISTRY } from './component-registry';
import logoModulo from '../assets/logo-modulo.svg';

// ─────────────────────────────────────────────────────────────────────────────
// CopyBlock — labelled pre block with one-click copy
// ─────────────────────────────────────────────────────────────────────────────

function CopyBlock({ label, content }) {
  const [copied, setCopied] = useState(false);
  const { getToken } = useTokenOverride();
  const brand  = getToken('--bk-brand-primary');
  const success = getToken('--bk-success');

  function copy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="ds-copy-block">
      <div className="ds-copy-block-header">
        <span className="ds-copy-block-label">{label}</span>
        <button
          className="ds-copy-btn"
          onClick={copy}
          style={{ color: copied ? success : brand }}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="ds-copy-pre">{content}</pre>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ComponentSkillCard — expandable card per component
// ─────────────────────────────────────────────────────────────────────────────

function ComponentSkillCard({ comp }) {
  const [open, setOpen] = useState(false);
  const { getToken } = useTokenOverride();
  const brand  = getToken('--bk-brand-primary');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textM  = getToken('--bk-text-muted');

  return (
    <div className="ds-comp-skill-card">
      <button
        className="ds-comp-skill-header"
        onClick={() => setOpen(v => !v)}
        style={{ borderBottom: open ? `1px solid ${border}` : 'none' }}
      >
        <div>
          <span className="ds-comp-skill-name" style={{ color: textP }}>{comp.name}</span>
          <span className="ds-comp-skill-group" style={{ color: textM, marginLeft: 8 }}>{comp.group}</span>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'flex', color: textM }}
        >
          <LucideIcons.ChevronDown size={14} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="ds-comp-skill-body">
              {comp.description && (
                <div className="ds-comp-skill-field">
                  <span className="ds-comp-skill-field-label">Description</span>
                  <p className="ds-comp-skill-field-text" style={{ color: textM }}>{comp.description}</p>
                </div>
              )}
              {comp.usage && (
                <div className="ds-comp-skill-field">
                  <span className="ds-comp-skill-field-label">When to use</span>
                  <p className="ds-comp-skill-field-text" style={{ color: textM }}>{comp.usage}</p>
                </div>
              )}
              {comp.notes && (
                <div className="ds-comp-skill-field">
                  <span className="ds-comp-skill-field-label">Do / Don't</span>
                  <p className="ds-comp-skill-field-text" style={{ color: textM }}>{comp.notes}</p>
                </div>
              )}
              {comp.tokens && comp.tokens.length > 0 && (
                <div className="ds-comp-skill-field">
                  <span className="ds-comp-skill-field-label">Required tokens</span>
                  <div className="ds-comp-skill-tokens" style={{ marginTop: 4 }}>
                    {comp.tokens.map(t => (
                      <span key={t} className="ds-comp-skill-token-tag" style={{ color: brand }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {comp.jsx && (
                <div className="ds-comp-skill-field">
                  <span className="ds-comp-skill-field-label">JSX</span>
                  <pre style={{ fontFamily: 'monospace', fontSize: 11, color: textM, marginTop: 4, padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: 6, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {comp.jsx}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AgenticGuideTab
// ─────────────────────────────────────────────────────────────────────────────

export default function AgenticGuideTab() {
  const { getToken } = useTokenOverride();

  const brand  = getToken('--bk-brand-primary');
  const border = getToken('--bk-border-subtle');
  const textP  = getToken('--bk-text-primary');
  const textS  = getToken('--bk-text-secondary');
  const textM  = getToken('--bk-text-muted');
  const bgCard = getToken('--bk-bg-card');

  // Build token manifest from current values
  const tokenManifest = TOKEN_DEFINITIONS.reduce((acc, t) => {
    acc[t.key] = getToken(t.key);
    return acc;
  }, {});

  const systemPrompt = `You are a UI builder for Modulo — a cross-chain DeFi platform. v3.0
Brand: "One vault, every chain."
Voice: Clear, confident, precise, calm. Never use jargon without explanation.

Stack:
- React + React ARIA (react-aria-components) + Framer Motion
- React Router v7 (HashRouter)
- Vite build → outputs to ../Prototype/modulo/
- CSS custom properties (--bk-* tokens) — never hardcode values
- All icons from src/assets/*.svg — NEVER use Lucide in product screens

Design constraints:
- Dark-first UI, 402px viewport (iPhone 17 Pro), WCAG 2.1 AA minimum
- All colours via --bk-* tokens. Zero hardcoded hex.
- All interactive elements: React ARIA Button with onPress. Never <button onClick> or <div onClick>.
- Primary CTA colour: ${brand}
- App background: ${getToken('--bk-bg-base')}
- Text primary: ${getToken('--bk-text-primary')}
- One primary CTA per screen, bottom-anchored
- 44px minimum touch targets
- Never truncate financial values
- No navigate(-1) — always explicit routes
- No dead-end buttons — every button goes somewhere
- onTap not onClick on draggable motion.div elements
- Motion from motion-tokens.js, not raw durations

Component stack: react-aria-components → BakeKit tokens → shared components → screen components
Typography: Inter, weights 400/500/600/700
Icons: src/assets/*.svg only — never Lucide in product screens

Screens (17 total):
HomeScreen (/), ExploreScreen (/explore), ActivityScreen (/activity) — root screens with BottomNav
SwapScreen (/swap), SwapSelectScreen (/swap/select/:side), SendScreen (/send),
SendAmountScreen (/send/amount), ReceiveScreen (/receive), AssetScreen (/asset/:id),
ActionsScreen (/actions), ReviewScreen (/review), SuccessScreen (/success),
OptimiseScreen (/optimise), AutopilotScreen (/autopilot), SimulateScreen (/simulate),
AchievementsScreen (/achievements), SettingsScreen (/settings) — modal/sheet screens

Shared components to extract (if pattern in 2+ screens):
TokenInputCard, ScreenHeader, SheetHandle, TokenPill, FilterPills, OpportunityRow, CTAButton

Screen structure:
<motion.main className="[screen]-screen">
  <StatusBar />
  <ScreenHeader title="..." onBack={() => navigate('/parent')} />
  <div className="scroll-content">...content from shared components...</div>
  <BottomNav />  {/* root screens only */}
</motion.main>

Read Skills/ folder for full design system: tokens.md, components.md, constraints.md, contexts.md, qa-checklist.md`;

  const constraintsBlock = `HARD RULES (never break these):

Visual:
- Never hardcode a hex value — use --bk-* tokens
- Never use pure white (#ffffff) or pure black (#000000)
- Never use more than one primary CTA per screen
- Never approximate brand assets — use exported SVGs

Interaction:
- Every interactive element must use React ARIA Button with onPress
- Minimum 44×44px touch target on every interactive element
- Never show a destructive action without a confirmation step
- Never navigate back using navigate(-1) — use explicit paths
- onTap not onClick on draggable motion.div elements

Content:
- Never truncate financial values
- Never use jargon without explanation in user-facing copy
- Error messages must say what happened AND what to do next
- Loading states show structure (skeletons), never spinners

Accessibility:
- WCAG 2.1 AA minimum, always
- Every <img> needs an alt attribute
- Every form element needs a visible label or aria-label
- Focus states must be visible — never outline: none without a custom indicator`;

  const contextsBlock = `USER CONTEXTS — design differently based on situation:

1. REVIEWING ("What do I have?")
   Stakes: Low. Design for scanning. Lead with meaningful numbers.
   Examples: HomeScreen portfolio card, token list

2. DECIDING ("Should I make this swap?")
   Stakes: Medium-high. Every number visible without scrolling.
   Rate and fees upfront. No noise, no upsell.
   Examples: SwapScreen

3. CONFIRMING ("Lock it in.")
   Stakes: High. Show only what changes. CTA matches the action exactly.
   Fast feedback once submitted.
   Examples: ReviewScreen

4. SENDING ("Get this to someone else.")
   Stakes: High. Wrong address = lost funds.
   Address prominent, network explicit, balance shown before amount.
   Examples: SendScreen, SendAmountScreen

5. DISCOVERING ("What's out there?")
   Stakes: Low. Browsing mode. No urgency, easy comparison.
   Examples: ExploreScreen

6. RECEIVING ("Give someone my address.")
   Stakes: Low. Large QR, copy button front and centre, no financial data.
   Examples: ReceiveScreen`;

  const tokenJSON = JSON.stringify(tokenManifest, null, 2);

  const componentInventory = COMPONENT_REGISTRY.map(c =>
    `${c.name.padEnd(22)} [${c.group}]  — ${c.usage}`
  ).join('\n');

  const componentSkillsBlock = COMPONENT_REGISTRY.map(c => [
    `## ${c.name} (${c.group})`,
    `Description: ${c.description}`,
    `When to use: ${c.usage}`,
    `Notes: ${c.notes}`,
    c.tokens?.length ? `Tokens: ${c.tokens.join(', ')}` : '',
    c.jsx ? `JSX:\n${c.jsx}` : '',
  ].filter(Boolean).join('\n')).join('\n\n---\n\n');

  const BENEFITS = [
    { title: 'Brand-safe generation',  body: 'Any agent building Modulo UI uses these tokens and constraints. Zero brand drift at scale.' },
    { title: 'No designer bottleneck', body: 'Teams ship new screens without waiting for design review — the system enforces standards.' },
    { title: 'Consistent everywhere',  body: 'From prototype to production, every surface uses the same token system. One change, everywhere.' },
    { title: 'Shareable brand spec',   body: 'Send the system prompt to any agency, contractor, or AI tool. They start on-brand immediately.' },
  ];

  return (
    <div className="ds-agent-page">

      {/* Intro */}
      <div className="ds-agent-intro">
        <span className="ds-agent-intro-eyebrow">04 — Agentic Guide</span>
        <h2 className="ds-agent-intro-title">Design without<br />a designer.</h2>
        <p className="ds-agent-intro-desc">
          Context blocks any AI agent needs to build compliant Modulo UI on demand —
          no designer required, no brand drift at scale.
        </p>
      </div>

      {/* Benefits grid */}
      <div className="ds-agent-benefits">
        {BENEFITS.map(({ title, body }) => (
          <div key={title} className="ds-agent-benefit-card">
            <div className="ds-agent-benefit-title" style={{ color: textP }}>{title}</div>
            <div className="ds-agent-benefit-body" style={{ color: textM }}>{body}</div>
          </div>
        ))}
      </div>

      {/* Agent Brief */}
      <div className="ds-agent-section">
        <div className="ds-agent-section-title">Agent Brief</div>
        <div className="ds-copy-blocks">
          <CopyBlock
            label="SYSTEM PROMPT — paste into any AI agent, Cursor, or Claude"
            content={systemPrompt}
          />
          <CopyBlock
            label="CONSTRAINTS — hard rules every agent must follow"
            content={constraintsBlock}
          />
          <CopyBlock
            label="CONTEXTS — design differently based on user situation"
            content={contextsBlock}
          />
          <CopyBlock
            label="COMPONENT INVENTORY — available components and their roles"
            content={componentInventory}
          />
        </div>
      </div>

      {/* Component Skills */}
      <div className="ds-agent-section">
        <div className="ds-agent-section-title">Component Skills</div>
        <div style={{ marginBottom: 12 }}>
          <CopyBlock
            label="ALL COMPONENT SKILLS — structured spec for all components"
            content={componentSkillsBlock}
          />
        </div>
        <div className="ds-comp-skills">
          {COMPONENT_REGISTRY.map(comp => (
            <ComponentSkillCard key={comp.id} comp={comp} />
          ))}
        </div>
      </div>

      {/* Token Contract */}
      <div className="ds-agent-section">
        <div className="ds-agent-section-title">Token Contract</div>
        <div style={{ marginBottom: 16 }}>
          <CopyBlock
            label="TOKEN MANIFEST — current token values as JSON"
            content={tokenJSON}
          />
        </div>
        <div className="ds-token-contract-wrap">
          <table className="ds-token-table">
            <thead>
              <tr>
                <th></th>
                <th>Token</th>
                <th>Current value</th>
                <th>Default</th>
                <th>Group</th>
              </tr>
            </thead>
            <tbody>
              {TOKEN_DEFINITIONS.map(t => {
                const val = getToken(t.key);
                const isColor = /^#|^rgb/.test(val);
                return (
                  <tr key={t.key}>
                    <td>
                      {isColor && (
                        <span className="ds-token-table-swatch" style={{ background: val }} />
                      )}
                    </td>
                    <td className="ds-token-table-key">{t.key}</td>
                    <td className="ds-token-table-val">{val}</td>
                    <td className="ds-token-table-default">{t.default}</td>
                    <td className="ds-token-table-group" style={{ color: textM }}>{t.group}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* About Modulo */}
      <div className="ds-agent-section">
        <div className="ds-agent-section-title">About Modulo</div>
        <div style={{ background: bgCard, border: `1px solid ${border}`, borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <img src={logoModulo} alt="Modulo" height="16" />
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: `${brand}15`, color: brand }}>
              DeFi · Cross-chain
            </span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.65, color: textS, marginBottom: 18 }}>
            Modulo is a cross-chain DeFi platform that unifies token management across every major chain.
            One vault, one interface — swap, send, receive, and earn across Ethereum, Solana, and beyond.
          </p>
          {[
            { label: 'Value proposition', value: 'Eliminate multi-wallet friction for DeFi users' },
            { label: 'Primary audience',  value: 'DeFi-intermediate users managing 3+ tokens' },
            { label: 'Design partner',    value: 'Built with BakedUX / Fully Baked methodology' },
          ].map(({ label, value }) => (
            <div key={label} style={{ padding: '10px 0', borderTop: `1px solid ${border}` }}>
              <div style={{ fontSize: 11, color: textM, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, color: textP }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
