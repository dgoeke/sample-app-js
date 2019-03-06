import HTTPStatus from 'http-status';

export default {
  INVALID_REQUEST: {
    message: 'Request was invalid',
    httpStatus: HTTPStatus.BAD_REQUEST
  },
  NOT_FOUND: {
    message: 'Requested resource was not found',
    httpStatus: HTTPStatus.NOT_FOUND
  },
  UNAUTHORIZED: {
    message: 'Access denied',
    httpStatus: HTTPStatus.UNAUTHORIZED
  },
  FORBIDDEN: {
    message: 'Access to requested resource was forbidden',
    httpStatus: HTTPStatus.FORBIDDEN
  },
  ERROR: {
    message: 'An error occurred while executing request',
    httpStatus: HTTPStatus.INTERNAL_SERVER_ERROR
  },
  VALIDATION_ERROR: {
    message: 'Request was invalid',
    httpStatus: HTTPStatus.BAD_REQUEST
  },
  USER_NOT_FOUND: {
    message: 'Specified user was not found',
    httpStatus: HTTPStatus.NOT_FOUND
  }
};
