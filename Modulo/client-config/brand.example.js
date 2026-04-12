// ── Brand Configuration Example ──────────────────────────────────────────────
// Copy this file to src/theme/BrandConfig.jsx (or import it there)
// Replace the values below with your brand details.
//
// logoSrc    — import your SVG or PNG from src/assets/ and reference it here
// logoAlt    — screen reader text for the logo; use your company name
// logoWidth  — display width in pixels (the logo renders at this size)
// logoHeight — display height in pixels (keep aspect ratio from your source file)
// brandName  — used in page titles, aria labels, and any text references

import yourLogo from '../React/src/assets/your-logo.svg'; // update this path

export const clientBrandConfig = {
  logoSrc:    yourLogo,
  logoAlt:    'Your Brand Name',
  logoWidth:  120,   // adjust to match your logo's proportions
  logoHeight: 24,    // adjust to match your logo's proportions
  brandName:  'Your Brand',
};
