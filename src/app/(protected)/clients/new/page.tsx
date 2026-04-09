import type { Metadata } from "next";
import { AddClientForm } from "@/widgets/AddClient/AddClientForm";

export const metadata: Metadata = {
  title: "Add client",
};

export default function NewClientPage() {
  return <AddClientForm />;
}
