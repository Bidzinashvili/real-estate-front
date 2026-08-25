import type { Metadata } from "next";
import { CreatePropertyOwnerView } from "@/widgets/PropertyOwners/CreatePropertyOwnerView";

export const metadata: Metadata = {
  title: "მეპატრონის დამატება",
};

export default function NewPropertyOwnerPage() {
  return <CreatePropertyOwnerView />;
}
