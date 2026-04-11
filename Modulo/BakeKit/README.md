# BakeKit — Modulo Component Library

## What This Is

BakeKit/Modulo is the white-label React ARIA component library extracted from the Modulo DeFi prototype. It is the primary deliverable of this engagement — the Modulo product is built on top of it, but the components themselves are brand-agnostic.

---

## Architecture

- Built on React ARIA Components (Adobe) for accessibility
- Themed via CSS custom properties (`--bk-*` prefix)
- BrandProvider accepts a theme config object and applies all tokens
- Zero hardcoded brand values in any component
- WCAG 2.1 AA compliant by construction — React ARIA handles ARIA attributes, keyboard navigation, and focus management

---

## Usage

```jsx
import { BrandProvider } from './theme/ThemeProvider';
import { moduloTheme } from './theme/modulo-theme';

<BrandProvider theme={moduloTheme}>
  <App />
</BrandProvider>
```

---

## Rebranding

Create a new theme config:

```js
export const myBrandTheme = {
  brandName: 'MyWallet',
  primaryColor: '#FF6B35',
  // ... all token values
};
```

Pass it to BrandProvider. The entire product rebrands.

---

## Component List

Will be populated as components are extracted — see `Spec/full-build-spec.md` for the full extraction plan.

---

## Methodology Note

This component library was built as part of the Fully Baked methodology — a framework for delivering AI-first digital products. The methodology turns every build artifact into reusable IP. This library is an example of "selling the exhaust" — the client gets the product, BakedUX retains the reusable component architecture.

See [fullybaked.ai](https://fullybaked.ai) for the full methodology.
