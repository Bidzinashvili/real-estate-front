"use client";

import type { TemporaryLockKey } from "@/features/matching/matchingEnums";
import { TEMPORARY_LOCK_LABELS } from "@/features/matching/criterionLabels";

type AppliedTemporaryLocksNoticeProps = {
  selectedKeys: TemporaryLockKey[];
};

export function AppliedTemporaryLocksNotice({
  selectedKeys,
}: AppliedTemporaryLocksNoticeProps) {
  if (selectedKeys.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl bg-destructive/5 p-4 shadow-sm ring-1 ring-destructive/20">
      <h2 className="text-sm font-semibold text-foreground">დროებითი მკაცრი პირობები</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        მოქმედებს მხოლოდ ამ შესაბამისობის სესიაში. კლიენტზე ან განცხადებაზე არ ინახება.
      </p>
      <p className="mt-2 text-sm text-foreground">
        {selectedKeys.map((lockKey) => TEMPORARY_LOCK_LABELS[lockKey]).join(", ")}
      </p>
    </section>
  );
}
