const path = require('path');

const config = {};

process.env.NODE_ENV = 'staging';

const env = process.env.NODE_ENV || 'development';

if (env === 'staging') {
  config.dbConfig = {
    host: process.env.DB_HOST || 'govtech-demo.mysql.database.azure.com',
    username: process.env.DB_USERNAME || 'jiehan@govtech-demo',
    password: process.env.DB_PASSWORD || 'q1w2e3r4Q!W@E#R$',
    database: process.env.DB_DATABASE || 'govtech_assessment_staging',
    sslFilePath: path.join(__dirname, 'ssl', 'BaltimoreCyberTrustRoot.crt.pem')
  };
} else {
  config.dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'q1w2e3r4Q!W@E#R$',
    database: process.env.DB_DATABASE || 'govtech_assessment_dev'
  };
}

module.exports = config;
