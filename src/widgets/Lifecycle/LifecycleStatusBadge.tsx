"use client";

import type { ReactNode } from "react";
import { Bell, CalendarClock, Check, CircleHelp, X } from "lucide-react";
import type { ClientStatus } from "@/features/clients/clientEnums";
import { CLIENT_STATUS_LABELS } from "@/features/clients/clientEnums";
import type {
  OutcomeSource,
  VerificationReason,
} from "@/features/lifecycle/lifecycleEnums";
import {
  formatPropertyStatusLabel,
  type PropertyStatus,
} from "@/features/properties/propertyStatus";

type LifecycleStatusBadgeProps = {
  kind: "property" | "client";
  status: PropertyStatus | ClientStatus;
  outcomeSource?: OutcomeSource | null;
  verificationReason?: VerificationReason | null;
  isArchived?: boolean;
  size?: "sm" | "md";
};

function StatusDot({ className }: { className: string }) {
  return (
    <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${className}`} aria-hidden />
  );
}

function propertyVisual(
  status: PropertyStatus,
  outcomeSource: OutcomeSource | null | undefined,
  verificationReason: VerificationReason | null | undefined,
  isArchived: boolean,
): { icon: ReactNode; className: string } {
  if (isArchived && (status === "FOR_SALE" || status === "FOR_RENT")) {
    return {
      icon: <StatusDot className="bg-muted-foreground" />,
      className: "bg-muted text-muted-foreground",
    };
  }
  if (status === "FOR_SALE" || status === "FOR_RENT") {
    return {
      icon: <StatusDot className="bg-success" />,
      className: "bg-success-muted text-success-foreground",
    };
  }
  if (status === "SOLD" || status === "RENTED") {
    if (outcomeSource === "BY_OTHER") {
      return {
        icon: <X className="h-3.5 w-3.5 text-destructive" aria-hidden />,
        className: "bg-destructive/10 text-destructive",
      };
    }
    if (outcomeSource === "BY_ME") {
      return {
        icon: <Check className="h-3.5 w-3.5 text-success" aria-hidden />,
        className: "bg-success-muted text-success-foreground",
      };
    }
    return {
      icon: <StatusDot className="bg-muted-foreground" />,
      className: "bg-muted text-muted-foreground",
    };
  }
  if (status === "NEEDS_VERIFICATION") {
    if (verificationReason === "RENTAL_EXPIRY_RECHECK") {
      return {
        icon: <CalendarClock className="h-3.5 w-3.5 text-amber-700" aria-hidden />,
        className: "bg-amber-100 text-amber-800",
      };
    }
    if (verificationReason === "MANUAL_REMINDER_DUE") {
      return {
        icon: <Bell className="h-3.5 w-3.5 text-orange-700" aria-hidden />,
        className: "bg-orange-100 text-orange-800",
      };
    }
    return {
      icon: <CircleHelp className="h-3.5 w-3.5 text-warning-foreground" aria-hidden />,
      className: "bg-warning-muted text-warning-foreground",
    };
  }
  if (status === "AVAILABLE_SOON") {
    return {
      icon: <StatusDot className="bg-primary" />,
      className: "bg-primary/15 text-primary",
    };
  }
  return {
    icon: <StatusDot className="bg-muted-foreground" />,
    className: "bg-muted text-muted-foreground",
  };
}

function clientVisual(
  status: ClientStatus,
  outcomeSource: OutcomeSource | null | undefined,
  verificationReason: VerificationReason | null | undefined,
): { icon: ReactNode; className: string } {
  if (status === "ACTIVE") {
    return {
      icon: <StatusDot className="bg-success" />,
      className: "bg-success-muted text-success-foreground",
    };
  }
  if (status === "INACTIVE") {
    if (outcomeSource === "BY_OTHER") {
      return {
        icon: <X className="h-3.5 w-3.5 text-destructive" aria-hidden />,
        className: "bg-destructive/10 text-destructive",
      };
    }
    if (outcomeSource === "BY_ME") {
      return {
        icon: <Check className="h-3.5 w-3.5 text-success" aria-hidden />,
        className: "bg-success-muted text-success-foreground",
      };
    }
    return {
      icon: <StatusDot className="bg-muted-foreground" />,
      className: "bg-muted text-muted-foreground",
    };
  }
  if (status === "NEEDS_VERIFICATION") {
    if (verificationReason === "RENTAL_EXPIRY_RECHECK") {
      return {
        icon: <CalendarClock className="h-3.5 w-3.5 text-amber-700" aria-hidden />,
        className: "bg-amber-100 text-amber-800",
      };
    }
    if (verificationReason === "MANUAL_REMINDER_DUE") {
      return {
        icon: <Bell className="h-3.5 w-3.5 text-orange-700" aria-hidden />,
        className: "bg-orange-100 text-orange-800",
      };
    }
    return {
      icon: <CircleHelp className="h-3.5 w-3.5 text-warning-foreground" aria-hidden />,
      className: "bg-warning-muted text-warning-foreground",
    };
  }
  if (status === "IN_PROGRESS") {
    return {
      icon: <StatusDot className="bg-primary" />,
      className: "bg-primary/15 text-primary",
    };
  }
  return {
    icon: <StatusDot className="bg-muted-foreground" />,
    className: "bg-muted text-muted-foreground",
  };
}

export function LifecycleStatusBadge({
  kind,
  status,
  outcomeSource = null,
  verificationReason = null,
  isArchived = false,
  size = "md",
}: LifecycleStatusBadgeProps) {
  const visual =
    kind === "property"
      ? propertyVisual(
          status as PropertyStatus,
          outcomeSource,
          verificationReason,
          isArchived,
        )
      : clientVisual(status as ClientStatus, outcomeSource, verificationReason);
  const label =
    kind === "property"
      ? formatPropertyStatusLabel(status as PropertyStatus)
      : CLIENT_STATUS_LABELS[status as ClientStatus];
  const padding = size === "sm" ? "px-2 py-0.5" : "px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${padding} text-xs font-semibold ${visual.className}`}
    >
      {visual.icon}
      {label}
    </span>
  );
}
