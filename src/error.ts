/** Thrown when the API returns a non-2xx response or the body cannot be parsed as expected. */
export class MailoflyError extends Error {
  readonly status: number;
  readonly error: string;
  readonly detailMessage: string | undefined;
  readonly body: unknown;

  constructor(status: number, error: string, detailMessage?: string, body?: unknown) {
    super(detailMessage ? `${error}: ${detailMessage}` : error);
    this.name = "MailoflyError";
    this.status = status;
    this.error = error;
    this.detailMessage = detailMessage;
    this.body = body;
  }
}
