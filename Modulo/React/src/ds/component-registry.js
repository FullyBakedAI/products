/**
 * Component registry — the BakeKit / Modulo component inventory.
 * Shared between StudioTab (gallery + demos) and AgenticGuideTab (component skills).
 *
 * kind:
 *   'component' — extracted, importable from './components'
 *   'standalone' — standalone file, not in /components/ (e.g. BottomNav, theme contexts)
 *   'primitive'  — React ARIA primitive used directly (react-aria-components)
 */

export const COMP_GROUPS = ['Actions', 'Feedback', 'Forms', 'Cards', 'Navigation', 'DeFi'];

export const COMPONENT_REGISTRY = [

  // ── Actions ──────────────────────────────────────────────────────────────────

  {
    id: 'button', group: 'Actions', name: 'AppButton', kind: 'component',
    description: 'White-label button wrapping React ARIA Button. Consolidates primary, action, icon, and close variants into one component. Full keyboard navigation, focus management, and screen reader support.',
    usage: 'One primary button per screen. Use action variant for swap/send CTAs. Use icon variant for icon-only buttons — always pass aria-label. Destructive flows require a confirmation step.',
    notes: 'Minimum 44px touch target enforced via CSS. Always label with an imperative verb (Swap, Send, Confirm). Never disable without communicating why.',
    tokens: ['--bk-brand-primary', '--bk-bg-card', '--bk-bg-elevated', '--bk-border-subtle', '--bk-text-primary', '--bk-font'],
    jsx: `import { AppButton } from './components';

<AppButton variant="primary" onPress={handleSubmit}>
  Confirm Swap
</AppButton>

// Icon-only — aria-label required
<AppButton variant="icon" aria-label="Close" onPress={onClose}>
  <CloseIcon />
</AppButton>`,
  },

  // ── Feedback ─────────────────────────────────────────────────────────────────

  {
    id: 'aria-dialog', group: 'Feedback', name: 'Dialog', kind: 'primitive',
    description: 'React ARIA Dialog from react-aria-components. Provides role="dialog", focus management (Tab cycles within the dialog), and Escape key dismissal. Used inside animated motion.div sheets.',
    usage: 'ActivityScreen transaction detail sheet. ReviewScreen confirmation sheet. Any bottom sheet where focus should be trapped inside.',
    notes: 'Place Dialog inside the motion.div (not around it) to preserve Framer Motion animations. Set style={{ outline: "none", display: "contents" }} so the Dialog wrapper is invisible. Do NOT manually add role="dialog" to the motion.div when using Dialog.',
    tokens: [],
    jsx: `import { Dialog } from 'react-aria-components';

// Inside a motion.div sheet:
<motion.div className="tx-detail-sheet" aria-modal="true" {...motionProps}>
  <Dialog aria-label="Transaction details" style={{ outline: 'none', display: 'contents' }}>
    {/* sheet content — focus trapped here */}
  </Dialog>
</motion.div>`,
  },

  {
    id: 'bottom-sheet', group: 'Feedback', name: 'BottomSheet', kind: 'component',
    description: 'Animated slide-up drawer with backdrop overlay. ESC key and backdrop tap dismiss it. Includes an optional drag handle pill.',
    usage: 'Token selection, contextual detail panels, lightweight confirmations. Used in swap, send, receive, review, actions screens.',
    notes: 'Maximum 60% viewport height on mobile. Always include a close affordance. showDragHandle defaults to true.',
    tokens: ['--bk-overlay', '--bk-bg-base', '--bk-border-subtle'],
    jsx: `import { BottomSheet } from './components';

<BottomSheet isOpen={isOpen} onClose={() => setOpen(false)}>
  <div>Sheet content</div>
</BottomSheet>`,
  },

  // ── Forms ─────────────────────────────────────────────────────────────────────

  {
    id: 'input', group: 'Forms', name: 'TextField + Input', kind: 'primitive',
    description: 'Text input using React ARIA TextField + Input from react-aria-components. Provides accessible label association, error messaging, and keyboard focus management. Never use a raw <input> element.',
    usage: 'ExploreScreen search field. SendScreen wallet address input. SwapSelectScreen token search. Any text-entry field in the app.',
    notes: 'Always pair with aria-label or a visible Label child. Raw <input> elements are prohibited — they lack accessible label binding. Import from react-aria-components (not @react-aria/textfield hooks).',
    tokens: ['--bk-bg-card', '--bk-border-subtle', '--bk-brand-primary', '--bk-error', '--bk-text-primary'],
    jsx: `import { TextField, Label, Input } from 'react-aria-components';

<TextField value={address} onChange={setAddress}>
  <Label>Recipient address</Label>
  <Input placeholder="0x…" />
</TextField>`,
  },

  {
    id: 'aria-tabs', group: 'Forms', name: 'Tabs', kind: 'primitive',
    description: 'React ARIA Tabs + TabList + Tab + TabPanel from react-aria-components. Arrow key navigation between tabs is provided automatically. Used for within-screen content switching where keyboard nav matters.',
    usage: 'SimulateScreen (Price change / If I staked everything tabs). Any tab interface where keyboard arrow-key navigation is required.',
    notes: 'TabSwitcher component wraps this for simple cases. Use Tabs directly when you need AnimatePresence on the TabPanel content or custom animation per-panel. selectedKey + onSelectionChange for controlled state.',
    tokens: ['--bk-brand-primary', '--bk-text-primary', '--bk-text-muted', '--bk-border-subtle', '--bk-font'],
    jsx: `import { Tabs, TabList, Tab, TabPanel } from 'react-aria-components';

<Tabs selectedKey={tab} onSelectionChange={setTab}>
  <TabList aria-label="Simulator mode">
    <Tab id="price" className={({ isSelected }) => \`simulate-tab\${isSelected ? ' active' : ''}\`}>
      Price change
    </Tab>
    <Tab id="stake" className={({ isSelected }) => \`simulate-tab\${isSelected ? ' active' : ''}\`}>
      If I staked everything
    </Tab>
  </TabList>
  <TabPanel id="price">{/* panel content */}</TabPanel>
  <TabPanel id="stake">{/* panel content */}</TabPanel>
</Tabs>`,
  },

  {
    id: 'financial-input', group: 'Forms', name: 'FinancialInputCard', kind: 'component',
    description: 'Card containing a numeric amount input, token selector button, and USD value display. Covers the amount-entry pattern in swap, send, and lend flows. Uses React ARIA TextField + Input with inputMode="decimal".',
    usage: 'Swap screen (You pay / You receive). Send screen amount entry. Lend/Borrow amount input.',
    notes: 'Numeric field uses inputMode="decimal" so mobile shows the decimal keyboard. USD equivalent should update on every keystroke. Never round the displayed amount.',
    tokens: ['--bk-bg-card', '--bk-bg-card-alt', '--bk-border-card', '--bk-pill-bg', '--bk-border-pill', '--bk-brand-primary', '--bk-text-primary', '--bk-text-muted', '--bk-text-placeholder', '--bk-font'],
    jsx: `import { FinancialInputCard } from './components';

<FinancialInputCard
  label="You pay"
  amount={amount}
  onAmountChange={setAmount}
  token={{ icon: ethIcon, symbol: 'ETH' }}
  onTokenSelect={() => navigate('/swap/select/pay')}
  usdValue={\`≈ $\${usdEquivalent}\`}
/>`,
  },

  {
    id: 'token-pill', group: 'Forms', name: 'TokenPill', kind: 'component',
    description: 'Interactive button representing a selected cryptocurrency token. Shows icon, symbol, and a chevron dropdown affordance. Supports an appear animation on mount.',
    usage: 'Anywhere the user selects a specific token. Tapping opens a bottom sheet with the full token list.',
    notes: 'Token icon from official source — never approximate with Lucide icons. Always show symbol, never full name. Pass appear={true} on first render to animate in.',
    tokens: ['--bk-pill-bg', '--bk-border-pill', '--bk-brand-primary', '--bk-text-primary', '--bk-text-muted', '--bk-bg-card', '--bk-font'],
    jsx: `import { TokenPill } from './components';

<TokenPill
  token={{ id: 'eth', name: 'ETH', icon: tokenEthSvg }}
  onPress={() => navigate('/swap/select/pay')}
  appear
/>`,
  },

  {
    id: 'aria-switch', group: 'Forms', name: 'Switch', kind: 'primitive',
    description: 'React ARIA Switch from react-aria-components. Renders with aria-checked semantics (correct for toggles) — not aria-pressed. Full keyboard support (Space to toggle) and [data-selected] state styling.',
    usage: 'Settings screen toggles. Autopilot enable/disable. Collateral enable toggle in Borrow tab (LendBorrowTab). Any binary on/off preference.',
    notes: 'Import from react-aria-components (not @react-aria/switch). Style via [data-selected] and [data-focused] CSS attribute selectors. Never use Button with aria-pressed for a toggle — use Switch.',
    tokens: ['--bk-brand-primary', '--bk-bg-card', '--bk-border-subtle', '--bk-text-primary'],
    jsx: `import { Switch } from 'react-aria-components';

<Switch
  isSelected={enabled}
  onChange={setEnabled}
  className="settings-toggle"
>
  Autopilot
</Switch>`,
  },

  // ── Cards ─────────────────────────────────────────────────────────────────────

  {
    id: 'asset-row', group: 'Cards', name: 'AssetRow', kind: 'component',
    description: 'Row displaying a token/asset with icon, name, chain badge, token amount, and USD value. Tappable when onPress is provided (wraps in React ARIA Button); renders as a plain div when display-only.',
    usage: 'Send screen token selector list. Receive screen asset list. Any context where the user picks from a list of their held assets.',
    notes: 'When interactive, auto-generates an aria-label combining name, chain, amount, and value. Always pass chain when the product is multi-chain.',
    tokens: ['--bk-bg-card', '--bk-brand-primary', '--bk-text-primary', '--bk-text-muted', '--bk-font', '--bk-radius-md'],
    jsx: `import { AssetRow } from './components';

// Tappable
<AssetRow
  icon={<img src={ethIcon} alt="" />}
  name="Ethereum"
  chain="Mainnet"
  amount="1.24 ETH"
  usdValue="$3,200"
  onPress={() => navigate('/asset/eth')}
/>

// Display-only (omit onPress)
<AssetRow icon={...} name="USDC" amount="921.25 USDC" usdValue="$921.25" />`,
  },

  {
    id: 'status-card', group: 'Cards', name: 'StatusCard', kind: 'component',
    description: 'Card displaying operation status with an inline SVG icon, title, subtitle, and key-value detail rows. All sections optional. Colour-coded by status: success green, pending brand, error red.',
    usage: 'Success screen after transaction, pending confirmation states, error recovery screens.',
    notes: 'Status icons are inline SVGs (aria-hidden). success uses --bk-success, error uses --bk-error, pending uses --bk-text-muted.',
    tokens: ['--bk-bg-card', '--bk-border-card', '--bk-border-subtle', '--bk-text-primary', '--bk-text-muted', '--bk-text-secondary', '--bk-success', '--bk-error', '--bk-font'],
    jsx: `import { StatusCard } from './components';

<StatusCard
  status="success"
  title="Swap complete"
  subtitle="0.5 ETH → 1,250 USDC"
  details={[
    { label: 'Fee',  value: '$2.40'   },
    { label: 'Time', value: '~12 sec' },
  ]}
/>`,
  },

  // ── Navigation ────────────────────────────────────────────────────────────────

  {
    id: 'bottom-nav', group: 'Navigation', name: 'BottomNav', kind: 'standalone',
    description: 'Five-item navigation bar anchored to the bottom of the viewport. Four labelled tabs (Home, Markets, Activity, Funds) plus a centre FAB for the primary action (Actions/Swap). Each item is feature-gated via useFeatures(). Hidden on desktop.',
    usage: 'Persistent on all primary screens. Hidden on modal sheets and linear confirmation flows. Rendered once in App.jsx.',
    notes: 'Each tab controlled by feature flags: f.nav.home, f.nav.explore, f.nav.fab, f.nav.activity. The Funds tab is always visible. Active state uses aria-current="page". Never shows on desktop.',
    tokens: ['--bk-bg-nav', '--bk-brand-primary', '--bk-brand-gradient', '--bk-text-muted', '--bk-border-subtle', '--bk-font', '--bk-z-overlay', '--bk-z-card'],
    jsx: `import BottomNav from './BottomNav';

// Rendered once, inside the main layout — not per-screen
<BottomNav />`,
  },

  {
    id: 'screen-header', group: 'Navigation', name: 'ScreenHeader', kind: 'component',
    description: 'Standardised top navigation bar with back/close buttons, title, and optional right-side slot. Supports transparent mode for hero/overlay screens. Consolidates the header pattern used across 10+ screens.',
    usage: 'All secondary screens — asset detail, settings, review, send. Pass onBack for drill-in screens, onClose for modal overlays.',
    notes: 'Always include a title. rightSlot is for contextual actions (settings gear, share). Use transparent variant when screen has a hero image or gradient header.',
    tokens: ['--bk-border-subtle', '--bk-brand-primary', '--bk-text-primary', '--bk-font'],
    jsx: `import { ScreenHeader } from './components';

<ScreenHeader
  title="Send"
  onBack={() => navigate(-1)}
  rightSlot={
    <Button aria-label="Settings" onPress={() => navigate('/settings')}>
      <SettingsIcon />
    </Button>
  }
/>`,
  },

  {
    id: 'tab-bar', group: 'Navigation', name: 'TabSwitcher', kind: 'component',
    description: 'Segmented tab control using React ARIA TabList + Tab. Parent manages selection state; component fires onChange on selection. Active state via [data-selected] attribute — no manual class toggling needed.',
    usage: 'Within-screen content switching. Explore uses this for category filtering. Lend/Borrow uses it for the Lend vs Borrow sub-tabs.',
    notes: 'Not a substitute for BottomNav. Should switch content, not navigate to new screens. Four tabs maximum.',
    tokens: ['--bk-brand-primary', '--bk-text-primary', '--bk-text-muted', '--bk-border-subtle', '--bk-font'],
    jsx: `import { TabSwitcher } from './components';

const [tab, setTab] = useState('all');

<TabSwitcher
  tabs={[
    { id: 'all',     label: 'All'     },
    { id: 'staking', label: 'Staking' },
    { id: 'lending', label: 'Lending' },
  ]}
  activeTab={tab}
  onChange={setTab}
/>`,
  },

  {
    id: 'feature-config', group: 'Navigation', name: 'FeatureConfig', kind: 'standalone',
    description: 'React context system for toggling features on/off without code changes. FeatureConfigProvider accepts a partial config — only specify overrides, defaults fill the rest. useFeatures() hook reads current state anywhere in the tree.',
    usage: 'Wrap the app root in FeatureConfigProvider. Use useFeatures() in any component to conditionally render based on flags. Use FeaturePanel for interactive live editing.',
    notes: 'Deep-merge pattern: { ...defaultFeatures.nav, ...config.nav }. setFeatures() replaces entire live state — always spread existing features when doing partial updates from toggles.',
    tokens: ['--bk-z-modal', '--bk-white-12', '--bk-white-05'],
    jsx: `import { useFeatures } from './theme/FeatureConfig';

const f = useFeatures();
{f.nav.autopilot && <AutopilotTab />}`,
  },

  {
    id: 'feature-panel', group: 'Navigation', name: 'FeaturePanel', kind: 'standalone',
    description: 'Interactive MVP builder panel. Floating trigger opens a slide-out drawer with live toggle switches for every feature flag. Ships with MVP, Phase 2, and Full Product presets. Saves custom presets to localStorage and exports as JSON.',
    usage: 'Render once inside FeatureConfigProvider, after the main route content. Appears as a floating "Build" badge. Only shows outside the design system page.',
    notes: 'Preset JSON files live in client-config/presets/. Version-control them — git history becomes the product scope history.',
    tokens: ['--bk-surface-2', '--bk-white-12', '--bk-white-05', '--bk-z-modal', '--bk-action-swap'],
    jsx: `import FeaturePanel from './theme/FeaturePanel';

// Inside AppInner (inside FeatureConfigProvider):
<FeaturePanel />`,
  },

  {
    id: 'brand-config', group: 'Navigation', name: 'BrandConfig', kind: 'standalone',
    description: 'White-label brand configuration context. Controls logo src, alt, width, height, and brand name throughout the app. BrandConfigProvider accepts a config override object.',
    usage: 'Wrap app root in BrandConfigProvider. Use useBrandConfig() wherever logo or brand name appears.',
    notes: 'Mirror of FeatureConfig pattern. For white-labelling: update defaultConfig in BrandConfig.jsx or pass config prop to provider.',
    tokens: [],
    jsx: `import { useBrandConfig } from './theme/BrandConfig';

const { logoSrc, logoAlt, logoWidth, logoHeight } = useBrandConfig();`,
  },

  // ── DeFi ─────────────────────────────────────────────────────────────────────

  {
    id: 'audit-badge', group: 'DeFi', name: 'AuditBadge', kind: 'component',
    description: 'Protocol audit status pill. Shows audit firm and year inline. Tapping opens a BottomSheet with TVL, full report link, and audit summary.',
    usage: 'Platform/protocol selector rows, asset detail screens, lending platform cards.',
    notes: 'Returns null if no firm provided. Use inline prop for compact rendering inside list rows.',
    tokens: ['--bk-success', '--bk-bg-elevated', '--bk-brand-primary', '--bk-text-primary', '--bk-text-muted', '--bk-text-secondary', '--bk-font'],
    jsx: `import { AuditBadge } from './components';

<AuditBadge
  protocolName="Aave v3"
  firm="CertiK"
  year={2024}
  tvl="$12.4B"
  inline
/>`,
  },

  {
    id: 'fee-breakdown', group: 'DeFi', name: 'FeeBreakdown', kind: 'component',
    description: 'Expandable fee summary. Collapsed shows total; tapping expands to itemised list with animated chevron. Full aria-expanded and list semantics.',
    usage: 'Review screen, swap confirmation, any transaction summary where fees need transparency.',
    notes: 'Always show the total even when collapsed. Items array should include network fee, protocol fee, and any other line items.',
    tokens: ['--bk-border-subtle', '--bk-brand-primary', '--bk-text-primary', '--bk-text-muted', '--bk-text-secondary', '--bk-font'],
    jsx: `import { FeeBreakdown } from './components';

<FeeBreakdown
  total="$3.28"
  items={[
    { label: 'Network',  amount: '$2.40' },
    { label: 'Protocol', amount: '$0.88' },
  ]}
/>`,
  },

  {
    id: 'ltv-bar', group: 'DeFi', name: 'LTVBar', kind: 'component',
    description: 'Loan-to-Value health bar with animated fill, warning/liquidation threshold markers, and colour-coded status. Help button opens an explanation BottomSheet.',
    usage: 'Borrow tab, lending position detail, portfolio risk overview.',
    notes: 'Defaults: warning at 75%, liquidation at 85%. Colour transitions automatically: green (safe) → amber (warning) → red (at risk). Always show borrow + collateral amounts when available.',
    tokens: ['--bk-success', '--bk-warning', '--bk-error', '--bk-brand-primary', '--bk-bg-elevated', '--bk-border-subtle', '--bk-text-primary', '--bk-text-muted', '--bk-text-secondary', '--bk-font'],
    jsx: `import { LTVBar } from './components';

<LTVBar
  current={42}
  warning={75}
  liquidation={85}
  borrowAmount="$8,400"
  collateralAmount="$20,000"
/>`,
  },

  {
    id: 'tx-path', group: 'DeFi', name: 'TransactionPath', kind: 'component',
    description: 'Asset route visualiser. Shows how a swap moves through tokens, bridges, and protocols with chain-coloured dots, arrow connectors, and estimated time.',
    usage: 'Swap review, cross-chain bridge confirmation, autopilot route display.',
    notes: 'Supports three step types: token (with chain), bridge, and protocol. Use compact mode for inline display in list rows. Returns null if steps array is empty.',
    tokens: ['--bk-bg-card', '--bk-bg-elevated', '--bk-brand-primary', '--bk-warning', '--bk-border-subtle', '--bk-text-primary', '--bk-text-muted'],
    jsx: `import { TransactionPath } from './components';

<TransactionPath
  steps={[
    { type: 'token',    symbol: 'ETH',  chain: 'Ethereum' },
    { type: 'bridge',   name: 'Stargate' },
    { type: 'token',    symbol: 'ETH',  chain: 'Arbitrum' },
  ]}
  estimatedTime="~45 sec"
/>`,
  },

];

export const COMP_CONTROLS = {
  button:        [{ id: 'variant', label: 'Variant', options: ['primary','secondary','ghost','destructive'], def: 'primary' }],
  input:         [{ id: 'state',   label: 'State',   options: ['default','focused','error','disabled'],      def: 'default' }],
  'bottom-nav':  [{ id: 'active',  label: 'Active',  options: ['Home','Markets','Activity','Funds'],         def: 'Home' }],
  'status-card': [{ id: 'status',  label: 'Status',  options: ['success','pending','error'],                 def: 'success' }],
  'ltv-bar':     [{ id: 'current', label: 'LTV %',   options: ['20','42','75','90'],                         def: '42' }],
};
