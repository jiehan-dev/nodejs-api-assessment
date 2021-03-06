const fs = require('fs');

const { Sequelize } = require('sequelize');
const { dbConfig } = require('../config/config');

let dialectOptions = {};
if (dbConfig.sslFilePath) {
  dialectOptions = {
    ssl: {
      ca: fs.readFileSync(dbConfig.sslFilePath)
    }
  };
}

const db = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false
  },
  dialectOptions
});

module.exports = db;
