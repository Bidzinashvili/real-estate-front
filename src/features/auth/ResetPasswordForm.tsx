"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPasswordWithToken } from "@/features/auth/authApi";
import { AUTH_COPY } from "@/features/auth/authCopy";
import { mapPasswordTokenError } from "@/features/auth/authRequestErrors";
import {
  getConfirmPasswordError,
  getPasswordPolicyError,
} from "@/features/auth/passwordPolicy";
import { AuthCard } from "@/features/auth/AuthCard";
import { NewPasswordFields } from "@/features/auth/NewPasswordFields";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(
    token ? null : AUTH_COPY.missingToken,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      setFormError(AUTH_COPY.missingToken);
      return;
    }

    const policyError = getPasswordPolicyError(newPassword);
    const confirmError = getConfirmPasswordError(newPassword, confirmPassword);
    setNewPasswordError(policyError);
    setConfirmPasswordError(confirmError);
    if (policyError || confirmError) {
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      await resetPasswordWithToken(token, newPassword);
      router.replace("/sign-in?reason=password-reset");
    } catch (error) {
      setFormError(mapPasswordTokenError(error, "reset"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title={AUTH_COPY.resetPasswordTitle}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <NewPasswordFields
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          onNewPasswordChange={setNewPassword}
          onConfirmPasswordChange={setConfirmPassword}
          newPasswordError={newPasswordError}
          confirmPasswordError={confirmPasswordError}
          disabled={isSubmitting || !token}
        />

        {formError ? (
          <p className="text-sm text-destructive" role="alert">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? AUTH_COPY.submitting : AUTH_COPY.resetPasswordSubmit}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-2 text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          {AUTH_COPY.forgotPasswordLink}
        </Link>
        <Link
          href="/sign-in"
          className="text-sm font-medium text-muted-foreground underline-offset-2 hover:underline"
        >
          {AUTH_COPY.backToSignIn}
        </Link>
      </div>
    </AuthCard>
  );
}
