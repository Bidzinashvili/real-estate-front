import type { RelatedPerson } from "@/features/clients/types";

type ClientDetailsRelatedPersonsSectionProps = {
  relatedPersons: RelatedPerson[];
};

export function ClientDetailsRelatedPersonsSection({
  relatedPersons,
}: ClientDetailsRelatedPersonsSectionProps) {
  if (relatedPersons.length === 0) return null;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Related persons</h2>
      <div className="space-y-3">
        {relatedPersons.map((person) => (
          <div
            key={person.id}
            className="flex flex-wrap gap-x-6 gap-y-1 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-sm font-medium text-slate-800">{person.name}</p>
            </div>
            {person.phone && (
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm text-slate-800">{person.phone}</p>
              </div>
            )}
            {person.whatsapp && (
              <div>
                <p className="text-xs text-slate-500">WhatsApp</p>
                <p className="text-sm text-slate-800">{person.whatsapp}</p>
              </div>
            )}
            {person.relationship && (
              <div>
                <p className="text-xs text-slate-500">Relationship</p>
                <p className="text-sm text-slate-800">{person.relationship}</p>
              </div>
            )}
            {person.note && (
              <div className="w-full">
                <p className="text-xs text-slate-500">Note</p>
                <p className="text-sm text-slate-800">{person.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
