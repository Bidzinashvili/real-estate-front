"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/features/auth/authApi";
import { AUTH_COPY } from "@/features/auth/authCopy";
import { mapRateLimitOrGenericError } from "@/features/auth/authRequestErrors";
import { AuthCard } from "@/features/auth/AuthCard";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(AUTH_COPY.emailRequired);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await requestPasswordReset(trimmedEmail);
      setIsSubmitted(true);
    } catch (err) {
      setError(mapRateLimitOrGenericError(err, AUTH_COPY.genericError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={AUTH_COPY.forgotPasswordTitle}
      description={AUTH_COPY.forgotPasswordDescription}
    >
      {isSubmitted ? (
        <p className="text-sm text-foreground" role="status">
          {AUTH_COPY.forgotPasswordSuccess}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground">
              {AUTH_COPY.emailLabel}
            </label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              className="block w-full min-w-0 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? AUTH_COPY.submitting : AUTH_COPY.forgotPasswordSubmit}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/sign-in"
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          {AUTH_COPY.backToSignIn}
        </Link>
      </div>
    </AuthCard>
  );
}
