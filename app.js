const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const env = process.env.NODE_ENV || 'development';

const db = require('./database/database');

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

    // return db.sync({ force: env === 'development' });
    return db.sync();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  })
  .then(() => console.log('db sync'));

app.use('/api', require('./routes/apiRouter'));

app.get('/', (req, res) => res.send('NodeJS API Assessment'));

const port = process.env.PORT || 3000;

app.server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app; // to run test
