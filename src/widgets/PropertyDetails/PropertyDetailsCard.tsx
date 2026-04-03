"use client";

import { useEffect, useMemo, useState } from "react";
import type { DealType } from "@/features/properties/dealType";
import type {
  Property,
  PropertyApartmentUpdate,
  PropertyCommercialUpdate,
  PropertyLandPlotUpdate,
  PropertyPrivateHouseUpdate,
  PropertyUpdatePayload,
} from "@/features/properties/types";
import {
  buildPropertyUpdatePayload,
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
          }
        : null,
      privateHouse: property.privateHouse
        ? {
            houseArea: property.privateHouse.houseArea,
            yardArea: property.privateHouse.yardArea,
            pool: property.privateHouse.pool,
            fruitTrees: property.privateHouse.fruitTrees,
          }
        : null,
      landPlot: property.landPlot
        ? {
            landArea: property.landPlot.landArea,
            forInvestment: property.landPlot.forInvestment,
            canBeDivided: property.landPlot.canBeDivided,
          }
        : null,
      commercial: property.commercial
        ? {
            area: property.commercial.area,
            parking: property.commercial.parking,
            airConditioner: property.commercial.airConditioner,
          }
        : null,
    };
  }, [property]);

  const [values, setValues] = useState<FormValues>(initialValues);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleDealTypeChange = (value: DealType) => {
    setValues((prev) => ({ ...prev, dealType: value }));
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

    const payload = buildPropertyUpdatePayload(initialValues, values);

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

  const setLandPlot = (patch: PropertyLandPlotUpdate) => {
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
          onDealTypeChange={handleDealTypeChange}
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

        {saveError && (
          <p className="text-sm text-red-600" role="alert">
            {saveError}
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

