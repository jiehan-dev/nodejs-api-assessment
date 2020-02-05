const express = require('express');

const Teacher = require('../database/models/Teacher');
const Student = require('../database/models/Student');
const TeacherStudentRegistry = require('../database/models/TeacherStudentRegistry');
const adminController = require('../controllers/adminController');

const controller = adminController({ Teacher, Student, TeacherStudentRegistry });

const router = express.Router();

router.post('/register', controller.register);

router.get('/commonstudents', controller.commonStudents);

router.post('/suspend', controller.suspend);

router.post('/retrievefornotifications', controller.retrieveForNotifications);

module.exports = router;
