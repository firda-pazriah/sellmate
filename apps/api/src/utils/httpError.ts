export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, "BAD_REQUEST", message, details);
  }

  static unauthorized(message = "Unauthorized") {
    return new HttpError(401, "UNAUTHORIZED", message);
  }

  static forbidden(message = "Forbidden") {
    return new HttpError(403, "FORBIDDEN", message);
  }

  static conflict(message: string) {
    return new HttpError(409, "CONFLICT", message);
  }

  static tooManyRequests(message = "Too many requests") {
    return new HttpError(429, "TOO_MANY_REQUESTS", message);
  }

  static locked(message: string) {
    return new HttpError(423, "ACCOUNT_LOCKED", message);
  }

  static internal(message = "Internal server error") {
    return new HttpError(500, "INTERNAL_ERROR", message);
  }
}
