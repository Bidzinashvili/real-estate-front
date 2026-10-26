"use client";

import type { GeneratePublicTextDraft } from "@/features/properties/propertyApiTypes";
import { SectionCard } from "@/shared/ui/SectionCard";
import { addPropertyInputClassName } from "@/widgets/AddProperty/addPropertyFormFields";
import { HistoryNoteField } from "@/widgets/HistoryNoteField/HistoryNoteField";
import { UploadListingTextGenerateField } from "@/widgets/Properties/UploadListingTextGenerateField";

type AddPropertyAdditionalInfoSectionProps = {
  publicComment: string;
  privateComment: string;
  internalText: string;
  onPublicCommentChange: (nextValue: string) => void;
  onPrivateCommentChange: (nextValue: string) => void;
  onInternalTextChange: (nextValue: string) => void;
  buildGenerateDraft: () => GeneratePublicTextDraft;
};

export function AddPropertyAdditionalInfoSection({
  publicComment,
  privateComment,
  internalText,
  onPublicCommentChange,
  onPrivateCommentChange,
  onInternalTextChange,
  buildGenerateDraft,
}: AddPropertyAdditionalInfoSectionProps) {
  const textareaClassName = addPropertyInputClassName();

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
            className={`${textareaClassName} min-h-[6rem] resize-y`}
          />
        </div>

        <UploadListingTextGenerateField
          id="internalText"
          value={internalText}
          onChange={onInternalTextChange}
          buildDraft={buildGenerateDraft}
          textareaClassName={textareaClassName}
        />

        <div className="sm:col-span-2">
          <HistoryNoteField
            id="privateComment"
            label="კომენტარი ჩემთვის"
            value={privateComment}
            onChange={onPrivateCommentChange}
            textareaClassName={textareaClassName}
          />
        </div>
      </div>
    </SectionCard>
  );
}
