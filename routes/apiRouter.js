const express = require('express');
const { check, validationResult } = require('express-validator');

const Teacher = require('../database/models/Teacher');
const Student = require('../database/models/Student');
const TeacherStudentRegistry = require('../database/models/TeacherStudentRegistry');
const adminController = require('../controllers/adminController');

const controller = adminController({ Teacher, Student, TeacherStudentRegistry });

const router = express.Router();

const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errorMsg = result.errors.map((e) => `The field for '${e.param}' ${e.msg}.`).join(' ');

  return res.status(400).json({ message: errorMsg });
};

const registerValidation = [
  check('teacher')
    .notEmpty()
    .withMessage('cannot be null or empty')
    .isEmail()
    .withMessage('must be a valid email'),
  check('students')
    .isArray()
    .withMessage('must be of type array')
    .notEmpty()
    .withMessage('cannot be null or empty')
];

const suspendValidation = [
  check('student')
    .notEmpty()
    .withMessage('cannot be null or empty')
    .isEmail()
    .withMessage('must be a valid email')
];

const commonStudentsValidation = [
  check('teacher')
    .notEmpty()
    .withMessage('cannot be null or empty')
];

const retrieveForNotificationsValidation = [
  check('teacher')
    .notEmpty()
    .withMessage('cannot be null or empty')
    .isEmail()
    .withMessage('must be a valid email'),
  check('notification')
    .notEmpty()
    .withMessage('cannot be null or empty')
];

router.post('/register', validate(registerValidation), controller.register);

router.get('/commonstudents', validate(commonStudentsValidation), controller.commonStudents);

router.post('/suspend', validate(suspendValidation), controller.suspend);

router.post(
  '/retrievefornotifications',
  validate(retrieveForNotificationsValidation),
  controller.retrieveForNotifications
);

module.exports = router;
