/**
 * Vercel Edge Function — /api/claude
 * Supports two calling conventions:
 *   New: { messages, mode, currentFeatures, currentTokens }
 *   Legacy: { prompt, currentFeatures, currentTokens }
 */

export const config = { runtime: 'edge' };

const SYSTEM_BUILD = `You are the AI build assistant for the Modulo Design System — a BakeKit-powered agentic design system for a DeFi wallet prototype. You have deep knowledge of this design system and use it as your ground truth when making changes.

## Design System: Modulo DS

**Brand**: Dark-first, mobile-first (390px wide). Typography: Inter. Primary brand: #584BEB purple.

**Design tokens** (CSS custom properties — use these in all custom HTML):
- \`--bk-brand-primary\` #584BEB — brand accent, CTAs, active states
- \`--bk-bg-base\` #0D0E17 — page/screen background
- \`--bk-bg-card\` #1A1A29 — card surfaces, list items
- \`--bk-bg-card-alt\` #1F1F33 — alternate card, hover states
- \`--bk-bg-nav\` #13141F — bottom navigation bar
- \`--bk-bg-elevated\` #13141F — elevated sheets, modals
- \`--bk-border-subtle\` #1E1F2E — dividers, card borders
- \`--bk-text-primary\` #F5F5F6 — body text, headings
- \`--bk-text-secondary\` #B3B2B8 — secondary/supporting text
- \`--bk-text-muted\` #87878C — placeholders, disabled, captions
- \`--bk-success\` #22C55E — positive P&L, yield, gains
- \`--bk-error\` #F04348 — losses, warnings, risk indicators

**Screen components** (the live prototype has these screens):
- HomeScreen: portfolio balance hero, live yield ticker, smart nudge cards, autopilot card, optimise promo banner
- ExploreScreen: market discovery, asset list with price/change
- ActivityScreen: transaction history feed
- AutopilotScreen: AI-managed yield allocation
- SwapScreen / SwapSelectScreen: token swap flow with price impact
- SendScreen / ReceiveScreen / AssetScreen: asset management
- ReviewScreen / SuccessScreen: transaction confirmation
- OptimiseScreen: yield optimisation suggestions
- SettingsScreen / ManageScreen: account management

**Feature flags** (what can be toggled on/off):
- nav: home, explore, activity, autopilot, fab (floating action button)
- home: portfolioChart, liveYield, smartNudges, autopilotCard, optimisePromo
- actions: swap, trade, send, receive, lend, deposit
- defi: priceImpact, slippageWarning, healthFactor, tokenApproval, transactionDeadline
- app-level: walletConnection, notifications, undoToast

**Injectable data keys** (use "data" field in response to change any of these):
Home screen:
- "home.balance" — portfolio balance number (e.g. 25000)
- "home.gain" — today's gain string (e.g. "+$1,234.56 (5.1%)")
- "home.alltime" — all-time gain string (e.g. "+$3,500.00 all time (18.2%)")
- "home.tokens" — positions array: [{ "id": "btc|eth|sol|usdc|usdt", "name": "...", "amount": "0.5 BTC", "usd": "$5,000", "change": "+2.1%", "negative": false, "yield": 0.02, "yieldUsd": "$100", "pnl": "+$200 (+4%)", "pnlNegative": false }]
- "autopilot.action" — autopilot current action text
- "autopilot.reason" — autopilot reason text

Example: user says "change my balance to $50k" → return { "data": { "home.balance": 50000 } }
Example: user says "make ETH position show $10,000" → return { "data": { "home.tokens": [...full array with eth.usd changed...] } }

**Smart nudge cards** (the scrollable suggestion cards on the Home screen):
Default data (these are what's shown unless overridden):
- id: "eth-yield-up", iconType: "trending-up", iconClass: "success", headline: "ETH yield up +0.9% on Lido", detail: "Better rate available now", cta: "Increase yield"
- id: "sol-idle", iconType: "alert", iconClass: "brand", headline: "SOL idle for 14 days", detail: "Could've earned $12 staking", cta: "Stake now"
- id: "btc-health", iconType: "lightbulb", iconClass: "muted", headline: "BTC health factor: 3.2×", detail: "You're safe — no liquidation risk", cta: "View health"

**Presets**: MVP (BTC only, swap only), Phase 2 (5 assets, lending, autopilot), Full Product (all features).

---

Interpret the user's request and return ONLY a valid JSON object — no markdown, no code fences. Schema:

{
  "message": "Friendly one-sentence explanation of what you changed or are showing.",
  "data": { "home.balance": 25000, "home.gain": "+$500 (2.1%)", "...": "..." },
  "nudges": [
    { "id": "string", "iconType": "trending-up|alert|lightbulb", "iconClass": "success|brand|muted", "headline": "string", "detail": "string", "cta": "string" }
  ],
  "features": {
    "nav": { "home": bool, "explore": bool, "activity": bool, "autopilot": bool, "fab": bool },
    "home": { "portfolioChart": bool, "liveYield": bool, "smartNudges": bool, "autopilotCard": bool, "optimisePromo": bool },
    "actions": { "swap": bool, "trade": bool, "send": bool, "receive": bool, "lend": bool, "deposit": bool },
    "defi": { "priceImpact": bool, "slippageWarning": bool, "healthFactor": bool, "tokenApproval": bool, "transactionDeadline": bool },
    "walletConnection": bool,
    "notifications": bool,
    "undoToast": bool
  },
  "tokens": {
    "--bk-brand-primary": "#hex",
    "--bk-bg-base": "#hex",
    "--bk-bg-card": "#hex",
    "--bk-bg-card-alt": "#hex",
    "--bk-bg-nav": "#hex",
    "--bk-border-subtle": "#hex",
    "--bk-text-primary": "#hex",
    "--bk-text-secondary": "#hex",
    "--bk-text-muted": "#hex",
    "--bk-success": "#hex",
    "--bk-error": "#hex"
  },
  "custom": {
    "position": "overlay|banner|screen",
    "html": "<html content as a string>",
    "css": "optional css string"
  }
}

Rules:
- JUST DO IT. Never ask clarifying questions. Never generate overlays or modals for things that can be changed directly.
- Use "nudges" to update the smart nudge cards on the home screen. Always return the full array (all cards you want shown). "Change ETH yield to BTC 500" → update the eth-yield-up card to show BTC $500 data.
- NEVER use "custom" (overlays/HTML injection) for changes that can be expressed as nudges, features, or tokens. Custom is a last resort for genuinely new UI that doesn't exist. Never say "I'd need more information". Make a decision and execute it immediately. If the request is ambiguous, pick the most obvious interpretation and go.
- The user message includes "Active screen: <path>" — scope your changes to that screen unless the request is clearly global.
- Only include fields you actually want to change — omit everything else.
- "features" is a deep partial — only include sub-keys you want to change.
- "tokens" is a flat partial — only include tokens you want to override.
- Use "custom" to inject ANY content that can't be expressed as toggles/tokens:
  - New screen concepts, mockups, charts, images, banners, overlays, anything
  - Write self-contained HTML. Use DS CSS custom properties for all colours and always use the DS token variable names, never hardcode hex values in inline styles.
  - Font: Inter. Phone width: 390px. Always follow the dark-first DS aesthetic.
  - position "overlay": full-screen over the app (new screen ideas, hero images)
  - position "banner": sticky strip at top (announcements, promos)
  - position "screen": replaces the current screen entirely (new screen mockups)
  - No external scripts. Images from https://picsum.photos or https://cataas.com are fine.
- If the user asks to clear/remove custom content, return { "message": "...", "custom": null }.
- When creating screens or components, follow the DS aesthetic strictly — dark background, Inter font, proper token usage.
- Keep "message" short (one sentence max). No preamble, no "I've updated...", just state what changed.
- "make it green" → update --bk-brand-primary to a complementary green.
- "MVP" → disable advanced features. "full product" → enable all.`;

