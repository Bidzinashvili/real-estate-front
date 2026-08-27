"use client";

import axios from "axios";
import { clearAccessToken } from "@/shared/lib/auth";
import { useUserStore } from "@/shared/stores/userStore";
import { useUndoSnackbarStore } from "@/features/recordUndo/undoSnackbarStore";
import {
  isSessionExpiredMessage,
  getAuthErrorRawMessage,
  getAuthErrorStatus,
} from "@/features/auth/authRequestErrors";
import type { SignInNoticeReason } from "@/features/auth/authCopy";

let interceptorInstalled = false;
let sessionClearInProgress = false;

export function clearAuthenticatedCaches(): void {
  useUserStore.getState().clearUser();
  useUndoSnackbarStore.getState().clearAll();
}

export function clearAuthenticatedSession(): void {
  clearAccessToken();
  clearAuthenticatedCaches();
}

export function redirectToSignIn(reason?: SignInNoticeReason): void {
  if (typeof window === "undefined") {
    return;
  }
  const nextPath = reason ? `/sign-in?reason=${encodeURIComponent(reason)}` : "/sign-in";
  const currentPath = `${window.location.pathname}${window.location.search}`;
  if (currentPath === nextPath || (window.location.pathname === "/sign-in" && !reason)) {
    return;
  }
  window.location.replace(nextPath);
}

export function logoutToSignIn(reason?: SignInNoticeReason): void {
  if (sessionClearInProgress) {
    return;
  }
  sessionClearInProgress = true;
  clearAuthenticatedSession();
  redirectToSignIn(reason);
  if (typeof window !== "undefined" && window.location.pathname === "/sign-in") {
    sessionClearInProgress = false;
  }
}

function isSessionExpiredAxiosError(error: unknown): boolean {
  if (getAuthErrorStatus(error) !== 401) {
    return false;
  }
  return isSessionExpiredMessage(getAuthErrorRawMessage(error));
}

export function installSessionExpiredInterceptor(): void {
  if (typeof window === "undefined" || interceptorInstalled) {
    return;
  }
  interceptorInstalled = true;

  axios.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (isSessionExpiredAxiosError(error)) {
        logoutToSignIn("session-expired");
      }
      return Promise.reject(error);
    },
  );
}

installSessionExpiredInterceptor();
