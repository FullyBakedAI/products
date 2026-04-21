import type { AppState, StopCustomisation } from "@/lib/types";

const STORAGE_KEY = "kite-app-state";

function defaultState(): AppState {
  return { customStops: {}, checklistDone: [] };
}

export function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    return defaultState();
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full — fail silently
  }
}

export function patchCustomStop(
  state: AppState,
  stopId: string,
  patch: Partial<StopCustomisation>
): AppState {
  return {
    ...state,
    customStops: {
      ...state.customStops,
      [stopId]: { ...(state.customStops[stopId] ?? {}), ...patch },
    },
  };
}

export function toggleChecklist(state: AppState, itemId: string): AppState {
  const done = state.checklistDone.includes(itemId)
    ? state.checklistDone.filter((id) => id !== itemId)
    : [...state.checklistDone, itemId];
  return { ...state, checklistDone: done };
}
