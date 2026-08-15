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
  globalLabel = "All listings",
  mineLabel = "My listings",
}: MatchingScopeToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-xs font-medium">
      <button
        type="button"
        onClick={() => onChange("GLOBAL")}
        className={`rounded-full px-3 py-1.5 ${
          value === "GLOBAL" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        {globalLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange("MINE")}
        className={`rounded-full px-3 py-1.5 ${
          value === "MINE" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        {mineLabel}
      </button>
    </div>
  );
}
