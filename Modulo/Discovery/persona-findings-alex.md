# Persona Evaluation — Alex (Active Crypto User / DeFi Intermediate)
**Date:** 2026-04-04
**Evaluator:** Alex persona agent
**Sources reviewed:** modulo.finance (live site), 6 mobile app screenshots (Figma designs)
**Output type:** UX research finding — feeds into product brief

---

## TL;DR

The website makes a claim that would genuinely change how I operate if true. The mobile designs show a clean execution of a familiar pattern. But there's a gap between the ambition of the pitch and the evidence in the product. I'm interested. I'm not yet convinced.

---

## 1. First Impressions — The Website

### Does the technical claim hold up?

The hero: "One vault, every chain. Borrow, stake, lend, and trade — instantly and securely — across dozens of chains. One app, no bridges, no wallet switching."

That's exactly what I want. So my first move is: prove it.

The site doesn't. Not technically.

The problem statement section is the strongest part of the page — the WBTC walkthrough is accurate and painful to read because I've lived it. Whoever wrote that knows the real experience. That's credibility. I keep reading.

Then I hit "No wrapping or bridging" under Native Asset Support and I stall. That's a very specific technical claim. If it's true, it means Modulo has solved something that almost nobody has solved at scale. The mechanisms that allow native BTC to participate in EVM-based lending without wrapping are complex — threshold signatures, IBC with Bitcoin relayers, something like THORChain's approach, or a proprietary vault system. The site says none of this. It just asserts it.

"What makes it possible" describes four layers — Wallet Layer, Logic Layer, Protocol Layer, Integration Layer. These are real structural concepts but the descriptions are marketing copy, not architecture. "Real-time collateral routing" is a phrase, not a mechanism. "Unified vault for BTC, ETH, SOL, XRP" tells me nothing about how custody works or what the trust assumptions are.

For a DeFi-native like me, the absence of technical explanation is itself a signal. Either they haven't built it yet (possible, given early stage), or they're hiding complexity (bad sign), or they don't think their audience needs to understand it (wrong assumption for this audience segment).

The passkey login / no seed phrases feature is interesting and I do think it's right for onboarding. But I'm also immediately wondering: if my passkey is device-bound, what's the recovery path? The site says "Modern Login + Recovery" but doesn't explain the recovery model. That matters enormously in self-custody.

### What works on the site

- The problem framing is excellent. The WBTC walkthrough is the best thing on the page.
- "No more juggling wallets. No more network confusion. No more lost assets from broken bridges or seed phrases." — that final CTA section lands emotionally. It's accurate.
- The use case breakdown (Traders / Stakers / Institutions / Degens) is useful segmentation. I'm the Trader/Degen crossover.
- The "$2 trillion in idle crypto" framing is smart market context.

### What doesn't work

- "Send any Modulo asset (even ones you don't own), instantly" — this is either describing something like a flash loan / advance feature, or it's poorly worded. Either way, it needs unpacking. As written it reads like a bug, not a feature.
- "Receive via username" (Telegram/WhatsApp/Discord) — interesting social payment layer, but raises immediate questions about KYC, privacy, and whether this is custodial routing under the hood.
- Zero social proof. No auditor names, no testnet stats, no TVL (even projected), no team page beyond the founder reference, no backers listed. For a financial product at this stage, trust signals matter.
- No "how it works" depth — even a single diagram showing the custody model would help significantly.

---

## 2. What Genuinely Interests Me

In order of excitement:

1. **Native BTC in DeFi without WBTC** — if real, this is the most valuable thing on the page. WBTC trust assumptions (BitGo custody) are a real concern for me. A non-custodial native BTC path is legitimately novel.
2. **One-click borrow against entire portfolio** — cross-collateralisation across chains is complex and valuable. I currently can't do this at all without manual steps.
3. **No gas management** — "no wallet switching" implies they're abstracting gas. That's genuinely useful. I've missed trades because I didn't have the right gas token on the right chain.
4. **Fixed-rate borrowing** — variable rates in DeFi create liquidation risk during volatility. Fixed rates are underused and I'd actually use this.
5. **Smart automation: "Borrow on dips, deploy on moves"** — this is vague but hints at conditional order execution. If it's real, it's powerful.

