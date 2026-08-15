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
          { key: "elevator", label: "ლიფტი", value: property.apartment.elevator },
          {
            key: "centralHeating",
            label: "ცენტრალური გათბობა",
            value: property.apartment.centralHeating,
          },
          {
            key: "airConditioner",
            label: "კონდიციონერი",
            value: property.apartment.airConditioner,
          },
          { key: "furnished", label: "ავეჯით", value: property.apartment.furnished },
        ],
        property.apartment.needsVerification,
      );
    }

    if (property.privateHouse) {
      return calculateMatchScore(
        [
          {
            key: "centralHeating",
            label: "ცენტრალური გათბობა",
            value: property.privateHouse.centralHeating,
          },
          {
            key: "airConditioner",
            label: "კონდიციონერი",
            value: property.privateHouse.airConditioner,
          },
          {
            key: "furnished",
            label: "ავეჯით",
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
            label: "ცენტრალური გათბობა",
            value: property.commercial.centralHeating,
          },
          {
            key: "airConditioner",
            label: "კონდიციონერი",
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
        error instanceof Error ? error.message : "განცხადების დაარქივება ვერ მოხერხდა.",
      );
    } finally {
      setIsArchiving(false);
    }
  }

  const loadingBlock = (
    <div
      className={
        layout === "page"
          ? "flex min-h-screen items-center justify-center bg-muted text-foreground"
          : "flex min-h-[12rem] items-center justify-center text-muted-foreground"
      }
    >
      <p className="text-muted-foreground">განცხადების დეტალები იტვირთება…</p>
    </div>
  );

  if (isLoading || (!property && !error)) {
    return loadingBlock;
  }

  if (error || !property) {
    const message = error ?? "განცხადება ვერ მოიძებნა.";
    if (layout === "embedded") {
      return <p className="text-sm text-muted-foreground">{message}</p>;
    }
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
        <div className="flex w-full max-w-xl flex-col gap-4 px-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="self-start text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>უკან</span>
            </span>
          </button>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </main>
    );
  }

  if (!user) {
    const sessionBlock = (
      <div
        className={
          layout === "page"
            ? "flex min-h-screen items-center justify-center bg-muted text-foreground"
            : "flex min-h-[12rem] items-center justify-center text-muted-foreground"
        }
      >
        <p className="text-muted-foreground">სესია იტვირთება…</p>
      </div>
    );
    return sessionBlock;
  }

  const cardSection = (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {property.propertyType === "APARTMENT" ? (
          <Link
            href={`/properties/${property.id}/matches`}
            className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted"
          >
            შესაბამისი კლიენტების ძიება
          </Link>
        ) : null}
        {canEdit ? (
          <Link
            href={`/properties/${property.id}/edit`}
            onClick={() => {
              onBeforeEditNavigation?.();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90"
          >
            განცხადების რედაქტირება
          </Link>
        ) : null}
      </div>

      <PropertyDetailsCard
        property={property}
        presentation="view"
        canViewPrivateFields={canViewPrivateFields}
      />
      {layout === "page" ? (
        <div className="sticky bottom-4 z-30 rounded-2xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRemindersOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
            >
              <Bell className="h-3.5 w-3.5" aria-hidden="true" />
              შეხსენება
            </button>
            {canEdit ? (
              <Link
                href={`/properties/${property.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
              >
                <Tags className="h-3.5 w-3.5" aria-hidden="true" />
                ფერადი ლეიბლები
              </Link>
            ) : null}
            {canEdit ? (
              <button
                type="button"
                disabled={isArchiving || property.status === "ARCHIVED"}
                onClick={handleArchiveProperty}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                {isArchiving ? "არქივდება..." : "დაარქივება"}
              </button>
            ) : null}
            <span className="rounded-full bg-success-muted px-3 py-2 text-xs font-semibold text-success-foreground">
              ინფორმაციის შევსება: {matchScore.percentage ?? "—"}%
            </span>
            <span className="rounded-full bg-purple-100 px-3 py-2 text-xs font-semibold text-purple-800">
              ჩემი მონაცემები: მოლოდინში
            </span>
          </div>
          {archiveError ? (
            <p className="mt-2 text-xs text-destructive" role="alert">
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
      <main className="flex min-h-screen items-center justify-center bg-muted text-foreground">
        <div className="flex w-full max-w-2xl flex-col gap-4 px-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="self-start text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>უკან</span>
            </span>
          </button>
          {cardSection}
        </div>
      </main>
    );
  }

  return cardSection;
}
