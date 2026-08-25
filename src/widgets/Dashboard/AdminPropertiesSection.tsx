import Link from "next/link";
import { formatHotelScopeLabel } from "@/features/properties/addPropertyFormOptions";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import type { Property } from "@/features/properties/types";
import { LifecycleStatusBadge } from "@/widgets/Lifecycle/LifecycleStatusBadge";

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
    return <p className="text-sm text-muted-foreground">განცხადებები იტვირთება…</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">ჩემი განცხადებები</h2>
        <Link
          href="/properties/new"
          className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-white transition hover:bg-primary/90"
        >
          განცხადების დამატება
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          განცხადებები ჯერ არ გაქვთ.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-card text-sm shadow-sm ring-1 ring-border">
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
                    {property.propertyType}
                    {property.propertyType === "HOTEL" && property.hotelScope
                      ? ` (${formatHotelScopeLabel(property.hotelScope)})`
                      : ""}{" "}
                    • {formatDealTypeLabel(property.dealType)}
                  </td>
                    <td className="hidden px-4 py-3 text-foreground sm:table-cell">
                      <LifecycleStatusBadge
                        kind="property"
                        status={property.status}
                        outcomeSource={property.outcomeSource}
                        verificationReason={property.verificationReason}
                        size="sm"
                      />
                    </td>
                  <td className="hidden px-4 py-3 text-foreground md:table-cell">
                    {property.city} / {property.district}
                  </td>
                  <td className="hidden px-4 py-3 text-foreground md:table-cell">
                    {property.address}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {property.pricePublic.toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-3 text-foreground lg:table-cell">
                    {property.ownerName}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/properties/${property.id}`}
                      className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-white transition hover:bg-primary/90"
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

