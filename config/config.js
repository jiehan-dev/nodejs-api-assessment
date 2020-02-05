const config = {};

// database config
config.dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'q1w2e3r4Q!W@E#R$',
  database: process.env.DB_DATABASE || 'govtech_assessment_dev'
};

module.exports = config;
