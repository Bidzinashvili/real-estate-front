import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";

type ClientDetailsTopBarProps = {
  clientId: string;
  canRunMatches: boolean;
  onNavigateToList: () => void;
  onNavigateToEdit: () => void;
  onRequestDelete: () => void;
};

export function ClientDetailsTopBar({
  clientId,
  canRunMatches,
  onNavigateToList,
  onNavigateToEdit,
  onRequestDelete,
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
          <Link
            href={`/clients/${clientId}/matches`}
            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            შესაბამისი განცხადებების ძიება
          </Link>
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
