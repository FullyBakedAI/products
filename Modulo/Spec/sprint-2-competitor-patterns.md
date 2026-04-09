# Sprint 2 — Competitor Patterns & Build Spec
> Modulo · React SPA · Dark theme · BakeKit tokens (`--bk-*`)
> Written: 2026-04-08

Each section follows: current state → what's missing → discrete build tasks with exact CSS/component references.

---

## 1. HomeScreen

**File:** `HomeScreen.jsx` + `home.css`

### Current state
- Portfolio card shows total value (`$12,847.53`) and today's gain (`+$623.11 / +5.08%`) with a static chart-line SVG behind it.
- Earn Card at the bottom shows annual yield accrual (`0.97k USD`) with an "Earn →" button that navigates nowhere.
- Token rows show holding size, 7-day sparkline, USD value, and yield bar — but there is no at-a-glance P&L per asset.

### Missing patterns (vs. Coinbase, Revolut, Ledger Live)
- **Portfolio P&L header** — Coinbase and Revolut show both today's gain and an all-time P&L figure (e.g. `+$2,341 since deposit`). The current card only shows today. No cost-basis context.
- **Earn All / one-click yield** — Ledger Live and Crypto.com show a single CTA that routes you to optimise all idle assets in one step. The current Earn Card has a button but no indication of which assets aren't earning, and no destination.
- **AI suggestion strip** — Coinbase Advanced and Revolut show a contextual nudge below the portfolio value ("Your SOL has dropped 1.8% — consider averaging down" or "You have $5,342 idle USDC earning 0%"). Modulo has none.
- **Token row P&L column** — Revolut and Ledger Live show per-asset profit/loss in addition to the current price change. The token rows only show the current-day `%change`, not a gain/loss since purchase.

### Build tasks

**Task 1 — Add all-time P&L line to the portfolio card**

Add a second line under `.portfolio-gain` showing total P&L since first deposit.

```jsx
// In HomeScreen.jsx, after the existing .portfolio-gain div:
<div className="portfolio-alltime" aria-label="All-time gain: +$2,341.18 (22.3%)">
  <span className="alltime-text">+$2,341.18 all time (22.3%)</span>
</div>
```

CSS — add to `home.css`:
```css
.portfolio-alltime {
  position: relative;
  z-index: 1;
  margin-top: 1px;
}
.alltime-text {
  font-size: 11px;
  font-weight: 400;
  color: var(--bk-text-muted);
  line-height: 1.5;
}
```

- Reuses `.portfolio-card` layout — no structural changes.
- Mock data only; no cost-basis calculation required in Sprint 2.

---

**Task 2 — Replace the Earn Card with an "Earn All" CTA that shows idle assets**

The current `.earn-card` shows a yield total but the button is inert and doesn't communicate urgency. Replace the label copy and wire the button to `/actions?tab=stake`.

In `HomeScreen.jsx`:
- Change `.earn-label` copy from `"Annual Yield Accrual"` to `"3 assets earning · 2 idle"`.
- Change `.earn-value-row` sub-label from `"k USD"` to `"/ yr"` (keep the value).
- Change the `.earn-btn` label and `onPress` to `navigate('/actions?tab=stake')`.
- Change `.earn-btn` text from `"Earn →"` to `"Earn All"`.

No CSS changes needed — all class names stay identical. The existing `.earn-card`, `.earn-label`, `.earn-value`, `.earn-unit`, and `.earn-btn` classes cover the layout.

---

**Task 3 — Add an AI suggestion strip below the action buttons**

Insert a horizontally scrollable strip of contextual nudge cards between `.action-row` and `.tabs`. Each card is a pill-shaped prompt.

```jsx
// In HomeScreen.jsx, between </motion.div> for action-row and the tabs motion.div:
<motion.div
  className="suggestion-strip"
  aria-label="Suggestions"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.09 } }}
>
  <button className="suggestion-pill" aria-label="SOL is down 1.8% — tap to buy">
    <TrendingUp size={13} strokeWidth={1.5} aria-hidden="true" />
    SOL down 1.8% — buy the dip?
  </button>
  <button className="suggestion-pill" aria-label="5,342 USDC idle — tap to put it to work">
    <Zap size={13} strokeWidth={1.5} aria-hidden="true" />
    $5,342 USDC idle — earn 4.8%?
  </button>
  <button className="suggestion-pill" aria-label="ETH up 4.4% — tap to take profit">
    <ArrowRightLeft size={13} strokeWidth={1.5} aria-hidden="true" />
    ETH +4.4% today — take profit?
  </button>
</motion.div>
```

