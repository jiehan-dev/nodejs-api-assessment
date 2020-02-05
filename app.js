const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log('Starting...');
const db = require('./database/database');

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // return db.sync({ force: true });
    return db.sync();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  })
  .then(() => console.log('db synced'));

app.use('/api', require('./routes/apiRouter'));

const env = process.env.NODE_ENV || 'development';
app.get('/', (req, res) => res.send('NodeJS API Assessment ' + env.toUpperCase()));

const port = process.env.PORT || 3000;

app.server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app; // to run test
