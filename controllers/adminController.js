function adminController(models) {
  async function register(req, res) {
    try {
      const teacherEmail = req.body.teacher;
      const studentEmails = req.body.students;

      // Create teacher if not exist
      const [teacher] = await models.Teacher.findOrCreate({
        where: { email: teacherEmail.trim().toLowerCase() }
      });

      // Create students if not exist
      const students = await Promise.all(
        studentEmails.map(async (e) => {
          const [student] = await models.Student.findOrCreate({
            where: { email: e.trim().toLowerCase() }
          });

          return student;
        })
      );

      teacher.addStudents(students);

      res.status(204);
      res.end();
    } catch (err) {
      res.status(500);
      res.json({ message: err.message });
    }
  }

  async function suspend(req, res) {
    try {
      const studentEmail = req.body.student;

      const student = await models.Student.findOne({
        where: { email: studentEmail.trim().toLowerCase() }
      });

      if (!student) {
        res.status(404);
        res.json({ message: `Specified student '${studentEmail}' not found` });
        return;
      }

      if (!student.suspend) {
        await student.update({
          suspend: true
        });
      }

      res.status(204);
      res.end();
    } catch (err) {
      res.status(500);
      res.json({ message: err.message });
    }
  }

  async function commonStudents(req, res) {
    try {
      const teacherEmails = Array.isArray(req.query.teacher)
        ? req.query.teacher
        : [req.query.teacher];

      const teachers = await Promise.all(
        teacherEmails.map(async (e) => {
          const teacher = await models.Teacher.findOne({
            where: { email: e },
            include: models.Student
          });
          return { email: e, teacher };
        })
      );

      const teacherNotFoundMsg = teachers
        .filter((t) => t.teacher == null)
        .map((t) => `Specified teacher '${t.email}' not found`)
        .join(', ');

      if (teacherNotFoundMsg) {
        res.status(404);
        res.json({ message: teacherNotFoundMsg });
        return;
      }

      const studentEmailsList = teachers
        .filter((t) => t.teacher.students != null && t.teacher.students.length > 0)
        .map((t) => t.teacher.students.map((s) => s.email));

      let result = studentEmailsList[0];

      for (let i = 1; i < studentEmailsList.length; i += 1) {
        result = result.filter((x) => studentEmailsList[i].indexOf(x) !== -1);
      }

      res.status(200);
      res.json({ students: result });
    } catch (err) {
      res.status(500);
      res.json({ message: err.message });
    }
  }

  async function retrieveForNotifications(req, res) {
    try {
      const { teacher: teacherEmail, notification } = req.body;

      const [teacher] = await models.Teacher.findOrCreate({
        where: { email: teacherEmail.trim().toLowerCase() },
        include: models.Student
      });

      let registeredStudents = [];

      if (teacher.students) {
        registeredStudents = teacher.students.filter((s) => !s.suspend).map((s) => s.email);
      }

      const re = /(?<=^@|\s@)(\w+@[^\s@]+)(?=\s|$)/g;
      const taggedStudentEmails = notification.match(re);

      if (taggedStudentEmails) {
        const taggedStudents = await Promise.all(
          taggedStudentEmails.map(async (e) => {
            const [student] = await models.Student.findOrCreate({
              where: { email: e.trim().toLowerCase() }
            });

            return student;
          })
        );

        const validTaggedStudentEmails = taggedStudents
          .filter((s) => !s.suspend)
          .map((s) => s.email);

        registeredStudents = Array.from(
          new Set(registeredStudents.concat(validTaggedStudentEmails))
        );
      }

      res.status(200);
      res.json({ recipients: registeredStudents });
    } catch (err) {
      res.status(500);
      res.json({ message: err.message });
    }
  }

  return {
    register,
    suspend,
    commonStudents,
    retrieveForNotifications
  };
}

module.exports = adminController;
