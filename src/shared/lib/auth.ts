import axios from 'axios';

const AUTH_TOKEN_KEY = 'authToken';

function getApiBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? null;
}

function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

type AuthResponse = {
  token?: string;
  accessToken?: string;
  [key: string]: unknown;
} | null;

async function authenticateWithGoogleIdToken(idToken: string) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    throw new Error('API base URL is not configured');
  }

  try {
    const res = await axios.post<AuthResponse>(`${baseUrl}/auth/google`, {
      idToken,
    });

    const data: AuthResponse = res.data ?? null;

    if (res.status === 201 && data) {
      const token =
        (data.token as string | undefined) ??
        (data.accessToken as string | undefined);

      if (token) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(AUTH_TOKEN_KEY, token);
        }

        if (typeof document !== 'undefined') {
          const maxAgeSeconds = 14 * 24 * 60 * 60;
          document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(
            token,
          )}; Max-Age=${maxAgeSeconds}; Path=/`;
        }
      }
    }

    return { data, status: res.status };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const response = error.response;
      const data = (response?.data ?? null) as AuthResponse;
      const message =
        (data && (data.message as string | undefined)) ??
        (response
          ? `Google auth failed: ${response.status} ${
              response.statusText ?? ''
            }`.trim()
          : 'Google auth failed: network error');
      throw new Error(message);
    }

    throw error;
  }
}

export { AUTH_TOKEN_KEY, getApiBaseUrl, getStoredAuthToken, authenticateWithGoogleIdToken };
