import type { Metadata } from "next";
import { AddPropertyForm } from "@/widgets/AddProperty/AddPropertyForm";

export const metadata: Metadata = {
  title: "განცხადების დამატება",
};

function AddPropertyPage() {
  return <AddPropertyForm />;
}

export default AddPropertyPage;
