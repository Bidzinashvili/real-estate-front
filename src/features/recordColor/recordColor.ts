export const RECORD_COLORS = [
  "DEFAULT",
  "RED",
  "ORANGE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "PURPLE",
  "PINK",
  "GRAY",
] as const;

export type RecordColor = (typeof RECORD_COLORS)[number];

export const RECORD_COLOR_LABELS: Record<RecordColor, string> = {
  DEFAULT: "ფერის გარეშე",
  RED: "წითელი",
  ORANGE: "ნარინჯისფერი",
  YELLOW: "ყვითელი",
  GREEN: "მწვანე",
  BLUE: "ლურჯი",
  PURPLE: "იასამნისფერი",
  PINK: "ვარდისფერი",
  GRAY: "ნაცრისფერი",
};

export function isRecordColor(value: string): value is RecordColor {
  return (RECORD_COLORS as readonly string[]).includes(value);
}

export function parseRecordColor(value: unknown): RecordColor | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmedValue = value.trim();
  if (!isRecordColor(trimmedValue)) {
    return undefined;
  }
  return trimmedValue;
}

export function isCustomRecordColor(
  color: RecordColor | undefined,
): color is Exclude<RecordColor, "DEFAULT"> {
  return color !== undefined && color !== "DEFAULT";
}

export function canEditRecordColor(
  canManage: boolean,
  color: RecordColor | undefined,
): boolean {
  return canManage && color !== undefined;
}
