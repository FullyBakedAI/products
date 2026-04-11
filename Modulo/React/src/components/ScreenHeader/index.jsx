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
import { ChevronLeft, X } from 'lucide-react';
import './styles.css';

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
      <div className="header-left">
        {onBack && (
          <Button className="header-back-btn" aria-label="Go back" onPress={onBack}>
            <ChevronLeft
              size={20}
              color="var(--bk-text-primary)"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Button>
        )}
        {onClose && (
          <Button className="header-close-btn" aria-label="Close" onPress={onClose}>
            <X
              size={20}
              color="var(--bk-text-muted)"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Button>
        )}
        {titleIcon && <span className="header-title-icon">{titleIcon}</span>}
        <h1 className="header-title">{title}</h1>
      </div>
      {rightSlot && <div className="header-right">{rightSlot}</div>}
    </div>
  );
}