CSS — add to `home.css`:
```css
.suggestion-strip {
  display: flex;
  gap: 8px;
  padding: 0 16px 12px;
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 0;
}
.suggestion-strip::-webkit-scrollbar { display: none; }

.suggestion-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: var(--bk-bg-card);
  border: 1px solid var(--bk-border-subtle);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--bk-text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  font-family: var(--bk-font);
}
.suggestion-pill svg { color: var(--bk-brand-primary); }
.suggestion-pill:hover { background: var(--bk-bg-card-alt); }
```

Pill shape matches the existing `.chain-pill` pattern from `shared.css` — consistent with chain filters on Explore and Activity screens.

---

**Task 4 — Add per-token P&L line to token rows**

Add cost-basis P&L as a third line in `.token-info`. The existing `.token-amount` pattern handles the second line.

In `HomeScreen.jsx`, update the `TOKENS` array to add a `pnl` field:
```js
{ id: 'eth', ..., pnl: '+$412.50 (+10.3%)' },
{ id: 'sol', ..., pnl: '-$88.22 (-2.0%)'  },
// etc.
```

In `TokenRow`, after the `.token-amount` div:
```jsx
<div className={`token-pnl${t.pnlNegative ? ' negative' : ''}`}>{t.pnl}</div>
```

CSS — add to `home.css`:
```css
.token-pnl {
  font-size: 11px;
  font-weight: 400;
  color: var(--bk-success);
  margin-top: 1px;
  line-height: 1.4;
}
.token-pnl.negative { color: var(--bk-error); }
```

Follows the existing `.token-change.negative` pattern exactly. No layout changes to `.token-row-main`.

---

## 2. ExploreScreen

**File:** `ExploreScreen.jsx` + `explore.css`

### Current state
- Search field at top (static, not interactive).
- Two favourites cards (ETH, BTC) with sparkline SVGs and price/change.
- "Top tokens" list of 5 tokens filtered by chain pills. Columns: rank, icon, name+volume, price+change.
- No trending section, no gainers/losers tabs, no 24h volume chart, no market cap data.

### Missing patterns (vs. Uniswap, Coinbase, Crypto.com)
- **Trending / Gainers / Losers tabs** — Uniswap and Coinbase show three sub-tabs inside Explore. Currently there is only one unsorted list.
- **Market cap column** — the current list shows volume and price but not market cap rank. Coinbase and CoinGecko-style apps show mcap as the primary sort signal.
- **"New listings" or "Recently added" rail** — Crypto.com and Uniswap show a horizontal scroll of newly listed tokens above the main list. Currently nothing fills this intent.
- **Sorting controls** — the "Volume ▾" dropdown exists in the JSX but clicking it does nothing. Uniswap lets you sort by price, % change, volume, and TVL.
- **Favourite star on token rows** — no way to add tokens to the Favourites section from the list. Competitors have an inline star on each row.

### Build tasks

**Task 1 — Add Trending / Gainers / Losers sub-tabs**

Replace the static `"Top tokens"` label with a tab strip using the existing `.tabs` / `.tab` / `.tab.active` pattern from `home.css`.

In `ExploreScreen.jsx`:
```jsx
const MARKET_TABS = ['Trending', 'Gainers', 'Losers', 'Top'];
const [activeMarketTab, setActiveMarketTab] = useState('Trending');
```

Replace the `.top-header` block with:
```jsx
<div className="tabs" role="tablist" data-bk-component="tab-bar">
  {MARKET_TABS.map(tab => (
    <button
      key={tab}
      className={`tab${activeMarketTab === tab ? ' active' : ''}`}
      role="tab"
      aria-selected={activeMarketTab === tab}
      onClick={() => setActiveMarketTab(tab)}
    >{tab}</button>
  ))}
</div>
```

