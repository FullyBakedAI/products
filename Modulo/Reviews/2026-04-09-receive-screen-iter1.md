# Persona Review: receive-screen
**Date:** 2026-04-09
**Product:** modulo
**Iteration:** 1
**Input:** /Users/Frank/products/modulo/Prototype/receive-screen.html

## Results

### Alex DeFi Intermediate\n\n**Verdict:** CONCERNS

**Summary:** The UI is clean and professional, but it lacks the critical network identifiers I need to prevent sending funds to the wrong chain and losing them forever.

**Pain points addressed:** 
- **Fragmented portfolio view:** The "Exchange" section suggests a way to streamline moving funds from CEXs into the ecosystem, which could reduce the manual "deposit -> bridge -> swap" loop.
- **Cross-chain friction:** If the "Supported Networks" pills actually represent a single unified address that handles multiple chains, that's a massive win for me.

**Red flags triggered:** 
- **Transparency/Risk:** I see an address and a QR code, but I don't see a prominent network label (e.g., "Bitcoin", "Ethereum", "Solana") attached to the address itself. If I'm used to managing multiple wallets, I need to know *exactly* which chain this address belongs to before I hit copy. If this is a "magic" address that handles everything, you need to explicitly state that to build trust.

**Missing:** 
- **Network Context:** A clear, high-visibility label next to the address (e.g., "Address (BTC)") or a way to toggle between different network addresses.
- **Mechanism Transparency:** What do the "Exchange" buttons actually do? Are they initiating a programmed transfer from Binance/Coinbase? If I'm clicking that, I need to know the "how" and the "cost" before I commit.
- **Address Verification:** A way to see the full address or a more descriptive way to identify which "account" this is if I have multiple sub-accounts in Modulo.

**Quote:** "The UI looks slick, but I'm not sending my BTC to a random string of characters without knowing if it's an EVM address or native Bitcoin. Show me the chain, or I'm staying in MetaMask."\n\n---\n\n### Jordan Crypto Curious\n\n**Verdict:** CONCERNS

**Summary:** This screen shows me how to move money *into* the app, which is the first step, but it's already making me nervous because I don't know what "networks" are or if I'm going to break something.

**Pain points addressed:** 
- **Too many steps to do anything:** It's a single screen with clear options (QR, address, or exchange buttons), which feels less overwhelming than a complex DeFi dashboard.
- **Fear of irreversible mistakes:** Providing a "Copy" button and an "Exchange" button suggests there might be a way to automate the transfer rather than me manually typing a long string of gibberish.

**Red flags triggered:** 
- **"Bridge your assets to get started":** While it doesn't explicitly say "bridge," the "Supported Networks" section is a huge red flag. I don't know what a "network" is in this context, and I'm terrified that if I send my ETH from Coinbase via the "wrong" network, it'll just vanish.
- **Rates shown without context:** If I click those exchange buttons, I need to know exactly what the fee is and what the final amount arriving in Modulo will be.

**Missing:** 
- **Human language:** Instead of "Supported Networks," tell me "Which network are you sending from?" or "Make sure your Coinbase setting matches this."
- **Safety Net/Verification:** I need a "Check your address" or "Verify network" step. I also need to see a "Help" or "Support" icon right here, because if I mess up this transfer, I'm going to panic.
- **The "What happens next" factor:** Once I send the money, does it just appear? Is there a confirmation? I need to know the "after" part of this transaction.

**Quote:** "It looks clean enough, but I'm staring at this 'Networks' section like it's a bomb I'm about to defuse—I have no idea if I'm clicking the right thing or if my Bitcoin is about to disappear into a black hole."\n\n---\n\n### Sam High Value Holder\n\n**Verdict:** CONCERNS

**Summary:** The interface is clean and functional for a retail user, but it lacks the institutional-grade transparency and technical specificity required for a high-value holder to move significant native BTC collateral.

**Pain points addressed:** None. While it provides the basic utility of an address and a QR code, it fails to address the underlying risks of the deposit (network mismatch, contract verification, or the mechanics of how this becomes collateral).

**Red flags triggered:** The "Exchange" section is dangerously ambiguous—I don't know if these are integrations, shortcuts, or third-party intermediaries. Furthermore, the "Supported Networks" section is too vague; if I see a list of networks without explicit instructions on which asset belongs to which chain, I'm not sending a single satoshi.

**Missing:** 
1. **Network-to-Asset Mapping:** Explicit instructions (e.g., "Send BTC via Bitcoin Network ONLY").
2. **Verification Links:** A direct link to the blockchain explorer or the specific smart contract address for this deposit destination so I can verify it myself.
3. **Contextual Intent:** This screen should be labeled "Deposit Collateral" or "Withdraw Funds," not just "Receive." I need to know the *purpose* of this transaction.
4. **Audit Visibility:** A small, persistent link to the protocol's latest audit report or a "Security" tab.

**Quote:** "This looks like a standard retail wallet, but I'm not looking for a better MetaMask; I'm looking for a prime brokerage. If I'm moving $800k in BTC, I don't care how nice the QR code is—I need to see the network validation and the audit trail for this specific deposit address before I hit send."\n\n---\n\n## Overall: FAIL — needs work before shipping\n