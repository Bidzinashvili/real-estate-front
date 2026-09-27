"use client";

import { CLIENT_FORM_REQUIRED_FIELDS_SUMMARY } from "@/widgets/ClientForm/useClientFormValidationNotice";

type ClientFormRequiredFieldsSummaryProps = {
  visible: boolean;
};

export function ClientFormRequiredFieldsSummary({
  visible,
}: ClientFormRequiredFieldsSummaryProps) {
  if (!visible) {
    return null;
  }

  return (
    <p className="text-sm text-destructive" role="alert">
      {CLIENT_FORM_REQUIRED_FIELDS_SUMMARY}
    </p>
  );
}
