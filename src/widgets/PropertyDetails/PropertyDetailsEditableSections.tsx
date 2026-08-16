"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LabelAutocompleteChipsInput } from "@/features/labels/LabelAutocompleteChipsInput";
import { useDistricts } from "@/features/districts/useDistricts";
import type { LabelSelection } from "@/features/labels/labelTypes";
import type { PropertyFieldLocks } from "@/features/matching/matchingEnums";
import type {
  PropertyApartmentUpdate,
  PropertyCommercialUpdate,
  PropertyPrivateHouseUpdate,
} from "@/features/properties/types";
import {
  GEORGIAN_CITY_OPTIONS,
  HOTEL_SCOPE_FORM_OPTIONS,
  isTbilisiCity,
} from "@/features/properties/addPropertyFormOptions";
import {
  DEAL_TYPE_OPTIONS,
  isDealType,
  type DealType,
} from "@/features/properties/dealType";
import type {
  PropertyFormLandPlot,
  PropertyFormValues,
} from "@/features/properties/payloadBuilder";
import { LabeledSelect } from "@/shared/ui/LabeledSelect";
import { StreetAutocompleteField } from "@/features/streets/StreetAutocompleteField";
import {
  EditableNumericTextInput,
  propertyDetailsEditableInputClassName,
} from "@/widgets/PropertyDetails/PropertyFormControls";
import {
  ApartmentEditSection,
  CommercialEditSection,
  LandPlotEditSection,
  PrivateHouseEditSection,
} from "@/widgets/PropertyDetails/PropertyNestedEditSections";
import { PropertyListingFieldsView } from "@/widgets/PropertyDetails/PropertyListingFieldsView";
import { parseIntegerInput } from "@/shared/lib/parseNumericInput";
import { DistrictNeighborhoodPicker } from "@/widgets/AddProperty/DistrictNeighborhoodPicker";
import { applyDatedPersonalCommentEntry } from "@/shared/lib/personalCommentEntry";
import {
  calculatePricePerSquareMeter,
  formatPricePerSquareMeter,
} from "@/features/properties/pricePerSquareMeter";

type PropertyDetailsEditableSectionsProps = {
  values: PropertyFormValues;
  canEdit: boolean;
  showInternalPrice: boolean;
  readOnlyPrivateHouseBalcony?: number | null;
  onDealTypeChange: (value: DealType) => void;
  onHotelScopeChange: (raw: string) => void;
  onFieldChange: (
    field: keyof Pick<PropertyFormValues, "city" | "district" | "address">,
    value: string,
    addressChangeMeta?: { selectedStreetId: string | null },
  ) => void;
  onPriceChange: (
    field: "pricePublic" | "priceInternal",
    value: number | undefined,
  ) => void;
  onLabelsChange: (value: LabelSelection[]) => void;
  onCommentChange: (
    field: "publicComment" | "privateComment" | "internalText",
    value: string,
  ) => void;
  setApartment: (patch: PropertyApartmentUpdate) => void;
  setFieldLocks: (nextLocks: PropertyFieldLocks) => void;
  setPrivateHouse: (patch: PropertyPrivateHouseUpdate) => void;
  setLandPlot: (patch: Partial<PropertyFormLandPlot>) => void;
  setCommercial: (patch: PropertyCommercialUpdate) => void;
};

function getEditableAreaSquareMeters(values: PropertyFormValues): number | null {
  if (values.propertyType === "APARTMENT") {
    return values.apartment?.totalArea ?? null;
  }
  if (
    values.propertyType === "PRIVATE_HOUSE" ||
    values.propertyType === "COTTAGE" ||
    values.propertyType === "HOTEL"
  ) {
    const houseArea = values.privateHouse?.houseArea;
    const yardArea = values.privateHouse?.yardArea;
    if (houseArea === undefined || yardArea === undefined) return null;
    return houseArea + yardArea;
  }
  if (values.propertyType === "COMMERCIAL") {
    return values.commercial?.area ?? null;
  }
  if (values.propertyType === "LAND_PLOT") {
    return values.landPlot?.landArea ?? null;
  }

  return null;
}

