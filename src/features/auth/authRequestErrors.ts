import axios from "axios";
import { ApiError } from "@/shared/lib/apiError";
import { AUTH_COPY } from "@/features/auth/authCopy";

export type PasswordTokenKind = "reset" | "setup";

function asJoinedMessage(value: string | string[]): string {
  return Array.isArray(value) ? value.join(" ") : value;
}

export function getAuthErrorStatus(error: unknown): number | null {
  if (error instanceof ApiError) {
    return error.statusCode;
  }
  if (axios.isAxiosError(error) && typeof error.response?.status === "number") {
    return error.response.status;
  }
  return null;
}

export function getAuthErrorRawMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return asJoinedMessage(error.rawMessage);
  }
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data;
    if (typeof payload === "object" && payload !== null && "message" in payload) {
      const message = (payload as { message?: unknown }).message;
      if (typeof message === "string") {
        return message;
      }
      if (Array.isArray(message)) {
        return message.filter((item): item is string => typeof item === "string").join(" ");
      }
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "";
}

function matchesMessage(error: unknown, pattern: RegExp): boolean {
  return pattern.test(getAuthErrorRawMessage(error));
}

export function isRateLimitError(error: unknown): boolean {
  return getAuthErrorStatus(error) === 429;
}

export function mapRateLimitOrGenericError(error: unknown, fallback: string): string {
  if (isRateLimitError(error)) {
    return AUTH_COPY.rateLimited;
  }
  return fallback;
}

export function mapLoginError(error: unknown): string {
  if (isRateLimitError(error)) {
    return AUTH_COPY.rateLimited;
  }
  if (
    getAuthErrorStatus(error) === 401 &&
    matchesMessage(error, /invalid email or password/i)
  ) {
    return AUTH_COPY.invalidCredentials;
  }
  if (getAuthErrorStatus(error) === 401) {
    return AUTH_COPY.invalidCredentials;
  }
  return AUTH_COPY.genericError;
}

export function mapPasswordTokenError(
  error: unknown,
  kind: PasswordTokenKind,
): string {
  if (isRateLimitError(error)) {
    return AUTH_COPY.rateLimited;
  }

  const rawMessage = getAuthErrorRawMessage(error).toLowerCase();

  if (rawMessage.includes("expired")) {
    return kind === "setup" ? AUTH_COPY.expiredSetupToken : AUTH_COPY.expiredResetToken;
  }
  if (rawMessage.includes("already") && rawMessage.includes("used")) {
    return kind === "setup" ? AUTH_COPY.usedSetupToken : AUTH_COPY.usedResetToken;
  }
  if (rawMessage.includes("invalid") && rawMessage.includes("token")) {
    return kind === "setup" ? AUTH_COPY.invalidSetupToken : AUTH_COPY.invalidResetToken;
  }

  return kind === "setup" ? AUTH_COPY.invalidSetupToken : AUTH_COPY.invalidResetToken;
}

export function mapChangePasswordError(error: unknown): string {
  if (isRateLimitError(error)) {
    return AUTH_COPY.rateLimited;
  }
  if (matchesMessage(error, /current password is incorrect/i)) {
    return AUTH_COPY.wrongCurrentPassword;
  }
  if (matchesMessage(error, /must be different from the current password/i)) {
    return AUTH_COPY.sameAsCurrentPassword;
  }
  if (matchesMessage(error, /password has not been set/i)) {
    return AUTH_COPY.passwordNotSet;
  }
  if (matchesMessage(error, /password/i) && getAuthErrorStatus(error) === 400) {
    return AUTH_COPY.passwordPolicyHelper;
  }
  return AUTH_COPY.genericError;
}

export function mapAdminResetPasswordError(error: unknown): string {
  const statusCode = getAuthErrorStatus(error);
  if (statusCode === 403) {
    return AUTH_COPY.adminResetForbidden;
  }
  if (statusCode === 404) {
    return AUTH_COPY.adminResetNotFound;
  }
  if (isRateLimitError(error)) {
    return AUTH_COPY.rateLimited;
  }
  if (matchesMessage(error, /password/i) && statusCode === 400) {
    return AUTH_COPY.passwordPolicyHelper;
  }
  return error instanceof Error ? error.message : AUTH_COPY.genericError;
}

export const SESSION_EXPIRED_MESSAGE = "Session expired. Please sign in again.";

export function isSessionExpiredMessage(message: string): boolean {
  return message.trim() === SESSION_EXPIRED_MESSAGE;
}