CSS: imports `.tabs` and `.tab` from `home.css` — no new CSS required. Add `import './home.css'` to `ExploreScreen.jsx` if not already present, or move shared tab styles to `shared.css`.

---

**Task 2 — Add a "New on Modulo" horizontal scroll rail**

Insert a horizontally scrolling card row between the favourites section and the tabs. Three mock new-listing cards.

```jsx
<div className="new-listings-section">
  <div className="section-header-row">
    <span className="fav-label">New on Modulo</span>
  </div>
  <div className="new-listings-rail">
    {NEW_TOKENS.map(t => (
      <div key={t.id} className="new-listing-card">
        <img src={t.icon} alt="" width="28" height="28" />
        <span className="new-listing-symbol">{t.symbol}</span>
        <span className={`new-listing-change${t.negative ? ' negative' : ''}`}>{t.change}</span>
      </div>
    ))}
  </div>
</div>
```

CSS — add to `explore.css`:
```css
.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px 8px;
}
.new-listings-rail {
  display: flex;
  gap: 10px;
  padding: 0 20px 16px;
  overflow-x: auto;
  scrollbar-width: none;
}
.new-listings-rail::-webkit-scrollbar { display: none; }
.new-listing-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
  background: var(--bk-bg-card);
  border: 1px solid var(--bk-border-subtle);
  border-radius: 14px;
  min-width: 80px;
  flex-shrink: 0;
}
.new-listing-symbol {
  font-size: 12px;
  font-weight: 600;
  color: var(--bk-text-primary);
}
.new-listing-change {
  font-size: 11px;
  font-weight: 500;
  color: var(--bk-success);
}
.new-listing-change.negative { color: var(--bk-error); }
```

Card shape mirrors `.fav-card` from `explore.css` — consistent language.

---

**Task 3 — Make the sort dropdown functional**

Replace the static `<span className="volume-dropdown">` with a state-toggled button that cycles through `Volume`, `Price`, `% Change`. On click, re-sort `TOP_TOKENS` before rendering.

```jsx
const SORT_OPTIONS = ['Volume', 'Price', '% Change'];
const [sortBy, setSortBy] = useState('Volume');

const cycleSort = () => {
  const next = SORT_OPTIONS[(SORT_OPTIONS.indexOf(sortBy) + 1) % SORT_OPTIONS.length];
  setSortBy(next);
};
```

Replace the span with:
```jsx
<button className="sort-btn" onClick={cycleSort} aria-label={`Sort by ${sortBy}`}>
  {sortBy} &#9662;
</button>
```

CSS — add to `explore.css`:
```css
.sort-btn {
  font-size: 12px;
  font-weight: 500;
  color: var(--bk-brand-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--bk-font);
  padding: 0;
}
```

---

**Task 4 — Add favourite star to token rows**

Add a `<button>` at the right edge of each `.token-row-explore` that toggles a `favourites` state Set.

```jsx
const [favourites, setFavourites] = useState(new Set(['eth', 'btc']));

const toggleFav = (id) => setFavourites(prev => {
  const next = new Set(prev);
  next.has(id) ? next.delete(id) : next.add(id);
  return next;
});
```

In each token row, after `.token-values-explore`:
```jsx
<button
  className={`fav-star-btn${favourites.has(t.id) ? ' active' : ''}`}
  aria-label={`${favourites.has(t.id) ? 'Remove from' : 'Add to'} favourites`}
  onClick={() => toggleFav(t.id)}
>
  <Star size={14} strokeWidth={1.5} />
</button>
```

CSS — add to `explore.css`:
```css
.fav-star-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--bk-text-muted);
  opacity: 0.4;
  flex-shrink: 0;
}
.fav-star-btn.active {
  color: var(--bk-brand-primary);
  opacity: 1;
}
```

Add `Star` to the lucide-react import line.

---

## 3. SendScreen

**File:** `SendScreen.jsx` + `send.css`

### Current state
- Shows a "Select recipient" modal (slide-up) with a search field and three hardcoded contacts.
- Contacts are identified by truncated address or ENS name. One has a Modulo badge.
- Scan button exists in the search field (using `Share2` icon, which is incorrect — should be a camera/QR icon).
- No labels, no send frequency, no token/network context in the contact row.