---

## 3. What I'm Sceptical About

### The core technical claim

"No wrapping or bridging" is doing a lot of heavy lifting. Every major cross-chain solution I've looked at uses one of:
- Wrapped/synthetic representations with a trusted issuer
- Liquidity pools on each chain with cross-chain messaging
- Threshold signature schemes (MPC) for native asset vaults
- Something like Chainlink CCIP or LayerZero for message passing

All of these have trust assumptions. None of them are "no bridging" in the literal sense — they're bridging with better UX or different custody models. I want to know which approach Modulo uses and what the failure modes are. Until I know that, "no bridging" reads as marketing.

### Custody model

"Non-custodial by Design" and "Your keys, your control" appear alongside passkey login. These can coexist but they need explanation. Who holds the signing keys? Is it a smart contract vault? An MPC wallet? If I lose my device and my passkey, what happens? This is the question that would stop me from moving significant funds in.

### "Send any asset (even ones you don't own)"

This is confusing. Interpreted charitably: maybe it means Modulo can route a send even if you're sending an asset you don't hold natively (e.g., you hold BTC but want to send USDC — Modulo converts and sends). If so, that's actually useful. But the copy makes it sound like you can send assets you don't have, which is alarming.

### Audit status

Not mentioned anywhere on the site. This is a blocker for me putting real money in.

---

## 4. What's Missing for an Active DeFi User

These are concrete gaps that would prevent me from using this as a primary interface:

1. **Audit information** — who audited the contracts, when, what was found. Non-negotiable before significant deposits.
2. **Supported protocols list** — the site says "top DeFi protocols" but names none. I want to know if Aave, Compound, Curve, GMX, and others are actually integrated or whether this is a proprietary lending pool.
3. **Supported chains list** — "dozens of chains" is vague. ETH mainnet, Arbitrum, Optimism, Base, Polygon, Solana, Bitcoin — which of these are live? Which are planned?
4. **Rate transparency** — where does the borrow rate come from? Is it a Modulo-set rate or aggregated from underlying protocols? Is the yield I'm earning native protocol yield or a Modulo-managed rate?
5. **Liquidation mechanics** — what happens if my collateral drops? What are the LTV ratios? What's the liquidation penalty? Is there a buffer? I need these numbers before I borrow anything.
6. **Transaction transparency** — I want to be able to see what's happening under the hood. A transaction receipt that shows the underlying protocol interactions, not just "borrow complete."
7. **Position management** — the mobile screens don't show active positions (loans, collateral, health factor). This is critical DeFi infrastructure.
8. **Testnet / sandbox mode** — let me try the mechanics without real money before I commit.
9. **Smart contract addresses** — I want to be able to verify these on Etherscan/Solscan myself.
10. **Gas cost visibility** — even if Modulo abstracts gas, I want to see what the actual cost of a transaction was, post-execution.

---

## 5. Screen-by-Screen Reactions — Mobile App

### Screen 1: Portfolio (8253.png)

**What I see:** Dark theme, total portfolio value $12,847, a performance chart (green line, uptrend), quick-action buttons (Swap, Buy, Save, Borrow), token list below showing USD Coin, Wrapped Bitcoin, Ethereum, Solana, Tether.

**Alex's reaction:**

The portfolio view is clean. The hierarchy is right — total value first, then breakdown. The quick-action bar is sensible placement.

But I immediately notice: the token list shows **Wrapped Bitcoin**. The site said "no wrapping." This is the contradiction I was worried about. If the portfolio shows WBTC, either the "no wrapping" claim applies only to new deposits (and existing WBTC can be imported), or it's not yet built and this is a design sketch using placeholder data. Either way, this is the first thing I'd question in a demo.

