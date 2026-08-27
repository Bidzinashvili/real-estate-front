"use client";

import { useState } from "react";
import { formatPublicPropertyTitle } from "@/features/propertyShare/formatPublicPropertyTitle";
import { isAgentListingInactive } from "@/features/propertyShare/clientPropertyShare";
import type { Property } from "@/features/properties/types";
import { SharePropertyWhatsAppModal } from "@/widgets/PropertyShare/SharePropertyWhatsAppModal";
import { WhatsAppIcon } from "@/widgets/PropertyShare/WhatsAppIcon";

type PropertyDetailWhatsAppButtonProps = {
  property: Property;
};

export function PropertyDetailWhatsAppButton({
  property,
}: PropertyDetailWhatsAppButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const title = formatPublicPropertyTitle(property);
  const isInactive = isAgentListingInactive(property);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition hover:bg-[#1ebe57] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="WhatsApp-ში გაზიარება"
        title="WhatsApp-ში გაზიარება"
      >
        <WhatsAppIcon className="h-4 w-4" />
      </button>
      <SharePropertyWhatsAppModal
        open={isModalOpen}
        propertyId={property.id}
        title={title}
        isInactive={isInactive}
        mode="manual"
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
