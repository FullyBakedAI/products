/**
 * AppButton — White-Label Component
 *
 * Primary button component wrapping React ARIA Button.
 * Consolidates .primary-btn, .action-btn, .icon-btn, .close-btn-shared patterns.
 *
 * Props:
 * - variant: 'primary' | 'action' | 'icon' | 'close' (default: 'primary')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - onPress: function — React ARIA press handler
 * - isDisabled: boolean (optional)
 * - children: ReactNode
 * - className: string (optional) — Additional CSS classes
 * - aria-label: string — Required when no visible text (icon-only buttons)
 *
 * React ARIA: Button primitive with onPress
 */

import { Button } from 'react-aria-components';
import './styles.css';

export function AppButton({
  variant = 'primary',
  size = 'md',
  onPress,
  isDisabled,
  children,
  className = '',
  ...props
}) {
  const classNames = [
    'app-button',
    `app-button-${variant}`,
    `app-button-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Button
      className={classNames}
      onPress={onPress}
      isDisabled={isDisabled}
      {...props}
    >
      {children}
    </Button>
  );
}