The chart is minimal — no timeframe selector visible (1D/1W/1M), no P&L display, no cost basis. DeBank and Zapper both show unrealised P&L. That's what I actually want to know, not just total value.

The four quick actions: Swap, Buy, Save, Borrow. "Save" is an unusual label — probably means deposit/earn. I'd expect "Earn" or "Lend." Save feels like a savings account, which undersells the DeFi yield angle.

No indication of which chain each asset lives on. If I hold ETH on Mainnet and ETH on Arbitrum, this view merges them — which is useful for total value but I need to know the breakdown for gas planning and protocol access.

No health factor indicator. If I have an active borrow, this screen should show my liquidation risk at a glance. It doesn't.

**Rating: 6/10** — Good structure, placeholder data undermines the pitch, missing position management for active users.

---

### Screen 2: Receive (8010.png)

**What I see:** "Receive crypto" header, a QR code, username shown as "modulo.eth", network selector showing Ethereum/Multichain/Base options, and three "From your exchange" quick-link buttons: Coinbase, Binance, Kraken.

**Alex's reaction:**

The username-based receive is genuinely slick. modulo.eth as an ENS-style identifier that resolves cross-chain is exactly the UX improvement DeFi needs. Normal people can't remember wallet addresses.

The exchange quick-links (Coinbase, Binance, Kraken) are smart — they acknowledge where most people's assets actually are. This lowers the onboarding barrier significantly.

The network selector (Ethereum / Multichain / Base) is where it gets interesting. If I select "Multichain," does that mean one address works for all chains? That would be impressive. Or does it generate a different address per chain? The screen doesn't make this clear. If it's truly one address, I need to understand the mechanism — it's either a smart contract wallet (which has chain-specific addresses but a unified interface) or something more novel.

The QR code appears to be a standard wallet address. No visible explanation of what network it corresponds to. If someone scans this and sends on the wrong network, what happens? This is a real UX risk — wrong-chain sends are a common source of lost funds.

**Rating: 7/10** — Username receive is a genuine UX win. Network ambiguity is a risk that needs resolving.

---

### Screen 3: Swap (8498.png)

**What I see:** "Swap" header, source amount "0" with ETH selected as source token, destination token field with "Select token" button (purple), percentage shortcuts (25%, 50%, 75%, Max), numeric keypad, "Select a token" label at bottom.

**Alex's reaction:**

This is a clean, minimal swap UI. The keypad-first input is a reasonable mobile choice — better than fiddly number fields.

The percentage shortcuts (25/50/75/Max) are standard and useful. Max is the one I use most.

But I'm missing everything that matters for a swap decision:
- No rate shown until I select both tokens and an amount
- No slippage setting visible
- No price impact warning
- No route information — is this going through Uniswap? 1inch aggregation? Modulo's own pools?
- No minimum received display
- No fee breakdown

On Uniswap, before I confirm a swap, I can see the exact route, price impact, minimum received, and fee. Here I see a keypad. I understand this is pre-token-selection, but these elements need to exist before confirmation.

The "Select a token" at bottom as a CTA/label is redundant with the "Select token" button in the To field. Minor UX confusion.

**Rating: 5/10** — Functional skeleton. Missing all the pre-confirmation information that makes swapping trustworthy.

---

### Screen 4: Select Token (8609.png)

**What I see:** "Select token" modal/sheet, search field ("Token name or address"), list showing ETH, USDC, WBTC, SOL, USDT with balances.

**Alex's reaction:**

Clean and functional. Search by address is good — power user feature. The balance display alongside each token is the right call.

Again: **WBTC is listed**. If the pitch is native BTC, why is WBTC the Bitcoin representation in the token selector? This is the same contradiction as the portfolio screen. A DeFi user will notice this immediately.

The token list shows only 5 assets. How many are supported total? Are custom tokens importable? Can I add a contract address? These are expected DeFi primitives.

