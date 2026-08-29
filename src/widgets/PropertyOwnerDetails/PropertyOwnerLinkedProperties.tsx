"use client";

import { useRouter } from "next/navigation";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { ARCHIVE_COPY } from "@/features/lifecycle/archiveCopy";
import type { PropertyOwnerLinkedProperty } from "@/features/propertyOwners/types";
import {
  ownerLinkedPropertySubtitle,
  ownerLinkedPropertyTitle,
} from "@/features/propertyOwners/ownerLinkedPropertyLabel";

type PropertyOwnerLinkedPropertiesProps = {
  listings: PropertyOwnerLinkedProperty[];
  propertyCount: number;
};

export function PropertyOwnerLinkedProperties({
  listings,
  propertyCount,
}: PropertyOwnerLinkedPropertiesProps) {
  const router = useRouter();

  return (
    <section className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">
          დაკავშირებული განცხადებები
        </h2>
        <span className="text-xs text-muted-foreground">{propertyCount}</span>
      </div>

      {listings.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          ამ მეპატრონეს განცხადებები არ აქვს.
        </p>
      ) : (
        <ul className="space-y-2">
          {listings.map((listing) => {
            const subtitle = ownerLinkedPropertySubtitle(listing);
            return (
              <li key={listing.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/properties/${listing.id}`)}
                  className="flex w-full flex-col gap-1 rounded-lg border border-border bg-muted/40 px-4 py-3 text-left transition hover:bg-muted"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {ownerLinkedPropertyTitle(listing)}
                    </span>
                    <LifecycleStatusBadge
                      kind="property"
                      status={listing.status}
                      size="sm"
                      isArchived={Boolean(listing.archivedAt)}
                    />
                    {listing.archivedAt ? (
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {ARCHIVE_COPY.archivedBadge}
                      </span>
                    ) : null}
                  </div>
                  {subtitle ? (
                    <span className="text-xs text-muted-foreground">{subtitle}</span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
