export function parseIntegerInput(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-" || trimmed === "+") {
    return undefined;
  }

  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseDecimalInput(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-" || trimmed === "+") {
    return undefined;
  }

  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}
