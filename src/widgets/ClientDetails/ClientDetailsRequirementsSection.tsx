import {
  RENOVATION_LABELS,
  BUILDING_CONDITION_LABELS,
  KITCHEN_TYPE_LABELS,
} from "@/features/clients/clientEnums";
import type { ClientRequirements } from "@/features/clients/types";
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
        <ClientDetailsRequirementRow label="Min rooms" value={req.minRooms} />
        <ClientDetailsRequirementRow label="Min bedrooms" value={req.minBedrooms} />
        <ClientDetailsRequirementRow label="Min bathrooms" value={req.minBathrooms} />
        <ClientDetailsRequirementRow label="Min floor" value={req.minFloor} />
        <ClientDetailsRequirementRow label="Max floor" value={req.maxFloor} />
        <ClientDetailsRequirementRow
          label="Exclude last floor"
          value={req.excludeLastFloor ? true : null}
        />
        <ClientDetailsRequirementRow
          label="Min area"
          value={req.minArea !== null ? `${req.minArea} m²` : null}
        />
        <ClientDetailsRequirementRow
          label="Renovation"
          value={req.renovation ? RENOVATION_LABELS[req.renovation] : null}
        />
        <ClientDetailsRequirementRow
          label="Building condition"
          value={
            req.buildingCondition
              ? BUILDING_CONDITION_LABELS[req.buildingCondition]
              : null
          }
        />
        <ClientDetailsRequirementRow
          label="Kitchen type"
          value={req.kitchenType ? KITCHEN_TYPE_LABELS[req.kitchenType] : null}
        />
        <ClientDetailsRequirementRow label="Has balcony" value={req.hasBalcony} />
        <ClientDetailsRequirementRow
          label="Balcony area"
          value={
            req.balconyAreaMin !== null || req.balconyAreaMax !== null
              ? [
                  req.balconyAreaMin !== null ? `${req.balconyAreaMin}` : null,
                  req.balconyAreaMax !== null ? `${req.balconyAreaMax}` : null,
                ]
                  .filter(Boolean)
                  .join(" – ") + " m²"
              : null
          }
        />
        <ClientDetailsRequirementRow label="Good view" value={req.goodView} />
        <ClientDetailsRequirementRow label="Elevator" value={req.elevator} />
        <ClientDetailsRequirementRow label="Central heating" value={req.centralHeating} />
        <ClientDetailsRequirementRow label="Air conditioner" value={req.airConditioner} />
        <ClientDetailsRequirementRow label="Furnished" value={req.furnished} />
        <ClientDetailsRequirementRow label="Parking" value={req.parking} />
        <ClientDetailsRequirementRow
          label="Min rental period"
          value={
            req.minRentalPeriod !== null
              ? `${req.minRentalPeriod} month${req.minRentalPeriod === 1 ? "" : "s"}`
              : null
          }
        />
        {(req.projectExclude ?? []).length > 0 && (
          <div className="col-span-2 flex flex-col gap-0.5 sm:col-span-3 md:col-span-4">
            <span className="text-xs text-slate-500">Exclude projects</span>
            <span className="text-sm font-medium text-slate-800">
              {(req.projectExclude ?? []).join(", ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
