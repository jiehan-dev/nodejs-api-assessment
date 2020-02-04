const express = require('express');

const models = require('../database/models');
const adminController = require('../controllers/adminController');

const router = express.Router();
const controller = adminController(models);

router.post('/register', controller.register);

router.get('/commonstudents', (req, res) => {
  res.status(500).send('Some meaningful error message');
});

// router.get('/teachers', (req, res) => {
// //   models.teacher
// //     .findAll()
// //     .then((teachers) => {
// //       console.log(teachers);
// //       res.sendStatus(200);
// //     })
// //     .catch((err) => console.log(err));
//   //   res.status(500).send('Some meaningful error message');
// });

router.post('/suspend', (req, res) => {
  res.sendStatus(204);
});

router.post('/retrievefornotifications', (req, res) => {
  res.end();
});

module.exports = router;
