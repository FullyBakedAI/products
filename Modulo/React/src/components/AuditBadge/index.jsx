/**
 * AuditBadge — Protocol audit status pill
 *
 * Small inline badge showing audit status.
 * Tapping opens a bottom sheet with audit details.
 *
 * Props:
 * - protocolName: string — e.g. "Aave v3"
 * - firm: string — audit firm name
 * - year: number — audit year
 * - tvl: string — e.g. "$12.4B"
 * - reportUrl: string — link placeholder
 * - summary: string — short summary text
 * - inline: boolean — render as inline element (default: false)
 */

import { useState } from 'react';
import { Button } from 'react-aria-components';
import { BottomSheet } from '../BottomSheet';
import './styles.css';

const IconCheck = () => (
  <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M4 10L8 14L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function AuditBadge({
  protocolName,
  firm,
  year,
  tvl,
  reportUrl,
  summary,
  inline = false,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  if (!firm) return null;

  return (
    <>
      <Button
        className={`audit-badge-pill${inline ? ' audit-badge-pill--inline' : ''}`}
        onPress={() => setSheetOpen(true)}
        aria-label={`Audited by ${firm} in ${year}. Tap for details.`}
      >
        <span className="audit-badge-icon"><IconCheck /></span>
        <span className="audit-badge-text">Audited — {firm} {year}</span>
      </Button>

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
        <div className="audit-badge-sheet-content">
          <div className="audit-badge-sheet-header">
            <div className="audit-badge-sheet-icon-wrap">
              <IconCheck />
            </div>
            <div>
              <h2 className="audit-badge-sheet-title">{protocolName}</h2>
              <p className="audit-badge-sheet-subtitle">Security Audit — {firm} {year}</p>
            </div>
          </div>

          {tvl && (
            <div className="audit-badge-sheet-stat">
              <span className="audit-badge-sheet-stat-label">Total Value Locked</span>
              <span className="audit-badge-sheet-stat-value">{tvl}</span>
            </div>
          )}

          {summary && (
            <div className="audit-badge-sheet-summary">
              <p className="audit-badge-sheet-summary-text">{summary}</p>
            </div>
          )}

          <a
            className="audit-badge-sheet-link"
            href={reportUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View full audit report by ${firm} (opens in new tab)`}
          >
            View full report ↗
          </a>

          <Button className="primary-btn" onPress={() => setSheetOpen(false)} aria-label="Close audit details">
            Close
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
