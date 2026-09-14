import type { Metadata } from "next";
import { PropertyOwnersView } from "@/widgets/PropertyOwners/PropertyOwnersView";

export const metadata: Metadata = {
  title: "მეპატრონეები",
};

export default function PropertyOwnersPage() {
  return <PropertyOwnersView />;
}
