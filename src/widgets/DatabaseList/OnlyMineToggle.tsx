"use client";

type OnlyMineToggleProps = {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export function OnlyMineToggle({
  isActive,
  onToggle,
  disabled = false,
}: OnlyMineToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isActive}
      className={`inline-flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 ${
        isActive
          ? "border border-purple-600 bg-purple-600 text-white"
          : "border border-border bg-card text-foreground hover:bg-muted"
      }`}
    >
      მხოლოდ ჩემი
    </button>
  );
}
