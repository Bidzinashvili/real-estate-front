"use client";

import { useEffect, useMemo, useState } from "react";
import type { DealType } from "@/features/properties/dealType";
import {
  type Property,
  type PropertyApartmentUpdate,
  type PropertyCommercialUpdate,
  type PropertyPrivateHouseUpdate,
  type PropertyUpdatePayload,
  isHotelScope,
  parseRenovationForForm,
} from "@/features/properties/types";
import {
  buildPropertyUpdatePayload,
  type PropertyFormLandPlot,
  type PropertyFormValues,
} from "@/features/properties/payloadBuilder";
import { PropertyDetailsReadOnlySections } from "@/widgets/PropertyDetails/PropertyDetailsReadOnlySections";
import { PropertyDetailsEditableSections } from "@/widgets/PropertyDetails/PropertyDetailsEditableSections";
import { PropertyDetailsImageGallery } from "@/widgets/PropertyDetails/PropertyDetailsImageGallery";
import { getApiBaseUrl } from "@/shared/lib/auth";

type PropertyDetailsCardProps = {
  property: Property;
  canEdit: boolean;
  canViewPrivateFields: boolean;
  isSaving: boolean;
  saveError: string | null;
  onSubmit: (payload: PropertyUpdatePayload) => Promise<void> | void;
  onImagesChanged: () => Promise<void>;
};

type FormValues = PropertyFormValues;

export function PropertyDetailsCard({
  property,
  canEdit,
  canViewPrivateFields,
  isSaving,
  saveError,
  onSubmit,
  onImagesChanged,
}: PropertyDetailsCardProps) {
  const apiBaseUrl = getApiBaseUrl();
  const initialValues = useMemo<FormValues>(() => {
    return {
      propertyType: property.propertyType,
      hotelScope: property.hotelScope ?? null,
      dealType: property.dealType,
      city: property.city,
      district: property.district,
      address: property.address,
      pricePublic: property.pricePublic,
      priceInternal: property.priceInternal ?? undefined,
      description: property.description ?? "",
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

  const [values, setValues] = useState<FormValues>(initialValues);
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
    field: keyof Pick<FormValues, "city" | "district" | "address">,
    value: string,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (
    field: "pricePublic" | "priceInternal",
    value: number | undefined,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!canEdit) return;

    setClientError(null);

    if (values.landPlot) {
      if (values.landPlot.landCategory === "" || values.landPlot.landUsage === "") {
        setClientError("Select land category and land usage.");
        return;
      }
    }

    if (values.dealType === "RENT") {
      const rentMinMessage = (months: number | undefined): string | null => {
        if (months === undefined || Number.isNaN(months)) {
          return "Min Rental Period (months) is required.";
        }
        if (!Number.isInteger(months) || months < 1) {
          return "Min Rental Period must be a whole number of at least 1 month.";
        }
        return null;
      };
      if (values.apartment) {
        const message = rentMinMessage(values.apartment.minRentalPeriod ?? undefined);
        if (message) {
          setClientError(message);
          return;
        }
      }
      if (values.privateHouse) {
        const message = rentMinMessage(values.privateHouse.minRentalPeriod ?? undefined);
        if (message) {
          setClientError(message);
          return;
        }
      }
      if (values.landPlot) {
        const message = rentMinMessage(values.landPlot.minRentalPeriod ?? undefined);
        if (message) {
          setClientError(message);
          return;
        }
      }
      if (values.commercial) {
        const message = rentMinMessage(values.commercial.minRentalPeriod ?? undefined);
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

    onSubmit(payload);
  };

  const setNested = <T extends Record<string, unknown>>(
    key: "apartment" | "privateHouse" | "landPlot" | "commercial",
    patch: T,
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: prev[key] ? { ...(prev[key] as T), ...patch } : patch,
    }));
  };

  const setApartment = (patch: PropertyApartmentUpdate) => {
    setNested("apartment", patch);
  };

  const setPrivateHouse = (patch: PropertyPrivateHouseUpdate) => {
    setNested("privateHouse", patch);
  };

  const setLandPlot = (patch: Partial<PropertyFormLandPlot>) => {
    setNested("landPlot", patch);
  };

  const setCommercial = (patch: PropertyCommercialUpdate) => {
    setNested("commercial", patch);
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-semibold tracking-tight">
        Property details
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Update listing information. Agents can only edit their own properties.
      </p>
      {!canViewPrivateFields && (
        <p className="mt-2 text-sm text-slate-600">
          Notes, internal price, and some workflow fields are hidden because you are
          not the listing agent. Administrators always see the full record.
        </p>
      )}

      <div className="mt-6">
        <PropertyDetailsImageGallery
          propertyId={property.id}
          images={property.images}
          apiBaseUrl={apiBaseUrl}
          canDelete={canEdit}
          onDeleted={onImagesChanged}
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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

        {(clientError || saveError) && (
          <p className="text-sm text-red-600" role="alert">
            {clientError ?? saveError}
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
    </div>
  );
}

