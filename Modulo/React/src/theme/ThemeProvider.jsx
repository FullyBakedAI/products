/**
 * BrandProvider — White-Label Theme System
 *
 * Accepts a theme config object and injects all --bk-* CSS custom properties
 * at the document root via a style tag. This makes the entire product skinnable
 * by swapping the theme config.
 *
 * Usage:
 * ```jsx
 * import { BrandProvider } from './theme/ThemeProvider';
 * import moduloTheme from './theme/modulo-theme';
 *
 * <BrandProvider theme={moduloTheme}>
 *   <App />
 * </BrandProvider>
 * ```
 */

import { useEffect } from 'react';

/**
 * @param {Object} props
 * @param {import('./theme-types').BakeKitTheme} props.theme - Theme configuration
 * @param {React.ReactNode} props.children
 */
export function BrandProvider({ theme, children }) {
  useEffect(() => {
    if (!theme) return;

    // Map theme config to CSS custom properties
    const cssVars = `
      --bk-brand-primary: ${theme.primaryColor};
      --bk-brand-gradient: linear-gradient(135deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%);
      --bk-brand-dim: ${theme.primaryColor.replace('#', 'rgba(') + ', 0.15)'};

      --bk-bg-base: ${theme.bgBase};
      --bk-bg-card: ${theme.bgCard};
      --bk-bg-card-alt: ${theme.bgCardAlt};
      --bk-bg-nav: ${theme.bgNav};
      --bk-bg-elevated: ${theme.bgElevated};
      --bk-bg-outer: ${theme.bgOuter};

      --bk-text-primary: ${theme.textPrimary};
      --bk-text-secondary: ${theme.textSecondary};
      --bk-text-muted: ${theme.textMuted};
      --bk-text-placeholder: ${theme.textPlaceholder};

      --bk-border-subtle: ${theme.borderSubtle};
      --bk-border-card: ${theme.borderCard};
      --bk-border-pill: ${theme.borderPill};
      --bk-border-active: ${theme.borderActive};
      --bk-border-search: ${theme.borderSearch};
      --bk-border-row: ${theme.borderRow};

      --bk-success: ${theme.success};
      --bk-error: ${theme.error};
      --bk-warning: ${theme.warning};

      --bk-status-bar-dim: ${theme.statusBarDim};
      --bk-pill-bg: ${theme.pillBg};
      --bk-earn-card-bg: ${theme.earnCardBg};
      --bk-earn-card-border: ${theme.earnCardBorder};

      --bk-font: ${theme.fontFamily};
    `.trim();

    // Inject style tag at document root
    const styleId = 'bakekit-theme';
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `:root { ${cssVars} }`;

    // Cleanup on unmount
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [theme]);

  return children;
}
