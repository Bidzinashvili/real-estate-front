"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AUTH_COPY } from "@/features/auth/authCopy";
import { NewPasswordFields } from "@/features/auth/NewPasswordFields";
import {
  getConfirmPasswordError,
  getPasswordPolicyError,
} from "@/features/auth/passwordPolicy";

type AdminResetPasswordDialogProps = {
  open: boolean;
  agentName: string;
  isProcessing: boolean;
  error: string | null;
  onSubmit: (newPassword: string) => Promise<void>;
  onCancel: () => void;
};

export function AdminResetPasswordDialog({
  open,
  agentName,
  isProcessing,
  error,
  onSubmit,
  onCancel,
}: AdminResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setNewPasswordError(null);
    setConfirmPasswordError(null);
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const policyError = getPasswordPolicyError(newPassword);
    const confirmError = getConfirmPasswordError(newPassword, confirmPassword);
    setNewPasswordError(policyError);
    setConfirmPasswordError(confirmError);
    if (policyError || confirmError) {
      return;
    }
    await onSubmit(newPassword);
  };

  const handleCancel = () => {
    if (isProcessing) {
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setNewPasswordError(null);
    setConfirmPasswordError(null);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-lg ring-1 ring-border">
        <h2 className="text-base font-semibold text-foreground">
          {AUTH_COPY.adminResetPassword}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{agentName}</p>
        <p className="mt-3 text-sm text-foreground">{AUTH_COPY.adminResetWarning}</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          <NewPasswordFields
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            newPasswordError={newPasswordError}
            confirmPasswordError={confirmPasswordError}
            disabled={isProcessing}
            helperId="admin-reset-password-helper"
          />

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isProcessing}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
            >
              გაუქმება
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isProcessing ? AUTH_COPY.submitting : AUTH_COPY.adminResetPassword}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
