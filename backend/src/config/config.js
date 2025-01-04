require('dotenv').config({ path: '../.env' });

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'pran2401',
    database: process.env.DB_NAME || 'teletrack_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectOptions: {
      // Add this configuration for MySQL 8
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
};