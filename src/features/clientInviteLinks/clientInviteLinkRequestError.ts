import type { FieldErrors } from "@/shared/lib/apiError";

export class ClientInviteLinkRequestError extends Error {
  readonly statusCode: number;
  readonly fieldErrors?: FieldErrors;

  constructor(
    message: string,
    statusCode: number,
    fieldErrors?: FieldErrors,
  ) {
    super(message);
    this.name = "ClientInviteLinkRequestError";
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }
}