### Missing patterns (vs. Coinbase, Revolut, MetaMask)
- **Address book structure** — Coinbase and MetaMask distinguish between "Saved" contacts (named, starred) and "Recent" (auto-populated from tx history). Currently everything is under one unlabelled "Recent" section with no saved state.
- **Last sent context on contact rows** — Revolut shows "Sent 2 days ago · $500" on each recent contact row. Modulo shows only the address, giving no confidence signal.
- **QR scan entry point** — the scan button uses `Share2` icon (outward arrows), not a camera or QR-code icon. Uniswap and Coinbase use `Camera` or `QrCode` from lucide. This breaks the visual affordance.
- **Network selector before recipient** — MetaMask and Ledger Live ask you to confirm the destination network before entering an address. No network context is present anywhere on this screen.
- **Paste-from-clipboard shortcut** — MetaMask and Coinbase show a "Paste" button next to the search field that reads the clipboard. Zero extra taps for power users.

### Build tasks

**Task 1 — Fix the scan QR icon**

In `SendScreen.jsx`, replace `Share2` with `ScanLine` (available in lucide-react):
```jsx
import { Search, ScanLine, X } from 'lucide-react';
// ...
<ScanLine size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
```

One-line change. No CSS changes.

---

**Task 2 — Split contacts into "Saved" and "Recent" sections with timestamps**

Update the `CONTACTS` data array to include a `section`, `lastSent`, and `lastAmount` field:

```js
const CONTACTS = [
  { id: 1, section: 'Saved', name: 'modulo.eth', sub: '0x540e...7262', hasBadge: true,
    lastSent: '2 days ago', lastAmount: '$324', ariaLabel: 'modulo.eth — 0x540e...7262' },
  { id: 2, section: 'Recent', name: '0x4248...EF33', sub: null, hasBadge: false,
    lastSent: '5 days ago', lastAmount: '$100', ariaLabel: '0x4248...EF33' },
  { id: 3, section: 'Recent', name: '0xb5A9...Db3a', sub: null, hasBadge: false,
    lastSent: '2 weeks ago', lastAmount: '$50', ariaLabel: '0xb5A9...Db3a' },
];
```

In `SendScreen.jsx`, replace the single "Recent" label and flat list with:
```jsx
{['Saved', 'Recent'].map(section => {
  const sectionContacts = CONTACTS.filter(c => c.section === section);
  if (!sectionContacts.length) return null;
  return (
    <div key={section}>
      <div className="recent-label">{section}</div>
      {sectionContacts.map((c, i) => (
        <motion.div key={c.id} /* existing animation */>
          <Button className="contact-row" aria-label={c.ariaLabel} onPress={() => navigate(-1)}>
            <div className="avatar-wrap">
              <img className="avatar" src={walletAvatar} alt="" />
              {c.hasBadge && <img className="modulo-badge" src={moduloBadge} alt="Modulo" />}
            </div>
            <div className="contact-text">
              <div className="contact-name">{c.name}</div>
              {c.sub && <div className="contact-sub">{c.sub}</div>}
              <div className="contact-last-sent">{c.lastSent} · {c.lastAmount}</div>
            </div>
          </Button>
        </motion.div>
      ))}
    </div>
  );
})}
```

CSS — add to `send.css`:
```css
.contact-last-sent {
  font-size: 11px;
  font-weight: 400;
  color: var(--bk-text-muted);
  margin-top: 1px;
  line-height: 1.4;
}
```

Follows the `.contact-sub` pattern from `send.css` exactly.

---

**Task 3 — Add a "Paste" shortcut button next to the search input**

In `SendScreen.jsx`, add a Paste button after the ScanLine button inside `.search-field`:
```jsx
import { Search, ScanLine, X, Clipboard } from 'lucide-react';
// ...
<Button className="scan-btn paste-btn" aria-label="Paste address from clipboard" onPress={() => {}}>
  <Clipboard size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
</Button>
```

CSS — add to `send.css`:
```css
.paste-btn {
  margin-left: 4px;
}
```

Reuses existing `.scan-btn` class. No layout changes needed.

---

