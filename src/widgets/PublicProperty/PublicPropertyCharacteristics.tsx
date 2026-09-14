import {
  formatBuildingAgeTypeLabel,
  formatBuildingConditionLabel,
  formatKitchenTypeLabel,
  formatLandCategoryLabel,
  formatLandUsageLabel,
  formatRenovationLabel,
} from "@/features/properties/addPropertyFormOptions";
import { isRentalDealType } from "@/features/properties/propertyStatus";
import {
  BUILDING_AGE_TYPE_FIELD_LABEL,
  COMMERCIAL_STATUS_LABELS,
  lookupEnumLabel,
} from "@/shared/i18n/enumLabels";
import type { PublicProperty } from "@/features/propertyShare/publicPropertyTypes";
import {
  PropertyViewFact,
  PropertyViewFactGrid,
} from "@/widgets/PropertyDetails/PropertyViewFact";

type PublicPropertyCharacteristicsProps = {
  property: PublicProperty;
};

function PublicNumberFact({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number | null | undefined;
  suffix?: string;
}) {
  if (value === null || value === undefined || Number.isNaN(value) || value <= 0) {
    return null;
  }
  const formatted = suffix ? `${value.toLocaleString()} ${suffix}` : value.toLocaleString();
  return <PropertyViewFact label={label} value={formatted} />;
}

function PublicBooleanFact({
  label,
  value,
}: {
  label: string;
  value: boolean | null | undefined;
}) {
  if (value === null || value === undefined) {
    return null;
  }
  return (
    <PropertyViewFact
      label={label}
      value={value ? "კი" : "არა"}
      tone={value ? "yes" : "no"}
    />
  );
}

