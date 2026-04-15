## Session: 2026-04-14 — Full Comprehensive QA Audit (Sprint QA-003)

### What was audited
Full code trace and flow audit: all key screens, all 5 critical flows (A–E), CSS quality, safe area behaviour, state management edge cases. See `workspace/Platform/Modulo/QA/full-qa-2026-04-14.md` for complete report.

### New bugs found (Sprint QA-003)

| ID | Severity | Finding |
|----|----------|---------|
| MOD-092 | 🔴 P1 | SuccessScreen StatusCard always shows hardcoded "0.1 ETH / 324.10 USDC" — ignores actual transaction state |
| MOD-093 | 🔴 P1 | SwapContext crash: selecting same token for both sides when receiveKey is null → `payToken = undefined` → error boundary |
| MOD-094 | 🟡 P2 | SwapSelectScreen always redirects to Home+ActionsOverlay — standalone /swap flow is broken |
| MOD-095 | 🟡 P2 | SwapTab `const deadline = 20` ignores SwapContext deadline — diverges from ReviewScreen display |
| MOD-096 | 🟡 P2 | ReviewScreen MOD-041 guard calls `navigate()` during render — React anti-pattern |
| MOD-097 | ⚪ P3 | BottomNav Funds button missing feature flag (all others have `f.nav.*`) |
| MOD-098 | ⚪ P3 | ReviewScreen close uses `navigate(-1)` — violates Rule 3 |

### Flow results

| Flow | Result |
|------|--------|
| A: Connect → Demo → Home | ✅ PASS |
| B: FAB → SwapTab → Review → Success | ✅ PASS (MOD-092 defect noted at SuccessScreen) |
| C: /swap → SwapSelectScreen → Review | ❌ FAIL — MOD-094 |
| D: Bottom nav 5 tabs | ✅ PASS |
| E: Home → Asset → back | ✅ PASS |

### QA gate files updated
- `workspace/Platform/Modulo/QA/full-qa-2026-04-14.md` — full audit report
- `workspace/Platform/Modulo/QA/kanban.md` — MOD-092 through MOD-098 added
- `workspace/Platform/Modulo/QA/qa-gate-process.md` — Steps 3 and 4 expanded with explicit Flow A–E checklists

---

## Session: 2026-04-14 — SwapTab P1 Bug Fix + Full QA Audit

### What was built/fixed

- **MOD-091 FIXED:** TransactionPath blocking CTA button in SwapTab on iOS/Safari
  - Added `height: 0` to `.actions-tab-scroll` in `src/actions.css` — Safari flex scroll fix
  - Removed `margin: 0 16px` from `.tx-path-root` in `src/components/TransactionPath/styles.css` — double-padding removed
- Ran three local model audits (qwen3:32b × 2, deepseek-r1:32b × 1) against SwapTab.jsx and actions.css
- Wrote full audit report to `workspace/Platform/Modulo/QA/local-model-audit-swap-2026-04-14.md`
- Added MOD-091 ticket (FIXED) to `workspace/Platform/Modulo/QA/kanban.md`
- Added Step 5b (conditional content visibility check) to `workspace/Platform/Modulo/QA/qa-gate-process.md`

### Decisions made (and why)

- **`height: 0` on scroll container** — The correct Safari flex scroll fix. `flex: 1; min-height: 0` alone sometimes fails in WebKit because the browser uses content height as the flex basis. `height: 0` zeros out natural height so flex allocation is clean. This is the standard pattern for Safari flex-scroll containers.
- **Removed TransactionPath margin entirely** — Parent `.actions-tab-stack` owns all horizontal padding (16px each side). TransactionPath's own margin was double-inset causing 32px bleed. Removed margin; `.tx-path-compact` variant is unaffected since it has its own `margin: 0`.
- **Did not touch ReviewScreen** — MOD-085 (TransactionPath blocking Confirm in ReviewScreen) is a separate ticket with a different fix spec (sticky footer extraction). That's a bigger layout refactor — not bundled here.

### Bugs found — root causes

- **P1 (MOD-091 — fixed):** iOS Safari won't honour `flex: 1; min-height: 0` as a scroll-container constraint unless `height: 0` is also set. Root cause is WebKit's flex algorithm using content height as basis when no explicit height is set.
- **P1 (visual — fixed):** TransactionPath `margin: 0 16px` stacked with parent padding causing 32px edge bleed. Discovered when checking why the component looked wide on the demo.
- **P2 (unfixed):** `isQuoting` state not reset on navigation failure. If `navigate()` throws, spinner is stuck. Low probability for prototype but should be wrapped in try/finally before real trading is wired.
- **P2 (unfixed):** `useEffect` ESLint suppression on asset pre-select — hides real lint signal. Not broken today but makes future refactoring risky.

### Patterns to reuse next time

- For any new scroll container inside a flex column on iOS: always use `flex: 1; height: 0; min-height: 0; overflow-y: auto` — not just `flex: 1; min-height: 0`.
- When a component has its own horizontal margin AND is rendered inside a padded container, check for double-inset before shipping. Particularly watch `TransactionPath`, `FeeBreakdown`, and `Card` components — they may carry margins that conflict with screen-level padding.
- Run `qwen3:32b` on any CSS file that touches flex scroll containers before demo — it catches this class of bug.

### Open threads / next session

- **MOD-085** (ReviewScreen TransactionPath blocks Confirm) — separate fix, sticky footer refactor needed
- **MOD-086** (BottomNav vertical alignment) — still open
- **MOD-087** (FAB not circular) — still open
- **MOD-088** (Header/status bar overlap) — still open
- **MOD-090** (WalletConnect crash on mobile) — still open
- Test infrastructure: `SwapContext.test.jsx` failing due to missing `QueryClientProvider` wrapper in setup — pre-existing, not caused by today's changes. Fix: wrap test render in `QueryClientProvider` in `src/test/setup.js` or per-test.
- Sprint QA-003 should bundle the P2/P3 findings from today's model audit into tickets
