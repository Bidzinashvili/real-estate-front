import {
  RENOVATION_LABELS,
  BUILDING_CONDITION_LABELS,
  KITCHEN_TYPE_LABELS,
} from "@/features/clients/clientEnums";
import type { LockState } from "@/features/clients/clientApi.types";
import type { ClientRequirements } from "@/features/clients/types";
import { ClientDetailsLockBadge } from "@/widgets/ClientDetails/ClientDetailsLockBadge";
import { ClientDetailsRequirementRow } from "./ClientDetailsRequirementRow";

type ClientDetailsRequirementsSectionProps = {
  requirements: ClientRequirements;
  getLock: (fieldKey: string, persisted?: LockState) => LockState;
  onLockChange: (fieldKey: string, nextLock: LockState) => void;
};

export function ClientDetailsRequirementsSection({
  requirements: req,
  getLock,
  onLockChange,
}: ClientDetailsRequirementsSectionProps) {
  return (
    <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">მოთხოვნები</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <ClientDetailsRequirementRow
          label="მინ. ოთახები"
          value={req.minRooms}
          lock={getLock("minRooms", req.minRoomsLock)}
          onLockChange={(nextLock) => onLockChange("minRooms", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. ოთახები"
          value={req.maxRooms}
          lock={getLock("maxRooms", req.maxRoomsLock)}
          onLockChange={(nextLock) => onLockChange("maxRooms", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მინ. საძინებლები"
          value={req.minBedrooms}
          lock={getLock("minBedrooms", req.minBedroomsLock)}
          onLockChange={(nextLock) => onLockChange("minBedrooms", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. საძინებლები"
          value={req.maxBedrooms}
          lock={getLock("maxBedrooms", req.maxBedroomsLock)}
          onLockChange={(nextLock) => onLockChange("maxBedrooms", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მინ. სველი წერტილები"
          value={req.minBathrooms}
          lock={getLock("minBathrooms", req.minBathroomsLock)}
          onLockChange={(nextLock) => onLockChange("minBathrooms", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. სველი წერტილები"
          value={req.maxBathrooms}
          lock={getLock("maxBathrooms", req.maxBathroomsLock)}
          onLockChange={(nextLock) => onLockChange("maxBathrooms", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მინ. სართული"
          value={req.minFloor}
          lock={getLock("minFloor", req.minFloorLock)}
          onLockChange={(nextLock) => onLockChange("minFloor", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. სართული"
          value={req.maxFloor}
          lock={getLock("maxFloor", req.maxFloorLock)}
          onLockChange={(nextLock) => onLockChange("maxFloor", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="ბოლო სართულის გამოკლებით"
          value={req.excludeLastFloor}
          lock={getLock("excludeLastFloor", req.excludeLastFloorLock)}
          onLockChange={(nextLock) => onLockChange("excludeLastFloor", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მინ. ფართობი"
          value={req.minArea !== null ? `${req.minArea} m²` : null}
          lock={getLock("minArea", req.minAreaLock)}
          onLockChange={(nextLock) => onLockChange("minArea", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. ფართობი"
          value={req.maxArea !== null ? `${req.maxArea} m²` : null}
          lock={getLock("maxArea", req.maxAreaLock)}
          onLockChange={(nextLock) => onLockChange("maxArea", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="რემონტი"
          value={
            (req.renovations ?? []).length > 0
              ? (req.renovations ?? []).map((renovation) => RENOVATION_LABELS[renovation]).join(", ")
              : null
          }
          lock={getLock("renovations", req.renovationsLock)}
          onLockChange={(nextLock) => onLockChange("renovations", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="შენობის მდგომარეობა"
          value={
            req.buildingCondition ? BUILDING_CONDITION_LABELS[req.buildingCondition] : null
          }
          lock={getLock("buildingCondition", req.buildingConditionLock)}
          onLockChange={(nextLock) => onLockChange("buildingCondition", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="სამზარეულოს ტიპი"
          value={req.kitchenType ? KITCHEN_TYPE_LABELS[req.kitchenType] : null}
          lock={getLock("kitchenType", req.kitchenTypeLock)}
          onLockChange={(nextLock) => onLockChange("kitchenType", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="აივანი"
          value={req.hasBalcony}
          lock={getLock("hasBalcony", req.hasBalconyLock)}
          onLockChange={(nextLock) => onLockChange("hasBalcony", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="აივნის მინ. ფართობი (მ²)"
          value={req.balconyAreaMin}
          lock={getLock("balconyAreaMin", req.balconyAreaMinLock)}
          onLockChange={(nextLock) => onLockChange("balconyAreaMin", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="აივნის მაქს. ფართობი (მ²)"
          value={req.balconyAreaMax}
          lock={getLock("balconyAreaMax", req.balconyAreaMaxLock)}
          onLockChange={(nextLock) => onLockChange("balconyAreaMax", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="კარგი ხედი"
          value={req.goodView}
          lock={getLock("goodView", req.goodViewLock)}
          onLockChange={(nextLock) => onLockChange("goodView", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="ლიფტი"
          value={req.elevator}
          lock={getLock("elevator", req.elevatorLock)}
          onLockChange={(nextLock) => onLockChange("elevator", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="ცენტრალური გათბობა"
          value={req.centralHeating}
          lock={getLock("centralHeating", req.centralHeatingLock)}
          onLockChange={(nextLock) => onLockChange("centralHeating", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="კონდიციონერი"
          value={req.airConditioner}
          lock={getLock("airConditioner", req.airConditionerLock)}
          onLockChange={(nextLock) => onLockChange("airConditioner", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="ავეჯით"
          value={req.furnished}
          lock={getLock("furnished", req.furnishedLock)}
          onLockChange={(nextLock) => onLockChange("furnished", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="პარკინგი"
          value={req.parking}
          lock={getLock("parking", req.parkingLock)}
          onLockChange={(nextLock) => onLockChange("parking", nextLock)}
        />
        <ClientDetailsRequirementRow
          label="მინიმალური ქირის ვადა"
          value={
            req.minRentalPeriod !== null
              ? `${req.minRentalPeriod} month${req.minRentalPeriod === 1 ? "" : "s"}`
              : null
          }
          lock={getLock("minRentalPeriod", req.minRentalPeriodLock)}
          onLockChange={(nextLock) => onLockChange("minRentalPeriod", nextLock)}
        />
        <div className="col-span-2 flex flex-col gap-0.5 sm:col-span-3 md:col-span-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">გამორიცხული პროექტები</span>
            <ClientDetailsLockBadge
              lock={getLock("projectExclude", req.projectExcludeLock)}
              onChange={(nextLock) => onLockChange("projectExclude", nextLock)}
            />
          </div>
          <span className="text-sm font-medium text-foreground">
            {(req.projectExclude ?? []).length > 0
              ? (req.projectExclude ?? []).join(", ")
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
