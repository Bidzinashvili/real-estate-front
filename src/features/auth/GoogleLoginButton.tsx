"use client";

import { useEffect, useRef } from "react";
import { authenticateWithGoogleIdToken } from "@/shared/lib/auth";

type GoogleLoginButtonProps = {
  title?: string;
};

function GoogleLoginButton({ title = "Google Login" }: GoogleLoginButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

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
        try {
          const idToken = response.credential;
          console.log("✅ GOOGLE ID TOKEN:", idToken);
          const result = await authenticateWithGoogleIdToken(idToken);
          console.log("✅ /auth/google response:", result);
        } catch (error) {
          console.error("❌ Error during Google authentication:", error);
          alert("Failed to sign in with Google. Check console for details.");
        }
      },
    });

    google.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
    });

    google.accounts.id.prompt();
  }, []);

  return (
    <div className="p-6 border rounded-lg flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div ref={googleButtonRef} />
    </div>
  );
}

export { GoogleLoginButton };