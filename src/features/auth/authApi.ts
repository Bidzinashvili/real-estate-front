import axios from "axios";
import {
  persistAuthResponse,
  requireApiBaseUrl,
  getBearerAuthContext,
  type AuthResponse,
} from "@/shared/lib/auth";
import { ApiError, parseStandardApiError } from "@/shared/lib/apiError";

type MessageResponse = {
  message?: string;
};

function throwAsApiError(error: unknown, fallback: string): never {
  if (axios.isAxiosError(error)) {
    const parsed = parseStandardApiError(
      error.response?.data,
      error.response?.status ?? 500,
      fallback,
    );
    throw new ApiError(parsed, fallback);
  }
  throw error;
}

export async function loginWithEmailPassword(
  email: string,
  password: string,
): Promise<void> {
  const baseUrl = requireApiBaseUrl();

  try {
    const response = await axios.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email,
      password,
    });
    const stored = persistAuthResponse(response.data ?? null);
    if (!stored) {
      throw new Error("ავტორიზაცია ვერ მოხერხდა");
    }
  } catch (error: unknown) {
    throwAsApiError(error, "ელფოსტა ან პაროლი არასწორია");
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  const baseUrl = requireApiBaseUrl();

  try {
    await axios.post<MessageResponse>(`${baseUrl}/auth/forgot-password`, {
      email,
    });
  } catch (error: unknown) {
    throwAsApiError(error, "პაროლის აღდგენის მოთხოვნა ვერ შესრულდა.");
  }
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<void> {
  const baseUrl = requireApiBaseUrl();

  try {
    await axios.post<MessageResponse>(`${baseUrl}/auth/reset-password`, {
      token,
      newPassword,
    });
  } catch (error: unknown) {
    throwAsApiError(error, "პაროლის აღდგენა ვერ შესრულდა.");
  }
}

export async function setPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<void> {
  const baseUrl = requireApiBaseUrl();

  try {
    await axios.post<MessageResponse>(`${baseUrl}/auth/set-password`, {
      token,
      newPassword,
    });
  } catch (error: unknown) {
    throwAsApiError(error, "პაროლის დაყენება ვერ შესრულდა.");
  }
}

export async function changeOwnPassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const { baseUrl, headers } = getBearerAuthContext();

  try {
    await axios.post<MessageResponse>(
      `${baseUrl}/auth/change-password`,
      {
        currentPassword,
        newPassword,
      },
      { headers },
    );
  } catch (error: unknown) {
    throwAsApiError(error, "პაროლის შეცვლა ვერ შესრულდა.");
  }
}
