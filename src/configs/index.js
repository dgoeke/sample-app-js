import dotenv from 'dotenv';
import CommonConfig from './common';
import log from '../util/logger';

dotenv.config({ silent: true });

const getEnvironment = () => process.env.NODE_ENV;
const isEnvironment = environment => getEnvironment() === environment;
const isLocal = () => isEnvironment('localhost');
const isDev = () => isEnvironment('development');
const isProduction = () => isEnvironment('production');

if (!process.env.NODE_ENV) {
  log.error(`The 'NODE_ENV' environment variable is not set. A valid value is required to load the application configuration.`);
  process.exit(1);
}

log.info(`Loading '${process.env.NODE_ENV}' environment configuration.`);

let environmentConfig;
try {
  environmentConfig = require(`./${process.env.NODE_ENV}`); // eslint-disable-line global-require, import/no-dynamic-require
} catch (err) {
  log.error(`Unrecognized NODE_ENV: ${process.env.NODE_ENV}`);
  process.exit(1);
}

const config = { ...CommonConfig, ...environmentConfig };

export default {
  getEnvironment,
  isEnvironment,
  isLocal,
  isDev,
  isProduction,
  ...config
};
