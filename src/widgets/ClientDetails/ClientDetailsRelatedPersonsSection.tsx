import type { RelatedPerson } from "@/features/clients/types";

type ClientDetailsRelatedPersonsSectionProps = {
  relatedPersons: RelatedPerson[];
};

export function ClientDetailsRelatedPersonsSection({
  relatedPersons,
}: ClientDetailsRelatedPersonsSectionProps) {
  if (relatedPersons.length === 0) return null;

  return (
    <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">დაკავშირებული პირები</h2>
      <div className="space-y-3">
        {relatedPersons.map((person) => (
          <div
            key={person.id}
            className="flex flex-wrap gap-x-6 gap-y-1 rounded-lg border border-border bg-muted px-4 py-3"
          >
            <div>
              <p className="text-xs text-muted-foreground">სახელი</p>
              <p className="text-sm font-medium text-foreground">{person.name}</p>
            </div>
            {person.phone && (
              <div>
                <p className="text-xs text-muted-foreground">ტელეფონი</p>
                <p className="text-sm text-foreground">{person.phone}</p>
              </div>
            )}
            {person.whatsapp && (
              <div>
                <p className="text-xs text-muted-foreground">WhatsApp</p>
                <p className="text-sm text-foreground">{person.whatsapp}</p>
              </div>
            )}
            {person.relationship && (
              <div>
                <p className="text-xs text-muted-foreground">კავშირი</p>
                <p className="text-sm text-foreground">{person.relationship}</p>
              </div>
            )}
            {person.note && (
              <div className="w-full">
                <p className="text-xs text-muted-foreground">შენიშვნა</p>
                <p className="text-sm text-foreground">{person.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
