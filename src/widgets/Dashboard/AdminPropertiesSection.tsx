import Link from "next/link";
import { formatDealTypeLabel } from "@/features/properties/dealType";
import type { Property } from "@/features/properties/types";

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
    return <p className="text-sm text-slate-600">Loading properties…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">Your properties</h2>
        <Link
          href="/properties/new"
          className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          Add property
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="text-sm text-slate-600">
          You don&apos;t have any properties yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white text-sm shadow-sm ring-1 ring-slate-200">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-50 text-left text-xs font-medium text-slate-500">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="hidden px-4 py-3 md:table-cell">Location</th>
                <th className="hidden px-4 py-3 md:table-cell">Address</th>
                <th className="px-4 py-3">Price</th>
                <th className="hidden px-4 py-3 lg:table-cell">Owner</th>
                <th className="px-4 py-3 text-right">Created</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-slate-900">
                    {property.propertyType} • {formatDealTypeLabel(property.dealType)}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-700 md:table-cell">
                    {property.city} / {property.district}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-700 md:table-cell">
                    {property.address}
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    {property.pricePublic.toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-700 lg:table-cell">
                    {property.ownerName}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-700">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/properties/${property.id}`}
                      className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-slate-800"
                    >
                      View
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

