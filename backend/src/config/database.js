const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  logging: false
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established');
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });

module.exports = sequelize;