**Task 4 — Add destination network pill below the search field**

Insert a selected-network indicator between the search field and the "Saved" section label:
```jsx
<motion.div
  className="send-network-row"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.12 } }}
>
  <span className="send-network-label">Network</span>
  <button className="chain-pill active" aria-label="Change network: Ethereum">
    Ethereum &#9662;
  </button>
</motion.div>
```

CSS — add to `send.css`:
```css
.send-network-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px 4px;
}
.send-network-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--bk-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
```

`.chain-pill` and `.chain-pill.active` imported from `shared.css` — no new component needed.

---

## 4. ReceiveScreen

**File:** `ReceiveScreen.jsx` + `receive.css`

### Current state
- Shows wallet address with copy and share buttons.
- QR code rendered as a static SVG asset.
- Network pills (5 networks) in a horizontal scroll.
- Exchange list (Coinbase, Binance, Kraken, Another wallet) as plain buttons.
- No token selector — the QR code is address-only, not token+network specific.

### Missing patterns (vs. Coinbase, MetaMask, Ledger Live)
- **Token-specific QR** — MetaMask and Coinbase generate QR codes that encode a payment request URI (`ethereum:0x...?value=0.1`). Currently the QR is a static address. At minimum, a token selector should be visible so the sender knows what to send.
- **Amount request field** — Revolut and Coinbase's receive screen let you request a specific amount, generating a QR that pre-fills the send amount on the other end. No amount entry exists.
- **Network confirmation warning** — Ledger Live shows a warning "Only send ETH on Ethereum. Sending on other networks may result in permanent loss." Currently the network pills are purely informational with no warning.
- **Copy with feedback** — the copy button has no visual confirmation state. Coinbase flashes the button green and changes the label to "Copied!". Currently it's a silent icon.

### Build tasks

**Task 1 — Add a token selector above the QR code**

Insert a token selector strip between `.address-card` and `.qr-container`. Uses the existing `.chain-pill` pattern.

```jsx
const RECEIVE_TOKENS = ['Any token', 'ETH', 'USDC', 'USDT'];
const [receiveToken, setReceiveToken] = useState('Any token');

// After address-card motion.div, before qr-container:
<motion.div
  className="receive-token-selector"
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.12 } }}
>
  {RECEIVE_TOKENS.map(t => (
    <button
      key={t}
      className={`chain-pill${receiveToken === t ? ' active' : ''}`}
      onClick={() => setReceiveToken(t)}
      aria-pressed={receiveToken === t}
    >{t}</button>
  ))}
</motion.div>
```

CSS — add to `receive.css`:
```css
.receive-token-selector {
  display: flex;
  gap: 8px;
  padding: 0 20px 12px;
  overflow-x: auto;
  scrollbar-width: none;
  flex-shrink: 0;
}
.receive-token-selector::-webkit-scrollbar { display: none; }
```

`.chain-pill` and `.chain-pill.active` from `shared.css` — no new styles for the pills.

---

**Task 2 — Add copy feedback state**

In `ReceiveScreen.jsx`, add a `copied` state and show a brief confirmation:

```jsx
const [copied, setCopied] = useState(false);

const handleCopy = () => {
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};
```

Replace the copy button:
```jsx
<Button
  className={`address-action-btn${copied ? ' copied' : ''}`}
  aria-label={copied ? 'Copied!' : 'Copy address'}
  onPress={handleCopy}
>
  {copied
    ? <Check size={16} color="var(--bk-success)" strokeWidth={1.5} aria-hidden="true" />
    : <Copy size={16} color="var(--bk-text-muted)" strokeWidth={1.5} aria-hidden="true" />
  }
</Button>
```

CSS — add to `receive.css`:
```css
.address-action-btn.copied {
  background: rgba(34, 197, 94, 0.12);
  border-radius: 8px;
}
```

Add `Check` to the lucide-react import.

---

**Task 3 — Add a network loss-warning banner**

Insert a single-line warning below the supported networks section. Matches Ledger Live's pattern.

```jsx
<motion.div
  className="receive-warning"
  role="alert"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1, transition: { ...m.fade.enter, delay: 0.24 } }}
>
  <AlertTriangle size={13} strokeWidth={1.5} aria-hidden="true" />
  <span>Only send assets on a supported network. Wrong network = permanent loss.</span>
</motion.div>
```

