# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.js >> actions — stake tab
- Location: tests/visual.spec.js:108:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Continue in Demo Mode')
    - locator resolved to <button data-rac="" tabindex="0" type="button" class="demo-connect-btn" id="react-aria3334587677-:ri:" data-react-aria-pressable="true">Continue in Demo Mode</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="pw-gate">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="pw-gate">…</div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    51 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div id="pw-gate">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e5]:
    - img "Modulo" [ref=e7]
    - heading "Connect your wallet" [level=1] [ref=e8]
    - paragraph [ref=e9]: Choose your wallet to get started
    - list [ref=e10]:
      - button "Install MetaMask" [disabled] [ref=e11] [cursor=pointer]:
        - generic [ref=e12]: MM
        - generic [ref=e13]: Install MetaMask
      - button "Coinbase Wallet" [ref=e14] [cursor=pointer]:
        - generic [ref=e15]: CO
        - generic [ref=e16]: Coinbase Wallet
    - paragraph [ref=e17]: By connecting, you agree to Modulo's terms. Your keys, your crypto.
    - button "Continue in Demo Mode" [ref=e18] [cursor=pointer]
  - generic [ref=e20]:
    - img [ref=e22]
    - paragraph [ref=e32]: Enter password to continue
    - textbox "Password" [active] [ref=e33]
    - button "Continue" [ref=e34] [cursor=pointer]
```

# Test source

```ts
  1   | /**
  2   |  * Modulo Visual Regression Suite
  3   |  *
  4   |  * Captures baseline screenshots at 390×844 (iPhone 14).
  5   |  * Run:   npm run test:visual
  6   |  * Update baselines: npm run test:visual:update
  7   |  *
  8   |  * Baseline PNGs live in tests/visual.spec.js-snapshots/.
  9   |  * Any pixel change (beyond 0.2% tolerance) fails the test.
  10  |  * To regenerate: npm run test:visual:update
  11  |  */
  12  | 
  13  | // @ts-check
  14  | import { test, expect } from '@playwright/test';
  15  | 
  16  | // ─── Helpers ────────────────────────────────────────────────────────────────
  17  | 
  18  | /**
  19  |  * Inject localStorage BEFORE the page script runs, so PasswordGate
  20  |  * reads `modulo-access: 1` on first render and skips the gate.
  21  |  */
  22  | async function unlockGate(page) {
  23  |   await page.addInitScript(() => {
  24  |     localStorage.setItem('modulo-access', '1');
  25  |   });
  26  | }
  27  | 
  28  | async function enterDemoMode(page) {
  29  |   await unlockGate(page);
  30  |   await page.goto('/#/');
  31  |   await page.waitForSelector('text=Continue in Demo Mode', { timeout: 10000 });
> 32  |   await page.click('text=Continue in Demo Mode');
      |              ^ Error: page.click: Test timeout of 30000ms exceeded.
  33  |   await page.waitForSelector('[data-bk-component="bottom-nav"]', { timeout: 10000 });
  34  |   await page.waitForTimeout(400);
  35  | }
  36  | 
  37  | async function openActions(page) {
  38  |   await page.click('[aria-label="Actions"]');
  39  |   await page.waitForSelector('.actions-overlay', { timeout: 4000 });
  40  |   await page.waitForTimeout(300);
  41  | }
  42  | 
  43  | async function switchActionsTab(page, label) {
  44  |   await page.click(`.actions-tab-strip [role="tab"]:has-text("${label}")`);
  45  |   await page.waitForTimeout(200);
  46  | }
  47  | 
  48  | // ─── Screens ────────────────────────────────────────────────────────────────
  49  | 
  50  | test('connect screen', async ({ page }) => {
  51  |   await unlockGate(page);
  52  |   await page.goto('/#/');
  53  |   await page.waitForSelector('text=Continue in Demo Mode', { timeout: 10000 });
  54  |   await expect(page).toHaveScreenshot('connect.png');
  55  | });
  56  | 
  57  | test('home screen', async ({ page }) => {
  58  |   await enterDemoMode(page);
  59  |   await expect(page).toHaveScreenshot('home.png');
  60  | });
  61  | 
  62  | test('markets screen', async ({ page }) => {
  63  |   await enterDemoMode(page);
  64  |   await page.click('[aria-label="Markets"]');
  65  |   await page.waitForURL('**/#/explore');
  66  |   await page.waitForTimeout(300);
  67  |   await expect(page).toHaveScreenshot('markets.png');
  68  | });
  69  | 
  70  | test('activity screen', async ({ page }) => {
  71  |   await enterDemoMode(page);
  72  |   await page.click('[aria-label="Activity"]');
  73  |   await page.waitForURL('**/#/activity');
  74  |   await page.waitForTimeout(300);
  75  |   await expect(page).toHaveScreenshot('activity.png');
  76  | });
  77  | 
  78  | test('funds screen', async ({ page }) => {
  79  |   await enterDemoMode(page);
  80  |   await page.click('[aria-label="Funds"]');
  81  |   await page.waitForURL('**/#/manage');
  82  |   await page.waitForTimeout(300);
  83  |   await expect(page).toHaveScreenshot('funds.png');
  84  | });
  85  | 
  86  | // ─── Actions sheet — all tabs ────────────────────────────────────────────────
  87  | 
  88  | test('actions — swap tab', async ({ page }) => {
  89  |   await enterDemoMode(page);
  90  |   await openActions(page);
  91  |   await expect(page).toHaveScreenshot('actions-swap.png');
  92  | });
  93  | 
  94  | test('actions — trade tab', async ({ page }) => {
  95  |   await enterDemoMode(page);
  96  |   await openActions(page);
  97  |   await switchActionsTab(page, 'Trade');
  98  |   await expect(page).toHaveScreenshot('actions-trade.png');
  99  | });
  100 | 
  101 | test('actions — lend tab', async ({ page }) => {
  102 |   await enterDemoMode(page);
  103 |   await openActions(page);
  104 |   await switchActionsTab(page, 'Lend');
  105 |   await expect(page).toHaveScreenshot('actions-lend.png');
  106 | });
  107 | 
  108 | test('actions — stake tab', async ({ page }) => {
  109 |   await enterDemoMode(page);
  110 |   await openActions(page);
  111 |   await switchActionsTab(page, 'Stake');
  112 |   await expect(page).toHaveScreenshot('actions-stake.png');
  113 | });
  114 | 
  115 | // ─── Swap flow ───────────────────────────────────────────────────────────────
  116 | 
  117 | test('swap — amount entered', async ({ page }) => {
  118 |   await enterDemoMode(page);
  119 |   await openActions(page);
  120 |   for (const key of ['0', '.', '5']) {
  121 |     await page.click(`.numpad-btn:has-text("${key}")`);
  122 |     await page.waitForTimeout(80);
  123 |   }
  124 |   await expect(page).toHaveScreenshot('actions-swap-amount.png');
  125 | });
  126 | 
  127 | // ─── Component screenshots ───────────────────────────────────────────────────
  128 | 
  129 | test('bottom nav', async ({ page }) => {
  130 |   await enterDemoMode(page);
  131 |   await expect(page.locator('[data-bk-component="bottom-nav"]')).toHaveScreenshot('bottom-nav.png');
  132 | });
```