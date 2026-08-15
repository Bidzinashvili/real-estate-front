import type { Metadata } from "next";
import { AddClientForm } from "@/widgets/AddClient/AddClientForm";

export const metadata: Metadata = {
  title: "კლიენტის დამატება",
};

export default function NewClientPage() {
  return <AddClientForm />;
}
