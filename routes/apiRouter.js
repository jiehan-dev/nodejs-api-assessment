const express = require('express');

const Teacher = require('../database/models/Teacher');
const Student = require('../database/models/Student');
const TeacherStudentRegistry = require('../database/models/TeacherStudentRegistry');

const adminController = require('../controllers/adminController');

const router = express.Router();
const controller = adminController({ Teacher, Student, TeacherStudentRegistry });

router.post('/register', async (req, res) => {
  let teacherEmail = req.body.teacher;
  let studentEmails = req.body.students;

  console.log(teacherEmail);
  console.log(studentEmails);

  if (!teacherEmail) {
    return res.status(500).json({ message: 'Please provide a valid teacher email' });
  }

  if (!studentEmails) {
    return res.status(500).json({ message: 'Please provide atleast one valid student email' });
  }

  teacherEmail = teacherEmail.trim().toLowerCase();

  const [teacher, created] = await Teacher.findOrCreate({
    where: { email: teacherEmail }
  });

  console.log(teacher.email);
  console.log(created);

  return res.sendStatus(204);
});

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
