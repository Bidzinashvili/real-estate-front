"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  GEORGIAN_CITY_OPTIONS,
  isTbilisiCity,
} from "@/features/properties/addPropertyFormOptions";
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
import { applyLinkedPropertyPriceChange } from "@/features/properties/linkedPropertyPrices";
import { getApiBaseUrl } from "@/shared/lib/auth";
import { requiredFieldMessage, wholeNumberAtLeastOneMessage } from "@/shared/i18n/ui";
import { PropertyDetailsEditableSections } from "@/widgets/PropertyDetails/PropertyDetailsEditableSections";
import { PropertyDetailsImageGallery } from "@/widgets/PropertyDetails/PropertyDetailsImageGallery";
import { PropertyDetailsLifecycleSection } from "@/widgets/PropertyDetails/PropertyDetailsLifecycleSection";
import { PropertyDetailsReadOnlySections } from "@/widgets/PropertyDetails/PropertyDetailsReadOnlySections";
import { MatchPercentActions } from "@/widgets/Matching/MatchPercentActions";
import { collectPropertyTemporaryLocks } from "@/features/matching/collectTemporaryLocks";
import { propertyMatchesHref } from "@/features/matching/matchingRoutes";
import { ui } from "@/shared/i18n/ui";

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

const propertyLabelsOwnerErrorMessage = "ლეიბლების რედაქტირება მხოლოდ საკუთარ განცხადებებზე შეგიძლიათ.";

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
    return "მინიმალური ქირის ვადა (თვეებში) სავალდებულოა.";
  }
  if (!Number.isInteger(months) || months < 1) {
    return "მინიმალური ქირის ვადა უნდა იყოს მინიმუმ 1 თვე.";
  }

  return null;
}

