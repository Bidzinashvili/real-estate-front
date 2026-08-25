import Link from "next/link";
import { Archive, Bell, RefreshCw, Tags } from "lucide-react";
import type { Property } from "@/features/properties/types";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";

type PropertyViewActionsCardProps = {
  property: Property;
  canEdit: boolean;
  isArchiving: boolean;
  archiveError: string | null;
  matchPercentage: number | null;
  onOpenReminders: () => void;
  onArchive: () => void;
  onOpenChangeStatus: () => void;
};

export function PropertyViewActionsCard({
  property,
  canEdit,
  isArchiving,
  archiveError,
  matchPercentage,
  onOpenReminders,
  onArchive,
  onOpenChangeStatus,
}: PropertyViewActionsCardProps) {
  return (
    <section className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenReminders}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
        >
          <Bell className="h-3.5 w-3.5" aria-hidden="true" />
          შეხსენება
        </button>
        {canEdit ? (
          <Link
            href={`/properties/${property.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <Tags className="h-3.5 w-3.5" aria-hidden="true" />
            ფერადი ლეიბლები
          </Link>
        ) : null}
        {canEdit ? (
          <button
            type="button"
            onClick={onOpenChangeStatus}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            სტატუსის შეცვლა
          </button>
        ) : null}
        {canEdit ? (
          <button
            type="button"
            disabled={isArchiving || isPropertyArchived(property)}
            onClick={onArchive}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Archive className="h-3.5 w-3.5" aria-hidden="true" />
            {isArchiving ? "არქივდება..." : "დაარქივება"}
          </button>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-success-muted px-3 py-1.5 text-xs font-semibold text-success-foreground">
          ინფორმაციის შევსება: {matchPercentage ?? "—"}%
        </span>
      </div>
      {archiveError ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {archiveError}
        </p>
      ) : null}
    </section>
  );
}
