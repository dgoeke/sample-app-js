import APIError from './api-error';

export default class ValidationError extends APIError {
  constructor(validationErrors) {
    super('INVALID_REQUEST');
    this.validationErrors = validationErrors;
  }

  getErrorDetails() {
    return { ...super.getErrorDetails(), validationErrors: this.validationErrors };
  }
}
