"use client";

import { useCurrentUser } from "@/shared/hooks";
import { AUTH_COPY } from "@/features/auth/authCopy";
import { ChangePasswordForm } from "@/features/auth/ChangePasswordForm";

export function AccountSecurityView() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return (
      <p className="text-sm text-muted-foreground">ანგარიში იტვირთება…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {AUTH_COPY.accountPageTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <section className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border sm:p-6">
        <h2 className="text-base font-semibold text-foreground">
          {AUTH_COPY.securitySectionTitle}
        </h2>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">
          {AUTH_COPY.changePasswordTitle}
        </p>
        <ChangePasswordForm passwordSet={user.passwordSet} />
      </section>
    </div>
  );
}
