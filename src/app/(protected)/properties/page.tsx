import type { Metadata } from "next";
import { PropertiesView } from "@/widgets/Properties/PropertiesView";

export const metadata: Metadata = {
  title: "Properties",
};

export default function PropertiesPage() {
  return <PropertiesView />;
}

