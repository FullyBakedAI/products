# Modulo QA Checklist

Run on every sprint before marking complete.

## Automated (vitest — must all pass)
- [ ] SwapContext: receiveAmountRaw has no commas
- [ ] SwapContext: selectToken handles collision
- [ ] SwapContext: swapDirections swaps keys
- [ ] SwapContext: payUSD is 0.00 when empty

## CSS audit (grep before each commit)
- [ ] No hardcoded hex values in screen CSS files (exception: tokens.css)
- [ ] No `!important` added without a comment explaining why
- [ ] No sub-pixel magic numbers without a comment
- [ ] No CSS typos: run `grep -rn ":[[:space:]]*[0-9][a-z][a-z][a-z]px\|intset\|--bk-[a-z][a-z];" src/` and fix any hits

## Logic audit
- [ ] No `parseFloat` in financial arithmetic (all BigNumber)
- [ ] No `toLocaleString` on values that will be parsed downstream
- [ ] All fee values either real or explicitly null (no hardcoded dollar amounts)
- [ ] No `localStorage` used for wallet auth state

## Accessibility (Sprint 5 onwards)
- [ ] All interactive elements have aria-label or visible label
- [ ] No `outline: none` without a replacement focus style
- [ ] Color contrast: no inline hex without checking against token value

## Before every client demo
- [ ] Run Lighthouse — Accessibility ≥ 90, Performance ≥ 80
- [ ] Test on real iOS device (home indicator safe area)
- [ ] Test wallet connect with real MetaMask
- [ ] Verify fee shows real estimate (not hardcoded)
