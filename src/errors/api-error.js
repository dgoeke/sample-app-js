import Errors from './errors';

class BaseError extends Error {
  constructor(code, message, stack) {
    super(code);
    this.name = this.constructor.name;
    this.code = code;
    this.message = message;
    this.stack = stack;
  }
}

export default class APIError extends BaseError {
  constructor(code = 'ERROR', properties, stack) {
    const { message, publicApi = true, httpStatus } = Errors[code] ? Errors[code] : Errors.ERROR;
    super(code, message, stack);
    this.httpStatus = httpStatus;
    this.isPublic = publicApi;
    this.properties = properties;
  }

  getErrorDetails() {
    const code = this.isPublic ? this.code : 'ERROR';
    const message = this.isPublic ? this.message : Errors.ERROR.message;
    return { code, message, ...this.properties };
  }
}
