"use client";

import { useEffect, useMemo, useState } from "react";
import type { DealType } from "@/features/properties/dealType";
import {
  buildPropertyUpdatePayload,
  type PropertyFormLandPlot,
  type PropertyFormValues,
} from "@/features/properties/payloadBuilder";
import {
  type Property,
  type PropertyApartmentUpdate,
  type PropertyCommercialUpdate,
  type PropertyPrivateHouseUpdate,
  type PropertyUpdatePayload,
  isHotelScope,
  parseRenovationForForm,
} from "@/features/properties/types";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { PropertyDetailsEditableSections } from "@/widgets/PropertyDetails/PropertyDetailsEditableSections";
import { PropertyDetailsImageGallery } from "@/widgets/PropertyDetails/PropertyDetailsImageGallery";
import { PropertyDetailsLifecycleSection } from "@/widgets/PropertyDetails/PropertyDetailsLifecycleSection";
import { PropertyDetailsReadOnlySections } from "@/widgets/PropertyDetails/PropertyDetailsReadOnlySections";

type PropertyDetailsCardBaseProps = {
  property: Property;
  canViewPrivateFields: boolean;
};

type PropertyDetailsCardEditProps = PropertyDetailsCardBaseProps & {
  presentation: "edit";
  canEdit: boolean;
  isSaving: boolean;
  saveError: string | null;
  onSubmit: (payload: PropertyUpdatePayload) => Promise<void> | void;
  onImagesChanged: () => Promise<void>;
};

type PropertyDetailsCardViewProps = PropertyDetailsCardBaseProps & {
  presentation: "view";
};

export type PropertyDetailsCardProps =
  | PropertyDetailsCardEditProps
  | PropertyDetailsCardViewProps;

const propertyLabelsOwnerErrorMessage = "You can only edit labels on your own properties.";

function getSaveErrorMessage(saveError: string | null): string | null {
  if (!saveError) {
    return null;
  }

  if (saveError.includes(propertyLabelsOwnerErrorMessage)) {
    return propertyLabelsOwnerErrorMessage;
  }

  return saveError;
}

function getMinRentalPeriodErrorMessage(months: number | undefined): string | null {
  if (months === undefined || Number.isNaN(months)) {
    return "Min Rental Period (months) is required.";
  }
  if (!Number.isInteger(months) || months < 1) {
    return "Min Rental Period must be a whole number of at least 1 month.";
  }

  return null;
}

