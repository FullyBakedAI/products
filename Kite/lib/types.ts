export type StopType =
  | "start"
  | "end"
  | "transit"
  | "sight"
  | "food"
  | "nature"
  | "hike"
  | "swim"
  | "drive"
  | "stay";

export interface Choice {
  name: string;
  price?: string;
  loc?: string;
  desc?: string;
  link?: string;
}

export interface HikeInfo {
  distance: string;
  gain: string;
  time: string;
}

export interface Stop {
  id?: string;
  time?: string;
  name: string;
  loc?: string;
  lat?: number;
  lng?: number;
  type: StopType;
  icon?: string;
  photo?: string;
  desc?: string;
  hike?: HikeInfo;
  swimInfo?: string;
  choices?: Choice[];
  driveText?: string;
  bookingRef?: string;
  qrCode?: string;
  notes?: string;
}

export interface Day {
  id: string;
  label: string;
  sub: string;
  num?: number;
  heroPhoto?: string;
  stops: Stop[];
  isOverview?: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  sub?: string;
  url?: string | null;
  notes?: string;
}

export interface Trip {
  id: string;
  name: string;
  dates: string;
  heroPhoto?: string;
  description?: string;
  checklist: ChecklistItem[];
  days: Day[];
}

export interface JournalPhoto {
  id: string;
  dataUrl: string;
  addedAt: string;
}

export interface StopCustomisation {
  name?: string;
  loc?: string;
  time?: string;
  notes?: string;
  rating?: number;
  selectedChoice?: string;
  extraChoices?: Choice[];
  journalPhotos?: JournalPhoto[];
  visited?: boolean;
}

export interface AppState {
  customStops: Record<string, StopCustomisation>;
  checklistDone: string[];
}

export interface Operator {
  id: string;
  slug: string;
  name: string;
  logoSrc?: string;
  logoInverse?: string;
  themeConfig?: Partial<KiteTheme>;
}

export interface KiteTheme {
  brandName: string;
  logoSrc: string;
  logoInverse: string;
  fontFamily: string;
  fontDisplay: string;
  primaryColor: string;
  primaryStrong: string;
  primarySubtle: string;
  gradientStart: string;
  gradientEnd: string;
  bgBase: string;
  bgCard: string;
  bgCardAlt: string;
  bgSidebar: string;
  bgSidebarHover: string;
  bgSidebarActive: string;
  bgNav: string;
  bgElevated: string;
  bgOuter: string;
  bgSunken: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textPlaceholder: string;
  textOnDark: string;
  borderSubtle: string;
  borderCard: string;
  borderPill: string;
  borderActive: string;
  borderRow: string;
  success: string;
  successSoft: string;
  error: string;
  errorSoft: string;
  warning: string;
  warningSoft: string;
  gold: string;
  overlay: string;
}
