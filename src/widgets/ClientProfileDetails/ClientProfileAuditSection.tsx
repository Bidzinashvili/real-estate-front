import { auditActionLabel } from "@/features/clientProfiles/display";
import type { ClientProfileAudit } from "@/features/clientProfiles/types";
import { formatLifecycleDateTime } from "@/features/lifecycle/formatLifecycleDate";

type ClientProfileAuditSectionProps = {
  audits: ClientProfileAudit[];
};

export function ClientProfileAuditSection({
  audits,
}: ClientProfileAuditSectionProps) {
  if (audits.length === 0) {
    return null;
  }

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="text-base font-semibold text-foreground">აუდიტი</h2>
      <ul className="mt-3 space-y-2">
        {audits.map((audit) => {
          const when = formatLifecycleDateTime(audit.createdAt);
          return (
            <li
              key={audit.id}
              className="rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm"
            >
              <p className="font-medium text-foreground">
                {auditActionLabel(audit.action)}
              </p>
              {when ? (
                <p className="text-xs text-muted-foreground">{when}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