No chain filter. If I hold USDC on three different chains, do they appear as separate entries or merged? Chain context matters for DeFi interactions.

**Rating: 6/10** — Functional but the WBTC vs "native BTC" contradiction is a problem that needs addressing at product level, not just design level.

---

### Screen 5: Select Recipient (8793.png)

**What I see:** "Select recipient" modal, address/ENS/username search field, recent contacts list showing: "0x4348...0733" (a raw address), "modulo.eth" (with a verified badge), "0x0d04...0c3a".

**Alex's reaction:**

This is one of the stronger screens. The mix of raw addresses and ENS names in the contacts list shows the system handles both — that's right. The verified badge on modulo.eth is a trust signal I'd expect.

Username resolution (the site mentions Telegram/WhatsApp/Discord handles) isn't visible here — the field says "Address, ENS, or username" which suggests it's supported but the contacts list only shows crypto-native identifiers. I'd want to test whether typing a Discord username actually resolves.

The recents list is useful but sparse. In practice, I'd want to see which network each contact is on, or at least the last transaction details. "0x4348...0733" tells me nothing about context.

No address book grouping, no labels, no "save contact" affordance visible. These are QoL features I'd want for regular use.

**Rating: 7/10** — Solid foundation. Username search is the differentiator, needs to be more prominent.

---

### Screen 6: Browse / Discover (9115.png)

**What I see:** Search field at top, asset selector showing ETH and BTC with values ($2,406.78 / $86,411.00), a chart with timeframe toggle (Uniswap/Lido/Aave/Optimism tabs visible), and a protocol list below: USD Coin, Ethereum, Tether, Wrapped Bitcoin, Solana with values.

**Alex's reaction:**

This is the most interesting screen from a DeFi-native perspective and also the most confusing.

The top section looks like a rate/price comparison view — ETH vs BTC with a chart. The tabs (Uniswap / Lido / Aave / Optimism) suggest I can view rates or prices by protocol. That's directionally right for what I want — a rate aggregator across protocols.

But the list below shows tokens, not opportunities. If this is a "browse DeFi opportunities" screen, I'd expect to see:
- Current APY for each protocol
- My current position in each (if any)
- Available liquidity
- Risk rating or TVL as a proxy

Instead it shows tokens with prices. That's just a market data view, not a DeFi opportunity browser.

The Uniswap/Lido/Aave tabs are the most valuable element here — if those tabs show protocol-specific rates for the selected asset, this is genuinely useful. If they just show different price charts, it's not adding much over CoinGecko.

WBTC appears again in this list as the Bitcoin representation.

The dual asset header (ETH + BTC) is visually distinctive — it might be showing a portfolio-weighted view or a pair for comparison. The purpose isn't immediately clear.

**Rating: 5/10** — The right idea (protocol rate comparison) but the execution isn't clearly communicating the DeFi opportunity layer. Needs clearer information hierarchy.

---

## 6. Would Alex Use This Over Existing Tools?

**Right now: No. With some conditions: Yes.**

My current stack:
- DeBank for portfolio overview (it's free, it's accurate, it shows positions and health factor)
- Uniswap/1inch for swaps (aggregated routes, price impact visible)
- Aave directly for borrowing
- MetaMask for signing
- Manual bridging via Stargate/official bridges

**What would make me switch:**

The native BTC angle is the only thing on this page that would genuinely make me change my workflow. If I can put real BTC (not WBTC) up as collateral and borrow against it without trusting BitGo's wrapping, that's a meaningful unlock. No existing tool does this cleanly.

Cross-collateralisation across chains is also genuinely useful. The ability to borrow against my total portfolio value rather than per-chain silos would change how I manage leverage.

But I need to see:
1. The actual mechanism for native BTC (white paper, architecture doc, even a blog post)
2. Smart contract audits from a reputable firm (Trail of Bits, OpenZeppelin, Spearbit)
3. A working testnet or beta with real transactions I can inspect on-chain
4. Active position management in the mobile app (health factor, liquidation price, collateral breakdown)
5. Transparent fee structure — what does Modulo charge on top of underlying protocol fees?

