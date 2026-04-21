"use client";

import type { Stop, StopCustomisation } from "@/lib/types";
import styles from "./StopTimeline.module.css";

interface Props {
  day: { id: string; label: string; sub: string; stops: Stop[] };
  activeStopIdx: number | null;
  customisations: Record<string, StopCustomisation>;
  onStopClick: (idx: number) => void;
}

export default function StopTimeline({ day, activeStopIdx, customisations, onStopClick }: Props) {
  const visibleStops = day.stops.filter((s) => s.type !== "drive");
  const totalStops = visibleStops.length;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.dayLabel}>{day.label}</div>
        <div className={styles.dayTitle}>{day.sub}</div>
        <div className={styles.stopCount}>{totalStops} stop{totalStops !== 1 ? "s" : ""}</div>
      </div>

      <ul className={styles.list} role="list" aria-label="Day stops">
        {day.stops.map((stop, idx) => {
          if (stop.type === "drive") {
            return (
              <li key={idx} role="listitem" className={styles.driveRow}>
                <div className={styles.driveContent}>
                  <i className="ph-fill ph-road-horizon" aria-hidden="true" />
                  <span>{stop.driveText}</span>
                </div>
              </li>
            );
          }

          const stopId = `${day.id}-${idx}`;
          const custom = customisations[stopId] ?? {};
          const selectedChoice = custom.selectedChoice;
          const journalPhotos = custom.journalPhotos ?? [];
          const thumbSrc = journalPhotos[0]?.dataUrl ?? stop.photo;
          const isActive = activeStopIdx === idx;

          return (
            <li key={idx} role="listitem" aria-current={isActive ? "true" : undefined}>
              <button
                className={`${styles.row} ${isActive ? styles.rowActive : ""}`}
                onClick={() => onStopClick(idx)}
                aria-label={stop.name}
              >
                <div className={styles.iconCol}>
                  <div className={`${styles.iconCircle} ${isActive ? styles.iconCircleActive : ""}`}>
                    {stop.icon ? (
                      <i className={`ph-fill ${stop.icon}`} aria-hidden="true" />
                    ) : (
                      <i className="ph-fill ph-map-pin" aria-hidden="true" />
                    )}
                  </div>
                  {idx < day.stops.length - 1 && (
                    <div className={styles.connector} aria-hidden="true" />
                  )}
                </div>

                <div className={styles.info}>
                  {stop.time && (
                    <div className={styles.time}>{stop.time}</div>
                  )}
                  <div className={styles.name}>{stop.name}</div>
                  {stop.loc && <div className={styles.loc}>{stop.loc}</div>}
                  {selectedChoice && (
                    <div className={styles.choiceBadge}>✓ {selectedChoice}</div>
                  )}
                </div>

                {thumbSrc && !isActive && (
                  <div className={styles.thumb}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbSrc} alt={stop.name} loading="lazy" />
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
