/**
 * ScreenHeader — White-Label Component
 *
 * Standardized top navigation bar with back/close buttons and title.
 * Consolidates the header pattern used across 10+ screens.
 *
 * Props:
 * - title: string — Header text
 * - titleIcon: ReactNode (optional) — Icon to show next to title
 * - onBack: function (optional) — Back button handler; renders back chevron
 * - onClose: function (optional) — Close button handler; renders X button
 * - rightSlot: ReactNode (optional) — Custom right-side content (e.g., settings button)
 * - transparent: boolean (optional) — Removes border for hero/overlay screens
 *
 * React ARIA: Button with onPress for back/close actions
 */

import { Button } from 'react-aria-components';
import './styles.css';

// Inline SVGs — no Lucide dependency in components/
const IconBack = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export function ScreenHeader({
  title,
  titleIcon,
  onBack,
  onClose,
  rightSlot,
  transparent = false,
}) {
  return (
    <div className={`screen-header${transparent ? ' transparent' : ''}`}>
      <div className="screen-header-left">
        {onBack && (
          <Button className="header-back-btn" aria-label="Go back" onPress={onBack}>
            <IconBack />
          </Button>
        )}
        {onClose && (
          <Button className="header-close-btn" aria-label="Close" onPress={onClose}>
            <IconClose />
          </Button>
        )}
        {titleIcon && <span className="header-title-icon">{titleIcon}</span>}
        <h1 className="header-title">{title}</h1>
      </div>
      {rightSlot && <div className="header-right">{rightSlot}</div>}
    </div>
  );
}
