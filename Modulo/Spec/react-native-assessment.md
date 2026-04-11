# React Native Migration Assessment

Honest complexity assessment for moving from the React web prototype to a production React Native build.

---

## Summary

The React web prototype shares significant business logic with a future React Native build, but the rendering layer must be rewritten entirely. This is not a port — it is a new build that reuses the logic. The right architecture separates concerns now so the reuse is clean when the time comes.

---

## What Can Be Shared (Web → Native)

These artifacts survive the platform switch with minimal or no changes:

- **Business logic hooks** (`useSwap`, `useBalance`, etc.) — if extracted now from Contexts into platform-agnostic files
- **Token values as JS constants** — not CSS vars (those are DOM-only); export the same values as a JS object consumed by both platforms
- **Component API contracts** — prop shapes and interfaces can be identical even if the implementations differ
- **Brand config / ThemeProvider concept** — the theme config object itself is plain JS and works on both platforms
- **State management** — Contexts or Zustand work in React Native
- **Animation choreography logic** — the timing, sequencing, and spring configs (not the implementation, which differs)
- **Type definitions** — shared TypeScript interfaces across platforms
- **Asset SVGs** — via `react-native-svg`

---

## What Must Be Rewritten

| Web | React Native | Reason |
|-----|-------------|--------|
| React ARIA | React Native Accessibility API (`accessibilityRole`, `accessibilityLabel`, etc.) | ARIA attributes are DOM-only; they have no meaning in native |
| CSS | React Native `StyleSheet` | No cascade, no pseudo-classes, no CSS custom properties; layout via flexbox only |
| Framer Motion | React Native Reanimated 3 | Different API entirely; gesture handling via `react-native-gesture-handler` |
| React Router | React Navigation | Completely different paradigm — stack/tab/drawer navigators, not URL routing |
| `env(safe-area-inset-*)` | `react-native-safe-area-context` | No CSS environment variables in native |
| `vh` / `dvh` / `vw` units | `Dimensions` API | No viewport units in native |
| CSS grid | Manual flex layout | No grid in React Native |
| `:active` / `:hover` states | `Pressable` component's pressed state | No pseudo-classes; Pressable provides `pressed` boolean |
| Web-specific APIs | — | `IntersectionObserver`, `requestAnimationFrame` (different behaviour), SVG filters — none available in RN |

---

## Recommended Architecture for RN Readiness

Monorepo structure that supports both platforms cleanly:

```
modulo/
├── packages/
│   ├── hooks/           ← shared business logic (platform-agnostic)
│   ├── tokens/          ← design tokens as JS (consumed by both platforms)
│   └── types/           ← shared TypeScript interfaces
├── apps/
│   ├── web/             ← current React app
│   └── native/          ← future React Native app
```

This structure means the web app and native app both import from `packages/hooks` and `packages/tokens`. Business logic lives once. Rendering lives separately.

---

## Effort Estimate

| Work | Estimate |
|------|---------|
| Architecture setup (monorepo, shared packages) | 3–5 days |
| Extract business logic to platform-agnostic hooks | 1 week |
| Token system as JS constants (parallel to CSS vars) | 2–3 days |
| 18 screens × ~3–4 days each (RN layout + Reanimated + navigation) | 8–10 weeks |
| Navigation setup (React Navigation) | 3–4 days |
| Animation system (Reanimated 3, establishing patterns) | 1 week |
| Accessibility audit (RN accessibility model) | 1 week |

**Total realistic estimate: 12–14 weeks for production-quality native build**

**With shared hooks extracted from web first: 9–11 weeks**

**With Expo (recommended): saves 1–2 weeks on toolchain setup**

---

## Recommendation

Three-stage plan:

### 1. NOW — Build web with RN in mind
- Extract hooks from Contexts into standalone files (no DOM dependencies)
- Export design tokens as JS constants alongside CSS vars — both representations, from one source
- Keep component prop APIs clean and semantic
- Do not couple business logic to React Router or DOM APIs

### 2. NEXT — After web is done: monorepo restructure
Timeline: ~2 weeks. Move `hooks/` and `tokens/` to shared packages. Verify web app still works importing from the new locations. This is the step that makes the reuse real.

### 3. FUTURE — Native build
Timeline: 9–11 weeks with Expo + React Native Reanimated 3 + shared hooks.

---

**Do NOT attempt to use `react-native-web` to share the React ARIA components.** It creates more problems than it solves. The rendering layers are too different — React ARIA is built for DOM accessibility semantics, react-native-web shims are incomplete, and the result is neither good web nor good native. Shared logic, separate rendering is the correct architecture.

---

## Risk Factors

- **Animation complexity** — Modulo has sophisticated spring animations. Reanimated 3 can match them but requires expertise and non-trivial porting effort per interaction.
- **Gesture system** — The swipeable token rows are firmly in `react-native-gesture-handler` territory. Doable, but complex to get right on both iOS and Android.
- **Safe area handling** — Multiple device form factors (notch, Dynamic Island, Android chin) require careful testing on real devices, not just simulators.
- **Performance** — Flat lists with many token rows need `FlatList` with `keyExtractor` and `getItemLayout` optimisation. A simple `.map()` that works fine on web will cause jank in native.
