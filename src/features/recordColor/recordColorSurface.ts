import {
  isCustomRecordColor,
  type RecordColor,
} from "@/features/recordColor/recordColor";

const RECORD_COLOR_SURFACE_CLASS: Record<
  Exclude<RecordColor, "DEFAULT">,
  string
> = {
  RED: "bg-red-50 ring-red-200/80 dark:bg-red-950/40 dark:ring-red-900/55",
  ORANGE:
    "bg-orange-50 ring-orange-200/80 dark:bg-orange-950/40 dark:ring-orange-900/55",
  YELLOW:
    "bg-yellow-50 ring-yellow-200/80 dark:bg-yellow-950/35 dark:ring-yellow-900/50",
  GREEN: "bg-green-50 ring-green-200/80 dark:bg-green-950/40 dark:ring-green-900/55",
  BLUE: "bg-blue-50 ring-blue-200/80 dark:bg-blue-950/40 dark:ring-blue-900/55",
  PURPLE:
    "bg-violet-50 ring-violet-200/80 dark:bg-violet-950/40 dark:ring-violet-900/55",
  PINK: "bg-pink-50 ring-pink-200/80 dark:bg-pink-950/40 dark:ring-pink-900/55",
  GRAY: "bg-slate-100 ring-slate-300/80 dark:bg-slate-800/70 dark:ring-slate-700/70",
};

const RECORD_COLOR_ROW_CLASS: Record<Exclude<RecordColor, "DEFAULT">, string> = {
  RED: "bg-red-50 hover:bg-red-100/90 dark:bg-red-950/35 dark:hover:bg-red-950/50",
  ORANGE:
    "bg-orange-50 hover:bg-orange-100/90 dark:bg-orange-950/35 dark:hover:bg-orange-950/50",
  YELLOW:
    "bg-yellow-50 hover:bg-yellow-100/90 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/45",
  GREEN:
    "bg-green-50 hover:bg-green-100/90 dark:bg-green-950/35 dark:hover:bg-green-950/50",
  BLUE: "bg-blue-50 hover:bg-blue-100/90 dark:bg-blue-950/35 dark:hover:bg-blue-950/50",
  PURPLE:
    "bg-violet-50 hover:bg-violet-100/90 dark:bg-violet-950/35 dark:hover:bg-violet-950/50",
  PINK: "bg-pink-50 hover:bg-pink-100/90 dark:bg-pink-950/35 dark:hover:bg-pink-950/50",
  GRAY: "bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/65 dark:hover:bg-slate-800/80",
};

export const RECORD_COLOR_SWATCH_CLASS: Record<RecordColor, string> = {
  DEFAULT: "bg-card border border-border",
  RED: "bg-red-400 dark:bg-red-500",
  ORANGE: "bg-orange-400 dark:bg-orange-500",
  YELLOW: "bg-yellow-300 dark:bg-yellow-400",
  GREEN: "bg-green-400 dark:bg-green-500",
  BLUE: "bg-blue-400 dark:bg-blue-500",
  PURPLE: "bg-violet-400 dark:bg-violet-500",
  PINK: "bg-pink-400 dark:bg-pink-500",
  GRAY: "bg-slate-400 dark:bg-slate-500",
};

export function recordColorSurfaceClassName(
  color: RecordColor | undefined,
): string {
  if (!isCustomRecordColor(color)) {
    return "";
  }
  return RECORD_COLOR_SURFACE_CLASS[color];
}

export function recordColorRowClassName(
  color: RecordColor | undefined,
): string {
  if (!isCustomRecordColor(color)) {
    return "";
  }
  return RECORD_COLOR_ROW_CLASS[color];
}

export function recordColorSwatchCheckClassName(color: RecordColor): string {
  if (color === "DEFAULT" || color === "YELLOW") {
    return "text-foreground";
  }
  return "text-white";
}
