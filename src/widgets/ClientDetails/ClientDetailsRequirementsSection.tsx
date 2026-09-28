import {
  RENOVATION_LABELS,
  BUILDING_CONDITION_LABELS,
  KITCHEN_TYPE_LABELS,
} from "@/features/clients/clientEnums";
import type { LockState } from "@/features/clients/clientApi.types";
import type { ClientRequirements } from "@/features/clients/types";
import { ClientDetailsLockBadge } from "@/widgets/ClientDetails/ClientDetailsLockBadge";
import { ClientDetailsRequirementRow } from "./ClientDetailsRequirementRow";
import { formatProjectDisplayName } from "@/features/properties/projectName";

type ClientDetailsRequirementsSectionProps = {
  requirements: ClientRequirements;
  getLock: (fieldKey: string, persisted?: LockState) => LockState;
  onLockChange: (fieldKey: string, nextLock: LockState) => void;
  showLockControls?: boolean;
};

export function ClientDetailsRequirementsSection({
  requirements: req,
  getLock,
  onLockChange,
  showLockControls = true,
}: ClientDetailsRequirementsSectionProps) {
  function rowLockProps(fieldKey: string, persisted?: LockState) {
    if (!showLockControls) {
      return { lock: undefined, onLockChange: undefined };
    }
    const lock = getLock(fieldKey, persisted);
    return {
      lock,
      persistedLock: (persisted === "frozen" ? "frozen" : "none") as LockState,
      onLockChange: (nextLock: LockState) => onLockChange(fieldKey, nextLock),
    };
  }

  return (
    <div className="rounded-xl bg-card p-6 shadow-sm ring-1 ring-border">
      <h2 className="mb-4 text-base font-semibold text-foreground">მოთხოვნები</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <ClientDetailsRequirementRow
          label="მინ. ოთახები"
          value={req.minRooms}
          {...rowLockProps("minRooms", req.minRoomsLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. ოთახები"
          value={req.maxRooms}
          {...rowLockProps("maxRooms", req.maxRoomsLock)}
        />
        <ClientDetailsRequirementRow
          label="მინ. საძინებლები"
          value={req.minBedrooms}
          {...rowLockProps("minBedrooms", req.minBedroomsLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. საძინებლები"
          value={req.maxBedrooms}
          {...rowLockProps("maxBedrooms", req.maxBedroomsLock)}
        />
        <ClientDetailsRequirementRow
          label="მინ. სველი წერტილები"
          value={req.minBathrooms}
          {...rowLockProps("minBathrooms", req.minBathroomsLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. სველი წერტილები"
          value={req.maxBathrooms}
          {...rowLockProps("maxBathrooms", req.maxBathroomsLock)}
        />
        <ClientDetailsRequirementRow
          label="მინ. სართული"
          value={req.minFloor}
          {...rowLockProps("minFloor", req.minFloorLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. სართული"
          value={req.maxFloor}
          {...rowLockProps("maxFloor", req.maxFloorLock)}
        />
        <ClientDetailsRequirementRow
          label="ბოლო სართულის გამოკლებით"
          value={req.excludeLastFloor}
          {...rowLockProps("excludeLastFloor", req.excludeLastFloorLock)}
        />
        <ClientDetailsRequirementRow
          label="მინ. ფართობი"
          value={req.minArea !== null ? `${req.minArea} m²` : null}
          {...rowLockProps("minArea", req.minAreaLock)}
        />
        <ClientDetailsRequirementRow
          label="მაქს. ფართობი"
          value={req.maxArea !== null ? `${req.maxArea} m²` : null}
          {...rowLockProps("maxArea", req.maxAreaLock)}
        />
        <ClientDetailsRequirementRow
          label="რემონტი"
          value={
            (req.renovations ?? []).length > 0
              ? (req.renovations ?? []).map((renovation) => RENOVATION_LABELS[renovation]).join(", ")
              : null
          }
          {...rowLockProps("renovations", req.renovationsLock)}
        />
        <ClientDetailsRequirementRow
          label="კორპუსი"
          value={
            req.buildingCondition ? BUILDING_CONDITION_LABELS[req.buildingCondition] : null
          }
          {...rowLockProps("buildingCondition", req.buildingConditionLock)}
        />
        <ClientDetailsRequirementRow
          label="სამზარეულოს ტიპი"
          value={req.kitchenType ? KITCHEN_TYPE_LABELS[req.kitchenType] : null}
          {...rowLockProps("kitchenType", req.kitchenTypeLock)}
        />
        <ClientDetailsRequirementRow
          label="აივანი"
          value={req.hasBalcony}
          {...rowLockProps("hasBalcony", req.hasBalconyLock)}
        />
        <ClientDetailsRequirementRow
          label="აივნის მინ. ფართობი (მ²)"
          value={req.balconyAreaMin}
          {...rowLockProps("balconyAreaMin", req.balconyAreaMinLock)}
        />
        <ClientDetailsRequirementRow
          label="აივნის მაქს. ფართობი (მ²)"
          value={req.balconyAreaMax}
          {...rowLockProps("balconyAreaMax", req.balconyAreaMaxLock)}
        />
        <ClientDetailsRequirementRow
          label="კარგი ხედი"
          value={req.goodView}
          {...rowLockProps("goodView", req.goodViewLock)}
        />
        <ClientDetailsRequirementRow
          label="ლიფტი"
          value={req.elevator}
          {...rowLockProps("elevator", req.elevatorLock)}
        />
        <ClientDetailsRequirementRow
          label="ცენტრალური გათბობა"
          value={req.centralHeating}
          {...rowLockProps("centralHeating", req.centralHeatingLock)}
        />
        <ClientDetailsRequirementRow
          label="კონდიციონერი"
          value={req.airConditioner}
          {...rowLockProps("airConditioner", req.airConditionerLock)}
        />
        <ClientDetailsRequirementRow
          label="ავეჯით"
          value={req.furnished}
          {...rowLockProps("furnished", req.furnishedLock)}
        />
        <ClientDetailsRequirementRow
          label="პარკინგი"
          value={req.parking}
          {...rowLockProps("parking", req.parkingLock)}
        />
        <ClientDetailsRequirementRow
          label="მინიმალური ქირის ვადა"
          value={
            req.minRentalPeriod !== null
              ? `${req.minRentalPeriod} month${req.minRentalPeriod === 1 ? "" : "s"}`
              : null
          }
          {...rowLockProps("minRentalPeriod", req.minRentalPeriodLock)}
        />
        <div className="col-span-2 flex flex-col gap-0.5 sm:col-span-3 md:col-span-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">გამორიცხული პროექტები</span>
            {showLockControls ? (
              <ClientDetailsLockBadge
                lock={getLock("projectExclude", req.projectExcludeLock)}
                onChange={(nextLock) => onLockChange("projectExclude", nextLock)}
              />
            ) : null}
          </div>
          <span className="text-sm font-medium text-foreground">
            {(req.projectExclude ?? []).length > 0
              ? (req.projectExclude ?? [])
                  .map((projectName) => formatProjectDisplayName(projectName))
                  .join(", ")
              : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
