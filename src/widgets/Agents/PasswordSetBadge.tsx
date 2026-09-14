"use client";

import { AUTH_COPY } from "@/features/auth/authCopy";

type PasswordSetBadgeProps = {
  passwordSet: boolean | undefined;
};

export function PasswordSetBadge({ passwordSet }: PasswordSetBadgeProps) {
  if (passwordSet === undefined) {
    return null;
  }

  if (passwordSet) {
    return (
      <span className="inline-flex rounded-full bg-success-muted px-2 py-0.5 text-[11px] font-medium text-success-foreground">
        {AUTH_COPY.passwordSetBadge}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-warning-muted px-2 py-0.5 text-[11px] font-medium text-warning-foreground">
      {AUTH_COPY.passwordPendingBadge}
    </span>
  );
}
