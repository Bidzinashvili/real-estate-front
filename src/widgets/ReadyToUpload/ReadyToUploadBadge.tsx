import { Upload } from "lucide-react";
import { READY_TO_UPLOAD_COPY } from "@/features/readyToUpload/readyToUploadCopy";

type ReadyToUploadBadgeProps = {
  isReady: boolean | undefined;
};

export function ReadyToUploadBadge({ isReady }: ReadyToUploadBadgeProps) {
  if (isReady !== true) {
    return null;
  }

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-sky-700 px-2.5 py-0.5 text-xs font-semibold text-white"
      title={READY_TO_UPLOAD_COPY.hint}
    >
      <Upload className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {READY_TO_UPLOAD_COPY.badgeLabel}
    </span>
  );
}
