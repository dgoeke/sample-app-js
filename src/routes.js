import express from 'express';

import requestLogger from './middleware/requestLogger';

// import log from './util/logger';

import ResourceRoutes from './api/resource/resource-routes';

const router = express.Router();

const routes = [
  ResourceRoutes,
];

router.use('/', requestLogger, ...routes);

export default router;
