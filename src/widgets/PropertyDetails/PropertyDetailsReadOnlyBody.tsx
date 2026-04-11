"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { useCurrentUser } from "@/shared/hooks";
import { usePropertyDetails } from "@/features/properties/usePropertyDetails";
import { PropertyDetailsCard } from "@/widgets/PropertyDetails/PropertyDetailsCard";
import { canViewPrivateListingFields } from "@/features/properties/listingVisibility";

type PropertyDetailsReadOnlyBodyProps = {
  propertyId: string;
  layout: "page" | "embedded";
  onBeforeEditNavigation?: () => void;
};

export function PropertyDetailsReadOnlyBody({
  propertyId,
  layout,
  onBeforeEditNavigation,
}: PropertyDetailsReadOnlyBodyProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { property, isLoading, error } = usePropertyDetails(propertyId);

  const canEdit = useMemo(() => {
    if (!user || !property) return false;
    if (user.role === "ADMIN") return true;
    return user.role === "AGENT" && property.userId === user.id;
  }, [property, user]);

  const canViewPrivateFields = useMemo(() => {
    if (!user || !property) return false;
    return canViewPrivateListingFields(user, property);
  }, [property, user]);

  const handleGoBack = () => {
    router.push("/properties");
  };

  const loadingBlock = (
    <div
      className={
        layout === "page"
          ? "flex min-h-screen items-center justify-center bg-slate-50 text-slate-900"
          : "flex min-h-[12rem] items-center justify-center text-slate-500"
      }
    >
      <p className="text-slate-500">Loading property details…</p>
    </div>
  );

  if (isLoading || (!property && !error)) {
    return loadingBlock;
  }

  if (error || !property) {
    const message = error ?? "We could not find this property.";
    if (layout === "embedded") {
      return <p className="text-sm text-slate-600">{message}</p>;
    }
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex w-full max-w-xl flex-col gap-4 px-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="self-start text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Go back</span>
            </span>
          </button>
          <p className="text-slate-500">{message}</p>
        </div>
      </main>
    );
  }

  if (!user) {
    const sessionBlock = (
      <div
        className={
          layout === "page"
            ? "flex min-h-screen items-center justify-center bg-slate-50 text-slate-900"
            : "flex min-h-[12rem] items-center justify-center text-slate-500"
        }
      >
        <p className="text-slate-500">Loading your session…</p>
      </div>
    );
    return sessionBlock;
  }

  const cardSection = (
    <div className="flex w-full flex-col gap-4">
      {canEdit ? (
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/properties/${property.id}/edit`}
            onClick={() => {
              onBeforeEditNavigation?.();
            }}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Edit listing
          </Link>
        </div>
      ) : null}

      <PropertyDetailsCard
        property={property}
        presentation="view"
        canViewPrivateFields={canViewPrivateFields}
      />
    </div>
  );

  if (layout === "page") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex w-full max-w-2xl flex-col gap-4 px-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="self-start text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Go back</span>
            </span>
          </button>
          {cardSection}
        </div>
      </main>
    );
  }

  return cardSection;
}