CSS — add to `receive.css`:
```css
.receive-warning {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 20px 16px;
  padding: 10px 12px;
  background: rgba(234, 179, 8, 0.08);
  border: 1px solid rgba(234, 179, 8, 0.2);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 400;
  color: var(--bk-text-secondary);
  line-height: 1.5;
}
.receive-warning svg { color: #EAB308; flex-shrink: 0; margin-top: 2px; }
```

Add `AlertTriangle` to the lucide-react import.

---

## 5. SuccessScreen

**File:** `SuccessScreen.jsx` + `success.css`

### Current state
- Animated SVG checkmark with a glow pulse.
- Title (`"Swap complete"`) and summary line (`"You swapped 0.1 ETH for 324.10 USDC"`).
- Two buttons: "View in Activity" (→ `/activity`) and "Back to Portfolio" (→ `/`).
- Absolutely nothing else. The user has no reason to stay.

### Missing patterns (vs. Coinbase, Revolut, Crypto.com)
- **Post-transaction price alert CTA** — Coinbase shows "Set a price alert for ETH" immediately after a swap. Currently there is no hook to keep the user engaged.
- **Share transaction** — Revolut and Crypto.com show a "Share" button that generates a social-ready receipt image. Currently absent.
- **Cross-sell / next action** — Crypto.com shows "Earn with this token" immediately after a buy. The swap success screen is a dead end — the user either goes to Activity or goes home.
- **Transaction summary card** — Uniswap's confirmation shows a mini recap card (from token → to token, rate, fees, network) before the buttons. Currently only a single text line.

### Build tasks

**Task 1 — Add a transaction summary card**

Between `.success-text` and `.success-actions`, insert a summary card showing the swap details. Reuses `.swap-card` and `.card-bottom` from `swap.css`.

```jsx
<motion.div
  className="swap-card success-summary-card"
  role="region"
  aria-label="Transaction summary"
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0, transition: { ...m.fade.enter, delay: 0.95 } }}
>
  {[
    { label: 'Sent',    value: '0.1 ETH'     },
    { label: 'Received', value: '324.10 USDC' },
    { label: 'Rate',    value: '1 ETH = $3,241' },
    { label: 'Network fee', value: '$0.34'   },
  ].map(({ label, value }) => (
    <div key={label} className="card-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '9px 0', margin: 0 }}>
      <span className="card-label" style={{ margin: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--bk-text-secondary)' }}>{value}</span>
    </div>
  ))}
</motion.div>
```

CSS — add to `success.css`:
```css
.success-summary-card {
  width: 100%;
  margin: 0;
  padding: 0 16px;
}
```

`.swap-card` and `.card-bottom` already exist in `swap.css` — import `swap.css` in `SuccessScreen.jsx` (`import './swap.css'`) if not already imported. The existing `swap-screen-inner` class is already applied to `.success-screen`, so `swap.css` patterns are available.

---

**Task 2 — Add a "Set price alert" secondary CTA**

Below the "View in Activity" primary button, add a contextual nudge to set a price alert for the token just swapped.

In `SuccessScreen.jsx`, add to the `success-actions` block after the existing buttons:
```jsx
<Button
  className="bottom-cta-btn success-nudge-btn"
  style={{ margin: '8px 0 0', width: '100%' }}
  aria-label={`Set a price alert for ${action === 'swap' ? 'this token' : action}`}
  onPress={() => {}}
>
  <Bell size={14} strokeWidth={1.5} aria-hidden="true" />
  Set a price alert
</Button>
```

CSS — add to `success.css`:
```css
.success-nudge-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: var(--bk-text-secondary);
  font-size: 14px;
}
```

`.bottom-cta-btn` from `swap.css` gives the ghost button style. `Bell` is already in `HomeScreen.jsx`'s icon set — add to lucide-react import here.

---

**Task 3 — Add a "Share" link**

Add a minimal Share link below the price alert button.

```jsx
<button
  className="success-share-btn"
  aria-label="Share transaction"
  onClick={() => {}}
>
  <Share2 size={13} strokeWidth={1.5} aria-hidden="true" />
  Share
</button>
```