function getTotalFloorsErrorMessage(
  totalFloors: number | undefined,
  label: string,
): string | null {
  if (totalFloors === undefined || Number.isNaN(totalFloors)) {
    return requiredFieldMessage(label);
  }
  if (!Number.isInteger(totalFloors) || totalFloors < 1) {
    return wholeNumberAtLeastOneMessage(label);
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
      publicComment: property.publicComment ?? property.description ?? "",
      privateComment: property.privateComment ?? property.comment ?? "",
      internalText: property.internalText ?? property.internalComment ?? "",
      labels: (property.labels ?? []).map((label) => ({
        id: label.id,
        name: label.name,
        type: label.type,
      })),
      apartment: property.apartment
        ? {
            totalArea: property.apartment.totalArea,
            rooms: property.apartment.rooms,
            bedrooms: property.apartment.bedrooms,
            totalFloors: property.apartment.totalFloors,
            ceilingHeight: property.apartment.ceilingHeight ?? undefined,
            balconyArea: property.apartment.balconyArea,
            needsVerification: property.apartment.needsVerification,
            floor: property.apartment.floor,
            project: property.apartment.project ?? "",
            renovation: parseRenovationForForm(property.apartment.renovation),
            buildingCondition: property.apartment.buildingCondition,
            furnished: property.apartment.furnished,
            parkingSpaces: property.apartment.parkingSpaces,
            minRentalPeriod: property.apartment.minRentalPeriod ?? undefined,
            elevator: property.apartment.elevator,
            centralHeating: property.apartment.centralHeating,
            airConditioner: property.apartment.airConditioner,
            kitchenType: property.apartment.kitchenType,
            goodView: property.apartment.goodView,
            bathrooms: property.apartment.bathrooms,
            petsAllowed: property.apartment.petsAllowed,
          }
        : null,
      privateHouse: property.privateHouse
        ? {
            houseArea: property.privateHouse.houseArea,
            yardArea: property.privateHouse.yardArea,
            balconyArea: property.privateHouse.balconyArea,
            parkingSpaces: property.privateHouse.parkingSpaces,
            needsVerification: property.privateHouse.needsVerification,
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
            totalFloors: property.commercial.totalFloors ?? undefined,
            ceilingHeight: property.commercial.ceilingHeight ?? undefined,
            parkingSpaces: property.commercial.parkingSpaces,
            needsVerification: property.commercial.needsVerification,
            airConditioner: property.commercial.airConditioner,
            renovation: parseRenovationForForm(property.commercial.renovation),
            minRentalPeriod: property.commercial.minRentalPeriod ?? undefined,
          }
        : null,
      fieldLocks: property.fieldLocks ?? {},
    };
  }, [property]);

  const [values, setValues] = useState<PropertyFormValues>(initialValues);
  const [clientError, setClientError] = useState<string | null>(null);
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const handleDealTypeChange = (value: DealType) => {
    const clearRentFields = value !== "RENT" && value !== "DAILY_RENT";
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
      if (field === "city") {
        const keepTbilisiDistricts = isTbilisiCity(value);
        return {
          ...prev,
          city: value,
          district: keepTbilisiDistricts ? prev.district : "",
          selectedStreetId: null,
        };
      }
      if (field === "district") {
        return { ...prev, district: value, selectedStreetId: null };
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
    setValues((prev) => {
      if (field === "pricePublic" && !canViewPrivateFields) {
        return { ...prev, pricePublic: value };
      }

      const nextPrices = applyLinkedPropertyPriceChange({
        changedField: field,
        nextValue: value,
        currentInternal: prev.priceInternal,
        currentPublic: prev.pricePublic,
      });

      return {
        ...prev,
        priceInternal: nextPrices.priceInternal,
        pricePublic: nextPrices.pricePublic,
      };
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (presentation !== "edit" || !canEdit || !onSubmit) return;

    setClientError(null);

    if (
      initialValues.city !== values.city &&
      !GEORGIAN_CITY_OPTIONS.some((option) => option.value === values.city)
    ) {
      setClientError("ქალაქი უნდა იყოს თბილისი, ბათუმი, ქუთაისი ან ბორჯომი.");
      return;
    }

    if (isTbilisiCity(values.city) && values.district.trim() === "") {
      setClientError(requiredFieldMessage("უბანი"));
      return;
    }

    if (values.landPlot) {
      if (values.landPlot.landCategory === "" || values.landPlot.landUsage === "") {
        setClientError("აირჩიეთ მიწის კატეგორია და დანიშნულება.");
        return;
      }
    }

    if (values.apartment) {
      const message = getTotalFloorsErrorMessage(
        values.apartment.totalFloors,
        "ბინის სართულიანობა",
      );
      if (message) {
        setClientError(message);
        return;
      }
    }

    if (values.commercial) {
      const message = getTotalFloorsErrorMessage(
        values.commercial.totalFloors,
        "კომერციული სართულიანობა",
      );
      if (message) {
        setClientError(message);
        return;
      }
    }

    if (values.dealType === "SALE" && property.status === "AVAILABLE_SOON") {
      setClientError("სტატუსი „მალე ხელმისაწვდომი“ მხოლოდ ქირავნობის განცხადებებზეა დაშვებული");
      return;
    }

    if (values.dealType === "RENT" || values.dealType === "DAILY_RENT") {
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

  const setFieldLocks = (nextLocks: PropertyFormValues["fieldLocks"]) => {
    setValues((previousValues) => ({
      ...previousValues,
      fieldLocks: nextLocks,
    }));
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
          <PropertyDetailsLifecycleSection property={property} />

          <PropertyDetailsEditableSections
            values={values}
            canEdit={false}
            showInternalPrice={canViewPrivateFields}
            readOnlyPrivateHouseBalcony={property.privateHouse?.balconyArea}
            onDealTypeChange={handleDealTypeChange}
            onHotelScopeChange={() => {}}
            onFieldChange={handleFieldChange}
            onPriceChange={handlePriceChange}
            onLabelsChange={() => {}}
            onCommentChange={() => {}}
            setApartment={setApartment}
            setFieldLocks={setFieldLocks}
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
          <PropertyDetailsLifecycleSection property={property} />

          <PropertyDetailsEditableSections
            values={values}
            canEdit={canEdit}
            showInternalPrice={canViewPrivateFields}
            readOnlyPrivateHouseBalcony={property.privateHouse?.balconyArea}
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
            onCommentChange={(field, value) =>
              setValues((prev) => ({ ...prev, [field]: value }))
            }
            setApartment={setApartment}
            setFieldLocks={setFieldLocks}
            setPrivateHouse={setPrivateHouse}
            setLandPlot={setLandPlot}
            setCommercial={setCommercial}
          />

          <PropertyDetailsReadOnlySections
            property={property}
            showPrivateNotes={canViewPrivateFields}
          />

          {(clientError || getSaveErrorMessage(saveError)) && (
            <p className="text-sm text-destructive" role="alert">
              {clientError ?? getSaveErrorMessage(saveError)}
            </p>
          )}

          {!canEdit && (
            <p className="text-xs text-muted-foreground">
              ამ განცხადების რედაქტირების უფლება არ გაქვთ.
            </p>
          )}

          <div className="mt-2 flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={!canEdit || isSaving}
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "ინახება…" : "ცვლილებების შენახვა"}
            </button>
          </div>
        </form>
      )}
    </>
  );

  if (presentation === "view") {
    return (
      <div className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
        <h1 className="text-2xl font-semibold tracking-tight">განცხადების დეტალები</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ნახეთ განცხადების ინფორმაცია. დასაშვები ველების შესაცვლელად გამოიყენეთ რედაქტირება.
        </p>
        {!canViewPrivateFields && (
          <p className="mt-2 text-sm text-muted-foreground">
            შენიშვნები, შიდა ფასი და ზოგი სამუშაო ველი დამალულია, რადგან თქვენ არ ხართ ამ განცხადების აგენტი. ადმინისტრატორებს სრული ჩანაწერი ყოველთვის ჩანს.
          </p>
        )}
        {detailsBody}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">განცხადების დეტალები</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            განაახლეთ განცხადების ინფორმაცია. აგენტებს მხოლოდ საკუთარი განცხადებების რედაქტირება შეუძლიათ.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {property.propertyType === "APARTMENT" ? (
            <MatchPercentActions
              allHref={propertyMatchesHref(property.id, "GLOBAL")}
              mineHref={propertyMatchesHref(property.id, "MINE")}
              allLabel={`${ui.matchAll}: ${ui.allClients}`}
              mineLabel={`${ui.matchMine}: ${ui.myClients}`}
              sessionKind="property"
              entityId={property.id}
              temporaryLockedFields={collectPropertyTemporaryLocks(values.fieldLocks)}
            />
          ) : null}
          <Link
            href={`/properties/${property.id}`}
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            ობიექტის ნახვა
          </Link>
        </div>
      </div>
      {!canViewPrivateFields && (
        <p className="mt-2 text-sm text-muted-foreground">
          შენიშვნები, შიდა ფასი და ზოგი სამუშაო ველი დამალულია, რადგან თქვენ არ ხართ ამ განცხადების აგენტი. ადმინისტრატორებს სრული ჩანაწერი ყოველთვის ჩანს.
        </p>
      )}
      {detailsBody}
    </div>
  );
}
