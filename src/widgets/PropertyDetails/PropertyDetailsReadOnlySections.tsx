"use client";

import { formatPropertyStatusLabel, type Property } from "@/features/properties/types";
import {
  formatHotelScopeLabel,
  formatRenovationLabel,
} from "@/features/properties/addPropertyFormOptions";
import {
  DetailDateTime,
  DetailMultiline,
  DetailNumber,
  DetailPhone,
  DetailText,
  DetailYesNo,
  DetailVerification,
} from "@/widgets/PropertyDetails/DetailDisplay";

type PropertyDetailsReadOnlySectionsProps = {
  property: Property;
  showPrivateNotes: boolean;
};

export function PropertyDetailsReadOnlySections({
  property,
  showPrivateNotes,
}: PropertyDetailsReadOnlySectionsProps) {
  const activeExternalIds = property.externalIds.filter(
    (externalId) => externalId.archivedAt === null,
  );
  const ownerPhones = property.ownerPhones
    .map((ownerPhone) => ownerPhone.trim())
    .filter((ownerPhone) => ownerPhone !== "")
    .join(", ");

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
          <DetailText
            label="Listing status"
            value={formatPropertyStatusLabel(property.status)}
          />
          <DetailText label="Cadastral code" value={property.cadastralCode} />
        </div>

        {property.propertyType === "HOTEL" && property.hotelScope ? (
          <DetailText
            label="Hotel scope"
            value={formatHotelScopeLabel(property.hotelScope)}
          />
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="Owner name" value={property.ownerName} />
          <DetailText label="Owner phones" value={ownerPhones} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailPhone label="Owner whatsapp" value={property.ownerWhatsapp} />
          <DetailText label="External site id" value={property.ourSiteId} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="MyHome id" value={property.myHomeId} />
          <DetailText label="SSGe id" value={property.ssGeId} />
        </div>
        {activeExternalIds.length > 0 ? (
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <p className="font-medium text-slate-800">External IDs</p>
            {activeExternalIds.map((externalId) => (
              <p key={externalId.id}>
                {externalId.platform}: {externalId.value}
              </p>
            ))}
          </div>
        ) : null}

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
            <DetailMultiline
              label="Comment for myself"
              value={property.privateComment ?? property.comment}
            />
            <DetailMultiline
              label="Upload text"
              value={property.internalText ?? property.internalComment}
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
            <DetailNumber
              label="Total floors"
              value={property.apartment.totalFloors}
            />
            <DetailNumber
              label="Ceiling height"
              value={property.apartment.ceilingHeight}
              suffix="m"
            />
            <DetailNumber
              label="Balcony area"
              value={property.apartment.balconyArea}
              suffix="m²"
            />
            {property.dealType === "RENT" || property.dealType === "DAILY_RENT" ? (
              <DetailNumber
                label="Min Rental Period (months)"
                value={property.apartment.minRentalPeriod}
                suffix="months"
              />
            ) : null}
            <DetailNumber label="Bathrooms" value={property.apartment.bathrooms} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailVerification
              label="Elevator"
              value={property.apartment.elevator}
              isToBeVerified={property.apartment.needsVerification.includes("elevator")}
            />
            <DetailVerification
              label="Central heating"
              value={property.apartment.centralHeating}
              isToBeVerified={property.apartment.needsVerification.includes(
                "centralHeating",
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailVerification
              label="Air conditioner"
              value={property.apartment.airConditioner}
              isToBeVerified={property.apartment.needsVerification.includes(
                "airConditioner",
              )}
            />
            <DetailText
              label="Kitchen type"
              value={property.apartment.kitchenType}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailVerification
              label="Furnished"
              value={property.apartment.furnished}
              isToBeVerified={property.apartment.needsVerification.includes("furnished")}
            />
            <DetailNumber
              label="Parking spaces"
              value={property.apartment.parkingSpaces}
            />
            <DetailVerification
              label="Good view"
              value={property.apartment.goodView}
              isToBeVerified={property.apartment.needsVerification.includes("goodView")}
            />
            <DetailVerification
              label="Pets allowed"
              value={property.apartment.petsAllowed}
              isToBeVerified={property.apartment.needsVerification.includes(
                "petsAllowed",
              )}
            />
          </div>
        </section>
      )}
    </>
  );
}
