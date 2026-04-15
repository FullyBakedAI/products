/**
 * Modulo Visual Regression Suite
 *
 * Captures baseline screenshots at 390×844 (iPhone 14).
 * Run:   npm run test:visual
 * Update baselines: npm run test:visual:update
 *
 * Baseline PNGs live in tests/visual.spec.js-snapshots/.
 * Any pixel change (beyond 0.2% tolerance) fails the test.
 * To regenerate: npm run test:visual:update
 */

// @ts-check
import { test, expect } from '@playwright/test';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Inject localStorage BEFORE the page script runs, so PasswordGate
 * reads `modulo-access: 1` on first render and skips the gate.
 */
async function unlockGate(page) {
  await page.addInitScript(() => {
    localStorage.setItem('modulo-access', '1');
  });
}

async function enterDemoMode(page) {
  await unlockGate(page);
  await page.goto('/#/');
  await page.waitForSelector('text=Continue in Demo Mode', { timeout: 10000 });
  await page.click('text=Continue in Demo Mode');
  await page.waitForSelector('[data-bk-component="bottom-nav"]', { timeout: 10000 });
  await page.waitForTimeout(400);
}

async function openActions(page) {
  await page.click('[aria-label="Actions"]');
  await page.waitForSelector('.actions-overlay', { timeout: 4000 });
  await page.waitForTimeout(300);
}

async function switchActionsTab(page, label) {
  await page.click(`.actions-tab-strip [role="tab"]:has-text("${label}")`);
  await page.waitForTimeout(200);
}

// ─── Screens ────────────────────────────────────────────────────────────────

test('connect screen', async ({ page }) => {
  await unlockGate(page);
  await page.goto('/#/');
  await page.waitForSelector('text=Continue in Demo Mode', { timeout: 10000 });
  await expect(page).toHaveScreenshot('connect.png');
});

test('home screen', async ({ page }) => {
  await enterDemoMode(page);
  await expect(page).toHaveScreenshot('home.png');
});

test('markets screen', async ({ page }) => {
  await enterDemoMode(page);
  await page.click('[aria-label="Markets"]');
  await page.waitForURL('**/#/explore');
  await page.waitForTimeout(300);
  await expect(page).toHaveScreenshot('markets.png');
});

test('activity screen', async ({ page }) => {
  await enterDemoMode(page);
  await page.click('[aria-label="Activity"]');
  await page.waitForURL('**/#/activity');
  await page.waitForTimeout(300);
  await expect(page).toHaveScreenshot('activity.png');
});

test('funds screen', async ({ page }) => {
  await enterDemoMode(page);
  await page.click('[aria-label="Funds"]');
  await page.waitForURL('**/#/manage');
  await page.waitForTimeout(300);
  await expect(page).toHaveScreenshot('funds.png');
});

// ─── Actions sheet — all tabs ────────────────────────────────────────────────

test('actions — swap tab', async ({ page }) => {
  await enterDemoMode(page);
  await openActions(page);
  await expect(page).toHaveScreenshot('actions-swap.png');
});

test('actions — trade tab', async ({ page }) => {
  await enterDemoMode(page);
  await openActions(page);
  await switchActionsTab(page, 'Trade');
  await expect(page).toHaveScreenshot('actions-trade.png');
});

test('actions — lend tab', async ({ page }) => {
  await enterDemoMode(page);
  await openActions(page);
  await switchActionsTab(page, 'Lend');
  await expect(page).toHaveScreenshot('actions-lend.png');
});

test('actions — stake tab', async ({ page }) => {
  await enterDemoMode(page);
  await openActions(page);
  await switchActionsTab(page, 'Stake');
  await expect(page).toHaveScreenshot('actions-stake.png');
});

// ─── Swap flow ───────────────────────────────────────────────────────────────

test('swap — amount entered', async ({ page }) => {
  await enterDemoMode(page);
  await openActions(page);
  for (const key of ['0', '.', '5']) {
    await page.click(`.numpad-btn:has-text("${key}")`);
    await page.waitForTimeout(80);
  }
  await expect(page).toHaveScreenshot('actions-swap-amount.png');
});

// ─── Component screenshots ───────────────────────────────────────────────────

test('bottom nav', async ({ page }) => {
  await enterDemoMode(page);
  await expect(page.locator('[data-bk-component="bottom-nav"]')).toHaveScreenshot('bottom-nav.png');
});
