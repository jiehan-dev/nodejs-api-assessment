const express = require('express');
const db = require('./database/database');

(async () => {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    await db.sync({ force: process.env.DB_RESET_ON_LOAD || false });
    console.log('db synced');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', require('./routes/apiRouter'));

const env = process.env.NODE_ENV || 'development';
app.get('/', (req, res) => res.send(`NodeJS API Assessment ${env}`.toUpperCase()));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
