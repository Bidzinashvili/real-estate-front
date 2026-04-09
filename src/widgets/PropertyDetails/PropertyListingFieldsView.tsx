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
  readOnlyPrivateHouseBalcony?: number;
};

export function PropertyListingFieldsView({
  values,
  showInternalPrice,
  readOnlyPrivateHouseBalcony,
}: PropertyListingFieldsViewProps) {
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
        </div>

        <DetailMultiline label="Description" value={values.description} />
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
            <DetailNumber label="Balcony" value={values.apartment.balcony} />
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
              <DetailNumber
                label="Balcony"
                value={readOnlyPrivateHouseBalcony}
              />
            ) : null}
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
            <DetailYesNo
              label="Parking"
              value={Boolean(values.commercial.parking)}
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
