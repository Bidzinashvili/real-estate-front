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
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">Related persons</h2>
        <button
          type="button"
          onClick={() => appendPerson(EMPTY_PERSON)}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add person
        </button>
      </div>

      {personFields.length === 0 && (
        <p className="text-sm text-slate-500">No related persons added.</p>
      )}

      <div className="space-y-4">
        {personFields.map((field, personIndex) => (
          <div
            key={field.id}
            className="relative rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <button
              type="button"
              onClick={() => removePerson(personIndex)}
              className="absolute right-3 top-3 text-slate-400 transition hover:text-red-600"
              aria-label="Remove person"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  {...register(`relatedPersons.${personIndex}.name`)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Phone</label>
                <input
                  type="tel"
                  {...register(`relatedPersons.${personIndex}.phone`)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">WhatsApp</label>
                <input
                  type="tel"
                  {...register(`relatedPersons.${personIndex}.whatsapp`)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">Relationship</label>
                <input
                  type="text"
                  {...register(`relatedPersons.${personIndex}.relationship`)}
                  placeholder="e.g. spouse, parent"
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700">Note</label>
                <textarea
                  rows={2}
                  {...register(`relatedPersons.${personIndex}.note`)}
                  className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-slate-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
