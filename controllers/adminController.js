function adminController(models) {
  async function register(req, res) {
    // Validation
    if (!req.body.teacher) return res.status(500).send('Meaning Error');
    if (!req.body.students) return res.status(500).send('Meaning Error');

    const [teacher, created] = await models.Teacher.findOrCreate({
      where: { email: req.body.teacher }
    });

    // console.log(teacher.email);
    // console.log(created);

    const studentBulk = req.body.students.map((e) => ({ email: e }));

    const students = await models.Student.bulkCreate(studentBulk, {
      validate: true,
      fields: ['email']
    });

    console.log(students[0]);

    // models.teacher.create({ email: req.body.teacher });

    return res.sendStatus(204);
  }

  return { register };
}

module.exports = adminController;
