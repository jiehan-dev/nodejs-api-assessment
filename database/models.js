const Sequelize = require('sequelize');
const db = require('../database/database');

const teacher = db.define('teacher', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
});

const student = db.define('student', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  suspend: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

teacher.belongsToMany(student, { through: 'teacher_student_registry' });
student.belongsToMany(teacher, { through: 'teacher_student_registry' });

const models = {
  Teacher: teacher,
  Student: student
};

module.exports = models;
