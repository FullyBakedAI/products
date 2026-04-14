/**
 * Component registry — the BakeKit / Modulo component inventory.
 * Shared between StudioTab (gallery + demos) and AgenticGuideTab (component skills).
 */

export const COMP_GROUPS = ['Actions', 'Feedback', 'Forms', 'Cards', 'Navigation', 'DeFi'];

export const COMPONENT_REGISTRY = [
  {
    id: 'button', group: 'Actions', name: 'Button',
    description: 'The primary interactive element across the product. Built on React ARIA Button for full keyboard navigation, focus management, and screen reader support. Supports four visual variants and three interactive states.',
    usage: 'One primary button per screen. Ghost and secondary variants for supporting actions. Destructive variant requires a confirmation step before executing.',
    notes: 'Minimum 44px touch target enforced via CSS. Always label with an imperative verb (Swap, Send, Confirm). Never disable a button without communicating why.',
    tokens: ['--bk-brand-primary', '--bk-bg-card', '--bk-border-subtle', '--bk-text-primary', '--bk-text-secondary'],
    jsx: `import { Button } from 'react-aria-components';\n\n<Button className="action-btn">\n  Label\n</Button>`,
  },
  {
    id: 'toast', group: 'Feedback', name: 'Toast',
    description: 'Non-blocking status messages that appear at the top of the screen. Three types: success (transaction confirmed), pending (waiting for chain), error (transaction failed or rejected).',
    usage: 'Fire after any async operation completes. Auto-dismiss after 3.2 seconds. Stack if multiple fire simultaneously.',
    notes: 'Copy must be specific — say what happened. Never use for warnings requiring action; use a modal instead.',
    tokens: ['--bk-bg-elevated', '--bk-border-subtle', '--bk-success', '--bk-error', '--bk-brand-primary', '--bk-text-primary'],
    jsx: `import { toast } from 'sonner';\n\ntoast.success('Transaction confirmed');`,
  },
  {
    id: 'bottom-sheet', group: 'Feedback', name: 'Bottom sheet',
    description: 'Modal overlay that slides up from the bottom using a spring animation. Used for token selection, contextual detail panels, and lightweight confirmations.',
    usage: 'Token selection, contextual detail panels, lightweight confirmations.',
    notes: 'Maximum 60% viewport height on mobile. Always include a close affordance. Tapping the backdrop dismisses.',
    tokens: ['--bk-bg-card', '--bk-border-subtle', '--bk-text-primary'],
    jsx: '',
  },
  {
    id: 'skeleton', group: 'Feedback', name: 'Skeleton loader',
    description: 'Structure-preserving placeholder shown while data loads. Shimmer animation signals active loading state. Prevents layout shift when content arrives.',
    usage: 'Use instead of spinners. Match the skeleton shape to the content it stands in for.',
    notes: 'Escalate to an error state if data has not arrived after 3 seconds. Never show a skeleton indefinitely.',
    tokens: ['--bk-bg-card', '--bk-border-subtle'],
    jsx: '',
  },
  {
    id: 'badge', group: 'Feedback', name: 'Status badge',
    description: 'Inline status indicator for transaction and portfolio states. Colour-coded: success green, brand purple for pending, error red.',
    usage: 'Transaction lists, confirmation screens, activity feeds.',
    notes: 'Text should be a noun (Confirmed, Pending, Failed), not a verb. Never use for navigation or actions.',
    tokens: ['--bk-success', '--bk-error', '--bk-brand-primary'],
    jsx: '',
  },
  {
    id: 'input', group: 'Forms', name: 'Input field',
    description: 'Text input with focus, error, and disabled states. Border colour and box shadow communicate state without relying on colour alone.',
    usage: 'Wallet addresses, search fields, name inputs. Use token pill for amount inputs.',
    notes: 'Always pair with a visible label. Inline validation only after first blur — not on every keystroke.',
    tokens: ['--bk-bg-card', '--bk-border-subtle', '--bk-brand-primary', '--bk-error'],
    jsx: '',
  },
  {
    id: 'token-pill', group: 'Forms', name: 'Token pill',
    description: 'Token selector chip showing icon, symbol, and a chevron dropdown affordance. Used inside swap cards and amount inputs to let users select which token they are working with.',
    usage: 'Anywhere the user selects a specific token. Tapping opens a bottom sheet with the full token list.',
    notes: 'Token icon from official source — never approximate with Lucide icons. Always show symbol, never full name.',
    tokens: ['--bk-brand-primary', '--bk-text-primary'],
    jsx: '',
  },
  {
    id: 'pct-pills', group: 'Forms', name: 'Percentage pills',
    description: 'Preset amount selectors (25%, 50%, 75%, Max). Allow quick entry without using the keyboard. Active pill highlighted in brand colour.',
    usage: 'Below amount inputs in Swap and Send screens only.',
    notes: 'Max must calculate from available balance in real time. Never hardcode a value.',
    tokens: ['--bk-brand-primary'],
    jsx: '',
  },
  {
    id: 'financial-input-card', group: 'Forms', name: 'Financial input card',
    description: 'Compound card combining a token selector pill, numeric amount input, and USD equivalent display. Consolidates the amount-entry pattern across swap, send, and lending flows. Built on React ARIA TextField + Input for the numeric field; token selector is a Button that fires onTokenSelect.',
    usage: 'Swap screen (pay + receive cards), Send screen, Lend/Borrow amount entry. Always render as a pair in swap flows with a direction toggle between them.',
    notes: 'Controlled component — parent owns amount and token state. onTokenSelect should open a BottomSheet token picker. USD value string is pre-formatted by the caller. Never open a picker internally.',
    tokens: ['--bk-bg-card', '--bk-border-card', '--bk-text-primary', '--bk-text-muted', '--bk-text-placeholder', '--bk-pill-bg', '--bk-border-pill', '--bk-font'],
    jsx: `import { FinancialInputCard } from './components/FinancialInputCard';\n\n<FinancialInputCard\n  label="You pay"\n  amount={amount}\n  onAmountChange={setAmount}\n  token={{ icon: ethIcon, symbol: 'ETH', name: 'Ethereum' }}\n  onTokenSelect={openTokenPicker}\n  usdValue="≈ $1,234.56"\n/>`,
  },
  {
    id: 'asset-row', group: 'Cards', name: 'Asset row',
    description: 'Tappable row displaying a token with icon, name, chain, amount, and USD value. Used in token selection lists and portfolio drill-downs. Wraps content in a React ARIA Button when onPress is provided; renders as a plain div otherwise.',
    usage: 'Token selection bottom sheets, send destination lists, portfolio asset lists. Pass onPress to make the row interactive.',
    notes: 'Chain label is optional — omit for single-chain tokens. Always show USD value when available. Chevron only appears when onPress is provided.',
    tokens: ['--bk-bg-card', '--bk-border-subtle', '--bk-text-primary', '--bk-text-muted'],
    jsx: `import { AssetRow } from './components/AssetRow';\n\n<AssetRow\n  icon={<img src={ethIcon} alt="ETH" width={32} height={32} />}\n  name="Ethereum"\n  chain="Mainnet"\n  amount="1.24 ETH"\n  usdValue="$3,200"\n  onPress={() => selectToken('eth')}\n/>`,
  },
  {
    id: 'token-card', group: 'Cards', name: 'Token card',
    description: 'Portfolio row showing token icon, name, balance, current USD value, and 24h change. The primary data unit of the portfolio list.',
    usage: 'Home screen portfolio list. Tapping drills into token detail.',
    notes: 'Positive change in success green. Negative in error red. Zero or undefined in muted text.',
    tokens: ['--bk-bg-base', '--bk-text-primary', '--bk-text-muted', '--bk-success', '--bk-error', '--bk-brand-primary', '--bk-border-subtle'],
    jsx: `<div className="token-row-outer">\n  {/* token row content */}\n</div>`,
  },
  {
    id: 'swap-card', group: 'Cards', name: 'Swap card',
    description: 'The pay/receive surface in the swap flow. Shows amount (large numeral), selected token (pill), and fiat equivalent. Two instances stack with the direction toggle between them.',
    usage: 'Swap screen only. Always appear as a pair.',
    notes: 'Amount accepts numeric input only. USD equivalent updates on every keystroke. Never round the displayed amount.',
    tokens: ['--bk-bg-card', '--bk-border-subtle', '--bk-brand-primary', '--bk-text-primary', '--bk-text-muted'],
    jsx: '',
  },
  {
    id: 'bottom-nav', group: 'Navigation', name: 'Bottom nav',
    description: 'Four-item navigation bar anchored to the bottom of the viewport. Active item in brand colour with filled icon weight.',
    usage: 'Persistent on all primary screens. Hidden on modal sheets and linear confirmation flows.',
    notes: 'Labels always visible — no label-on-active-only patterns. 44px tap targets. Four items maximum.',
    tokens: ['--bk-bg-nav', '--bk-brand-primary', '--bk-text-muted', '--bk-border-subtle', '--bk-brand-gradient'],
    jsx: `import BottomNav from './BottomNav';\n\n<BottomNav />`,
  },
  {
    id: 'feature-config', group: 'Navigation', name: 'FeatureConfig',
    description: 'React context system for toggling features on/off without code changes. FeatureConfigProvider accepts a partial config — only specify overrides, defaults fill the rest. useFeatures() hook reads the current state anywhere in the tree.',
    usage: 'Wrap the app root in FeatureConfigProvider. Use useFeatures() in any component to conditionally render based on flags. Use FeaturePanel for interactive live editing.',
    notes: 'Deep-merge pattern: { ...defaultFeatures.nav, ...config.nav }. setFeatures() replaces the entire live state — always spread existing features when doing partial updates from toggles.',
    tokens: ['--bk-z-modal', '--bk-white-12', '--bk-white-05'],
    jsx: `import { useFeatures } from './theme/FeatureConfig';\n\nconst f = useFeatures();\n{f.nav.autopilot && <AutopilotTab />}`,
  },
  {
    id: 'feature-panel', group: 'Navigation', name: 'FeaturePanel',
    description: 'Interactive MVP builder panel. Floating trigger opens a slide-out drawer with live toggle switches for every feature flag. Ships with MVP, Phase 2, and Full Product presets. Saves custom presets to localStorage and exports as JSON.',
    usage: 'Render once inside FeatureConfigProvider, after the main route content. Appears as a floating "Build" badge. Only shows outside the design system page.',
    notes: 'Preset JSON files live in client-config/presets/. Version-control them — git history becomes the product scope history.',
    tokens: ['--bk-surface-2', '--bk-white-12', '--bk-white-05', '--bk-z-modal', '--bk-action-swap'],
    jsx: `import FeaturePanel from './theme/FeaturePanel';\n\n// Inside AppInner (inside FeatureConfigProvider):\n<FeaturePanel />`,
  },
  {
    id: 'brand-config', group: 'Navigation', name: 'BrandConfig',
    description: 'White-label brand configuration context. Controls logo src, alt, width, height, and brand name throughout the app. BrandConfigProvider accepts a config override object.',
    usage: 'Wrap app root in BrandConfigProvider. Use useBrandConfig() wherever logo or brand name appears.',
    notes: 'Mirror of FeatureConfig pattern. For white-labelling: update defaultConfig in BrandConfig.jsx or pass config prop to provider.',
    tokens: [],
    jsx: `import { useBrandConfig } from './theme/BrandConfig';\n\nconst { logoSrc, logoAlt, logoWidth, logoHeight } = useBrandConfig();`,
  },
  {
    id: 'tab-bar', group: 'Navigation', name: 'Tab bar',
    description: 'Horizontal tab switcher for content views within a single screen. Active tab indicated by brand-colour underline.',
    usage: 'Within-screen content switching. Explore screen uses this for category filtering.',
    notes: 'Not a substitute for bottom nav. Should switch content, not navigate to new screens. Four tabs maximum.',
    tokens: ['--bk-bg-card', '--bk-brand-primary', '--bk-text-primary', '--bk-text-muted', '--bk-border-subtle'],
    jsx: `<div className="tabs" role="tablist">\n  <button className="tab active">Tokens</button>\n  <button className="tab">NFTs</button>\n</div>`,
  },
  {
    id: 'tab-switcher', group: 'Navigation', name: 'Tab switcher',
    description: 'White-label segmented tab control built on React ARIA Tabs + TabList + Tab. Parent-controlled: activeTab + onChange manage selection state. Active state driven by data-selected attribute set automatically by React ARIA — no manual class toggling required.',
    usage: 'Within-screen content tabs wherever React ARIA keyboard navigation and accessibility semantics are needed. Use instead of raw tab-bar for new white-label builds.',
    notes: 'Controlled component — always pass activeTab and onChange. Tab ids must be unique within the switcher. Keyboard navigation (arrow keys, Home, End) is handled automatically by React ARIA.',
    tokens: ['--bk-text-muted', '--bk-text-primary', '--bk-brand-primary', '--bk-border-subtle', '--bk-font'],
    jsx: `import { TabSwitcher } from './components/TabSwitcher';\n\n<TabSwitcher\n  tabs={[{ id: 'tokens', label: 'Tokens' }, { id: 'nfts', label: 'NFTs' }]}\n  activeTab={activeTab}\n  onChange={setActiveTab}\n/>`,
  },
  {
    id: 'tx-row', group: 'DeFi', name: 'Transaction row',
    description: 'Activity list item showing type (sent/received/swapped), counterparty address, token amounts, and fiat values. Icon and colour encode the transaction direction.',
    usage: 'Activity feed, portfolio detail, transaction history.',
    notes: 'Timestamp in relative format for <7 days, absolute thereafter. Never truncate or round amounts.',
    tokens: ['--bk-bg-card', '--bk-success', '--bk-error', '--bk-brand-primary', '--bk-text-primary', '--bk-text-muted'],
    jsx: '',
  },
  {
    id: 'step-progress', group: 'DeFi', name: 'Step progress',
    description: 'Three-step linear indicator for transaction flows: Review → Approve → Confirm on-chain. Steps render as done (filled), active (brand), or pending (outline).',
    usage: 'Swap confirmation flow. Send confirmation flow.',
    notes: 'Never skip steps or show all as done simultaneously. Be honest about the current on-chain state.',
    tokens: ['--bk-success', '--bk-brand-primary', '--bk-border-subtle', '--bk-text-primary'],
    jsx: '',
  },
  {
    id: 'confirm-summary', group: 'DeFi', name: 'Confirmation summary',
    description: 'Pre-execution summary card showing the complete transaction: token pair, amounts, exchange rate, network fee, and the final CTA.',
    usage: 'Swap confirmation. Send confirmation.',
    notes: 'Exchange rate must refresh if stale >15s. Show slippage tolerance. Never round amounts on this surface.',
    tokens: ['--bk-bg-card', '--bk-border-subtle', '--bk-brand-primary', '--bk-success', '--bk-text-primary', '--bk-text-muted'],
    jsx: '',
  },
  {
    id: 'portfolio-metric', group: 'DeFi', name: 'Portfolio metric',
    description: 'Hero value block for total portfolio value with 24h change. Large numeral hierarchy establishes the dominant visual weight on the Home screen.',
    usage: 'Home screen hero area. Portfolio detail header.',
    notes: 'Locale-formatted currency. Animated count-up on first load. Change indicator always includes sign (+ or −).',
    tokens: ['--bk-bg-card', '--bk-success', '--bk-error', '--bk-brand-primary', '--bk-text-primary'],
    jsx: '',
  },
  {
    id: 'wallet-chip', group: 'DeFi', name: 'Wallet address chip',
    description: 'Compact address display with identicon, truncated address, copy action, and optional network badges.',
    usage: 'Receive screen, transaction detail, address confirmation flows.',
    notes: 'Always truncate to 0x4a3f…c12d format. Copy to clipboard with confirmation feedback.',
    tokens: ['--bk-bg-card', '--bk-border-subtle', '--bk-brand-primary', '--bk-text-primary', '--bk-text-muted'],
    jsx: '',
  },
  {
    id: 'screen-header', group: 'Navigation', name: 'Screen header',
    description: 'Standardised top navigation bar with back/close buttons and title. Consolidates the header pattern used across 10+ screens. Supports transparent mode for hero/overlay screens.',
    usage: 'All secondary screens — asset detail, settings, review, send. Pass onBack for drill-in screens, onClose for modal overlays.',
    notes: 'Always include a title. rightSlot is for contextual actions (settings gear, share). Use transparent variant when screen has a hero image or gradient header.',
    tokens: ['--bk-text-primary', '--bk-text-muted', '--bk-bg-base', '--bk-border-subtle'],
    jsx: `import { ScreenHeader } from './components/ScreenHeader';

<ScreenHeader title="Send" onBack={() => navigate(-1)} />`,
  },
  {
    id: 'status-card', group: 'Cards', name: 'Status card',
    description: 'Card displaying a transaction or operation status. Shows status icon, title, subtitle, and key-value detail rows. Colour-coded by status: success green, pending brand, error red.',
    usage: 'Success screen after transaction, pending confirmation states, error recovery screens.',
    notes: 'All props optional — gracefully omits empty sections. Status icon auto-selects based on status prop.',
    tokens: ['--bk-bg-card', '--bk-border-card', '--bk-border-subtle', '--bk-text-primary', '--bk-text-muted', '--bk-success', '--bk-error'],
    jsx: `import { StatusCard } from './components/StatusCard';

<StatusCard status="success" title="Swap Complete" subtitle="0.5 ETH → 1,250 USDC" />`,
  },
  {
    id: 'audit-badge', group: 'DeFi', name: 'Audit badge',
    description: 'Protocol audit status pill. Shows audit firm and year inline. Tapping opens a BottomSheet with TVL, full report link, and audit summary.',
    usage: 'Platform/protocol selector rows, asset detail screens, lending platform cards.',
    notes: 'Returns null if no firm provided. Use inline prop for compact rendering inside list rows.',
    tokens: ['--bk-success', '--bk-bg-card', '--bk-border-subtle', '--bk-text-primary'],
    jsx: `import { AuditBadge } from './components/AuditBadge';

<AuditBadge protocolName="Aave v3" firm="CertiK" year={2024} tvl="\$12.4B" inline />`,
  },
  {
    id: 'fee-breakdown', group: 'DeFi', name: 'Fee breakdown',
    description: 'Expandable fee summary. Collapsed shows total; tapping expands to itemised list with animated chevron. Full ARIA-expanded and list semantics.',
    usage: 'Review screen, swap confirmation, any transaction summary where fees need transparency.',
    notes: 'Always show the total even when collapsed. Items array should include network fee, protocol fee, and any other line items.',
    tokens: ['--bk-bg-card', '--bk-text-primary', '--bk-text-muted', '--bk-border-subtle'],
    jsx: `import { FeeBreakdown } from './components/FeeBreakdown';

<FeeBreakdown total="\$3.28" items={[{ label: 'Network', amount: '\$2.40' }, { label: 'Protocol', amount: '\$0.88' }]} />`,
  },
  {
    id: 'ltv-bar', group: 'DeFi', name: 'LTV bar',
    description: 'Loan-to-Value health bar with animated fill, warning/liquidation threshold markers, and colour-coded status. Help button opens an explanation BottomSheet.',
    usage: 'Borrow tab, lending position detail, portfolio risk overview.',
    notes: 'Defaults: warning at 75%%, liquidation at 85%%. Colour transitions automatically: green (safe) → amber (warning) → red (at risk). Always show borrow + collateral amounts when available.',
    tokens: ['--bk-success', '--bk-warning', '--bk-error', '--bk-bg-card', '--bk-text-primary', '--bk-text-muted'],
    jsx: `import { LTVBar } from './components/LTVBar';

<LTVBar current={42} warning={75} liquidation={85} borrowAmount="\$8,400" collateralAmount="\$20,000" />`,
  },
  {
    id: 'tx-path', group: 'DeFi', name: 'Transaction path',
    description: 'Asset route visualiser. Shows how a swap moves through tokens, bridges, and protocols with chain-coloured dots, arrow connectors, and estimated time.',
    usage: 'Swap review, cross-chain bridge confirmation, autopilot route display.',
    notes: 'Supports three step types: token (with chain), bridge, and protocol. Use compact mode for inline display in list rows. Returns null if steps array is empty.',
    tokens: ['--bk-text-primary', '--bk-text-muted', '--bk-border-subtle'],
    jsx: `import { TransactionPath } from './components/TransactionPath';

<TransactionPath steps={[{ type: 'token', symbol: 'ETH', chain: 'Ethereum' }, { type: 'bridge', name: 'Stargate' }, { type: 'token', symbol: 'ETH', chain: 'Arbitrum' }]} estimatedTime="~45 sec" />`,
  },
];