function PublicTextFact({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  const text = value?.trim();
  if (!text) {
    return null;
  }
  return <PropertyViewFact label={label} value={text} />;
}

function hasRenderableChild(children: Array<unknown>): boolean {
  return children.some((child) => child !== null && child !== undefined && child !== false);
}

export function PublicPropertyCharacteristics({
  property,
}: PublicPropertyCharacteristicsProps) {
  const showRentPeriod = isRentalDealType(property.dealType);

  if (property.apartment) {
    const apartment = property.apartment;
    const facts = [
      <PublicNumberFact key="area" label="ფართობი" value={apartment.totalArea} suffix="მ²" />,
      <PublicNumberFact key="rooms" label="ოთახები" value={apartment.rooms} />,
      <PublicNumberFact key="bedrooms" label="საძინებლები" value={apartment.bedrooms} />,
      <PublicNumberFact key="bathrooms" label="სველი წერტილები" value={apartment.bathrooms} />,
      <PublicNumberFact key="floor" label="სართული" value={apartment.floor} />,
      <PublicNumberFact
        key="totalFloors"
        label="სულ სართულები"
        value={apartment.totalFloors}
      />,
      <PublicNumberFact
        key="ceiling"
        label="ჭერის სიმაღლე"
        value={apartment.ceilingHeight}
        suffix="მ"
      />,
      <PublicTextFact
        key="renovation"
        label="რემონტი"
        value={formatRenovationLabel(apartment.renovation)}
      />,
      <PublicTextFact
        key="building"
        label="შენობის მდგომარეობა"
        value={formatBuildingConditionLabel(apartment.buildingCondition)}
      />,
      <PublicTextFact
        key="buildingAge"
        label={BUILDING_AGE_TYPE_FIELD_LABEL}
        value={formatBuildingAgeTypeLabel(apartment.buildingAgeType)}
      />,
      <PublicTextFact
        key="kitchen"
        label="სამზარეულოს ტიპი"
        value={formatKitchenTypeLabel(apartment.kitchenType)}
      />,
      <PublicNumberFact
        key="balcony"
        label="აივნის ფართობი"
        value={apartment.balconyArea}
        suffix="მ²"
      />,
      showRentPeriod ? (
        <PublicNumberFact
          key="rent"
          label="მინიმალური ქირის ვადა"
          value={apartment.minRentalPeriod}
          suffix="თვე"
        />
      ) : null,
      <PublicTextFact key="project" label="პროექტი" value={apartment.project} />,
      <PublicNumberFact key="parking" label="პარკინგი" value={apartment.parkingSpaces} />,
    ];
    const comfort = [
      <PublicBooleanFact key="elevator" label="ლიფტი" value={apartment.elevator} />,
      <PublicBooleanFact key="view" label="კარგი ხედი" value={apartment.goodView} />,
      <PublicBooleanFact
        key="heating"
        label="ცენტრალური გათბობა"
        value={apartment.centralHeating}
      />,
      <PublicBooleanFact
        key="ac"
        label="კონდიციონერი"
        value={apartment.airConditioner}
      />,
      <PublicBooleanFact key="furnished" label="ავეჯი" value={apartment.furnished} />,
      <PublicBooleanFact
        key="pets"
        label="შინაური ცხოველები"
        value={apartment.petsAllowed}
      />,
    ];

    return (
      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">მახასიათებლები</h2>
        {hasRenderableChild(facts) ? (
          <PropertyViewFactGrid>{facts}</PropertyViewFactGrid>
        ) : null}
        {hasRenderableChild(comfort) ? (
          <>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">კომფორტი</h3>
            <PropertyViewFactGrid>{comfort}</PropertyViewFactGrid>
          </>
        ) : null}
      </section>
    );
  }

  if (property.privateHouse) {
    const house = property.privateHouse;
    const facts = [
      <PublicNumberFact key="house" label="სახლის ფართობი" value={house.houseArea} suffix="მ²" />,
      <PublicNumberFact key="yard" label="ეზოს ფართობი" value={house.yardArea} suffix="მ²" />,
      <PublicNumberFact key="total" label="საერთო ფართობი" value={house.totalArea} suffix="მ²" />,
      <PublicNumberFact key="rooms" label="ოთახები" value={house.rooms} />,
      <PublicNumberFact key="bedrooms" label="საძინებლები" value={house.bedrooms} />,
      <PublicNumberFact key="balcony" label="აივნის ფართობი" value={house.balconyArea} suffix="მ²" />,
      <PublicTextFact
        key="renovation"
        label="რემონტი"
        value={formatRenovationLabel(house.renovation)}
      />,
      <PublicTextFact
        key="building"
        label="შენობის მდგომარეობა"
        value={formatBuildingConditionLabel(house.buildingCondition)}
      />,
      showRentPeriod ? (
        <PublicNumberFact
          key="rent"
          label="მინიმალური ქირის ვადა"
          value={house.minRentalPeriod}
          suffix="თვე"
        />
      ) : null,
      <PublicNumberFact key="parking" label="პარკინგი" value={house.parkingSpaces} />,
    ];
    const comfort = [
      <PublicBooleanFact key="heating" label="ცენტრალური გათბობა" value={house.centralHeating} />,
      <PublicBooleanFact key="ac" label="კონდიციონერი" value={house.airConditioner} />,
      <PublicBooleanFact key="furnished" label="ავეჯი" value={house.furnished} />,
      <PublicBooleanFact key="pool" label="აუზი" value={house.pool} />,
      <PublicBooleanFact key="trees" label="ხეხილი" value={house.fruitTrees} />,
      <PublicBooleanFact key="electricity" label="ელექტროენერგია" value={house.electricity} />,
      <PublicBooleanFact key="water" label="წყალი" value={house.water} />,
      <PublicBooleanFact key="gas" label="გაზი" value={house.gas} />,
      <PublicBooleanFact key="sewage" label="კანალიზაცია" value={house.sewage} />,
      showRentPeriod ? (
        <PublicBooleanFact key="pets" label="შინაური ცხოველები" value={house.petsAllowed} />
      ) : null,
    ];

    return (
      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">მახასიათებლები</h2>
        {hasRenderableChild(facts) ? (
          <PropertyViewFactGrid>{facts}</PropertyViewFactGrid>
        ) : null}
        {hasRenderableChild(comfort) ? (
          <>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">კომფორტი</h3>
            <PropertyViewFactGrid>{comfort}</PropertyViewFactGrid>
          </>
        ) : null}
      </section>
    );
  }

  if (property.landPlot) {
    const plot = property.landPlot;
    const facts = [
      <PublicNumberFact key="area" label="ფართობი" value={plot.landArea} suffix="მ²" />,
      <PublicTextFact
        key="category"
        label="მიწის კატეგორია"
        value={plot.landCategory ? formatLandCategoryLabel(plot.landCategory) : null}
      />,
      <PublicTextFact
        key="usage"
        label="მიწის დანიშნულება"
        value={plot.landUsage ? formatLandUsageLabel(plot.landUsage) : null}
      />,
      showRentPeriod ? (
        <PublicNumberFact
          key="rent"
          label="მინიმალური ქირის ვადა"
          value={plot.minRentalPeriod}
          suffix="თვე"
        />
      ) : null,
    ];
    const extras = [
      <PublicBooleanFact key="investment" label="საინვესტიციო" value={plot.forInvestment} />,
      <PublicBooleanFact key="project" label="დამტკიცებული პროექტი" value={plot.approvedProject} />,
      <PublicBooleanFact key="divided" label="იყოფა" value={plot.canBeDivided} />,
      <PublicBooleanFact key="trees" label="ხეხილი" value={plot.fruitTrees} />,
      <PublicBooleanFact key="electricity" label="ელექტროენერგია" value={plot.electricity} />,
      <PublicBooleanFact key="water" label="წყალი" value={plot.water} />,
      <PublicBooleanFact key="gas" label="გაზი" value={plot.gas} />,
      <PublicBooleanFact key="sewage" label="კანალიზაცია" value={plot.sewage} />,
    ];

    return (
      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">მახასიათებლები</h2>
        {hasRenderableChild(facts) ? (
          <PropertyViewFactGrid>{facts}</PropertyViewFactGrid>
        ) : null}
        {hasRenderableChild(extras) ? (
          <>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">დამატებით</h3>
            <PropertyViewFactGrid>{extras}</PropertyViewFactGrid>
          </>
        ) : null}
      </section>
    );
  }

  if (property.commercial) {
    const commercial = property.commercial;
    const facts = [
      <PublicNumberFact key="area" label="ფართობი" value={commercial.area} suffix="მ²" />,
      <PublicTextFact
        key="status"
        label="დანიშნულება"
        value={lookupEnumLabel(COMMERCIAL_STATUS_LABELS, commercial.status)}
      />,
      <PublicNumberFact key="floor" label="სართული" value={commercial.floor} />,
      <PublicNumberFact
        key="totalFloors"
        label="სულ სართულები"
        value={commercial.totalFloors}
      />,
      <PublicNumberFact
        key="ceiling"
        label="ჭერის სიმაღლე"
        value={commercial.ceilingHeight}
        suffix="მ"
      />,
      <PublicTextFact
        key="renovation"
        label="რემონტი"
        value={formatRenovationLabel(commercial.renovation)}
      />,
      showRentPeriod ? (
        <PublicNumberFact
          key="rent"
          label="მინიმალური ქირის ვადა"
          value={commercial.minRentalPeriod}
          suffix="თვე"
        />
      ) : null,
      <PublicNumberFact key="parking" label="პარკინგი" value={commercial.parkingSpaces} />,
    ];
    const comfort = [
      <PublicBooleanFact
        key="heating"
        label="ცენტრალური გათბობა"
        value={commercial.centralHeating}
      />,
      <PublicBooleanFact key="ac" label="კონდიციონერი" value={commercial.airConditioner} />,
      <PublicBooleanFact key="furnished" label="ავეჯი" value={commercial.furnished} />,
      <PublicBooleanFact key="electricity" label="ელექტროენერგია" value={commercial.electricity} />,
      <PublicBooleanFact key="water" label="წყალი" value={commercial.water} />,
      <PublicBooleanFact key="gas" label="გაზი" value={commercial.gas} />,
      <PublicBooleanFact key="sewage" label="კანალიზაცია" value={commercial.sewage} />,
    ];

    return (
      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">მახასიათებლები</h2>
        {hasRenderableChild(facts) ? (
          <PropertyViewFactGrid>{facts}</PropertyViewFactGrid>
        ) : null}
        {hasRenderableChild(comfort) ? (
          <>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">კომფორტი</h3>
            <PropertyViewFactGrid>{comfort}</PropertyViewFactGrid>
          </>
        ) : null}
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border sm:p-6">
      <h2 className="mb-2 text-base font-semibold text-foreground">მახასიათებლები</h2>
      <p className="text-sm text-muted-foreground">ამ ობიექტის ტიპის დეტალები არ არის მითითებული.</p>
    </section>
  );
}
