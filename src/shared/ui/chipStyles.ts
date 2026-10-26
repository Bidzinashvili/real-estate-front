import { cn } from "@/shared/lib/utils";

export function optionChipClassName(args: {
  isSelected: boolean;
  isCompact: boolean;
  hasError: boolean;
  isDisabled?: boolean;
}): string {
  return cn(
    "inline-flex max-w-full items-center justify-center border text-left font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
    args.isCompact ? "rounded-lg px-3 py-1.5 text-xs" : "rounded-lg px-3.5 py-2 text-sm",
    args.isSelected
      ? "border-primary bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20"
      : args.hasError
        ? "border-destructive/60 bg-card text-foreground hover:bg-muted/60"
        : "border-border bg-card text-foreground shadow-sm hover:border-primary/35 hover:bg-muted/50",
    args.isDisabled && "pointer-events-none opacity-50",
  );
}

export const statChipClassName =
  "inline-flex items-center gap-1 rounded-md bg-muted/80 px-2 py-1 text-xs font-medium text-foreground ring-1 ring-border/60";
