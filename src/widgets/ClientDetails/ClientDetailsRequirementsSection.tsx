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
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-base font-semibold text-slate-800">Requirements</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        <ClientDetailsRequirementRow
          label="Min rooms"
          value={req.minRooms}
          lock={req.minRoomsLock}
        />
        <ClientDetailsRequirementRow
          label="Min bedrooms"
          value={req.minBedrooms}
          lock={req.minBedroomsLock}
        />
        <ClientDetailsRequirementRow
          label="Min bathrooms"
          value={req.minBathrooms}
          lock={req.minBathroomsLock}
        />
        <ClientDetailsRequirementRow
          label="Min floor"
          value={req.minFloor}
          lock={req.minFloorLock}
        />
        <ClientDetailsRequirementRow
          label="Max floor"
          value={req.maxFloor}
          lock={req.maxFloorLock}
        />
        <ClientDetailsRequirementRow
          label="Exclude last floor"
          value={req.excludeLastFloor}
          lock={req.excludeLastFloorLock}
        />
        <ClientDetailsRequirementRow
          label="Min area"
          value={req.minArea !== null ? `${req.minArea} m²` : null}
          lock={req.minAreaLock}
        />
        <ClientDetailsRequirementRow
          label="Renovation"
          value={req.renovation ? RENOVATION_LABELS[req.renovation] : null}
          lock={req.renovationLock}
        />
        <ClientDetailsRequirementRow
          label="Building condition"
          value={
            req.buildingCondition ? BUILDING_CONDITION_LABELS[req.buildingCondition] : null
          }
          lock={req.buildingConditionLock}
        />
        <ClientDetailsRequirementRow
          label="Kitchen type"
          value={req.kitchenType ? KITCHEN_TYPE_LABELS[req.kitchenType] : null}
          lock={req.kitchenTypeLock}
        />
        <ClientDetailsRequirementRow
          label="Has balcony"
          value={req.hasBalcony}
          lock={req.hasBalconyLock}
        />
        <ClientDetailsRequirementRow
          label="Balcony min (m²)"
          value={req.balconyAreaMin}
          lock={req.balconyAreaMinLock}
        />
        <ClientDetailsRequirementRow
          label="Balcony max (m²)"
          value={req.balconyAreaMax}
          lock={req.balconyAreaMaxLock}
        />
        <ClientDetailsRequirementRow
          label="Good view"
          value={req.goodView}
          lock={req.goodViewLock}
        />
        <ClientDetailsRequirementRow
          label="Elevator"
          value={req.elevator}
          lock={req.elevatorLock}
        />
        <ClientDetailsRequirementRow
          label="Central heating"
          value={req.centralHeating}
          lock={req.centralHeatingLock}
        />
        <ClientDetailsRequirementRow
          label="Air conditioner"
          value={req.airConditioner}
          lock={req.airConditionerLock}
        />
        <ClientDetailsRequirementRow
          label="Furnished"
          value={req.furnished}
          lock={req.furnishedLock}
        />
        <ClientDetailsRequirementRow
          label="Parking"
          value={req.parking}
          lock={req.parkingLock}
        />
        <ClientDetailsRequirementRow
          label="Min rental period"
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
              <span className="text-xs text-slate-500">Exclude projects</span>
              {req.projectExcludeLock !== undefined ? (
                <ClientDetailsLockBadge lock={req.projectExcludeLock} />
              ) : null}
            </div>
            <span className="text-sm font-medium text-slate-800">
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
