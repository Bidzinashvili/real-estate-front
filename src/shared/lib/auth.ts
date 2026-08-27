import axios from "axios";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";

const AUTH_TOKEN_KEY = "authToken";
const AUTH_COOKIE_MAX_AGE_SECONDS = 14 * 24 * 60 * 60;

function getApiBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? null;
}

function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export type AuthResponse = {
  accessToken?: string;
  tokenType?: "Bearer";
  expiresIn?: number;
  user?: {
    id: string;
    email: string;
    role: "ADMIN" | "AGENT";
    passwordSet?: boolean;
  };
} | null;

export function persistAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(
      token,
    )}; Max-Age=${AUTH_COOKIE_MAX_AGE_SECONDS}; Path=/`;
  }
}

export function clearAccessToken(): void {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_TOKEN_KEY}=; Max-Age=0; Path=/`;
  }
}

export function persistAuthResponse(data: AuthResponse): boolean {
  const token = data?.accessToken;
  if (!token) {
    return false;
  }
  persistAccessToken(token);
  return true;
}

async function authenticateWithGoogleIdToken(idToken: string) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new Error("API მისამართი არ არის კონფიგურირებული");
  }

  try {
    const res = await axios.post<AuthResponse>(`${baseUrl}/auth/google`, {
      idToken,
    });

    const data: AuthResponse = res.data ?? null;
    persistAuthResponse(data);

    return { data, status: res.status };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      const data = (response?.data ?? null) as AuthResponse;
      const message = response
        ? `Google auth failed: ${response.status} ${
            response.statusText ?? ""
          }`.trim()
        : "Google ავტორიზაცია ვერ მოხერხდა: ქსელის შეცდომა";
      const parsed = parseStandardApiError(data, response?.status ?? 500, message);
      throw new ApiError(parsed, message);
    }

    throw error;
  }
}

export function requireApiBaseUrl(): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error("API მისამართი არ არის კონფიგურირებული");
  }
  return baseUrl;
}

export function getBearerAuthContext(): {
  baseUrl: string;
  headers: { Authorization: string };
} {
  const baseUrl = requireApiBaseUrl();
  const token = getStoredAuthToken();
  if (!token) {
    throw new Error("ავტორიზაცია საჭიროა.");
  }
  return {
    baseUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export { AUTH_TOKEN_KEY, getApiBaseUrl, getStoredAuthToken, authenticateWithGoogleIdToken };
