export function sanitizeTwoDigitNumericInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 2);
}
