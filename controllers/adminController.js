function adminController(models) {
  async function register(req, res) {
    let teacherEmail = req.body.teacher;
    let studentEmails = req.body.students;

    if (!teacherEmail) {
      return res.status(500).json({ message: 'Please provide a valid teacher email' });
    }

    if (!studentEmails) {
      return res.status(500).json({ message: 'Please provide atleast one valid student email' });
    }

    teacherEmail = teacherEmail.trim().toLowerCase();
    studentEmails = studentEmails.map((e) => e.trim().toLowerCase());

    // Create teacher if not exist
    const [teacher] = await models.Teacher.findOrCreate({
      where: { email: teacherEmail }
    });

    // Create students if not exist
    const students = await Promise.all(
      studentEmails.map(async (e) => {
        const [student] = await models.Student.findOrCreate({ where: { email: e } });

        return student;
      })
    );

    teacher.addStudents(students);

    return res.sendStatus(204);
  }

  async function suspend(req, res) {
    let studentEmail = req.body.student;

    if (!studentEmail) {
      res.status(400).json({ message: 'Please provide a valid student email' });
      return;
    }

    studentEmail = studentEmail.trim().toLowerCase();

    const student = await models.Student.findOne({
      where: { email: studentEmail }
    });

    if (!student) {
      res.status(404).json({ message: `Specified student '${studentEmail}' not found` });
      return;
    }

    if (!student.suspend) {
      await student.update({
        suspend: true
      });
    }

    res.sendStatus(204);
  }

  async function commonStudents(req, res) {
    if (!req.query.teacher) {
      res.status(200).json({ students: [] });
      return;
    }

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
      .map((t) => `Specified teacher '${t.email} not found'`)
      .join(', ');

    if (teacherNotFoundMsg) {
      res.status(404).json({ message: teacherNotFoundMsg });
      return;
    }

    const studentEmailsList = teachers
      .filter((t) => t.teacher.students != null && t.teacher.students.length > 0)
      .map((t) => t.teacher.students.map((s) => s.email));

    let result = studentEmailsList[0];

    for (let i = 1; i < studentEmailsList.length; i += 1) {
      result = result.filter((x) => studentEmailsList[i].indexOf(x) !== -1);
    }

    res.status(200).json({ students: result });
  }

  async function retrieveForNotifications(req, res) {
    const { teacher: teacherEmail, notification } = req.body;

    if (!teacherEmail) {
      res.status(400).json({ message: 'Please provide a valid teacher email' });
      return;
    }

    const [teacher] = await models.Teacher.findOrCreate({
      where: { email: teacherEmail.trim().toLowerCase() },
      include: models.Student
    });

    if (!teacher) {
      res.status(404).json({ message: `Specified teacher '${teacherEmail} not found` });
      return;
    }

    let registeredStudents = teacher.students.filter((s) => !s.suspend).map((s) => s.email);

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

      const validTaggedStudentEmails = taggedStudents.filter((s) => !s.suspend).map((s) => s.email);

      registeredStudents = Array.from(new Set(registeredStudents.concat(validTaggedStudentEmails)));
    }

    res.status(200).json({ recipients: registeredStudents });
  }

  return {
    register,
    suspend,
    commonStudents,
    retrieveForNotifications
  };
}

module.exports = adminController;
