import { ArrowLeft, Pencil } from "lucide-react";
import { clientMatchesHref } from "@/features/matching/matchingRoutes";
import type { TemporaryLockKey } from "@/features/matching/matchingEnums";
import { ui } from "@/shared/i18n/ui";
import { MatchPercentActions } from "@/widgets/Matching/MatchPercentActions";

type ClientDetailsTopBarProps = {
  clientId: string;
  canRunMatches: boolean;
  canEditStatus: boolean;
  temporaryLockedFields: TemporaryLockKey[];
  onNavigateToList: () => void;
  onNavigateToEdit: () => void;
  onRequestDelete: () => void;
  onOpenChangeStatus: () => void;
};

export function ClientDetailsTopBar({
  clientId,
  canRunMatches,
  canEditStatus,
  temporaryLockedFields,
  onNavigateToList,
  onNavigateToEdit,
  onRequestDelete,
  onOpenChangeStatus,
}: ClientDetailsTopBarProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <button
        type="button"
        onClick={onNavigateToList}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        ყველა კლიენტი
      </button>

      <div className="flex items-center gap-2">
        {canRunMatches ? (
          <MatchPercentActions
            allHref={clientMatchesHref(clientId, "GLOBAL")}
            mineHref={clientMatchesHref(clientId, "MINE")}
            allLabel={`${ui.matchAll}: ${ui.allListings}`}
            mineLabel={`${ui.matchMine}: ${ui.myListings}`}
            sessionKind="client"
            entityId={clientId}
            temporaryLockedFields={temporaryLockedFields}
          />
        ) : null}
        {canEditStatus ? (
          <button
            type="button"
            onClick={onOpenChangeStatus}
            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            სტატუსის შეცვლა
          </button>
        ) : null}
        <button
          type="button"
          onClick={onNavigateToEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          რედაქტირება
        </button>
        <button
          type="button"
          onClick={onRequestDelete}
          className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive shadow-sm transition hover:bg-destructive/15"
        >
          წაშლა
        </button>
      </div>
    </div>
  );
}
