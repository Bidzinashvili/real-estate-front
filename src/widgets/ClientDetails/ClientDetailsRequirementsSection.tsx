import {
  RENOVATION_LABELS,
  BUILDING_CONDITION_LABELS,
  KITCHEN_TYPE_LABELS,
} from "@/features/clients/clientEnums";
import type { ClientRequirements } from "@/features/clients/types";
import { ClientDetailsLockBadge } from "@/widgets/ClientDetails/ClientDetailsLockBadge";
import { ClientDetailsRequirementRow } from "./ClientDetailsRequirementRow";

type ClientDetailsRequirementsSectionProps = {
  requirements: ClientRequirements;
};

export function ClientDetailsRequirementsSection({
  requirements: req,
}: ClientDetailsRequirementsSectionProps) {
  return (
    <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">მოთხოვნები</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <ClientDetailsRequirementRow
          label="მინ. ოთახები"
          value={req.minRooms}
          lock={req.minRoomsLock}
        />
        <ClientDetailsRequirementRow
          label="მაქს. ოთახები"
          value={req.maxRooms}
          lock={req.maxRoomsLock}
        />
        <ClientDetailsRequirementRow
          label="მინ. საძინებლები"
          value={req.minBedrooms}
          lock={req.minBedroomsLock}
        />
        <ClientDetailsRequirementRow
          label="მაქს. საძინებლები"
          value={req.maxBedrooms}
          lock={req.maxBedroomsLock}
        />
        <ClientDetailsRequirementRow
          label="მინ. სველი წერტილები"
          value={req.minBathrooms}
          lock={req.minBathroomsLock}
        />
        <ClientDetailsRequirementRow
          label="მაქს. სველი წერტილები"
          value={req.maxBathrooms}
          lock={req.maxBathroomsLock}
        />
        <ClientDetailsRequirementRow
          label="მინ. სართული"
          value={req.minFloor}
          lock={req.minFloorLock}
        />
        <ClientDetailsRequirementRow
          label="მაქს. სართული"
          value={req.maxFloor}
          lock={req.maxFloorLock}
        />
        <ClientDetailsRequirementRow
          label="ბოლო სართულის გამოკლებით"
          value={req.excludeLastFloor}
          lock={req.excludeLastFloorLock}
        />
        <ClientDetailsRequirementRow
          label="მინ. ფართობი"
          value={req.minArea !== null ? `${req.minArea} m²` : null}
          lock={req.minAreaLock}
        />
        <ClientDetailsRequirementRow
          label="მაქს. ფართობი"
          value={req.maxArea !== null ? `${req.maxArea} m²` : null}
          lock={req.maxAreaLock}
        />
        <ClientDetailsRequirementRow
          label="რემონტი"
          value={
            (req.renovations ?? []).length > 0
              ? (req.renovations ?? []).map((renovation) => RENOVATION_LABELS[renovation]).join(", ")
              : null
          }
          lock={req.renovationsLock}
        />
        <ClientDetailsRequirementRow
          label="შენობის მდგომარეობა"
          value={
            req.buildingCondition ? BUILDING_CONDITION_LABELS[req.buildingCondition] : null
          }
          lock={req.buildingConditionLock}
        />
        <ClientDetailsRequirementRow
          label="სამზარეულოს ტიპი"
          value={req.kitchenType ? KITCHEN_TYPE_LABELS[req.kitchenType] : null}
          lock={req.kitchenTypeLock}
        />
        <ClientDetailsRequirementRow
          label="აივანი"
          value={req.hasBalcony}
          lock={req.hasBalconyLock}
        />
        <ClientDetailsRequirementRow
          label="აივნის მინ. ფართობი (მ²)"
          value={req.balconyAreaMin}
          lock={req.balconyAreaMinLock}
        />
        <ClientDetailsRequirementRow
          label="აივნის მაქს. ფართობი (მ²)"
          value={req.balconyAreaMax}
          lock={req.balconyAreaMaxLock}
        />
        <ClientDetailsRequirementRow
          label="კარგი ხედი"
          value={req.goodView}
          lock={req.goodViewLock}
        />
        <ClientDetailsRequirementRow
          label="ლიფტი"
          value={req.elevator}
          lock={req.elevatorLock}
        />
        <ClientDetailsRequirementRow
          label="ცენტრალური გათბობა"
          value={req.centralHeating}
          lock={req.centralHeatingLock}
        />
        <ClientDetailsRequirementRow
          label="კონდიციონერი"
          value={req.airConditioner}
          lock={req.airConditionerLock}
        />
        <ClientDetailsRequirementRow
          label="ავეჯით"
          value={req.furnished}
          lock={req.furnishedLock}
        />
        <ClientDetailsRequirementRow
          label="პარკინგი"
          value={req.parking}
          lock={req.parkingLock}
        />
        <ClientDetailsRequirementRow
          label="მინიმალური ქირის ვადა"
          value={
            req.minRentalPeriod !== null
              ? `${req.minRentalPeriod} month${req.minRentalPeriod === 1 ? "" : "s"}`
              : null
          }
          lock={req.minRentalPeriodLock}
        />
        {((req.projectExclude ?? []).length > 0 || (req.projectExcludeLock ?? "none") !== "none") && (
          <div className="col-span-2 flex flex-col gap-0.5 sm:col-span-3 md:col-span-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">გამორიცხული პროექტები</span>
              {req.projectExcludeLock !== undefined ? (
                <ClientDetailsLockBadge lock={req.projectExcludeLock} />
              ) : null}
            </div>
            <span className="text-sm font-medium text-foreground">
              {(req.projectExclude ?? []).length > 0
                ? (req.projectExclude ?? []).join(", ")
                : "—"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
