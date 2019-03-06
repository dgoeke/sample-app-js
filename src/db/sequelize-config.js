require('dotenv').config();
require('babel-core/register');

const config = require('./../configs');

const environment = config.getEnvironment();
const dbConfig = config.dataSources.postgres;

const envConfig = {
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.db,
  host: dbConfig.options.host,
  port: dbConfig.options.port,
  dialect: dbConfig.options.dialect,
  dialectOptions: dbConfig.options.dialectOptions
};

if (config.sequelize && config.sequelize.seederStorage) {
  envConfig.seederStorage = config.sequelize.seederStorage;
}

const sequelizeConfig = {
  [environment]: envConfig
};

module.exports = sequelizeConfig;
