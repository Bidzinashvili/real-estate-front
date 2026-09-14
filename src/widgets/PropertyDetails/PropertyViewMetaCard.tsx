import type { Property } from "@/features/properties/types";

type PropertyViewMetaCardProps = {
  property: Property;
};

export function PropertyViewMetaCard({ property }: PropertyViewMetaCardProps) {
  const labels = property.labels ?? [];
  const activeExternalIds = (property.externalIds ?? []).filter(
    (externalId) => externalId.archivedAt === null,
  );
  const cadastralCode = property.cadastralCode?.trim() ?? "";
  const ourSiteId = property.ourSiteId?.trim() ?? "";
  const myHomeId = property.myHomeId?.trim() ?? "";
  const ssGeId = property.ssGeId?.trim() ?? "";

  const hasContent =
    labels.length > 0 ||
    activeExternalIds.length > 0 ||
    cadastralCode !== "" ||
    ourSiteId !== "" ||
    myHomeId !== "" ||
    ssGeId !== "";

  if (!hasContent) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-muted/60 p-5 ring-1 ring-border sm:p-6">
      <h2 className="text-sm font-semibold text-foreground">დამატებითი მონაცემები</h2>
      <dl className="mt-3 space-y-3">
        {cadastralCode ? (
          <div>
            <dt className="text-xs text-muted-foreground">საკადასტრო კოდი</dt>
            <dd className="mt-0.5 text-sm text-foreground">{cadastralCode}</dd>
          </div>
        ) : null}
        {labels.length > 0 ? (
          <div>
            <dt className="text-xs text-muted-foreground">ლეიბლები</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {labels.map((label) => (
                <span
                  key={label.id}
                  className="inline-flex rounded-full bg-card px-2.5 py-0.5 text-xs font-medium text-foreground ring-1 ring-border"
                >
                  {label.name}
                </span>
              ))}
            </dd>
          </div>
        ) : null}
        {ourSiteId ? (
          <div>
            <dt className="text-xs text-muted-foreground">გარე საიტის ID</dt>
            <dd className="mt-0.5 text-sm text-foreground">{ourSiteId}</dd>
          </div>
        ) : null}
        {myHomeId ? (
          <div>
            <dt className="text-xs text-muted-foreground">MyHome ID</dt>
            <dd className="mt-0.5 text-sm text-foreground">{myHomeId}</dd>
          </div>
        ) : null}
        {ssGeId ? (
          <div>
            <dt className="text-xs text-muted-foreground">SS.ge ID</dt>
            <dd className="mt-0.5 text-sm text-foreground">{ssGeId}</dd>
          </div>
        ) : null}
        {activeExternalIds.length > 0 ? (
          <div>
            <dt className="text-xs text-muted-foreground">გარე ID-ები</dt>
            <dd className="mt-1 space-y-1 text-sm text-foreground">
              {activeExternalIds.map((externalId) => (
                <p key={externalId.id}>
                  {externalId.platform}: {externalId.value}
                </p>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
