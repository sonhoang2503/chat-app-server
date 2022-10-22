import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponses {
  message: string;
  status: string;
  statusCode: number;
  serializeError(): IError;
}

export interface IError {
  message: string;
  status: string;
  statusCode: number;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeError(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
    };
  }
}

export class JoinRequestValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'Bad Request';

  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'Bad Request';

  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = 'Not Authorized';
  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
  status = 'Error';
  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}
