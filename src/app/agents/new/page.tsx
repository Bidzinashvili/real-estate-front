import type { Metadata } from "next";
import { AddAgentForm } from "@/widgets/AddAgent/AddAgentForm";

export const metadata: Metadata = {
  title: "აგენტის დამატება",
};

function AddAgentPage() {
  return <AddAgentForm />;
}

export default AddAgentPage;

