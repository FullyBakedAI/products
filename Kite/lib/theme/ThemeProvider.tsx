"use client";

import { useEffect } from "react";
import type { KiteTheme } from "@/lib/types";

interface Props {
  theme: KiteTheme;
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: Props) {
  useEffect(() => {
    const cssVars = `
      --bk-brand-primary: ${theme.primaryColor};
      --bk-brand-strong: ${theme.primaryStrong};
      --bk-brand-subtle: ${theme.primarySubtle};
      --bk-brand-gradient: linear-gradient(135deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%);

      --bk-bg-base: ${theme.bgBase};
      --bk-bg-card: ${theme.bgCard};
      --bk-bg-card-alt: ${theme.bgCardAlt};
      --bk-bg-sidebar: ${theme.bgSidebar};
      --bk-bg-sidebar-hover: ${theme.bgSidebarHover};
      --bk-bg-sidebar-active: ${theme.bgSidebarActive};
      --bk-bg-nav: ${theme.bgNav};
      --bk-bg-elevated: ${theme.bgElevated};
      --bk-bg-outer: ${theme.bgOuter};
      --bk-bg-sunken: ${theme.bgSunken};

      --bk-text-primary: ${theme.textPrimary};
      --bk-text-secondary: ${theme.textSecondary};
      --bk-text-muted: ${theme.textMuted};
      --bk-text-placeholder: ${theme.textPlaceholder};
      --bk-text-on-dark: ${theme.textOnDark};

      --bk-border-subtle: ${theme.borderSubtle};
      --bk-border-card: ${theme.borderCard};
      --bk-border-pill: ${theme.borderPill};
      --bk-border-active: ${theme.borderActive};
      --bk-border-row: ${theme.borderRow};

      --bk-success: ${theme.success};
      --bk-success-soft: ${theme.successSoft};
      --bk-error: ${theme.error};
      --bk-error-soft: ${theme.errorSoft};
      --bk-warning: ${theme.warning};
      --bk-warning-soft: ${theme.warningSoft};
      --bk-gold: ${theme.gold};
      --bk-overlay: ${theme.overlay};

      --bk-font: ${theme.fontFamily};
      --bk-font-display: ${theme.fontDisplay};

      --bk-radius-xs: 4px;
      --bk-radius-sm: 6px;
      --bk-radius-md: 12px;
      --bk-radius-lg: 20px;
      --bk-radius-xl: 28px;
      --bk-radius-pill: 9999px;

      --bk-shadow-sm: 0 1px 2px rgba(42, 24, 46, 0.06);
      --bk-shadow-md: 0 4px 16px rgba(42, 24, 46, 0.08);
      --bk-shadow-lg: 0 12px 40px rgba(42, 24, 46, 0.12);

      --bk-dur-fast: 150ms;
      --bk-dur-base: 250ms;
      --bk-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    `.trim();

    const styleId = "bakekit-theme";
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }
    el.textContent = `:root { ${cssVars} }`;

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [theme]);

  return <>{children}</>;
}
