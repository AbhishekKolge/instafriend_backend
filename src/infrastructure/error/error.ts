import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export abstract class CustomError extends Error {
  abstract statusCode: StatusCodes;
  abstract status: ReasonPhrases;

  constructor(message: string) {
    super(message);
  }
}

export class InternalServerError extends CustomError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  status = ReasonPhrases.INTERNAL_SERVER_ERROR;

  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;
  status = ReasonPhrases.BAD_REQUEST;

  constructor(message: string) {
    super(message);
  }
}

export class ConflictError extends CustomError {
  statusCode = StatusCodes.CONFLICT;
  status = ReasonPhrases.CONFLICT;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;
  status = ReasonPhrases.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}

export class UnauthenticatedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  status = ReasonPhrases.UNAUTHORIZED;

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends CustomError {
  statusCode = StatusCodes.FORBIDDEN;
  status = ReasonPhrases.FORBIDDEN;

  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = StatusCodes.REQUEST_TOO_LONG;
  status = ReasonPhrases.REQUEST_TOO_LONG;

  constructor(message: string) {
    super(message);
  }
}

export class UnsupportedMediaError extends CustomError {
  statusCode = StatusCodes.UNSUPPORTED_MEDIA_TYPE;
  status = ReasonPhrases.UNSUPPORTED_MEDIA_TYPE;

  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  status = ReasonPhrases.SERVICE_UNAVAILABLE;

  constructor(message: string) {
    super(message);
  }
}
