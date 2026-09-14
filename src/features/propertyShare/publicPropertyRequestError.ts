export class PublicPropertyRequestError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "PublicPropertyRequestError";
    this.statusCode = statusCode;
  }
}
