"use client";

import { formatPropertyStatusLabel, type Property } from "@/features/properties/types";
import {
  formatBuildingConditionLabel,
  formatHotelScopeLabel,
  formatKitchenTypeLabel,
  formatPropertyTypeLabel,
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
import { OwnerProfileNameLink } from "@/widgets/PropertyOwners/OwnerProfileNameLink";

type PropertyDetailsReadOnlySectionsProps = {
  property: Property;
  showPrivateNotes: boolean;
  hideOwnerFields?: boolean;
};

export function PropertyDetailsReadOnlySections({
  property,
  showPrivateNotes,
  hideOwnerFields = false,
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
          className="text-sm font-semibold text-foreground"
        >
          განცხადების მონაცემები
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="უძრავი ქონების ტიპი" value={formatPropertyTypeLabel(property.propertyType)} />
          <DetailText
            label="განცხადების სტატუსი"
            value={formatPropertyStatusLabel(property.status)}
          />
          <DetailText label="საკადასტრო კოდი" value={property.cadastralCode} />
        </div>

        {property.propertyType === "HOTEL" && property.hotelScope ? (
          <DetailText
            label="სასტუმროს ტიპი"
            value={formatHotelScopeLabel(property.hotelScope)}
          />
        ) : null}

        {hideOwnerFields ? null : (
          <div className="grid gap-4 sm:grid-cols-2">
            {property.propertyOwner ? (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">მესაკუთრე</p>
                <OwnerProfileNameLink propertyOwner={property.propertyOwner} />
              </div>
            ) : (
              <DetailText label="მესაკუთრის სახელი" value={property.ownerName} />
            )}
            <DetailText label="მესაკუთრის ტელეფონები" value={ownerPhones} />
          </div>
        )}

        {hideOwnerFields ? (
          <DetailText label="გარე საიტის ID" value={property.ourSiteId} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailPhone label="მესაკუთრის WhatsApp" value={property.ownerWhatsapp} />
            <DetailText label="გარე საიტის ID" value={property.ourSiteId} />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="MyHome ID" value={property.myHomeId} />
          <DetailText label="SS.ge ID" value={property.ssGeId} />
        </div>
        {activeExternalIds.length > 0 ? (
          <div className="space-y-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground">
            <p className="font-medium text-foreground">გარე ID-ები</p>
            {activeExternalIds.map((externalId) => (
              <p key={externalId.id}>
                {externalId.platform}: {externalId.value}
              </p>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailDateTime label="შექმნის თარიღი" value={property.createdAt} />
          <DetailDateTime label="განახლების თარიღი" value={property.updatedAt} />
        </div>
      </section>

      <section className="space-y-3 pt-2" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-sm font-semibold text-foreground">
          შენიშვნები და დანართები
        </h2>

        {showPrivateNotes ? (
          <>
            <DetailMultiline
              label="შიდა კომენტარი"
              value={property.privateComment ?? property.comment}
            />
            <DetailMultiline
              label="ატვირთვის ტექსტი"
              value={property.internalText ?? property.internalComment}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailDateTime label="შეხსენების თარიღი" value={property.reminderDate} />
              <DetailDateTime label="კომენტარის თარიღი" value={property.commentDate} />
            </div>
          </>
        ) : (
          <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
            კომენტარები და შიდა შენიშვნები მხოლოდ განცხადების აგენტსა და ადმინისტრატორებს ეჩვენებათ.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="მიმაგრებული აგენტი" value={property.userId} />
        </div>
      </section>

      {property.apartment && (
        <section className="space-y-3 pt-2" aria-labelledby="ro-apt-heading">
          <h2 id="ro-apt-heading" className="text-sm font-semibold text-foreground">
            ბინის დეტალები
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailText
              label="კორპუსის ნომერი"
              value={property.apartment.buildingNumber}
            />
            <DetailText
              label="შენობის მდგომარეობა"
              value={formatBuildingConditionLabel(property.apartment.buildingCondition)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailText label="პროექტი" value={property.apartment.project} />
            <DetailText
              label="რემონტი"
              value={formatRenovationLabel(property.apartment.renovation)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber label="საძინებლები" value={property.apartment.bedrooms} />
            <DetailNumber
              label="სართულიანობა"
              value={property.apartment.totalFloors}
            />
            <DetailNumber
              label="ჭერის სიმაღლე"
              value={property.apartment.ceilingHeight}
              suffix="მ"
            />
            <DetailNumber
              label="აივნის ფართობი"
              value={property.apartment.balconyArea}
              suffix="მ²"
            />
            {property.dealType === "RENT" || property.dealType === "DAILY_RENT" ? (
              <DetailNumber
                label="მინიმალური ქირის ვადა (თვე)"
                value={property.apartment.minRentalPeriod}
                suffix="თვე"
              />
            ) : null}
            <DetailNumber label="სველი წერტილები" value={property.apartment.bathrooms} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailVerification
              label="ლიფტი"
              value={property.apartment.elevator}
              isToBeVerified={property.apartment.needsVerification.includes("elevator")}
            />
            <DetailVerification
              label="ცენტრალური გათბობა"
              value={property.apartment.centralHeating}
              isToBeVerified={property.apartment.needsVerification.includes(
                "centralHeating",
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailVerification
              label="კონდიციონერი"
              value={property.apartment.airConditioner}
              isToBeVerified={property.apartment.needsVerification.includes(
                "airConditioner",
              )}
            />
            <DetailText
              label="სამზარეულოს ტიპი"
              value={formatKitchenTypeLabel(property.apartment.kitchenType)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailVerification
              label="ავეჯით"
              value={property.apartment.furnished}
              isToBeVerified={property.apartment.needsVerification.includes("furnished")}
            />
            <DetailNumber
              label="პარკინგის ადგილები"
              value={property.apartment.parkingSpaces}
            />
            <DetailVerification
              label="კარგი ხედი"
              value={property.apartment.goodView}
              isToBeVerified={property.apartment.needsVerification.includes("goodView")}
            />
            <DetailVerification
              label="ცხოველები დაიშვება"
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
