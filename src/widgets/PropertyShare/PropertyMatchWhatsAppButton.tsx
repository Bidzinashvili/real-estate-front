"use client";

import { useState } from "react";
import {
  CLIENT_PHONE_MISSING_MESSAGE,
} from "@/features/propertyShare/clientPropertyShare";
import { formatPublicPropertyTitle } from "@/features/propertyShare/formatPublicPropertyTitle";
import { openPropertyWhatsAppShare } from "@/features/propertyShare/propertyWhatsAppShare";
import { SharePropertyWhatsAppModal } from "@/widgets/PropertyShare/SharePropertyWhatsAppModal";
import { WhatsAppIcon } from "@/widgets/PropertyShare/WhatsAppIcon";

type PropertyMatchWhatsAppButtonProps = {
  propertyId: string;
  dealType: string;
  propertyType: string;
  district?: string | null;
  city?: string | null;
  hotelScope?: string | null;
  listingStatus: string;
  phones: string[];
};

export function PropertyMatchWhatsAppButton({
  propertyId,
  dealType,
  propertyType,
  district,
  city,
  hotelScope,
  listingStatus,
  phones,
}: PropertyMatchWhatsAppButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const title = formatPublicPropertyTitle({
    dealType,
    propertyType,
    district,
    city,
    hotelScope,
  });
  const isInactive =
    listingStatus === "SOLD" ||
    listingStatus === "RENTED" ||
    listingStatus === "ARCHIVED";

  function handleClick() {
    setErrorMessage(null);
    if (phones.length === 0) {
      setErrorMessage(CLIENT_PHONE_MISSING_MESSAGE);
      return;
    }
    if (phones.length === 1 && !isInactive) {
      const onlyPhone = phones[0];
      if (!onlyPhone) {
        setErrorMessage(CLIENT_PHONE_MISSING_MESSAGE);
        return;
      }
      openPropertyWhatsAppShare({
        rawPhone: onlyPhone,
        propertyId,
        title,
      });
      return;
    }
    setIsModalOpen(true);
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition hover:bg-[#1ebe57] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="WhatsApp-ში გაგზავნა"
        title="WhatsApp-ში გაგზავნა"
      >
        <WhatsAppIcon className="h-4 w-4" />
      </button>
      {errorMessage ? (
        <p className="max-w-[14rem] text-xs text-destructive" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <SharePropertyWhatsAppModal
        open={isModalOpen}
        propertyId={propertyId}
        title={title}
        isInactive={isInactive}
        mode="select"
        phoneOptions={phones}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