CSS — add to `success.css`:
```css
.success-share-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: var(--bk-text-muted);
  font-size: 12px;
  font-weight: 500;
  font-family: var(--bk-font);
  cursor: pointer;
  padding: 4px 0;
  opacity: 0.6;
}
.success-share-btn:hover { opacity: 1; }
```

Add `Share2` and `Bell` to the `SuccessScreen.jsx` lucide-react import.

---

## 6. ActivityScreen

**File:** `ActivityScreen.jsx` + `activity.css`

### Current state
- Transaction list grouped by date (Pending, Today, Yesterday, Apr 7).
- Filter chips (`chain-pill` pattern) horizontally scroll across 6 categories.
- Each row taps to open `TxDetailSheet` — a bottom sheet with amount, type badge, status/network/time/block/tx-hash rows, and a block explorer link.
- `TxDetailSheet` uses `.swap-card` + `.card-bottom` for the detail rows — consistent with Swap screen.

### Missing patterns (vs. Coinbase, Ledger Live, Etherscan)
- **Speed up / Cancel for pending** — Coinbase and MetaMask show "Speed up" and "Cancel" actions on pending transaction rows. Currently the pending row shows just a spinner and status label.
- **Gas fee display in the detail sheet** — the detail sheet shows Status/Network/Time/Block/Tx hash but no fee paid. Ledger Live and Etherscan always show the gas fee — it's a common "how much did this cost me?" question.
- **Swap detail shows "from" and "to" amounts as separate rows** — the current detail sheet shows only the `detail` string (e.g. `"0.1 ETH → 324.10 USDC"`) as a single muted line. Coinbase shows each leg as its own highlighted row with token icons.
- **Date group totals** — Revolut and Crypto.com show a day's net P&L at the group header level ("Today · +$204.85"). Currently group headers are just plain labels.

### Build tasks

**Task 1 — Add "Speed up" and "Cancel" actions to pending rows**

In `ActivityScreen.jsx`, update `TxRow` to conditionally render action buttons when `tx.pending` is true:

```jsx
{tx.pending && (
  <div className="tx-pending-actions">
    <button className="tx-action-btn tx-action-speed" aria-label="Speed up transaction">
      Speed up
    </button>
    <button className="tx-action-btn tx-action-cancel" aria-label="Cancel transaction">
      Cancel
    </button>
  </div>
)}
```

Place this div after the main content div (after the `tx.pending` status line), within the outer `style={{ flex: 1 }}` div.

CSS — add to `activity.css`:
```css
.tx-pending-actions {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.tx-action-btn {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid var(--bk-border-subtle);
  background: var(--bk-bg-elevated);
  color: var(--bk-text-secondary);
  cursor: pointer;
  font-family: var(--bk-font);
}
.tx-action-speed { color: var(--bk-brand-primary); border-color: var(--bk-brand-primary); }
.tx-action-cancel { color: var(--bk-error); border-color: var(--bk-error); }
```

---

**Task 2 — Add fee row to the transaction detail sheet**

In `TxDetailSheet`, add a "Fee paid" row to the detail rows array.

In the `.map()` that builds the detail rows inside `TxDetailSheet`:
```js
{ label: 'Fee paid', value: '$0.34' },
```

Add this between the "Network" and "Time" rows. No CSS changes — uses existing `.card-bottom` + `.card-label` pattern from `swap.css`.

---

**Task 3 — Add "From" and "To" rows for swap transactions in the detail sheet**

In `TxDetailSheet`, detect `tx.type === 'swap'` and render two highlighted rows before the detail rows block.

```jsx
{tx.type === 'swap' && tx.icon1 && (
  <div style={{ padding: '0 20px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div className="swap-leg-row">
      <img src={tx.icon1} alt="" width="20" height="20" style={{ borderRadius: '50%' }} />
      <span className="swap-leg-label">From</span>
      <span className="swap-leg-value">{tx.detail.split('→')[0].trim()}</span>
    </div>
    <div className="swap-leg-row">
      <img src={tx.icon2} alt="" width="20" height="20" style={{ borderRadius: '50%' }} />
      <span className="swap-leg-label">To</span>
      <span className="swap-leg-value swap-leg-positive">{tx.detail.split('→')[1].trim()}</span>
    </div>
  </div>
)}
```