If those exist, I'd move meaningful capital in. The UX is already smoother than what I use today.

---

## 7. What Alex Needs to Switch to Modulo as Primary DeFi Interface

In priority order:

### Must have (blockers)
- Smart contract audit — named firm, public report
- Verifiable on-chain positions (I can check Etherscan myself)
- Health factor / liquidation price visible in portfolio view
- Clear explanation of the native BTC mechanism (even if technical)
- Testnet / sandbox mode before mainnet commitment

### Should have (would accelerate adoption)
- Protocol rate comparison with real APY data (make the Browse screen actually useful)
- Transaction history with underlying protocol breakdown
- Supported chains and protocols clearly listed
- Fee transparency (total cost of a borrow or swap, including Modulo's margin)
- Position management screen — manage active borrows, adjust collateral

### Nice to have (power user features)
- Custom automation / conditional orders (the "borrow on dips" feature hinted at)
- CSV export for tax purposes
- Hardware wallet support (Ledger integration — I use this for significant holdings)
- Multiple accounts / sub-accounts
- Price alerts

---

## 8. Feature Gaps That Matter at Alex's Level

| Gap | Why it matters | Priority |
|-----|----------------|----------|
| No audit information anywhere | Trust/safety — non-negotiable for real money | Critical |
| WBTC in UI contradicts "no wrapping" claim | Undermines the core pitch | Critical |
| No liquidation/health factor display | Active borrow management impossible | High |
| No route/slippage info in swap | Can't evaluate execution quality | High |
| No supported protocol list | Can't verify depth of DeFi access | High |
| No position management screen | Can't manage active DeFi positions | High |
| Native BTC mechanism unexplained | The biggest claim needs the most evidence | High |
| No cost basis / P&L in portfolio | Portfolio view misses the key number | Medium |
| No chain-level breakdown | Can't plan gas or protocol access | Medium |
| No testnet/sandbox | Barrier to first real transaction | Medium |
| No hardware wallet support | Can't use for significant holdings | Medium |
| Fee structure not visible | Can't compare total cost to competitors | Medium |
| Recovery model unexplained | Passkey loss scenario unclear | Medium |

---

## 9. Synthesis — Alex's Overall Assessment

**The pitch is compelling.** The problem is stated accurately and the solution is described with enough specificity to be interesting. The design language is clean and the mobile-first approach is right for this use case.

**The evidence gap is the main issue.** For a DeFi user at my level, the absence of technical explanation, audit information, and on-chain verifiability is what's holding me back — not the UX. I can figure out a UI. I can't figure out whether the custody model is safe from a landing page.

**The WBTC contradiction needs resolution before the product goes further.** Either the "no wrapping" claim is aspirational (and the site should be honest about that), or WBTC appears in the designs because the design work used placeholder data. Either way, this is the first question any DeFi-native user will ask, and it needs an answer.

**The mobile app designs show good execution instincts.** Dark theme, clean hierarchy, sensible navigation, appropriate mobile patterns. The Browse screen needs the most work — it's currently under-delivering on what should be the most powerful feature (protocol rate comparison). The Swap screen needs pre-confirmation information to be trustworthy.

**The username-based receiving and passkey login are genuine UX differentiators** that could appeal to a broader audience than DeFi-natives. For the "crypto holders who've never used DeFi" segment, these features matter more than the technical depth I'm asking for.

**For Alex specifically:** I'd join the waitlist. I'd try the testnet if one exists. I would not move significant funds until I can see an audit and verify positions on-chain. The product is promising but unproven at the level that matters for my use case.

---

*Evaluation complete. Feeds into ProductBrief phase.*

## See also

- [[Platform/Modulo/STATUS]] — Modulo build status
- [[Personas/Alex-DeFi-Intermediate]] — Alex persona definition
- [[Discovery/README]] — Fully Baked discovery phase
