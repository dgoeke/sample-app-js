import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { isCelebrate } from 'celebrate';
import path from 'path';

import log from './util/logger';
import config from './configs';
import routes from './routes';
import { APIError, ValidationError } from './errors';

const { errorHandling, frontendUrl } = config;

const app = express();

const options = {
  origin: frontendUrl,
  credentials: true // allow cookies with cors
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(options));

// Mount all routes to '/api' path.
app.use('/cms-cloud/api', routes);
app.use('/static',express.static('static'));
app.use('/dist',express.static('dist'));

// If error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (isCelebrate(err) || err.isJoi) {
    const validationErrors = err.details.map(error => error.message);
    const error = new ValidationError(validationErrors);
    return next(error);
  }

  if (!(err instanceof APIError)) {
    const apiError = new APIError('ERROR', null, err.stack);
    return next(apiError);
  }
  return next(err);
});

// Catch 404's and forward to error handler.
app.use((req, res, next) => {
  const err = new APIError('NOT_FOUND');
  return next(err);
});

// Error handler, include stacktrace only if configured to do so.
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const printStackTrace = errorHandling.includeStackTrace;
  log.error({ err, validationErrors: err.validationErrors });
  if (printStackTrace && err.stack) {
    log.error({ stackTrace: err.stack });
  }
  return res.status(err.httpStatus).json({ ...err.getErrorDetails(), ...printStackTrace && { stack: err.stack } });
});

export default app;
