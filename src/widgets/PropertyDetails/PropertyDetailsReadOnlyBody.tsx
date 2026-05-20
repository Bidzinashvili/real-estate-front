"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, ArrowLeft, Bell, Tags } from "lucide-react";
import { useMemo, useState } from "react";
import { useCurrentUser } from "@/shared/hooks";
import { usePropertyDetails } from "@/features/properties/usePropertyDetails";
import { PropertyDetailsCard } from "@/widgets/PropertyDetails/PropertyDetailsCard";
import { canViewPrivateListingFields } from "@/features/properties/listingVisibility";
import { updateProperty } from "@/features/properties/api";
import { PropertyListingRemindersModal } from "@/widgets/Properties/PropertyListingRemindersModal";
import { calculateMatchScore } from "@/features/properties/matchScore";

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
  const { property, isLoading, error, refetch } = usePropertyDetails(propertyId);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

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

  const matchScore = useMemo(() => {
    if (!property) {
      return { percentage: null, matched: 0, total: 0 };
    }

    if (property.apartment) {
      return calculateMatchScore(
        [
          { key: "elevator", label: "Elevator", value: property.apartment.elevator },
          {
            key: "centralHeating",
            label: "Central heating",
            value: property.apartment.centralHeating,
          },
          {
            key: "airConditioner",
            label: "Air conditioner",
            value: property.apartment.airConditioner,
          },
          { key: "furnished", label: "Furnished", value: property.apartment.furnished },
        ],
        property.apartment.needsVerification,
      );
    }

    if (property.privateHouse) {
      return calculateMatchScore(
        [
          {
            key: "centralHeating",
            label: "Central heating",
            value: property.privateHouse.centralHeating,
          },
          {
            key: "airConditioner",
            label: "Air conditioner",
            value: property.privateHouse.airConditioner,
          },
          {
            key: "furnished",
            label: "Furnished",
            value: property.privateHouse.furnished,
          },
        ],
        property.privateHouse.needsVerification,
      );
    }

    if (property.commercial) {
      return calculateMatchScore(
        [
          {
            key: "centralHeating",
            label: "Central heating",
            value: property.commercial.centralHeating,
          },
          {
            key: "airConditioner",
            label: "Air conditioner",
            value: property.commercial.airConditioner,
          },
        ],
        property.commercial.needsVerification,
      );
    }

    return { percentage: null, matched: 0, total: 0 };
  }, [property]);

  async function handleArchiveProperty() {
    if (!property || !canEdit) {
      return;
    }

    setIsArchiving(true);
    setArchiveError(null);
    try {
      await updateProperty(property.id, { status: "ARCHIVED" });
      await refetch();
    } catch (error) {
      setArchiveError(
        error instanceof Error ? error.message : "Could not archive property.",
      );
    } finally {
      setIsArchiving(false);
    }
  }

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
      {layout === "page" ? (
        <div className="sticky bottom-4 z-30 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRemindersOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
              Reminder
            </button>
            {canEdit ? (
              <Link
                href={`/properties/${property.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Tags className="h-3.5 w-3.5" aria-hidden="true" />
                Color tags
              </Link>
            ) : null}
            {canEdit ? (
              <button
                type="button"
                disabled={isArchiving || property.status === "ARCHIVED"}
                onClick={handleArchiveProperty}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                {isArchiving ? "Archiving..." : "Archive"}
              </button>
            ) : null}
            <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">
              Match: {matchScore.percentage ?? "N/A"}%
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-2 text-xs font-semibold text-purple-800">
              My data: pending
            </span>
          </div>
          {archiveError ? (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {archiveError}
            </p>
          ) : null}
        </div>
      ) : null}
      <PropertyListingRemindersModal
        open={isRemindersOpen}
        property={property}
        onClose={() => setIsRemindersOpen(false)}
        onScheduled={() => {
          void refetch();
        }}
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
