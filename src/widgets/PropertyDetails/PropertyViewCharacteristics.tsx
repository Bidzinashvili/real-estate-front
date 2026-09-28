import type { Property } from "@/features/properties/types";
import { BUILDING_STRUCTURE_FIELD_LABEL, KITCHEN_TYPE_FIELD_LABEL, APARTMENT_PROJECT_FIELD_LABEL } from "@/shared/i18n/enumLabels";
import { formatProjectDisplayName } from "@/features/properties/projectName";
import {
  ListingParkingFact,
  ListingBalconyFacts,
  OptionalTextFact,
  PropertyViewFactGrid,
  VerifiableBooleanFact,
  VerifiableNumberFact,
} from "@/widgets/PropertyDetails/PropertyViewFact";
import {
  formatBuildingStructureDisplay,
  formatCommercialStatusLabel,
  formatKitchenTypeLabel,
  formatLandCategoryLabel,
  formatLandUsageLabel,
  formatRenovationLabel,
  isRentalDeal,
} from "@/widgets/PropertyDetails/propertyViewFormatters";
import { CANONICAL_AREA_MISSING_LABEL } from "@/features/properties/propertyArea";

type PropertyViewCharacteristicsProps = {
  property: Property;
};

function needsVerificationIncludes(fields: string[] | undefined, fieldKey: string): boolean {
  return (fields ?? []).includes(fieldKey);
}

