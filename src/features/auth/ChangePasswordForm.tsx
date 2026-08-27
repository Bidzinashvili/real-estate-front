"use client";

import { useState, type FormEvent } from "react";
import { changeOwnPassword } from "@/features/auth/authApi";
import { AUTH_COPY } from "@/features/auth/authCopy";
import { mapChangePasswordError } from "@/features/auth/authRequestErrors";
import {
  getConfirmPasswordError,
  getPasswordPolicyError,
} from "@/features/auth/passwordPolicy";
import { PasswordField } from "@/features/auth/PasswordField";
import { NewPasswordFields } from "@/features/auth/NewPasswordFields";
import { logoutToSignIn } from "@/shared/lib/sessionExpired";

type ChangePasswordFormProps = {
  passwordSet: boolean;
};

export function ChangePasswordForm({ passwordSet }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!passwordSet) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        {AUTH_COPY.passwordNotSet}
      </p>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const missingCurrent = currentPassword ? null : AUTH_COPY.passwordRequired;
    const policyError = getPasswordPolicyError(newPassword);
    const confirmError = getConfirmPasswordError(newPassword, confirmPassword);
    const samePasswordError =
      currentPassword && newPassword && currentPassword === newPassword
        ? AUTH_COPY.sameAsCurrentPassword
        : null;

    setCurrentPasswordError(missingCurrent);
    setNewPasswordError(policyError ?? samePasswordError);
    setConfirmPasswordError(confirmError);
    setFormError(null);

    if (missingCurrent || policyError || confirmError || samePasswordError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await changeOwnPassword(currentPassword, newPassword);
      logoutToSignIn("password-changed");
    } catch (error) {
      setFormError(mapChangePasswordError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <PasswordField
        id="current-password"
        name="current-password"
        label={AUTH_COPY.currentPasswordLabel}
        value={currentPassword}
        onChange={setCurrentPassword}
        autoComplete="current-password"
        error={currentPasswordError}
        disabled={isSubmitting}
      />
      <NewPasswordFields
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        newPasswordError={newPasswordError}
        confirmPasswordError={confirmPasswordError}
        disabled={isSubmitting}
      />

      {formError ? (
        <p className="text-sm text-destructive" role="alert">
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? AUTH_COPY.submitting : AUTH_COPY.changePasswordTitle}
      </button>
    </form>
  );
}
