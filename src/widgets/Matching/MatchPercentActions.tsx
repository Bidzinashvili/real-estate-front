import Link from "next/link";
import { cn } from "@/shared/lib/utils";

type MatchPercentActionsProps = {
  allHref: string;
  mineHref: string;
  allLabel: string;
  mineLabel: string;
  className?: string;
};

const ACTION_BASE =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold leading-none text-white shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function MatchPercentActions({
  allHref,
  mineHref,
  allLabel,
  mineLabel,
  className,
}: MatchPercentActionsProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <Link
        href={allHref}
        aria-label={allLabel}
        title={allLabel}
        onClick={(event) => event.stopPropagation()}
        className={`${ACTION_BASE} bg-success hover:bg-success/90`}
      >
        %
      </Link>
      <Link
        href={mineHref}
        aria-label={mineLabel}
        title={mineLabel}
        onClick={(event) => event.stopPropagation()}
        className={`${ACTION_BASE} bg-violet-600 hover:bg-violet-700`}
      >
        %
      </Link>
    </div>
  );
}
