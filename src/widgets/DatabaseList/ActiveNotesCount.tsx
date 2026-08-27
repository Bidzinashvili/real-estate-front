"use client";

type ActiveNotesCountProps = {
  label: string;
  count: number;
  isMine: boolean;
};

export function ActiveNotesCount({
  label,
  count,
  isMine,
}: ActiveNotesCountProps) {
  return (
    <p
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${
        isMine
          ? "border border-purple-600/70 bg-purple-50 text-purple-800"
          : "border border-border bg-card text-foreground"
      }`}
    >
      {label}: {count}
    </p>
  );
}
