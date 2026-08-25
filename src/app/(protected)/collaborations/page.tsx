import type { Metadata } from "next";
import { CollaborationsPageView } from "@/widgets/Collaboration/CollaborationsPageView";

export const metadata: Metadata = {
  title: "თანამშრომლობა",
};

export default function CollaborationsPage() {
  return <CollaborationsPageView />;
}
