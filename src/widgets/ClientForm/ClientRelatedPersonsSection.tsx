"use client";

import type { UseFormRegister, FieldArrayWithId } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import type { ClientFormValues } from "@/features/clients/clientFormSchema";

type RelatedPersonValue = {
  name: string;
  phone: string;
  whatsapp: string;
  relationship: string;
  note: string;
};

type ClientRelatedPersonsSectionProps = {
  register: UseFormRegister<ClientFormValues>;
  personFields: FieldArrayWithId<ClientFormValues, "relatedPersons">[];
  appendPerson: (value: RelatedPersonValue) => void;
  removePerson: (index: number) => void;
};

const EMPTY_PERSON: RelatedPersonValue = {
  name: "",
  phone: "",
  whatsapp: "",
  relationship: "",
  note: "",
};

export function ClientRelatedPersonsSection({
  register,
  personFields,
  appendPerson,
  removePerson,
}: ClientRelatedPersonsSectionProps) {
  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">დაკავშირებული პირები</h2>
        <button
          type="button"
          onClick={() => appendPerson(EMPTY_PERSON)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          პირის დამატება
        </button>
      </div>

      {personFields.length === 0 && (
        <p className="text-sm text-muted-foreground">დაკავშირებული პირები არ არის დამატებული.</p>
      )}

      <div className="space-y-4">
        {personFields.map((field, personIndex) => (
          <div
            key={field.id}
            className="relative rounded-lg border border-border bg-muted p-4"
          >
            <button
              type="button"
              onClick={() => removePerson(personIndex)}
              className="absolute right-3 top-3 text-muted-foreground transition hover:text-destructive"
              aria-label="პირის წაშლა"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">სახელი</label>
                <input
                  type="text"
                  {...register(`relatedPersons.${personIndex}.name`)}
                  className="block w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">ტელეფონი</label>
                <input
                  type="tel"
                  {...register(`relatedPersons.${personIndex}.phone`)}
                  className="block w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">WhatsApp</label>
                <input
                  type="tel"
                  {...register(`relatedPersons.${personIndex}.whatsapp`)}
                  className="block w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">კავშირი</label>
                <input
                  type="text"
                  {...register(`relatedPersons.${personIndex}.relationship`)}
                  placeholder="მაგ. მეუღლე, მშობელი"
                  className="block w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-medium text-foreground">შენიშვნა</label>
                <textarea
                  rows={2}
                  {...register(`relatedPersons.${personIndex}.note`)}
                  className="block w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
