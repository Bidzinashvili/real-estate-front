"use client";

import type { MatchScope } from "@/features/matching/matchingEnums";

type MatchingScopeToggleProps = {
  value: MatchScope;
  onChange: (next: MatchScope) => void;
  globalLabel?: string;
  mineLabel?: string;
};

export function MatchingScopeToggle({
  value,
  onChange,
  globalLabel = "ყველა განცხადება",
  mineLabel = "ჩემი განცხადებები",
}: MatchingScopeToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1 text-xs font-medium">
      <button
        type="button"
        onClick={() => onChange("GLOBAL")}
        className={`rounded-full px-3 py-1.5 ${
          value === "GLOBAL"
            ? "bg-success text-white"
            : "text-success hover:bg-success-muted"
        }`}
      >
        {globalLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange("MINE")}
        className={`rounded-full px-3 py-1.5 ${
          value === "MINE"
            ? "bg-violet-600 text-white"
            : "text-violet-600 hover:bg-violet-600/10 dark:text-violet-400"
        }`}
      >
        {mineLabel}
      </button>
    </div>
  );
}
