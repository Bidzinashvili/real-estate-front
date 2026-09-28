"use client";

import type { Property } from "@/features/properties/types";
import { hasAuthorizedOwnerInformation } from "@/features/properties/authorizedPropertyFields";
import { usePropertyOwnerContactsForProperty } from "@/features/propertyOwners/usePropertyOwnerContactsForProperty";
import { OwnerProfileNameLink } from "@/widgets/PropertyOwners/OwnerProfileNameLink";
import { PropertyOwnerLabeledPhoneList } from "@/widgets/PropertyDetails/PropertyOwnerLabeledPhoneList";

type PropertyViewContactCardProps = {
  property: Property;
};

function formatPhoneHref(raw: string): string {
  return raw.replace(/\s+/g, "");
}

export function PropertyViewContactCard({ property }: PropertyViewContactCardProps) {
  const { phoneDisplayItems } = usePropertyOwnerContactsForProperty(property);

  if (!hasAuthorizedOwnerInformation(property)) {
    return null;
  }

  const propertyOwner = property.propertyOwner ?? null;
  const fallbackName = propertyOwner ? "" : property.ownerName?.trim() ?? "";
  const ownerWhatsapp = property.ownerWhatsapp?.trim() ?? "";

  if (
    !propertyOwner &&
    !fallbackName &&
    phoneDisplayItems.length === 0 &&
    ownerWhatsapp === ""
  ) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-warning/30 bg-warning-muted/40 p-5 shadow-sm ring-1 ring-border sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-warning-foreground">
        შიდა კონტაქტი
      </p>
      <h2 className="mt-1 text-base font-semibold text-foreground">მესაკუთრე</h2>

      <div className="mt-4 space-y-3">
        {propertyOwner ? (
          <div>
            <p className="text-xs text-muted-foreground">სახელი</p>
            <p className="mt-0.5">
              <OwnerProfileNameLink propertyOwner={propertyOwner} />
            </p>
          </div>
        ) : fallbackName ? (
          <div>
            <p className="text-xs text-muted-foreground">სახელი</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{fallbackName}</p>
          </div>
        ) : null}

        {phoneDisplayItems.length > 0 ? (
          <div>
            <p className="text-xs text-muted-foreground">ტელეფონი</p>
            <PropertyOwnerLabeledPhoneList items={phoneDisplayItems} />
          </div>
        ) : null}

        {ownerWhatsapp ? (
          <div>
            <p className="text-xs text-muted-foreground">WhatsApp</p>
            <a
              href={`https://wa.me/${formatPhoneHref(ownerWhatsapp).replace(/^\+/, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-0.5 inline-block text-sm font-medium text-foreground underline-offset-2 hover:underline"
            >
              {ownerWhatsapp}
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
