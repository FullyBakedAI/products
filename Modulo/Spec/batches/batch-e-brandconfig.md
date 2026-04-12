# Batch E — BrandConfig Context + White-Label (MOD-053, 054, 056)
**Source:** QA Sprint QA-001, Wave 2  
**Priority:** P1/P2 White-Label blockers  
**Files:** New `src/theme/BrandConfig.jsx`, `src/tokens.css`, `src/HomeScreen.jsx`, `src/shared.css` + all JSX with `.modulo-badge`  
**Instruction:** Implement BrandConfig context, use it for logo and brand name, rename .modulo-badge. Read all affected files before editing. Build must pass.

---

## MOD-053 — BrandConfig context (L ticket — do this first)

### Step 1: Create `src/theme/BrandConfig.jsx`

```jsx
import { createContext, useContext } from 'react';
import logoModulo from '../assets/logo-modulo.svg'; // existing logo import

const defaultConfig = {
  logoSrc: logoModulo,
  logoAlt: 'Modulo',
  logoWidth: 93,
  logoHeight: 18,
  brandName: 'Modulo',
};

const BrandConfigContext = createContext(defaultConfig);

export function BrandConfigProvider({ config = defaultConfig, children }) {
  return (
    <BrandConfigContext.Provider value={{ ...defaultConfig, ...config }}>
      {children}
    </BrandConfigContext.Provider>
  );
}

export function useBrandConfig() {
  return useContext(BrandConfigContext);
}
```

### Step 2: Wrap the app in `App.jsx`

In `src/App.jsx`, import `BrandConfigProvider` and wrap the router/app tree:
```jsx
import { BrandConfigProvider } from './theme/BrandConfig';
// ...
return (
  <BrandConfigProvider>
    {/* existing app content */}
  </BrandConfigProvider>
);
```

### Step 3: Update `src/tokens.css`

Add to `:root`:
```
--bk-logo-width: 93px;
--bk-logo-height: 18px;
```

### Step 4: Update `src/HomeScreen.jsx`

Replace the hardcoded logo:
```jsx
// Remove: import logoModulo from './assets/logo-modulo.svg';
// Add:
import { useBrandConfig } from './theme/BrandConfig';
// In component:
const { logoSrc, logoAlt, logoWidth, logoHeight } = useBrandConfig();
// In JSX, replace hardcoded logo img:
<img src={logoSrc} alt={logoAlt} width={logoWidth} height={logoHeight} />
```

Zero behaviour change — same logo, same dimensions, now configurable.

---

## MOD-054 — Brand name hardcoded in aria-labels (depends on MOD-053)

After BrandConfig is in place, grep all JSX files for hardcoded `"Modulo"` strings in `aria-label` attributes.

In each file that has hardcoded `aria-label="Modulo ..."`:
1. Import `useBrandConfig` from `./theme/BrandConfig` (adjust path as needed)
2. Destructure `brandName` from the hook
3. Replace `"Modulo logo"` → `` `${brandName} logo` ``
4. Replace `"Open Modulo notifications"` → `` `Open ${brandName} notifications` ``
5. Any other `"Modulo [thing]"` patterns → template literals

Common locations: HomeScreen.jsx (logo aria-label, notifications button), SidebarNav.jsx, possibly SettingsScreen.jsx.

Do NOT change user-visible text labels (only aria-labels and alt text).

---

## MOD-056 — .modulo-badge class name bakes product name into CSS

**File:** `src/shared.css` — rename `.modulo-badge` → `.brand-badge`

**All JSX files** — find any `className` with `modulo-badge` and change to `brand-badge`.

**Import rename** — if there's an `iconModuloBadge` import in any JSX file, rename the import variable to `iconBrandBadge`. Do not change the actual file being imported (the SVG filename can stay — only the import variable changes for now).

The SVG source should ideally come from BrandConfig context, but for this ticket just rename the class and import variable. Full BrandConfig integration of the badge SVG is a follow-up.

---

After all changes: run `npm run build` to confirm zero errors.
