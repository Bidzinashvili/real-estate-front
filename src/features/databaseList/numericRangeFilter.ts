export type NumericRangeFilter = {
  from?: number;
  to?: number;
};

export function toNumericRangeFilter(
  fromValue: number | undefined,
  toValue: number | undefined,
): NumericRangeFilter | undefined {
  if (fromValue === undefined && toValue === undefined) {
    return undefined;
  }
  if (
    fromValue !== undefined &&
    toValue !== undefined &&
    fromValue > toValue
  ) {
    return undefined;
  }
  return {
    from: fromValue,
    to: toValue,
  };
}

export function serializeNumericRangeFilter(
  range: NumericRangeFilter | undefined,
): string | undefined {
  if (!range) {
    return undefined;
  }

  const payload: Record<string, number> = {};
  if (range.from !== undefined && Number.isFinite(range.from)) {
    payload.from = range.from;
  }
  if (range.to !== undefined && Number.isFinite(range.to)) {
    payload.to = range.to;
  }
  if (Object.keys(payload).length === 0) {
    return undefined;
  }
  return JSON.stringify(payload);
}

export function parseNumericRangeFilter(
  raw: string | null,
): { from: string; to: string } {
  if (!raw || raw.trim() === "") {
    return { from: "", to: "" };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { from: "", to: "" };
    }
    const record = parsed as Record<string, unknown>;
    return {
      from: stringifyRangeBound(record.from),
      to: stringifyRangeBound(record.to),
    };
  } catch {
    return { from: "", to: "" };
  }
}

function stringifyRangeBound(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }
  return "";
}