export function PropertyDetailsCard(props: PropertyDetailsCardProps) {
  const { property, canViewPrivateFields, presentation } = props;
  const canEdit = presentation === "edit" ? props.canEdit : false;
  const isSaving = presentation === "edit" ? props.isSaving : false;
  const saveError = presentation === "edit" ? props.saveError : null;
  const onSubmit = presentation === "edit" ? props.onSubmit : undefined;
  const onImagesChanged = presentation === "edit" ? props.onImagesChanged : undefined;

  const apiBaseUrl = getApiBaseUrl();
  const initialValues = useMemo<PropertyFormValues>(() => {
    return {
      propertyType: property.propertyType,
      hotelScope: property.hotelScope ?? null,
      dealType: property.dealType,
      city: property.city,
      district: property.district,
      address: property.address,
      selectedStreetId: property.streetId,
      pricePublic: property.pricePublic,
      priceInternal: property.priceInternal ?? undefined,
      description: property.description ?? "",
      labels: (property.labels ?? []).map((label) => ({
        id: label.id,
        name: label.name,
        type: label.type,
      })),
      apartment: property.apartment
        ? {
            totalArea: property.apartment.totalArea,
            rooms: property.apartment.rooms,
            balcony: property.apartment.balcony,
            floor: property.apartment.floor,
            renovation: parseRenovationForForm(property.apartment.renovation),
            furnished: property.apartment.furnished,
            minRentalPeriod: property.apartment.minRentalPeriod ?? undefined,
          }
        : null,
      privateHouse: property.privateHouse
        ? {
            houseArea: property.privateHouse.houseArea,
            yardArea: property.privateHouse.yardArea,
            pool: property.privateHouse.pool,
            fruitTrees: property.privateHouse.fruitTrees,
            renovation: parseRenovationForForm(property.privateHouse.renovation),
            furnished: property.privateHouse.furnished,
            minRentalPeriod: property.privateHouse.minRentalPeriod ?? undefined,
          }
        : null,
      landPlot: property.landPlot
        ? {
            landArea: property.landPlot.landArea,
            landCategory: property.landPlot.landCategory,
            landUsage: property.landPlot.landUsage,
            forInvestment: property.landPlot.forInvestment,
            canBeDivided: property.landPlot.canBeDivided,
            minRentalPeriod: property.landPlot.minRentalPeriod ?? undefined,
          }
        : null,
      commercial: property.commercial
        ? {
            area: property.commercial.area,
            parking: property.commercial.parking,
            airConditioner: property.commercial.airConditioner,
            renovation: parseRenovationForForm(property.commercial.renovation),
            minRentalPeriod: property.commercial.minRentalPeriod ?? undefined,
          }
        : null,
    };
  }, [property]);

  const [values, setValues] = useState<PropertyFormValues>(initialValues);
  const [clientError, setClientError] = useState<string | null>(null);
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleDealTypeChange = (value: DealType) => {
    const clearRentFields = value !== "RENT";
    setValues((prev) => ({
      ...prev,
      dealType: value,
      apartment: prev.apartment
        ? {
            ...prev.apartment,
            minRentalPeriod: clearRentFields ? undefined : prev.apartment.minRentalPeriod,
          }
        : null,
      privateHouse: prev.privateHouse
        ? {
            ...prev.privateHouse,
            minRentalPeriod: clearRentFields
              ? undefined
              : prev.privateHouse.minRentalPeriod,
          }
        : null,
      landPlot: prev.landPlot
        ? {
            ...prev.landPlot,
            minRentalPeriod: clearRentFields ? undefined : prev.landPlot.minRentalPeriod,
          }
        : null,
      commercial: prev.commercial
        ? {
            ...prev.commercial,
            minRentalPeriod: clearRentFields
              ? undefined
              : prev.commercial.minRentalPeriod,
          }
        : null,
    }));
  };

  const handleFieldChange = (
    field: keyof Pick<PropertyFormValues, "city" | "district" | "address">,
    value: string,
    addressChangeMeta?: { selectedStreetId: string | null },
  ) => {
    setValues((prev) => {
      if (field === "city" || field === "district") {
        return { ...prev, [field]: value, selectedStreetId: null };
      }
      if (field === "address") {
        return {
          ...prev,
          address: value,
          selectedStreetId: addressChangeMeta?.selectedStreetId ?? null,
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handlePriceChange = (
    field: "pricePublic" | "priceInternal",
    value: number | undefined,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (presentation !== "edit" || !canEdit || !onSubmit) return;

    setClientError(null);

    if (values.landPlot) {
      if (values.landPlot.landCategory === "" || values.landPlot.landUsage === "") {
        setClientError("Select land category and land usage.");
        return;
      }
    }

    if (values.dealType === "RENT") {
      if (values.apartment) {
        const message = getMinRentalPeriodErrorMessage(values.apartment.minRentalPeriod ?? undefined);
        if (message) {
          setClientError(message);
          return;
        }
      }
      if (values.privateHouse) {
        const message = getMinRentalPeriodErrorMessage(
          values.privateHouse.minRentalPeriod ?? undefined,
        );
        if (message) {
          setClientError(message);
          return;
        }
      }
      if (values.landPlot) {
        const message = getMinRentalPeriodErrorMessage(values.landPlot.minRentalPeriod ?? undefined);
        if (message) {
          setClientError(message);
          return;
        }
      }
      if (values.commercial) {
        const message = getMinRentalPeriodErrorMessage(
          values.commercial.minRentalPeriod ?? undefined,
        );
        if (message) {
          setClientError(message);
          return;
        }
      }
    }

    const payload = buildPropertyUpdatePayload(
      initialValues,
      values,
      property.propertyType,
    );

    if (Object.keys(payload).length === 0) {
      return;
    }

    void onSubmit(payload);
  };

  const setApartment = (patch: PropertyApartmentUpdate) => {
    setValues((previousValues) => ({
      ...previousValues,
      apartment: previousValues.apartment
        ? { ...previousValues.apartment, ...patch }
        : previousValues.apartment,
    }));
  };

  const setPrivateHouse = (patch: PropertyPrivateHouseUpdate) => {
    setValues((previousValues) => ({
      ...previousValues,
      privateHouse: previousValues.privateHouse
        ? { ...previousValues.privateHouse, ...patch }
        : previousValues.privateHouse,
    }));
  };

  const setLandPlot = (patch: Partial<PropertyFormLandPlot>) => {
    setValues((previousValues) => ({
      ...previousValues,
      landPlot: previousValues.landPlot
        ? { ...previousValues.landPlot, ...patch }
        : previousValues.landPlot,
    }));
  };

  const setCommercial = (patch: PropertyCommercialUpdate) => {
    setValues((previousValues) => ({
      ...previousValues,
      commercial: previousValues.commercial
        ? { ...previousValues.commercial, ...patch }
        : previousValues.commercial,
    }));
  };

  const detailsBody = (
    <>
      <div className="mt-6">
        <PropertyDetailsImageGallery
          propertyId={property.id}
          images={property.images}
          apiBaseUrl={apiBaseUrl}
          canDelete={presentation === "edit" && canEdit}
          onDeleted={onImagesChanged ?? (() => Promise.resolve())}
        />
      </div>

      {presentation === "view" ? (
        <div className="mt-6 space-y-6">
          <PropertyDetailsLifecycleSection
            lifecycleStatus={property.status}
            verificationReminderIso={property.reminderDate}
          />

          <PropertyDetailsEditableSections
            values={values}
            canEdit={false}
            showInternalPrice={canViewPrivateFields}
            readOnlyPrivateHouseBalcony={property.privateHouse?.balcony}
            onDealTypeChange={handleDealTypeChange}
            onHotelScopeChange={() => {}}
            onFieldChange={handleFieldChange}
            onPriceChange={handlePriceChange}
            onLabelsChange={() => {}}
            onDescriptionChange={() => {}}
            setApartment={setApartment}
            setPrivateHouse={setPrivateHouse}
            setLandPlot={setLandPlot}
            setCommercial={setCommercial}
          />

          <PropertyDetailsReadOnlySections
            property={property}
            showPrivateNotes={canViewPrivateFields}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <PropertyDetailsLifecycleSection
            lifecycleStatus={property.status}
            verificationReminderIso={property.reminderDate}
          />

          <PropertyDetailsEditableSections
            values={values}
            canEdit={canEdit}
            showInternalPrice={canViewPrivateFields}
            readOnlyPrivateHouseBalcony={property.privateHouse?.balcony}
            onDealTypeChange={handleDealTypeChange}
            onHotelScopeChange={(raw) => {
              setValues((prev) => {
                if (raw === "") {
                  return { ...prev, hotelScope: null };
                }
                if (isHotelScope(raw)) {
                  return { ...prev, hotelScope: raw };
                }
                return prev;
              });
            }}
            onFieldChange={handleFieldChange}
            onPriceChange={handlePriceChange}
            onLabelsChange={(value) => setValues((prev) => ({ ...prev, labels: value }))}
            onDescriptionChange={(value) =>
              setValues((prev) => ({ ...prev, description: value }))
            }
            setApartment={setApartment}
            setPrivateHouse={setPrivateHouse}
            setLandPlot={setLandPlot}
            setCommercial={setCommercial}
          />

          <PropertyDetailsReadOnlySections
            property={property}
            showPrivateNotes={canViewPrivateFields}
          />

          {(clientError || getSaveErrorMessage(saveError)) && (
            <p className="text-sm text-red-600" role="alert">
              {clientError ?? getSaveErrorMessage(saveError)}
            </p>
          )}

          {!canEdit && (
            <p className="text-xs text-slate-500">
              You don&apos;t have permission to edit this property.
            </p>
          )}

          <div className="mt-2 flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={!canEdit || isSaving}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </>
  );

  if (presentation === "view") {
    return (
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold tracking-tight">Property details</h1>
        <p className="mt-1 text-sm text-slate-600">
          View listing information. Use Edit listing to change fields you are allowed to
          update.
        </p>
        {!canViewPrivateFields && (
          <p className="mt-2 text-sm text-slate-600">
            Notes, internal price, and some workflow fields are hidden because you are not
            the listing agent. Administrators always see the full record.
          </p>
        )}
        {detailsBody}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-semibold tracking-tight">Property details</h1>
      <p className="mt-1 text-sm text-slate-600">
        Update listing information. Agents can only edit their own properties.
      </p>
      {!canViewPrivateFields && (
        <p className="mt-2 text-sm text-slate-600">
          Notes, internal price, and some workflow fields are hidden because you are not the
          listing agent. Administrators always see the full record.
        </p>
      )}
      {detailsBody}
    </div>
  );
}
