"use client";

import type { Property } from "@/features/properties/types";
import { formatRenovationLabel } from "@/features/properties/addPropertyFormOptions";
import {
  DetailDateTime,
  DetailMultiline,
  DetailNumber,
  DetailPhone,
  DetailText,
  DetailYesNo,
} from "@/widgets/PropertyDetails/DetailDisplay";

type PropertyDetailsReadOnlySectionsProps = {
  property: Property;
  showPrivateNotes: boolean;
};

export function PropertyDetailsReadOnlySections({
  property,
  showPrivateNotes,
}: PropertyDetailsReadOnlySectionsProps) {
  return (
    <>
      <section className="space-y-4" aria-labelledby="meta-heading">
        <h2
          id="meta-heading"
          className="text-sm font-semibold text-slate-800"
        >
          Listing metadata
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="Property type" value={property.propertyType} />
          <DetailText label="Cadastral code" value={property.cadastralCode} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="Owner name" value={property.ownerName} />
          <DetailPhone label="Owner phone" value={property.ownerPhone} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailPhone label="Owner whatsapp" value={property.ownerWhatsapp} />
          <DetailText label="External site id" value={property.ourSiteId} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="MyHome id" value={property.myHomeId} />
          <DetailText label="SSGe id" value={property.ssGeId} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailDateTime label="Created at" value={property.createdAt} />
          <DetailDateTime label="Updated at" value={property.updatedAt} />
        </div>
      </section>

      <section className="space-y-3 pt-2" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-sm font-semibold text-slate-800">
          Notes &amp; attachments
        </h2>

        {showPrivateNotes ? (
          <>
            <DetailMultiline label="Comment" value={property.comment} />
            <DetailMultiline
              label="Internal comment"
              value={property.internalComment}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailDateTime label="Reminder date" value={property.reminderDate} />
              <DetailDateTime label="Comment date" value={property.commentDate} />
            </div>
          </>
        ) : (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Comments and internal notes are only visible to the listing agent and
            administrators.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="Assigned agent" value={property.userId} />
        </div>
      </section>

      {property.apartment && (
        <section className="space-y-3 pt-2" aria-labelledby="ro-apt-heading">
          <h2 id="ro-apt-heading" className="text-sm font-semibold text-slate-800">
            Apartment details
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailText
              label="Building number"
              value={property.apartment.buildingNumber}
            />
            <DetailText
              label="Building condition"
              value={property.apartment.buildingCondition}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailText label="Project" value={property.apartment.project} />
            <DetailText
              label="Renovation"
              value={formatRenovationLabel(property.apartment.renovation)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber label="Bedrooms" value={property.apartment.bedrooms} />
            {property.dealType === "RENT" && (
              <DetailNumber
                label="Min Rental Period (months)"
                value={property.apartment.minRentalPeriod}
                suffix="months"
              />
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailYesNo label="Elevator" value={property.apartment.elevator} />
            <DetailYesNo
              label="Central heating"
              value={property.apartment.centralHeating}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailYesNo
              label="Air conditioner"
              value={property.apartment.airConditioner}
            />
            <DetailText
              label="Kitchen type"
              value={property.apartment.kitchenType}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailYesNo label="Furnished" value={property.apartment.furnished} />
            <DetailYesNo label="Parking" value={property.apartment.parking} />
            <DetailYesNo
              label="Pets allowed"
              value={Boolean(property.apartment.petsAllowed)}
            />
          </div>
        </section>
      )}
    </>
  );
}
