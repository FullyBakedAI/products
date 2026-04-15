/**
 * IconOverrideContext — slot-based icon substitution system.
 *
 * Defines named "slots" (e.g. 'nav-home', 'action-send') that map to
 * Lucide icon names. The context lets the DS page swap icons in the
 * phone preview at runtime without touching production code.
 *
 * Usage:
 *   const { getIcon } = useIconOverride();
 *   const HomeIcon = getIcon('nav-home');
 *   <HomeIcon size={22} />
 */

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';

export const ICON_SLOTS = [
  { slot: 'nav-home',       label: 'Nav — Home',       default: 'House',          screen: 'BottomNav' },
  { slot: 'nav-explore',    label: 'Nav — Explore',    default: 'Search',         screen: 'BottomNav' },
  { slot: 'nav-activity',   label: 'Nav — Activity',   default: 'Activity',       screen: 'BottomNav' },
  { slot: 'nav-swap',       label: 'Nav — Swap',       default: 'ArrowRightLeft', screen: 'BottomNav' },
  { slot: 'action-buy',     label: 'Action — Buy',     default: 'Plus',           screen: 'Home' },
  { slot: 'action-send',    label: 'Action — Send',    default: 'Send',           screen: 'Home' },
  { slot: 'action-receive', label: 'Action — Receive', default: 'Download',       screen: 'Home' },
  { slot: 'swap-direction', label: 'Swap direction',   default: 'ArrowUpDown',    screen: 'Swap' },
];

const IconOverrideContext = createContext(null);

export function IconOverrideProvider({ children }) {
  const [overrides, setOverrides] = useState({});

  const getIconName = useCallback((slot) => {
    return overrides[slot] ?? ICON_SLOTS.find(s => s.slot === slot)?.default ?? 'Circle';
  }, [overrides]);

  const getIcon = useCallback((slot) => {
    const name = overrides[slot] ?? ICON_SLOTS.find(s => s.slot === slot)?.default ?? 'Circle';
    return LucideIcons[name] ?? LucideIcons.Circle;
  }, [overrides]);

  const setIconOverride = useCallback((slot, iconName) => {
    setOverrides(prev => ({ ...prev, [slot]: iconName }));
  }, []);

  const resetIconOverride = useCallback((slot) => {
    setOverrides(prev => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ getIcon, getIconName, setIconOverride, resetIconOverride, overrides }),
    [getIcon, getIconName, setIconOverride, resetIconOverride, overrides]
  );

  return (
    <IconOverrideContext.Provider value={value}>
      {children}
    </IconOverrideContext.Provider>
  );
}

export function useIconOverride() {
  const ctx = useContext(IconOverrideContext);
  if (!ctx) throw new Error('useIconOverride must be used inside IconOverrideProvider');
  return ctx;
}
