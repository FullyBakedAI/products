# Modulo Design Constraints

> **Load when:** making any design or interaction decision, reviewing finished work, checking if a pattern is permitted, evaluating an agent's output for compliance.
>
> Constraints are not limitations — they are the conditions that make quality possible.
> These rules apply to every agent, designer, and developer building Modulo UI.
> When in doubt, apply the constraint.

---

## Hard Rules (never break these)

### Visual
- **Never hardcode a hex value.** Use `--bk-*` tokens. If a value doesn't have a token, add one.
- **Never use pure white (`#ffffff`) or pure black (`#000000`).** Use the token system.
- **Never use more than one primary CTA per screen.** One dominant action. Always.
- **Never approximate brand assets.** Use the exported SVG files. No hand-drawn substitutes.
- **Never use font weights outside 400/500/600/700.** Inter 300 is only for display numbers.

### Interaction
- **Every interactive element must use React ARIA.** `Button` from `react-aria-components`, not `<button>` or `<div onClick>`.
- **Minimum 44×44px touch target on every interactive element.**
- **Never show a destructive action without a confirmation step.**
- **Never navigate back using `navigate(-1)`.** Use explicit paths. History is unreliable.

### Content
- **Never truncate financial values.** If a number is too wide, reduce font size. Never round `$5,342.98` to `$5,343`.
- **Never use jargon without explanation in user-facing copy.** "Gas fee" needs context. "Slippage" needs context.
- **Never show a loading state without structure.** Skeleton screens, not spinners. The layout should be visible before content loads.
- **Error messages must say what happened AND what to do next.** "Transaction failed" is incomplete. "Transaction failed — try again or reduce the amount" is complete.

### Accessibility
- **WCAG 2.1 AA minimum, always.**
- **Every `<img>` needs an `alt` attribute.** Decorative images get `alt=""`. Informative images get descriptive alt text.
- **Every form element needs a visible label or `aria-label`.**
- **Focus states must be visible.** Never `outline: none` without a custom focus indicator.

---

## Design Guardrails (strong defaults, override with intention)

These are defaults that should hold unless there's an explicit reason to deviate.

- **Screens have one scroll axis.** Horizontal scroll within a vertical screen creates confusion.
- **Modals and sheets slide up from the bottom.** Not from the side. Not fade-in only.
- **The primary action is always bottom-anchored.** Users' thumbs are at the bottom.
- **Token amounts use the token's canonical symbol** (ETH not Ether, USDC not USD Coin) in compact contexts.
- **Success feedback names the action** ("Swap complete" not just "Success ✓").
- **Motion is purposeful.** If an animation doesn't help the user understand what happened, remove it.

---

## What Good Looks Like

| Instead of | Do this |
|-----------|---------|
| Complex multi-step form on one screen | Progressive disclosure — one decision per screen |
| "Are you sure?" confirmation dialog | Show a summary of what will happen, then confirm |
| Loading spinner over blank content | Skeleton that matches the shape of expected content |
| Generic error: "Something went wrong" | Specific: "Network error — check connection and retry" |
| Hiding chain complexity from user | Naming the chain clearly in context ("on Solana") |
| Showing 8 decimal places always | Context-appropriate precision (2dp for USD, 4–6dp for crypto) |

---

## Things Agents Should Never Invent

These require explicit decisions — don't generate them speculatively:

- New token colour values
- New route paths
- Custom icon designs
- Copy for legal, financial, or risk-related content
- New component patterns not in the component inventory
- Screen flows that bypass confirmation steps

When uncertain, render a placeholder and flag it for human review.
