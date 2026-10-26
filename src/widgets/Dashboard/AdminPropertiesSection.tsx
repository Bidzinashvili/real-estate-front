import Link from "next/link";
import { LayoutGrid, Plus } from "lucide-react";
import { formatHotelScopeLabel, formatPropertyTypeLabel } from "@/features/properties/addPropertyFormOptions";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import type { Property } from "@/features/properties/types";
import { isPropertyArchived } from "@/features/lifecycle/isPropertyArchived";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";
import { HideFromOthersBadge } from "@/widgets/HideFromOthers/HideFromOthersBadge";
import { formatListingAmount } from "@/widgets/PropertyDetails/propertyViewFormatters";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import { EmptyState, ErrorState, LoadingState } from "@/shared/ui/PageState";
import { SectionHeader } from "@/shared/ui/SectionHeader";
import { surfaceCardClassName } from "@/shared/ui/surfaceStyles";

type AdminPropertiesSectionProps = {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
};

export function AdminPropertiesSection({
  properties,
  isLoading,
  error,
}: AdminPropertiesSectionProps) {
  if (isLoading) {
    return (
      <section>
        <SectionHeader
          title="ჩემი განცხადებები"
          icon={<LayoutGrid className="h-4 w-4" aria-hidden />}
        />
        <LoadingState title="განცხადებები იტვირთება…" />
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <SectionHeader
          title="ჩემი განცხადებები"
          icon={<LayoutGrid className="h-4 w-4" aria-hidden />}
        />
        <ErrorState title="განცხადებების ჩატვირთვა ვერ მოხერხდა" description={error} />
      </section>
    );
  }

  return (
    <section>
      <SectionHeader
        title="ჩემი განცხადებები"
        icon={<LayoutGrid className="h-4 w-4" aria-hidden />}
        action={
          <Link
            href="/properties/new"
            className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            განცხადების დამატება
          </Link>
        }
      />

      {properties.length === 0 ? (
        <EmptyState title="განცხადებები ჯერ არ გაქვთ." icon={LayoutGrid} />
      ) : (
        <div className={`overflow-x-auto overflow-hidden text-sm ${surfaceCardClassName}`}>
          <table className="min-w-full border-collapse">
            <thead className="bg-muted text-left text-xs font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-3">ტიპი</th>
                <th className="hidden px-4 py-3 sm:table-cell">სტატუსი</th>
                <th className="hidden px-4 py-3 md:table-cell">მდებარეობა</th>
                <th className="hidden px-4 py-3 md:table-cell">მისამართი</th>
                <th className="px-4 py-3">ფასი</th>
                <th className="hidden px-4 py-3 lg:table-cell">მესაკუთრე</th>
                <th className="px-4 py-3 text-right">შექმნილია</th>
                <th className="px-4 py-3 text-right">დეტალები</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-t border-border">
                  <td className="px-4 py-3 text-foreground">
                    {formatPropertyTypeLabel(property.propertyType) ?? property.propertyType}
                    {property.propertyType === "HOTEL" && property.hotelScope
                      ? ` (${formatHotelScopeLabel(property.hotelScope)})`
                      : ""}{" "}
                    • {formatDealTypeLabel(property.dealType)}
                  </td>
                  <td className="hidden px-4 py-3 text-foreground sm:table-cell">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <LifecycleStatusBadge
                        kind="property"
                        status={property.status}
                        outcomeSource={property.outcomeSource}
                        verificationReason={property.verificationReason}
                        isArchived={isPropertyArchived(property)}
                        size="sm"
                      />
                      <HideFromOthersBadge isHidden={property.hideFromOthers === true} />
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-foreground md:table-cell">
                    {property.city} / {property.district}
                  </td>
                  <td className="hidden px-4 py-3 text-foreground md:table-cell">
                    {property.address}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {formatListingAmount(property.pricePublic, property.currency) ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-foreground lg:table-cell">
                    {property.propertyOwner?.name ?? property.ownerName ?? ""}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/properties/${property.id}`}
                      className={cn(buttonVariants({ variant: "primary", size: "sm" }))}
                    >
                      ნახვა
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