export function PropertyViewCharacteristics({ property }: PropertyViewCharacteristicsProps) {
  const showRentPeriod = isRentalDeal(property);

  return (
    <div className="space-y-6">
      {property.apartment ? (
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">მახასიათებლები</h2>
          <PropertyViewFactGrid>
            <VerifiableNumberFact
              label="ფართობი"
              value={property.apartment.totalArea}
              isToBeVerified={false}
              suffix="მ²"
              requirePositive
              emptyLabel={CANONICAL_AREA_MISSING_LABEL}
            />
            <VerifiableNumberFact
              label="ოთახები"
              value={property.apartment.rooms}
              isToBeVerified={false}
            />
            <VerifiableNumberFact
              label="საძინებლები"
              value={property.apartment.bedrooms}
              isToBeVerified={false}
            />
            <VerifiableNumberFact
              label="სველი წერტილები"
              value={property.apartment.bathrooms}
              isToBeVerified={false}
            />
            <VerifiableNumberFact
              label="სართული"
              value={property.apartment.floor}
              isToBeVerified={false}
            />
            <VerifiableNumberFact
              label="სულ სართულები"
              value={property.apartment.totalFloors}
              isToBeVerified={false}
            />
            <VerifiableNumberFact
              label="ჭერის სიმაღლე"
              value={property.apartment.ceilingHeight}
              isToBeVerified={false}
              suffix="მ"
            />
            <OptionalTextFact
              label="რემონტი"
              value={formatRenovationLabel(property.apartment.renovation)}
            />
            <OptionalTextFact
              label={BUILDING_STRUCTURE_FIELD_LABEL}
              value={formatBuildingStructureDisplay(
                property.apartment.buildingCondition,
                property.apartment.buildingAgeType,
              )}
            />
            <OptionalTextFact
              label={KITCHEN_TYPE_FIELD_LABEL}
              value={formatKitchenTypeLabel(property.apartment.kitchenType)}
            />
            <ListingBalconyFacts
              balconyCount={property.apartment.balconyCount}
              needsVerification={property.apartment.needsVerification}
              balconyArea={property.apartment.balconyArea}
              veranda={property.apartment.veranda}
            />
            {showRentPeriod ? (
              <VerifiableNumberFact
                label="მინიმალური ქირის ვადა"
                value={property.apartment.minRentalPeriod}
                isToBeVerified={false}
                suffix="თვე"
              />
            ) : null}
            <OptionalTextFact
              label={APARTMENT_PROJECT_FIELD_LABEL}
              value={formatProjectDisplayName(property.apartment.project)}
            />
            {property.apartment.buildingNumber !== undefined ? (
              <OptionalTextFact
                label="კორპუსის ნომერი"
                value={property.apartment.buildingNumber}
              />
            ) : null}
            <ListingParkingFact
              parking={property.apartment.parking}
              parkingTypes={property.apartment.parkingTypes}
            />
            <VerifiableNumberFact
              label="პარკინგის ადგილები"
              value={property.apartment.parkingSpaces}
              isToBeVerified={needsVerificationIncludes(
                property.apartment.needsVerification,
                "parkingSpaces",
              )}
            />
          </PropertyViewFactGrid>

          <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">კომფორტი</h3>
          <PropertyViewFactGrid>
            <VerifiableBooleanFact
              label="ლიფტი"
              value={property.apartment.elevator}
              isToBeVerified={needsVerificationIncludes(
                property.apartment.needsVerification,
                "elevator",
              )}
            />
            <VerifiableBooleanFact
              label="კარგი ხედი"
              value={property.apartment.goodView}
              isToBeVerified={needsVerificationIncludes(
                property.apartment.needsVerification,
                "goodView",
              )}
            />
            <VerifiableBooleanFact
              label="ცენტრალური გათბობა"
              value={property.apartment.centralHeating}
              isToBeVerified={needsVerificationIncludes(
                property.apartment.needsVerification,
                "centralHeating",
              )}
            />
            <VerifiableBooleanFact
              label="კონდიციონერი"
              value={property.apartment.airConditioner}
              isToBeVerified={needsVerificationIncludes(
                property.apartment.needsVerification,
                "airConditioner",
              )}
            />
            <VerifiableBooleanFact
              label="ავეჯი"
              value={property.apartment.furnished}
              isToBeVerified={needsVerificationIncludes(
                property.apartment.needsVerification,
                "furnished",
              )}
            />
            <VerifiableBooleanFact
              label="შინაური ცხოველები"
              value={property.apartment.petsAllowed}
              isToBeVerified={needsVerificationIncludes(
                property.apartment.needsVerification,
                "petsAllowed",
              )}
            />
          </PropertyViewFactGrid>
        </section>
      ) : null}

      {property.privateHouse ? (
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">მახასიათებლები</h2>
          <PropertyViewFactGrid>
            <VerifiableNumberFact
              label="სახლის ფართობი"
              value={property.privateHouse.houseArea}
              isToBeVerified={false}
              suffix="მ²"
            />
            <VerifiableNumberFact
              label="ეზოს ფართობი"
              value={property.privateHouse.yardArea}
              isToBeVerified={false}
              suffix="მ²"
            />
            <VerifiableNumberFact
              label="საერთო ფართობი"
              value={property.privateHouse.totalArea}
              isToBeVerified={false}
              suffix="მ²"
              requirePositive
              emptyLabel={CANONICAL_AREA_MISSING_LABEL}
            />
            <VerifiableNumberFact
              label="ოთახები"
              value={property.privateHouse.rooms}
              isToBeVerified={false}
            />
            <VerifiableNumberFact
              label="საძინებლები"
              value={property.privateHouse.bedrooms}
              isToBeVerified={false}
            />
            <ListingBalconyFacts
              balconyCount={property.privateHouse.balconyCount}
              needsVerification={property.privateHouse.needsVerification}
              balconyArea={property.privateHouse.balconyArea}
              veranda={property.privateHouse.veranda}
            />
            <OptionalTextFact
              label="რემონტი"
              value={formatRenovationLabel(property.privateHouse.renovation)}
            />
            <OptionalTextFact
              label={BUILDING_STRUCTURE_FIELD_LABEL}
              value={formatBuildingStructureDisplay(
                property.privateHouse.buildingCondition,
              )}
            />
            {showRentPeriod ? (
              <VerifiableNumberFact
                label="მინიმალური ქირის ვადა"
                value={property.privateHouse.minRentalPeriod}
                isToBeVerified={false}
                suffix="თვე"
              />
            ) : null}
            <ListingParkingFact
              parking={property.privateHouse.parking}
              parkingTypes={property.privateHouse.parkingTypes}
            />
            <VerifiableNumberFact
              label="პარკინგის ადგილები"
              value={property.privateHouse.parkingSpaces}
              isToBeVerified={false}
            />
          </PropertyViewFactGrid>

          <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">კომფორტი</h3>
          <PropertyViewFactGrid>
            <VerifiableBooleanFact
              label="ცენტრალური გათბობა"
              value={property.privateHouse.centralHeating}
              isToBeVerified={needsVerificationIncludes(
                property.privateHouse.needsVerification,
                "centralHeating",
              )}
            />
            <VerifiableBooleanFact
              label="კონდიციონერი"
              value={property.privateHouse.airConditioner}
              isToBeVerified={needsVerificationIncludes(
                property.privateHouse.needsVerification,
                "airConditioner",
              )}
            />
            <VerifiableBooleanFact
              label="ავეჯი"
              value={property.privateHouse.furnished}
              isToBeVerified={needsVerificationIncludes(
                property.privateHouse.needsVerification,
                "furnished",
              )}
            />
            <VerifiableBooleanFact
              label="აუზი"
              value={property.privateHouse.pool}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="ხეხილი"
              value={property.privateHouse.fruitTrees}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="ელექტროენერგია"
              value={property.privateHouse.electricity}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="წყალი"
              value={property.privateHouse.water}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="გაზი"
              value={property.privateHouse.gas}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="კანალიზაცია"
              value={property.privateHouse.sewage}
              isToBeVerified={false}
            />
            {showRentPeriod ? (
              <VerifiableBooleanFact
                label="შინაური ცხოველები"
                value={property.privateHouse.petsAllowed}
                isToBeVerified={false}
              />
            ) : null}
          </PropertyViewFactGrid>
        </section>
      ) : null}

      {property.landPlot ? (
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">მახასიათებლები</h2>
          <PropertyViewFactGrid>
            <VerifiableNumberFact
              label="ფართობი"
              value={property.landPlot.landArea}
              isToBeVerified={false}
              suffix="მ²"
              requirePositive
              emptyLabel={CANONICAL_AREA_MISSING_LABEL}
            />
            <OptionalTextFact
              label="მიწის კატეგორია"
              value={formatLandCategoryLabel(property.landPlot.landCategory)}
            />
            <OptionalTextFact
              label="მიწის დანიშნულება"
              value={formatLandUsageLabel(property.landPlot.landUsage)}
            />
            {showRentPeriod ? (
              <VerifiableNumberFact
                label="მინიმალური ქირის ვადა"
                value={property.landPlot.minRentalPeriod}
                isToBeVerified={false}
                suffix="თვე"
              />
            ) : null}
          </PropertyViewFactGrid>

          <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">დამატებით</h3>
          <PropertyViewFactGrid>
            <VerifiableBooleanFact
              label="საინვესტიციო"
              value={property.landPlot.forInvestment}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="დამტკიცებული პროექტი"
              value={property.landPlot.approvedProject}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="იყოფა"
              value={property.landPlot.canBeDivided}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="ხეხილი"
              value={property.landPlot.fruitTrees}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="ელექტროენერგია"
              value={property.landPlot.electricity}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="წყალი"
              value={property.landPlot.water}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="გაზი"
              value={property.landPlot.gas}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="კანალიზაცია"
              value={property.landPlot.sewage}
              isToBeVerified={false}
            />
          </PropertyViewFactGrid>
        </section>
      ) : null}

      {property.commercial ? (
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
          <h2 className="mb-4 text-base font-semibold text-foreground">მახასიათებლები</h2>
          <PropertyViewFactGrid>
            <VerifiableNumberFact
              label="ფართობი"
              value={property.commercial.area}
              isToBeVerified={false}
              suffix="მ²"
              requirePositive
              emptyLabel={CANONICAL_AREA_MISSING_LABEL}
            />
            <OptionalTextFact
              label="დანიშნულება"
              value={formatCommercialStatusLabel(property.commercial.status)}
            />
            <VerifiableNumberFact
              label="სართული"
              value={property.commercial.floor}
              isToBeVerified={false}
            />
            <VerifiableNumberFact
              label="სულ სართულები"
              value={property.commercial.totalFloors}
              isToBeVerified={false}
            />
            <VerifiableNumberFact
              label="ჭერის სიმაღლე"
              value={property.commercial.ceilingHeight}
              isToBeVerified={false}
              suffix="მ"
            />
            <OptionalTextFact
              label="რემონტი"
              value={formatRenovationLabel(property.commercial.renovation)}
            />
            {showRentPeriod ? (
              <VerifiableNumberFact
                label="მინიმალური ქირის ვადა"
                value={property.commercial.minRentalPeriod}
                isToBeVerified={false}
                suffix="თვე"
              />
            ) : null}
            <ListingParkingFact
              parking={property.commercial.parking}
              parkingTypes={property.commercial.parkingTypes}
            />
            <VerifiableNumberFact
              label="პარკინგის ადგილები"
              value={property.commercial.parkingSpaces}
              isToBeVerified={false}
            />
          </PropertyViewFactGrid>

          <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">კომფორტი</h3>
          <PropertyViewFactGrid>
            <VerifiableBooleanFact
              label="ცენტრალური გათბობა"
              value={property.commercial.centralHeating}
              isToBeVerified={needsVerificationIncludes(
                property.commercial.needsVerification,
                "centralHeating",
              )}
            />
            <VerifiableBooleanFact
              label="კონდიციონერი"
              value={property.commercial.airConditioner}
              isToBeVerified={needsVerificationIncludes(
                property.commercial.needsVerification,
                "airConditioner",
              )}
            />
            <VerifiableBooleanFact
              label="ელექტროენერგია"
              value={property.commercial.electricity}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="წყალი"
              value={property.commercial.water}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="გაზი"
              value={property.commercial.gas}
              isToBeVerified={false}
            />
            <VerifiableBooleanFact
              label="კანალიზაცია"
              value={property.commercial.sewage}
              isToBeVerified={false}
            />
          </PropertyViewFactGrid>
        </section>
      ) : null}

      {!property.apartment &&
      !property.privateHouse &&
      !property.landPlot &&
      !property.commercial ? (
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
          <h2 className="mb-2 text-base font-semibold text-foreground">მახასიათებლები</h2>
          <p className="text-sm text-muted-foreground">ამ ობიექტის ტიპის დეტალები არ არის მითითებული.</p>
        </section>
      ) : null}
    </div>
  );
}
