/**
 * StatusCard — White-Label Component
 *
 * Card displaying a transaction or operation status.
 * Shows an optional status icon + title + subtitle + key-value detail rows.
 * Used for success, pending, and error states.
 *
 * Props:
 * - status: 'success' | 'pending' | 'error' (optional) — determines icon + accent colour
 * - title: string (optional) — heading text
 * - subtitle: string (optional) — supporting text below title
 * - details: Array<{ label: string, value: string }> (optional) — key-value rows
 *
 * All props are optional — components gracefully omit empty sections.
 * Token deps: --bk-bg-card, --bk-border-card, --bk-border-subtle, --bk-text-primary,
 *             --bk-text-muted, --bk-text-secondary, --bk-success, --bk-error, --bk-font
 */

import './styles.css';

function SuccessIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="var(--bk-success)" strokeWidth="1.5" />
      <path
        d="M7 12l3.5 3.5L17 8.5"
        stroke="var(--bk-success)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="var(--bk-text-muted)" strokeWidth="1.5" />
      <path
        d="M12 7v5l3 3"
        stroke="var(--bk-text-muted)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="var(--bk-error)" strokeWidth="1.5" />
      <path
        d="M15 9L9 15M9 9l6 6"
        stroke="var(--bk-error)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const STATUS_ICONS = {
  success: SuccessIcon,
  pending: PendingIcon,
  error: ErrorIcon,
};

export function StatusCard({ status, title, subtitle, details = [] }) {
  const Icon = status ? STATUS_ICONS[status] : null;
  const hasHeader = Icon || title || subtitle;

  return (
    <div className="status-card" data-status={status || undefined}>
      {hasHeader && (
        <div className="status-card-header">
          {Icon && (
            <div className="status-card-icon">
              <Icon />
            </div>
          )}
          {title && <div className="status-card-title">{title}</div>}
          {subtitle && <div className="status-card-subtitle">{subtitle}</div>}
        </div>
      )}
      {details.length > 0 && (
        <div className="status-card-details">
          {details.map(({ label, value }) => (
            <div key={label} className="status-card-detail-row">
              <span className="status-card-detail-label">{label}</span>
              <span className="status-card-detail-value">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
