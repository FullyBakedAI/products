"use client";

import { useState, useEffect, useCallback } from "react";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { kiteTheme } from "@/lib/theme/kite-theme";
import { sfTrip } from "@/lib/data/sf-trip";
import { loadState, saveState, patchCustomStop, toggleChecklist } from "@/lib/storage";
import type { AppState } from "@/lib/types";
import TripShell from "@/components/TripShell/TripShell";
import DayNav from "@/components/DayNav/DayNav";
import DayHero from "@/components/DayHero/DayHero";
import StopCard from "@/components/StopCard/StopCard";
import StopTimeline from "@/components/StopTimeline/StopTimeline";
import DriveSegment from "@/components/DriveSegment/DriveSegment";
import styles from "./trip.module.css";

const trip = sfTrip;

export default function TripPage() {
  const [activeDay, setActiveDay] = useState(trip.days[0].id);
  const [state, setState] = useState<AppState>({ customStops: {}, checklistDone: [] });
  const [activeStopIdx, setActiveStopIdx] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<"itinerary" | "timeline">("itinerary");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [state, hydrated]);

  const currentDay = trip.days.find((d) => d.id === activeDay) ?? trip.days[0];

  const handleDayChange = useCallback((dayId: string) => {
    setActiveDay(dayId);
    setActiveStopIdx(null);
  }, []);

  const handleCustomChange = useCallback(
    (stopId: string, patch: Parameters<typeof patchCustomStop>[2]) => {
      setState((prev) => patchCustomStop(prev, stopId, patch));
    },
    []
  );

  const handleChecklistToggle = useCallback((itemId: string) => {
    setState((prev) => toggleChecklist(prev, itemId));
  }, []);

  function stopId(dayId: string, idx: number) {
    return `${dayId}-${idx}`;
  }

  const sidebar = (
    <DayNav
      trip={trip}
      activeDay={activeDay}
      onDayChange={handleDayChange}
      checklistDone={state.checklistDone}
      onChecklistToggle={handleChecklistToggle}
    />
  );

  const main = (
    <div className={styles.mainContent}>
      <DayHero day={currentDay} />
      <div className={styles.stopList} id="main-panel" role="region" aria-label="Stops">
        {currentDay.stops.map((stop, idx) => {
          if (stop.type === "drive") {
            return (
              <DriveSegment
                key={idx}
                time={stop.time}
                text={stop.driveText ?? ""}
              />
            );
          }
          const sid = stopId(activeDay, idx);
          return (
            <StopCard
              key={idx}
              stop={stop}
              stopId={sid}
              variant="ant"
              custom={state.customStops[sid]}
              onCustomChange={(patch) => handleCustomChange(sid, patch)}
            />
          );
        })}
      </div>
    </div>
  );

  const timeline = (
    <StopTimeline
      day={currentDay}
      activeStopIdx={activeStopIdx}
      customisations={state.customStops}
      onStopClick={(idx) => {
        setActiveStopIdx(idx);
        const card = document.getElementById(`stop-${activeDay}-${idx}`);
        card?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    />
  );

  return (
    <ThemeProvider theme={kiteTheme}>
      <TripShell
        trip={trip}
        activeDay={activeDay}
        state={state}
        onDayChange={handleDayChange}
        onStateChange={setState}
        sidebar={sidebar}
        main={main}
        timeline={timeline}
        mobileTab={mobileTab}
        onMobileTabChange={setMobileTab}
      />
    </ThemeProvider>
  );
}
