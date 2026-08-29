"use client";

import {
  formatHotelScopeLabelOrUnset,
  formatLandCategoryLabel,
  formatLandUsageLabel,
  isTbilisiCity,
} from "@/features/properties/addPropertyFormOptions";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import type { PropertyFormValues } from "@/features/properties/payloadBuilder";
import { calculatePricePerSquareMeter } from "@/features/properties/pricePerSquareMeter";
import { CANONICAL_AREA_MISSING_LABEL, canonicalPropertyArea } from "@/features/properties/propertyArea";
import {
  DetailMultiline,
  DetailNumber,
  DetailText,
  DetailYesNo,
} from "@/widgets/PropertyDetails/DetailDisplay";

type PropertyListingFieldsViewProps = {
  values: PropertyFormValues;
  showInternalPrice: boolean;
  showPrivateNotes: boolean;
  readOnlyPrivateHouseBalcony?: number | null;
};

export function PropertyListingFieldsView({
  values,
  showInternalPrice,
  showPrivateNotes,
  readOnlyPrivateHouseBalcony,
}: PropertyListingFieldsViewProps) {
  const areaSquareMeters = canonicalPropertyArea(values);
  const pricePerSquareMeter = calculatePricePerSquareMeter(
    values.pricePublic,
    areaSquareMeters,
  );

  return (
    <>
      <section className="space-y-4" aria-labelledby="listing-core-heading">
        <h2
          id="listing-core-heading"
          className="text-sm font-semibold text-foreground"
        >
          განცხადება (მხოლოდ ნახვა)
        </h2>

        <DetailText
          label="გარიგების ტიპი"
          value={formatDealTypeLabel(values.dealType)}
        />

        {values.propertyType === "HOTEL" && (
          <DetailText
            label="სასტუმროს ტიპი"
            value={formatHotelScopeLabelOrUnset(values.hotelScope)}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="ქალაქი" value={values.city} />
          {isTbilisiCity(values.city) ? (
            <DetailText label="უბანი" value={values.district} />
          ) : null}
        </div>

        <DetailText label="მისამართი" value={values.address} />

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailNumber
            label="საჯარო ფასი"
            value={values.pricePublic}
            suffix="₾"
          />
          {showInternalPrice && (
            <DetailNumber
              label="შიდა ფასი"
              value={values.priceInternal}
              suffix="₾"
            />
          )}
          <DetailNumber
            label="ფასი მ²-ზე"
            value={pricePerSquareMeter}
            suffix="₾"
          />
        </div>

        <DetailMultiline label="კომენტარი" value={values.publicComment} />
        {showPrivateNotes ? (
          <>
            <DetailMultiline
              label="კომენტარი ჩემთვის"
              value={values.privateComment}
            />
            <DetailMultiline label="ატვირთვის ტექსტი" value={values.internalText} />
          </>
        ) : null}
      </section>

      {values.apartment && (
        <section className="space-y-3 pt-2" aria-labelledby="apt-heading">
          <h2 id="apt-heading" className="text-sm font-semibold text-foreground">
            ბინა
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber
              label="საერთო ფართობი"
              value={values.apartment.totalArea}
              suffix="მ²"
              requirePositive
              empty={CANONICAL_AREA_MISSING_LABEL}
            />
            <DetailNumber label="ოთახები" value={values.apartment.rooms} />
            <DetailNumber label="სართული" value={values.apartment.floor} />
            <DetailNumber
              label="სართულიანობა"
              value={values.apartment.totalFloors}
            />
            <DetailNumber
              label="ჭერის სიმაღლე"
              value={values.apartment.ceilingHeight}
              suffix="მ"
            />
            <DetailNumber
              label="აივნის ფართობი"
              value={values.apartment.balconyArea}
              suffix="მ²"
            />
            <DetailNumber
              label="პარკინგის ადგილები"
              value={values.apartment.parkingSpaces}
            />
            <DetailYesNo
              label="ავეჯით"
              value={values.apartment.furnished}
            />
            {values.dealType === "RENT" || values.dealType === "DAILY_RENT" ? (
              <DetailNumber
                label="მინიმალური ქირის ვადა (თვე)"
                value={values.apartment.minRentalPeriod ?? undefined}
              />
            ) : null}
          </div>
        </section>
      )}

      {values.privateHouse && (
        <section className="space-y-3 pt-2" aria-labelledby="ph-heading">
          <h2 id="ph-heading" className="text-sm font-semibold text-foreground">
            კერძო სახლი
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber
              label="სახლის ფართობი"
              value={values.privateHouse.houseArea}
              suffix="მ²"
            />
            <DetailNumber
              label="ეზოს ფართობი"
              value={values.privateHouse.yardArea}
              suffix="მ²"
            />
            <DetailNumber
              label="საერთო ფართობი"
              value={values.privateHouse.totalArea}
              suffix="მ²"
              requirePositive
              empty={CANONICAL_AREA_MISSING_LABEL}
            />
            {readOnlyPrivateHouseBalcony !== undefined ? (
              <DetailNumber label="აივნის ფართობი" value={readOnlyPrivateHouseBalcony} />
            ) : null}
            <DetailNumber
              label="პარკინგის ადგილები"
              value={values.privateHouse.parkingSpaces}
            />
            <DetailYesNo
              label="ავეჯით"
              value={Boolean(values.privateHouse.furnished)}
            />
            <DetailYesNo label="აუზი" value={Boolean(values.privateHouse.pool)} />
            <DetailYesNo
              label="ხეხილი"
              value={Boolean(values.privateHouse.fruitTrees)}
            />
            {values.dealType === "RENT" || values.dealType === "DAILY_RENT" ? (
              <DetailNumber
                label="მინიმალური ქირის ვადა (თვე)"
                value={values.privateHouse.minRentalPeriod ?? undefined}
              />
            ) : null}
          </div>
        </section>
      )}

      {values.landPlot && (
        <section className="space-y-3 pt-2" aria-labelledby="land-heading">
          <h2 id="land-heading" className="text-sm font-semibold text-foreground">
            მიწის ნაკვეთი
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber
              label="მიწის ფართობი"
              value={values.landPlot.landArea}
              suffix="მ²"
              requirePositive
              empty={CANONICAL_AREA_MISSING_LABEL}
            />
            <DetailText
              label="მიწის კატეგორია"
              value={formatLandCategoryLabel(values.landPlot.landCategory)}
            />
            <DetailText
              label="მიწის დანიშნულება"
              value={formatLandUsageLabel(values.landPlot.landUsage)}
            />
            <DetailYesNo
              label="საინვესტიციო"
              value={Boolean(values.landPlot.forInvestment)}
            />
            <DetailYesNo
              label="იყოფა"
              value={Boolean(values.landPlot.canBeDivided)}
            />
            {values.dealType === "RENT" || values.dealType === "DAILY_RENT" ? (
              <DetailNumber
                label="მინიმალური ქირის ვადა (თვე)"
                value={values.landPlot.minRentalPeriod ?? undefined}
              />
            ) : null}
          </div>
        </section>
      )}

      {values.commercial && (
        <section className="space-y-3 pt-2" aria-labelledby="com-heading">
          <h2 id="com-heading" className="text-sm font-semibold text-foreground">
            კომერციული
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber
              label="ფართობი"
              value={values.commercial.area}
              suffix="მ²"
              requirePositive
              empty={CANONICAL_AREA_MISSING_LABEL}
            />
            <DetailNumber
              label="სართულიანობა"
              value={values.commercial.totalFloors}
            />
            <DetailNumber
              label="ჭერის სიმაღლე"
              value={values.commercial.ceilingHeight}
              suffix="მ"
            />
            <DetailNumber
              label="პარკინგის ადგილები"
              value={values.commercial.parkingSpaces}
            />
            <DetailYesNo
              label="კონდიციონერი"
              value={Boolean(values.commercial.airConditioner)}
            />
            {values.dealType === "RENT" || values.dealType === "DAILY_RENT" ? (
              <DetailNumber
                label="მინიმალური ქირის ვადა (თვე)"
                value={values.commercial.minRentalPeriod ?? undefined}
              />
            ) : null}
          </div>
        </section>
      )}
    </>
  );
}
