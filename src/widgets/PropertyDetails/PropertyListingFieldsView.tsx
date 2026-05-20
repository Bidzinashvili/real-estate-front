"use client";

import {
  formatHotelScopeLabelOrUnset,
  formatLandCategoryLabel,
  formatLandUsageLabel,
} from "@/features/properties/addPropertyFormOptions";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import type { PropertyFormValues } from "@/features/properties/payloadBuilder";
import {
  DetailMultiline,
  DetailNumber,
  DetailText,
  DetailYesNo,
} from "@/widgets/PropertyDetails/DetailDisplay";

type PropertyListingFieldsViewProps = {
  values: PropertyFormValues;
  showInternalPrice: boolean;
  readOnlyPrivateHouseBalcony?: number | null;
};

export function PropertyListingFieldsView({
  values,
  showInternalPrice,
  readOnlyPrivateHouseBalcony,
}: PropertyListingFieldsViewProps) {
  const privateHouseTotalArea =
    values.privateHouse?.houseArea !== undefined &&
    values.privateHouse.yardArea !== undefined
      ? values.privateHouse.houseArea + values.privateHouse.yardArea
      : undefined;
  const areaSquareMeters =
    values.apartment?.totalArea ??
    privateHouseTotalArea ??
    values.landPlot?.landArea ??
    values.commercial?.area;
  const pricePerSquareMeter =
    values.pricePublic !== undefined && areaSquareMeters && areaSquareMeters > 0
      ? Math.round(values.pricePublic / areaSquareMeters)
      : null;

  return (
    <>
      <section className="space-y-4" aria-labelledby="listing-core-heading">
        <h2
          id="listing-core-heading"
          className="text-sm font-semibold text-slate-800"
        >
          Listing (view only)
        </h2>

        <DetailText
          label="Deal type"
          value={formatDealTypeLabel(values.dealType)}
        />

        {values.propertyType === "HOTEL" && (
          <DetailText
            label="Hotel scope"
            value={formatHotelScopeLabelOrUnset(values.hotelScope)}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailText label="City" value={values.city} />
          <DetailText label="District" value={values.district} />
        </div>

        <DetailText label="Address" value={values.address} />

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailNumber
            label="Public price"
            value={values.pricePublic}
            suffix="₾"
          />
          {showInternalPrice && (
            <DetailNumber
              label="Internal price"
              value={values.priceInternal}
              suffix="₾"
            />
          )}
          <DetailNumber
            label="Price per m²"
            value={pricePerSquareMeter}
            suffix="₾"
          />
        </div>

        <DetailMultiline label="Public comment" value={values.publicComment} />
        {showInternalPrice ? (
          <>
            <DetailMultiline label="Personal comment" value={values.privateComment} />
            <DetailMultiline label="Internal text" value={values.internalText} />
          </>
        ) : null}
      </section>

      {values.apartment && (
        <section className="space-y-3 pt-2" aria-labelledby="apt-heading">
          <h2 id="apt-heading" className="text-sm font-semibold text-slate-800">
            Apartment
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber
              label="Total area"
              value={values.apartment.totalArea}
              suffix="m²"
            />
            <DetailNumber label="Rooms" value={values.apartment.rooms} />
            <DetailNumber label="Floor" value={values.apartment.floor} />
            <DetailNumber
              label="Total floors"
              value={values.apartment.totalFloors}
            />
            <DetailNumber
              label="Ceiling height"
              value={values.apartment.ceilingHeight}
              suffix="m"
            />
            <DetailNumber
              label="Balcony area"
              value={values.apartment.balconyArea}
              suffix="m²"
            />
            <DetailNumber
              label="Parking spaces"
              value={values.apartment.parkingSpaces}
            />
            <DetailYesNo
              label="Furnished"
              value={Boolean(values.apartment.furnished)}
            />
            {values.dealType === "RENT" && (
              <DetailNumber
                label="Min Rental Period (months)"
                value={values.apartment.minRentalPeriod ?? undefined}
              />
            )}
          </div>
        </section>
      )}

      {values.privateHouse && (
        <section className="space-y-3 pt-2" aria-labelledby="ph-heading">
          <h2 id="ph-heading" className="text-sm font-semibold text-slate-800">
            Private house
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber
              label="House area"
              value={values.privateHouse.houseArea}
              suffix="m²"
            />
            <DetailNumber
              label="Yard area"
              value={values.privateHouse.yardArea}
              suffix="m²"
            />
            {readOnlyPrivateHouseBalcony !== undefined ? (
              <DetailNumber label="Balcony area" value={readOnlyPrivateHouseBalcony} />
            ) : null}
            <DetailNumber
              label="Parking spaces"
              value={values.privateHouse.parkingSpaces}
            />
            <DetailYesNo
              label="Furnished"
              value={Boolean(values.privateHouse.furnished)}
            />
            <DetailYesNo label="Pool" value={Boolean(values.privateHouse.pool)} />
            <DetailYesNo
              label="Fruit trees"
              value={Boolean(values.privateHouse.fruitTrees)}
            />
            {values.dealType === "RENT" && (
              <DetailNumber
                label="Min Rental Period (months)"
                value={values.privateHouse.minRentalPeriod ?? undefined}
              />
            )}
          </div>
        </section>
      )}

      {values.landPlot && (
        <section className="space-y-3 pt-2" aria-labelledby="land-heading">
          <h2 id="land-heading" className="text-sm font-semibold text-slate-800">
            Land plot
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber
              label="Land area"
              value={values.landPlot.landArea}
              suffix="m²"
            />
            <DetailText
              label="Land category"
              value={formatLandCategoryLabel(values.landPlot.landCategory)}
            />
            <DetailText
              label="Land usage"
              value={formatLandUsageLabel(values.landPlot.landUsage)}
            />
            <DetailYesNo
              label="For investment"
              value={Boolean(values.landPlot.forInvestment)}
            />
            <DetailYesNo
              label="Can be divided"
              value={Boolean(values.landPlot.canBeDivided)}
            />
            {values.dealType === "RENT" && (
              <DetailNumber
                label="Min Rental Period (months)"
                value={values.landPlot.minRentalPeriod ?? undefined}
              />
            )}
          </div>
        </section>
      )}

      {values.commercial && (
        <section className="space-y-3 pt-2" aria-labelledby="com-heading">
          <h2 id="com-heading" className="text-sm font-semibold text-slate-800">
            Commercial
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailNumber
              label="Area"
              value={values.commercial.area}
              suffix="m²"
            />
            <DetailNumber
              label="Total floors"
              value={values.commercial.totalFloors}
            />
            <DetailNumber
              label="Ceiling height"
              value={values.commercial.ceilingHeight}
              suffix="m"
            />
            <DetailNumber
              label="Parking spaces"
              value={values.commercial.parkingSpaces}
            />
            <DetailYesNo
              label="Air conditioner"
              value={Boolean(values.commercial.airConditioner)}
            />
            {values.dealType === "RENT" && (
              <DetailNumber
                label="Min Rental Period (months)"
                value={values.commercial.minRentalPeriod ?? undefined}
              />
            )}
          </div>
        </section>
      )}
    </>
  );
}
