export function parseIntegerInput(raw: string, allowNegative = false): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-" || trimmed === "+") {
    return undefined;
  }

  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  if (!allowNegative && parsed < 0) {
    return undefined;
  }

  return parsed;
}

export function parseDecimalInput(raw: string, allowNegative = false): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-" || trimmed === "+") {
    return undefined;
  }

  const parsed = Number.parseFloat(trimmed);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  if (!allowNegative && parsed < 0) {
    return undefined;
  }

  return parsed;
}
