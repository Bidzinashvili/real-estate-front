"use client";

import type { GeneratePublicTextDraft } from "@/features/properties/propertyApiTypes";
import { SectionCard } from "@/shared/ui/SectionCard";
import { HistoryNoteField } from "@/widgets/HistoryNoteField/HistoryNoteField";
import { UploadListingTextGenerateField } from "@/widgets/Properties/UploadListingTextGenerateField";

type PropertyFormAdditionalInfoSectionProps = {
  publicComment: string;
  privateComment: string;
  internalText: string;
  showPrivateNotes: boolean;
  canEdit: boolean;
  onPublicCommentChange: (nextValue: string) => void;
  onPrivateCommentChange: (nextValue: string) => void;
  onInternalTextChange: (nextValue: string) => void;
  buildGenerateDraft: () => GeneratePublicTextDraft;
  textareaClassName: string;
};

export function PropertyFormAdditionalInfoSection({
  publicComment,
  privateComment,
  internalText,
  showPrivateNotes,
  canEdit,
  onPublicCommentChange,
  onPrivateCommentChange,
  onInternalTextChange,
  buildGenerateDraft,
  textareaClassName,
}: PropertyFormAdditionalInfoSectionProps) {
  return (
    <SectionCard title="დამატებითი ინფორმაცია">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="publicComment" className="block text-sm font-medium text-foreground">
            კომენტარი
          </label>
          <textarea
            id="publicComment"
            rows={4}
            value={publicComment}
            onChange={(event) => onPublicCommentChange(event.target.value)}
            disabled={!canEdit}
            className={`${textareaClassName} min-h-[6rem] resize-y`}
          />
        </div>

        <UploadListingTextGenerateField
          id="internalText"
          value={internalText}
          onChange={onInternalTextChange}
          buildDraft={buildGenerateDraft}
          textareaClassName={textareaClassName}
          disabled={!canEdit}
        />

        {showPrivateNotes ? (
          <div className="sm:col-span-2">
            <HistoryNoteField
              id="privateComment"
              label="კომენტარი ჩემთვის"
              value={privateComment}
              onChange={onPrivateCommentChange}
              textareaClassName={textareaClassName}
            />
          </div>
        ) : null}
      </div>
    </SectionCard>
  );
}
