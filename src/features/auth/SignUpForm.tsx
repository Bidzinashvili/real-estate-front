"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authenticateWithGoogleIdToken } from "@/shared/lib/auth";
import { loginWithEmailPassword } from "@/features/auth/authApi";
import { AUTH_COPY, getSignInNotice } from "@/features/auth/authCopy";
import { mapLoginError } from "@/features/auth/authRequestErrors";
import { PasswordField } from "@/features/auth/PasswordField";
import { AuthCard } from "@/features/auth/AuthCard";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleIdentityApi = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void | Promise<void>;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        options: {
          type: string;
          theme: string;
          size: string;
          text: string;
          width: number;
        },
      ) => void;
    };
  };
};

type SignInFormProps = {
  noticeReason?: string | null;
};

function SignInForm({ noticeReason = null }: SignInFormProps) {
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(getSignInNotice(noticeReason));
  const [googleButtonMounted, setGoogleButtonMounted] = useState(false);

  useEffect(() => {
    setGoogleButtonMounted(true);
  }, []);

  useEffect(() => {
    if (!googleButtonMounted) {
      return;
    }

    const googleIdentity = (window as Window & { google?: GoogleIdentityApi }).google;

    if (!googleIdentity || !googleButtonRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return;
    }

    googleIdentity.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: GoogleCredentialResponse) => {
        setError(null);
        setNotice(null);
        setLoading(true);

        try {
          const idToken = response.credential;
          if (!idToken) {
            throw new Error(AUTH_COPY.genericError);
          }
          await authenticateWithGoogleIdToken(idToken);
          router.push("/dashboard");
        } catch (err) {
          setError(err instanceof Error ? err.message : AUTH_COPY.genericError);
        } finally {
          setLoading(false);
        }
      },
    });

    googleIdentity.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signup_with",
      width: 320,
    });
  }, [googleButtonMounted, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError(AUTH_COPY.emailRequired);
      return;
    }
    if (!password) {
      setError(AUTH_COPY.passwordRequired);
      return;
    }

    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      await loginWithEmailPassword(trimmedEmail, password);
      router.push("/dashboard");
    } catch (err) {
      setError(mapLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title={AUTH_COPY.signInTitle} description={AUTH_COPY.signInDescription}>
      {notice ? (
        <p className="mb-4 rounded-lg bg-muted px-3 py-2 text-center text-sm text-foreground" role="status">
          {notice}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="sign-in-email" className="block text-sm font-medium text-foreground">
            {AUTH_COPY.emailLabel}
          </label>
          <input
            id="sign-in-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            className="block w-full min-w-0 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <PasswordField
          id="sign-in-password"
          name="password"
          label={AUTH_COPY.passwordLabel}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          disabled={loading}
        />

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? AUTH_COPY.signingIn : AUTH_COPY.signInButton}
        </button>
      </form>

      <div className="mt-3 text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          {AUTH_COPY.forgotPasswordLink}
        </Link>
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {AUTH_COPY.orDivider}
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="flex min-h-10 justify-center overflow-x-auto">
        {googleButtonMounted ? <div ref={googleButtonRef} /> : <div className="h-10 w-80" />}
      </div>
    </AuthCard>
  );
}

export { SignInForm };
