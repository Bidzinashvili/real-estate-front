"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticateWithGoogleIdToken } from "@/shared/lib/auth";

function SignUpForm() {
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const google = (window as any).google;

    if (!google || !googleButtonRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not defined");
      return;
    }

    google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: any) => {
        setError(null);
        setLoading(true);

        try {
          const idToken = response.credential;
          await authenticateWithGoogleIdToken(idToken);
          router.push("/dashboard");
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Something went wrong";
          setError(message);
        } finally {
          setLoading(false);
        }
      },
    });

    google.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signup_with",
      width: 320,
    });
  }, [router]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border rounded-xl p-8 shadow-sm bg-card">
        <h1 className="text-2xl font-bold text-center mb-2">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Sign up to get started with Real Estate App
        </p>

        <div className="flex justify-center">
          <div ref={googleButtonRef} />
        </div>

        {loading && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Signing you up...
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive text-center mt-4">{error}</p>
        )}

        <p className="text-sm text-muted-foreground text-center mt-8">
          Already have an account?{" "}
          <a href="/" className="text-primary underline hover:no-underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

export { SignUpForm };
