# BakeKit Component Library

White-label React ARIA components for DeFi products. All components theme via `--bk-*` CSS custom properties — swap the theme config to rebrand.

**Import path:** `import { ComponentName } from './components'`

---

## Phase 1 Components

### ScreenHeader

Top navigation bar with back/close buttons, title, and optional right-side slot.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Header text |
| `titleIcon` | `ReactNode` | `undefined` | Icon rendered left of title |
| `onBack` | `() => void` | `undefined` | Renders a back chevron button when provided |
| `onClose` | `() => void` | `undefined` | Renders an X close button when provided |
| `rightSlot` | `ReactNode` | `undefined` | Custom content on the right (e.g. settings button) |
| `transparent` | `boolean` | `false` | Removes bottom border for hero/overlay screens |

```jsx
<ScreenHeader
  title="Swap"
  onClose={() => navigate('/')}
  rightSlot={<Button onPress={() => navigate('/settings')}><img src={iconSettings} /></Button>}
/>
```

**Token deps:** `--bk-bg-surface`, `--bk-border-subtle`, `--bk-text-primary`, `--bk-text-muted`

---

### AppButton

Primary button wrapping React ARIA `Button`. Covers primary, action, icon, and close variants.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'action' \| 'icon' \| 'close'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `onPress` | `() => void` | — | React ARIA press handler |
| `isDisabled` | `boolean` | `false` | Disables the button |
| `children` | `ReactNode` | — | Button content |
| `className` | `string` | `''` | Additional CSS classes |

```jsx
<AppButton variant="primary" onPress={handleSubmit}>Confirm Swap</AppButton>
<AppButton variant="icon" aria-label="Close" onPress={onClose}><CloseIcon /></AppButton>
```

**Token deps:** `--bk-brand-primary`, `--bk-text-primary`, `--bk-bg-card`, `--bk-font`

---

### BottomSheet

Animated slide-up drawer with backdrop overlay. ESC key and backdrop tap dismiss it.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Called on backdrop tap or ESC |
| `children` | `ReactNode` | — | Sheet content |
| `showDragHandle` | `boolean` | `true` | Show drag handle pill at top |

```jsx
<BottomSheet isOpen={isOpen} onClose={() => setOpen(false)}>
  <div>Sheet content</div>
</BottomSheet>
```

**Token deps:** `--bk-bg-card`, `--bk-border-subtle`, `--bk-overlay`

---

### TokenPill

Interactive button representing a selected cryptocurrency token.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `token` | `{ id: string, name: string, icon: string }` | — | Token data |
| `onPress` | `() => void` | — | Press handler (e.g. open token picker) |
| `appear` | `boolean` | `false` | Play appear animation on mount |

```jsx
<TokenPill
  token={{ id: 'eth', name: 'ETH', icon: tokenEthSvg }}
  onPress={() => navigate('/swap/select/pay')}
/>
```

**Token deps:** `--bk-pill-bg`, `--bk-border-pill`, `--bk-text-primary`, `--bk-text-muted`

---

## Phase 2 Components

### TabSwitcher

Segmented tab control using React ARIA `TabList` + `Tab`. Parent manages selection state; component fires `onChange` on selection.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `Array<{ id: string, label: string }>` | — | Tab definitions |
| `activeTab` | `string` | — | `id` of currently selected tab |
| `onChange` | `(id: string) => void` | — | Called when user selects a tab |

```jsx
const [tab, setTab] = useState('all');

<TabSwitcher
  tabs={[
    { id: 'all',     label: 'All'     },
    { id: 'staking', label: 'Staking' },
    { id: 'lending', label: 'Lending' },
  ]}
  activeTab={tab}
  onChange={setTab}
/>
```

Active state uses `[data-selected]` attribute set by React ARIA — no manual class toggling needed.

**Token deps:** `--bk-text-muted`, `--bk-text-primary`, `--bk-brand-primary`, `--bk-border-subtle`, `--bk-font`

---

### FinancialInputCard

Card containing a numeric amount input + token selector button + USD value display. Covers the amount-entry pattern in swap, send, and lend flows.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | — | Card label (e.g. `"You pay"`) |
| `amount` | `string` | — | Controlled input value |
| `onAmountChange` | `(value: string) => void` | — | Called on input change |
| `token` | `{ icon?: string, symbol: string, name?: string }` | — | Selected token |
| `onTokenSelect` | `() => void` | — | Called when token button is pressed |
| `usdValue` | `string` | `undefined` | Fiat equivalent string (e.g. `"≈ $1,234.56"`) |

```jsx
<FinancialInputCard
  label="You pay"
  amount={amount}
  onAmountChange={setAmount}
  token={{ icon: ethIcon, symbol: 'ETH' }}
  onTokenSelect={() => navigate('/swap/select/pay')}
  usdValue={`≈ $${usdEquivalent}`}
/>
```

The numeric field uses React ARIA `TextField` + `Input` (`inputMode="decimal"`), so it accepts both direct keyboard input and programmatic updates from a numpad.

**Token deps:** `--bk-bg-card`, `--bk-border-card`, `--bk-text-primary`, `--bk-text-muted`, `--bk-text-placeholder`, `--bk-pill-bg`, `--bk-border-pill`, `--bk-font`

---

### StatusCard

Card displaying operation status with an inline SVG icon, title, subtitle, and key-value detail rows. All sections are optional.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'success' \| 'pending' \| 'error'` | `undefined` | Determines icon and accent colour |
| `title` | `string` | `undefined` | Heading text |
| `subtitle` | `string` | `undefined` | Supporting text below title |
| `details` | `Array<{ label: string, value: string }>` | `[]` | Key-value rows rendered below the header |

```jsx
// Full status card
<StatusCard
  status="success"
  title="Swap complete"
  subtitle="0.5 ETH → 1,200 USDC"
  details={[
    { label: 'Fee',  value: '$2.40'   },
    { label: 'Time', value: '~12 sec' },
  ]}
/>

// Details-only (no icon/title) — omit status/title/subtitle
<StatusCard
  details={[
    { label: 'Sent',        value: '0.1 ETH'        },
    { label: 'Received',    value: '324.10 USDC'    },
    { label: 'Network fee', value: '$0.34'           },
  ]}
/>
```

Status icons are inline SVGs (`aria-hidden="true"`). `success` uses `--bk-success`, `error` uses `--bk-error`, `pending` uses `--bk-text-muted`.

**Token deps:** `--bk-bg-card`, `--bk-border-card`, `--bk-border-subtle`, `--bk-text-primary`, `--bk-text-muted`, `--bk-text-secondary`, `--bk-success`, `--bk-error`, `--bk-font`