CSS — add to `activity.css`:
```css
.swap-leg-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.swap-leg-label {
  font-size: 12px;
  color: var(--bk-text-muted);
  flex: 1;
}
.swap-leg-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--bk-text-primary);
}
.swap-leg-positive { color: var(--bk-success); }
```

---

**Task 4 — Add day-total P&L to date group headers**

Add mock `GROUP_TOTALS` data and render it inline with the date label:

```js
const GROUP_TOTALS = {
  Today:     '+$204.85',
  Yesterday: '-$494.72',
  'Apr 7':   '+$4,616.88',
};
```

In the date group rendering:
```jsx
<div className="portfolio-label activity-group-header" style={{ paddingTop: 12 }}>
  <span>{group}</span>
  {GROUP_TOTALS[group] && (
    <span className={`activity-group-total${GROUP_TOTALS[group].startsWith('-') ? ' negative' : ''}`}>
      {GROUP_TOTALS[group]}
    </span>
  )}
</div>
```

CSS — add to `activity.css`:
```css
.activity-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px 4px;
}
.activity-group-total {
  font-size: 11px;
  font-weight: 500;
  color: var(--bk-success);
}
.activity-group-total.negative { color: var(--bk-error); }
```

`.portfolio-label` from `home.css` provides the uppercase muted label style. The new wrapper class adds flexbox without overriding the existing typography.

---

## Priority Order for Sprint 2

| Priority | Screen | Task | Rationale |
|---|---|---|---|
| 1 | ActivityScreen | T1 — Speed up/Cancel on pending | Functional gap — users are blocked without it |
| 2 | SendScreen | T1 — Fix QR icon | 10-second fix, currently misleading |
| 3 | SuccessScreen | T1 — Summary card | Confidence gap — users don't know what happened |
| 4 | HomeScreen | T1 — All-time P&L | High-signal data, minimal build |
| 5 | HomeScreen | T2 — Earn All CTA | Revenue-adjacent, existing UI just needs rewiring |
| 6 | ExploreScreen | T1 — Trending/Gainers/Losers tabs | Uses existing `.tabs` pattern — ~20 mins |
| 7 | ReceiveScreen | T2 — Copy feedback | Polish detail that breaks trust if absent |
| 8 | HomeScreen | T3 — AI suggestion strip | Engagement mechanic |
| 9 | SendScreen | T2 — Saved/Recent split + timestamps | UX quality |
| 10 | ActivityScreen | T4 — Day-total P&L headers | Nice data density, low complexity |

---

## Shared CSS Classes Reference

| Class | File | Usage |
|---|---|---|
| `.swap-card` | `swap.css` | Container for detail rows in sheets |
| `.card-bottom` | `swap.css` | Individual label/value row inside `.swap-card` |
| `.card-label` | `swap.css` | Muted label in detail row |
| `.bottom-cta-btn` | `swap.css` | Ghost secondary button |
| `.primary-btn` | `shared.css` | Primary gradient CTA button |
| `.chain-pill` | `shared.css` | Filter/network pill, supports `.active` modifier |
| `.tabs` / `.tab` | `home.css` | Tab strip, supports `.active` modifier |
| `.portfolio-label` | `home.css` | Uppercase muted section label |
| `.token-name-text` | `home.css` | 15px medium weight token name |
| `.token-amount` | `home.css` | 12px muted secondary text |
| `.drag-handle` / `.drag-handle-pill` | `shared.css` | Bottom sheet handle |
| `.search-field` | `shared.css` | Search input container |
| `.avatar-wrap` | `shared.css` | 40px avatar with badge position |
| `.icon-btn` | `home.css` | 16×16 bare icon button |
| `.earn-card` / `.earn-btn` | `home.css` | Earn card container and CTA |
| `.activity-filter-row` | `activity.css` | Horizontally scrolling filter chips |
| `.tx-detail-sheet` | `activity.css` | Bottom sheet container |
| `.tx-badge` | `activity.css` | Circular type badge on tx rows |
