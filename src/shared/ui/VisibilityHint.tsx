"use client";

import { createContext, useContext, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type FieldVisibility = "public" | "private";

type VisibilityHintProps = {
  visible: FieldVisibility;
  className?: string;
};

const VISIBILITY_TITLES: Record<FieldVisibility, string> = {
  public: "ხილული სხვა აგენტებისთვის",
  private: "მხოლოდ ჩემთვის — სხვა აგენტები ვერ ხედავენ",
};

/** Open eye = other agents see this field; crossed eye = only me (and admin). */
export function VisibilityHint({ visible, className }: VisibilityHintProps) {
  const isPublic = visible === "public";
  const Icon = isPublic ? Eye : EyeOff;
  const title = VISIBILITY_TITLES[visible];

  return (
    <span
      title={title}
      aria-label={title}
      role="img"
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center align-middle",
        isPublic ? "text-muted-foreground" : "text-amber-600",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
    </span>
  );
}

/**
 * Default visibility for every labelled field rendered inside. Property
 * create/edit forms wrap their content with `value="public"`; private fields
 * pass `visibility="private"` explicitly. Outside a provider (filters, client
 * forms) no icon is shown.
 */
const FieldVisibilityContext = createContext<FieldVisibility | null>(null);

export function FieldVisibilityProvider({
  value,
  children,
}: {
  value: FieldVisibility;
  children: ReactNode;
}) {
  return (
    <FieldVisibilityContext.Provider value={value}>
      {children}
    </FieldVisibilityContext.Provider>
  );
}

/** Icon for a field label: explicit prop wins, otherwise the provider default. */
export function FieldVisibilityIcon({
  visibility,
  className,
  onlyInForm = false,
}: {
  visibility?: FieldVisibility;
  className?: string;
  /** For shared widgets: show the explicit icon only inside a provider. */
  onlyInForm?: boolean;
}) {
  const fromContext = useContext(FieldVisibilityContext);
  if (onlyInForm && !fromContext) return null;
  const resolved = visibility ?? fromContext;
  if (!resolved) return null;
  return <VisibilityHint visible={resolved} className={cn("ml-1.5", className)} />;
}
