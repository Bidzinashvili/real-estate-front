import type { Metadata } from "next";
import { AddAgentForm } from "@/widgets/AddAgent/AddAgentForm";

export const metadata: Metadata = {
  title: "Add agent",
};

function AddAgentPage() {
  return <AddAgentForm />;
}

export default AddAgentPage;