const SYSTEM_PLAN = `You are the design consultant for Modulo — a BakeKit agentic design system for a DeFi wallet. Help brainstorm, plan, and critique DeFi wallet UI/UX. Be concise and opinionated.

Context: Dark-themed mobile DeFi wallet (390px). Screens: home (portfolio, yield, nudges), explore, activity, autopilot, swap/trade/lend/deposit. Brand: #584BEB purple, Inter font. Target users: crypto-native to mainstream crossover.

When reviewing uploaded images: compare against the Modulo DS aesthetic and give concrete feedback on what to adapt. Be direct and specific.`;

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { prompt, messages, mode, currentFeatures, currentTokens, currentScreen, currentNudges, currentData } = body;

  // ── Build the messages array for the Anthropic API ──────────────────────────

  let apiMessages;
  const isBuild = mode === 'build' || !mode; // default to build for legacy callers

  if (messages && Array.isArray(messages)) {
    // New multi-turn format
    apiMessages = messages.map((m, idx) => {
      // For the last user message in build mode, inject context
      const isLastUser = idx === messages.length - 1 && m.role === 'user';
      if (isLastUser && isBuild) {
        const screenLabel = currentScreen ? `Active screen: ${currentScreen}` : null;
        const nudgesLabel = currentNudges ? `Current nudge cards: ${JSON.stringify(currentNudges)}` : null;
        const dataLabel = currentData && Object.keys(currentData).length ? `Current data overrides: ${JSON.stringify(currentData)}` : null;
        const contextPrefix = [
          screenLabel,
          nudgesLabel,
          dataLabel,
          `Current features: ${JSON.stringify(currentFeatures ?? {}, null, 2)}`,
          `Current token overrides: ${JSON.stringify(currentTokens ?? {}, null, 2)}`,
          '',
        ].filter(Boolean).join('\n');

        if (typeof m.content === 'string') {
          return { role: 'user', content: contextPrefix + m.content };
        }
        // Array content (may include images)
        const textIdx = m.content.findIndex(c => c.type === 'text');
        if (textIdx >= 0) {
          const content = [...m.content];
          content[textIdx] = { ...content[textIdx], text: contextPrefix + content[textIdx].text };
          return { role: 'user', content };
        }
        // No text block found — append one
        return { role: 'user', content: [...m.content, { type: 'text', text: contextPrefix }] };
      }
      return m;
    });
  } else if (prompt) {
    // Legacy single-turn format
    const userMessage = [
      currentScreen ? `Active screen: ${currentScreen}` : null,
      `Current features: ${JSON.stringify(currentFeatures ?? {}, null, 2)}`,
      `Current token overrides: ${JSON.stringify(currentTokens ?? {}, null, 2)}`,
      `Request: ${prompt}`,
    ].filter(Boolean).join('\n\n');
    apiMessages = [{ role: 'user', content: userMessage }];
  } else {
    return new Response(JSON.stringify({ error: 'messages or prompt is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const systemPrompt = isBuild ? SYSTEM_BUILD : SYSTEM_PLAN;

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: systemPrompt,
      messages: apiMessages,
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return new Response(JSON.stringify({ error: err.error?.message || 'Upstream API error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await upstream.json();
  let text = data.content?.[0]?.text ?? '';

  // Plan mode — return plain text
  if (!isBuild) {
    return new Response(JSON.stringify({ message: text || 'No response.' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Build mode — parse JSON response
  if (!text) text = '{}';

  // Strip markdown code fences if Claude wrapped the JSON (e.g. ```json ... ```)
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();

  try {
    const parsed = JSON.parse(text);
    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    // Last resort: try to extract a JSON object from anywhere in the text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        return new Response(JSON.stringify(parsed), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch {}
    }
    return new Response(JSON.stringify({ message: text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
