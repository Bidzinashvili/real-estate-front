export const PROPERTY_VERIFICATION_REQUEST_ERROR = {
  ownProperty:
    "საკუთარ განცხადებაზე გადამოწმების მოთხოვნას ვერ გააგზავნით.",
  notFound:
    "განცხადება ვერ მოიძებნა ან მასზე წვდომა არ გაქვთ.",
  duplicate:
    "ამ განცხადებაზე გადამოწმება უკვე მოთხოვნილი გაქვთ.",
  generic: "გადამოწმების მოთხოვნის გაგზავნა ვერ მოხერხდა.",
} as const;

export const PROPERTY_VERIFICATION_REQUEST_ERROR_BY_STATUS: Record<number, string> =
  {
    400: PROPERTY_VERIFICATION_REQUEST_ERROR.ownProperty,
    404: PROPERTY_VERIFICATION_REQUEST_ERROR.notFound,
    409: PROPERTY_VERIFICATION_REQUEST_ERROR.duplicate,
  };
