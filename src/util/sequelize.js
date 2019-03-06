import pg from 'pg';
import Sequelize from 'sequelize';
// import log from './logger';
import config from '../configs';

const { db, username, password, options } = config.dataSources.postgres;

// Ensures sequelize 'count' function returns count as integer rather than string
// See: https://github.com/sequelize/sequelize/issues/2383#issuecomment-58006083
pg.defaults.parseInt8 = true;

const sequelize = new Sequelize(db, username, password, options);

export default sequelize;
