import log from '../util/logger';

export default async (req, res, next) => {
  // create a child logger as needed with common api context
  const requestLogger = log.child({ user: req.user });
  req.log = requestLogger;
  next();
};
