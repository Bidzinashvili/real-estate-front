import { PropertyDetailsReadOnlyBody } from "@/widgets/PropertyDetails/PropertyDetailsReadOnlyBody";

type PropertyDetailsReadOnlyPageProps = {
  propertyId: string;
};

export function PropertyDetailsReadOnlyPage({
  propertyId,
}: PropertyDetailsReadOnlyPageProps) {
  return <PropertyDetailsReadOnlyBody propertyId={propertyId} layout="page" />;
}
