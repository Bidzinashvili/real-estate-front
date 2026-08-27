"use client";

import { SlidersHorizontal } from "lucide-react";

type AdvancedSearchButtonProps = {
  appliedCount: number;
  onOpen: () => void;
};

export function AdvancedSearchButton({
  appliedCount,
  onOpen,
}: AdvancedSearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
    >
      <SlidersHorizontal className="h-4 w-4 text-muted-foreground" aria-hidden />
      {appliedCount > 0
        ? `გაფართოებული ძებნა · ${appliedCount}`
        : "გაფართოებული ძებნა"}
      {appliedCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
          {appliedCount > 99 ? "99+" : appliedCount}
        </span>
      ) : null}
    </button>
  );
}
