"use client";

import type { Trip, AppState } from "@/lib/types";
import styles from "./TripShell.module.css";

interface Props {
  trip: Trip;
  activeDay: string;
  state: AppState;
  onDayChange: (dayId: string) => void;
  onStateChange: (state: AppState) => void;
  sidebar: React.ReactNode;
  main: React.ReactNode;
  timeline: React.ReactNode;
  mobileTab?: "itinerary" | "timeline";
  onMobileTabChange?: (tab: "itinerary" | "timeline") => void;
}

export default function TripShell({
  trip,
  activeDay,
  onDayChange,
  sidebar,
  main,
  timeline,
  mobileTab = "itinerary",
  onMobileTabChange,
}: Props) {
  return (
    <div className={styles.shell}>
      {/* Desktop sidebar */}
      <aside className={styles.sidebar} role="complementary" aria-label="Day navigation">
        {sidebar}
      </aside>

      {/* Mobile: horizontal day picker / sticky strip (hidden on desktop) */}
      <div className={styles.mobileDayScroller} role="tablist" aria-label="Day navigation">
        {trip.days.map((day) => {
          const isActive = day.id === activeDay;
          return (
            <button
              key={day.id}
              role="tab"
              aria-selected={isActive}
              className={`${styles.mobileDayTab} ${isActive ? styles.mobileDayTabActive : ""}`}
              onClick={() => onDayChange(day.id)}
            >
              <span className={styles.mobileDayLabel}>{day.label}</span>
              {day.sub && <span className={styles.mobileDaySub}>{day.sub}</span>}
            </button>
          );
        })}
      </div>

      {/* Main content panel */}
      <main className={styles.main} role="main" aria-live="polite">
        {/* Itinerary — hidden on mobile when timeline tab active */}
        <div className={`${styles.mainInner} ${mobileTab === "timeline" ? styles.mobileHidden : ""}`}>
          {main}
        </div>
        {/* Timeline panel — mobile only, shown when timeline tab active */}
        <div className={`${styles.mobileTimelinePanel} ${mobileTab !== "timeline" ? styles.mobileHiddenPanel : ""}`}>
          {timeline}
        </div>
      </main>

      {/* Desktop timeline sidebar */}
      <aside className={styles.timeline} role="complementary" aria-label="Day timeline">
        {timeline}
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className={styles.mobileNav} role="tablist" aria-label="View">
        <button
          role="tab"
          aria-selected={mobileTab === "itinerary"}
          className={`${styles.mobileTab} ${mobileTab === "itinerary" ? styles.mobileTabActive : ""}`}
          onClick={() => onMobileTabChange?.("itinerary")}
        >
          <i className="ph-fill ph-list" aria-hidden="true" />
          Itinerary
        </button>
        <button
          role="tab"
          aria-selected={mobileTab === "timeline"}
          className={`${styles.mobileTab} ${mobileTab === "timeline" ? styles.mobileTabActive : ""}`}
          onClick={() => onMobileTabChange?.("timeline")}
        >
          <i className="ph-fill ph-clock" aria-hidden="true" />
          Timeline
        </button>
      </nav>
    </div>
  );
}