export const COMP_CONTROLS = {
  button:          [{ id: 'variant', label: 'Variant',      options: ['primary','secondary','ghost','destructive'], def: 'primary' }],
  toast:           [{ id: 'type',    label: 'Type',         options: ['success','pending','error'],                 def: 'success' }],
  badge:           [{ id: 'type',    label: 'Status',       options: ['Confirmed','Pending','Failed'],              def: 'Confirmed' }],
  input:           [{ id: 'state',   label: 'State',        options: ['default','focused','error','disabled'],      def: 'default' }],
  'token-card':    [{ id: 'token',   label: 'Token',        options: ['ETH','BTC','USDC','SOL'],                    def: 'ETH' },
                   { id: 'trend',    label: 'Trend',        options: ['up','down'],                                 def: 'up' }],
  'bottom-nav':    [{ id: 'active',  label: 'Active tab',   options: ['Home','Explore','Activity','Swap'],          def: 'Home' }],
  'tx-row':        [{ id: 'type',    label: 'Type',         options: ['sent','received','swapped'],                 def: 'sent' }],
  'step-progress': [{ id: 'step',    label: 'Current step', options: ['Review','Approve','Confirm'],                def: 'Approve' }],
  'status-card':   [{ id: 'status',  label: 'Status',       options: ['success','pending','error'],                 def: 'success' }],
  'ltv-bar':       [{ id: 'current', label: 'LTV %',        options: ['20','42','75','90'],                         def: '42' }],
};
