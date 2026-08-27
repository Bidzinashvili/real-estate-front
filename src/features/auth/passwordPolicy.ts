import { AUTH_COPY } from "@/features/auth/authCopy";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;

export function getPasswordPolicyError(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return AUTH_COPY.passwordPolicyHelper;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return AUTH_COPY.passwordTooLong;
  }
  if (!/[A-Z]/.test(password)) {
    return AUTH_COPY.passwordPolicyHelper;
  }
  if (!/[a-z]/.test(password)) {
    return AUTH_COPY.passwordPolicyHelper;
  }
  if (!/\d/.test(password)) {
    return AUTH_COPY.passwordPolicyHelper;
  }
  return null;
}

export function getConfirmPasswordError(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) {
    return AUTH_COPY.passwordsDoNotMatch;
  }
  return null;
}
