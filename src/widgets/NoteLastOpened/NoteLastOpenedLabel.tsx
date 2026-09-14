import { NOTE_LAST_OPENED_COPY } from "@/features/noteLastOpened/noteLastOpenedCopy";
import { formatTbilisiDateTime } from "@/shared/lib/formatDate";
import { cn } from "@/shared/lib/utils";

type NoteLastOpenedLabelProps = {
  noteLastOpenedAt: string | null | undefined;
  className?: string;
};

export function NoteLastOpenedLabel({
  noteLastOpenedAt,
  className,
}: NoteLastOpenedLabelProps) {
  if (noteLastOpenedAt === undefined) {
    return null;
  }

  const formattedOpenedAt =
    noteLastOpenedAt === null ? null : formatTbilisiDateTime(noteLastOpenedAt);
  const label =
    formattedOpenedAt === null
      ? NOTE_LAST_OPENED_COPY.neverOpened
      : `${NOTE_LAST_OPENED_COPY.openedLabelPrefix} ${formattedOpenedAt}`;

  return (
    <p className={cn("text-xs text-muted-foreground", className)}>{label}</p>
  );
}
