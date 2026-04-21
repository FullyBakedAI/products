"use client";

import Image from "next/image";
import type { Trip, ChecklistItem } from "@/lib/types";
import styles from "./DayNav.module.css";

interface Props {
  trip: Trip;
  activeDay: string;
  onDayChange: (dayId: string) => void;
  checklistDone: string[];
  onChecklistToggle: (itemId: string) => void;
}

export default function DayNav({
  trip,
  activeDay,
  onDayChange,
  checklistDone,
  onChecklistToggle,
}: Props) {
  const doneCount = checklistDone.length;
  const totalCount = trip.checklist.length;

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, dayId: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onDayChange(dayId);
    }
  }

  return (
    <nav className={styles.nav} role="navigation" aria-label="Day navigation">
      {/* Logo + trip header */}
      <div className={styles.header}>
        <Image
          src="/logo-white.svg"
          alt="Kite"
          width={80}
          height={32}
          className={styles.logo}
          priority
        />
        <div className={styles.tripName}>{trip.name}</div>
        <div className={styles.tripDates}>{trip.dates}</div>
      </div>

      {/* Day tabs */}
      <div className={styles.tabs} role="tablist" aria-label="Days">
        {trip.days.map((day) => {
          const isActive = day.id === activeDay;
          const stopCount = day.stops.filter((s) => s.type !== "drive").length;
          return (
            <button
              key={day.id}
              role="tab"
              aria-selected={isActive}
              aria-controls="main-panel"
              className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
              onClick={() => onDayChange(day.id)}
              onKeyDown={(e) => handleKeyDown(e, day.id)}
            >
              <div className={`${styles.tabBadge} ${isActive ? styles.tabBadgeActive : ""}`}>
                {day.num ?? ""}
              </div>
              <div className={styles.tabInfo}>
                <div className={styles.tabLabel}>{day.label}</div>
                <div className={styles.tabSub}>{day.sub}</div>
                {stopCount > 0 && (
                  <div className={styles.tabCount}>
                    {stopCount} stop{stopCount !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Checklist */}
      {trip.checklist.length > 0 && (
        <div className={styles.checklist}>
          <div className={styles.checklistHeader}>
            <span>Checklist</span>
            <span className={`${styles.checklistBadge} ${doneCount === totalCount ? styles.checklistBadgeDone : ""}`}>
              {doneCount}/{totalCount}
            </span>
          </div>
          <ul className={styles.checklistItems} role="list">
            {trip.checklist.map((item: ChecklistItem) => {
              const done = checklistDone.includes(item.id);
              return (
                <li key={item.id} role="listitem" className={styles.checklistItem}>
                  <button
                    className={`${styles.checklistBtn} ${done ? styles.checklistBtnDone : ""}`}
                    onClick={() => onChecklistToggle(item.id)}
                    aria-label={`${done ? "Unmark" : "Mark"} "${item.text}" as done`}
                  >
                    <span className={styles.checklistTick}>{done ? "✓" : ""}</span>
                    <span className={styles.checklistText}>
                      <span className={styles.checklistMain}>{item.text}</span>
                      {item.sub && <span className={styles.checklistSub}>{item.sub}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
