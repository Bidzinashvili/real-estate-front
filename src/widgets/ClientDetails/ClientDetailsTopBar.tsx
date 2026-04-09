import { ArrowLeft, Pencil } from "lucide-react";

type ClientDetailsTopBarProps = {
  onNavigateToList: () => void;
  onNavigateToEdit: () => void;
  onRequestDelete: () => void;
};

export function ClientDetailsTopBar({
  onNavigateToList,
  onNavigateToEdit,
  onRequestDelete,
}: ClientDetailsTopBarProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <button
        type="button"
        onClick={onNavigateToList}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All clients
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onNavigateToEdit}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edit
        </button>
        <button
          type="button"
          onClick={onRequestDelete}
          className="inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 shadow-sm transition hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
