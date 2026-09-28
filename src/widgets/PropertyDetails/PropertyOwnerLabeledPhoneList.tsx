import { Phone } from "lucide-react";
import type { OwnerPhoneDisplayItem } from "@/features/propertyOwners/formatOwnerContactDisplayLine";

type PropertyOwnerLabeledPhoneListProps = {
  items: OwnerPhoneDisplayItem[];
  linkClassName?: string;
};

function formatPhoneHref(raw: string): string {
  return raw.replace(/\s+/g, "");
}

export function PropertyOwnerLabeledPhoneList({
  items,
  linkClassName = "inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-2 hover:underline",
}: PropertyOwnerLabeledPhoneListProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="mt-1 space-y-1">
      {items.map((item) => (
        <li key={item.key}>
          <a
            href={`tel:${formatPhoneHref(item.phone)}`}
            className={linkClassName}
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            {item.displayLine}
          </a>
        </li>
      ))}
    </ul>
  );
}
