module.exports = {
  errorHandling: {
    includeStackTrace: true
  },
  dataSources: {
    postgres: {
      db: 'cms-cloud-db',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      options: {
        operatorsAliases: false,
        logging: false,
        dialect: 'postgres',
        host: 'cms-cloud-db',
        port: 5432,
        pool: {
          max: 20,
          idle: 30000,
        }
      }
    }
  },
  sequelize: {
    seederStorage: 'sequelize'
  },
  frontendUrl: 'http://localhost:3000',
  documentation: {
    host: 'localhost:5200',
    basePath: '/cms-cloud/api'
  }
};
