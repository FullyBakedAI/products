# Batch F — Component Extraction (shared CSS base classes)
**Source:** QA Sprint QA-001, Wave 2  
**Files:** shared.css, home.css, explore.css, asset.css, actions.css, HomeScreen.jsx, ExploreScreen.jsx  
**Instruction:** Extract shared base CSS classes. Read all files first. Do not rename component-specific classes. Build must pass.

NOTE: This batch is about adding base classes and migrating existing patterns. It does NOT restructure JSX — just CSS.

---

## MOD-058 — 5 pill button variants with duplicated CSS → .pill base class

**File:** `src/shared.css` — add the pill base class:
```css
.pill {
  height: var(--pill-h, 34px);
  border-radius: 9999px;
  padding: 0 var(--pill-px, 14px);
  font-size: 13px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  transition: background 0.15s, color 0.15s;
}
```

Find the 5 pill variants in the CSS files (time period pills, chain pills, tab pills, sort pills, filter pills). For each:
1. Add `pill` to the class that already has the pill-specific class (e.g., `class="time-pill pill"`) — but don't edit JSX unless absolutely necessary.
2. In the CSS: remove duplicate properties that are now handled by `.pill` (height, border-radius, padding, font-size, font-weight, display, align-items). Keep only variant-specific properties (background, color, active state).

If a pill class has its own height, border-radius etc., remove the duplicate declarations since `.pill` provides them. Add a `--pill-h` or `--pill-px` override if the variant needs different dimensions.

---

## MOD-057 — 4 separate icon+label+value+action row patterns → .list-row (XL)

**File:** `src/shared.css` — add the list-row base class:
```css
.list-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.list-row-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-row-label {
  flex: 1;
  min-width: 0;
}

.list-row-label-primary {
  font-size: 15px;
  font-weight: 500;
  color: var(--bk-text-primary);
}

.list-row-label-secondary {
  font-size: 13px;
  color: var(--bk-text-muted);
  margin-top: 1px;
}

.list-row-value {
  text-align: right;
  flex-shrink: 0;
}

.list-row-value-primary {
  font-size: 15px;
  font-weight: 500;
  color: var(--bk-text-primary);
}

.list-row-value-secondary {
  font-size: 12px;
  color: var(--bk-text-muted);
  margin-top: 1px;
}

.list-row-chevron {
  width: 16px;
  flex-shrink: 0;
  color: var(--bk-text-muted);
}
```

Add modifier classes:
```css
.list-row--token { padding: 14px 0; }
.list-row--opportunity { padding: 12px 0; }
.list-row--compact { padding: 8px 0; gap: 10px; }
.list-row--compact .list-row-icon { width: 28px; height: 28px; }
```

Do NOT refactor existing JSX to use these classes. Just add them to shared.css so they're available. The migration of existing rows to use these classes is incremental work.

---

## MOD-081 — Empty state divs inline-styled → .empty-state

**File:** `src/shared.css` — add:
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 12px;
  text-align: center;
}

.empty-state-icon {
  width: 48px;
  height: 48px;
  opacity: 0.4;
}

.empty-state-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--bk-text-primary);
}

.empty-state-message {
  font-size: 14px;
  color: var(--bk-text-muted);
  max-width: 240px;
}
```

**Files:** `src/HomeScreen.jsx`, `src/ExploreScreen.jsx` — find empty state divs that use inline styles (typically `style={{ textAlign: 'center', padding: '48px 24px', ... }}`). Replace inline styles with the `.empty-state` class and its children classes. 

Only migrate inline-styled empty states — don't touch empty states that already use class-based styling.

---

After all changes: run `npm run build` to confirm zero errors.
