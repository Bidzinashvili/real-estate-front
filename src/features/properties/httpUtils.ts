export function getApiErrorMessage(
  payload: unknown,
  fallback: string,
): string {
  if (typeof payload === "object" && payload !== null && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

export function hasJsonResponseBody(response: Response): boolean {
  const contentType = response.headers.get("content-type") ?? "";
  const contentLength = response.headers.get("content-length");

  return (
    contentType.includes("application/json") ||
    (contentLength !== null && Number(contentLength) > 0)
  );
}

export async function tryParseJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

