const { config } = require('./index');

module.exports = {
  development: {
    url: config.database.url,
    dialect: 'mysql',
    logging: false,
  },
  test: {
    url: config.database.url,
    dialect: 'mysql',
    logging: false,
  },
  production: {
    url: config.database.url,
    dialect: 'mysql',
    logging: false,
  },
};
