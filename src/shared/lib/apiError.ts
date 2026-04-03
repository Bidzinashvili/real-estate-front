export type FieldErrors = Record<string, string[]>;

export type StandardApiError = {
  message: string | string[];
  error: string;
  statusCode: number;
  code?: string;
  fieldErrors?: FieldErrors;
};

export class ApiError extends Error {
  statusCode: number;
  code?: string;
  fieldErrors?: FieldErrors;
  rawMessage: string | string[];

  constructor(payload: StandardApiError, fallback: string) {
    super(getApiErrorMessage(payload, fallback));
    this.name = "ApiError";
    this.statusCode = payload.statusCode;
    this.code = payload.code;
    this.fieldErrors = payload.fieldErrors;
    this.rawMessage = payload.message;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asMessage(value: unknown): string | string[] | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const items = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length > 0 ? items : null;
  }

  return null;
}

function asFieldErrors(value: unknown): FieldErrors | undefined {
  if (!isRecord(value)) return undefined;

  const output: FieldErrors = {};
  for (const [key, fieldValue] of Object.entries(value)) {
    if (!Array.isArray(fieldValue)) continue;

    const errors = fieldValue
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean);

    if (errors.length > 0) {
      output[key] = errors;
    }
  }

  return Object.keys(output).length > 0 ? output : undefined;
}

export function getApiErrorMessage(payload: unknown, fallback: string): string {
  if (!isRecord(payload)) return fallback;
  const message = asMessage(payload.message);

  if (typeof message === "string") return message;
  if (Array.isArray(message) && message.length > 0) return message.join("\n");

  return fallback;
}

export function parseStandardApiError(
  payload: unknown,
  statusCode: number,
  fallback: string,
): StandardApiError {
  if (!isRecord(payload)) {
    return {
      message: fallback,
      error: "Error",
      statusCode,
    };
  }

  return {
    message: asMessage(payload.message) ?? fallback,
    error: typeof payload.error === "string" ? payload.error : "Error",
    statusCode:
      typeof payload.statusCode === "number" && Number.isFinite(payload.statusCode)
        ? payload.statusCode
        : statusCode,
    code: typeof payload.code === "string" ? payload.code : undefined,
    fieldErrors: asFieldErrors(payload.fieldErrors),
  };
}