export function PropertyDetailsEditableSections({
  values,
  canEdit,
  showInternalPrice,
  readOnlyPrivateHouseBalcony,
  onDealTypeChange,
  onHotelScopeChange,
  onFieldChange,
  onPriceChange,
  onLabelsChange,
  onCommentChange,
  setApartment,
  setFieldLocks,
  setPrivateHouse,
  setLandPlot,
  setCommercial,
}: PropertyDetailsEditableSectionsProps) {
  const { districts } = useDistricts();
  const manualDistrictGroupRef = useRef(false);
  const isPersonalCommentEntryActiveRef = useRef(false);
  const [selectedDistrictGroup, setSelectedDistrictGroup] = useState("");
  const pricePerSquareMeter = calculatePricePerSquareMeter(
    values.pricePublic,
    getEditableAreaSquareMeters(values),
  );

  const showDistrictFields = isTbilisiCity(values.city);
  const hasKnownCity = GEORGIAN_CITY_OPTIONS.some(
    (option) => option.value === values.city,
  );
  const citySelectOptions =
    hasKnownCity || values.city.trim() === ""
      ? GEORGIAN_CITY_OPTIONS
      : [{ value: values.city, label: values.city }, ...GEORGIAN_CITY_OPTIONS];

  const derivedDistrictGroup = useMemo(() => {
    if (!showDistrictFields) {
      return "";
    }

    for (const districtGroup of districts ?? []) {
      if (districtGroup.neighborhoods.includes(values.district)) {
        return districtGroup.name;
      }
    }

    return "";
  }, [districts, showDistrictFields, values.district]);

  useEffect(() => {
    if (!showDistrictFields) {
      manualDistrictGroupRef.current = false;
      setSelectedDistrictGroup("");
      return;
    }

    if (manualDistrictGroupRef.current) {
      return;
    }

    setSelectedDistrictGroup(derivedDistrictGroup);
  }, [derivedDistrictGroup, showDistrictFields]);

  if (!canEdit) {
    return (
      <PropertyListingFieldsView
        values={values}
        showInternalPrice={showInternalPrice}
        readOnlyPrivateHouseBalcony={readOnlyPrivateHouseBalcony}
      />
    );
  }

  function handlePrivateCommentChange(value: string) {
    const result = applyDatedPersonalCommentEntry({
      previousValue: values.privateComment,
      rawValue: value,
      isEntryActive: isPersonalCommentEntryActiveRef.current,
    });
    isPersonalCommentEntryActiveRef.current = result.isEntryActive;
    onCommentChange("privateComment", result.nextValue);
  }

  return (
    <>
      <LabeledSelect
        label="გარიგების ტიპი"
        value={values.dealType}
        onChange={(value) => {
          if (isDealType(value)) onDealTypeChange(value);
        }}
        options={DEAL_TYPE_OPTIONS}
      />

      {values.propertyType === "HOTEL" && (
        <LabeledSelect
          label="სასტუმროს ტიპი"
          value={values.hotelScope ?? ""}
          onChange={onHotelScopeChange}
          options={[
            { value: "", label: "არ არის მითითებული" },
            ...HOTEL_SCOPE_FORM_OPTIONS,
          ]}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <LabeledSelect
          id="propertyCity"
          label="ქალაქი"
          value={values.city}
          onChange={(value) => onFieldChange("city", value)}
          options={citySelectOptions}
        />
        {showDistrictFields ? (
          <DistrictNeighborhoodPicker
            value={
              selectedDistrictGroup || values.district
                ? {
                    group: selectedDistrictGroup,
                    neighborhood: values.district,
                  }
                : null
            }
            onChange={(next) => {
              manualDistrictGroupRef.current = true;
              setSelectedDistrictGroup(next?.group ?? "");
              onFieldChange("district", next?.neighborhood ?? "");
            }}
          />
        ) : null}
      </div>

      <StreetAutocompleteField
        id="propertyAddress"
        label="მისამართი"
        value={values.address}
        onChange={(next, addressChangeMeta) =>
          onFieldChange("address", next, addressChangeMeta)
        }
        inputClassName={propertyDetailsEditableInputClassName}
      />

      <div
        className={`grid gap-4 sm:grid-cols-2 ${showInternalPrice ? "" : "max-w-md"}`}
      >
        <div className="space-y-1.5">
          <EditableNumericTextInput
            label="საჯარო ფასი"
            value={values.pricePublic}
            onValueChange={(next) => onPriceChange("pricePublic", next)}
            parse={parseIntegerInput}
            inputMode="numeric"
          />
          {pricePerSquareMeter !== null ? (
            <p className="text-xs font-medium text-muted-foreground">
              {formatPricePerSquareMeter(pricePerSquareMeter)}
            </p>
          ) : null}
        </div>
        {showInternalPrice && (
          <EditableNumericTextInput
            label="შიდა ფასი"
            value={values.priceInternal}
            onValueChange={(next) => onPriceChange("priceInternal", next)}
            parse={parseIntegerInput}
            inputMode="numeric"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <LabelAutocompleteChipsInput
          id="propertyLabels"
          label="ლეიბლები"
          selectedLabels={values.labels}
          onChange={onLabelsChange}
          allowFreeText
          placeholder="აკრიფეთ ლეიბლის მოსაძებნად ან დასამატებლად"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">კომენტარი</label>
        <textarea
          value={values.publicComment}
          onChange={(event) => onCommentChange("publicComment", event.target.value)}
          className="block w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground"
          rows={4}
        />
      </div>
      {showInternalPrice ? (
        <>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              კომენტარი ჩემთვის
            </label>
            <textarea
              value={values.privateComment}
              onChange={(event) => handlePrivateCommentChange(event.target.value)}
              onBlur={() => {
                isPersonalCommentEntryActiveRef.current = false;
              }}
              className="block w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground"
              rows={4}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">
              ატვირთვის ტექსტი
            </label>
            <textarea
              value={values.internalText}
              onChange={(event) =>
                onCommentChange("internalText", event.target.value)
              }
              className="block w-full resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none ring-0 placeholder:text-muted-foreground"
              rows={4}
            />
          </div>
        </>
      ) : null}

      {values.apartment && (
        <ApartmentEditSection
          dealType={values.dealType}
          apartment={values.apartment}
          setApartment={setApartment}
          fieldLocks={values.fieldLocks}
          setFieldLocks={setFieldLocks}
        />
      )}

      {values.privateHouse && (
        <PrivateHouseEditSection
          dealType={values.dealType}
          privateHouse={values.privateHouse}
          setPrivateHouse={setPrivateHouse}
        />
      )}

      {values.landPlot && (
        <LandPlotEditSection
          dealType={values.dealType}
          landPlot={values.landPlot}
          setLandPlot={setLandPlot}
        />
      )}

      {values.commercial && (
        <CommercialEditSection
          dealType={values.dealType}
          commercial={values.commercial}
          setCommercial={setCommercial}
        />
      )}
    </>
  );
}
